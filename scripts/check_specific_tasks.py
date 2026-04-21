import os
import json
import urllib.request
import sys
from asana_tools import get_asana_pat, ASANA_API_BASE

TASK_GIDS = ["1213384009537928", "1212623270704103", "1212636354447072"]

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
        print(f"Error {endpoint}: {e}")
        return None

def main():
    pat = get_asana_pat()
    if not pat:
        sys.exit(1)
    
    for task_gid in TASK_GIDS:
        print(f"\n--- Checking Task Details and Attachments for GID: {task_gid} ---")
        task_endpoint = f"tasks/{task_gid}?opt_fields=name,notes,completed,attachments.name"
        task = asana_request(task_endpoint, pat)
        
        if task and task.get("data"):
            t = task['data']
            print(f"Name: {t['name']}")
            print(f"Notes:\n{t.get('notes')}")
            
            attachments_endpoint = f"tasks/{task_gid}/attachments"
            attachments = asana_request(attachments_endpoint, pat)
            if attachments and attachments.get("data"):
                print("Attachments:")
                for a in attachments['data']:
                    print(f"- {a['name']} (GID: {a['gid']})")
                    
            stories_endpoint = f"tasks/{task_gid}/stories"
            stories = asana_request(stories_endpoint, pat)
            if stories and stories.get("data"):
                print("Comments:")
                for story in stories["data"]:
                    if story.get("type") == "comment":
                        print(f"- {story.get('text')}")

if __name__ == "__main__":
    main()
