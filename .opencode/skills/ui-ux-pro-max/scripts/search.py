#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI/UX Pro Max Search - BM25 search engine for UI/UX style guides
Usage: python search.py "<query>" [--domain <domain>] [--stack <stack>] [--max-results 3]
       python search.py "<query>" --design-system [-p "Project Name"]
"""

import argparse
import json as json_module
import sys
import io
from core import CSV_CONFIG, AVAILABLE_STACKS, MAX_RESULTS, UNTRUNCATED_COLS, search, search_stack
from design_system import generate_design_system

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding and sys.stderr.encoding.lower() != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

TRUNCATE_AT = 300

def format_output(result, full=False):
    if "error" in result:
        return f"Error: {result['error']}"
    output = []
    if result.get("stack"):
        output.append("## UI Pro Max Stack Guidelines")
        output.append(f"**Stack:** {result['stack']} | **Query:** {result['query']}")
    else:
        output.append("## UI Pro Max Search Results")
        domain_note = result['domain']
        if result.get("auto_detected"):
            domain_note += " (auto-detected)"
        output.append(f"**Domain:** {domain_note} | **Query:** {result['query']}")
    output.append(f"**Source:** {result['file']} | **Found:** {result['count']} results\n")
    if result['count'] == 0:
        output.append("No matches. Retry with broader/different keywords.")
        suggestions = result.get("suggestions") or []
        if suggestions:
            output.append(f"**Closest known terms:** {', '.join(suggestions)}")
        return "\n".join(output)
    for i, row in enumerate(result['results'], 1):
        output.append(f"### Result {i}")
        for key, value in row.items():
            value_str = str(value)
            if not full and key not in UNTRUNCATED_COLS and len(value_str) > TRUNCATE_AT:
                value_str = value_str[:TRUNCATE_AT] + "..."
            output.append(f"- **{key}:** {value_str}")
        output.append("")
    return "\n".join(output)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UI Pro Max Search")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--domain", "-d", choices=list(CSV_CONFIG.keys()), help="Search domain")
    parser.add_argument("--stack", "-s", choices=AVAILABLE_STACKS, help="Stack-specific search")
    parser.add_argument("--max-results", "-n", type=int, default=MAX_RESULTS, help="Max results (default: 3)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")
    parser.add_argument("--full", action="store_true", help="Do not truncate long field values")
    parser.add_argument("--design-system", "-ds", action="store_true", help="Generate complete design system recommendation")
    parser.add_argument("--project-name", "-p", type=str, default=None, help="Project name for design system output")
    parser.add_argument("--format", "-f", choices=["ascii", "markdown"], default="ascii", help="Output format for design system")
    parser.add_argument("--persist", action="store_true", help="Save design system to file")
    parser.add_argument("--page", type=str, default=None, help="Create page-specific override file")
    parser.add_argument("--output-dir", "-o", type=str, default=None, help="Output directory for persisted files")
    parser.add_argument("--force", action="store_true", help="Overwrite existing MASTER.md")
    parser.add_argument("--variance", type=int, choices=range(1, 11), metavar="1-10", help="DESIGN_VARIANCE dial")
    parser.add_argument("--motion", type=int, choices=range(1, 11), metavar="1-10", help="MOTION_INTENSITY dial")
    parser.add_argument("--density", type=int, choices=range(1, 11), metavar="1-10", help="VISUAL_DENSITY dial")
    args = parser.parse_args()

    if args.design_system:
        result = generate_design_system(args.query, args.project_name, args.format, persist=args.persist, page=args.page, output_dir=args.output_dir, variance=args.variance, motion=args.motion, density=args.density, force=args.force)
        if args.json:
            print(json_module.dumps({"design_system": result["design_system"], "persistence": result["persistence"]}, indent=2, ensure_ascii=False))
        else:
            print(result["text"])
            if args.persist and result["persistence"]:
                p = result["persistence"]
                if p.get("status") == "skipped_exists":
                    print(f"\n{p.get('message', 'MASTER.md already exists')}")
                else:
                    print(f"\nDesign system persisted to {p.get('design_system_dir', '')}/")
    elif args.stack:
        result = search_stack(args.query, args.stack, args.max_results)
        if args.json:
            print(json_module.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_output(result, full=args.full))
    else:
        result = search(args.query, args.domain, args.max_results)
        if args.json:
            print(json_module.dumps(result, indent=2, ensure_ascii=False))
        else:
            print(format_output(result, full=args.full))
