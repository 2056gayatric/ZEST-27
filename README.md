# ZEST'27 — Live Fest Dashboard

A single-page, no-build-step dashboard for an intercollegiate sports fest —
schedule, live scores, points table, player stats, teams, sponsors, gallery,
about & contact info — plus **10 lightweight AI agents** running entirely in
the browser.

No API keys, no backend, no bundler. Open `index.html` or serve the folder
and it just works. The only external dependency is **Chart.js**, loaded via
CDN for the Statistics tab — everything else is vanilla HTML/CSS/JS.

## Induction task

> Hi everyone!
> As part of the inductions each one of you has to build a feature that can
> be useful for our sports fest and help increase engagement.
> Some example ideas are live scoreboard, points table, match schedule,
> player stats, etc. You are also free to come up with your own unique idea.

This project is my submission for that task: a full live-fest dashboard for
**ZEST'27**, covering the suggested ideas (scoreboard, points table,
schedule, player stats) plus several original features layered on top,
including 10 small AI agents that run entirely client-side.

## Folder structure

```
zest27/
├── index.html            # all markup / sections / tabs
├── css/
│   └── style.css         # design tokens + all component styles (incl. new features)
├── js/
│   ├── data.js            # mock data store (teams, matches, players, sponsors, bracket, stats…)
│   ├── aiAgents.js         # the 10 AI agents + MVP predictor (pure functions, no network calls)
│   ├── app.js               # renders the original DOM sections, wires up aiAgents.js
│   └── features.js           # Live Match Center, Bracket, Compare, Leaderboard, Medals,
│                              # Stats charts, Notifications, Countdown, badges, chat chips
├── assets/                 # put logos / real photos here
├── README.md
└── .gitignore
```

## Project functionalities

### Core dashboard
| Feature | Where | Notes |
|---|---|---|
| 🏠 Live scoreboard | `panel-live` tab | Scores update from `ZEST_DATA.matches` |
| 📅 Match schedule | `panel-schedule` / hero tabs | Upcoming and past fixtures |
| 📊 Points table | points table section | Auto-ranks teams by points/NRR |
| 🏃 Player stats | `panel-stats` tab | Per-player numbers, feeds badges & leaderboards |
| 🏢 Teams, sponsors, gallery, about & contact | respective tabs | Static content driven by `ZEST_DATA` |

### Added features (on top of the core dashboard)
| Feature | Where | Notes |
|---|---|---|
| 🔴 Live Match Center | `panel-live` tab | Scoreboard, AI win probability, match timeline, AI MVP prediction |
| 🏆 Tournament Bracket | `panel-bracket` tab | Visual single-elimination tree, edit `ZEST_DATA.bracket` |
| ⚖️ Team Comparison | `panel-compare` tab | Pick any two teams, compares attack/defense/passing/win-rate |
| 📊 Leaderboards | `panel-leaderboard` tab | Top 5 per sport by primary stat |
| 🥇 Medal Table | `panel-medals` tab | Gold/silver/bronze counts per team |
| 📈 Statistics | `panel-stats` tab | 4 Chart.js charts + the event-day timeline |
| 🔔 Live Notifications | bell icon, top-right of nav | Static feed + simulated toast every ~25s |
| ⏱ Countdown | under the hero stats | Counts down to `ZEST_DATA.countdownTarget` |
| 🏅 Badges | on Player Stats cards | Reads each player's `badges` array in `data.js` |
| 💬 Chat quick-chips | inside the AI Assistant panel | One-tap common questions |

All of the above are driven entirely by `ZEST_DATA` in `js/data.js` — update
the arrays there (bracket rounds, medal counts, chart series, notifications,
countdown target, player badges) and every view re-renders from it.

### The 10 AI agents (`js/aiAgents.js`)
| # | Agent | What it does |
|---|-------|---------------|
| 1 | Match Predictor | Win-probability for the next match from win-rate, NRR/form & standings |
| 2 | Form & MVP Tracker | Standout performer per sport by weighted impact score |
| 3 | Auto-Commentary | Turns a raw score line into a short highlight blurb |
| 4 | Dream Team Selector | Builds an AI "team of the tournament" per sport |
| 5 | Upset Detector | Flags results where a lower-ranked team beat a higher one |
| 6 | Fatigue Advisor | Flags teams with a heavy match load who may need rotation |
| 7 | Momentum Tracker | Reads a team's last 3 results to call their current trend |
| 8 | Sponsor Visibility | Estimates each sponsor's remaining on-dashboard exposure |
| 9 | Fun Fact Generator | Surfaces a fresh, data-grounded fun fact |
| 10 | Fest Assistant (chat) | Intent-matching chatbot for schedule / score / stat questions |

Every agent is a small, explainable, pure function — no hidden state, no
external calls. That makes them trivial to unit test and easy to swap for a
real LLM later.

## How to run it

No build tools, no npm install, no API keys — it's a static site.

**Option 1 — just open it**
```bash
open final/index.html      # macOS
xdg-open final/index.html  # Linux
start final/index.html     # Windows
```

**Option 2 — serve it locally (recommended)**
Some browsers restrict `fetch`/module loading on `file://`, so serving the
folder is safer:
```bash
cd final
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

If you have Node instead:
```bash
cd final
npx serve .
```

That's it — no dependencies to install beyond an internet connection for the
Chart.js CDN script used on the Statistics tab.

## Upgrading an agent to a real LLM

Each method in `AIAgents` returns plain data or a string. To swap one for a
real model call:

```js
async chatReply(userText) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userText, context: ZEST_DATA })
  });
  const { reply } = await res.json();
  return reply;
}
```

Because `app.js` only calls `AIAgents.xxx(...)`, no other file needs to
change — just make the call `async` and `await` it at the call site.

## Customizing

- **Real data**: edit `js/data.js` — everything else re-renders from it.
- **Colours / type**: edit the `:root` tokens at the top of `css/style.css`.
- **Tabs**: add a `<button class="tab-btn" data-target="panel-x">` in the
  `.tabs` bar and a matching `<section id="panel-x" class="panel">` — tabs
  are equally spaced automatically (`flex: 1 1 0` on `.tab-btn`).

Built for the induction task · no external API keys required.