import os
import json
import urllib.request
import sys
from asana_tools import get_asana_pat, ASANA_API_BASE, DEFAULT_PROJECT_ID

WORKSPACE_GID = "1212636328335155"

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
    
    projects_endpoint = f"projects?workspace={WORKSPACE_GID}"
    projects = asana_request(projects_endpoint, pat)
    
    if not projects or not projects.get("data"):
        print("No projects found")
        return

    for p in projects['data']:
        print(f"\n--- Listing tasks for project: {p['name']} ({p['gid']}) ---")
        tasks_endpoint = f"tasks?project={p['gid']}&opt_fields=name,completed"
        tasks = asana_request(tasks_endpoint, pat)
        
        if tasks and tasks.get("data"):
            for t in tasks['data']:
                status = "[x]" if t['completed'] else "[ ]"
                print(f"{status} {t['name']} (GID: {t['gid']})")
        else:
            print("  No tasks found.")

if __name__ == "__main__":
    main()
