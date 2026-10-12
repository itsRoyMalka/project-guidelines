"""Check handbook links and structure; application examples are not executed."""
from pathlib import Path
import re
import subprocess
import sys
import unicodedata
from urllib.parse import unquote, urlsplit

from markdown_it import MarkdownIt

MARKDOWN = MarkdownIt('commonmark')
RULE_DEFINITION = re.compile(r'^\*\*([A-Z][A-Z0-9-]*-\d+) (?:MUST|SHOULD|retired)', re.M)


def walk_tokens(tokens):
    for token in tokens:
        yield token
        yield from walk_tokens(token.children or [])


def anchors(tokens):
    result = set()
    for index, token in enumerate(tokens):
        if token.type == 'heading_open':
            children = tokens[index + 1].children or []
            text = ''.join(t.content for t in children if t.type in ('text', 'code_inline'))
            slug = ''.join(c for c in text.lower() if c in '-_ ' or unicodedata.category(c)[0] not in 'PSZC').replace(' ', '-')
            candidate, count = slug, 0
            while candidate in result:
                count += 1
                candidate = f'{slug}-{count}'
            result.add(candidate)
    for token in walk_tokens(tokens):
        if token.type in ('html_block', 'html_inline'):
            result.update(re.findall(r'\b(?:id|name)=["\']([^"\']+)', token.content))
    return result


def check(root, paths, tracked_paths=None):
    errors, rule_owners = [], {}
    parsed = {path: MARKDOWN.parse(path.read_text(encoding='utf-8')) for path in paths}
    for path, tokens in parsed.items():
        lines = path.read_text(encoding='utf-8').splitlines()
        excluded = set()
        for token in tokens:
            if token.type in ('fence', 'code_block') and token.map:
                start, end = token.map
                excluded.update(range(start, end))
                if token.type == 'fence':
                    marker = re.escape(token.markup[0])
                    closing = rf'^\s{{0,3}}{marker}{{{len(token.markup)},}}\s*$'
                    if end <= start + 1 or not re.fullmatch(closing, lines[end - 1]):
                        errors.append(f'{path}: unclosed code fence')
        body = '\n'.join(line for index, line in enumerate(lines) if index not in excluded)
        if path.is_relative_to(root / 'guides'):
            for rule in RULE_DEFINITION.findall(body):
                if rule in rule_owners:
                    errors.append(f'{path}: duplicate rule {rule} (also {rule_owners[rule]})')
                rule_owners[rule] = path
        for token in walk_tokens(tokens):
            destination = token.attrGet('href') if token.type == 'link_open' else token.attrGet('src') if token.type == 'image' else None
            if destination is None:
                continue
            parts = urlsplit(destination)
            if parts.scheme or parts.netloc:
                continue
            target = (path.parent / unquote(parts.path)).resolve() if parts.path else path
            if not target.is_relative_to(root):
                errors.append(f'{path}: link escapes checkout: {destination}')
            elif not target.is_file() and not target.is_dir():
                errors.append(f'{path}: missing link: {destination}')
            elif tracked_paths is not None and target.is_file() and target not in tracked_paths:
                errors.append(f'{path}: link target is not tracked: {destination}')
            elif parts.fragment and target.suffix == '.md':
                target_tokens = parsed.get(target)
                if target_tokens is None:
                    target_tokens = MARKDOWN.parse(target.read_text(encoding='utf-8'))
                if unquote(parts.fragment) not in anchors(target_tokens):
                    errors.append(f'{path}: missing anchor: {destination}')
    return errors


if __name__ == '__main__':
    root = Path.cwd().resolve()
    tracked = subprocess.check_output(['git', 'ls-files', '-z'], text=True).split('\0')
    tracked_paths = {root / name for name in tracked if name}
    paths = sorted(path for path in tracked_paths if path.suffix == '.md')
    errors = check(root, paths, tracked_paths)
    print('\n'.join(errors) if errors else f'Passed: {len(paths)} Markdown files; local links/anchors, fences, unique rule IDs.')
    print('Scope: CommonMark links/images, including resolved references; not runtime-example verification or a privacy audit.')
    sys.exit(bool(errors))
