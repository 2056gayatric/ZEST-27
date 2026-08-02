/* ============================================================
   ZEST'27 — APP LOGIC
   Renders all data-driven sections and wires the AI agents
   (aiAgents.js) into the UI. Pure vanilla JS, no build step.
   ============================================================ */

const teamById = (id) => ZEST_DATA.teams.find(t => t.id === id);
const initials = (name) => name.split(" ").map(w => w[0]).join("").slice(0, 3).toUpperCase();

/* ---------- Hero stat pills ---------- */
function renderHero() {
  document.getElementById("stat-matches").textContent = ZEST_DATA.fest.totalMatches;
  document.getElementById("stat-teams").textContent = ZEST_DATA.fest.totalTeams;
  document.getElementById("stat-sports").textContent = ZEST_DATA.fest.totalSports;

  const datesStr = ZEST_DATA.fest.dates || "";
  const m = datesStr.match(/^(.*?)\s+([A-Za-z]+\s+\d{4})$/);
  document.getElementById("date-days").textContent = m ? m[1] : datesStr;
  document.getElementById("date-monthyear").textContent = m ? m[2].toUpperCase() : "";

  document.getElementById("fest-venue").textContent = ZEST_DATA.fest.venue;
}

/* ---------- Tabs ---------- */
function initTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".panel");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      panels.forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.target).classList.add("active");
    });
  });
}

/* ---------- Matches (Schedule tab) ---------- */
function matchCardHTML(m) {
  const a = teamById(m.teamA), b = teamById(m.teamB);
  const commentary = AIAgents.generateCommentary(m);

  let predictBlock = "";
  if (m.status !== "completed") {
    predictBlock = `
      <button class="predict-btn" data-match="${m.id}">🤖 Ask AI: who wins?</button>
      <div class="predict-result" id="predict-${m.id}"></div>`;
  }

  return `
    <div class="card match-card">
      <span class="status ${m.status}">${m.status}</span>
      <div style="font-family:var(--font-mono); font-size:.7rem; color:var(--text-low); text-transform:uppercase;">${m.sport}</div>
      <div class="match-teams">
        <div class="team-block">
          <div class="team-swatch" style="background:${a.color}">${a.short}</div>
          <div>
            <div class="team-name">${a.name}</div>
            <div class="team-score">${m.scoreA}</div>
          </div>
        </div>
        <div class="vs">VS</div>
        <div class="team-block" style="flex-direction:row-reverse; text-align:right;">
          <div class="team-swatch" style="background:${b.color}">${b.short}</div>
          <div>
            <div class="team-name">${b.name}</div>
            <div class="team-score">${m.scoreB}</div>
          </div>
        </div>
      </div>
      <div class="match-meta"><span>${m.venue}</span><span>${m.time}</span></div>
      <div class="commentary"><span class="ai-tag">AI commentary ·</span> ${commentary}</div>
      ${predictBlock}
    </div>`;
}

function renderMatches() {
  const live = ZEST_DATA.matches.filter(m => m.status === "live");
  const upcoming = ZEST_DATA.matches.filter(m => m.status === "upcoming");
  const completed = ZEST_DATA.matches.filter(m => m.status === "completed");

  document.getElementById("live-matches").innerHTML = live.map(matchCardHTML).join("") || `<p class="hint">No live matches right now.</p>`;
  document.getElementById("upcoming-matches").innerHTML = upcoming.map(matchCardHTML).join("");
  document.getElementById("completed-matches").innerHTML = completed.map(matchCardHTML).join("");

  document.querySelectorAll(".predict-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const match = ZEST_DATA.matches.find(m => m.id === btn.dataset.match);
      const p = AIAgents.predictMatch(match);
      const target = document.getElementById(`predict-${match.id}`);
      target.innerHTML = `
        <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:.72rem; color:var(--text-mid);">
          <span>${p.teamA.short} ${p.probA}%</span><span>${p.teamB.short} ${p.probB}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-a" style="width:${p.probA}%"></div>
          <div class="bar-b" style="width:${p.probB}%"></div>
        </div>
        <div class="commentary" style="margin-top:8px;"><span class="ai-tag">AI predictor ·</span> ${p.favorite.name} favoured. ${p.reason}</div>`;
    });
  });
}

/* ---------- Points Table ---------- */
function renderPointsTable() {
  const sorted = [...ZEST_DATA.teams].sort((a, b) => b.points - a.points || b.nrr - a.nrr);
  const rows = sorted.map((t, i) => `
    <tr>
      <td><span class="rank-badge">${i + 1}</span></td>
      <td><strong>${t.name}</strong></td>
      <td class="num">${t.played}</td>
      <td class="num">${t.won}</td>
      <td class="num">${t.lost}</td>
      <td class="num">${t.nrr.toFixed(2)}</td>
      <td class="num" style="color:var(--red-glow); font-weight:700;">${t.points}</td>
    </tr>`).join("");

  document.getElementById("points-table-body").innerHTML = rows;
}

/* ---------- Player Stats / Heroes ---------- */
