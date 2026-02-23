import os
import json
import subprocess
import argparse
from datetime import datetime
import data_utils

# Configuration
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
        result = subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
    else:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    
    if result.returncode != 0 and not silent:
        print(f"Error: {result.stderr}")
        return None
    return result.stdout.strip()

def load_local_json(json_path):
    if not os.path.exists(json_path):
        return {}
    with open(json_path, 'r') as f:
        return json.load(f)

def get_version_value(data_list):
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

    # 4. Fetch and Consolidate Data
    remote_master_data = {}
    for key, gid in GIDS.items():
        print(f"  📡 Fetching {key}...")
        csv_text = data_utils.fetch_csv(SPREADSHEET_ID, gid)
        if csv_text:
            remote_master_data[key] = data_utils.parse_csv_to_list(csv_text)
        else:
            print(f"  ❌ Skipping {key} due to fetch failure.")

    # 5. Load existing local data for comparison
    json_path = "configs/site-data.json"
    existing_local_full_data = load_local_json(json_path)
    
    changes_detected = False
    new_local_full_data_to_write = existing_local_full_data.copy() 

    for category in GIDS.keys():
        local_list = existing_local_full_data.get(category, [])
        remote_list = remote_master_data.get(category, [])

        sorted_headers = data_utils.get_all_headers(local_list, remote_list)
        normalized_local = data_utils.normalize_dataset(local_list, headers=sorted_headers)
        normalized_remote = data_utils.normalize_dataset(remote_list, headers=sorted_headers)

        if normalized_local != normalized_remote:
            changes_detected = True
        
        new_local_full_data_to_write[category] = remote_list

    if not changes_detected:
        print("🙌 No meaningful changes detected in Google Sheets compared to local. Skipping commit.")
        if original_branch != "main":
            run_command(f"git checkout {original_branch}", silent=True)
        if has_changes:
            run_command("git stash pop", silent=True)
        return

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

    # 7. Restore original state
    if original_branch != "main":
        run_command(f"git checkout {original_branch}", silent=True)
    
    if has_changes:
        run_command("git stash pop", silent=True)

    print("✨ Workflow Complete!")

if __name__ == "__main__":
    main()

if __name__ == "__main__":
    main()
