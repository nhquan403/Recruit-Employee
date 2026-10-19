#!/usr/bin/env python3
"""Xuất kịch bản nói (.md) sang bản in được .docx và .pdf.

Dùng pandoc với `--reference-doc` để có font/cỡ chữ nhất quán với báo cáo chính (đọc từ
docs/bao-cao/quy-dinh.md qua cau_hinh.py — một nguồn duy nhất, không chép tay font/cỡ chữ ở
đây). KHÔNG dùng thẳng thesis/doc/*.docx của báo cáo làm --reference-doc: tệp đó có 12 ảnh báo
cáo nhúng sẵn (vài MB) và pandoc có thể copy cả thư mục media của tệp mẫu sang kết quả, khiến
một kịch bản dạng text thuần phình từ vài chục KB lên cả chục MB. Thay vào đó tự dựng một bản
mẫu RỖNG từ chính pandoc (`pandoc --print-default-data-file reference.docx`, không có ảnh nào)
rồi chỉnh font bằng python-docx — tệp mẫu trung gian này không commit vào repo, tự dựng lại mỗi
lần chạy.

Cách dùng:
    python3 scripts/xuat-kich-ban-in.py
"""
from __future__ import annotations

import subprocess
import sys
import tempfile
from pathlib import Path

GOC_REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(GOC_REPO / "scripts"))

from docx import Document  # noqa: E402
from docx.oxml import OxmlElement  # noqa: E402
from docx.oxml.ns import qn  # noqa: E402
from docx.shared import Pt  # noqa: E402

from bao_cao.cau_hinh import doc_quy_dinh  # noqa: E402

NGUON_MD = GOC_REPO / "thesis" / "kich-ban" / "KichBanNoi-CSN-DX23TT11-BuiAnhKhoa.md"
RA_DOCX = GOC_REPO / "thesis" / "kich-ban" / "KichBanNoi-CSN-DX23TT11-BuiAnhKhoa.docx"
RA_PDF = GOC_REPO / "thesis" / "kich-ban" / "KichBanNoi-CSN-DX23TT11-BuiAnhKhoa.pdf"


def dung_mau_rong_co_font_dung(duong_dan_ra: Path) -> None:
    """pandoc --print-default-data-file reference.docx: mẫu rỗng của chính pandoc, không có
    ảnh nào — rồi chỉnh font Normal theo đúng quy-dinh.md (Times New Roman, cùng cỡ chữ báo
    cáo chính), không chép tay font/cỡ chữ ở đây."""
    qd = doc_quy_dinh().hinh_thuc
    with open(duong_dan_ra, "wb") as f:
        subprocess.run(
            ["pandoc", "--print-default-data-file", "reference.docx"],
            stdout=f,
            check=True,
        )
    doc = Document(str(duong_dan_ra))
    # Lấy sẵn tham chiếu style TRƯỚC khi sửa bất kỳ style nào — tra lại bằng tên (doc.styles[...])
    # XEN KẼ với việc sửa style khác từng gây lỗi thật "KeyError: no style with name 'Heading 1'"
    # trên chính tệp mẫu rỗng của pandoc (không tái hiện trên Document() mặc định của
    # python-docx) — nguyên nhân cụ thể chưa rõ, nhưng lấy hết tham chiếu một lượt rồi mới sửa
    # thì luôn ổn định, đã kiểm tra lại bằng cách tạo mới rồi mở lại tệp.
    can_sua = {s.name: s for s in doc.styles if s.name in ("Normal", "Heading 1", "Heading 2")}
    for ten_style, style in can_sua.items():
        style.font.name = qd.font_name
        rpr = style.element.get_or_add_rPr()
        rfonts = rpr.find(qn("w:rFonts"))
        if rfonts is None:
            rfonts = OxmlElement("w:rFonts")
            rpr.append(rfonts)
        for thuoc_tinh_theme in ("w:asciiTheme", "w:eastAsiaTheme", "w:hAnsiTheme", "w:cstheme"):
            qn_attr = qn(thuoc_tinh_theme)
            if rfonts.get(qn_attr) is not None:
                del rfonts.attrib[qn_attr]
        for thuoc_tinh in ("w:ascii", "w:hAnsi", "w:eastAsia", "w:cs"):
            rfonts.set(qn(thuoc_tinh), qd.font_name)
    doc.styles["Normal"].font.size = Pt(qd.font_size_pt)
    doc.save(str(duong_dan_ra))


def main() -> None:
    if not NGUON_MD.exists():
        print(f"Chưa có {NGUON_MD} — chạy scripts/tao-kich-ban.py trước.", file=sys.stderr)
        sys.exit(1)

    RA_DOCX.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        duong_dan_mau = Path(tmp) / "mau-rong.docx"
        dung_mau_rong_co_font_dung(duong_dan_mau)

        subprocess.run(
            [
                "pandoc",
                str(NGUON_MD),
                "-o",
                str(RA_DOCX),
                f"--reference-doc={duong_dan_mau}",
            ],
            check=True,
        )

    dung_luong_docx_kb = RA_DOCX.stat().st_size / 1024
    print(f"Đã xuất {RA_DOCX} ({dung_luong_docx_kb:.0f} KB)")
    if dung_luong_docx_kb > 2000:
        print(
            "CẢNH BÁO: tệp .docx kịch bản lớn bất thường (>2MB) cho một tệp text thuần — kiểm "
            "tra lại xem --reference-doc có mang theo ảnh không.",
            file=sys.stderr,
        )

    subprocess.run(
        [
            "soffice",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            str(RA_PDF.parent),
            str(RA_DOCX),
        ],
        check=True,
    )
    print(f"Đã xuất {RA_PDF} ({RA_PDF.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
