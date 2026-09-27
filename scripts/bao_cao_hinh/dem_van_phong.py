"""Đếm THẬT số cụm in đậm và số dấu gạch ngang dài (—) trong bản .docx cuối, theo từng chương —
đây là 2 dấu hiệu giọng văn máy móc đã đo được là thật (khác với "chứ không phải" — đã đo và
xác nhận không phải vấn đề, xem plan.md). Đọc lại paragraph.runs thật, không đếm trên Markdown
nguồn (định dạng in đậm có thể khác giữa `**text**` và run.bold=True thực tế trong OOXML).

Chạy: python3 scripts/bao_cao_hinh/dem_van_phong.py bao-cao/BaoCao-CSN-DX23TT11-BuiAnhKhoa.docx
"""
from __future__ import annotations

import sys
from pathlib import Path

from docx import Document


def main(duong_dan: str) -> None:
    doc = Document(duong_dan)
    chuong_hien_tai = "(trước MỞ ĐẦU)"
    thong_ke: dict[str, dict[str, int]] = {}

    for para in doc.paragraphs:
        if para.style.name == "Heading 1":
            chuong_hien_tai = para.text.strip()
            thong_ke.setdefault(chuong_hien_tai, {"in_dam": 0, "em_dash": 0, "so_doan": 0})
            continue

        so_lieu = thong_ke.setdefault(chuong_hien_tai, {"in_dam": 0, "em_dash": 0, "so_doan": 0})
        so_lieu["so_doan"] += 1
        for run in para.runs:
            if run.bold and run.text.strip():
                so_lieu["in_dam"] += 1
        so_lieu["em_dash"] += para.text.count("—")

    print(f"{'Chương':<55}{'In đậm':>8}{'Em-dash':>10}{'Số đoạn':>10}")
    tong_in_dam = tong_em_dash = tong_doan = 0
    for chuong, so_lieu in thong_ke.items():
        print(f"{chuong[:54]:<55}{so_lieu['in_dam']:>8}{so_lieu['em_dash']:>10}{so_lieu['so_doan']:>10}")
        tong_in_dam += so_lieu["in_dam"]
        tong_em_dash += so_lieu["em_dash"]
        tong_doan += so_lieu["so_doan"]
    print("-" * 83)
    print(f"{'TỔNG':<55}{tong_in_dam:>8}{tong_em_dash:>10}{tong_doan:>10}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "bao-cao/BaoCao-CSN-DX23TT11-BuiAnhKhoa.docx")
