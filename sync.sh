#!/bin/bash

# Data Sync Executable for Mac
echo "📡 Starting site data synchronization..."

# Run the python sync script
python3 sync_data.py --no-push

# Check status
if [ $? -eq 0 ]; then
    echo "✅ Sync successful. site-data.json updated and committed locally."
    echo "Current Git Status:"
    git status -s
else
    echo "❌ Sync failed. Please check the logs above."
    exit 1
fi
