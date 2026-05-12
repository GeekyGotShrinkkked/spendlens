# User Interviews

Three conversations conducted during the week of
2026-05-06 to 2026-05-12 with potential SpendLens users.

---

## Interview 1

**Name:** Garvit Upadhyay
**Role:** Developer / Researcher have specialization in ML Projects 
**Company stage:** Personal project / freelance
**Date:** 2026-05-11
**Duration:** 10 minutes via WhatsApp

**Notes:**

Currently uses Gemini Pro (free), Tavily API and
Hugging Face servers — all within free tier limits.
Satisfied with current value. Has not compared
alternatives because the workflow works and the
bill hasn't been surprising yet.

Would trigger an audit if token usage suddenly
increased without a workflow change — that's the
pain point: unexpected cost spikes, not current spend.

**Direct quotes:**
- "I am satisfied with the current value of these
  tools in my work."
- "If suddenly the token usage increases without
  any major change in workflow" — that's when they'd
  audit.
- "I won't be able to trust such a tool if it
  suggests that I am overpaying and when I switch
  to some alternative my entire workflow disrupts."

**Most surprising thing they said:**

The trust concern was unexpected — they wouldn't
trust a tool that recommends switching if the
switch breaks their workflow. This is a real insight:
recommendations need to account for workflow
disruption, not just price. A cheaper tool that
breaks your stack is worse than an expensive one
that works.

**What it changed about my design:**

Added "1-sentence reason" to every recommendation
that explains the tradeoff clearly. The audit engine
now explicitly notes when a switch might affect
workflow. The results page shows "recommended action"
with reasoning so users can judge for themselves
rather than blindly following suggestions.

---

## Interview 2

**Name:** Aryan Arora
**Role:** Student
**Company stage:** Personal use/ Video Editing Task 
**Date:** 2026-05-11
**Duration:** 10 minutes via WhatsApp

**Notes:**

Student spending ₹1000-2000/month on AI tools.
Uses ChatGPT GO free version and alternatives as needed.
Feels current tools give good value but finds
most subscription plans too expensive for students.
Weatures
or unused subscriptions.

**Direct quotes:**
- "I am a student and cannot afford to invest
  heavily in subscriptions."
- "Many AI subscription plans feel too expensive
  for students."
- "I would use a free tool that could clearly
  show where I might be overpaying."

**Most surprising thing they said:**

They said they'd audit spending if they noticed
"overlapping features" — not just price. This
means users care aboutould audit if paying for overlapping redundancy, not just cost.
Two tools doing the same thing bothers them more
than one expensive tool doing something unique.

**What it changed about my design:**

This validated the use case detection feature in
the audit engine. When a user selects "mixed" use
case and has both Claude and ChatGPT, the engine
should flag this as potential overlap. Added
mental note to build overlap detection in week 2.
Also confirmed that "free, no signup required"
needs to be prominent in the UI — students won't
engage with anything that asks for payment upfront.

---

## Note on third interview

I reached out to a third potential user but did
not receive a response before the submission
deadline. The two interviews above represent
genuine conversations with real users and contain
specific, actionable insights that influenced
the product design.