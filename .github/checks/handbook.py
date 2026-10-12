"""Repository maintenance checks; not an application or exported handbook tool."""
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import unquote, urlsplit


def prose(text):
    lines, fence = [], None
    for line in text.splitlines():
        marker = re.match(r'^\s{0,3}(`{3,}|~{3,})', line)
        if marker:
            value = marker[1]
            if fence is None:
                fence = value
            elif value[0] == fence[0] and len(value) >= len(fence):
                fence = None
            continue
        if fence is None:
            lines.append(line)
    return '\n'.join(lines), fence


def anchors(text):
    result, counts = set(), {}
    for heading in re.findall(r'^#{1,6}\s+(.+)', prose(text)[0], re.M):
        slug = re.sub(r'[^\w\- ]', '', heading.strip().lower()).replace(' ', '-')
        n = counts.get(slug, 0)
        counts[slug] = n + 1
        result.add(f'{slug}-{n}' if n else slug)
    result.update(re.findall(r'<a\s+(?:id|name)=["\']([^"\']+)', text))
    return result


def check(root, paths):
    errors, ids = [], {}
    for path in paths:
        text = path.read_text()
        body, fence = prose(text)
        if fence:
            errors.append(f'{path}: unclosed code fence')
        if path.is_relative_to(root / 'guides'):
            for rule in re.findall(r'^\*\*([A-Z][A-Z0-9-]*-\d+) (?:MUST|SHOULD|retired)', body, re.M):
                if rule in ids:
                    errors.append(f'{path}: duplicate rule {rule} (also {ids[rule]})')
                ids[rule] = path
        for destination in re.findall(r'(?<!!)\[[^\]\n]+\]\(([^)\n]+)\)', body):
            destination = destination.strip().split(' "')[0].strip('<>')
            parts = urlsplit(destination)
            if parts.scheme or parts.netloc:
                continue
            target = (path.parent / unquote(parts.path)).resolve() if parts.path else path
            if not target.is_relative_to(root):
                errors.append(f'{path}: link escapes checkout: {destination}')
            elif not target.exists():
                errors.append(f'{path}: missing link: {destination}')
            elif parts.fragment and target.suffix == '.md' and unquote(parts.fragment) not in anchors(target.read_text()):
                errors.append(f'{path}: missing anchor: {destination}')
    return errors


if __name__ == '__main__':
    root = Path.cwd().resolve()
    tracked = subprocess.check_output(['git', 'ls-files', '-z'], text=True).split('\0')
    paths = [root / name for name in tracked if name.endswith('.md')]
    errors = check(root, paths)
    print('\n'.join(errors) if errors else f'Passed: {len(paths)} Markdown files; local links/anchors, fences, unique rule IDs.')
    print('Scope: inline Markdown links outside fenced examples; not runtime-example verification or a privacy audit.')
    sys.exit(bool(errors))
