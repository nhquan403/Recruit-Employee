#!/usr/bin/env python3
"""Dựng bản thuyết trình .pptx từ scripts/noi-dung-slide.py (nguồn nội dung DUY NHẤT).

Không sửa tay vào .pptx đã xuất — sửa ở noi-dung-slide.py rồi chạy lại script này. Mọi slide có
tên tệp hình phải tồn tại thật trong docs/images/bao-cao/ (cùng thư mục ảnh báo cáo chính), nếu
thiếu script DỪNG NGAY bằng lỗi rõ ràng, không âm thầm dựng slide trống.

Bảng màu đọc trực tiếp từ frontend/tailwind.config.ts (không chép tay mã màu) — đổi màu giao
diện dự án thì slide tự động theo, không cần sửa script này.

Cách dùng:
    python3 scripts/tao-slide.py
"""
from __future__ import annotations

import importlib
import re
import sys
from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Emu, Inches, Pt

GOC_REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(GOC_REPO / "scripts"))

_noi_dung = importlib.import_module("noi-dung-slide")
SLIDES = _noi_dung.SLIDES
SLIDE_BAM_QUA_KHI_BAO_VE = _noi_dung.SLIDE_BAM_QUA_KHI_BAO_VE
doc_thong_tin_de_tai = _noi_dung.doc_thong_tin_de_tai

THU_MUC_ANH = GOC_REPO / "docs" / "images" / "bao-cao"
TAILWIND_CONFIG = GOC_REPO / "frontend" / "tailwind.config.ts"
DUONG_DAN_RA = GOC_REPO / "thesis" / "pptx" / "BanThuyetTrinh-CSN-DX23TT11-BuiAnhKhoa.pptx"


def doc_mau_du_an() -> dict[str, RGBColor]:
    """Đọc bảng màu thật từ frontend/tailwind.config.ts — KHÔNG chép tay mã màu ở đây. Parse
    bằng regex vì đây là TypeScript, không phải JSON hợp lệ."""
    if not TAILWIND_CONFIG.exists():
        raise FileNotFoundError(
            f"Không tìm thấy {TAILWIND_CONFIG} — không có token màu để đọc. Dừng, không tự "
            "chọn màu thay."
        )
    text = TAILWIND_CONFIG.read_text(encoding="utf-8")

    def _hex(pattern: str) -> str:
        m = re.search(pattern, text)
        if not m:
            raise ValueError(
                f"Không đọc được mã màu khớp mẫu {pattern!r} trong {TAILWIND_CONFIG} — kiểm "
                "tra lại cấu trúc colors{} có đổi không."
            )
        return m.group(1)

    return {
        "primary": RGBColor.from_string(_hex(r"primary:\s*\{\s*DEFAULT:\s*'#([0-9A-Fa-f]{6})'")),
        "primary_hover": RGBColor.from_string(_hex(r"primary:\s*\{[^}]*?hover:\s*'#([0-9A-Fa-f]{6})'")),
        "secondary": RGBColor.from_string(_hex(r"secondary:\s*'#([0-9A-Fa-f]{6})'")),
        "accent": RGBColor.from_string(_hex(r"accent:\s*'#([0-9A-Fa-f]{6})'")),
        "surface": RGBColor.from_string(_hex(r"surface:\s*'#([0-9A-Fa-f]{6})'")),
        "muted": RGBColor.from_string(_hex(r"muted:\s*'#([0-9A-Fa-f]{6})'")),
        "border": RGBColor.from_string(_hex(r"border:\s*'#([0-9A-Fa-f]{6})'")),
    }


def kiem_tra_du_anh() -> None:
    """Chốt chặn: thiếu bất kỳ tệp hình nào mà SLIDES tham chiếu thì DỪNG NGAY, liệt kê đủ,
    không dựng slide trống cho tệp thiếu."""
    thieu: list[str] = []
    for tieu_de, _bullets, ten_anh, _loi_noi in SLIDES:
        if ten_anh is None:
            continue
        if not (THU_MUC_ANH / ten_anh).exists():
            thieu.append(f"{ten_anh} (slide {tieu_de!r})")
    if thieu:
        print("LỖI: thiếu tệp hình sau, KHÔNG dựng slide — bổ sung ảnh rồi chạy lại:", file=sys.stderr)
        for t in thieu:
            print(f"  - {t}", file=sys.stderr)
        sys.exit(1)


def _dat_nen(slide, mau: RGBColor) -> None:
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = mau


def _them_hop_chu(slide, left, top, width, height):
    box = slide.shapes.add_textbox(left, top, width, height)
    tf = box.text_frame
    tf.word_wrap = True
    return tf


def dung_slide_bia(prs: Presentation, mau: dict, tieu_de: str, bullets: list[str]) -> None:
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # layout trống
    _dat_nen(slide, mau["surface"])

    # Thanh màu accent ở trên cùng
    thanh = slide.shapes.add_shape(1, 0, 0, prs.slide_width, Emu(Inches(0.18)))
    thanh.fill.solid()
    thanh.fill.fore_color.rgb = mau["accent"]
    thanh.line.fill.background()

    tf = _them_hop_chu(slide, Inches(0.9), Inches(2.0), prs.slide_width - Inches(1.8), Inches(2.2))
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    run = p.add_run()
    run.text = tieu_de
    run.font.size = Pt(32)
    run.font.bold = True
    run.font.color.rgb = mau["primary"]

    tf2 = _them_hop_chu(slide, Inches(0.9), Inches(4.5), prs.slide_width - Inches(1.8), Inches(2.3))
    for i, dong in enumerate(bullets):
        p = tf2.paragraphs[0] if i == 0 else tf2.add_paragraph()
        p.alignment = PP_ALIGN.CENTER
        run = p.add_run()
        run.text = dong
        run.font.size = Pt(16)
        run.font.color.rgb = mau["muted"]
        p.space_after = Pt(6)
    return slide


def dung_slide_noi_dung(
    prs: Presentation, mau: dict, tieu_de: str, bullets: list[str], ten_anh: str | None
) -> object:
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    _dat_nen(slide, mau["surface"])

    # Thanh tiêu đề
    thanh = slide.shapes.add_shape(1, 0, 0, prs.slide_width, Inches(1.1))
    thanh.fill.solid()
    thanh.fill.fore_color.rgb = mau["primary"]
    thanh.line.fill.background()
    tf_tieu_de = thanh.text_frame
    tf_tieu_de.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf_tieu_de.margin_left = Inches(0.5)
    p = tf_tieu_de.paragraphs[0]
    run = p.add_run()
    run.text = tieu_de
    run.font.size = Pt(26)
    run.font.bold = True
    run.font.color.rgb = mau["surface"]

    co_anh = ten_anh is not None
    rong_chu = Inches(6.0) if co_anh else prs.slide_width - Inches(1.0)

    tf = _them_hop_chu(slide, Inches(0.5), Inches(1.5), rong_chu, Inches(5.5))
    for i, dong in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        run = p.add_run()
        run.text = f"•  {dong}"
        run.font.size = Pt(18)
        run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)
        p.space_after = Pt(14)

    if co_anh:
        duong_dan_anh = THU_MUC_ANH / ten_anh
        left = Inches(6.8)
        top = Inches(1.6)
        max_w = prs.slide_width - left - Inches(0.4)
        max_h = Inches(5.3)
        slide.shapes.add_picture(str(duong_dan_anh), left, top, width=max_w, height=max_h)

        # Khung viền quanh ảnh cho rõ ràng
        vien = slide.shapes.add_shape(1, left - Emu(1), top - Emu(1), max_w + Emu(2), max_h + Emu(2))
        vien.fill.background()
        vien.line.color.rgb = mau["border"]
        vien.line.width = Pt(1)

    return slide


def main() -> None:
    kiem_tra_du_anh()
    mau = doc_mau_du_an()

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    for i, (tieu_de, bullets, ten_anh, loi_noi) in enumerate(SLIDES):
        if i == 0:
            slide = dung_slide_bia(prs, mau, tieu_de, bullets)
        else:
            slide = dung_slide_noi_dung(prs, mau, tieu_de, bullets, ten_anh)

        # Ghi chú người trình bày — BẮT BUỘC cho mọi slide.
        ghi_chu = loi_noi
        if i in SLIDE_BAM_QUA_KHI_BAO_VE:
            ghi_chu = (
                "[BẤM QUA khi bảo vệ — chỉ nói nhanh 1 câu, không đọc hết đoạn dưới. "
                "Đọc đầy đủ khi quay video nộp bài.]\n\n" + loi_noi
            )
        slide.notes_slide.notes_text_frame.text = ghi_chu

    DUONG_DAN_RA.parent.mkdir(parents=True, exist_ok=True)
    prs.save(str(DUONG_DAN_RA))

    dung_luong_kb = DUONG_DAN_RA.stat().st_size / 1024
    print(f"Đã dựng {len(SLIDES)} slide → {DUONG_DAN_RA}")
    print(f"Dung lượng: {dung_luong_kb:.0f} KB")
    print(f"Slide bấm qua khi bảo vệ: {sorted(SLIDE_BAM_QUA_KHI_BAO_VE)}")


if __name__ == "__main__":
    main()
