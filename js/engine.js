/*
 © 2025 Hòa Quang Thắng. Mọi quyền được bảo lưu. 
 Ghi chú: Các chú thích bên dưới được thêm tự động để giải thích mã nguồn mà KHÔNG thay đổi logic.
*/
(function(){
  const clamp = (n,min,max)=>Math.min(Math.max(n,min),max);

// Giải thích: Lớp Engine — đóng gói dữ liệu và hành vi liên quan.
  class Engine {
    constructor(name, days=5, notif=true){
      this.name = name||"Người chơi";
      this.day = 1;
      this.days = days||5;
      this.notif = !!notif;
      this.score = 0;
      this.trust = 50;
      this.safe = 0;
      this.wrong = 0;
      this.history = [];
      this.lost = false;
    }
    rollHasMessage(){ return Math.random() < 0.8; }
    pickScenario(){ const p=window.SMS_SCENARIOS; return p[Math.floor(Math.random()*p.length)]; }
    applyAnswer(scn, choiceLetter){
      const safe = (choiceLetter === scn.correct);
      if(safe){ this.safe++; this.score += 10; this.trust = clamp(this.trust+6, 0, 100); }
      else { this.wrong++; this.score -= 8; this.trust = clamp(this.trust-12, 0, 100); this.lost = true; }
      this.history.push({ day:this.day, id: scn.id, choice:choiceLetter, lost:this.lost });
      return { safe, explain: scn.explain };
    }
    nextDay(){ this.day += 1; return this.day <= this.days; }
    finalResult(){ const needed=Math.ceil(this.days*0.7); const win=!this.lost && (this.safe>=needed || this.score>=this.days*6);
      return { name:this.name, days:this.days, score:this.score, trust:this.trust, safe:this.safe, wrong:this.wrong, win, lost:this.lost }; }
  }
  window.GameEngine = Engine;
})();