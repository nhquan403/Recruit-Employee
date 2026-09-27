"""Parse một file Markdown nguồn (docs/bao-cao/*.md) thành một danh sách node có kiểu.

Không dùng thư viện Markdown tổng quát (mistune/markdown-it) vì cần các chỉ thị riêng của
quy trình này (\\pagebreak, \\khoiky, placeholder [Hình X.Y], bảng có dòng căn lề) mà các thư
viện đó không hiểu — một parser dòng-theo-dòng đơn giản, đúng phạm vi, dễ kiểm soát hơn.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

_HEADING_RE = re.compile(r"^(#{1,4})\s+(.*)$")
_BULLET_RE = re.compile(r"^[-*]\s+(.*)$")
_NUMBER_RE = re.compile(r"^\d+\.\s+(.*)$")
_TABLE_ROW_RE = re.compile(r"^\|(.+)\|\s*$")
_TABLE_SEP_RE = re.compile(r"^\|[\s:-]+\|[\s:-]+.*$")
_IMAGE_PLACEHOLDER_RE = re.compile(r"^\[Hình\s+([\d.]+)\]\s*$")
_MD_IMAGE_RE = re.compile(r"^!\[([^\]]*)\]\(([^)]+)\)\s*$")
_CAPTION_HINT_RE = re.compile(r"Hình\s+([\d.]+)\s+thể hiện", re.UNICODE)
_SOURCE_LINE_RE = re.compile(r"^Nguồn:\s*(.*)$")
_COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
_BLOCK_MATH_START_RE = re.compile(r"^\$\$\s*$")
_CODE_FENCE_RE = re.compile(r"^```(\w*)\s*$")


@dataclass
class Node:
    type: str
    data: dict[str, Any] = field(default_factory=dict)


def _strip_comments(text: str) -> str:
    """Bỏ toàn bộ dòng/khối `<!-- ... -->` — đây là metadata của bộ chuyển đổi, không phải
    nội dung báo cáo, không được in ra giấy (bài học từ Bước 2 của quy trình gốc)."""
    return _COMMENT_RE.sub("", text)


def _table_align(sep_line: str) -> list[str]:
    aligns = []
    for cell in sep_line.strip().strip("|").split("|"):
        cell = cell.strip()
        if cell.startswith(":") and cell.endswith(":"):
            aligns.append("center")
        elif cell.endswith(":"):
            aligns.append("right")
        elif cell.startswith(":"):
            aligns.append("left")
        else:
            aligns.append("left")
    return aligns


def parse_file(duong_dan: Path) -> list[Node]:
    text = _strip_comments(duong_dan.read_text(encoding="utf-8"))
    lines = text.splitlines()
    nodes: list[Node] = []
    i = 0
    last_paragraph_text = ""

    while i < len(lines):
        raw = lines[i]
        line = raw.strip()

        if not line:
            i += 1
            continue

        if line == r"\pagebreak":
            nodes.append(Node("pagebreak"))
            i += 1
            continue

        if line == r"\canle":
            nodes.append(Node("can_le_bat_dau"))
            i += 1
            continue

        if line == r"\hetcanle":
            nodes.append(Node("can_le_ket_thuc"))
            i += 1
            continue

        if line == r"\khoangtrang":
            nodes.append(Node("khoang_trang"))
            i += 1
            continue

        if line == r"\mucluc":
            nodes.append(Node("mucluc_directive"))
            i += 1
            continue

        if line == r"\khoiky":
            # Khối ký tên: gom các dòng liền sau cho tới dòng trống, không được vỡ đôi khi in.
            i += 1
            block_lines = []
            while i < len(lines) and lines[i].strip():
                block_lines.append(lines[i].strip())
                i += 1
            nodes.append(Node("khoiky", {"lines": block_lines}))
            continue

        m = _HEADING_RE.match(line)
        if m:
            level = len(m.group(1))
            nodes.append(Node("heading", {"level": level, "text": m.group(2).strip()}))
            i += 1
            continue

        m = _IMAGE_PLACEHOLDER_RE.match(line)
        if m:
            so_hinh = m.group(1)
            caption = None
            cap_m = _CAPTION_HINT_RE.search(last_paragraph_text)
            if cap_m and cap_m.group(1) == so_hinh:
                caption = last_paragraph_text.strip()
            source_line = None
            if i + 1 < len(lines):
                sm = _SOURCE_LINE_RE.match(lines[i + 1].strip())
                if sm:
                    source_line = lines[i + 1].strip()
                    i += 1
            nodes.append(
                Node(
                    "image_placeholder",
                    {"so_hinh": so_hinh, "caption": caption, "source_line": source_line},
                )
            )
            i += 1
            continue

        m = _MD_IMAGE_RE.match(line)
        if m:
            alt, path = m.group(1), m.group(2)
            source_line = None
            if i + 1 < len(lines):
                sm = _SOURCE_LINE_RE.match(lines[i + 1].strip())
                if sm:
                    source_line = lines[i + 1].strip()
                    i += 1
            nodes.append(Node("image", {"alt": alt, "path": path, "source_line": source_line}))
            i += 1
            continue

        if _TABLE_ROW_RE.match(line) and i + 1 < len(lines) and _TABLE_SEP_RE.match(lines[i + 1].strip()):
            header = [c.strip() for c in line.strip().strip("|").split("|")]
            align = _table_align(lines[i + 1].strip())
            i += 2
            rows: list[list[str]] = []
            while i < len(lines) and _TABLE_ROW_RE.match(lines[i].strip()):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            nodes.append(Node("table", {"header": header, "align": align, "rows": rows}))
            continue

        if _BULLET_RE.match(line):
            items = []
            while i < len(lines) and _BULLET_RE.match(lines[i].strip()):
                items.append(_BULLET_RE.match(lines[i].strip()).group(1))
                i += 1
            nodes.append(Node("bullet_list", {"items": items}))
            continue

        if _NUMBER_RE.match(line):
            items = []
            while i < len(lines) and _NUMBER_RE.match(lines[i].strip()):
                items.append(_NUMBER_RE.match(lines[i].strip()).group(1))
                i += 1
            nodes.append(Node("number_list", {"items": items}))
            continue

        if _CODE_FENCE_RE.match(line):
            ngon_ngu = _CODE_FENCE_RE.match(line).group(1)
            i += 1
            code_lines = []
            while i < len(lines) and lines[i].strip() != "```":
                code_lines.append(lines[i])
                i += 1
            i += 1  # bỏ dòng ``` đóng
            nodes.append(Node("code_block", {"ngon_ngu": ngon_ngu, "code": "\n".join(code_lines)}))
            continue

        if _BLOCK_MATH_START_RE.match(line):
            i += 1
            math_lines = []
            while i < len(lines) and lines[i].strip() != "$$":
                math_lines.append(lines[i])
                i += 1
            i += 1  # bỏ dòng `$$` đóng
            nodes.append(Node("math_block", {"latex": "\n".join(math_lines)}))
            continue

        # Đoạn văn thường — gom các dòng liên tiếp không trống thành 1 đoạn.
        para_lines = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not any(
            pat.match(lines[i].strip())
            for pat in (_HEADING_RE, _BULLET_RE, _NUMBER_RE, _TABLE_ROW_RE, _IMAGE_PLACEHOLDER_RE, _MD_IMAGE_RE, _CODE_FENCE_RE, _BLOCK_MATH_START_RE)
        ) and lines[i].strip() not in (
            r"\pagebreak",
            r"\khoiky",
            r"\mucluc",
            r"\canle",
            r"\hetcanle",
            r"\khoangtrang",
        ):
            para_lines.append(lines[i].strip())
            i += 1
        para_text = " ".join(para_lines)
        nodes.append(Node("paragraph", {"text": para_text}))
        last_paragraph_text = para_text

    return nodes
