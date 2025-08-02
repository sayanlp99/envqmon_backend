from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.responses import JSONResponse
from httpx import AsyncClient, HTTPStatusError
from typing import Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL")
HOME_SERVICE_URL = os.getenv("HOME_SERVICE_URL")
DEVICE_SERVICE_URL = os.getenv("DEVICE_SERVICE_URL")
DEVICE_DATA_SERVICE_URL = os.getenv("DEVICE_DATA_SERVICE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "86400"))

app = FastAPI(
    title="EnvQmon Microservices API Gateway",
    description="Gateway for Authentication, Home, Device, and Device Data services.",
    version="1.0.0",
    docs_url=None,
    redoc_url="/docs",
    contact={
        "name": "Sayan Chakraborty",
        "email": "sayan.chakraborty1999@gmail.com",
    },
    license_info={
        "name": "MIT License",
        "url": "https://opensource.org/licenses/MIT",
    },
)


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
    token = token.split(" ")[1]

    payload = decode_access_token(token)
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    # You might want to fetch user details from authentication service here
    # to ensure the user still exists and is active, but for simplicity,
    # we'll trust the token's payload for now.

    # fetch user role also
    # This is optional, but you can include more user details if needed
    # For example, if your auth service returns user roles or other claims:
    if "role" in payload:
        user_role = payload.get("role")
    else:
        user_role = "user"

    return {"user_id": user_id, "email": payload.get("email"), "role": user_role}


client = AsyncClient(timeout=30.0)

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

    headers = {k: v for k, v in request.headers.items() if k.lower() not in ["host", "authorization"]}

    if authenticated_user:
        headers["X-Authenticated-User-ID"] = authenticated_user["user_id"]
        headers["X-Authenticated-User-Email"] = authenticated_user["email"]

    request_body = await request.body()
    if not request_body:
        request_body = None

    try:
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            params=request.query_params,
            content=request_body,
        )
        response.raise_for_status()
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

@app.post("/api/auth/register")
async def register_user(request: Request):
    """Registers a new user via the authentication service."""
    return await forward_request(request, AUTH_SERVICE_URL, "/api/auth/register")

@app.post("/api/auth/login")
async def login_user(request: Request):
    """
    Logs in a user via the authentication service and issues a JWT token
    from the API Gateway upon successful authentication.
    """
    login_response_from_auth_service = await client.request(
        method=request.method,
        url=f"{AUTH_SERVICE_URL}/api/auth/login",
        headers={k: v for k, v in request.headers.items() if k.lower() not in ["host"]},
        content=await request.body()
    )
    login_response_from_auth_service.raise_for_status() # Raise for HTTP errors

    user_info = login_response_from_auth_service.json() # Parse the JSON response from auth service

    user_id = user_info.get("user_id")
    user_email = user_info.get("email")
    user_role = user_info.get("role", "user")

    if not user_id or not user_email:
        if "token" in user_info and "user_id" in user_info:
                raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication service returned a direct token instead of user info. Ensure your auth service returns user details, not a JWT for the gateway to issue its own."
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service did not return expected user info (id, email)."
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user_id, "email": user_email, "role": user_role}, expires_delta=access_token_expires
    )

    user_info = {
        "user_id": user_id,
        "email": user_email,
        "name": user_info.get("name", "Unknown User"),
        "roles": user_info.get("roles", []),
        "is_active": user_info.get("is_active", True),
    }

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
    if current_user.get("role") != "admin":
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
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this user."
        )
    return await forward_request(request, AUTH_SERVICE_URL, f"/api/auth/users/{user_id}", current_user)

@app.post("/api/homes")
async def create_home(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Creates a new home. Requires authentication."""
    print(f"Authenticated user creating home: {current_user}")
    return await forward_request(request, HOME_SERVICE_URL, "/api/homes", current_user)

@app.get("/api/homes")
async def get_all_homes(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves all rooms. Requires authentication."""
    print(f"Authenticated user getting all rooms: {current_user}")
    if current_user.get("role") != "admin":
        return await forward_request(request, HOME_SERVICE_URL, f"/api/homes/user/{current_user.get('user_id')}", current_user)
    else:
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
    if current_user.get("role") != "admin":
        return await forward_request(request, HOME_SERVICE_URL, f"/api/rooms/user/{current_user.get('user_id')}", current_user)
    else:
        return await forward_request(request, HOME_SERVICE_URL, "/api/rooms", current_user)

@app.post("/api/devices")
async def create_device(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Creates a new device. Requires authentication."""
    print(f"Authenticated user creating device: {current_user}")
    return await forward_request(request, DEVICE_SERVICE_URL, "/api/devices", current_user)

@app.get("/api/devices")
async def get_all_devices(request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieves all devices. Requires authentication."""
    print(f"Authenticated user getting all devices: {current_user}")
    if current_user.get("role") != "admin":
        return await forward_request(request, DEVICE_SERVICE_URL, f"/api/devices/user/{current_user.get('user_id')}", current_user)
    else:
        return await forward_request(request, DEVICE_SERVICE_URL, "/api/devices", current_user)

@app.get("/api/data/range")
async def get_device_data_range(
    device_id: str,
    from: int,
    to: int,
    request: Request,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Retrieves device data within a specific time range.
    Requires authentication.
    """
    print(f"Authenticated user getting device data range for {device_id}: {current_user}")
    path = f"/api/data/range?device_id={device_id}&from={from}&to={to}"
    return await forward_request(request, DEVICE_DATA_SERVICE_URL, path, current_user)

@app.get("/api/data/latest/{device_id}")
async def get_latest_device_data(device_id: str, request: Request, current_user: Dict[str, Any] = Depends(get_current_user)):
    """
    Retrieves the latest data for a specific device.
    Requires authentication.
    """
    print(f"Authenticated user getting latest device data for {device_id}: {current_user}")
    return await forward_request(request, DEVICE_DATA_SERVICE_URL, f"/api/data/latest/{device_id}", current_user)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
