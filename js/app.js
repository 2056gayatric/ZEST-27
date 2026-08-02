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
function renderPlayers() {
  const sports = ["Cricket", "Basketball", "Football"];
  let html = "";
  sports.forEach(sport => {
    const top = AIAgents.topPerformer(sport);
    ZEST_DATA.players.filter(p => p.sport === sport).forEach(p => {
      const team = teamById(p.team);
      const isTop = top && p.id === top.id;
      const statBlocks = sport === "Cricket"
        ? `<div><span class="v">${p.runs}</span><span class="l">Runs</span></div><div><span class="v">${p.wickets}</span><span class="l">Wickets</span></div>`
        : sport === "Basketball"
        ? `<div><span class="v">${p.points}</span><span class="l">Points</span></div><div><span class="v">${p.assists}</span><span class="l">Assists</span></div>`
        : `<div><span class="v">${p.goals}</span><span class="l">Goals</span></div><div><span class="v">${p.assists}</span><span class="l">Assists</span></div>`;

      html += `
        <div class="card player-card">
          <div class="player-top">
            <div>
              <div class="player-name">${p.name}</div>
              <div class="player-role">${team.name} · ${p.role} · ${sport}</div>
            </div>
            ${isTop ? `<span class="mvp-flag">🤖 AI Top Performer</span>` : ""}
          </div>
          <div class="player-stats">${statBlocks}</div>
        </div>`;
    });
  });
  document.getElementById("players-grid").innerHTML = html;
}

/* ---------- Teams ---------- */
function renderTeams() {
  document.getElementById("teams-grid").innerHTML = ZEST_DATA.teams.map(t => `
    <div class="card" style="text-align:center;">
      <div class="team-swatch" style="background:${t.color}; margin:0 auto 12px; width:52px; height:52px; font-size:1rem;">${t.short}</div>
      <div class="player-name">${t.name}</div>
      <div class="player-role">${t.won}W - ${t.lost}L · ${t.points} pts</div>
    </div>`).join("");
}

/* ---------- Sponsors ---------- */
function renderSponsors() {
  document.getElementById("sponsors-grid").innerHTML = ZEST_DATA.sponsors.map(s => `
    <div class="card sponsor-card">
      <div class="player-name">${s.name}</div>
      <div class="sponsor-tier">${s.tier} Sponsor</div>
    </div>`).join("");
}

/* ---------- Gallery ---------- */
function renderGallery() {
  document.getElementById("gallery-grid").innerHTML = ZEST_DATA.gallery.map(g => `
    <div class="card gallery-card">
      <div class="gallery-thumb">📷</div>
      <div class="player-name" style="font-size:.9rem;">${g.caption}</div>
      <div class="player-role">${g.tag}</div>
    </div>`).join("");
}

/* ---------- About Us ---------- */
function renderAbout() {
  const a = ZEST_DATA.about;
  document.getElementById("about-organiser-name").textContent = a.organiser;
  document.getElementById("about-name").textContent = a.tournamentName;
  document.getElementById("about-dates").textContent = a.dates;
  document.getElementById("about-locations").textContent = a.locations;
  document.getElementById("about-ball").textContent = a.ballType;
  document.getElementById("about-association").textContent = a.association;
  document.getElementById("about-desc").textContent = a.description;
}

/* ---------- Contact ---------- */
function renderContact() {
  document.getElementById("contact-grid").innerHTML = ZEST_DATA.contact.map(c => `
    <div class="card contact-card">
      <div class="player-name">${c.title}</div>
      <div class="player-role">${c.desc}</div>
      <div class="contact-line">✉ ${c.email}</div>
      <div class="contact-line">📞 ${c.phone}</div>
    </div>`).join("");
}

/* ---------- AI Insights (10 agents, equally weighted grid) ---------- */
