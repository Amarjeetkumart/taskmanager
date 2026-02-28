#!/bin/bash

# Task Manager API Test Script
echo "🧪 Testing Task Management API..."

API_URL="http://localhost:3000/api"
EMAIL="test@example.com"
PASSWORD="TestPass123!"
USERNAME="testuser"

echo ""
echo "================================"
echo "1. Testing Health Endpoint"
echo "================================"
curl -s http://localhost:3000/health | jq '.'

echo ""
echo "================================"
echo "2. Registering New User"
echo "================================"
REGISTER_RESPONSE=$(curl -s -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "'${USERNAME}'",
    "email": "'${EMAIL}'",
    "password": "'${PASSWORD}'",
    "firstName": "Test",
    "lastName": "User"
  }')

echo $REGISTER_RESPONSE | jq '.'

# Extract access token
ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')
REFRESH_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.refreshToken')

if [ "$ACCESS_TOKEN" == "null" ]; then
    echo "❌ Registration failed. Trying to login with existing user..."
    
    echo ""
    echo "================================"
    echo "3. Logging In"
    echo "================================"
    LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "'${EMAIL}'",
        "password": "'${PASSWORD}'"
      }')
    
    echo $LOGIN_RESPONSE | jq '.'
    
    ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
    REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refreshToken')
fi

if [ "$ACCESS_TOKEN" == "null" ]; then
    echo "❌ Failed to get access token. Exiting..."
    exit 1
fi

echo "✅ Access Token: ${ACCESS_TOKEN:0:20}..."

echo ""
echo "================================"
echo "4. Getting User Profile"
echo "================================"
curl -s -X GET "${API_URL}/users/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo "================================"
echo "5. Creating Task #1"
echo "================================"
TASK1_RESPONSE=$(curl -s -X POST "${API_URL}/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive README and API docs",
    "priority": "high",
    "dueDate": "2026-03-15"
  }')

echo $TASK1_RESPONSE | jq '.'
TASK1_ID=$(echo $TASK1_RESPONSE | jq -r '.task._id')

echo ""
echo "================================"
echo "6. Creating Task #2"
echo "================================"
curl -s -X POST "${API_URL}/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Setup CI/CD pipeline",
    "description": "Configure automated testing and deployment",
    "priority": "medium",
    "tags": ["devops", "automation"]
  }' | jq '.'

echo ""
echo "================================"
echo "7. Creating Task #3"
echo "================================"
curl -s -X POST "${API_URL}/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "title": "Code review",
    "description": "Review pull requests",
    "priority": "urgent"
  }' | jq '.'

echo ""
echo "================================"
echo "8. Getting All Tasks"
echo "================================"
curl -s -X GET "${API_URL}/tasks" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo "================================"
echo "9. Updating Task Status"
echo "================================"
curl -s -X PATCH "${API_URL}/tasks/${TASK1_ID}/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "status": "in-progress"
  }' | jq '.'

echo ""
echo "================================"
echo "10. Getting Task Statistics"
echo "================================"
curl -s -X GET "${API_URL}/tasks/stats" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo "================================"
echo "11. Filtering Tasks by Priority"
echo "================================"
curl -s -X GET "${API_URL}/tasks?priority=high" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'

echo ""
echo "================================"
echo "12. Updating User Profile"
echo "================================"
curl -s -X PUT "${API_URL}/users/me" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }' | jq '.'

echo ""
echo "================================"
echo "13. Refreshing Access Token"
echo "================================"
REFRESH_RESPONSE=$(curl -s -X POST "${API_URL}/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "'${REFRESH_TOKEN}'"
  }')

echo $REFRESH_RESPONSE | jq '.'
NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.accessToken')

echo ""
echo "================================"
echo "14. Using New Access Token"
echo "================================"
curl -s -X GET "${API_URL}/users/me" \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN" | jq '.'

echo ""
echo "================================"
echo "✅ All Tests Complete!"
echo "================================"
echo ""
