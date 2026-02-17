#!/bin/bash

# Configuration
PORT=8000
SERVER_URL="http://localhost:$PORT"

echo "🚀 Starting test server on port $PORT..."
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Helper function to test endpoints
test_endpoint() {
    local endpoint=$1
    local expected_status=200
    
    echo -n "Testing $endpoint... "
    status_code=$(curl -o /dev/null -s -w "%{http_code}" "$SERVER_URL/$endpoint")
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo "✅ OK"
    else
        echo "❌ FAILED (Status: $status_code)"
        cleanup
        exit 1
    fi
}

cleanup() {
    echo "🛑 Shutting down server (PID: $SERVER_PID)..."
    kill $SERVER_PID
}

# Run Tests
echo "--- Running Basic Health Checks ---"
test_endpoint ""
test_endpoint "index.html"
test_endpoint "services.html"
test_endpoint "styles/styles.css"

echo "--- Verifying Modular JS ---"
test_endpoint "js/config.js"
test_endpoint "js/utils.js"
test_endpoint "js/app.js"
test_endpoint "js/loader.js"

echo "--- Verifying Components ---"
test_endpoint "components/header.html"
test_endpoint "components/footer.html"
test_endpoint "components/loader.html"

echo "--- Verifying Config Backups ---"
test_endpoint "configs/version.csv"
test_endpoint "configs/config.csv"
test_endpoint "configs/services.csv"
test_endpoint "configs/reviews.csv"

echo "✨ All basic endpoint tests passed!"

cleanup
echo "✅ Testing complete."
