import os
import json
import subprocess
import urllib.request
import argparse
from datetime import datetime
import csv
import io

# Configuration from js/config.js logic
SPREADSHEET_ID = "e/2PACX-1vSfDsGSiXAvQMmO32s5qWgQaH1GDeZXqEbnMr7bQmm-7gtdoHX-pz_jNq_y3Mb_ahS1LJ99azA84HVZ"
GIDS = {
    "version": "2024034979",
    "config": "1515187439",
    "services": "439228131",
    "reviews": "1697858749",
    "team": "1489131428"
}

def run_command(cmd, silent=False):
    if silent:
        # Capture stdout, discard stderr
        result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
    else:
        # Capture both stdout and stderr
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if result.returncode != 0 and not silent:
        print(f"Error: {result.stderr}")
        return None
    return result.stdout.strip()

def fetch_csv(gid):
    url = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/pub?gid={gid}&output=csv"
    try:
        with urllib.request.urlopen(url) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"  ❌ Failed to fetch GID {gid}: {e}")
        return None

def parse_csv_to_list(csv_text):
    # Ensure all values are strings, strip whitespace, and normalize newlines
    reader = csv.DictReader(io.StringIO(csv_text))
    processed_list = []
    for row in reader:
        processed_row = {}
        for k, v in row.items():
            if v is not None:
                # Normalize newlines and strip extra spaces
                processed_row[k.strip()] = v.strip().replace('\r\n', '\n').replace('\r', '\n')
            else:
                processed_row[k.strip()] = ""
        processed_list.append(processed_row)
    return processed_list

def load_local_json(json_path):
    if not os.path.exists(json_path):
        return {} # Return empty dict if file not found
    with open(json_path, 'r') as f:
        return json.load(f)

def normalize_data_for_comparison(data_list, headers=None):
    """Normalizes a list of dicts for comparison by ensuring consistent keys and string values."""
    normalized_list = []
    for item in data_list:
        normalized_item = {}
        # Ensure all values are strings, strip whitespace, and normalize newlines
        for k, v in item.items():
            if v is not None:
                normalized_item[k] = str(v).strip().replace('\r\n', '\n').replace('\r', '\n')
            else:
                normalized_item[k] = ""
        
        # If headers are provided, ensure all headers are present (with empty string if missing)
        if headers:
            for h in headers:
                if h not in normalized_item:
                    normalized_item[h] = ""
        normalized_list.append(normalized_item)
    return sorted([json.dumps(d, sort_keys=True) for d in normalized_list])

def get_version_value(data_list):
    """Extracts the version string from a list of version dictionaries."""
    if data_list and isinstance(data_list, list) and len(data_list) > 0:
        version_item = data_list[0]
        return version_item.get('value') or version_item.get('version')
    return None

def main():
    parser = argparse.ArgumentParser(description="Sync Google Sheets to local JSON.")
    parser.add_argument("--no-push", action="store_true", help="Commit changes locally but do not push to remote.")
    args = parser.parse_args()

    print("🔄 Starting Data Sync Workflow...")
    
    # 1. Capture current state
    original_branch = run_command("git rev-parse --abbrev-ref HEAD", silent=True)
    has_changes = run_command("git status --porcelain", silent=True) != ""
    
    if not original_branch:
        print("Error: Could not determine current Git branch.")
        return

    # 2. Stash changes if any
    if has_changes:
        print("📥 Stashing current changes...")
        run_command("git stash", silent=True)

    # 3. Switch to main and pull
    print("🔀 Switching to main...")
    run_command("git checkout main")
    run_command("git pull origin main")

    # 4. Fetch and Consolidate Data (from remote Google Sheets)
    remote_master_data = {}
    for key, gid in GIDS.items():
        print(f"  📡 Fetching {key}...")
        csv_text = fetch_csv(gid)
        if csv_text:
            remote_master_data[key] = parse_csv_to_list(csv_text)
        else:
            print(f"  ❌ Skipping {key} due to fetch failure.")

    # 5. Load existing local data for comparison and to preserve non-sheet content
    json_path = "configs/site-data.json"
    existing_local_full_data = load_local_json(json_path)
    
    changes_detected = False
    # Start with a copy of local data to preserve non-sheet managed keys (e.g., 'version' from initial commit)
    new_local_full_data_to_write = existing_local_full_data.copy() 

    # Compare category by category using robust logic
    for category in GIDS.keys():
        local_list = existing_local_full_data.get(category, [])
        remote_list = remote_master_data.get(category, [])

        # Get all possible headers from both local and remote for comprehensive comparison
        all_headers = set()
        for item in local_list: all_headers.update(item.keys())
        for item in remote_list: all_headers.update(item.keys())
        sorted_headers = sorted(list(all_headers))

        normalized_local = normalize_data_for_comparison(local_list, headers=sorted_headers)
        normalized_remote = normalize_data_for_comparison(remote_list, headers=sorted_headers)

        if normalized_local != normalized_remote:
            changes_detected = True
        
        # Always use the remote data as the "source of truth" for the current category
        new_local_full_data_to_write[category] = remote_list

    # --- Special handling for version comparison ---
    # This logic assumes 'version' key's comparison in normalize_data_for_comparison is sufficient
    # and ensures that if a new version is published, it triggers a commit.
    local_version_value = get_version_value(existing_local_full_data.get('version', []))
    remote_version_value = get_version_value(remote_master_data.get('version', []))

    if local_version_value != remote_version_value:
        changes_detected = True # Force change if version number differs
        # new_local_full_data_to_write['version'] will already be updated by remote_list assignment above

        
    if not changes_detected:
        print("🙌 No meaningful changes detected in Google Sheets compared to local. Skipping commit.")
        # Restore original state before exiting
        if original_branch != "main":
            run_command(f"git checkout {original_branch}", silent=True)
        if has_changes:
            run_command("git stash pop", silent=True)
        return

    # If changes are detected, write the new master data (from remote) to local JSON
    with open(json_path, 'w') as f:
        json.dump(new_local_full_data_to_write, f, indent=2)
    print(f"✅ Data consolidated into {json_path}")

    # 6. Commit
    print("🚀 Committing updates to main...")
    run_command(f"git add {json_path}")
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    run_command(f'git commit -m "data: bulk update site-data.json from google sheets ({timestamp})"')
    
    if not args.no_push:
        print("📤 Pushing to origin main...")
        run_command("git push origin main")
    else:
        print("ℹ️  Skipping push (--no-push active).")

    # 7. Restore original state
    if original_branch != "main":
        print(f"⏪ Switching back to {original_branch}...")
        run_command(f"git checkout {original_branch}", silent=True)
    
    if has_changes:
        print("📤 Unstashing changes...")
        run_command("git stash pop", silent=True)

    print("✨ Workflow Complete!")

if __name__ == "__main__":
    main()
