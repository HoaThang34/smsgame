/*
 © 2025 Hòa Quang Thắng. Mọi quyền được bảo lưu. 
 Ghi chú: Các chú thích bên dưới được thêm tự động để giải thích mã nguồn mà KHÔNG thay đổi logic.
*/
(function(){
// Giải thích: Truy vấn DOM để lấy/thao tác phần tử giao diện.
  const $ = (s)=>document.querySelector(s);

  const saved = JSON.parse(localStorage.getItem("tb_player")||"{}");
  const name = saved.name || "Người chơi";
  const days = saved.days || 5;
  const notifOn = saved.notif !== false;

  const eng = new GameEngine(name, days, notifOn);

  // Theme toggle
  const storedTheme = localStorage.getItem('tb_theme') || 'light';
  document.documentElement.setAttribute('data-theme', storedTheme);
  $("#btnTheme").textContent = storedTheme === 'dark' ? '☀️' : '🌙';
  $("#btnTheme").onclick = ()=>{
    const t = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('tb_theme', t);
    $("#btnTheme").textContent = t === 'dark' ? '☀️' : '🌙';
  };

  $("#titleName").textContent = name;
  $("#dayMax").textContent = String(days);
  updateHUD();

  // Sounds
  const ctxAudio = new (window.AudioContext || window.webkitAudioContext)();
// Giải thích: Hàm ping(freq=880, duration=0.08, type='sine') — xử lý một tác vụ cụ thể trong ứng dụng.
  function ping(freq=880, duration=0.08, type='sine'){
    const o = ctxAudio.createOscillator();
    const g = ctxAudio.createGain();
    o.type = type; o.frequency.value = freq;
    o.connect(g); g.connect(ctxAudio.destination);
    g.gain.setValueAtTime(0.0001, ctxAudio.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctxAudio.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctxAudio.currentTime + duration);
    o.start(); o.stop(ctxAudio.currentTime + duration + 0.02);
  }
// Giải thích: Hàm msgSound() — xử lý một tác vụ cụ thể trong ứng dụng.
  function msgSound(){ ping(880, .09, 'triangle'); }
// Giải thích: Hàm notifSound() — xử lý một tác vụ cụ thể trong ứng dụng.
  function notifSound(){ ping(520, .12, 'sine'); setTimeout(()=>ping(740,.09,'sine'), 90); }

  const toast = $("#toast");
// Giải thích: Hàm showToast() — xử lý một tác vụ cụ thể trong ứng dụng.
  function showToast(){ toast.classList.remove("hidden"); setTimeout(()=>toast.classList.add("hidden"), 2400); }
  setTimeout(showToast, 1200);

  let currentScenario = null;
  let answered = false;

// Giải thích: Hàm showBanner(prevDay, newDay) — xử lý một tác vụ cụ thể trong ứng dụng.
  function showBanner(prevDay, newDay){
// Giải thích: Truy vấn DOM để lấy/thao tác phần tử giao diện.
    const b = document.getElementById('dayBanner');
// Giải thích: Truy vấn DOM để lấy/thao tác phần tử giao diện.
    const t = document.getElementById('bannerTitle');
// Giải thích: Truy vấn DOM để lấy/thao tác phần tử giao diện.
    const s = document.getElementById('bannerSub');
    t.textContent = `Chúc mừng!`;
    s.textContent = `Bạn vừa hoàn thành Ngày ${prevDay}. Chào mừng Ngày ${newDay}!`;
    b.classList.remove('hidden');
    setTimeout(()=> b.classList.add('hidden'), 1200);
  }

  startDay();

// Giải thích: Hàm startDay() — xử lý một tác vụ cụ thể trong ứng dụng.
  function startDay(){
    $("#dayNow").textContent = String(eng.day);
    hide("#explain"); hideSel("#chatWrap"); hideSel("#calm"); hideSel("#notif");

    const hasMsg = eng.rollHasMessage();
    if(hasMsg && eng.notif){
      show("#notif"); notifSound();
      $("#btnOpenNotif").onclick = openChat;
    }else if(hasMsg){
      openChat();
    }else{
      show("#calm");
      setTimeout(proceedNext, 1000); // auto next with delay
    }
  }

// Giải thích: Hàm openChat() — xử lý một tác vụ cụ thể trong ứng dụng.
  function openChat(){
    hide("#notif"); hide("#calm"); show("#chatWrap");

    currentScenario = eng.pickScenario();
    answered = false;
    renderScript(currentScenario);
    setupActions(currentScenario);

    // Gestures
    const body = $("#chatBody");
    let sx=0, sy=0, ex=0, ey=0;
    body.ontouchstart = (e)=>{ const t=e.changedTouches[0]; sx=t.clientX; sy=t.clientY; };
    body.ontouchend = (e)=>{
      const t=e.changedTouches[0]; ex=t.clientX; ey=t.clientY;
      const dx = ex - sx, dy = ey - sy;
      if(Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)){
        if(dx > 0) doAnswer('B', currentScenario); else doAnswer('C', currentScenario);
        if(navigator.vibrate) navigator.vibrate(10);
      }
    };
  }

// Giải thích: Hàm renderScript(scn) — xử lý một tác vụ cụ thể trong ứng dụng.
  function renderScript(scn){
    $("#chatName").textContent = scn.who;
    $("#chatMeta").textContent = "đang gõ...";
    const body = $("#chatBody"); body.innerHTML = "";
    const typing = $("#typing");
    typing.classList.remove("hidden");
    let i=0;
// Giải thích: Hàm pushNext() — xử lý một tác vụ cụ thể trong ứng dụng.
    function pushNext(){
      if(i >= scn.script.length){
        typing.classList.add("hidden");
        $("#chatMeta").textContent = "vừa gửi tin nhắn";
        return;
      }
      const m = scn.script[i++];
      const bubble = document.createElement("div");
      bubble.className = "msg left anim-rise";
      const linkMatch = m.match(/https?:\/\/\S+/);
      if(linkMatch){
        const link = linkMatch[0];
        bubble.innerHTML = `<div>${escapeHTML(m.replace(link,''))}</div><div class="preview"><a class="link" href="#" onclick="return false">${escapeHTML(link)}</a><div class="meta">link rút gọn</div></div>`;
// Giải thích: Đăng ký sự kiện 'click' cho phần tử — phản hồi tương tác người dùng.
        bubble.addEventListener('click', ()=> doAnswer('A', scn));
      }else{
        bubble.innerHTML = `<div>${escapeHTML(m)}</div>`;
      }
      body.appendChild(bubble);
      body.scrollTop = body.scrollHeight;
      msgSound();
      setTimeout(pushNext, 650);
    }
    pushNext();
  }

// Giải thích: Hàm setupActions(scn) — xử lý một tác vụ cụ thể trong ứng dụng.
  function setupActions(scn){
    $("#actA").onclick = ()=> doAnswer('A', scn);
    $("#actB").onclick = ()=> doAnswer('B', scn);
    $("#actC").onclick = ()=> doAnswer('C', scn);
  }

// Giải thích: Hàm doAnswer(letter, scn) — xử lý một tác vụ cụ thể trong ứng dụng.
  function doAnswer(letter, scn){
    if(answered) return;
    answered = true;

    const body = $("#chatBody");
    const reply = document.createElement("div");
    reply.className = "msg right anim-rise";
    reply.innerHTML = `<div>${escapeHTML(scn.actions[letter])}</div>`;
    body.appendChild(reply);
    body.scrollTop = body.scrollHeight;
    msgSound();

    const res = eng.applyAnswer(scn, letter);
    $("#explain").textContent = res.explain || "";
    show("#explain");
    disableActions();
    updateHUD();

    if(eng.lost){ setTimeout(finish, 1100); }
    else { setTimeout(proceedNext, 1100); }
  }

// Giải thích: Hàm proceedNext() — xử lý một tác vụ cụ thể trong ứng dụng.
  function proceedNext(){
    if(eng.day < eng.days){
      const prev = eng.day;
      eng.nextDay();
      showBanner(prev, eng.day);
      setTimeout(()=>{ enableActions(); startDay(); }, 1100);
    }else{
      finish();
    }
  }else{
      finish();
    }
  }

// Giải thích: Hàm finish() — xử lý một tác vụ cụ thể trong ứng dụng.
  function finish(){
    const fin = eng.finalResult();
    localStorage.setItem("tb_result", JSON.stringify(fin));
    location.href = "certificate.html";
  }

// Giải thích: Hàm disableActions() — xử lý một tác vụ cụ thể trong ứng dụng.
  function disableActions(){ ["actA","actB","actC"].forEach(id=>{ $("#"+id).disabled = true; }); }
// Giải thích: Hàm enableActions() — xử lý một tác vụ cụ thể trong ứng dụng.
  function enableActions(){ ["actA","actB","actC"].forEach(id=>{ $("#"+id).disabled = false; }); }

// Giải thích: Hàm updateHUD() — xử lý một tác vụ cụ thể trong ứng dụng.
  function updateHUD(){ $("#score").textContent = eng.score; $("#trust").textContent = eng.trust; }

// Giải thích: Hàm show(sel) — xử lý một tác vụ cụ thể trong ứng dụng.
  function show(sel){ $(sel).classList.remove("hidden"); }
// Giải thích: Hàm hide(sel) — xử lý một tác vụ cụ thể trong ứng dụng.
  function hide(sel){ $(sel).classList.add("hidden"); }
// Giải thích: Hàm hideSel(sel) — xử lý một tác vụ cụ thể trong ứng dụng.
  function hideSel(sel){ const el=$(sel); if(el) el.classList.add("hidden"); }

// Giải thích: Hàm escapeHTML(s) — xử lý một tác vụ cụ thể trong ứng dụng.
  function escapeHTML(s){ return (s||"").replace(/[&<>\"']/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }
})();