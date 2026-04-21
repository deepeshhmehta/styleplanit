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
    
    project_ids = []
    if projects and projects.get("data"):
        project_ids = [p['gid'] for p in projects['data']]
        print(f"Found projects: {[p['name'] for p in projects['data']]}")

    search_term = "privacy"
    print(f"Searching for '{search_term}'...")

    for project_id in project_ids:
        print(f"Checking project {project_id}...")
        tasks_endpoint = f"tasks?project={project_id}&opt_fields=name,notes,completed"
        tasks = asana_request(tasks_endpoint, pat)
        
        if not tasks or not tasks.get("data"):
            print(f"  No tasks found in project {project_id}")
            continue
            
        print(f"  Checking {len(tasks['data'])} tasks in this project...")
        
        for task in tasks["data"]:
            match = False
            if search_term in task['name'].lower():
                match = True
            elif task.get("notes") and search_term in task['notes'].lower():
                match = True
            
            if match:
                print(f"\n--- MATCH FOUND (NAME/NOTES): {task['name']} (GID: {task['gid']}) ---")
                if task.get("notes"):
                    print(f"Notes:\n{task['notes']}")
            
            # Check stories
            stories_endpoint = f"tasks/{task['gid']}/stories?opt_fields=text,type"
            stories = asana_request(stories_endpoint, pat)
            if stories and stories.get("data"):
                for story in stories["data"]:
                    if story.get("type") == "comment" and story.get('text'):
                        if search_term in story.get('text').lower():
                            print(f"\n--- MATCH FOUND (COMMENT) in task: {task['name']} ---")
                            print(f"Comment: {story.get('text')}")

if __name__ == "__main__":
    main()
