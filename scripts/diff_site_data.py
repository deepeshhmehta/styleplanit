import json
import csv
import io
import os
import data_utils

# Configuration
SPREADSHEET_ID = "e/2PACX-1vSfDsGSiXAvQMmO32s5qWgQaH1GDeZXqEbnMr7bQmm-7gtdoHX-pz_jNq_y3Mb_ahS1LJ99azA84HVZ"
GIDS = {
    "version": "2024034979",
    "config": "1515187439",
    "services": "439228131",
    "reviews": "1697858749",
    "team": "1489131428",
    "dialogs": "49430965"
}

def get_local_data():
    project_root = os.path.dirname(os.path.abspath(__file__)) 
    project_root = os.path.abspath(os.path.join(project_root, os.pardir)) 
    json_path = os.path.join(project_root, "configs", "site-data.json")
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        exit(1)
    with open(json_path, "r") as f:
        return json.load(f)

def generate_diff_csv_content(local_list, remote_list, headers, key_fields):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(headers)

    remote_map = {}
    for item in remote_list:
        normalized_remote_item = {k: data_utils.normalize_value(v) for k, v in item.items()}
        composite_key = tuple(normalized_remote_item.get(field) for field in key_fields)
        if all(composite_key):
            remote_map[composite_key] = normalized_remote_item

    for local_item in local_list:
        normalized_local_item = {k: data_utils.normalize_value(v) for k, v in local_item.items()}
        local_composite_key = tuple(normalized_local_item.get(field) for field in key_fields)
        if not all(local_composite_key): continue

        remote_item = remote_map.get(local_composite_key)
        
        for h in headers:
            if h not in normalized_local_item: normalized_local_item[h] = ""

        if not remote_item:
            writer.writerow([normalized_local_item.get(h, "") for h in headers])
        else:
            diff_found = False
            for header in headers:
                if normalized_local_item.get(header, "") != remote_item.get(header, ""):
                    diff_found = True
                    break
            if diff_found:
                writer.writerow([normalized_local_item.get(h, "") for h in headers])
            
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
        "reviews": {"key_fields": ["author", "text"]}, 
        "dialogs": {"key_fields": ["title"]}, 
    }

    for category, settings in categories_to_check.items():
        print(f"🔄 Fetching remote data for '{category}'...")
        csv_text = data_utils.fetch_csv(SPREADSHEET_ID, GIDS[category])
        
        if csv_text is None: # Fetch failed
            all_match = False
            continue

        local_list = local_full_data.get(category, [])
        remote_list = data_utils.parse_csv_to_list(csv_text)
        
        # Ensure headers are found even if remote is empty
        headers = data_utils.get_all_headers(local_list, remote_list)

        if not headers:
            print(f"  ✅ '{category}' matches remote content.")
            continue

        diff_csv_content = generate_diff_csv_content(local_list, remote_list, headers, key_fields=settings["key_fields"])
        
        # Write CSV if there's actual data (beyond just the header line)
        lines = diff_csv_content.strip().split('\n')
        if len(lines) > 1:
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
