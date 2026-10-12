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

    def test_images_and_reference_links_are_checked(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            page = root / 'page.md'
            page.write_text('![image](missing.png)\n[guide][reference]\n\n[reference]: absent.md\n')
            self.assertEqual(len(check(root, [page])), 2)

    def test_formatted_headings_parentheses_and_inline_code(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            page = root / 'page.md'
            target = root / 'guide(draft).md'
            target.write_text('# Use `api` and *model*\n')
            page.write_text('[guide](guide(draft).md#use-api-and-model)\n`[example](absent.md)`\n')
            self.assertEqual(check(root, [page, target]), [])

    def test_trailing_text_does_not_close_fence(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            page = root / 'page.md'
            page.write_text('```ts\ncode\n```not-a-closing-fence\n')
            self.assertTrue(any('unclosed' in error for error in check(root, [page])))

    def test_untracked_and_outside_checkout_targets_fail(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory).resolve()
            page = root / 'page.md'
            local = root / 'local.md'
            local.write_text('Untracked local file')
            page.write_text('[local](local.md)\n[outside](../private.md)\n')
            self.assertEqual(len(check(root, [page], {page})), 2)
