import tempfile
import unittest
from pathlib import Path
from handbook import check


class HandbookChecks(unittest.TestCase):
    def test_broken_link_anchor_duplicate_rule_and_fence_fail(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            guides = root / 'guides'
            guides.mkdir()
            first = guides / 'first.md'
            second = guides / 'second.md'
            first.write_text('**ABC-01 MUST:** rule\n[missing](absent.md)\n[bad anchor](second.md#missing)\n```ts\n')
            second.write_text('# Present\n**ABC-01 MUST:** duplicate\n')
            errors = check(root, [first, second])
            self.assertEqual(len(errors), 4, errors)

    def test_valid_links_and_examples_pass(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            page = root / 'page.md'
            page.write_text('# Hello world\n[valid](#hello-world)\n```md\n[example](not-real.md)\n```\n')
            self.assertEqual(check(root, [page]), [])
