# Dự án quản lý chung cư (KTPM_20242)
## 1. 📘 Mô tả Dự Án

Phần mềm **Quản lý chung cư** là một hệ thống hỗ trợ toàn diện dành cho ban quản lý trong việc giám sát và vận hành các hoạt động nội bộ của khu chung cư. Ứng dụng cho phép:

- Quản lý thông tin cư dân, căn hộ, phương tiện một cách tập trung và hiệu quả
- Lập danh sách các khoản phí, theo dõi tiến độ thu phí
- Thống kê và báo cáo dữ liệu tài chính, phương tiện, hộ dân thông qua các biểu đồ trực quan
- Hỗ trợ tiếp nhận và xử lý các phản ánh, góp ý của cư dân

Hệ thống hướng đến mục tiêu xây dựng một quy trình quản lý hiện đại, minh bạch, chuyên nghiệp và tiết kiệm thời gian cho cả ban quản lý lẫn cư dân sinh sống trong tòa nhà.

## 📌 2. Tính Năng Chính

Dự án cung cấp đầy đủ các tính năng phục vụ công tác **quản lý cư dân, phương tiện và thu chi trong tòa nhà/chung cư**, bao gồm:

### 🔐 Xác thực người dùng
- **Đăng ký / Đăng nhập** sử dụng **JWT (JSON Web Token)** đảm bảo an toàn và xác thực hiệu quả.
- Quản lý **phiên đăng nhập**, bảo vệ các tài nguyên bằng cơ chế **role-based access** (nếu có).

### 📊 Thống kê & báo cáo
- **Biểu đồ doanh thu 30 ngày gần nhất** hiển thị trực quan bằng **ECharts**.
- **Biểu đồ thống kê số lượng hộ dân và loại phương tiện** sử dụng **ApexCharts**, dễ dàng nắm bắt tổng quan hệ thống.

### 🏠 Quản lý căn hộ
- Thêm mới / chỉnh sửa / xem chi tiết thông tin **một căn hộ**.
- Khi thêm thành viên vào căn hộ, hệ thống sẽ có tính năng **gợi ý cư dân đang tồn tại**, giúp thao tác nhanh và chính xác.

### 🚗 Quản lý phương tiện
- Thêm mới **một loại xe** với thông tin chi tiết.
- Xem chi tiết phương tiện và **xóa phương tiện** khi cần thiết.

### 👥 Quản lý cư dân
- Thêm mới cư dân với đầy đủ thông tin.
- Cho phép **đặt trạng thái cư dân** (đang sinh sống, đã chuyển đi, tạm vắng, v.v...) để theo dõi tình trạng cư trú.

### 💰 Quản lý khoản thu
- Thêm mới khoản thu theo 2 cách:
  - **Nhập tay thủ công** với đầy đủ thông tin.
  - **Nhập từ file Excel** giúp tiết kiệm thời gian khi xử lý dữ liệu số lượng lớn.

### 🧾 Các chức năng mở rộng khác (nếu có)
- Quản lý vai trò người dùng (Admin, Nhân viên, BQL,...)
- Gửi thông báo đến cư dân
- Ghi nhận phản hồi hoặc yêu cầu hỗ trợ từ người dân

### 🅿️ Quản lý bãi đỗ xe thông minh
- **Tích hợp công nghệ AI** để:
  - **Tự động phát hiện chỗ đậu xe còn trống hoặc đã đầy**
  - Hỗ trợ hiển thị **trực tiếp tình trạng bãi xe** trên giao diện người dùng
- Nâng cao trải nghiệm quản lý và giảm thiểu lỗi con người trong việc kiểm soát bãi xe


## 3. 🚀 Công Nghệ Sử Dụng

Dự án này được phát triển dựa trên kiến trúc **Fullstack hiện đại**, với các công nghệ mạnh mẽ và phổ biến hiện nay:

### 🖥️ Frontend

Được xây dựng bằng ReactJS cùng các thư viện hỗ trợ trực quan và linh hoạt:

- ⚛️ **ReactJS** – Thư viện JavaScript phổ biến cho xây dựng giao diện người dùng động
- 🎨 **MUI (Material UI)** – Bộ giao diện thiết kế hiện đại, hỗ trợ responsive tốt
- 📊 **ECharts** – Thư viện vẽ biểu đồ mạnh mẽ, đẹp mắt
- 📈 **ApexCharts** – Dễ dùng, phù hợp cho biểu đồ tương tác thời gian thực
- 🧭 **React Router** – Hỗ trợ định tuyến phía client cho ứng dụng nhiều trang

### 🔧 Backend

Hệ thống phía server được triển khai bằng:

- ☕ **Java Spring Boot** – Framework mạnh mẽ, linh hoạt, dễ mở rộng
- 🗄️ **RESTful API** – Chuẩn giao tiếp client-server rõ ràng, hiệu quả

### 🗃️ Database

Dữ liệu được lưu trữ và truy vấn hiệu quả bằng:

- 🐘 **PostgreSQL** – Hệ quản trị cơ sở dữ liệu mã nguồn mở mạnh mẽ, đáng tin cậy

## ⚙️ 4. Cách Cài Đặt và Hướng Dẫn Sử Dụng

Dưới đây là hướng dẫn chi tiết để bạn có thể cài đặt và chạy dự án trên môi trường local.

---

### 🧩 Yêu cầu hệ thống

- **Node.js** >= 16.x  
- **Java** >= 17  
- **PostgreSQL** >= 13  
- **Maven** hoặc **Gradle**  
- (Tùy chọn) Docker + Docker Compose nếu muốn chạy bằng container

---

### 🖥️ 1. Cài đặt Frontend (ReactJS)

```bash
# Bước 1: Di chuyển vào thư mục frontend
cd frontend

# Bước 2: Cài đặt các thư viện
npm install

# Bước 3: Chạy ứng dụng
npm start
```
## 5.Video demo
## 6. Trạng thái dự án
Dừng phát triển,kết thúc ở một môn học,các em khóa sau nếu muốn phát triển thêm có thể tham khảo
## 7. Tác giả và liên hệ
- Nguyễn Quốc Khánh-20225866
- Trần Doãn Huy-20225859