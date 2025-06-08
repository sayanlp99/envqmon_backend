curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sayan Chakraborty",
    "email": "sayan@example.com",
    "password": "testpassword"
}'
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sayan@example.com",
    "password": "testpassword"
}'
curl -X GET http://localhost:3002/api/auth/users
curl -X PUT http://localhost:3002/api/auth/users/11111111-1111-1111-1111-111111111111 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Name",
    "email": "user@mail.com",
    "password": "newpassword",
    "is_active": true,
    "role": "user"
}'