"""Pytest configuration for Evangent test suite."""

import sys
import os

# Ensure the project root is on sys.path so `import convert_docx` works.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
