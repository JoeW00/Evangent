"""Tests for convert_zh_file — Chinese .docx-to-Markdown conversion (mocked)."""

import pytest
from unittest.mock import patch, MagicMock

from convert_docx import convert_zh_file


def _mock_paragraphs(texts):
    """Build a list of Mock paragraph objects with .text attributes."""
    paras = []
    for t in texts:
        p = MagicMock()
        p.text = t
        paras.append(p)
    return paras


def _call_convert(texts, title="測試標題", part_info=None):
    """Helper: patch docx.Document and call convert_zh_file."""
    mock_doc = MagicMock()
    mock_doc.paragraphs = _mock_paragraphs(texts)
    with patch("convert_docx.docx.Document", return_value=mock_doc):
        return convert_zh_file("fake.docx", title, part_info)


class TestConvertZhFileHeader:
    """Part info and title rendering."""

    def test_part_info_blockquote(self):
        result = _call_convert(["正文內容"], title="標題", part_info="第一部：與神一同建造")
        assert result.startswith('> **第一部：與神一同建造**\n')

    def test_title_as_h1(self):
        result = _call_convert(["正文內容"], title="神所建造的殿")
        assert "# 神所建造的殿" in result

    def test_no_part_info_starts_with_h1(self):
        result = _call_convert(["正文內容"], title="標題", part_info=None)
        assert result.startswith("# 標題\n")


class TestConvertZhFileSections:
    """Section and prayer-prompt heading detection."""

    def test_known_section_becomes_h2(self):
        result = _call_convert(["真實的文化", "一些正文"])
        assert "## 真實的文化" in result

    def test_prayer_prompt_becomes_h3(self):
        result = _call_convert(["禱告提示", "禱告內容"])
        assert "### \U0001f64f 禱告提示" in result


class TestConvertZhFileSkipping:
    """Leading title/chapter-number paragraphs are skipped."""

    def test_leading_chapter_number_skipped(self):
        result = _call_convert(["第一章", "測試標題", "正文"], title="測試標題")
        lines = result.splitlines()
        # "第一章" should not appear as a body paragraph
        assert "第一章" not in lines

    def test_title_paragraph_skipped(self):
        result = _call_convert(["測試標題", "正文"], title="測試標題")
        # The title should appear only in the H1, not duplicated as body text
        body_lines = result.split("\n\n", 1)[-1]
        assert body_lines.strip().startswith("正文")


class TestConvertZhFileFormatting:
    """Regular text, blank-line collapsing, trailing newline."""

    def test_regular_text_passes_through(self):
        result = _call_convert(["這是普通的正文段落。"])
        assert "這是普通的正文段落。" in result

    def test_multiple_blank_lines_collapsed(self):
        result = _call_convert(["段落一", "", "", "", "段落二"])
        assert "\n\n\n" not in result

    def test_output_ends_with_single_newline(self):
        result = _call_convert(["正文"])
        assert result.endswith("\n")
        assert not result.endswith("\n\n")
