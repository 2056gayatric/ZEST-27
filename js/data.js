/* ============================================================
   ZEST'27 — MOCK DATA STORE
   Replace these arrays with real data (or wire up a backend /
   Google Sheet / API) once the fest details are finalized.
   ============================================================ */

const ZEST_DATA = {
  fest: {
    name: "ZEST '27",
    tagline: "Arena of Dreams",
    dates: "3 – 15 January 2027",
    venue: "COEP Technological University, Pune",
    totalMatches: 24,
    totalTeams: 12,
    totalSports: 6,
    totalAgents: 10
  },

  teams: [
    { id: "t1", name: "COEP TECH",   short: "CTU",  color: "#E4172D", played: 6, won: 5, lost: 1, points: 10, nrr: 1.42,  attack: 88, defense: 74, passing: 81, gold: 5, silver: 2, bronze: 1 },
    { id: "t2", name: "AISSMS COE",  short: "AIS",  color: "#FFC93C", played: 6, won: 4, lost: 2, points: 8,  nrr: 0.85,  attack: 79, defense: 70, passing: 76, gold: 4, silver: 3, bronze: 2 },
    { id: "t3", name: "PCCOE",       short: "PCC",  color: "#26D9C4", played: 6, won: 3, lost: 3, points: 6,  nrr: 0.41,  attack: 72, defense: 68, passing: 74, gold: 3, silver: 3, bronze: 3 },
    { id: "t4", name: "VIIT PUNE",   short: "VIIT", color: "#FF6E8E", played: 6, won: 3, lost: 3, points: 6,  nrr: -0.22, attack: 68, defense: 65, passing: 70, gold: 2, silver: 2, bronze: 4 },
    { id: "t5", name: "TCET",        short: "TCET", color: "#7BD8FF", played: 6, won: 2, lost: 4, points: 4,  nrr: -0.55, attack: 61, defense: 60, passing: 66, gold: 1, silver: 2, bronze: 2 },
    { id: "t6", name: "MIT WPU",     short: "MIT",  color: "#FF9F5A", played: 6, won: 1, lost: 5, points: 2,  nrr: -1.10, attack: 55, defense: 52, passing: 58, gold: 0, silver: 1, bronze: 2 }
  ],

  matches: [
    { id: "m1", sport: "Cricket", teamA: "t1", teamB: "t2", status: "live",
      scoreA: "142/4 (16.2)", scoreB: "—", venue: "Ground A", time: "In Progress", date: "2027-01-09" },
    { id: "m2", sport: "Basketball", teamA: "t3", teamB: "t4", status: "upcoming",
      scoreA: "-", scoreB: "-", venue: "Court 1", time: "Today, 4:30 PM", date: "2027-01-09" },
    { id: "m3", sport: "Football", teamA: "t5", teamB: "t6", status: "upcoming",
      scoreA: "-", scoreB: "-", venue: "Ground B", time: "Today, 6:00 PM", date: "2027-01-09" },
    { id: "m4", sport: "Cricket", teamA: "t3", teamB: "t1", status: "completed",
      scoreA: "168/7 (20)", scoreB: "171/3 (18.4)", venue: "Ground A", time: "Yesterday", date: "2027-01-08", result: "t1" },
    { id: "m5", sport: "Basketball", teamA: "t2", teamB: "t6", status: "completed",
      scoreA: "58", scoreB: "44", venue: "Court 1", time: "Yesterday", date: "2027-01-08", result: "t2" },
    { id: "m6", sport: "Football", teamA: "t4", teamB: "t1", status: "completed",
      scoreA: "1", scoreB: "3", venue: "Ground B", time: "2 days ago", date: "2027-01-07", result: "t1" },
    { id: "m7", sport: "Cricket", teamA: "t5", teamB: "t2", status: "completed",
      scoreA: "121/9 (20)", scoreB: "118/8 (20)", venue: "Ground A", time: "2 days ago", date: "2027-01-07", result: "t5" },
    { id: "m8", sport: "Basketball", teamA: "t1", teamB: "t3", status: "completed",
      scoreA: "62", scoreB: "70", venue: "Court 1", time: "3 days ago", date: "2027-01-06", result: "t3" },
    { id: "m9", sport: "Football", teamA: "t2", teamB: "t3", status: "completed",
      scoreA: "2", scoreB: "2", venue: "Ground B", time: "3 days ago", date: "2027-01-06", result: "draw" }
  ],

  players: [
    { id: "p1", name: "Aarav Sharma", team: "t1", sport: "Cricket", role: "All-rounder", runs: 214, wickets: 9, matches: 5, badges: ["🏆 Top Scorer", "🔥 Winning Streak"] },
    { id: "p2", name: "Meera Iyer",   team: "t2", sport: "Basketball", role: "Guard", points: 132, assists: 41, matches: 5, badges: ["🏆 Top Scorer", "🎯 Playmaker"] },
    { id: "p3", name: "Kabir Shah",   team: "t3", sport: "Football", role: "Striker", goals: 8, assists: 3, matches: 5, badges: ["⚡ Fastest Goal", "🏆 Top Scorer"] },
    { id: "p4", name: "Diya Patel",   team: "t1", sport: "Cricket", role: "Bowler", runs: 40, wickets: 14, matches: 5, badges: ["🛡 Best Defender"] },
    { id: "p5", name: "Rohan Verma",  team: "t4", sport: "Basketball", role: "Forward", points: 98, assists: 22, matches: 5, badges: ["🎯 Playmaker"] },
    { id: "p6", name: "Sana Khan",    team: "t5", sport: "Football", role: "Midfielder", goals: 4, assists: 9, matches: 5, badges: ["🎯 Playmaker"] },
    { id: "p7", name: "Yusuf Ali",    team: "t2", sport: "Cricket", role: "Batter", runs: 187, wickets: 1, matches: 5, badges: ["🔥 Winning Streak"] },
    { id: "p8", name: "Naina Reddy",  team: "t3", sport: "Basketball", role: "Center", points: 87, assists: 14, matches: 5, badges: ["🛡 Best Defender"] },
    { id: "p9", name: "Vihaan Nair",  team: "t6", sport: "Football", role: "Defender", goals: 1, assists: 2, matches: 5, badges: ["🛡 Best Defender"] }
  ],

  sponsors: [
    { name: "Nimbus Sportswear", tier: "Title" },
    { name: "PulseFit Nutrition", tier: "Co-Sponsor" },
    { name: "Orbit Energy Drinks", tier: "Associate" }
  ],

  gallery: [
    { caption: "Opening ceremony, Ground A", tag: "Day 1" },
    { caption: "Cricket nets, morning warm-up", tag: "Day 2" },
    { caption: "Basketball court, buzzer beater", tag: "Day 3" },
    { caption: "Football semis, Ground B", tag: "Day 4" }
  ],

  about: {
    organiser: "ZEST'27 Sports Committee",
    tournamentName: "COEP ZEST '27",
    dates: "3-Jan-27 to 15-Jan-27",
    locations: "Pune – COEP Technological University",
    ballType: "Leather (Cricket) · FIBA (Basketball) · FIFA (Football)",
    association: "COEP Technological University Sports Board",
    description: "ZEST'27 is the flagship intercollegiate sports fest of COEP Technological University, bringing together 12 teams from across the region for a two-week celebration of cricket, basketball, football and more. This dashboard renders the live schedule, points table and player stats from a single data file, and layers ten small AI agents on top — predictions, form tracking, commentary, a chat assistant and more — to make the experience feel alive without needing a backend."
  },

  contact: [
    { title: "Association", desc: "For partnering with us", email: "partnerships@zest27.coeptech.ac.in", phone: "+91 76543 21001" },
    { title: "Player Support", desc: "For team & player queries", email: "support@zest27.coeptech.ac.in", phone: "+91 81416 65555" },
    { title: "Sponsorship", desc: "For growing with us", email: "sponsors@zest27.coeptech.ac.in", phone: "+91 81416 65533" }
  ],

  /* ---------- Live match detail (Live Match Center) ---------- */
  liveMatchDetail: {
    matchId: "m1",
    quarter: "Innings 2",
    clock: "16.2 / 20 overs",
    timeline: [
      { t: "1.3",  text: "FOUR! Crisp cover drive races to the boundary." },
      { t: "4.6",  text: "SIX! Down the ground, into the stands." },
      { t: "8.2",  text: "WICKET! Cleaned up by a full, straight one." },
      { t: "11.5", text: "50 up for the chasing side — required rate under control." },
      { t: "14.1", text: "FOUR! Steered fine, keeper had no chance." },
      { t: "16.2", text: "Drinks break — 142/4, the game finely poised." }
    ]
  },

  /* ---------- Tournament bracket (single elimination, Basketball) ---------- */
  bracket: {
    sport: "Basketball",
    rounds: [
      {
        name: "Quarter Finals",
        matches: [
          { teamA: "t1", teamB: "t3", winner: "t1" },
          { teamA: "t5", teamB: "t2", winner: "t2" },
          { teamA: "t4", teamB: "t6", winner: "t4" },
          { teamA: "t3", teamB: "t1", winner: "t1" }
        ]
      },
      {
        name: "Semi Finals",
        matches: [
          { teamA: "t1", teamB: "t2", winner: "t1" },
          { teamA: "t4", teamB: "t1", winner: null }
        ]
      },
      {
        name: "Final",
        matches: [
          { teamA: "t1", teamB: null, winner: null }
        ]
      }
    ]
  },

  /* ---------- Stats charts (Statistics tab) ---------- */
  stats: {
    goalsPerDay: [
      { day: "Day 1", goals: 4 }, { day: "Day 2", goals: 7 }, { day: "Day 3", goals: 5 },
      { day: "Day 4", goals: 9 }, { day: "Day 5", goals: 6 }
    ],
    matchesPerSport: [
      { sport: "Cricket", matches: 9 }, { sport: "Basketball", matches: 8 }, { sport: "Football", matches: 7 }
    ],
    audienceTrend: [
      { day: "Day 1", audience: 1200 }, { day: "Day 2", audience: 1850 }, { day: "Day 3", audience: 2100 },
      { day: "Day 4", audience: 2600 }, { day: "Day 5", audience: 3050 }
    ]
  },

  /* ---------- Live notifications feed ---------- */
  notifications: [
    { icon: "⚽", title: "Goal!", body: "COEP TECH scored against MIT WPU.", minsAgo: 2 },
    { icon: "🏀", title: "Match started", body: "PCCOE vs VIIT PUNE tips off at Court 1.", minsAgo: 14 },
    { icon: "🏏", title: "Wicket!", body: "AISSMS COE lose their 4th wicket.", minsAgo: 26 },
    { icon: "🥇", title: "Match result", body: "COEP TECH beat PCCOE by 3 wickets.", minsAgo: 55 }
  ],

  /* ---------- Event day timeline ---------- */
  eventTimeline: [
    { time: "9:00 AM",  title: "Opening Ceremony", venue: "Main Ground" },
    { time: "10:30 AM", title: "Football — Group Stage", venue: "Ground B" },
    { time: "1:00 PM",  title: "Basketball — Group Stage", venue: "Court 1" },
    { time: "3:00 PM",  title: "Cricket — Group Stage", venue: "Ground A" },
    { time: "4:00 PM",  title: "Finals", venue: "Main Ground" },
    { time: "7:00 PM",  title: "Closing & Prize Distribution", venue: "Main Ground" }
  ],

  /* ---------- Countdown target (next marquee event) ---------- */
  countdownTarget: "2027-01-09T16:00:00"
};
