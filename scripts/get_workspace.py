import os
import json
import urllib.request
import sys
from asana_tools import get_asana_pat, ASANA_API_BASE, DEFAULT_PROJECT_ID

def asana_request(endpoint, pat):
    url = f"{ASANA_API_BASE}/{endpoint}"
    headers = {
        "Authorization": f"Bearer {pat}",
        "Accept": "application/json"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    pat = get_asana_pat()
    if not pat:
        print("ASANA_PAT not found")
        sys.exit(1)
    
    project = asana_request(f"projects/{DEFAULT_PROJECT_ID}", pat)
    if project:
        workspace = project['data']['workspace']
        print(f"WORKSPACE_GID={workspace['gid']}")
        print(f"WORKSPACE_NAME={workspace['name']}")
    else:
        print("Failed to get project info")

if __name__ == "__main__":
    main()
