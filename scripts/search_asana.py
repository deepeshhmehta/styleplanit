import os
import json
import urllib.request
import urllib.parse
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
    
    # Search for "Privacy Policy"
    # Note: Search API can take a few minutes to index new tasks, but "Privacy Policy" should be there if it's an old task.
    # Also, we want to include completed tasks.
    query = urllib.parse.urlencode({
        "text": "Privacy Policy",
        "opt_fields": "name,notes,completed"
    })
    
    search_endpoint = f"workspaces/{WORKSPACE_GID}/tasks/search?{query}"
    print(f"Searching for 'Privacy Policy' in workspace {WORKSPACE_GID}...")
    
    results = asana_request(search_endpoint, pat)
    
    if not results or not results.get("data"):
        print("No tasks found matching 'Privacy Policy'.")
        # Try a broader search by listing tasks in the project if search fails
        return

    for task in results["data"]:
        print(f"\n--- Task: {task['name']} (GID: {task['gid']}, Completed: {task['completed']}) ---")
        if task.get("notes"):
            print(f"Notes:\n{task['notes']}")
        
        # Get stories (comments) for the task
        stories_endpoint = f"tasks/{task['gid']}/stories?opt_fields=text,type"
        stories = asana_request(stories_endpoint, pat)
        if stories and stories.get("data"):
            print("\nComments:")
            for story in stories["data"]:
                if story.get("type") == "comment":
                    print(f"- {story.get('text')}")

if __name__ == "__main__":
    main()
