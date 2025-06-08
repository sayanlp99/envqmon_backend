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
curl -X GET http://localhost:3001/api/auth/users
curl -X PUT http://localhost:3001/api/auth/users/33cfd414-3afc-4e28-a539-5782222639e5 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Name",
    "email": "user@mail.com",
    "password": "newpassword",
    "is_active": true
}'