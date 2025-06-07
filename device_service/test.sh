curl -X POST http://localhost:3003/api/devices \
  -H "Content-Type: application/json" \
  -d '{
    "device_name": "Sensor A",
    "device_imei": "123456789012345",
    "room_id": "11111111-1111-1111-1111-111111111111",
    "created_by": "22222222-2222-2222-2222-222222222222",
    "is_active": true,
    "metadata": {
      "location": "Room 101"
    }
  }'
curl http://localhost:3003/api/devices

