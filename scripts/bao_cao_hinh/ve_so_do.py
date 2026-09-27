"""Vẽ 3 sơ đồ kỹ thuật cho báo cáo (Phase 3): kiến trúc tổng quan, ERD, tuần tự ứng tuyển.

Vẽ trực tiếp bằng matplotlib (hộp + mũi tên), không dùng lại sơ đồ cũ trong đề cương — sơ đồ
kiến trúc cũ vẽ "Dịch vụ thông báo (WebSocket/email)" nhưng hệ thống thật dùng polling (đọc từ
frontend/src/lib/use-polling-notifications.ts: 20 giây/lần), nên vẽ lại cho đúng thực tế.

Chạy: python3 scripts/bao_cao_hinh/ve_so_do.py
"""
from __future__ import annotations

import re
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

GOC_REPO = Path(__file__).resolve().parents[2]
THU_MUC_ANH = GOC_REPO / "docs" / "images" / "bao-cao"


def _hop(ax, xy, w, h, text, mau="#e8eef7", vien="#2f5fa8", fontsize=11):
    x, y = xy
    box = FancyBboxPatch(
        (x, y),
        w,
        h,
        boxstyle="round,pad=0.02,rounding_size=0.08",
        linewidth=1.4,
        edgecolor=vien,
        facecolor=mau,
    )
    ax.add_patch(box)
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontsize=fontsize, wrap=True)
    return (x, y, w, h)


def _mui_ten(ax, tu, den, nhan="", cong=0.0):
    x1, y1, w1, h1 = tu
    x2, y2, w2, h2 = den
    cx1, cy1 = x1 + w1 / 2, y1 + h1 / 2
    cx2, cy2 = x2 + w2 / 2, y2 + h2 / 2
    # Chọn cạnh xuất phát/đến theo hướng tương đối giữa 2 hộp — ngang thì nối trái-phải,
    # dọc thì nối trên-dưới — tránh mũi tên cắt ngang qua giữa hộp.
    if abs(cx2 - cx1) >= abs(cy2 - cy1):
        p1 = (x1 + w1, cy1) if cx2 >= cx1 else (x1, cy1)
        p2 = (x2, cy2) if cx2 >= cx1 else (x2 + w2, cy2)
    else:
        p1 = (cx1, y1 + h1) if cy2 >= cy1 else (cx1, y1)
        p2 = (cx2, y2) if cy2 >= cy1 else (cx2, y2 + h2)
    arrow = FancyArrowPatch(
        p1, p2, arrowstyle="-|>", mutation_scale=14, linewidth=1.3, color="#333333",
        connectionstyle=f"arc3,rad={cong}",
    )
    ax.add_patch(arrow)
    if nhan:
        mx, my = (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 + 0.15
        ax.text(mx, my, nhan, ha="center", va="bottom", fontsize=9, color="#333333")


def ve_kien_truc_tong_quan() -> Path:
    fig, ax = plt.subplots(figsize=(11, 5))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 5)
    ax.axis("off")

    trinh_duyet = _hop(ax, (0.3, 3.3), 2.1, 1.1, "Trình duyệt\n(ứng viên / nhà tuyển dụng)")
    frontend = _hop(ax, (3.1, 3.3), 2.3, 1.1, "Frontend\nNext.js 16 (:3000)")
    backend = _hop(ax, (6.1, 3.3), 2.3, 1.1, "Backend API\nNestJS, REST (:4000)")
    db = _hop(ax, (9.1, 3.3), 1.6, 1.1, "PostgreSQL\n(Prisma ORM)", mau="#f7ecd9", vien="#a87c2f")

    polling = _hop(
        ax, (3.1, 1.0), 5.3, 1.0,
        "Thông báo: frontend gọi GET /notifications/mine mỗi 20 giây\n(DB-backed polling — KHÔNG dùng WebSocket)",
        mau="#eef7ea", vien="#3f8a3f", fontsize=10,
    )

    _mui_ten(ax, trinh_duyet, frontend, "HTTP")
    _mui_ten(ax, frontend, backend, "REST / JSON + JWT")
    _mui_ten(ax, backend, db, "Prisma Client")
    _mui_ten(ax, frontend, polling, "")

    ax.set_title("Hình 2.1. Kiến trúc tổng quan hệ thống Việc Làm Thêm", fontsize=12, pad=14)
    duong_dan = THU_MUC_ANH / "hinh-2-1-kien-truc-tong-quan.png"
    fig.savefig(duong_dan, dpi=150, bbox_inches="tight")
    plt.close(fig)
    return duong_dan


def _doc_bang_tu_schema(schema_text: str) -> list[tuple[str, list[str]]]:
    """Trích tên bảng + tên field trực tiếp từ schema.prisma thật — không gõ tay danh sách
    field, tránh lệch nếu schema đổi sau này (đúng yêu cầu Requirements của phase-03)."""
    bang: list[tuple[str, list[str]]] = []
    for m in re.finditer(r"model\s+(\w+)\s*\{([^}]*)\}", schema_text, re.DOTALL):
        ten_bang = m.group(1)
        than = m.group(2)
        truong = []
        for dong in than.splitlines():
            dong = dong.strip()
            if not dong or dong.startswith("@@"):
                continue
            phan = dong.split()
            if len(phan) >= 2:
                truong.append(phan[0])
        bang.append((ten_bang, truong))
    return bang


def ve_erd() -> Path:
    schema_path = GOC_REPO / "backend" / "prisma" / "schema.prisma"
    bang = _doc_bang_tu_schema(schema_path.read_text(encoding="utf-8"))

    fig, ax = plt.subplots(figsize=(14, 9))
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 9)
    ax.axis("off")

    vi_tri = {
        "User": (0.6, 8.0),
        "Job": (5.2, 8.0),
        "Application": (10.0, 8.0),
        "Profile": (0.6, 3.0),
        "Notification": (5.2, 3.0),
    }
    w, h_moi_dong, tieu_de_h = 3.0, 0.28, 0.4
    hop_toa_do: dict[str, tuple] = {}

    for ten_bang, truong in bang:
        if ten_bang not in vi_tri:
            continue
        x, y_top = vi_tri[ten_bang]
        so_dong = min(len(truong), 8)
        h = tieu_de_h + so_dong * h_moi_dong
        y = y_top - h
        _hop(ax, (x, y), w, h, "", mau="#ffffff", vien="#555555")
        ax.add_patch(
            FancyBboxPatch(
                (x, y + h - tieu_de_h), w, tieu_de_h,
                boxstyle="round,pad=0.0,rounding_size=0.0",
                linewidth=0, facecolor="#2f5fa8",
            )
        )
        ax.text(x + w / 2, y + h - tieu_de_h / 2, ten_bang, ha="center", va="center",
                color="white", fontsize=11, fontweight="bold")
        for i, ten_truong in enumerate(truong[:8]):
            ty = y + h - tieu_de_h - (i + 0.7) * h_moi_dong
            ax.text(x + 0.15, ty, ten_truong, ha="left", va="center", fontsize=8.5, family="monospace")
        hop_toa_do[ten_bang] = (x, y, w, h)

    quan_he = [
        ("User", "Job", "1 nhà tuyển dụng - N tin", 0.0),
        ("Job", "Application", "1 tin - N hồ sơ ứng tuyển", 0.0),
        ("User", "Application", "1 ứng viên - N hồ sơ", -0.35),
        ("User", "Profile", "1-1", 0.0),
        ("User", "Notification", "1 - N", 0.15),
    ]
    for a, b, nhan, cong in quan_he:
        if a in hop_toa_do and b in hop_toa_do:
            _mui_ten(ax, hop_toa_do[a], hop_toa_do[b], nhan, cong=cong)

    ax.set_title(
        "Hình 2.2. Sơ đồ quan hệ thực thể (ERD) — trích trực tiếp từ backend/prisma/schema.prisma",
        fontsize=12, pad=14,
    )
    duong_dan = THU_MUC_ANH / "hinh-2-2-erd.png"
    fig.savefig(duong_dan, dpi=150, bbox_inches="tight")
    plt.close(fig)
    return duong_dan


def ve_luong_ung_tuyen() -> Path:
    fig, ax = plt.subplots(figsize=(12, 6.5))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.5)
    ax.axis("off")

    tac_nhan = {
        "Ứng viên": 1.0,
        "Frontend": 3.7,
        "Backend API": 6.4,
        "CSDL": 8.9,
        "Nhà tuyển dụng": 10.8,
    }
    for ten, x in tac_nhan.items():
        _hop(ax, (x - 0.9, 5.6), 1.8, 0.7, ten, fontsize=9.5)
        ax.plot([x, x], [0.3, 5.6], color="#999999", linestyle="--", linewidth=1)

    buoc = [
        ("Ứng viên", "Frontend", "Bấm \"Ứng tuyển\""),
        ("Frontend", "Backend API", "POST /applications"),
        ("Backend API", "CSDL", "Tạo Application(PENDING)"),
        ("Backend API", "CSDL", "Tạo Notification cho nhà tuyển dụng"),
        ("Backend API", "Frontend", "201 Created"),
        ("Nhà tuyển dụng", "Frontend", "Mở \"Quản lý ứng viên\""),
        ("Frontend", "Backend API", "GET /jobs/:id/applications"),
        ("Backend API", "Frontend", "Trả danh sách (đánh dấu VIEWED)"),
        ("Nhà tuyển dụng", "Frontend", "Chọn \"Mời phỏng vấn\" / \"Từ chối\""),
        ("Frontend", "Backend API", "PATCH /applications/:id"),
        ("Backend API", "CSDL", "Cập nhật status + tạo Notification cho ứng viên"),
        ("Ứng viên", "Frontend", "Poll GET /notifications/mine mỗi 20s → thấy cập nhật"),
    ]

    y = 5.1
    dy = 0.42
    for tu, den, nhan in buoc:
        x1, x2 = tac_nhan[tu], tac_nhan[den]
        arrow = FancyArrowPatch(
            (x1, y), (x2, y), arrowstyle="-|>", mutation_scale=12,
            linewidth=1.1, color="#2f5fa8" if x2 > x1 else "#a83f3f",
        )
        ax.add_patch(arrow)
        mx = (x1 + x2) / 2
        ax.text(mx, y + 0.08, nhan, ha="center", va="bottom", fontsize=8)
        y -= dy

    ax.set_title("Hình 2.3. Sơ đồ tuần tự luồng ứng tuyển đầu-cuối", fontsize=12, pad=14)
    duong_dan = THU_MUC_ANH / "hinh-2-3-luong-ung-tuyen.png"
    fig.savefig(duong_dan, dpi=150, bbox_inches="tight")
    plt.close(fig)
    return duong_dan


if __name__ == "__main__":
    THU_MUC_ANH.mkdir(parents=True, exist_ok=True)
    for ham in (ve_kien_truc_tong_quan, ve_erd, ve_luong_ung_tuyen):
        p = ham()
        print(f"Đã vẽ: {p}")
