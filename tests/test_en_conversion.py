"""Tests for convert_en_chapter — English paragraph-to-Markdown conversion."""

import pytest
from convert_docx import convert_en_chapter


def _make_paras(*texts):
    """Return a flat list of paragraph strings with indices starting at 0."""
    return list(texts)


class TestConvertEnChapterBasic:
    """Core formatting behaviour."""

    def test_simple_paragraphs(self):
        paras = _make_paras("Hello world.", "Second paragraph.", "Third paragraph.")
        result = convert_en_chapter(paras, 0, 3, "My Title", None, [])
        assert result.startswith("# My Title\n")
        assert "Hello world." in result
        assert "Second paragraph." in result
        assert "Third paragraph." in result

    def test_part_info_present(self):
        paras = _make_paras("Body text.")
        result = convert_en_chapter(paras, 0, 1, "Title", "Part 1: Building with God", [])
        assert result.startswith('> **Part 1: Building with God**\n')
        assert "# Title" in result

    def test_part_info_none(self):
        paras = _make_paras("Body text.")
        result = convert_en_chapter(paras, 0, 1, "Title", None, [])
        assert result.startswith("# Title\n")

    def test_title_as_h1(self):
        paras = _make_paras("text")
        result = convert_en_chapter(paras, 0, 1, "The House That God Builds", None, [])
        assert "# The House That God Builds" in result


class TestConvertEnChapterFiltering:
    """Running headers and copyright lines are removed."""

    def test_running_header_filtered(self):
        paras = _make_paras("Building with God", "Actual content.")
        result = convert_en_chapter(paras, 0, 2, "Title", None, [])
        lines = result.splitlines()
        assert "Building with God" not in lines

    def test_copyright_filtered(self):
        paras = _make_paras(
            "(Unpublished manuscript—copyright protected Baker Publishing Group)",
            "Real text.",
        )
        result = convert_en_chapter(paras, 0, 2, "Title", None, [])
        assert "Baker Publishing" not in result


class TestConvertEnChapterSections:
    """Section headings and prayer prompts."""

    def test_section_becomes_h2(self):
        paras = _make_paras("Creating Culture", "Some text.")
        result = convert_en_chapter(paras, 0, 2, "Title", None, ["Creating Culture"])
        assert "## Creating Culture" in result

    def test_prayer_prompts_becomes_h3(self):
        paras = _make_paras("Prayer Prompts", "Pray about this.")
        result = convert_en_chapter(paras, 0, 2, "Title", None, ["Prayer Prompts"])
        assert "### \U0001f64f Prayer Prompts" in result

    def test_prayer_prompt_singular(self):
        paras = _make_paras("Prayer Prompt")
        result = convert_en_chapter(paras, 0, 1, "Title", None, ["Prayer Prompt"])
        assert "### \U0001f64f Prayer Prompt" in result


class TestConvertEnChapterScripture:
    """Scripture references become blockquotes when short enough."""

    def test_short_scripture_blockquote(self):
        paras = _make_paras("John 3:16")
        result = convert_en_chapter(paras, 0, 1, "Title", None, [])
        assert "> *John 3:16*" in result

    def test_long_scripture_stays_paragraph(self):
        long_text = "John " + "x" * 80 + " 3:16"
        paras = _make_paras(long_text)
        result = convert_en_chapter(paras, 0, 1, "Title", None, [])
        assert "> *" not in result
        assert long_text in result


class TestConvertEnChapterMisc:
    """Ibid and blank-line collapsing."""

    def test_ibid_italicised(self):
        paras = _make_paras("Ibid.")
        result = convert_en_chapter(paras, 0, 1, "Title", None, [])
        assert "*Ibid.*" in result

    def test_multiple_blank_lines_collapsed(self):
        paras = _make_paras("A", "", "", "", "B")
        result = convert_en_chapter(paras, 0, 5, "Title", None, [])
        assert "\n\n\n" not in result
