import json
import csv
import io
import os
import urllib.request
from collections import defaultdict

# --- Utility functions for fetching and parsing ---
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
            return response.read().decode("utf-8")
    except Exception as e:
        # print(f"Failed to fetch GID {gid}: {e}") # Suppress error for specific output
        return None

def parse_csv_to_list(csv_text):
    reader = csv.DictReader(io.StringIO(csv_text))
    return [row for row in reader]

def get_local_data():
    project_root = os.getcwd()
    json_path = os.path.join(project_root, "configs", "site-data.json")
    if not os.path.exists(json_path):
        # print(f"Error: {json_path} not found.") # Suppress error for specific output
        exit(1)
    with open(json_path, "r") as f:
        return json.load(f)

def generate_diff_csv_content(local_list, remote_list, headers, key_fields):
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header for the diff CSV
    writer.writerow(headers)

    remote_map = {}
    for item in remote_list:
        composite_key = tuple(item.get(field) for field in key_fields)
        if all(composite_key): # Ensure all parts of the key exist
            remote_map[composite_key] = item

    for local_item in local_list:
        local_composite_key = tuple(local_item.get(field) for field in key_fields)
        
        if not all(local_composite_key): # Skip malformed local items
            continue

        remote_item = remote_map.get(local_composite_key)

        # Compare stringified JSON representations for deep equality
        local_item_str = json.dumps(local_item, sort_keys=True)
        remote_item_str = json.dumps(remote_item, sort_keys=True) if remote_item else None

        if local_item_str != remote_item_str:
            # Item is new or changed
            row_data = [local_item.get(h, "") for h in headers]
            writer.writerow(row_data)
            
    return output.getvalue()

# --- Main Logic ---
local_full_data = get_local_data()

# --- Services Tab ---
local_services = local_full_data.get("services", [])
remote_services_csv = fetch_csv(GIDS["services"])
remote_services = parse_csv_to_list(remote_services_csv) if remote_services_csv else []
services_headers = sorted(list(set(k for item in local_services for k in item.keys())))
services_diff_csv = generate_diff_csv_content(local_services, remote_services, services_headers, key_fields=["title", "category"])

# Write to file
temp_file_path = os.path.join(os.getcwd(), "scripts", "temp.csv")
with open(temp_file_path, "w", newline="") as f:
    f.write(services_diff_csv)

print(f"Services updates (using composite key) written to {temp_file_path}")
