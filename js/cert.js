/*
 © 2025 Hòa Quang Thắng. Mọi quyền được bảo lưu. 
 Ghi chú: Các chú thích bên dưới được thêm tự động để giải thích mã nguồn mà KHÔNG thay đổi logic.
*/
(function(){
// Giải thích: Truy vấn DOM để lấy/thao tác phần tử giao diện.
  const canvas = document.getElementById('cert');
  const ctx = canvas.getContext('2d');
  const fin = JSON.parse(localStorage.getItem('tb_result')||'{}');
  const player = JSON.parse(localStorage.getItem('tb_player')||'{}');
  const name = (player && player.name) ? player.name : (fin.name||"Người chơi");

// Giải thích: Truy vấn DOM để lấy/thao tác phần tử giao diện.
  const titleEl = document.getElementById('certTitle');
// Giải thích: Truy vấn DOM để lấy/thao tác phần tử giao diện.
  const subEl = document.getElementById('certSub');

  const lost = !!fin.lost;
  const win = !!fin.win;
  let title, subtitle, stamp, stampColor;

  if(lost){
    title = "💥 BẠN ĐÃ BỊ LỪA";
    subtitle = "Đừng nản — đọc lại 3 nguyên tắc và thử lại nhé.";
    stamp = "FAILED";
    stampColor = "#ef4444";
  }else if(win){
    title = "🎉 GIẤY CHỨNG NHẬN";
    subtitle = "Hoàn thành thử thách “SMS”";
    stamp = "PASSED";
    stampColor = "#22c55e";
  }else{
    title = "📘 BẢNG TỔNG KẾT";
    subtitle = "Bạn đã hoàn tất thử thách.";
    stamp = "COMPLETED";
    stampColor = "#3b82f6";
  }

  titleEl.textContent = title;
  subEl.textContent = subtitle;

  // Background
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0,0,canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 6;
  ctx.strokeRect(20,20,canvas.width-40,canvas.height-40);

  // Dots
  ctx.fillStyle = '#3b82f622';
  for(let i=0;i<28;i++){
    ctx.beginPath();
    ctx.arc(80+ i*33, 90 + Math.sin(i/2)*6, 5, 0, Math.PI*2);
    ctx.fill();
  }

  // Text — force Arial first to avoid missing glyphs
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'center';
  ctx.font = 'bold 48px Arial, "Segoe UI", Tahoma, Verdana, sans-serif';
  ctx.fillText(title, canvas.width/2, 160);

  ctx.font = 'bold 56px Arial, "Segoe UI", Tahoma, Verdana, sans-serif';
  ctx.fillStyle = '#111827';
  ctx.fillText(name, canvas.width/2, 240);

  ctx.font = '24px Arial, "Segoe UI", Tahoma, Verdana, sans-serif';
  ctx.fillStyle = '#334155';
  ctx.fillText(subtitle, canvas.width/2, 290);

  const boxX=160, boxY=340, boxW=canvas.width-320, boxH=220;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth=3; ctx.strokeRect(boxX, boxY, boxW, boxH);
  ctx.fillStyle = '#0f172a'; ctx.textAlign='left'; ctx.font='bold 24px Arial, "Segoe UI", Tahoma, Verdana, sans-serif';
  ctx.fillText('Tổng kết', boxX+20, boxY+40);
  ctx.font='22px Arial, "Segoe UI", Tahoma, Verdana, sans-serif';
  ctx.fillStyle='#334155';
  ctx.fillText(`Số ngày: ${fin.days||'-'}`, boxX+20, boxY+80);
  ctx.fillText(`Điểm: ${fin.score||0}`, boxX+20, boxY+110);
  ctx.fillText(`Đúng: ${fin.safe||0}`, boxX+20, boxY+140);
  ctx.fillText(`Sai: ${fin.wrong||0}`, boxX+20, boxY+170);
  ctx.fillText(`Trust: ${fin.trust||0}/100`, boxX+20, boxY+200);

  ctx.textAlign='right';
  ctx.font='bold 36px Arial, "Segoe UI", Tahoma, Verdana, sans-serif';
  ctx.fillStyle = (lost? "#ef4444" : (win? "#22c55e" : "#3b82f6"));
  ctx.fillText(lost? "FAILED" : (win? "PASSED" : "COMPLETED"), boxX+boxW-20, boxY+boxH-20);

  ctx.textAlign='center';
  ctx.font='16px Arial, "Segoe UI", Tahoma, Verdana, sans-serif';
  ctx.fillStyle='#64748b';
  ctx.fillText('© Hòa Quang Thắng', canvas.width/2, 660);

// Giải thích: Đăng ký sự kiện 'click' cho phần tử — phản hồi tương tác người dùng.
  document.getElementById('btnSave').addEventListener('click', ()=>{
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url; a.download = `GiayChungNhan_TranhBaySMS_${Date.now()}.png`;
    a.click();
  });
})();