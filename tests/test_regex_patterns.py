"""Tests for SCRIPTURE_PATTERN and EN_SCRIPTURE_PATTERN regex objects."""

import pytest
from convert_docx import SCRIPTURE_PATTERN, EN_SCRIPTURE_PATTERN


# ── Chinese SCRIPTURE_PATTERN ────────────────────────────────────────────────


class TestScripturePatternZh:
    """SCRIPTURE_PATTERN allows up to 5 leading chars + optional opening bracket."""

    def test_simple_match(self):
        assert SCRIPTURE_PATTERN.search("創世記 1:1") is not None

    def test_match_with_bracket(self):
        assert SCRIPTURE_PATTERN.search("「啟示錄 22:17」") is not None

    def test_match_with_leading_chars(self):
        # "參見" is 2 chars; well within 5-char prefix allowance
        assert SCRIPTURE_PATTERN.search("參見以賽亞書 53:5") is not None

    def test_too_many_leading_chars_no_match(self):
        # "我最喜歡的經文是" is 8 chars, exceeds the .{0,5} prefix allowance
        assert SCRIPTURE_PATTERN.search("我最喜歡的經文是創世記 1:1") is None


# ── English EN_SCRIPTURE_PATTERN ─────────────────────────────────────────────


class TestEnScripturePattern:
    """EN_SCRIPTURE_PATTERN is anchored at ^ and case-insensitive."""

    def test_simple_match(self):
        assert EN_SCRIPTURE_PATTERN.match("John 3:16") is not None

    def test_numbered_book(self):
        assert EN_SCRIPTURE_PATTERN.match("1 Corinthians 13:4") is not None

    def test_psalms(self):
        assert EN_SCRIPTURE_PATTERN.match("Psalms 119:105") is not None

    def test_not_at_start_no_match(self):
        assert EN_SCRIPTURE_PATTERN.match("I love John 3:16") is None

    def test_no_digit_no_match(self):
        assert EN_SCRIPTURE_PATTERN.match("John said something") is None

    def test_case_insensitive(self):
        assert EN_SCRIPTURE_PATTERN.match("john 3:16") is not None
