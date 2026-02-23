import csv
import io
import json
import urllib.request

def fetch_csv(spreadsheet_id, gid):
    url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/pub?gid={gid}&output=csv"
    try:
        with urllib.request.urlopen(url) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"  ❌ Failed to fetch GID {gid}: {e}")
        return None

def normalize_value(v):
    if v is None:
        return ""
    # Strip whitespace and normalize all newline variants to \n
    return str(v).strip().replace('\r\n', '\n').replace('\r', '\n')

def parse_csv_to_list(csv_text):
    reader = csv.DictReader(io.StringIO(csv_text))
    processed_list = []
    for row in reader:
        processed_row = {k.strip(): normalize_value(v) for k, v in row.items()}
        processed_list.append(processed_row)
    return processed_list

def normalize_dataset(data_list, headers=None):
    """Normalizes a list of dicts for comparison by ensuring consistent keys and values."""
    normalized_list = []
    for item in data_list:
        normalized_item = {k: normalize_value(v) for k, v in item.items()}
        if headers:
            for h in headers:
                if h not in normalized_item:
                    normalized_item[h] = ""
        normalized_list.append(normalized_item)
    # Sort by JSON string to ensure order-independent comparison
    return sorted([json.dumps(d, sort_keys=True) for d in normalized_list])

def get_all_headers(local_list, remote_list):
    headers = set()
    for item in local_list: headers.update(item.keys())
    for item in remote_list: headers.update(item.keys())
    return sorted(list(headers))
