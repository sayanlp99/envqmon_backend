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