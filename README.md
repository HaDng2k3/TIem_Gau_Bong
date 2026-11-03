# 🧸 Tiệm Gấu Bông HD - Hệ Thống Fullstack & Cơ Sở Dữ Liệu SQLite

Hệ thống website thương mại điện tử chuyên bán gấu bông thủ công, quà tặng vintage và thiệp viết tay kèm **Trang Quản Trị (Admin Dashboard)**, **Cơ sở dữ liệu SQLite** và **Server REST API Backend (Node.js & Express)**.

---

## 🌟 1. Cấu Trúc Hệ Thống

Dự án gồm 3 thành phần liên kết chặt chẽ:
1. **Frontend Client & Trang Quản Trị (React 19 + Tailwind CSS + Lucide Icons)**:
   - Giao diện người mua hàng (Trang chủ, BST Mùa Thu, Giỏ hàng, Đặt gấu kèm thiệp viết tay).
   - **Trang Đăng Ký / Đăng Nhập thật sự**: Khách hàng tạo tài khoản mới, lưu trực tiếp vào cơ sở dữ liệu SQLite.
   - **Trang Quản Trị Backend Portal (Admin Dashboard)**: Quản lý toàn diện cửa hàng (sản phẩm, đơn hàng, danh mục, người dùng, cài đặt tiệm).
2. **Server Backend API (Node.js + Express + RESTful API)**:
   - Chạy tại port `5000`.
   - Cung cấp đầy đủ REST API CRUD (Sản phẩm, Đơn hàng, Người dùng, Thống kê doanh thu, Xác thực).
3. **Cơ Sở Dữ Liệu Quan Hệ (SQLite Database)**:
   - File cơ sở dữ liệu: `server/data/tiem_gau_bong.sqlite`.
   - Lưu trữ thật sự, hỗ trợ bảng quan hệ chuẩn: `users`, `products`, `orders`, `categories`, `vouchers`, `reviews`, `articles`, `settings`.
   - Không cần cài server DB rườm rà (XAMPP hay MongoDB), giáo viên chấm bài tải về máy là chạy được ngay lập tức 100%!

---

## 🚀 2. Hướng Dẫn Khởi Chạy Nhanh

Mở terminal tại thư mục `tiem-gau-bong`:

### ⚡ Cách 1: Chạy 1 Lệnh Duy Nhất Cho Cả Frontend & Backend (Khuyên Dùng)
```bash
npm run dev:all
```
> Lệnh này sẽ tự động khởi chạy đồng thời cả Server Backend (Port 5000) và Web Frontend (Port 5173).

---

### 🛠️ Cách 2: Chạy Riêng 2 Terminal

**Terminal 1 - Khởi động Backend & SQLite:**
```bash
npm run server
```
*(Server chạy tại `http://localhost:5000`, nạp cơ sở dữ liệu `tiem_gau_bong.sqlite`)*

**Terminal 2 - Khởi động Frontend Web:**
```bash
npm run dev
```
*(Mở trình duyệt tại `http://localhost:5173`)*

---

## 🔑 3. Tài Khoản Đăng Nhập Thử Nghiệm

Hệ thống đã nạp sẵn các tài khoản thật trong SQLite:

| Loại tài khoản | Tài khoản / Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin` hoặc `admin@tiembong.vn` | `admin` hoặc `admin123` | Quản trị toàn bộ hệ thống, đơn hàng, sản phẩm |
| **Khách hàng thân thiết** | `0988123456` hoặc `tiembong@gmail.com` | `123456` | Mua hàng, xem lịch sử đơn, tích xu |
| **Khách hàng mới** | *Tự bấm "Đăng ký ngay" trên web* | *Tự đặt (>= 6 ký tự)* | Lưu trực tiếp vào bảng `users` của SQLite |

---

## 📊 4. Cấu Trúc Bảng Cơ Sở Dữ Liệu SQLite (Dùng cho Báo cáo Đồ án)

Các bảng được định nghĩa trong file `server/database.js`:
- `users`: Tài khoản, thông tin cá nhân, phân quyền (customer / admin), hạng thành viên, xu tích lũy.
- `products`: Mã sản phẩm, tên gấu, danh mục, giá bán, giá gốc, tồn kho, đánh giá, mô tả.
- `orders`: Mã đơn hàng, thông tin khách, địa chỉ giao hàng, danh sách gấu bông, thiệp viết tay, tổng tiền, trạng thái đơn.
- `categories`: Danh mục sản phẩm (Gấu Teddy, Combo quà, Búp bê,...).
- `vouchers`: Mã giảm giá, điều kiện áp dụng, hạn sử dụng.
- `reviews`: Nhận xét và đánh giá sao của khách hàng.
- `articles`: Tin tức, câu chuyện về quà tặng vintage.
- `settings`: Cấu hình thông tin tiệm gấu bông.

---

## ⚙️ 3. Các Tính Năng Của Trang Quản Trị (Backend Admin Portal)

Để mở trang quản trị:
- Nhấp vào nút **`⚙️ Quản Trị Backend`** trên thanh Header của website.
- Hoặc bấm vào biểu tượng **Tài khoản (User)** / liên kết ở phần Footer.

Các chức năng chính trong Trang Quản Trị:
1. **📊 Tổng Quan (Dashboard Overview)**:
   - 4 thẻ KPI: Doanh thu thực tế, Tổng đơn hàng & đơn chờ duyệt, Tồn kho, Cảnh báo gấu sắp hết hàng (<= 5 bé).
   - Biểu đồ trực quan doanh thu 7 ngày trong tuần.
   - Bảng đơn hàng mới nhất cần xác nhận ngay.
   - Top 4 bé gấu bán chạy nhất của tiệm.
2. **🧸 Quản Lý Sản Phẩm (Products CRUD)**:
   - Xem danh sách gấu bông với ảnh thumbnail, giá bán, giá cũ, tồn kho, nhãn tag.
   - Bộ lọc theo danh mục, trạng thái tồn kho và thanh tìm kiếm nhanh.
   - **Thêm bé gấu mới**: Form nhập chi tiết kèm danh sách ảnh mẫu gấu bông đẹp có sẵn.
   - **Chỉnh sửa** và **Xóa** bé gấu khỏi cửa hàng.
3. **📦 Quản Lý Đơn Hàng (Orders Management)**:
   - Lọc đơn theo trạng thái: *Chờ xác nhận*, *Đang chuẩn bị & viết thiệp*, *Đang giao hỏa tốc*, *Đã giao thành công*, *Đã hủy*.
   - Chuyển trạng thái đơn hàng 1-click (Duyệt đơn, Giao hàng, Hoàn thành).
   - **Chi Tiết Đơn Hàng**: Xem thông tin khách, địa chỉ, số điện thoại, phương thức thanh toán.
   - **ĐẶC BIỆT - Khung Thiệp Viết Tay Vintage**: Xem lời nhắn nhủ viết tay nét chữ cổ điển của khách hàng gửi cho người thương.
4. **🏷️ Danh Mục (Categories)**:
   - Thêm nhóm gấu mới, quản lý số lượng bé gấu thuộc từng nhóm.
5. **💌 Góc Thiệp Viết Tay & Lời Chúc (Gift Cards)**:
   - Nơi tập hợp tất cả lời chúc gửi gắm của khách hàng để tiệm nắn nót viết tay bằng mực nâu.
6. **⚙️ Cài Đặt Cửa Hàng (Settings)**:
   - Tên tiệm, slogan, hotline, địa chỉ, mức freeship, banner thông báo đầu trang.

---

## 📡 4. Danh Sách REST API Endpoints

| Phương thức | Endpoint | Mô tả |
|------------|---------|-------|
| `GET` | `/api/health` | Kiểm tra tình trạng server |
| `GET` | `/api/stats` | Lấy dữ liệu thống kê, doanh thu, biểu đồ |
| `GET` | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ filter category, search, stockStatus) |
| `GET` | `/api/products/:id` | Lấy chi tiết 1 sản phẩm |
| `POST` | `/api/products` | Thêm sản phẩm mới |
| `PUT` | `/api/products/:id` | Cập nhật thông tin sản phẩm |
| `DELETE` | `/api/products/:id` | Xóa sản phẩm |
| `GET` | `/api/orders` | Lấy danh sách đơn hàng (hỗ trợ filter status, search) |
| `POST` | `/api/orders` | Đặt đơn hàng mới (tự động trừ tồn kho) |
| `PUT` | `/api/orders/:id/status` | Cập nhật trạng thái đơn hàng |
| `DELETE` | `/api/orders/:id` | Xóa đơn hàng |
| `GET` | `/api/categories` | Lấy danh sách danh mục |
| `POST` | `/api/categories` | Thêm danh mục mới |
| `DELETE` | `/api/categories/:id` | Xóa danh mục |
| `GET` | `/api/settings` | Lấy cấu hình tiệm |
| `PUT` | `/api/settings` | Cập nhật cấu hình tiệm |
