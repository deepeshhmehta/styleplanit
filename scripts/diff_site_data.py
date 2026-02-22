import os
import json
import urllib.request
import csv
import io

# Configuration from sync_engine.py (replicated for standalone comparison)
SPREADSHEET_ID = "e/2PACX-1vSfDsGSiXAvQMmO32s5qWgQaH1GDeZXqEbnMr7bQmm-7gtdoHX-pz_jNq_y3Mb_ahS1LJ99azA84HVZ"
GIDS = {
    "version": "2024034979",
    "config": "1515187439",
    "services": "439228131",
    "reviews": "1697858749",
    "team": "1489131428"
}

def fetch_csv(gid):
    url = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/pub?gid={gid}&output=csv"
    try:
        with urllib.request.urlopen(url) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"Failed to fetch GID {gid}: {e}")
        return None

def parse_csv_to_list(csv_text):
    reader = csv.DictReader(io.StringIO(csv_text))
    return [row for row in reader]

def compare_data():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(current_dir, os.pardir))
    json_path = os.path.join(project_root, "configs", "site-data.json")

    # 1. Load local site-data.json
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    with open(json_path, 'r') as f:
        local_data = json.load(f)

    print("📊 Comparing local site-data.json with remote Google Sheets...")
    print("-" * 50)

    all_match = True

    for key, gid in GIDS.items():
        print(f"🔄 Fetching remote data for '{key}' (GID: {gid})...")
        csv_text = fetch_csv(gid)
        if not csv_text:
            print(f"  ❌ Failed to fetch remote data for '{key}'. Skipping comparison.")
            continue

        remote_list = parse_csv_to_list(csv_text)
        local_list = local_data.get(key, [])

        # Simple comparison for now: check length and basic equality
        # For a deeper comparison, you'd need unique identifiers and field-by-field checks
        if len(remote_list) != len(local_list):
            print(f"  ⚠️  Mismatch in '{key}': Local has {len(local_list)} items, Remote has {len(remote_list)} items.")
            all_match = False
        
        # Convert lists of dicts to a sortable/comparable format (e.g., sorted JSON strings)
        # This is a basic deep comparison for simple data structures
        local_sorted = sorted([json.dumps(d, sort_keys=True) for d in local_list])
        remote_sorted = sorted([json.dumps(d, sort_keys=True) for d in remote_list])

        if local_sorted != remote_sorted:
            print(f"  ❌ Mismatch in content for '{key}'. Local and Remote data differ.")
            # For brevity, not printing full diff here, but could be extended
            all_match = False
        else:
            print(f"  ✅ '{key}' matches remote content.")

    print("-" * 50)
    if all_match:
        print("🎉 All data sections are in sync with remote Google Sheets.")
    else:
        print("⚠️  Differences detected. Review local changes or remote sheet.")

if __name__ == "__main__":
    compare_data()
