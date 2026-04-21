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
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"HTTP Error {e.code}: {error_body}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    pat = get_asana_pat()
    if not pat:
        print("ASANA_PAT not found")
        sys.exit(1)
    
    # List all projects in workspace
    projects_endpoint = f"projects?workspace={WORKSPACE_GID}"
    projects = asana_request(projects_endpoint, pat)
    
    project_ids = [DEFAULT_PROJECT_ID]
    if projects and projects.get("data"):
        project_ids = [p['gid'] for p in projects['data']]
        print(f"Found projects: {[p['name'] for p in projects['data']]}")

    for project_id in project_ids:
        print(f"Checking project {project_id}...")
        tasks_endpoint = f"tasks?project={project_id}&opt_fields=name,notes,completed"
        tasks = asana_request(tasks_endpoint, pat)
        
        if not tasks or not tasks.get("data"):
            continue
            
        for task in tasks["data"]:
            match = False
            if "privacy policy" in task['name'].lower():
                match = True
            elif task.get("notes") and "privacy policy" in task['notes'].lower():
                match = True
            
            if not match:
                # Check stories only if task doesn't match name/notes (optional optimization)
                # But user asked to check comments too.
                # However, fetching stories for EVERY task might be slow if there are many.
                # Let's check name/notes first.
                pass
            
            if match:
                print(f"\n--- MATCH FOUND: {task['name']} (GID: {task['gid']}, Completed: {task['completed']}) ---")
                if task.get("notes"):
                    print(f"Notes:\n{task['notes']}")
                
                # Always get stories for matches
                stories_endpoint = f"tasks/{task['gid']}/stories?opt_fields=text,type"
                stories = asana_request(stories_endpoint, pat)
                if stories and stories.get("data"):
                    print("\nComments:")
                    for story in stories["data"]:
                        if story.get("type") == "comment":
                            print(f"- {story.get('text')}")
            else:
                # We should still check comments for tasks that don't match in name/notes
                # but might mention "Privacy Policy" in comments.
                # To be thorough but efficient, let's only fetch stories if the task name sounds relevant
                # or if we really need to check every single task.
                # User said "Search all Asana tasks... Check task descriptions and comments."
                # So I must check comments.
                
                stories_endpoint = f"tasks/{task['gid']}/stories?opt_fields=text,type"
                stories = asana_request(stories_endpoint, pat)
                if stories and stories.get("data"):
                    comment_match = False
                    comments_to_print = []
                    for story in stories["data"]:
                        if story.get("type") == "comment":
                            if story.get('text') and "privacy policy" in story.get('text').lower():
                                comment_match = True
                            comments_to_print.append(story.get('text'))
                    
                    if comment_match:
                        print(f"\n--- COMMENT MATCH FOUND: {task['name']} (GID: {task['gid']}, Completed: {task['completed']}) ---")
                        if task.get("notes"):
                            print(f"Notes:\n{task['notes']}")
                        print("\nComments (match found here):")
                        for c in comments_to_print:
                            if "privacy policy" in c.lower():
                                print(f"MATCH -> {c}")
                            else:
                                print(f"- {c}")

if __name__ == "__main__":
    main()
