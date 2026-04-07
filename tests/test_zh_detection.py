"""Tests for Chinese section-title and scripture-reference detection helpers."""

import pytest
from convert_docx import is_zh_section_title, is_scripture_ref_zh


# ── is_zh_section_title ──────────────────────────────────────────────────────


class TestIsZhSectionTitle:
    """Tests for is_zh_section_title(text, prev_empty, next_empty)."""

    def test_known_title_true(self):
        assert is_zh_section_title("真實的文化", True, True) is True

    def test_another_known_title(self):
        assert is_zh_section_title("腦海中的孤兒院", False, False) is True

    def test_regular_text_false(self):
        assert is_zh_section_title("這是一段普通的文字", True, True) is False

    def test_empty_string_false(self):
        assert is_zh_section_title("", True, True) is False

    def test_whitespace_only_false(self):
        assert is_zh_section_title("   ", True, True) is False

    def test_surrounding_whitespace_stripped(self):
        assert is_zh_section_title("  真實的文化  ", True, True) is True

    def test_substring_false(self):
        assert is_zh_section_title("真實的", True, True) is False

    def test_dialogue_text_false(self):
        assert is_zh_section_title("「你要去哪裡？」他說。", True, True) is False


# ── is_scripture_ref_zh ──────────────────────────────────────────────────────


class TestIsScriptureRefZh:
    """Tests for is_scripture_ref_zh(text)."""

    def test_simple_reference_true(self):
        assert is_scripture_ref_zh("詩篇 23:1") is True

    def test_reference_with_brackets(self):
        assert is_scripture_ref_zh("「約翰福音 3:16」") is True

    def test_long_string_false(self):
        long_text = "詩篇 23:1 — 這是一段非常長的文字，裡面提到了詩篇但是整段文字遠遠超過六十個字元的限制，所以不應該被判定為經文引用，因為經文引用應當是短句。"
        assert len(long_text.strip()) >= 60
        assert is_scripture_ref_zh(long_text) is False

    def test_no_scripture_false(self):
        assert is_scripture_ref_zh("今天是美好的一天") is False

    def test_empty_string_false(self):
        assert is_scripture_ref_zh("") is False
