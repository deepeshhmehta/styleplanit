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

def get_local_data():
    project_root = os.path.dirname(os.path.abspath(__file__)) # Get script's dir
    project_root = os.path.abspath(os.path.join(project_root, os.pardir)) # Go up to project root
    json_path = os.path.join(project_root, "configs", "site-data.json")
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
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

        # Normalize local item values to string for consistent comparison with CSV-parsed remote items
        normalized_local_item = {k: str(v).strip().replace('\r\n', '\n').replace('\r', '\n') for k, v in local_item.items() if v is not None}
        # Ensure all headers are present for normalized_local_item
        for h in headers:
            if h not in normalized_local_item:
                normalized_local_item[h] = ""


        if not remote_item:
            # Item exists locally but not remotely (new item)
            row_data = [normalized_local_item.get(h, "") for h in headers]
            writer.writerow(row_data)
        else:
            # Item exists in both, check for differences field by field
            diff_found = False
            for header in headers:
                local_val = normalized_local_item.get(header, "")
                remote_val = remote_item.get(header, "") # remote_item values are already strings

                if local_val != remote_val:
                    diff_found = True
                    break
            
            if diff_found:
                # Item has changed
                row_data = [normalized_local_item.get(h, "") for h in headers]
                writer.writerow(row_data)
            
    return output.getvalue()

def main():
    local_full_data = get_local_data()
    all_match = True
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "diff_outputs")
    os.makedirs(output_dir, exist_ok=True)

    print("📊 Comparing local site-data.json with remote Google Sheets...")
    print("-" * 50)

    categories_to_check = {
        "config": {"key_fields": ["key"]},
        "services": {"key_fields": ["title", "category"]},
        "reviews": {"key_fields": ["author", "text"]}, # Assuming author + text is unique
    }

    for category, settings in categories_to_check.items():
        print(f"🔄 Fetching remote data for '{category}' (GID: {GIDS[category]})...")
        csv_text = fetch_csv(GIDS[category])
        
        if not csv_text:
            print(f"  ❌ Failed to fetch remote data for '{category}'. Skipping comparison.")
            all_match = False
            continue

        local_list = local_full_data.get(category, [])
        remote_list = parse_csv_to_list(csv_text)
        
        # Determine headers: use all keys found in local and remote for comprehensive comparison
        all_keys = set()
        for item in local_list:
            all_keys.update(item.keys())
        for item in remote_list:
            all_keys.update(item.keys())
        headers = sorted(list(all_keys))

        if not headers and (local_list or remote_list):
            print(f"  ⚠️  Could not determine headers for '{category}' despite data presence. Skipping comparison.")
            all_match = False
            continue

        diff_csv_content = generate_diff_csv_content(local_list, remote_list, headers, key_fields=settings["key_fields"])
        
        if diff_csv_content:
            all_match = False
            output_file = os.path.join(output_dir, f"{category}_updates.csv")
            with open(output_file, "w", newline="") as f:
                f.write(diff_csv_content)
            print(f"  ⚠️  Differences detected for '{category}'. Updates written to {output_file}")
        else:
            print(f"  ✅ '{category}' matches remote content.")

    print("-" * 50)
    if all_match:
        print("🎉 All configured data sections are in sync with remote Google Sheets.")
    else:
        print("⚠️  Differences detected. Review generated CSVs in 'scripts/diff_outputs/' folder.")

if __name__ == "__main__":
    main()
