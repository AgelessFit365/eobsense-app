# EOBSense App — MVP Spec
*One-page blueprint for Claude Code*

---

## What This Is

A single-page web app at **app.eobsense.com** that lets a user upload or paste their medical bill or EOB (Explanation of Benefits) and receive a plain-English breakdown powered by the Claude API. No login required for MVP. No database. Just upload → process → output.

---

## Who It's For

Patients, Medicare enrollees, and family caregivers (55+ audience). They are not tech-savvy. The UI must be dead simple — large text, no jargon, clear next steps.

---

## Tech Stack

- **Framework:** Plain HTML/CSS/JS (single file) OR React — Claude Code decides simplest path
- **Hosting:** Netlify (separate project from eobsense.com content site)
- **Subdomain:** app.eobsense.com (pointed in Cloudflare DNS)
- **Backend:** Netlify serverless function (handles Claude API call so key stays server-side)
- **AI:** Claude API (`claude-sonnet-4-6`) via Anthropic `/v1/messages`
- **File handling:** PDF and image (JPG/PNG) upload; also accept pasted text

---

## Brand

- Navy: `#005691` | Teal: `#1CB3C4` | Charcoal: `#333333`
- Font: Georgia, serif
- Tone: Calm, trustworthy, plain English — like a knowledgeable neighbor, not a doctor's office

---

## User Flow (MVP — 5 steps)

```
1. User lands on app.eobsense.com
   → Sees headline: "Upload your bill or EOB — we'll explain it in plain English"
   → Two input options: [Upload PDF or Image] or [Paste text instead]

2. User uploads file or pastes text
   → Simple drag-and-drop zone OR paste textarea
   → "Analyze My Bill" button

3. Netlify function receives input
   → Converts file to base64 if needed
   → Sends to Claude API with system prompt (see below)

4. Claude returns plain-English breakdown
   → Displayed in clean output panel on same page

5. Output includes:
   → What was billed (plain English)
   → What insurance paid
   → What you owe (and why)
   → Red flags / possible errors to follow up on
   → "What to do next" guidance (1-2 sentences)
```

---

## Claude API System Prompt (starter — refine in build)

```
You are a plain-English medical billing assistant for everyday patients, Medicare enrollees, and family caregivers. 

When given a medical bill or EOB (Explanation of Benefits), you will:
1. Summarize what was billed in plain English (no medical jargon)
2. Explain what the insurance paid and why
3. State clearly what the patient owes and why
4. Flag any amounts, codes, or patterns that commonly indicate billing errors
5. Give 1-2 sentences of "what to do next" guidance

Format your response with clear section headers. Use short sentences. Avoid all medical and insurance jargon — if you must use a term, define it immediately. Write as if explaining to a 68-year-old who just got home from the hospital and is confused and stressed.

Do not give legal or medical advice. You are translating documents, not diagnosing or advising on treatment.
```

---

## UI Components (MVP — keep it minimal)

- App header: EOBSense logo/wordmark + tagline
- Upload zone: drag-and-drop box with file type note ("PDF, JPG, PNG or paste text")
- Paste textarea: toggled by "paste text instead" link
- Analyze button (teal, large, full-width on mobile)
- Loading state: spinner + "Reading your bill..." message
- Output panel: sectioned results with clear headers
- Footer: link back to EOBSense.com + disclaimer ("This is not legal or medical advice")

---

## What MVP Does NOT Include

- User accounts / login
- Payment / paywall (validate first, charge later)
- Bill storage / history
- Email capture (handled on main EOBSense.com site)
- Mobile app

---

## Repo & Deployment

- New GitHub repo: `eobsense-app`
- New Netlify site: connect to repo, auto-deploy on push
- Environment variable in Netlify: `ANTHROPIC_API_KEY`
- DNS: Add CNAME record in Cloudflare pointing `app` → Netlify app URL

---

## Success Criteria for MVP

Real people upload real bills and get output that makes sense to them. That's it. Everything else comes after that is proven.
