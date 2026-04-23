#!/usr/bin/env python3
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
html = (root / 'Nozha-rtl-Dashboard-master' / 'index.html').read_text(encoding='utf-8')
keys = set(re.findall(r'data-i18n="([^"]+)"', html))

failed = False
for lang in ('ar', 'en'):
    locale_path = root / 'Nozha-rtl-Dashboard-master' / 'locales' / lang / 'common.json'
    data = json.loads(locale_path.read_text(encoding='utf-8'))
    missing = sorted(keys - set(data.keys()))
    if missing:
      failed = True
      print(f'[{lang}] Missing keys: {missing}')
    else:
      print(f'[{lang}] OK ({len(keys)} keys)')

if failed:
    raise SystemExit(1)
