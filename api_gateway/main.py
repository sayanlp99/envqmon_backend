import os
from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from httpx import AsyncClient, HTTPStatusError
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone

# For JWT (JSON Web Tokens)
from jose import JWTError, jwt

# --- Configuration ---
# You would typically load these from environment variables or a configuration file
# For this example, they are hardcoded.
# >>> VERIFY THIS URL. IT MUST POINT TO YOUR AUTHENTICATION MICROSERVICE. <<<
AUTH_SERVICE_URL = "http://localhost:3001" # Or "http://192.168.10.27:3001" if auth service is there
HOME_SERVICE_URL = "http://localhost:3002"
DEVICE_SERVICE_URL = "http://localhost:3003"
DEVICE_DATA_SERVICE_URL = "http://localhost:3004"

# JWT configuration for the API Gateway itself
# IMPORTANT: Change this secret key in a production environment!
SECRET_KEY = "your-super-secret-key-for-jwt-signing"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

app = FastAPI(
    title="Microservices API Gateway",
    description="Gateway for Authentication, Home, Device, and Device Data services.",
    version="1.0.0",
)

# --- Utility Functions for JWT ---

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Creates a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    """Decodes and validates a JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

# --- Dependency to get current authenticated user ---

async def get_current_user(request: Request):
    """
    Extracts and validates the JWT from the Authorization header.
    Returns the user payload if valid, otherwise raises HTTPException.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise credentials_exception
    token = token.split(" ")[1] # Remove "Bearer " prefix

    payload = decode_access_token(token)
    user_id: str = payload.get("sub") # 'sub' is typically used for the subject (e.g., user ID)
    if user_id is None:
        raise credentials_exception
    # You might want to fetch user details from authentication service here
    # to ensure the user still exists and is active, but for simplicity,
    # we'll trust the token's payload for now.
    return {"user_id": user_id, "email": payload.get("email")} # Return relevant user info

# --- Global HTTP Client ---
# Using AsyncClient for making asynchronous HTTP requests to microservices
# This client will be reused for all requests to improve performance.
client = AsyncClient(timeout=30.0) # Set a reasonable timeout

# --- Helper Function for Request Forwarding ---

async def forward_request(
    request: Request,
    service_url: str,
    path: str,
    authenticated_user: Optional[Dict[str, Any]] = None
):
    """
    Forwards the incoming request to the specified microservice.
    Includes current user info in a custom header for downstream services if available.
    """
    target_url = f"{service_url}{path}"
    print(f"Forwarding {request.method} {request.url.path} to {target_url}")

    # Prepare headers for forwarding
    headers = {k: v for k, v in request.headers.items() if k.lower() not in ["host", "authorization"]}

    # Add authenticated user info to headers if present
    if authenticated_user:
        # It's good practice to pass a JSON string for complex objects in headers
        headers["X-Authenticated-User-ID"] = authenticated_user["user_id"]
        headers["X-Authenticated-User-Email"] = authenticated_user["email"]
        # Add other user claims as needed, e.g., roles

    # Read the request body as bytes, if available
    request_body = await request.body()
    if not request_body:
        request_body = None

    try:
        # Perform the HTTP request to the microservice
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            params=request.query_params,
            content=request_body,
        )
        response.raise_for_status() # Raise an exception for 4xx/5xx responses
        return JSONResponse(content=response.json(), status_code=response.status_code)
    except HTTPStatusError as e:
        print(f"Microservice error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=e.response.json() if e.response.content else e.response.text,
        )
    except Exception as e:
        print(f"Gateway error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error communicating with backend service: {e}",
        )

# --- Routes for Authentication Service ---

@app.post("/api/auth/register")
async def register_user(request: Request):
    """Registers a new user via the authentication service."""
    # This endpoint does not require authentication on the gateway
    # It simply forwards the registration request.
    return await forward_request(request, AUTH_SERVICE_URL, "/api/auth/register")

@app.post("/api/auth/login")
async def login_user(request: Request):
    """
    Logs in a user via the authentication service and issues a JWT token
    from the API Gateway upon successful authentication.
    """
    # Forward login request to auth service
    login_response_from_auth_service = await client.request(
        method=request.method,
        url=f"{AUTH_SERVICE_URL}/api/auth/login",
        headers={k: v for k, v in request.headers.items() if k.lower() not in ["host"]},
        content=await request.body()
    )
    login_response_from_auth_service.raise_for_status() # Raise for HTTP errors

    # If login was successful, the auth service returns user data
    user_info = login_response_from_auth_service.json() # Parse the JSON response from auth service

    # Extract user ID and email from the response
    user_id = user_info.get("user_id") # Assuming the auth service returns 'id'
    user_email = user_info.get("email") # Assuming the auth service returns 'email'

    if not user_id or not user_email:
        # If the auth service returned a 'token' directly (as you observed), this would be the issue
        # Let's add a more specific check/error here.
        if "token" in user_info and "user_id" in user_info: # Heuristic: if it looks like your auth service's direct token response
                raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication service returned a direct token instead of user info. Ensure your auth service returns user details, not a JWT for the gateway to issue its own."
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service did not return expected user info (id, email)."
        )

    # Create a JWT token for the client based on the authenticated user
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id, "email": user_email}, expires_delta=access_token_expires
    )

    user_info = {
        "user_id": user_id,
        "email": user_email,
        "name": user_info.get("name", "Unknown User"),
        "roles": user_info.get("roles", []), 
        "is_active": user_info.get("is_active", True),
    }

    # Return the JWT token to the client
    return JSONResponse(
        content={
            "message": "Login successful",
            "access_token": access_token,
            "user": user_info 
        },
        status_code=status.HTTP_200_OK
    )


@app.get("/api/auth/users")
async def get_all_users(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Retrieves all users from the authentication service.
    Requires authentication via API Gateway's JWT.
    this will be restricted to users whose role will be admin only.
    """
    print(f"Authenticated user accessing /api/auth/users: {current_user}")
    if current_user.get("role", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this user."
        )
    return await forward_request(request, AUTH_SERVICE_URL, "/api/auth/users", current_user)

@app.put("/api/auth/users/{user_id}")
async def update_user(user_id: str, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Updates a specific user's details via the authentication service.
    Requires authentication. A user can typically only update their own profile,
    or an admin can update any profile.
    """
    print(f"Authenticated user updating user {user_id}: {current_user}")
    # Optional: Add authorization logic here (e.g., current_user["role"] == admin)
    if current_user.get("role", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this user."
        )
    # Forward the request to the auth service
    return await forward_request(request, AUTH_SERVICE_URL, f"/api/auth/users/{user_id}", current_user)

# --- Routes for Home Service ---

@app.post("/api/homes")
async def create_home(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Creates a new home. Requires authentication."""
    print(f"Authenticated user creating home: {current_user}")
    return await forward_request(request, HOME_SERVICE_URL, "/api/homes", current_user)

@app.get("/api/homes/{home_id}")
async def get_home_by_id(home_id: str, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves a specific home by ID. Requires authentication."""
    print(f"Authenticated user getting home {home_id}: {current_user}")
    return await forward_request(request, HOME_SERVICE_URL, f"/api/homes/{home_id}", current_user)

@app.post("/api/rooms")
async def create_room(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Creates a new room. Requires authentication."""
    print(f"Authenticated user creating room: {current_user}")
    return await forward_request(request, HOME_SERVICE_URL, "/api/rooms", current_user)

@app.get("/api/rooms")
async def get_all_rooms(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves all rooms. Requires authentication."""
    print(f"Authenticated user getting all rooms: {current_user}")
    return await forward_request(request, HOME_SERVICE_URL, "/api/rooms", current_user)

# --- Routes for Device Service ---

@app.post("/api/devices")
async def create_device(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Creates a new device. Requires authentication."""
    print(f"Authenticated user creating device: {current_user}")
    return await forward_request(request, DEVICE_SERVICE_URL, "/api/devices", current_user)

@app.get("/api/devices")
async def get_all_devices(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves all devices. Requires authentication."""
    print(f"Authenticated user getting all devices: {current_user}")
    return await forward_request(request, DEVICE_SERVICE_URL, "/api/devices", current_user)

# --- Routes for Device Data Service ---

@app.get("/api/data/range")
async def get_device_data_range(
    device_id: str,
    from_timestamp: int,
    to_timestamp: int,
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Retrieves device data within a specific time range.
    Requires authentication.
    """
    print(f"Authenticated user getting device data range for {device_id}: {current_user}")
    # We pass query parameters explicitly here as they are part of the function signature
    # and also to be explicit about them. The forward_request also handles them.
    path = f"/api/data/range?device_id={device_id}&from={from_timestamp}&to={to_timestamp}"
    return await forward_request(request, DEVICE_DATA_SERVICE_URL, path, current_user)

@app.get("/api/data/latest/{device_id}")
async def get_latest_device_data(device_id: str, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Retrieves the latest data for a specific device.
    Requires authentication.
    """
    print(f"Authenticated user getting latest device data for {device_id}: {current_user}")
    return await forward_request(request, DEVICE_DATA_SERVICE_URL, f"/api/data/latest/{device_id}", current_user)

# --- Main entry point for running the app ---
if __name__ == "__main__":
    import uvicorn
    # To run this API Gateway:
    # 1. Save the code as a Python file (e.g., `gateway.py`).
    # 2. Make sure your microservices (authentication_service, home_service, etc.)
    #    are running on the specified ports (3001, 3002, 3003, 3004).
    # 3. Install necessary libraries: `pip install fastapi uvicorn httpx python-jose[cryptography] passlib[bcrypt]`
    # 4. Run from your terminal: `uvicorn gateway:app --reload --port 3000` # Changed to 3000 as per user
    #    The gateway will then be accessible at http://localhost:3000
    uvicorn.run(app, host="0.0.0.0", port=3000)
