# 📔 Mekong Explorer - System Design & Debugging Notes

Lưu lại các lỗi kỹ thuật và giải pháp trong quá trình phát triển hệ thống.

---

### 1. Lỗi Docker Build: `standalone not found`

- **Lỗi hiển thị:** `COPY --from=builder /app/web/.next/standalone ./: not found`
- **Nguyên nhân:**
    - Trong `Dockerfile`, chúng ta sử dụng cơ chế **Standalone Output** của Next.js để tối ưu hóa kích thước image (chỉ copy những file thực sự cần thiết để chạy server, bỏ qua `node_modules` khổng lồ).
    - Tuy nhiên, mặc định Next.js không tự sinh ra thư mục này nếu không được cấu hình trong `next.config.ts`.
- **Hướng giải quyết:**
    - Thêm dòng `output: 'standalone'` vào file `web/next.config.ts`.
    - Khi đó, lệnh `npm run build` sẽ tạo ra một bản build "tự thân" tại `.next/standalone`, giúp Docker có thể copy và chạy độc lập.
- **System Design Insight:** Việc sử dụng standalone giúp giảm kích thước Docker Image từ ~1GB xuống còn ~100-200MB, cực kỳ quan trọng khi deploy lên các hệ thống Cloud (AWS, Vercel, v.v.) để tiết kiệm băng thông và tăng tốc độ khởi động (Cold Start).

---

### 2. Lỗi `ERR_CONNECTION_REFUSED` khi chạy Docker

- **Lỗi hiển thị:** Trình duyệt báo "This site can't be reached" (localhost refused to connect) mặc dù Docker báo container đã chạy.
- **Nguyên nhân:**
    - Mặc định, Next.js (và nhiều server khác) chỉ lắng nghe (listen) trên `localhost` (127.0.0.1) bên trong container.
    - Tuy nhiên, `localhost` bên trong container là "cô lập". Để Docker có thể chuyển hướng (port mapping) từ máy thật vào, server bên trong container phải lắng nghe trên tất cả các địa chỉ mạng (`0.0.0.0`).
- **Hướng giải quyết:**
    - Thêm biến môi trường `HOSTNAME=0.0.0.0` vào cấu hình service `web` trong `docker-compose.yml`.
- **System Design Insight:** Trong môi trường container, việc hiểu rõ sự khác biệt giữa `127.0.0.1` (loopback nội bộ) và `0.0.0.0` (tất cả interfaces) là kiến thức cơ bản về Network Networking. Các ứng dụng muốn giao tiếp bên ngoài container luôn phải binding vào `0.0.0.0`.

---

### 3. Lỗi `Bind for 0.0.0.0:3000 failed: port is already allocated`

- **Lỗi hiển thị:** `Error response from daemon: ... failed: port is already allocated`
- **Nguyên nhân:**
    - Bạn đang chạy một chương trình khác (thường là lệnh `npm run start:dev` trực tiếp trên máy) đang chiếm giữ cổng `3000`.
    - Mỗi cổng trên máy tính chỉ có thể được một ứng dụng "sở hữu" tại một thời điểm. Khi Docker cố gắng mapping cổng `3000` của container ra máy thật, nó bị hệ điều hành từ chối vì cổng này đã có chủ.
- **Hướng giải quyết:**
    - Tìm và tắt ứng dụng đang chạy ở cổng `3000` (ví dụ: tắt terminal đang chạy NestJS dev server).
    - Hoặc đổi cổng bên ngoài trong `docker-compose.yml` (ví dụ: `"3002:3000"`).
- **System Design Insight:** Quản lý tài nguyên hệ thống (như Port, Memory, CPU) là một phần quan trọng để tránh xung đột giữa các dịch vụ (Service Collision). Trong thực tế, các hệ thống lớn thường dùng các bộ điều phối (Orchestrator) để tự động hóa việc gán cổng này.

---

### 4. Lỗi `MODULE_NOT_FOUND` trong Docker Monorepo

- **Lỗi hiển thị:** API container bị crash ngay khi khởi động với log: `Error: Cannot find module 'api/dist/main'`.
- **Nguyên nhân:**
    - Trong cấu trúc Monorepo, file thực thi và `node_modules` được chia thành nhiều cấp (root và từng app).
    - Khi dùng Docker Multi-stage build, nếu chúng ta copy file vào Stage sản phẩm (`runner`) không đúng cấu trúc thư mục như lúc build, Node.js sẽ không tìm thấy các module phụ thuộc hoặc chính file chạy.
- **Hướng giải quyết:**
    - Kiểm tra kỹ đường dẫn trong lệnh `COPY` và `CMD`. Đảm bảo file chạy là `main.js` (không phải `main` không có đuôi nếu Node.js không tự nhận diện được cấu trúc thư mục).
    - Đảm bảo `node_modules` của từng app được đặt đúng vị trí so với file `dist`.
- **System Design Insight:** Bản chất của Docker là tạo ra môi trường bất biến (Immutable Environment). Việc cấu trúc lại thư mục trong Dockerfile đòi hỏi kỹ sư phải hiểu rõ cách Node.js tìm kiếm module (Module Resolution Algorithm) để đảm bảo ứng dụng chạy được sau khi đóng gói.

---

### 5. Thiết kế hệ thống quy mô lớn (Scaling to 10,000+ Users)

- **Bài toán:** Hệ thống cần mở rộng thế nào khi lượng người dùng tăng từ vài trăm lên hàng chục ngàn?
- **Giải pháp (Fundamental Design):**
    1.  **Horizontal Scaling (Mở rộng hàng ngang):** Thay vì dùng 1 server cực mạnh, ta dùng nhiều server nhỏ chạy song song sau một **Load Balancer**.
    2.  **Caching (Redis):** Giảm tải cho Database bằng cách lưu kết quả query vào RAM. "Dữ liệu nhanh nhất là dữ liệu không phải query từ đĩa".
    3.  **Hàng chờ (Message Queue):** Chuyển từ xử lý tuần tự (Synchronous) sang bất đồng bộ (Asynchronous) cho các tác vụ nặng như xử lý ảnh/video.
- **System Design Insight:** Khả năng mở rộng (Scalability) không phải là "thêm RAM/CPU" (Vertical Scale) mà là "thêm máy chạy song song" (Horizontal Scale). Một hệ thống được thiết kế tốt (Cloud-Native) phải có tính **Stateless** (không lưu trạng thái ở server) để có thể tắt/mở các server instance bất cứ lúc nào mà không mất dữ liệu.

---

### 6. Lỗi kết nối Redis (Network Isolation)

- **Vấn đề:** API không thể kết nối tới Redis mặc dù Docker báo container Redis đã chạy.
- **Nguyên nhân:**
    - Trong code, nếu ta để mặc định `localhost:6379`, API sẽ tự tìm Redis bên trong... chính nó (container API).
    - Trong Docker Network, mỗi container là một "máy tính" riêng.
- **Hướng giải quyết:**
    - Sử dụng tên Service làm Hostname. Thay vì `localhost:6379`, ta dùng `redis:6379`.
    - Cấu hình này được truyền qua biến môi trường `REDIS_URL` trong file `.env`.
- **System Design Insight:** Việc hiểu về Docker DNS và Service Discovery là cực kỳ quan trọng. Khi các dịch vụ giao tiếp với nhau, chúng ta luôn dùng tên dịch vụ thay vì địa chỉ IP hay localhost để đảm bảo tính linh hoạt khi hạ tầng thay đổi.
