## Day 1 — 2026-05-06

**Hours worked:** 1

**What I did:** Read and analyzed the full assignment brief 
carefully. Set up GitHub repo with required file structure. 
Created Next.js + TypeScript project with Tailwind. Signed 
up for Anthropic API and Supabase. Decided on product name: 
SpendLens.

**What I learned:** The audit engine needs to be financially 
defensible with real numbers. Entrepreneurial files carry 
25/100 points. Git history is checked programmatically so 
commits must span 5+ days — starting early matters.

**Blockers / what I'm stuck on:** Limited time today. Need 
to conduct 3 user interviews — planning to talk to friends 
who use AI tools and reach out on Reddit.

**Plan for tomorrow:** Build the spend input form with all 
required tools and localStorage persistence. Start 
PRICING_DATA.md with verified pricing URLs.

## Day 2 — 2026-05-07

**Hours worked:** 0

**What I did:** Could not work today due to exam 
preparation.

**What I learned:** —

**Blockers / what I'm stuck on:** Exams this week 
taking priority.

**Plan for tomorrow:** Get back to building — 
add pricing data and audit engine.


## Day 3 — 2026-05-08

**Hours worked:** 2

**What I did:** Built the spend input form with all 
required tools and plans. Added localStorage persistence 
so form data survives page reloads. Fixed a JSX closing 
tag bug in the select element.

**What I learned:** In JSX, self closing tags like 
`/>` break everything if used on elements that have 
children. Small syntax mistakes cause big errors.

**Blockers / what I'm stuck on:** Had exam today 
so limited time. Fixed build errors before stopping.

**Plan for tomorrow:** Build the API route and 
results page.

## Day 4 — 2026-05-09

**Hours worked:** 4

**What I did:** Built the results page with per-tool 
breakdown, AI summary, and email capture. Built the 
leads API route with Supabase storage and Resend email. 
Fixed TypeScript build errors. Successfully deployed 
to Vercel at https://spendlens-3h7a.vercel.app

**What I learned:** Vercel builds are stricter than 
local dev — TypeScript errors that don't show locally 
will fail the build. Always run npm run build before 
pushing.

**Blockers / what I'm stuck on:** Need to set up 
tests and CI. Need to write all documentation files.

**Plan for tomorrow:** Set up tests, write all 
required documentation files, UI glow up.

## Day 5 — 2026-05-10

**Hours worked:** 6

**What I did:** Major UI redesign with glassmorphism 
and gradient effects on both home and results page. 
Set up Jest testing with ts-jest — took multiple 
attempts to get TypeScript working with Jest but 
got all 6 tests passing. Wrote TESTS.md, PROMPTS.md, 
PRICING_DATA.md, ARCHITECTURE.md, LANDING_COPY.md, 
METRICS.md, GTM.md, ECONOMICS.md, REFLECTION.md.

**What I learned:** Jest + TypeScript setup is 
tricky — ts-jest needs specific config to handle 
ES modules. Babel approach also works as fallback. 
Vercel auto-redeploys on every git push which is 
very convenient.

**Blockers / what I'm stuck on:** Need to do 3 
real user interviews tomorrow morning before I 
can write USER_INTERVIEWS.md. Also need to write 
README.md tomorrow.

**Plan for tomorrow:** User interviews first thing 
in the morning. Then README.md and USER_INTERVIEWS.md. 
Final polish and submission.