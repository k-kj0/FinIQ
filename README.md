# Finiq

## What it does

You answer five questions. Plain English, no jargon:
- What's your monthly income?
- How much can you set aside?
- What are you saving for?
- How long can you wait?
- How much risk can you handle?

Finiq takes those answers and gives you three things:

**A Finiq Score** — a number from 0 to 100 that tells you 
where you stand as an investor right now and what's holding you back.

**Tiered recommendations** — not a generic list, but funds and 
asset classes matched to your specific profile, with a plain-language 
explanation of why each one fits you.

**The Time Machine** — shows you what would have happened if you 
had started investing ₹500/month five years ago. Real historical data. 
Real numbers. Not projections.

## Tech Stack

- Next.js 14 + Tailwind CSS
- Framer Motion for animations
- Recharts for the Time Machine chart
- Gemma 4 (local inference via Ollama)
- MFAPI.in for mutual fund NAV data
- Yahoo Finance for index data
- localStorage for on-device profile storage

## Running locally

```bash
git clone https://github.com/k-kj0/FinIQ
cd FinIQ/finiq-nextjs
npm install
npm run dev
```

Open http://localhost:3000

For AI recommendations, install Ollama and run:
```bash
ollama pull gemma3
ollama serve
```

Without Ollama running, the app falls back to 
profile-matched recommendations automatically.

## Live demo

https://fin-5dadaagc9-kavyakjais-6296s-projects.vercel.app

## Disclaimer

Finiq is an informational tool powered by AI. Nothing here 
is licensed financial advice. Markets carry risk. Past returns 
do not guarantee future performance. Always do your own research 
before investing real money.# FinIQ
