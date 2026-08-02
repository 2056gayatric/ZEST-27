# ZEST'27 — Live Fest Dashboard

A single-page, no-build-step dashboard for **ZEST'27**, the intercollegiate
sports fest at COEP Technological University, Pune — schedule, live scores,
points table, player stats, teams, sponsors, gallery, about & contact info —
plus **10 lightweight AI agents** running entirely in the browser.

No API keys, no backend, no bundler. Open `index.html` or serve the folder
and it just works. The only external script tag is **Chart.js** (loaded via
CDN) — everything else is vanilla HTML/CSS/JS.

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
ZEST'2027/
├── index.html          # all markup / nav / tabs / panels / AI assistant widget
├── css/
│   └── style.css       # design tokens + all component styles
├── js/
│   ├── data.js          # mock data store (ZEST_DATA: teams, matches, players,
│   │                     # sponsors, gallery, about, contact, bracket, notifications,
│   │                     # event timeline, countdown target…)
│   ├── aiAgents.js        # the 10 AI agents (pure functions, no network calls)
│   ├── app.js               # renders the core sections & wires up aiAgents.js
│   └── features.js           # Live Match Center, Bracket, Compare, Leaderboard,
│                              # Notifications, Countdown, badges, chat chips
├── assets/              # put logos / real photos here
├── README.md
└── .gitignore
```

## Project functionalities

### Core dashboard
| Feature | Where | Notes |
|---|---|---|
| 📅 Match schedule | `panel-schedule` tab | Upcoming and past fixtures, default landing tab |
| 📊 Points table | `panel-points` tab | Ranked by points, then NRR |
| 🏃 Player stats | `panel-players` tab | Per-player numbers + AI-flagged top performer + badges |
| 🏢 Teams, sponsors, gallery, about & contact | respective tabs | Static content driven by `ZEST_DATA` |

### Added features (on top of the core dashboard)
| Feature | Where | Notes |
|---|---|---|
| 🔴 Live Match Center | `panel-live` tab | Live scoreboard, AI win probability, match timeline, AI MVP prediction |
| 🏆 Tournament Bracket | `panel-bracket` tab | Visual single-elimination tree, edit `ZEST_DATA.bracket` |
| ⚖️ Team Comparison | `panel-compare` tab | Pick any two teams, compares attack/defense/passing/win-rate |
| 📊 Leaderboards | `panel-leaderboard` tab | Top performers per sport |
| 🤖 AI Insights | `panel-ai` tab | Card grid — run any of the 10 agents on demand |
| 🔔 Live Notifications | bell icon, top-right of nav | Static feed + simulated toast pushed periodically |
| ⏱ Countdown | under the hero stats | Counts down to `ZEST_DATA.countdownTarget` |
| 🏅 Badges | on Player Stats cards | Reads each player's `badges` array in `data.js` |
| 💬 AI Assistant (floating widget) | `🤖` FAB button, bottom-right | Chat panel with quick-tap question chips |

All of the above are driven entirely by `ZEST_DATA` in `js/data.js` — update
the arrays there (bracket rounds, medal counts, notifications, countdown
target, player badges) and every view re-renders from it.

> **Note:** `index.html` also loads Chart.js via CDN for a future Statistics
> tab, but no chart is wired up yet — it's a hook left in for whoever wants
> to add data-viz next.

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
open index.html      # macOS
xdg-open index.html  # Linux
start index.html     # Windows
```

**Option 2 — serve it locally (recommended)**
Some browsers restrict `fetch`/module loading on `file://`, so serving the
folder is safer:
```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000`.

If you have Node instead:
```bash
npx serve .
```

That's it — no dependencies to install beyond an internet connection for the
Chart.js CDN script tag in `index.html`.

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
