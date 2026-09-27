#!/usr/bin/env python3
"""Sinh file .docx báo cáo đồ án từ các file Markdown trong docs/bao-cao/.

Markdown là nguồn, .docx là bản xuất — không sửa tay file .docx sinh ra. Đường dẫn gốc suy
từ vị trí file này (__file__), không hard-code đường dẫn tuyệt đối, để script chạy đúng trên
bất kỳ máy nào clone repo này.

Cách dùng:
    python3 scripts/xuat-ban-word.py --ra bao-cao/BaoCao.docx
    python3 scripts/xuat-ban-word.py --ra bao-cao/BaoCao.docx --muc-luc-json bao-cao/so-trang.json
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

GOC_REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(GOC_REPO / "scripts"))

from bao_cao.cau_hinh import doc_quy_dinh  # noqa: E402
from bao_cao.docx_builder import BaoCaoBuilder  # noqa: E402
from bao_cao.markdown_parser import Node, parse_file  # noqa: E402
from bao_cao.muc_luc import dung_muc_luc  # noqa: E402

# Thứ tự file đúng bố cục PDF quy định (mục 2) + kiến trúc thư mục đã chốt trong plan.md.
FILE_PHAN_DAU = "00-phan-dau.md"

# BM5 (biểu mẫu chính thức): "Bắt đầu đánh số trang từ chương 1" — MỞ ĐẦU vẫn KHÔNG đánh số,
# nên nằm chung nhóm "chưa đánh số" với 00-phan-dau.md, không phải nhóm "đánh số từ Chương 1".
FILE_CHUA_DANH_SO = [
    "01-mo-dau.md",
]
FILE_DANH_SO_TU_CHUONG_1 = [
    "02-chuong-1.md",
    "03-chuong-2.md",
    "04a-chuong-3-kien-truc.md",
    "04b-chuong-3-cai-dat.md",
    "05-chuong-4.md",
    "06-chuong-5.md",
    "07-tai-lieu-tham-khao.md",
    "08a-phu-luc-schema.md",
    "08b-phu-luc-api.md",
]
FILE_NOI_DUNG_THEO_THU_TU = FILE_CHUA_DANH_SO + FILE_DANH_SO_TU_CHUONG_1


def thu_thap_heading(docs_dir: Path) -> list[tuple[int, str]]:
    """Lượt 1 (chống bài toán con gà quả trứng của mục lục — Phase 2/9): đọc TOÀN BỘ file nội
    dung TRƯỚC khi build .docx, chỉ để lấy danh sách heading thật của mọi chương — mục lục
    (nằm ở đầu tài liệu) cần danh sách này đầy đủ trước khi section 2 còn chưa được viết."""
    headings: list[tuple[int, str]] = []
    for ten_file in FILE_NOI_DUNG_THEO_THU_TU:
        duong_dan = docs_dir / ten_file
        if not duong_dan.exists():
            continue
        for node in parse_file(duong_dan):
            if node.type == "heading":
                headings.append((node.data["level"], node.data["text"]))
    return headings


def xu_ly_node(
    builder: BaoCaoBuilder,
    node: Node,
    thu_muc_anh: Path,
    toan_bo_heading: list[tuple[int, str]],
    muc_luc_du_lieu: dict[str, int] | None,
) -> None:
    if node.type == "heading":
        builder.them_heading(node.data["level"], node.data["text"])
    elif node.type == "paragraph":
        builder.them_doan_van(node.data["text"])
    elif node.type == "bullet_list":
        builder.them_danh_sach_bullet(node.data["items"])
    elif node.type == "number_list":
        builder.them_danh_sach_so_bat_dau_lai(node.data["items"])
    elif node.type == "table":
        builder.them_bang(node.data["header"], node.data["align"], node.data["rows"])
    elif node.type == "image_placeholder":
        ten_file = _tim_file_anh_theo_so_hinh(thu_muc_anh, node.data["so_hinh"])
        if ten_file is None:
            raise FileNotFoundError(
                f"Không tìm thấy ảnh cho placeholder [Hình {node.data['so_hinh']}] trong "
                f"{thu_muc_anh} — kiểm tra lại Phase 3 đã sinh đủ ảnh chưa."
            )
        builder.them_hinh(ten_file, node.data["caption"], node.data["source_line"])
    elif node.type == "image":
        duong_dan = (thu_muc_anh.parent / node.data["path"]).resolve()
        builder.them_hinh(duong_dan, node.data["alt"] or None, node.data["source_line"])
    elif node.type == "pagebreak":
        builder.ngat_trang()
    elif node.type == "khoiky":
        builder.khoi_ky(node.data["lines"])
    elif node.type == "math_block":
        builder.them_cong_thuc_van_ban(node.data["latex"])
    elif node.type == "code_block":
        builder.them_khoi_ma(node.data["code"])
    elif node.type == "can_le_bat_dau":
        builder.bat_dau_can_giua()
    elif node.type == "can_le_ket_thuc":
        builder.ket_thuc_can_giua()
    elif node.type == "khoang_trang":
        builder.them_khoang_trang()
    elif node.type == "mucluc_directive":
        dung_muc_luc(builder.document, builder.document.sections[0], toan_bo_heading, muc_luc_du_lieu)
    else:
        raise ValueError(f"Loại node không xử lý được: {node.type}")


def _tim_file_anh_theo_so_hinh(thu_muc_anh: Path, so_hinh: str) -> Path | None:
    chuong = so_hinh.split(".")[0]
    so = so_hinh.split(".")[1] if "." in so_hinh else "0"
    for ext in ("png", "jpg", "jpeg"):
        for candidate in thu_muc_anh.glob(f"hinh-{chuong}-{so}-*.{ext}"):
            return candidate
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--ra", required=True, help="Đường dẫn file .docx xuất ra (tương đối so với thư mục gốc repo)"
    )
    parser.add_argument(
        "--muc-luc-json",
        default=None,
        help="File JSON {tiêu đề: số trang} đo được từ lần xuất trước — dùng để điền số trang "
        "mục lục thật (2-pass export, xem Phase 9). Bỏ qua ở lần xuất đầu.",
    )
    parser.add_argument(
        "--docs-dir",
        default=None,
        help="Ghi đè thư mục docs/bao-cao (mặc định suy từ vị trí script)",
    )
    args = parser.parse_args()

    docs_dir = Path(args.docs_dir) if args.docs_dir else GOC_REPO / "docs" / "bao-cao"
    thu_muc_anh = GOC_REPO / "docs" / "images" / "bao-cao"
    duong_dan_ra = (GOC_REPO / args.ra).resolve()

    muc_luc_du_lieu = None
    if args.muc_luc_json:
        muc_luc_path = (GOC_REPO / args.muc_luc_json).resolve()
        if muc_luc_path.exists():
            muc_luc_du_lieu = json.loads(muc_luc_path.read_text(encoding="utf-8"))

    # Lượt 1: chỉ thu thập heading của mọi chương — giải quyết bài toán con gà quả trứng của
    # mục lục (Phase 2/9): 00-phan-dau.md chứa `\mucluc` nhưng heading nằm ở các file sau nó.
    toan_bo_heading = thu_thap_heading(docs_dir)

    quy_dinh = doc_quy_dinh()
    builder = BaoCaoBuilder(quy_dinh, thu_muc_anh)

    # --- Section 1: bìa/nhận xét/cảm ơn/mục lục/tóm tắt/MỞ ĐẦU — không đầu/chân trang, không
    # số trang. Theo biểu mẫu chính thức BM5 ("Bắt đầu đánh số trang từ chương 1"), MỞ ĐẦU nằm
    # trong nhóm KHÔNG đánh số này, không phải điểm bắt đầu đánh số (đã sửa so với quyết định
    # ban đầu — xem docs/bao-cao/quy-dinh.md mục 3).
    phan_dau_path = docs_dir / FILE_PHAN_DAU
    if not phan_dau_path.exists():
        raise FileNotFoundError(
            f"Chưa có {phan_dau_path} — chạy Phase 4 (viết phần đầu) trước khi xuất bản."
        )
    for node in parse_file(phan_dau_path):
        xu_ly_node(builder, node, thu_muc_anh, toan_bo_heading, muc_luc_du_lieu)

    thieu_file = []
    for ten_file in FILE_CHUA_DANH_SO:
        duong_dan = docs_dir / ten_file
        if not duong_dan.exists():
            thieu_file.append(ten_file)
            continue
        for node in parse_file(duong_dan):
            xu_ly_node(builder, node, thu_muc_anh, toan_bo_heading, muc_luc_du_lieu)
        builder.ngat_trang()

    # --- Section 2: CHƯƠNG 1 trở đi — đánh số trang bắt đầu lại từ 1 (đúng BM5)
    builder.bat_dau_section_noi_dung()

    for ten_file in FILE_DANH_SO_TU_CHUONG_1:
        duong_dan = docs_dir / ten_file
        if not duong_dan.exists():
            thieu_file.append(ten_file)
            continue
        for node in parse_file(duong_dan):
            xu_ly_node(builder, node, thu_muc_anh, toan_bo_heading, muc_luc_du_lieu)
        builder.ngat_trang()

    if thieu_file:
        print(
            "CẢNH BÁO: các file nội dung sau chưa tồn tại, đã bỏ qua khi xuất bản:\n  - "
            + "\n  - ".join(thieu_file),
            file=sys.stderr,
        )

    print(f"Đã thu thập {len(builder.headings)} heading thật (đối chiếu Phase 9):")
    for level, text in builder.headings:
        so_trang = (muc_luc_du_lieu or {}).get(text, "…")
        print(f"  {'  ' * (level - 1)}{text} .... {so_trang}")

    builder.luu(duong_dan_ra)
    print(f"Đã xuất: {duong_dan_ra}")


if __name__ == "__main__":
    main()
