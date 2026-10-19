#!/usr/bin/env bash
# Đóng gói nộp bài LMS: 1 file .zip (và .rar nếu có công cụ) gồm báo cáo .docx, bản thuyết trình
# .pptx, mã nguồn (git archive HEAD — chỉ tệp đã theo dõi, không bao giờ dính node_modules/.env),
# và tệp "Doc truoc khi cham.txt". Thông tin sinh viên đọc từ nguồn gốc docs/bao-cao/quy-dinh.md
# (qua scripts/bao_cao/cau_hinh.py) — không gõ cứng ở đây.
#
# Cách dùng:
#   bash scripts/dong-goi-nop-bai.sh          # chặn nếu .pptx còn chuỗi "DÁN LIÊN KẾT"
#   bash scripts/dong-goi-nop-bai.sh -y        # đóng gói thử, bỏ qua chốt chặn link video
set -euo pipefail

GOC_REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$GOC_REPO"

DONG_GOI_THU=false
if [[ "${1:-}" == "-y" ]]; then
  DONG_GOI_THU=true
fi

BAO_CAO_DOCX="thesis/doc/BaoCao-CSN-DX23TT11-BuiAnhKhoa.docx"
BAN_THUYET_TRINH_PPTX="thesis/pptx/BanThuyetTrinh-CSN-DX23TT11-BuiAnhKhoa.pptx"
THU_MUC_RA="bao-cao/nop-bai"

for f in "$BAO_CAO_DOCX" "$BAN_THUYET_TRINH_PPTX"; do
  if [[ ! -f "$f" ]]; then
    echo "LỖI: chưa có $f — chạy scripts/xuat-ban-word.py / scripts/tao-slide.py trước." >&2
    exit 1
  fi
done

# --- Đọc thông tin sinh viên từ ĐÚNG MỘT nguồn gốc (quy-dinh.md), không gõ cứng ở script này ---
eval "$(python3 - <<'PYEOF'
import sys
sys.path.insert(0, "scripts")
import unicodedata
from bao_cao.cau_hinh import doc_quy_dinh

def bo_dau(s: str) -> str:
    s = s.replace("Đ", "D").replace("đ", "d")
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn")

tt = doc_quy_dinh().thong_tin
print(f"MSSV={tt.mssv!r}")
print(f"HO_TEN={tt.svth!r}")
print(f"HO_TEN_KHONG_DAU={bo_dau(tt.svth)!r}")
print(f"MA_LOP={tt.lop!r}")
print(f"TEN_DE_TAI={tt.ten_de_tai!r}")
print(f"GVHD={tt.gvhd!r}")
print(f"NGANH={tt.nganh!r}")
print(f"KHOA_HOC={tt.khoa_hoc!r}")
PYEOF
)"

LIEN_KET_KHO="https://github.com/nhquan403/Recruit-Employee"
TEN_GOI="${MSSV}_${HO_TEN_KHONG_DAU}_${MA_LOP}"

echo "Thông tin đọc được từ docs/bao-cao/quy-dinh.md:"
echo "  MSSV=$MSSV · Họ tên=$HO_TEN ($HO_TEN_KHONG_DAU) · Lớp=$MA_LOP"
echo "  Tên gói: $TEN_GOI"
echo

# --- Chốt chặn bắt buộc: còn chuỗi "DÁN LIÊN KẾT" trong .pptx thì dừng, trừ khi -y ---
THU_MUC_PPTX_GIAI_NEN="$(mktemp -d)"
trap 'rm -rf "$THU_MUC_PPTX_GIAI_NEN"' EXIT
unzip -q "$BAN_THUYET_TRINH_PPTX" -d "$THU_MUC_PPTX_GIAI_NEN"

CON_THIEU_LINK=false
if grep -rl "DÁN LIÊN KẾT" "$THU_MUC_PPTX_GIAI_NEN/ppt/slides/"*.xml > /dev/null 2>&1; then
  CON_THIEU_LINK=true
fi

if [[ "$CON_THIEU_LINK" == true ]]; then
  if [[ "$DONG_GOI_THU" == true ]]; then
    echo "CẢNH BÁO: slide \"Liên kết\" vẫn còn chuỗi mốc \"DÁN LIÊN KẾT GOOGLE DRIVE VÀO ĐÂY\" —"
    echo "          vì chạy với -y (đóng gói thử) nên vẫn tiếp tục, KHÔNG nộp gói này lên LMS."
    echo
  else
    echo "LỖI: slide \"Liên kết\" trong $BAN_THUYET_TRINH_PPTX vẫn còn chuỗi mốc" >&2
    echo "     \"DÁN LIÊN KẾT GOOGLE DRIVE VÀO ĐÂY\" — chưa dán link video thuyết trình thật." >&2
    echo "     Xem docs/huong-dan-nop-bai.md mục 2-3 để biết cách dán link rồi dựng lại." >&2
    echo "     Muốn đóng gói THỬ (xem trước cấu trúc, KHÔNG nộp) thì chạy lại với cờ -y." >&2
    exit 1
  fi
fi

# --- Dựng thư mục tạm theo đúng cấu trúc yêu cầu ---
THU_MUC_TAM="$(mktemp -d)"
trap 'rm -rf "$THU_MUC_PPTX_GIAI_NEN" "$THU_MUC_TAM"' EXIT
THU_MUC_GOI="$THU_MUC_TAM/$TEN_GOI"
mkdir -p "$THU_MUC_GOI/Ma nguon"

cp "$BAO_CAO_DOCX" "$THU_MUC_GOI/Bao cao do an - $HO_TEN.docx"
cp "$BAN_THUYET_TRINH_PPTX" "$THU_MUC_GOI/Ban thuyet trinh - $HO_TEN.pptx"

# --- Mã nguồn: git archive HEAD (chỉ tệp đã theo dõi — không bao giờ dính node_modules/.env),
# loại thesis/ (đã có báo cáo/thuyết trình ngay cạnh, trùng lặp) và docs/images/bao-cao/
# (ảnh báo cáo đã in nguyên trong quyển .docx) để gói nhẹ hơn. ---
DUNG_LUONG_DAY_DU=$(git archive HEAD | wc -c)
git archive HEAD -- . ':!thesis' ':!docs/images/bao-cao' | tar -x -C "$THU_MUC_GOI/Ma nguon"
DUNG_LUONG_SAU_LOC=$(du -sb "$THU_MUC_GOI/Ma nguon" | cut -f1)
TIET_KIEM_MB=$(python3 -c "print(f'{($DUNG_LUONG_DAY_DU-$DUNG_LUONG_SAU_LOC)/1024/1024:.1f}')")
echo "Mã nguồn (git archive HEAD, loại thesis/ + docs/images/bao-cao/):"
echo "  $(du -sh "$THU_MUC_GOI/Ma nguon" | cut -f1) — nhẹ hơn bản đầy đủ khoảng ${TIET_KIEM_MB} MB"
echo

# --- Doc truoc khi cham.txt ---
cat > "$THU_MUC_GOI/Doc truoc khi cham.txt" <<EOF
ĐỌC TRƯỚC KHI CHẤM
===================

Tên đề tài: $TEN_DE_TAI
Ngành: $NGANH
Sinh viên thực hiện: $HO_TEN — MSSV $MSSV — Lớp $MA_LOP — Khoá $KHOA_HOC
Giảng viên hướng dẫn: $GVHD

Nội dung gói nộp bài:
  - "Bao cao do an - $HO_TEN.docx" — báo cáo đồ án đầy đủ, MỞ FILE NÀY TRƯỚC.
  - "Ban thuyet trinh - $HO_TEN.pptx" — bản thuyết trình PowerPoint, có liên kết video
    thuyết trình ở slide gần cuối (slide "Liên kết").
  - "Ma nguon/" — mã nguồn dự án, lấy trực tiếp từ git (chỉ gồm tệp đã commit, không có
    file tạm/thư viện cài đặt/thông tin cấu hình riêng tư).

Thư mục KHÔNG chép vào "Ma nguon/" (xem trực tiếp trên kho mã nguồn thay vì trong gói này):
  - thesis/ — đã có "Bao cao do an - $HO_TEN.docx" và "Ban thuyet trinh - $HO_TEN.pptx"
    ngay trong gói này rồi, không chép lại để tránh trùng lặp.
  - docs/images/bao-cao/ — ảnh minh hoạ của báo cáo, đã in nguyên trong file .docx ở trên.

Liên kết kho mã nguồn đầy đủ (gồm cả lịch sử phát triển và mọi tệp trên):
  $LIEN_KET_KHO
EOF

echo "Nội dung gói:"
find "$THU_MUC_GOI" -maxdepth 1 -mindepth 1 | sed "s|$THU_MUC_GOI/|  - |"
echo

# --- Nén ---
mkdir -p "$THU_MUC_RA"
TEP_ZIP="$THU_MUC_RA/$TEN_GOI.zip"
TEP_RAR="$THU_MUC_RA/$TEN_GOI.rar"
rm -f "$TEP_ZIP" "$TEP_RAR"

(cd "$THU_MUC_TAM" && zip -rq "$GOC_REPO/$TEP_ZIP" "$TEN_GOI")
echo "Đã nén: $TEP_ZIP ($(du -h "$TEP_ZIP" | cut -f1))"

if command -v rar > /dev/null 2>&1; then
  (cd "$THU_MUC_TAM" && rar a -r -idq "$GOC_REPO/$TEP_RAR" "$TEN_GOI" > /dev/null)
  echo "Đã nén: $TEP_RAR ($(du -h "$TEP_RAR" | cut -f1))"
else
  echo "KHÔNG có lệnh 'rar' trên máy này (đã thử apt-get install -y rar trước đó nếu có quyền"
  echo "root) — chỉ dựng được $TEP_ZIP. Quy định ghi \".raz hoặc .zip\" nên .zip vẫn hợp lệ."
fi

echo
if [[ "$CON_THIEU_LINK" == true ]]; then
  echo "=== ĐÂY LÀ GÓI THỬ (-y) — CÒN THIẾU LIÊN KẾT VIDEO, KHÔNG NỘP LÊN LMS ==="
  echo "Làm theo docs/huong-dan-nop-bai.md mục 2-4 rồi chạy lại KHÔNG có cờ -y."
else
  echo "=== Gói nộp bài đã sẵn sàng: $TEP_ZIP ==="
fi
