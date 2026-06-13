# CLAUDE.md — EOBSense App

This file gives Claude Code persistent context for the EOBSense app project.
Read this at the start of every session before touching any code.

---

## Project Identity

- **App:** EOBSense Bill Analyzer
- **URL:** app.eobsense.com
- **Repo:** eobsense-app (GitHub)
- **Hosting:** Netlify (separate project from content site)
- **Purpose:** Users upload or paste a medical bill or EOB → Claude API returns a plain-English breakdown

---

## Owner Context

- Robert is a non-coder / idea guy. He understands the stack conceptually but does not write code himself.
- He uses Claude Code to build. Give him complete, working files — not fragments or pseudocode.
- He has ADHD. Keep tasks small and sequential. One thing at a time.
- Budget-conscious: use `claude-sonnet-4-6` for all API calls, never Opus.
- He already runs eobsense.com (Astro + Netlify + GitHub). This is a separate Netlify project.

---

## Tech Stack

- Single-page app: plain HTML/CSS/JS or lightweight React — keep it simple
- Netlify serverless function at `netlify/functions/analyze.js` handles the Claude API call
- Claude API: `https://api.anthropic.com/v1/messages`, model `claude-sonnet-4-6`
- API key stored as Netlify environment variable: `ANTHROPIC_API_KEY` (never hardcoded)
- File input: PDF and image (JPG/PNG) accepted; also plain text paste
- No database, no auth, no payment for MVP

---

## Brand

- Navy: `#005691` (primary / headings)
- Teal: `#1CB3C4` (accent / buttons / highlights)
- Charcoal: `#333333` (body text)
- Font: Georgia, serif everywhere
- Tone: Calm, plain English, trustworthy — like a knowledgeable neighbor
- Audience: 55+ patients, Medicare enrollees, family caregivers — not tech-savvy

---

## App Structure

```
eobsense-app/
├── index.html          ← single page UI
├── style.css           ← all styles
├── app.js              ← frontend logic (upload, submit, display output)
├── netlify/
│   └── functions/
│       └── analyze.js  ← serverless function, calls Claude API
├── netlify.toml        ← Netlify config
└── CLAUDE.md           ← this file
```

---

## Claude API System Prompt (in analyze.js)

```
You are a plain-English medical billing assistant for everyday patients, Medicare enrollees, and family caregivers.

When given a medical bill or EOB (Explanation of Benefits):
1. Summarize what was billed in plain English
2. Explain what insurance paid and why
3. State clearly what the patient owes and why
4. Flag amounts, codes, or patterns that commonly indicate billing errors
5. Give 1-2 sentences of "what to do next" guidance

Use clear section headers. Short sentences. No jargon — define any term you must use.
Write as if explaining to a 68-year-old who just got home from the hospital, confused and stressed.
Do not give legal or medical advice. You are translating documents only.
```

---

## Session Task Protocol

Each Claude Code session should have ONE clear task. Examples:
- "Build the HTML/CSS shell with upload zone and output panel"
- "Wire up the Netlify function to call the Claude API"
- "Connect frontend submit button to the serverless function"
- "Test with a sample EOB text paste and verify output format"

Complete one task fully before starting the next. Do not scope-creep mid-session.

---

## What NOT to Build (MVP scope guard)

- No user accounts or login
- No payment / paywall
- No bill storage or history
- No email capture (that's on eobsense.com)
- No mobile app
- No database

---

## Deployment Checklist (reference)

- [ ] Netlify site created, connected to `eobsense-app` GitHub repo
- [ ] `ANTHROPIC_API_KEY` set in Netlify environment variables
- [ ] `netlify.toml` configured for functions directory
- [ ] CNAME record added in Cloudflare: `app` → Netlify app URL
- [ ] Test upload (PDF) end-to-end
- [ ] Test text paste end-to-end
- [ ] Verify API key never appears in frontend code
