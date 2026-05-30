import re
from collections import defaultdict

FILE = '/tmp/185www.github.io/pomotodo/style.css'

with open(FILE, 'r') as f:
    content = f.read()

def normalize(s):
    # Remove ALL whitespace for comparison (body properties)
    # This makes `display: flex;` compare equal to `display:flex;`
    return re.sub(r'\s+', '', s)

segments = []
pos = 0

while pos < len(content):
    if content[pos] in ' \t\n\r':
        start = pos
        while pos < len(content) and content[pos] in ' \t\n\r':
            pos += 1
        segments.append(('ws', content[start:pos], None))
        continue

    if content[pos:pos+2] == '/*':
        start = pos
        end = content.find('*/', pos+2)
        if end == -1:
            end = len(content)
        else:
            end += 2
        segments.append(('comment', content[start:end], None))
        pos = end
        continue

    if content[pos] == '@':
        start = pos
        # Only look for { on the same line (to avoid broken @-rules consuming far-away braces)
        nl = content.find('\n', pos)
        end_of_line = nl if nl != -1 else len(content)
        brace_idx = content.find('{', pos, end_of_line)
        if brace_idx != -1:
            depth = 0
            end = brace_idx
            while end < len(content):
                if content[end] == '{':
                    depth += 1
                elif content[end] == '}':
                    depth -= 1
                    if depth == 0:
                        end += 1
                        break
                end += 1
        else:
            semi = content.find(';', pos)
            if semi != -1 and semi < end_of_line:
                end = semi + 1
            else:
                end = end_of_line
        raw = content[start:end]
        segments.append(('at-rule', raw, normalize(raw)))
        pos = end
        continue

    # Check if this looks like a CSS rule start (selector chars, not stray braces)
    c = content[pos]
    if c in '}):;{':
        segments.append(('other', content[pos], None))
        pos += 1
        continue

    if '{' in content[pos:]:
        start = pos
        nl = content.find('\n', pos)
        end_of_line = nl if nl != -1 else len(content)
        brace = content.find('{', pos)
        if brace >= end_of_line:
            # { is not on the same line - this is not a valid rule, skip
            segments.append(('other', content[pos], None))
            pos += 1
            continue
        depth = 0
        end = brace
        while end < len(content):
            if content[end] == '{':
                depth += 1
            elif content[end] == '}':
                depth -= 1
                if depth == 0:
                    end += 1
                    break
            end += 1
        selector = content[start:brace].strip()
        body = normalize(content[brace+1:end-1].strip())
        raw = content[start:end]
        segments.append(('rule', raw, (selector, body)))
        pos = end
        continue

    # Fallback: skip
    segments.append(('other', content[pos], None))
    pos += 1

# Count occurrences of each dedup key
counts = defaultdict(list)
for i, (typ, raw, key) in enumerate(segments):
    if typ in ('rule', 'at-rule'):
        counts[key].append(i)

keep_indices = set()
for i, (typ, raw, key) in enumerate(segments):
    if typ in ('ws', 'comment', 'other'):
        keep_indices.add(i)
    elif typ in ('rule', 'at-rule'):
        occs = counts[key]
        if i == occs[-1]:
            keep_indices.add(i)

# Build output by concatenating kept segments
output = ''.join(segments[i][1] for i in sorted(keep_indices))

# --- Post-cleanup: ensure [hidden] rules exist for overlays ---
hidden_checks = {
    '.daily-launch-overlay[hidden]': 'display:none !important',
    '.daily-review-overlay[hidden]': 'display:none !important',
    '.rest-guide-overlay[hidden]': 'display:none !important',
    '.celebration-overlay[hidden]': 'display:none !important',
}

# Check if these rules exist in the output
lines = output.split('\n')
hidden_rules_found = set()
for line in lines:
    for selector in hidden_checks:
        stripped = line.strip()
        if stripped.startswith(selector) or stripped.startswith(selector.replace(' ', '')):
            hidden_rules_found.add(selector)

missing = []
for selector, props in hidden_checks.items():
    if selector not in hidden_rules_found:
        # Also check without spaces
        found = False
        for line in lines:
            stripped = line.strip().rstrip('{').rstrip()
            # Match the selector at start of line
            if stripped.replace(' ', '') == selector.replace(' ', '').rstrip('{').rstrip():
                found = True
                break
        if not found:
            missing.append((selector, props))

for selector, props in missing:
    output += '\n' + selector + ' { ' + props + '; }\n'

with open(FILE, 'w') as f:
    f.write(output)

final_lines = output.count('\n')
if output and not output.endswith('\n'):
    final_lines += 1
print(f"Final line count: {final_lines}")
total_occs = sum(len(v) for v in counts.values())
print(f"Duplicate rules removed: {total_occs - len(counts)}")
print(f"[hidden] rules added: {len(missing)}")
