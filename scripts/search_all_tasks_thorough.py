import os
import json
import urllib.request
import sys
from asana_tools import get_asana_pat, ASANA_API_BASE

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
        sys.exit(1)
    
    projects_endpoint = f"projects?workspace={WORKSPACE_GID}"
    projects = asana_request(projects_endpoint, pat)
    
    if not projects or not projects.get("data"):
        return

    search_term = "policy"
    print(f"Searching for '{search_term}' in all tasks...")

    for p in projects['data']:
        print(f"Project: {p['name']}")
        tasks_endpoint = f"tasks?project={p['gid']}&opt_fields=name,notes,completed"
        tasks = asana_request(tasks_endpoint, pat)
        
        if tasks and tasks.get("data"):
            for t in tasks['data']:
                text_to_search = t['name'].lower() + (t.get('notes', '').lower() if t.get('notes') else '')
                if search_term in text_to_search:
                    print(f"\n--- MATCH IN NAME/NOTES: {t['name']} (GID: {t['gid']}) ---")
                    print(f"Notes: {t.get('notes')}")

                stories_endpoint = f"tasks/{t['gid']}/stories?opt_fields=text,type"
                stories = asana_request(stories_endpoint, pat)
                if stories and stories.get("data"):
                    for story in stories["data"]:
                        if story.get("type") == "comment" and story.get('text'):
                            if search_term in story.get('text').lower():
                                print(f"\n--- MATCH IN COMMENT of task: {t['name']} ---")
                                print(f"Comment: {story.get('text')}")

if __name__ == "__main__":
    main()
