# SalesMind AI — Project Context

> Read this first. It explains what this repo is, the academic assignment behind it, and the
> hard rules to follow. You should not have to ask the user to re-explain any of this.

## What this repo is

A **wireframe-only** prototype for a university course — *User Experience Characterization*
(אפיון חוויית משתמש), TAU, Dr. Aviram Tzur. It is the **final project deliverable B**
(the Wireframes), built as a clickable Vite + React app instead of Figma/PowerPoint.

- **Stack:** Vite + React (plain JS/JSX). Not Next.js — ignore any Next.js skill suggestions
  triggered by the `src/pages/` folder name.
- **Language / direction:** Hebrew, **RTL**.
- **Navigation:** static, via React state (not a router).
- **Pages:** `Dashboard`, `CallReview`, `Progress`, `Achievements` (in `src/pages/`),
  composed in `Shell.jsx`. The Dashboard is the main screen.

### Wireframe constraints (from the assignment)
This is a **wireframe**, so deliberately **no** real graphic design — no photos, illustrations,
shadows, or color decoration like the examples shown in class. Focus instead on:
information shown per screen, proportions, alignments, gestalt, consistency, wording
(titles, buttons), and precision. Aim for a high-fidelity *structural* finish, not visual styling.

## The product being characterized

**SalesMind AI** — an AI platform for **B2B salespeople**. It records and transcribes the
employee's phone calls during the workday, and at end of shift produces a personal **dashboard**
for retrospective learning. It highlights successful moments (positive feedback) and identifies
failures (reframed as constructive *formative feedback*), to drive self-reflection and improvement.

**Assumptions baked in:** deep product knowledge, deal-closing ability from millions of calls,
voice separation (salesperson vs. others), org work-phone usage. **Assume the user is already
registered and fully configured** — there is no onboarding/login/settings flow to design. The
main screen on entry is the dashboard.

## User types (personas)
1. **The ambitious salesperson** — competitive, achievement-driven; digs into raw transcripts,
   analyzes deeply, compares performance over time via graphs, reviews yesterday's takeaways.
2. **The stability-seeker** — aims for minimum targets, wants "good enough" fast answers; if he
   remembers, reads only the AI summary, rarely checks graphs.
3. **The new / inexperienced** — in training, high cognitive load; opens the dashboard out of
   survival need, hoping guidance "saves" tomorrow.
4. **The veteran skeptic** — high performer with self-made methods; downloaded it due to social
   buzz, doubts its value, enters rarely and leaves fast.

## Key usage scenarios
- **S1 – Deep strategic reflection** (ambitious / new): Mon 17:45, still at office, opens dashboard,
  dives into a "needs improvement" call, summarizes takeaways, checks graphs, repeats next day.
- **S2 – Quick debrief** (stability-seeker): Tue 20:30, after dinner, reads only the AI bottom-line,
  glances at graphs, closes.
- **S3 – Socially-triggered use** (veteran): Wed 12:30, colleagues mention it at lunch, opens on
  phone, skepticism returns, abandons immediately.

## UX techniques to express in the design
Positive reinforcement · constructive reframing of failures (formative feedback) · reduced info
load (summaries + optional raw deep-dive) · "most important call" shortcut · data wrapping
(duration, talk/listen %, silence, speech rate) · sense of control (appeal/re-analyze an AI verdict) ·
transparency (AI **Confidence Score**) · gamification (entry streak, ✓ on reviewed calls, points/badges) ·
intra-org social layer (mutual-consent colleague badges) · visual progress (daily/weekly/monthly graphs) ·
context-aware notifications.

## Competitors (for reference)
- **Chorus.AI** — management-facing oversight; full transcripts, dense data-heavy dashboards.
- **Gong.io** — similar operational model, management-focused, complex macro-analytics dashboards.

SalesMind's differentiation: built for the **individual salesperson's** reflection and motivation,
not for managerial oversight.

## Conventions for working in this repo
- **Dashboard time-period titles use one shared format.** Titles are keyed by period in
  `PERIOD_CONFIG` in `src/pages/Dashboard.jsx` (`today` / `week` / `החודש`). Keep the same
  phrasing across periods — only swap the time word. Current titles:
  - `pageTitle`: **איך היו השיחות שלך היום? / השבוע? / החודש?**
  - `aiTitle`: השורה התחתונה היום/השבוע/החודש, `heroTitle`: השיחה החשובה ביותר…, etc.
- Keep Hebrew RTL and wording consistent across screens.

## Assignment deliverables (context only)
- **Deliverable A:** ≤2-page doc — personas, scenarios, contextual cases, anti-friction /
  call-to-action ideas, competitor/inspiration notes. *(written separately, not in this repo)*
- **Deliverable B:** Wireframes — main dashboard + 3 core screens + pop-ups/messages. **This repo.**
- **Due:** 2026-06-08 23:59, submitted via Moodle as PDF/PPT.
