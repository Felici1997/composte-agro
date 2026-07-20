#!/usr/bin/env python3
"""Data integrity guardrail for ui-ux-pro-max."""
import csv, json, sys
from pathlib import Path
from core import CSV_CONFIG, STACK_CONFIG, _STACK_COLS, DATA_DIR

REASONING_FILE = "ui-reasoning.csv"
JSON_COLUMNS = {"Decision_Rules"}

def _read_rows(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return reader.fieldnames or [], list(reader)

def _check_file(label, filepath, search_cols, output_cols, problems):
    if not filepath.exists():
        problems.append(f"[{label}] missing file: {filepath}"); return
    try:
        headers, rows = _read_rows(filepath)
    except Exception as e:
        problems.append(f"[{label}] failed to parse {filepath.name}: {e}"); return
    header_set = set(headers)
    for col in set(search_cols) | set(output_cols):
        if col not in header_set:
            problems.append(f"[{label}] {filepath.name}: expected column '{col}' not found")
    if "No" in header_set:
        seen = {}
        for i, row in enumerate(rows, start=2):
            key = row.get("No", "")
            if key in seen: problems.append(f"[{label}] {filepath.name}: duplicate 'No' '{key}' rows {seen[key]},{i}")
            else: seen[key] = i
    for row_idx, row in enumerate(rows, start=2):
        for col in JSON_COLUMNS:
            if col in row and row[col]:
                try: json.loads(row[col])
                except json.JSONDecodeError as e: problems.append(f"[{label}] {filepath.name} row {row_idx}: {col} not valid JSON: {e}")

def main():
    problems = []
    for domain, config in CSV_CONFIG.items():
        _check_file(f"domain:{domain}", DATA_DIR / config["file"], config["search_cols"], config["output_cols"], problems)
    for stack, config in STACK_CONFIG.items():
        _check_file(f"stack:{stack}", DATA_DIR / config["file"], _STACK_COLS["search_cols"], _STACK_COLS["output_cols"], problems)
    reasoning_path = DATA_DIR / REASONING_FILE
    if reasoning_path.exists(): _check_file("reasoning", reasoning_path, ["UI_Category"], ["UI_Category", "Decision_Rules"], problems)
    else: problems.append(f"[reasoning] missing file: {reasoning_path}")
    if problems:
        print(f"FAILED: {len(problems)} issue(s):\n" + "\n".join(f"  - {p}" for p in problems)); sys.exit(1)
    print(f"OK: validated {len(CSV_CONFIG)} domain files, {len(STACK_CONFIG)} stack files"); sys.exit(0)

if __name__ == "__main__": main()
