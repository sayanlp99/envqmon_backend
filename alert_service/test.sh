#!/bin/bash

# Alert Service Test Script
# Usage: ./test-alert-service.sh [PORT]
# Default PORT: 3005
# Assumes service is running on localhost

PORT=${1:-3005}
BASE_URL="http://localhost:${PORT}/api"

echo "Testing Alert Service on ${BASE_URL}"
echo "================================"

# Health Check
echo "1. Health Check:"
curl -s -X GET "${BASE_URL%/*}/health" | jq .
echo ""

# Register a user device
echo "2. Register Device (POST /users/register):"
USER_ID="test-user-123"
FCM_TOKEN="dummy-fcm-token-abc"
curl -s -X POST "${BASE_URL}/users/register" \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"${USER_ID}\", \"fcmToken\": \"${FCM_TOKEN}\"}" | jq .
echo ""

# Update token for the user
echo "3. Update Token (PUT /users/update):"
NEW_FCM_TOKEN="updated-dummy-fcm-token-xyz"
curl -s -X PUT "${BASE_URL}/users/update" \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"${USER_ID}\", \"fcmToken\": \"${NEW_FCM_TOKEN}\"}" | jq .
echo ""

# Get alerts for user
echo "4. Get Alerts (GET /alerts?userId=${USER_ID}):"
curl -s -X GET "${BASE_URL}/alerts?userId=${USER_ID}" | jq .
echo ""

# Get all alerts
echo "5. Get All Alerts (GET /alerts/all):"
curl -s -X GET "${BASE_URL}/alerts/all" | jq .
echo ""

# Delete the user
# echo "6. Delete User (DELETE /users/${USER_ID}):"
# curl -s -X DELETE "${BASE_URL}/users/${USER_ID}" | jq .
# echo ""

# Get alerts after delete (should still show previous if any)
echo "7. Get Alerts After Delete (GET /alerts?userId=${USER_ID}):"
curl -s -X GET "${BASE_URL}/alerts?userId=${USER_ID}" | jq .
echo ""

# Note: For DELETE /alerts/:id, you need a real ID from previous alerts.
# Example (uncomment and replace ID):
# echo "8. Delete Alert (DELETE /alerts/1):"
# curl -s -X DELETE "${BASE_URL}/alerts/1" | jq .
# echo ""

echo "Testing complete. Check outputs for success/error codes."
echo "For MQTT/FCM testing, simulate MQTT publish separately."