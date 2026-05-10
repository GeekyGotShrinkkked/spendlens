# Metrics

## North Star Metric

**Audits completed per week**

Why: SpendLens is a lead generation tool for Credex.
An audit completed means a user got value AND Credex
got signal about their AI spend. Everything else
follows from this — emails captured, consultations
booked, credits sold. If audits per week grows,
everything else grows with it.

Not "DAU" because users audit once per quarter when
their stack changes, not daily. Not "emails captured"
because that's a downstream metric — you can't capture
emails without completing audits first.

## 3 Input Metrics

### 1. Form completion rate
Percentage of users who land on the page and complete
the audit form.
- Target: above 60 percent
- Why it matters: if users drop off on the form,
  the tool is too confusing or asks for too much.
  This is the first lever to pull.

### 2. Share rate
Percentage of audits that get shared via the
unique public URL.
- Target: above 15 percent
- Why it matters: sharing is the viral loop.
  Every shared audit is a free acquisition channel.
  If this is low, the results page needs more
  wow factor or the savings numbers are too small
  to brag about.

### 3. Email capture rate
Percentage of completed audits where user enters email.
- Target: above 40 percent
- Why it matters: email is how Credex follows up
  for high savings cases. No email means no lead.
  If this is low, we're showing value but not
  capturing it.

## What I would instrument first

1. **Page load → form start** — are users even trying?
2. **Form start → form submit** — where do they drop off?
3. **Results page → email entered** — are they convinced?
4. **Email entered → consultation booked** — conversion
5. **Audit ID in URL params** — track shared audit views

Tools: Posthog for product analytics, Supabase for
lead data, Resend for email open rates.

## Pivot trigger

If after 500 audits completed the email capture rate
is below 20 percent, that means users are getting
value but not trusting us enough to give their email.

That triggers a redesign of the value proposition —
either show more savings, add social proof, or
remove the email gate entirely and find another
monetization path.

If after 1000 audits the consultation booking rate
is below 2 percent, the tool is attracting the wrong
users — people curious about AI spend but not actually
paying enough to care. That triggers a pivot to
targeting higher spend users specifically.