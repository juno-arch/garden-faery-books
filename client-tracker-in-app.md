# Feature Request: Client Tracker Tab in Business App

**Requested by:** Operations Manager agent
**Date:** March 23, 2026
**Priority:** High — we're getting leads now and need to track them
**Location of this file:** `garden-faery-ops/feature-requests/client-tracker-in-app.md`

> **App Dev — start here.** Taya wants a Clients tab added to either the main business app or the bookkeeping UI. The full spec is below. There's also a working spreadsheet at `garden-faery-ops/client-tracker.xlsx` with 8 real clients/leads already entered — use that as your reference data and field guide. This is high priority because leads are coming in fast from Nextdoor, Facebook, Craigslist, and the landing page contact form.

## What I Need
A "Clients" tab in either the main business app or the bookkeeping UI that tracks all clients and leads in one place. Right now I'm using a spreadsheet (`garden-faery-ops/client-tracker.xlsx`) but it should live in the app so it's always accessible and stays in sync with everything else.

## Fields Needed
- **Name**
- **Email**
- **Phone**
- **Location/Address**
- **Source** — how they found us (Craigslist, Nextdoor, Facebook, landing page, referral, word of mouth)
- **Service** — what they're interested in or what we've done for them
- **Status** — pipeline stages: Lead → Replied → Quoted → Booked → Done → Repeat
- **Rate** — what we're charging them
- **Notes** — freeform, for context

## Nice to Haves
- Highlight or tag repeat clients (Dena and Elizabeth are our first two)
- Filter by status so I can see all open leads vs. booked jobs vs. repeat clients
- Link to the quote/estimator if they're a raised bed lead
- Referral tracking (who referred them) — we're building a referral program
- Date fields (first contact, last contact, next follow-up)

## Current Data
There are 8 contacts already in the spreadsheet at `garden-faery-ops/client-tracker.xlsx` — that's the starting data to import or use as a reference.

## Why This Matters
We went from 2 clients to 8 leads in one weekend after posting on Nextdoor and Facebook. This is going to grow fast and a spreadsheet won't cut it for long. Having it in the app means Taya can check her pipeline from her phone anytime.
