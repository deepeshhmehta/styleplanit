#!/usr/bin/env python3
import os
import json
import urllib.request
import argparse
import sys

# Project ID for Style Plan-It Launch Plan
DEFAULT_PROJECT_ID = "1212636326772928"
ASANA_API_BASE = "https://app.asana.com/api/1.0"

def get_asana_pat():
    """Tries to get the Asana Personal Access Token from environment or .env.asana file."""
    # 1. Check environment
    pat = os.environ.get("ASANA_PAT")
    if pat:
        return pat
    
    # 2. Check .env.asana in project root
    env_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.asana")
    if os.path.exists(env_file):
        try:
            with open(env_file, "r") as f:
                for line in f:
                    if line.startswith("ASANA_PAT="):
                        return line.split("=", 1)[1].strip().strip('"').strip("'")
        except Exception as e:
            print(f"⚠️  Error reading .env.asana: {e}", file=sys.stderr)
            
    return None

def asana_request(endpoint, method="GET", data=None):
    pat = get_asana_pat()
    if not pat:
        print("❌ Error: ASANA_PAT not found in environment or .env.asana file.", file=sys.stderr)
        sys.exit(1)
        
    url = f"{ASANA_API_BASE}/{endpoint}"
    headers = {
        "Authorization": f"Bearer {pat}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    req_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"❌ Asana API Error ({e.code}): {error_body}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}", file=sys.stderr)
        sys.exit(1)

def list_tasks(project_id=DEFAULT_PROJECT_ID):
    endpoint = f"tasks?project={project_id}&opt_fields=name,completed,assignee.name"
    response = asana_request(endpoint)
    tasks = response.get("data", [])
    
    print(f"\n📋  Style Plan-It Launch Plan Tasks:")
    print("-" * 50)
    for t in tasks:
        status = "[x]" if t.get("completed") else "[ ]"
        assignee = t.get("assignee", {}).get("name", "Unassigned") if t.get("assignee") else "Unassigned"
        print(f"{t['gid']} | {status} {t['name']} ({assignee})")
    print("-" * 50)

def create_task(name, notes="", project_id=DEFAULT_PROJECT_ID, assignee=None, due_on=None):
    endpoint = "tasks"
    data = {
        "data": {
            "name": name,
            "notes": notes,
            "projects": [project_id]
        }
    }
    if assignee:
        data["data"]["assignee"] = assignee
    if due_on:
        data["data"]["due_on"] = due_on
        
    response = asana_request(endpoint, method="POST", data=data)
    task_gid = response.get("data", {}).get("gid")
    if task_gid:
        print(f"✅ Task created successfully! GID: {task_gid}")
        return task_gid
    return None

def update_task(task_gid, data):
    endpoint = f"tasks/{task_gid}"
    response = asana_request(endpoint, method="PUT", data=data)
    if response.get("data"):
        print(f"✅ Task {task_gid} updated successfully!")
        return response.get("data")
    return None

def main():
    parser = argparse.ArgumentParser(description="Style Plan-It Asana Helper Tool")
    subparsers = parser.add_subparsers(dest="command", help="Command to execute")
    
    # List command
    list_parser = subparsers.add_parser("list", help="List tasks in the project")
    list_parser.add_argument("--project", default=DEFAULT_PROJECT_ID, help="Asana Project GID")
    
    # Create command
    create_parser = subparsers.add_parser("create", help="Create a new task")
    create_parser.add_argument("name", help="Task name")
    create_parser.add_argument("--notes", default="", help="Task notes/description")
    create_parser.add_argument("--project", default=DEFAULT_PROJECT_ID, help="Asana Project GID")
    create_parser.add_argument("--assignee", help="User GID to assign the task to")
    create_parser.add_argument("--due", help="Due date (YYYY-MM-DD)")

    # Update command
    update_parser = subparsers.add_parser("update", help="Update an existing task")
    update_parser.add_argument("gid", help="Task GID")
    update_parser.add_argument("--completed", help="Set completed status (true/false)")
    update_parser.add_argument("--assignee", help="User GID to assign the task to")
    
    args = parser.parse_args()
    
    if args.command == "list":
        list_tasks(args.project)
    elif args.command == "create":
        create_task(args.name, args.notes, args.project, args.assignee, args.due)
    elif args.command == "update":
        data = {"data": {}}
        if args.completed is not None:
            data["data"]["completed"] = args.completed.lower() == 'true'
        if args.assignee:
            data["data"]["assignee"] = args.assignee
        update_task(args.gid, data)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
