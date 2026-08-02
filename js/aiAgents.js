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
