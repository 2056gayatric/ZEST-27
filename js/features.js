/* ============================================================
   ZEST'27 — EXTRA FEATURES LAYER
   Live Match Center, Tournament Bracket, Team Comparison,
   Leaderboards, Medal Table, Statistics Charts, Live
   Notifications, Countdown Timer, and player badges.
   Built on top of data.js + aiAgents.js — no new dependencies
   except Chart.js (loaded via CDN in index.html).
   ============================================================ */

/* ---------- 1. LIVE MATCH CENTER ---------- */
function renderLiveCenter() {
  const el = document.getElementById("live-center");
  const detail = ZEST_DATA.liveMatchDetail;
  const match = ZEST_DATA.matches.find(m => m.id === detail.matchId);
  if (!match) { el.innerHTML = `<p class="hint">No live match right now.</p>`; return; }

  const a = teamById(match.teamA), b = teamById(match.teamB);
  const pred = AIAgents.predictMatch(match);
  const mvp = AIAgents.predictMVP(match.sport);

  el.innerHTML = `
    <div class="card live-scoreboard">
      <div class="live-sb-top">
        <span class="status live">live</span>
        <span class="hint" style="margin:0;">${match.sport} · ${match.venue}</span>
      </div>
      <div class="live-sb-teams">
        <div class="live-sb-team">
          <div class="team-swatch" style="background:${a.color}">${a.short}</div>
          <div class="team-name" style="font-size:1.1rem;">${a.name}</div>
          <div class="live-sb-score">${match.scoreA}</div>
        </div>
        <div class="live-sb-mid">
          <div class="vs">VS</div>
          <div class="live-sb-clock">${detail.quarter}<br/><strong>${detail.clock}</strong> remaining</div>
        </div>
        <div class="live-sb-team">
          <div class="team-swatch" style="background:${b.color}">${b.short}</div>
          <div class="team-name" style="font-size:1.1rem;">${b.name}</div>
          <div class="live-sb-score">${match.scoreB}</div>
        </div>
      </div>
    </div>

    <div class="grid cols-2" style="margin-top:16px;">
      <div class="card">
        <div class="section-head" style="margin:0 0 10px;"><h2 style="font-size:1rem;">🤖 Win Probability</h2></div>
        <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:.8rem; color:var(--text-mid);">
          <span>${pred.teamA.short} ${pred.probA}%</span><span>${pred.teamB.short} ${pred.probB}%</span>
        </div>
        <div class="bar-track" style="height:14px;"><div class="bar-a" style="width:${pred.probA}%"></div><div class="bar-b" style="width:${pred.probB}%"></div></div>
        <div class="commentary" style="margin-top:12px;"><span class="ai-tag">AI predictor ·</span> ${pred.favorite.name} favoured. ${pred.reason}</div>
      </div>
      <div class="card">
        <div class="section-head" style="margin:0 0 10px;"><h2 style="font-size:1rem;">⭐ MVP Prediction</h2></div>
        ${mvp ? `
          <div class="player-name" style="font-size:1.2rem;">${mvp.player.name}</div>
          <div class="player-role">${teamById(mvp.player.team).name} · ${match.sport}</div>
          <div style="margin-top:12px; font-family:var(--font-mono); font-size:.78rem; color:var(--text-low);">Confidence</div>
          <div class="bar-track"><div class="bar-a" style="width:${mvp.confidence}%"></div></div>
          <div style="text-align:right; font-family:var(--font-mono); font-size:.85rem; color:var(--gold); margin-top:4px;">${mvp.confidence}%</div>
        ` : `<p class="hint">Not enough data yet.</p>`}
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="section-head" style="margin:0 0 10px;"><h2 style="font-size:1rem;">📣 Match Timeline</h2></div>
      <div class="match-timeline">
        ${detail.timeline.map(ev => `
          <div class="timeline-row">
            <span class="timeline-t">${ev.t}</span>
            <span class="timeline-text">${ev.text}</span>
          </div>`).join("")}
      </div>
    </div>`;
}

/* ---------- 2. TOURNAMENT BRACKET ---------- */
function renderBracket() {
  const el = document.getElementById("bracket-wrap");
  const b = ZEST_DATA.bracket;

  const teamLabel = (id, winnerId, matchHasBothTeams) => {
    if (!id) return `<div class="bracket-slot tbd">TBD</div>`;
    const t = teamById(id);
    const isWinner = winnerId === id;
    return `<div class="bracket-slot ${isWinner ? "winner" : ""}">
      <span class="bracket-swatch" style="background:${t.color}"></span>${t.short}
    </div>`;
  };

  el.innerHTML = `
    <div class="hint" style="margin-bottom:14px;">${b.sport} · single elimination</div>
    <div class="bracket">
      ${b.rounds.map(round => `
        <div class="bracket-round">
          <div class="bracket-round-title">${round.name}</div>
          <div class="bracket-matches">
            ${round.matches.map(m => `
              <div class="bracket-match">
                ${teamLabel(m.teamA, m.winner)}
                ${teamLabel(m.teamB, m.winner)}
              </div>`).join("")}
          </div>
        </div>`).join("")}
    </div>`;
}

/* ---------- 3. TEAM COMPARISON ---------- */
function compareMetricRow(label, valA, valB, max) {
  const pa = Math.round((valA / max) * 100);
  const pb = Math.round((valB / max) * 100);
  return `
    <div class="compare-row">
      <div class="compare-label">${label}</div>
      <div class="compare-bars">
        <div class="compare-bar-track"><div class="compare-bar a" style="width:${pa}%"></div></div>
        <div class="compare-vals"><span>${valA}</span><span>${valB}</span></div>
        <div class="compare-bar-track"><div class="compare-bar b" style="width:${pb}%"></div></div>
      </div>
    </div>`;
}

function renderCompare() {
  const selA = document.getElementById("compare-team-a");
  const selB = document.getElementById("compare-team-b");
  const out = document.getElementById("compare-output");

  if (!selA.options.length) {
    ZEST_DATA.teams.forEach(t => {
      selA.add(new Option(t.name, t.id));
      selB.add(new Option(t.name, t.id));
    });
    selA.value = ZEST_DATA.teams[0].id;
    selB.value = ZEST_DATA.teams[1].id;
  }

  const draw = () => {
    const a = teamById(selA.value), b = teamById(selB.value);
    const winRateA = Math.round((a.won / a.played) * 100);
    const winRateB = Math.round((b.won / b.played) * 100);

    out.innerHTML = `
      <div class="compare-heads">
        <div><span class="team-swatch" style="background:${a.color}">${a.short}</span> ${a.name}</div>
        <div class="vs">VS</div>
        <div style="text-align:right;">${b.name} <span class="team-swatch" style="background:${b.color}">${b.short}</span></div>
      </div>
      ${compareMetricRow("Attack", a.attack, b.attack, 100)}
      ${compareMetricRow("Defense", a.defense, b.defense, 100)}
      ${compareMetricRow("Passing", a.passing, b.passing, 100)}
      ${compareMetricRow("Win Rate %", winRateA, winRateB, 100)}`;
  };

  selA.onchange = draw;
  selB.onchange = draw;
  draw();
}

/* ---------- 4. LEADERBOARDS ---------- */
function renderLeaderboard() {
  const el = document.getElementById("leaderboard-wrap");
  const sportsMeta = [
    { sport: "Cricket", metric: "runs", label: "Runs" },
    { sport: "Basketball", metric: "points", label: "Points" },
    { sport: "Football", metric: "goals", label: "Goals" }
  ];

  el.innerHTML = sportsMeta.map(sm => {
    const ranked = ZEST_DATA.players
      .filter(p => p.sport === sm.sport)
      .sort((x, y) => (y[sm.metric] || 0) - (x[sm.metric] || 0))
      .slice(0, 5);

    return `
      <div class="card">
        <div class="section-head" style="margin:0 0 10px;"><h2 style="font-size:1rem;">${sm.sport} — Top ${sm.label}</h2></div>
        <div class="leaderboard-list">
          ${ranked.map((p, i) => `
            <div class="leaderboard-row">
              <span class="rank-badge">${i + 1}</span>
              <span class="leaderboard-name">${p.name}</span>
              <span class="hint" style="margin:0;">${teamById(p.team).short}</span>
              <span class="leaderboard-val">${p[sm.metric] || 0}</span>
            </div>`).join("")}
        </div>
      </div>`;
  }).join("");
}

/* ---------- 7. LIVE NOTIFICATIONS ---------- */
function renderNotifications() {
  const list = document.getElementById("notif-list");
  const badge = document.getElementById("notif-badge");
  list.innerHTML = ZEST_DATA.notifications.map(n => `
    <div class="notif-row">
      <span class="notif-icon">${n.icon}</span>
      <div>
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <div class="notif-time">${n.minsAgo} min ago</div>
      </div>
    </div>`).join("");
  badge.textContent = ZEST_DATA.notifications.length;
  badge.style.display = ZEST_DATA.notifications.length ? "flex" : "none";
}

function pushNotification(icon, title, body) {
  ZEST_DATA.notifications.unshift({ icon, title, body, minsAgo: 0 });
  ZEST_DATA.notifications = ZEST_DATA.notifications.slice(0, 8);
  renderNotifications();
  showToast(icon, title, body);
}

function showToast(icon, title, body) {
  const host = document.getElementById("toast-host");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="notif-icon">${icon}</span><div><div class="notif-title">${title}</div><div class="notif-body">${body}</div></div>`;
  host.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 20);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 5000);
}

function initNotifications() {
  renderNotifications();
  const bell = document.getElementById("notif-bell");
  const panel = document.getElementById("notif-panel");
  bell.addEventListener("click", () => panel.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && !bell.contains(e.target)) panel.classList.remove("open");
  });

  // Simulate fresh live events every ~25s using AI commentary as the source.
  const sample = [
    { icon: "⚽", title: "Goal!", body: () => `${teamById(ZEST_DATA.teams[Math.floor(Math.random()*6)].id).name} finds the net.` },
    { icon: "🏀", title: "Momentum shift", body: () => AIAgents.momentum(ZEST_DATA.teams[Math.floor(Math.random()*6)].id).note ? `${AIAgents.momentum(ZEST_DATA.teams[0].id).team.name} is heating up.` : "Momentum shifting on court." },
    { icon: "🤖", title: "AI insight", body: () => AIAgents.funFact() }
  ];
  setInterval(() => {
    const s = sample[Math.floor(Math.random() * sample.length)];
    pushNotification(s.icon, s.title, s.body());
  }, 25000);
}

/* ---------- 8. COUNTDOWN TIMER ---------- */
function initCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const target = new Date(ZEST_DATA.countdownTarget).getTime();

  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) { el.innerHTML = `<div class="countdown-live">🔴 Match is live now!</div>`; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    el.innerHTML = `
      <div class="countdown-unit"><span>${d}</span><label>Days</label></div>
      <div class="countdown-unit"><span>${String(h).padStart(2,"0")}</span><label>Hours</label></div>
      <div class="countdown-unit"><span>${String(m).padStart(2,"0")}</span><label>Mins</label></div>
      <div class="countdown-unit"><span>${String(s).padStart(2,"0")}</span><label>Secs</label></div>`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- 9. EVENT TIMELINE (About-adjacent info block) ---------- */
function renderEventTimeline() {
  const el = document.getElementById("event-timeline");
  if (!el) return;
  el.innerHTML = ZEST_DATA.eventTimeline.map(ev => `
    <div class="timeline-row">
      <span class="timeline-t">${ev.time}</span>
      <span class="timeline-text"><strong>${ev.title}</strong> — ${ev.venue}</span>
    </div>`).join("");
}

/* ---------- 10. PLAYER BADGES (extends existing player cards) ---------- */
function renderBadges() {
  document.querySelectorAll(".player-card").forEach(card => {
    const name = card.querySelector(".player-name")?.textContent;
    const player = ZEST_DATA.players.find(p => p.name === name);
    if (player && player.badges && player.badges.length && !card.querySelector(".badge-row")) {
      const row = document.createElement("div");
      row.className = "badge-row";
      row.innerHTML = player.badges.map(b => `<span class="badge-chip">${b}</span>`).join("");
      card.appendChild(row);
    }
  });
}

/* ---------- 11. AI CHAT — quick suggestion chips ---------- */
function initChatChips() {
  const row = document.getElementById("ai-chips");
  if (!row) return;
  const chips = ["Who is leading?", "Next football match", "Predict today's winner", "Best player so far"];
  row.innerHTML = chips.map(c => `<button type="button" class="chip">${c}</button>`).join("");
  row.querySelectorAll(".chip").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById("ai-panel").classList.add("open");
      const form = document.getElementById("ai-form");
      const input = document.getElementById("ai-input");
      input.value = btn.textContent;
      form.dispatchEvent(new Event("submit", { cancelable: true }));
    });
  });
}

/* ---------- Init everything ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderLiveCenter();
  renderBracket();
  renderCompare();
  renderLeaderboard();
  initNotifications();
  initCountdown();
  renderEventTimeline();
  renderBadges();
  initChatChips();
});
