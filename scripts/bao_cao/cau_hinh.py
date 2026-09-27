"""Đọc docs/bao-cao/quy-dinh.md và trả về một QuyDinh chứa mọi hằng số hình thức/thông tin đề tài.

quy-dinh.md là nguồn sự thật duy nhất — không hard-code lại các con số này ở nơi khác.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path


def _parse_markdown_tables(text: str) -> dict[str, str]:
    """Gom mọi hàng dữ liệu `| khóa | giá trị |` của mọi bảng 2 cột Markdown thành một dict
    phẳng — bỏ đúng dòng tiêu đề (dòng đầu mỗi khối bảng) và dòng phân cách `|---|---|`."""
    out: dict[str, str] = {}
    lines = [l.rstrip() for l in text.splitlines()]
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line.startswith("|") and i + 1 < len(lines) and re.match(r"^\|[\s:-]+\|[\s:-]+\|?", lines[i + 1].strip()):
            # đây là dòng tiêu đề bảng — bỏ qua nó và dòng phân cách ngay sau
            i += 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if len(cells) >= 2 and cells[0]:
                    out[cells[0]] = cells[1]
                i += 1
            continue
        i += 1
    return out


def _strip_md(value: str) -> str:
    """Bỏ `**đậm**`/`*nghiêng*` còn sót lại khi trích giá trị ô bảng."""
    return re.sub(r"\*\*|\*", "", value).strip()


def _cm(value: str) -> float:
    m = re.search(r"([\d.]+)\s*cm", value)
    if not m:
        raise ValueError(f"Không đọc được giá trị lề dạng cm từ: {value!r}")
    return float(m.group(1))


def _pt(value: str) -> int:
    m = re.search(r"(\d+)\s*pt", value)
    if not m:
        raise ValueError(f"Không đọc được giá trị pt từ: {value!r}")
    return int(m.group(1))


@dataclass(frozen=True)
class ThongTinDeTai:
    truong: str
    don_vi_truc_thuoc: str
    khoa: str
    ten_de_tai: str
    svth: str
    mssv: str
    lop: str
    khoa_hoc: str
    gvhd: str
    dia_diem_thoi_gian: str
    loai_do_an: str
    tieu_de_ngan: str


@dataclass(frozen=True)
class QuyDinhHinhThuc:
    font_name: str = "Times New Roman"
    font_size_pt: int = 13
    line_spacing: float = 1.5
    space_before_pt: int = 6
    space_after_pt: int = 6
    le_tren_cm: float = 2.0
    le_duoi_cm: float = 2.0
    le_trai_cm: float = 3.0
    le_phai_cm: float = 2.0
    so_trang_min: int = 30
    so_trang_max: int = 50


@dataclass(frozen=True)
class QuyetDinhTrinhBay:
    bia_cho_mau: bool = True
    so_trang_bat_dau_tu_mo_dau: bool = True
    chan_trang_gvhd_trai_svth_phai: bool = True


@dataclass(frozen=True)
class QuyDinh:
    thong_tin: ThongTinDeTai
    hinh_thuc: QuyDinhHinhThuc
    quyet_dinh: QuyetDinhTrinhBay
    raw: dict[str, str] = field(default_factory=dict)


def doc_quy_dinh(duong_dan: Path | None = None) -> QuyDinh:
    """Đọc `docs/bao-cao/quy-dinh.md` (đường dẫn suy từ vị trí file này, không hard-code)."""
    if duong_dan is None:
        goc_repo = Path(__file__).resolve().parents[2]
        duong_dan = goc_repo / "docs" / "bao-cao" / "quy-dinh.md"
    text = duong_dan.read_text(encoding="utf-8")
    raw = _parse_markdown_tables(text)

    thong_tin = ThongTinDeTai(
        truong=_strip_md(raw["Trường"]),
        don_vi_truc_thuoc=_strip_md(raw["Đơn vị trực thuộc"]),
        khoa=_strip_md(raw["Khoa"]),
        ten_de_tai=_strip_md(raw["Tên đề tài"]),
        svth=_strip_md(raw["Sinh viên thực hiện (SVTH)"]),
        mssv=_strip_md(raw["MSSV"]),
        lop=_strip_md(raw["Lớp"]),
        khoa_hoc=_strip_md(raw["Khóa"]),
        gvhd=_strip_md(raw["Giảng viên hướng dẫn (GVHD)"]),
        dia_diem_thoi_gian=_strip_md(raw["Địa điểm - thời gian"]),
        loai_do_an=_strip_md(raw["Loại đồ án"]),
        tieu_de_ngan="Website kết nối việc làm thêm",
    )
    hinh_thuc = QuyDinhHinhThuc(
        font_size_pt=_pt(raw["Font"]),
        le_tren_cm=_cm(raw["Lề trên"]),
        le_duoi_cm=_cm(raw["Lề dưới"]),
        le_trai_cm=_cm(raw["Lề trái"]),
        le_phai_cm=_cm(raw["Lề phải"]),
    )
    quyet_dinh = QuyetDinhTrinhBay()
    return QuyDinh(thong_tin=thong_tin, hinh_thuc=hinh_thuc, quyet_dinh=quyet_dinh, raw=raw)
