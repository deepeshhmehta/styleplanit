import os
import json
import subprocess
import urllib.request
import argparse
from datetime import datetime

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
    stderr_target = subprocess.DEVNULL if silent else subprocess.PIPE
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
        print(f"Failed to fetch GID {gid}: {e}")
        return None

def parse_csv_to_list(csv_text):
    import csv
    import io
    reader = csv.DictReader(io.StringIO(csv_text))
    return [row for row in reader]

def main():
    parser = argparse.ArgumentParser(description="Sync Google Sheets to local JSON.")
    parser.add_argument("--no-push", action="store_true", help="Commit changes locally but do not push to remote.")
    args = parser.parse_args()

    print("🔄 Starting Data Sync Workflow...")
    
    # 1. Capture current state
    original_branch = run_command("git rev-parse --abbrev-ref HEAD", silent=True)
    has_changes = run_command("git status --porcelain", silent=True) != ""
    
    if not original_branch:
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
    master_data = {}
    for key, gid in GIDS.items():
        print(f"  📡 Fetching {key}...")
        csv_text = fetch_csv(gid)
        if csv_text:
            master_data[key] = parse_csv_to_list(csv_text)
        else:
            print(f"  ❌ Skipping {key} due to fetch failure.")

    # 5. Write to JSON and Check for Changes
    json_path = "configs/site-data.json"
    new_data_str = json.dumps(master_data, indent=2)
    
    existing_data_str = ""
    if os.path.exists(json_path):
        with open(json_path, 'r') as f:
            existing_data_str = f.read()

    if new_data_str == existing_data_str:
        print("🙌 No changes detected in Google Sheets. Skipping commit.")
        # Restore original state before exiting
        if original_branch != "main":
            run_command(f"git checkout {original_branch}")
        if has_changes:
            run_command("git stash pop")
        return

    with open(json_path, 'w') as f:
        f.write(new_data_str)
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
        run_command(f"git checkout {original_branch}")
    
    if has_changes:
        print("📤 Unstashing changes...")
        run_command("git stash pop")

    print("✨ Workflow Complete!")

if __name__ == "__main__":
    main()
