
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
    curl -X GET http://localhost:3001/api/auth/users
    curl -X PUT http://localhost:3001/api/auth/users/33cfd414-3afc-4e28-a539-5782222639e5 \
    -H "Content-Type: application/json" \
    -d '{
        "name": "User Name",
        "email": "user@mail.com",
        "password": "newpassword",
        "is_active": true
    }'
#-----------------------------------------------------------#
#home_service
    curl -X POST http://localhost:3003/api/homes \
    -H "Content-Type: application/json" \
    -d '{
        "home_name": "Sayan Residence",
        "user_id": "11111111-1111-1111-1111-111111111111",
        "address": "Kolkata"
    }'
    curl http://localhost:3003/api/homes/1bada3d2-5ce2-420c-8694-ae4c265548c4
    curl -X POST http://localhost:3003/api/rooms \
    -H "Content-Type: application/json" \
    -d '{
        "room_name": "Bedroom",
        "type": "Living",
        "home_id": "1bada3d2-5ce2-420c-8694-ae4c265548c4"
    }'
    curl http://localhost:3003/api/rooms
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
    curl "http://localhost:3005/api/data/range?device_id=c8f7d435-09cd-41a2-982f-b57b46075c8a&from=1704067200&to=1735670399"
    curl http://localhost:3005/api/data/latest/c8f7d435-09cd-41a2-982f-b57b46075c8a
#-----------------------------------------------------------#