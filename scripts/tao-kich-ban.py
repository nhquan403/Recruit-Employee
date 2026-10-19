#!/usr/bin/env python3
"""Dựng kịch bản nói (Markdown) từ scripts/noi-dung-slide.py (nguồn nội dung DUY NHẤT) — cùng
nguồn với tao-slide.py nên slide và kịch bản không bao giờ lệch nhau.

Thời lượng TÍNH THẬT từ số từ (đếm bằng cách tách khoảng trắng, không gõ tay) với tốc độ nói
tiếng Việt ước lượng 150 từ/phút. Hai đường thời lượng:
  - "Đầy đủ" (khi quay video nộp bài): đọc hết lời nói của MỌI slide.
  - "Ngắn" (khi bảo vệ trực tiếp, 10-20 phút kể cả hỏi đáp): các slide trong
    SLIDE_BAM_QUA_KHI_BAO_VE chỉ bấm qua, tính 2 giây/slide thay vì đọc hết lời nói.

Cách dùng:
    python3 scripts/tao-kich-ban.py
Xuất .docx/.pdf bản in được: chạy tiếp scripts/xuat-kich-ban-in.py (script riêng, xem tệp đó
để biết vì sao tách riêng bước này).
"""
from __future__ import annotations

import importlib
import sys
from pathlib import Path

GOC_REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(GOC_REPO / "scripts"))

_noi_dung = importlib.import_module("noi-dung-slide")
SLIDES = _noi_dung.SLIDES
SLIDE_BAM_QUA_KHI_BAO_VE = _noi_dung.SLIDE_BAM_QUA_KHI_BAO_VE

TOC_DO_NOI_TU_PHUT = 150
GIAY_BAM_QUA_MOI_SLIDE = 2

DUONG_DAN_RA = GOC_REPO / "thesis" / "kich-ban" / "KichBanNoi-CSN-DX23TT11-BuiAnhKhoa.md"


def dem_tu(text: str) -> int:
    return len(text.split())


def giay_tu_so_tu(so_tu: int) -> float:
    return so_tu / TOC_DO_NOI_TU_PHUT * 60


def dinh_dang_phut_giay(tong_giay: float) -> str:
    phut = int(tong_giay // 60)
    giay = int(round(tong_giay % 60))
    return f"{phut} phút {giay:02d} giây"


def main() -> None:
    dong: list[str] = []
    dong.append("# Kịch bản nói — Bản thuyết trình")
    dong.append("")
    dong.append(
        "Dựng tự động từ `scripts/noi-dung-slide.py` bằng `scripts/tao-kich-ban.py` — sửa nội "
        "dung thì sửa ở `noi-dung-slide.py` rồi chạy lại, không sửa tay file này."
    )
    dong.append("")
    dong.append(
        f"Thời lượng tính từ số từ thật với tốc độ nói ước lượng **{TOC_DO_NOI_TU_PHUT} từ/phút** "
        "(tiếng Việt). Slide đánh dấu **[BẤM QUA khi bảo vệ]** ở đường \"Ngắn\" chỉ tính "
        f"{GIAY_BAM_QUA_MOI_SLIDE} giây (đọc nhanh tên slide), không đọc hết lời nói — lời nói "
        "đầy đủ của các slide này chỉ dùng ở đường \"Đầy đủ\" khi quay video."
    )
    dong.append("")

    tong_giay_day_du = 0.0
    tong_giay_ngan = 0.0
    hang_bang: list[str] = []

    for i, (tieu_de, bullets, ten_anh, loi_noi) in enumerate(SLIDES):
        so_tu = dem_tu(loi_noi)
        giay_day_du = giay_tu_so_tu(so_tu)
        tong_giay_day_du += giay_day_du

        bam_qua = i in SLIDE_BAM_QUA_KHI_BAO_VE
        giay_ngan = GIAY_BAM_QUA_MOI_SLIDE if bam_qua else giay_day_du
        tong_giay_ngan += giay_ngan

        danh_dau = " 🔹 BẤM QUA khi bảo vệ" if bam_qua else ""
        hang_bang.append(
            f"| {i} | {tieu_de} | {so_tu} | {giay_day_du:.0f}s | "
            f"{giay_ngan:.0f}s{danh_dau} |"
        )

    dong.append("## Bảng thời lượng")
    dong.append("")
    dong.append(f"- **Đường đầy đủ** (quay video): {dinh_dang_phut_giay(tong_giay_day_du)}")
    dong.append(f"- **Đường ngắn** (bảo vệ trực tiếp): {dinh_dang_phut_giay(tong_giay_ngan)}")
    dong.append("")
    dong.append("| # | Slide | Số từ | Giây (đầy đủ) | Giây (ngắn) |")
    dong.append("|---|---|---:|---:|---:|")
    dong.extend(hang_bang)
    dong.append("")
    dong.append("---")
    dong.append("")

    for i, (tieu_de, bullets, ten_anh, loi_noi) in enumerate(SLIDES):
        so_tu = dem_tu(loi_noi)
        giay = giay_tu_so_tu(so_tu)
        bam_qua = i in SLIDE_BAM_QUA_KHI_BAO_VE

        dong.append(f"## Slide {i}. {tieu_de}")
        dong.append("")
        if bam_qua:
            dong.append(
                "> 🔹 **BẤM QUA khi bảo vệ trực tiếp** — chỉ nói nhanh tên slide "
                f"(~{GIAY_BAM_QUA_MOI_SLIDE} giây). Lời nói đầy đủ dưới đây chỉ đọc khi quay "
                "video nộp bài."
            )
            dong.append("")
        dong.append("**Nội dung trên slide:**")
        dong.append("")
        for b in bullets:
            dong.append(f"- {b}")
        if ten_anh:
            dong.append(f"- *(có hình: `{ten_anh}`)*")
        dong.append("")
        dong.append(f"**Số từ:** {so_tu} — **Thời lượng ước tính:** {giay:.0f} giây")
        dong.append("")
        dong.append("**Lời nói:**")
        dong.append("")
        dong.append(f"> {loi_noi}")
        dong.append("")

    DUONG_DAN_RA.parent.mkdir(parents=True, exist_ok=True)
    DUONG_DAN_RA.write_text("\n".join(dong) + "\n", encoding="utf-8")

    print(f"Đã dựng kịch bản {len(SLIDES)} slide → {DUONG_DAN_RA}")
    print(f"Đường đầy đủ: {dinh_dang_phut_giay(tong_giay_day_du)}")
    print(f"Đường ngắn:   {dinh_dang_phut_giay(tong_giay_ngan)}")
    if tong_giay_ngan > 20 * 60:
        print(
            "CẢNH BÁO: đường ngắn vẫn vượt 20 phút — đánh dấu thêm slide BẤM QUA trong "
            "noi-dung-slide.py hoặc rút gọn lời nói.",
            file=sys.stderr,
        )


if __name__ == "__main__":
    main()
