# Tests

All tests cover the audit engine — the core logic of SpendLens.

## How to run

```bash
npm test
```

## Test file: `src/lib/auditEngine.test.ts`

### Test 1 — Cursor Business downgrade
**What it covers:** Cursor Business plan with 3 seats should 
recommend downgrading to Pro and save $60/month.
**Why:** Business adds SSO/admin features useless under 5 seats.

### Test 2 — Cursor Pro optimal
**What it covers:** Cursor Pro with coding use case should 
show zero savings — it's already the right plan.
**Why:** Ensures we don't manufacture fake savings.

### Test 3 — Claude Team minimum seats
**What it covers:** Claude Team with 2 seats should recommend 
switching to individual Pro plans.
**Why:** Claude Team has a 5-seat minimum — under that, 
individual Pro is cheaper.

### Test 4 — Annual savings calculation
**What it covers:** Annual savings always equals monthly 
savings multiplied by 12.
**Why:** Core math must be correct — this number is shown 
prominently to users.

### Test 5 — Multiple tools total
**What it covers:** When multiple tools are audited, total 
savings correctly adds up all individual savings.
**Why:** Ensures the aggregation logic works correctly.

### Test 6 — GitHub Copilot Individual multi-seat
**What it covers:** GitHub Copilot Individual with 3 seats 
should recommend switching to Business plan.
**Why:** Individual plan is for solo use only — multi-seat 
use needs Business plan.

## Results
All 6 tests pass. Run `npm test` to verify.