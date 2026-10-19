"""Nguồn nội dung DUY NHẤT cho bản thuyết trình — tao-slide.py (.pptx) và tao-kich-ban.py
(kịch bản nói) đều đọc từ đây. Sửa nội dung thì sửa ở đây rồi dựng lại cả hai, không sửa tay
vào .pptx hay kịch bản đã xuất (xem docs/huong-dan-nop-bai.md).

Mọi con số trong SLIDES (5 bảng, 24 endpoint, 7 use case, 106 kịch bản kiểm thử, phiên bản công
nghệ...) đều đếm/đo được từ mã nguồn và báo cáo thật tại thời điểm viết (19/10) — không có số
nào gõ theo trí nhớ. Nguồn cho từng cụm số liệu:
  - 5 bảng CSDL, 24 endpoint API: backend/prisma/schema.prisma, docs/bao-cao/04a-chuong-3-kien-truc.md
    (Bảng 3.1-3.6) — đếm bằng tay dòng bảng Markdown.
  - 7 use case: docs/bao-cao/04b-chuong-3-cai-dat.md (mục 3.6.1-3.6.7).
  - 106/106 kịch bản kiểm thử (21 unit backend + 77 e2e backend + 8 unit frontend): chạy lại
    THẬT `npm run test`/`npm run test:e2e` ở backend và `npm run test` ở frontend ngày 19/10,
    không lấy số cũ từ báo cáo.
  - Phiên bản công nghệ (Next.js 16.3.6, React 19.3.0, NestJS 11.2.6, Prisma/Prisma Client
    6.19.3, PostgreSQL 16, TypeScript 5.7.3): đọc trực tiếp frontend/package.json,
    backend/package.json, docker-compose.yml.
  - Thông tin đề tài/sinh viên: đọc qua `doc_thong_tin_de_tai()` dưới đây — nguồn gốc duy nhất
    là docs/bao-cao/quy-dinh.md mục 1 (xem scripts/bao_cao/cau_hinh.py).

LIÊN_KET_VIDEO: chuỗi mốc `«DÁN LIÊN KẾT GOOGLE DRIVE VÀO ĐÂY»` — KHÔNG đổi cách viết, Giai đoạn
2/3 và scripts/dong-goi-nop-bai.sh dò đúng chuỗi này để biết còn thiếu link hay chưa.
"""
from __future__ import annotations

import sys
from pathlib import Path

GOC_REPO = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(GOC_REPO / "scripts"))

from bao_cao.cau_hinh import doc_quy_dinh  # noqa: E402


def doc_thong_tin_de_tai():
    """Đọc lại thông tin đề tài/sinh viên từ đúng MỘT nguồn gốc (quy-dinh.md) — không gõ tay
    lần thứ hai ở đây."""
    return doc_quy_dinh().thong_tin


LIEN_KET_VIDEO = "«DÁN LIÊN KẾT GOOGLE DRIVE VÀO ĐÂY»"
LIEN_KET_KHO = "https://github.com/nhquan403/Recruit-Employee"

# Chỉ số (0-based) các slide demo ảnh chụp màn hình — khi bảo vệ (10-20 phút kể cả hỏi đáp) thì
# BẤM QUA không dừng lại đọc lời nói đầy đủ, chỉ nói nhanh đúng một câu (~2 giây/slide). Lời nói
# đầy đủ trong SLIDES chỉ dùng khi quay video nộp bài. Xem tao-kich-ban.py mục "Hai đường thời
# lượng". Giữ lại NGUYÊN (không bấm qua) 3 slide demo đại diện đủ 3 vai trò: 10 (Trang chủ —
# ứng viên), 14 (Quản lý ứng viên — nhà tuyển dụng), 15 (Quản trị viên) — bấm qua 5 slide demo
# còn lại (11, 12, 13, 16, 17) vì đã có 3 slide đại diện.
SLIDE_BAM_QUA_KHI_BAO_VE = {11, 12, 13, 16, 17}


def _thong_tin_bia() -> list[str]:
    tt = doc_thong_tin_de_tai()
    return [
        f"Đồ án Thực tập {tt.loai_do_an} — Ngành {tt.nganh}",
        f"GVHD: {tt.gvhd}",
        f"SVTH: {tt.svth} — MSSV {tt.mssv} — Lớp {tt.lop} — Khoá {tt.khoa_hoc}",
        f"{tt.truong} — {tt.don_vi_truc_thuoc}",
    ]


def _tieu_de_bia() -> str:
    return doc_thong_tin_de_tai().ten_de_tai


SLIDES = [
    (
        _tieu_de_bia(),
        _thong_tin_bia(),
        None,
        (
            "Kính chào thầy cô trong hội đồng. Em xin trình bày đồ án thực tập cơ sở ngành với "
            "đề tài xây dựng website kết nối người tìm việc làm thêm với nhà tuyển dụng, dưới sự "
            "hướng dẫn của thầy Trầm Hoàng Nam. Em là Bùi Anh Khoa, mã số sinh viên 170123594, "
            "lớp DX23TT11."
        ),
    ),
    (
        "Lý do chọn đề tài",
        [
            "Nhu cầu làm thêm của sinh viên và lao động thời vụ luôn ở mức cao",
            "Kênh phi chính thức (Facebook, Zalo): tin rải rác, không có bộ lọc, không xác thực người đăng",
            "Nền tảng lớn (TopCV, VietnamWorks): quy trình nặng, không hợp với việc làm thêm ngắn hạn",
            "→ Khoảng trống thị trường giữa hai nhóm kênh trên",
        ],
        None,
        (
            "Nhu cầu tìm việc làm thêm của sinh viên và lao động thời vụ luôn ở mức cao, nhưng "
            "cách kết nối hiện nay có hai nhóm hạn chế. Các kênh phi chính thức như nhóm Facebook "
            "hay Zalo thì tin đăng rải rác, dễ trôi mất, không có bộ lọc theo khu vực hay khung "
            "giờ, và không xác thực người đăng nên dễ xuất hiện tin giả. Trong khi đó các nền "
            "tảng tuyển dụng lớn như TopCV, VietnamWorks lại tập trung vào việc làm toàn thời "
            "gian với quy trình khá nặng, không phù hợp với một tin tuyển dụng làm thêm cần đăng "
            "nhanh và tuyển gấp. Đó chính là khoảng trống mà đồ án hướng tới lấp đầy."
        ),
    ),
    (
        "Mục tiêu đồ án",
        [
            "Mục tiêu chung: website kết nối, đăng tin — tìm kiếm — lọc — ứng tuyển nhanh, 3 vai trò",
            "Thiết kế CSDL quan hệ cho người dùng, tin tuyển dụng, hồ sơ ứng tuyển, thông báo",
            "Xây dựng API RESTful và giao diện cho 3 vai trò",
            "Tìm kiếm/lọc theo khu vực, khung giờ, mức lương + thông báo cập nhật",
            "Kiểm thử theo kịch bản nghiệp vụ, triển khai bản demo chạy được",
        ],
        None,
        (
            "Mục tiêu chung của đồ án là xây dựng một website kết nối người tìm việc làm thêm "
            "với nhà tuyển dụng, cho phép đăng tin, tìm kiếm, lọc và ứng tuyển nhanh chóng, có "
            "quản lý tài khoản theo vai trò và một trang quản trị kiểm duyệt tin đăng. Từ đó đồ "
            "án đặt ra sáu mục tiêu cụ thể: khảo sát yêu cầu hai nhóm người dùng, thiết kế cơ sở "
            "dữ liệu quan hệ, xây dựng API RESTful, xây dựng giao diện cho ba vai trò, cài đặt "
            "tìm kiếm lọc và thông báo, và cuối cùng là kiểm thử cùng triển khai một bản demo "
            "chạy được để trình diễn."
        ),
    ),
    (
        "Đối tượng và phạm vi",
        [
            "Đối tượng: người tìm việc làm thêm (sinh viên, lao động phổ thông) và nhà tuyển dụng nhỏ",
            "Phạm vi: website đáp ứng, 3 vai trò, kiểm duyệt tin, thông báo bằng polling",
            "Không làm: app di động riêng, thanh toán lương, AI gợi ý việc, xác minh giấy tờ tuỳ thân",
        ],
        None,
        (
            "Đối tượng nghiên cứu gồm hai nhóm: người tìm việc làm thêm — chủ yếu là sinh viên "
            "và lao động phổ thông — và nhà tuyển dụng nhỏ như cửa hàng, quán ăn, kho hàng. Đồ "
            "án giới hạn phạm vi ở mức phù hợp với một đồ án cơ sở ngành: một website đáp ứng "
            "dùng được trên máy tính lẫn điện thoại, ba vai trò người dùng, quản trị viên duyệt "
            "tin trước khi hiển thị công khai, và thông báo cập nhật qua cơ chế truy vấn định kỳ "
            "thay vì kênh email hay SMS bên thứ ba. Đồ án không làm ứng dụng di động riêng, không "
            "xử lý thanh toán lương hay hợp đồng điện tử, không dùng trí tuệ nhân tạo để gợi ý "
            "việc làm, và không xác minh danh tính bằng giấy tờ tùy thân."
        ),
    ),
    (
        "Kiến trúc tổng quan hệ thống",
        [
            "Kiến trúc client-server, giao tiếp qua REST API có JWT",
            "3 dịch vụ đóng gói bằng Docker Compose: db (PostgreSQL), backend (NestJS), frontend (Next.js)",
            "backend là thành phần duy nhất truy cập cơ sở dữ liệu",
        ],
        "hinh-2-1-kien-truc-tong-quan.png",
        (
            "Hệ thống theo kiến trúc client-server, gồm ba thành phần triển khai độc lập đóng "
            "gói bằng Docker Compose: dịch vụ cơ sở dữ liệu PostgreSQL, dịch vụ backend bằng "
            "NestJS, và dịch vụ frontend bằng Next.js. Trình duyệt chỉ giao tiếp trực tiếp với "
            "frontend; mọi thao tác cần dữ liệu được frontend gọi tiếp sang backend qua REST API "
            "có đính kèm JWT. Backend là thành phần duy nhất truy cập cơ sở dữ liệu, thông qua "
            "Prisma Client."
        ),
    ),
    (
        "Công nghệ sử dụng",
        [
            "Front-end: Next.js 16, React 19, TypeScript, TailwindCSS 3",
            "Back-end: NestJS 11 (Node.js), tổ chức theo module",
            "Cơ sở dữ liệu: PostgreSQL 16, thao tác qua Prisma ORM 6",
            "Xác thực: JWT + bcrypt + kiểm soát truy cập theo vai trò (RBAC)",
            "Kiểm thử: Jest + Testing Library · Triển khai: Docker Compose",
        ],
        None,
        (
            "Về công nghệ, front-end dùng Next.js phiên bản 16 với App Router, kết hợp "
            "TypeScript và TailwindCSS. Back-end dùng NestJS phiên bản 11 trên nền Node.js, tổ "
            "chức mã nguồn theo module. Cơ sở dữ liệu là PostgreSQL, thao tác qua Prisma ORM "
            "phiên bản 6. Xác thực dùng JSON Web Token kết hợp băm mật khẩu bằng bcrypt và kiểm "
            "soát truy cập theo vai trò. Kiểm thử dùng Jest cho back-end và Testing Library cho "
            "front-end, còn triển khai bản demo dùng Docker Compose."
        ),
    ),
    (
        "Thiết kế cơ sở dữ liệu",
        [
            "5 bảng: User, Job, Application, Profile, Notification",
            "Application ràng buộc duy nhất (jobId, candidateId) — một ứng viên không ứng tuyển 2 lần",
            "Profile tách riêng khỏi User theo nguyên tắc chuẩn hóa dữ liệu quan hệ",
        ],
        "hinh-2-2-erd.png",
        (
            "Cơ sở dữ liệu gồm năm bảng: User, Job, Application, Profile và Notification. Bảng "
            "Application chỉ lưu hai khóa ngoại tới Job và User cùng trạng thái riêng của nó, "
            "tránh lặp lại dữ liệu; và có ràng buộc duy nhất trên cặp jobId-candidateId để đảm "
            "bảo ở cấp cơ sở dữ liệu rằng một ứng viên không thể ứng tuyển hai lần vào cùng một "
            "tin. Bảng Profile được tách riêng khỏi User theo đúng nguyên tắc chuẩn hóa dữ liệu "
            "quan hệ, vì đây là thông tin phụ thuộc vào người dùng nhưng không phải thuộc tính "
            "định danh tài khoản."
        ),
    ),
    (
        "Thiết kế API",
        [
            "24 endpoint REST, chia theo module: auth, jobs, applications, notifications, profiles, admin",
            "Bảo vệ bằng RolesGuard (vai trò) và JobOwnerGuard (đúng chủ tin)",
            "Dữ liệu đầu vào kiểm tra bằng DTO + class-validator + ValidationPipe toàn cục",
        ],
        None,
        (
            "Hệ thống có hai mươi tư endpoint REST, chia theo sáu module nghiệp vụ: xác thực, "
            "tin tuyển dụng, hồ sơ ứng tuyển, thông báo, hồ sơ cá nhân và quản trị. Mỗi endpoint "
            "được bảo vệ bằng RolesGuard kiểm tra đúng vai trò, và với các thao tác sửa hoặc xoá "
            "tin còn có thêm JobOwnerGuard đảm bảo một nhà tuyển dụng chỉ thao tác được trên tin "
            "do chính mình đăng. Mọi dữ liệu đầu vào đều được kiểm tra hợp lệ bằng lớp DTO cùng "
            "thư viện class-validator và một ValidationPipe toàn cục, từ chối dữ liệu sai định "
            "dạng trước khi chạm tới logic nghiệp vụ."
        ),
    ),
    (
        "Luồng ứng tuyển đầu-cuối",
        [
            "Ứng viên ứng tuyển → tạo Application (PENDING) + thông báo cho nhà tuyển dụng",
            "Nhà tuyển dụng xem danh sách → tự động chuyển VIEWED",
            "Nhà tuyển dụng mời phỏng vấn/từ chối → thông báo cho ứng viên",
        ],
        "hinh-2-3-luong-ung-tuyen.png",
        (
            "Đây là luồng ứng tuyển đầu-cuối thật của hệ thống. Ứng viên bấm ứng tuyển, backend "
            "tạo một bản ghi Application ở trạng thái PENDING và đồng thời tạo thông báo gửi cho "
            "nhà tuyển dụng sở hữu tin đó. Khi nhà tuyển dụng mở trang quản lý ứng viên, lần xem "
            "đầu tiên tự động chuyển trạng thái sang VIEWED. Khi nhà tuyển dụng chọn mời phỏng "
            "vấn hoặc từ chối, hệ thống cập nhật trạng thái tương ứng và tạo thông báo gửi ngược "
            "lại cho ứng viên, ứng viên thấy cập nhật này qua vòng truy vấn định kỳ tiếp theo."
        ),
    ),
    (
        "Ba vai trò — Bảy use case",
        [
            "Ứng viên, Nhà tuyển dụng, Quản trị viên",
            "UC01 Đăng ký/đăng nhập · UC02 Đăng tin · UC03 Tìm kiếm/lọc tin",
            "UC04 Ứng tuyển · UC05 Quản lý ứng viên · UC06 Duyệt/từ chối tin · UC07 Nhận thông báo",
        ],
        None,
        (
            "Hệ thống có ba vai trò người dùng: ứng viên, nhà tuyển dụng và quản trị viên, phục "
            "vụ đủ bảy use case đã đặc tả — từ đăng ký đăng nhập, đăng tin tuyển dụng, tìm kiếm "
            "và lọc tin, ứng tuyển, quản lý danh sách ứng viên, duyệt hoặc từ chối tin, cho tới "
            "nhận thông báo cập nhật hồ sơ. Toàn bộ bảy use case này đều đã được cài đặt và kiểm "
            "thử đầy đủ, phần demo tiếp theo sẽ đi qua từng vai trò."
        ),
    ),
    (
        "Demo — Ứng viên: Trang chủ",
        ["Danh sách tin tuyển dụng phù hợp", "Giao diện đáp ứng, dùng được trên điện thoại"],
        "hinh-1-1-trang-chu.png",
        (
            "Đây là trang chủ dành cho ứng viên, hiển thị danh sách tin tuyển dụng phù hợp. Giao "
            "diện được thiết kế đáp ứng, dùng tốt trên cả máy tính và điện thoại — phù hợp với "
            "đối tượng người dùng chính là sinh viên thường tra cứu trên di động."
        ),
    ),
    (
        "Demo — Tìm kiếm và lọc",
        ["Lọc theo khu vực, khung giờ, mức lương", "Dùng Prisma + PostgreSQL, endpoint GET /jobs"],
        "hinh-1-2-tim-kiem-loc.png",
        (
            "Màn hình tìm kiếm với bộ lọc đầy đủ theo khu vực, khung giờ làm việc và mức lương — "
            "đúng những tiêu chí mà khảo sát hiện trạng ở phần đầu cho thấy các kênh phi chính "
            "thức đang thiếu."
        ),
    ),
    (
        "Demo — Chi tiết tin & ứng tuyển",
        ["Xem chi tiết tin, bấm Ứng tuyển ngay", "Backend kiểm tra hợp lệ bằng CreateApplicationDto"],
        "hinh-1-3-chi-tiet-tin.png",
        (
            "Trang chi tiết một tin tuyển dụng, nơi ứng viên bấm ứng tuyển. Yêu cầu ứng tuyển đi "
            "qua DTO kiểm tra jobId đúng định dạng UUID trước khi tạo hồ sơ ứng tuyển thật."
        ),
    ),
    (
        "Demo — Nhà tuyển dụng: Đăng tin",
        ["Form đăng tin mới", "Tin mới luôn ở trạng thái PENDING, chờ quản trị viên duyệt"],
        "hinh-3-1-dang-tin.png",
        (
            "Phía nhà tuyển dụng, đây là form đăng tin tuyển dụng mới. Mọi tin mới đăng đều ở "
            "trạng thái chờ duyệt, chỉ hiển thị công khai sau khi quản trị viên phê duyệt — đúng "
            "biện pháp hạn chế tin giả đã trình bày ở phần kiến trúc."
        ),
    ),
    (
        "Demo — Quản lý ứng viên",
        ["Danh sách ứng viên theo từng tin", "Cập nhật trạng thái: Xem/Mời phỏng vấn/Từ chối"],
        "hinh-3-2-quan-ly-ung-vien.png",
        (
            "Trang quản lý ứng viên của một tin tuyển dụng, hiển thị hai hồ sơ ở hai trạng thái "
            "khác nhau. Nhà tuyển dụng có thể mời phỏng vấn hoặc từ chối trực tiếp từ đây, hệ "
            "thống tự gửi thông báo cho ứng viên ngay sau đó."
        ),
    ),
    (
        "Demo — Quản trị viên",
        ["Tổng quan hệ thống, tin chờ duyệt, danh sách người dùng"],
        "hinh-3-3-duyet-tin-admin.png",
        (
            "Trang quản trị cho quản trị viên, gồm tổng quan hệ thống, danh sách tin đang chờ "
            "duyệt và danh sách người dùng — đây là nơi thực hiện bước kiểm duyệt trước khi một "
            "tin tuyển dụng được hiển thị công khai."
        ),
    ),
    (
        "Demo — Thông báo",
        ["Chuông thông báo, cập nhật mỗi 20 giây bằng polling"],
        "hinh-3-4-thong-bao.png",
        (
            "Chuông thông báo đang mở, hiển thị một thông báo chưa đọc — cập nhật bằng cơ chế "
            "truy vấn định kỳ mỗi hai mươi giây như đã trình bày ở phần kiến trúc."
        ),
    ),
    (
        "Demo — Hồ sơ cá nhân",
        ["Ứng viên xem lại thông tin tài khoản và lịch sử ứng tuyển"],
        "hinh-3-5-ho-so-ung-vien.png",
        (
            "Trang hồ sơ cá nhân của ứng viên, nơi xem lại thông tin tài khoản của chính mình."
        ),
    ),
    (
        "Bảo mật: đối chiếu OWASP Top 10",
        [
            "Đã có: chống truy cập chéo vai trò, mật khẩu băm bcrypt, chống SQL injection qua Prisma",
            "Đã có: kiểm tra dữ liệu đầu vào toàn cục (ValidationPipe)",
            "Một phần — hạn chế biết trước: CORS chưa giới hạn origin, chưa có rate limiting",
        ],
        None,
        (
            "Về bảo mật, hệ thống đã đối chiếu với các nhóm rủi ro liên quan trong OWASP Top "
            "Mười. Đã có biện pháp cho kiểm soát truy cập, mật khẩu, chống chèn mã độc nhờ Prisma "
            "dùng câu lệnh tham số hóa, và kiểm tra dữ liệu đầu vào toàn cục. Có hai điểm được "
            "ghi nhận là hạn chế biết trước, không che giấu: cấu hình CORS hiện chưa giới hạn "
            "đúng origin, và hệ thống chưa có giới hạn số lần thử đăng nhập sai — cả hai đã được "
            "đưa vào hướng phát triển tiếp theo."
        ),
    ),
    (
        "Kết quả kiểm thử",
        [
            "106/106 kịch bản kiểm thử tự động đạt — 100%",
            "21 kiểm thử đơn vị + 77 kiểm thử tích hợp (backend) + 8 kiểm thử đơn vị (frontend)",
            "Bộ kiểm thử RBAC riêng xác nhận không có truy cập chéo vai trò",
        ],
        None,
        (
            "Toàn bộ một trăm lẻ sáu trên một trăm lẻ sáu kịch bản kiểm thử tự động đều đạt, tỷ "
            "lệ một trăm phần trăm — gồm hai mươi mốt kiểm thử đơn vị và bảy mươi bảy kiểm thử "
            "tích hợp ở backend, cùng tám kiểm thử đơn vị ở frontend. Trong đó có một bộ kiểm thử "
            "RBAC riêng biệt, xác nhận một tài khoản không thể gọi được API dành cho vai trò "
            "khác."
        ),
    ),
    (
        "Đối chiếu chỉ tiêu định lượng",
        [
            "7/7 use case hoàn thành (chỉ tiêu tối thiểu 6/7) — vượt",
            "106/106 kịch bản kiểm thử đạt (chỉ tiêu từ 90%) — vượt",
            "Không tràn ngang ở 3 độ rộng màn hình đã kiểm (360/768/1280px)",
        ],
        None,
        (
            "Đối chiếu với các chỉ tiêu định lượng đã đề ra trước khi xây dựng: bảy trên bảy use "
            "case hoàn thành, vượt chỉ tiêu tối thiểu sáu trên bảy; một trăm lẻ sáu trên một trăm "
            "lẻ sáu kịch bản kiểm thử đạt, vượt chỉ tiêu tối thiểu chín mươi phần trăm; và giao "
            "diện không bị tràn ngang ở cả ba độ rộng màn hình đã kiểm tra bằng Chromium thật."
        ),
    ),
    (
        "Hạn chế và hướng phát triển",
        [
            "Hạn chế: thông báo trễ tối đa ~20s, dữ liệu demo còn nhỏ, CORS/rate limiting chưa siết",
            "Hướng phát triển: ứng dụng di động, gợi ý việc làm, đánh giá hai chiều, WebSocket",
        ],
        None,
        (
            "Đồ án còn một số hạn chế được ghi nhận rõ ràng: độ trễ thông báo tối đa khoảng hai "
            "mươi giây do dùng polling, bộ dữ liệu demo còn ở quy mô nhỏ, và cấu hình CORS cùng "
            "giới hạn thử đăng nhập sai chưa được siết chặt. Hướng phát triển tiếp theo gồm xây "
            "dựng ứng dụng di động tận dụng lại API hiện có, bổ sung gợi ý việc làm theo lịch sử "
            "tìm kiếm, cơ chế đánh giá hai chiều giữa ứng viên và nhà tuyển dụng, và thay polling "
            "bằng WebSocket nếu quy mô người dùng tăng đủ lớn."
        ),
    ),
    (
        "Liên kết",
        [
            f"Video thuyết trình: {LIEN_KET_VIDEO}",
            f"Mã nguồn và toàn bộ tài liệu: {LIEN_KET_KHO}",
        ],
        None,
        (
            "Video thuyết trình đầy đủ và toàn bộ mã nguồn, tài liệu của đồ án được đính kèm "
            "theo hai liên kết trên slide này."
        ),
    ),
    (
        "Cảm ơn",
        [
            "Em xin cảm ơn thầy Trầm Hoàng Nam và quý thầy cô đã lắng nghe",
            "Em xin được lắng nghe góp ý và nhận xét từ hội đồng",
        ],
        None,
        (
            "Em xin chân thành cảm ơn thầy Trầm Hoàng Nam đã tận tình hướng dẫn trong suốt quá "
            "trình thực hiện đồ án, và cảm ơn quý thầy cô trong hội đồng đã lắng nghe. Em xin "
            "được lắng nghe góp ý và nhận xét ạ."
        ),
    ),
]


if __name__ == "__main__":
    print(f"Tổng số slide: {len(SLIDES)}")
    for i, (tieu_de, bullets, anh, loi_noi) in enumerate(SLIDES):
        danh_dau = " [BẤM QUA khi bảo vệ]" if i in SLIDE_BAM_QUA_KHI_BAO_VE else ""
        print(f"  {i:2}. {tieu_de}{danh_dau} — {len(bullets)} gạch đầu dòng, ảnh={anh}")
