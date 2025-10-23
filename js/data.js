/*
 © 2025 Hòa Quang Thắng. Mọi quyền được bảo lưu. 
 Ghi chú: Các chú thích bên dưới được thêm tự động để giải thích mã nguồn mà KHÔNG thay đổi logic.
*/
window.SMS_SCENARIOS = [
  {
    "id": "bank_lock",
    "who": "Ngân hàng X",
    "channel": "SMS",
    "script": [
      "[Ngân hàng X] Tài khoản của bạn có giao dịch lạ.",
      "Vui lòng xác minh để tránh khóa.",
      "Truy cập: http://bit.ly/secure"
    ],
    "actions": {
      "A": "Bấm link/Điền form",
      "B": "Gọi/kiểm tra kênh chính thức",
      "C": "Thoát chat"
    },
    "correct": "B",
    "explain": "Link rút gọn thường che dấu địa chỉ giả. Hãy tự gõ website chính thức hoặc gọi hotline.",
    "tag": "bank"
  },
  {
    "id": "bank_refund",
    "who": "Ngân hàng X",
    "channel": "SMS",
    "script": [
      "Bạn được hoàn 2.450.000đ.",
      "Điền thông tin thẻ để nhận trong 24h.",
      "Link: http://short.ly/tax"
    ],
    "actions": {
      "A": "Bấm link/Điền form",
      "B": "Gọi/kiểm tra kênh chính thức",
      "C": "Thoát chat"
    },
    "correct": "B",
    "explain": "Không nhập thẻ qua link lạ. Kiểm tra trên app/cổng chính thức.",
    "tag": "bank"
  },
  {
    "id": "ship_fee",
    "who": "Giao hàng",
    "channel": "SMS",
    "script": [
      "Đơn hàng thiếu 12.000đ phí vận chuyển.",
      "Nhấp để xác nhận:",
      "http://tiny.one/vandon"
    ],
    "actions": {
      "A": "Bấm link/Điền form",
      "B": "Gọi/kiểm tra kênh chính thức",
      "C": "Thoát chat"
    },
    "correct": "B",
    "explain": "Chỉ thanh toán trên app/sàn chính thức. Link rút gọn có thể chứa app độc.",
    "tag": "delivery"
  },
  {
    "id": "zalo_clone",
    "who": "'Bạn trên Zalo'",
    "channel": "Chat",
    "script": [
      "Tớ đang cần tiền gấp.",
      "Gửi tớ 1.5 triệu nhé.",
      "Đừng gọi, mất sóng."
    ],
    "actions": {
      "A": "Bấm link/Điền form",
      "B": "Gọi/kiểm tra kênh chính thức",
      "C": "Thoát chat"
    },
    "correct": "B",
    "explain": "Gọi số đã lưu để kiểm tra, đừng chuyển tiền.",
    "tag": "relative"
  },
  {
    "id": "power_bill",
    "who": "'Điện lực'",
    "channel": "SMS",
    "script": [
      "Tiền điện tháng này còn nợ.",
      "Thanh toán tại: http://pay-power.co/bill",
      "Sẽ cắt điện nếu không nộp."
    ],
    "actions": {
      "A": "Bấm link/Điền form",
      "B": "Gọi/kiểm tra kênh chính thức",
      "C": "Thoát chat"
    },
    "correct": "B",
    "explain": "Chỉ thanh toán tại cổng chính thức hoặc app điện lực.",
    "tag": "utility"
  }
]