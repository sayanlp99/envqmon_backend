
#!/bin/bash
#-----------------------------------------------------------#
# authentication_service
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
#-----------------------------------------------------------#
# user_service
    curl -X GET http://localhost:3002/api/users
#-----------------------------------------------------------#
# device_service
    curl -X POST http://localhost:3004/api/devices \
    -H "Content-Type: application/json" \
    -d '{
        "device_name": "Sensor B",
        "device_imei": "1234565349012345",
        "room_id": "11111111-1111-1111-1111-111111111111",
        "created_by": "22222222-2222-2222-2222-222222222222",
        "is_active": true,
        "metadata": {
        "location": "Room 101"
        }
    }'
    curl http://localhost:3004/api/devices
#-----------------------------------------------------------#
# device_data_service
#-----------------------------------------------------------#
#home
#-----------------------------------------------------------#