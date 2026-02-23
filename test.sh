#!/bin/bash

# Configuration
PORT=8000
SERVER_URL="http://localhost:$PORT"

echo "🚀 Starting test server on port $PORT..."
python3 -m http.server $PORT > /dev/null 2>&1 &
SERVER_PID=$!

sleep 2

test_endpoint() {
    local endpoint=$1
    echo -n "Testing $endpoint... "
    status_code=$(curl -o /dev/null -s -w "%{http_code}" "$SERVER_URL/$endpoint")
    if [ "$status_code" -eq 200 ]; then
        echo "✅ OK"
    else
        echo "❌ FAILED (Status: $status_code)"
        kill $SERVER_PID
        exit 1
    fi
}

cleanup() {
    echo "🛑 Shutting down server..."
    kill $SERVER_PID
}

echo "--- Core Health Checks ---"
test_endpoint ""
test_endpoint "index.html"
test_endpoint "services.html"
test_endpoint "meet-the-team.html"
test_endpoint "styles/styles.css"

echo "--- Data & Scripts ---"
test_endpoint "js/config.js"
test_endpoint "js/utils.js"
test_endpoint "js/app.js"
test_endpoint "configs/site-data.json"
test_endpoint "sync-styleplanit.command"

echo "✨ All production-grade endpoint tests passed!"
cleanup
echo "✅ Testing complete."
