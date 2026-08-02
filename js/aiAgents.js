/* ============================================================
   ZEST'27 — AI AGENTS LAYER
   ------------------------------------------------------------
   Ten lightweight, explainable "agents" that add intelligence
   on top of the raw fest data. They run entirely in the browser
   (no API key / backend required), so the site works instantly
   on GitHub Pages or a local double-click.

   Each agent is isolated in its own method — swap its logic for
   a fetch() call to a real LLM backend and the UI needs no
   change. See README.md → "Upgrading the agents" for a walkthrough.
   ============================================================ */

const AIAgents = {

  /* ---------- 1. MATCH PREDICTOR AGENT ----------
     Estimates a win probability for an upcoming/live match by
     weighing each team's win-rate, net run rate / goal form,
     and current points-table position. */
  predictMatch(match) {
    const a = ZEST_DATA.teams.find(t => t.id === match.teamA);
    const b = ZEST_DATA.teams.find(t => t.id === match.teamB);
    if (!a || !b) return null;

    const score = (team) => {
      const winRate = team.played ? team.won / team.played : 0.5;
      const form = (team.nrr + 2) / 4; // normalize roughly into 0..1
      const standing = team.points;
      return winRate * 0.5 + form * 0.3 + (standing / 10) * 0.2;
    };

    const sa = score(a), sb = score(b);
    const total = sa + sb || 1;
    const probA = Math.round((sa / total) * 100);
    const probB = 100 - probA;

    const favorite = probA >= probB ? a : b;
    const reason = `${favorite.name} has the stronger recent win-rate and net run rate, giving them the edge.`;

    return { teamA: a, teamB: b, probA, probB, favorite, reason };
  },

  /* ---------- 2. PLAYER-OF-THE-MATCH / FORM AGENT ----------
     Scans player stats and surfaces the standout performer per
     sport using a simple weighted-impact score. */
  topPerformer(sport) {
    const pool = ZEST_DATA.players.filter(p => p.sport === sport);
    if (!pool.length) return null;

    const impact = (p) => {
      if (sport === "Cricket") return (p.runs || 0) * 1 + (p.wickets || 0) * 20;
      if (sport === "Basketball") return (p.points || 0) * 1 + (p.assists || 0) * 2;
      if (sport === "Football") return (p.goals || 0) * 15 + (p.assists || 0) * 6;
      return 0;
    };

    return pool.reduce((best, p) => (impact(p) > impact(best) ? p : best), pool[0]);
  },

  /* ---------- 3. AUTO-COMMENTARY AGENT ----------
     Turns a raw match score line into a short, readable
     highlight blurb — handy for a live-updates feed. */
  generateCommentary(match) {
    const a = ZEST_DATA.teams.find(t => t.id === match.teamA);
    const b = ZEST_DATA.teams.find(t => t.id === match.teamB);
    if (!a || !b) return "";

    if (match.status === "live") {
      return `🔴 Live: ${a.name} are up against ${b.name} at ${match.venue}. Current score: ${match.scoreA}. Momentum is with the batting side as they push for a big total.`;
    }
    if (match.status === "completed") {
      if (match.result === "draw") {
        return `${a.name} and ${b.name} shared the spoils in a tightly fought draw, ${match.scoreA} - ${match.scoreB}.`;
      }
      const winner = ZEST_DATA.teams.find(t => t.id === match.result);
      return `${winner ? winner.name : "The visiting side"} closed out a hard-fought contest against ${winner && winner.id === a.id ? b.name : a.name}, final score ${match.scoreA} vs ${match.scoreB}.`;
    }
    return `Coming up: ${a.name} face ${b.name} at ${match.venue}, ${match.time}. Expect a closely contested ${match.sport.toLowerCase()} clash.`;
  },

  /* ---------- 4. DREAM TEAM / BEST XI SELECTOR AGENT ----------
     Ranks every player in a sport by impact score and returns
     a short "team of the tournament" list. */
  dreamTeam(sport, count = 3) {
    const pool = ZEST_DATA.players.filter(p => p.sport === sport);
    const impact = (p) => {
      if (sport === "Cricket") return (p.runs || 0) * 1 + (p.wickets || 0) * 20;
      if (sport === "Basketball") return (p.points || 0) * 1 + (p.assists || 0) * 2;
      if (sport === "Football") return (p.goals || 0) * 15 + (p.assists || 0) * 6;
      return 0;
    };
    return [...pool].sort((x, y) => impact(y) - impact(x)).slice(0, count);
  },

  /* ---------- 5. UPSET / ANOMALY DETECTOR AGENT ----------
     Flags completed matches where the lower-ranked team on the
     points table beat the higher-ranked team — the "shocks". */
  detectUpsets() {
    const rankOf = (id) => ZEST_DATA.teams.findIndex(t => t.id === id);
    const upsets = [];
    ZEST_DATA.matches.filter(m => m.status === "completed" && m.result !== "draw").forEach(m => {
      const winner = m.result;
      const loser = winner === m.teamA ? m.teamB : m.teamA;
      if (rankOf(winner) > rankOf(loser)) {
        const w = ZEST_DATA.teams.find(t => t.id === winner);
        const l = ZEST_DATA.teams.find(t => t.id === loser);
        upsets.push({ match: m, winner: w, loser: l });
      }
    });
    return upsets;
  },

  /* ---------- 6. FATIGUE & ROTATION ADVISOR AGENT ----------
     Counts how many matches a team has played and flags teams
     that may need a rest / rotation before their next fixture. */
  fatigueAdvisor(teamId) {
    const team = ZEST_DATA.teams.find(t => t.id === teamId);
    if (!team) return null;
    const recentCount = ZEST_DATA.matches.filter(
      m => (m.teamA === teamId || m.teamB === teamId) && m.status === "completed"
    ).length;
    const heavy = recentCount >= 4;
    return {
      team,
      recentCount,
      heavy,
      note: heavy
        ? `${team.name} have played ${recentCount} matches already — rotating a couple of players could help keep them fresh for the knockouts.`
        : `${team.name} have a manageable workload (${recentCount} matches) — no rotation concerns yet.`
    };
  },

  /* ---------- 7. MOMENTUM / TREND AGENT ----------
     Looks at each team's last 3 completed results and reports
     whether they're trending up, down, or steady. */
  momentum(teamId) {
    const team = ZEST_DATA.teams.find(t => t.id === teamId);
    if (!team) return null;
    const results = ZEST_DATA.matches
      .filter(m => m.status === "completed" && (m.teamA === teamId || m.teamB === teamId))
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map(m => (m.result === "draw" ? "D" : m.result === teamId ? "W" : "L"));

    const wins = results.filter(r => r === "W").length;
    let trend = "steady 🟡";
    if (wins >= 2) trend = "trending up 📈";
    if (wins === 0 && results.length) trend = "cooling off 📉";

    return { team, results, trend };
  },

  /* ---------- 8. SPONSOR VISIBILITY AGENT ----------
     Gives sponsors a lightweight, explainable "exposure score"
     based on how much of the fest is left to play. */
  sponsorInsights(sponsor) {
    const played = ZEST_DATA.matches.filter(m => m.status === "completed").length;
    const total = ZEST_DATA.fest.totalMatches;
    const remaining = total - played;
    const tierWeight = sponsor.tier === "Title" ? 1 : sponsor.tier === "Co-Sponsor" ? 0.7 : 0.45;
    const score = Math.round(tierWeight * (60 + remaining * 1.4));
    return {
      sponsor,
      remaining,
      score: Math.min(score, 99),
      note: `${sponsor.name} has ${remaining} matches of on-ground and live-dashboard visibility left as the ${sponsor.tier.toLowerCase()} sponsor.`
    };
  },

  /* ---------- 9. FUN FACT / TRIVIA AGENT ----------
     Generates a rotating, data-grounded fun fact about the fest —
     handy for filler content on the live dashboard. */
  funFact() {
    const facts = [];
    const topRuns = [...ZEST_DATA.players].filter(p => p.sport === "Cricket").sort((a, b) => (b.runs||0) - (a.runs||0))[0];
    if (topRuns) facts.push(`${topRuns.name} leads the run charts with ${topRuns.runs} runs so far this fest.`);

    const topWickets = [...ZEST_DATA.players].filter(p => p.sport === "Cricket").sort((a, b) => (b.wickets||0) - (a.wickets||0))[0];
    if (topWickets) facts.push(`${topWickets.name} has picked up ${topWickets.wickets} wickets — the most of any bowler.`);

    const leader = [...ZEST_DATA.teams].sort((a, b) => b.points - a.points)[0];
    facts.push(`${leader.name} sit top of the table with ${leader.points} points and a net run rate of ${leader.nrr.toFixed(2)}.`);

    const upsets = this.detectUpsets();
    if (upsets.length) facts.push(`There have already been ${upsets.length} upset${upsets.length > 1 ? "s" : ""} this fest — biggest shocks so far!`);

    facts.push(`${ZEST_DATA.fest.totalTeams} teams are chasing the ZEST'27 title across ${ZEST_DATA.fest.totalSports} sports.`);

    return facts[Math.floor(Math.random() * facts.length)];
  },

  /* ---------- 11. MVP PREDICTOR (Live Match Center) ----------
     Wraps topPerformer() with a rough confidence score for the
     dedicated live-match view. */
  predictMVP(sport) {
    const pool = ZEST_DATA.players.filter(p => p.sport === sport);
    if (!pool.length) return null;
    const impact = (p) => {
      if (sport === "Cricket") return (p.runs || 0) * 1 + (p.wickets || 0) * 20;
      if (sport === "Basketball") return (p.points || 0) * 1 + (p.assists || 0) * 2;
      if (sport === "Football") return (p.goals || 0) * 15 + (p.assists || 0) * 6;
      return 0;
    };
    const sorted = [...pool].sort((a, b) => impact(b) - impact(a));
    const top = sorted[0];
    const runnerUp = sorted[1];
    const gap = runnerUp ? impact(top) - impact(runnerUp) : impact(top);
    const confidence = Math.min(96, Math.round(60 + gap * 0.6));
    return { player: top, confidence };
  },

  /* ---------- 10. FEST ASSISTANT AGENT (chat) ----------
     A small intent-matching chatbot that answers common
     fest FAQs instantly, no network call needed. */
