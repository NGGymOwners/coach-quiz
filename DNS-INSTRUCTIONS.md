# DNS Setup — quiz.cheerhandbooks.com

## TL;DR for the dev team

Add **one CNAME record** at GoDaddy for the `cheerhandbooks.com` domain. Do not modify any existing records.

| Type | Host / Name | Value (Points to) | TTL |
|---|---|---|---|
| `CNAME` | `quiz` | `cname.vercel-dns.com` | 1 hour (default) |

That's it. After ~5–60 minutes for DNS propagation, https://quiz.cheerhandbooks.com will go live.

---

## Context

- **Apex (root) domain `cheerhandbooks.com`** is currently the WordPress site. **Do not touch it.**
- We're adding a **subdomain** `quiz.cheerhandbooks.com` that points to a separate Vercel-hosted Next.js app (the Coach Development Style quiz / lead magnet).
- The Vercel project is already set up and the domain has been registered with Vercel — it's just waiting on DNS.

---

## Step-by-step at GoDaddy

1. Log in to GoDaddy → **My Products** → find `cheerhandbooks.com` → **DNS**.
2. Click **Add New Record**.
3. Fill in:
   - **Type:** `CNAME`
   - **Name (Host):** `quiz`
   - **Value (Points to):** `cname.vercel-dns.com`
   - **TTL:** leave as default (1 hour) or `600` seconds for faster initial propagation
4. **Save**.
5. **Do not modify** any of the existing `A`, `CNAME`, `MX`, or `TXT` records for the apex domain. Those are for WordPress, email, and other services.

## Verification

Once propagated (5–60 min), this should resolve:

```bash
dig quiz.cheerhandbooks.com CNAME +short
# expected: cname.vercel-dns.com.
```

And the site should load:

```bash
curl -I https://quiz.cheerhandbooks.com
# expected: HTTP/2 200 ... server: Vercel
```

Vercel will automatically issue and renew an SSL certificate via Let's Encrypt — no extra steps.

---

## Alternative: A record (only if CNAME isn't possible)

If your DNS panel won't accept a CNAME at `quiz` for some reason (rare, but it happens), use this instead:

| Type | Host / Name | Value | TTL |
|---|---|---|---|
| `A` | `quiz` | `76.76.21.21` | 1 hour |

CNAME is preferred — it's resilient to Vercel changing their IPs.

---

## What NOT to do

- ❌ Do not change the apex domain's nameservers (currently `ns47/48.domaincontrol.com` — leave them).
- ❌ Do not delete or modify any existing records.
- ❌ Do not add a wildcard CNAME (`*` → vercel) — only the specific `quiz` subdomain.
- ❌ Do not set up redirects from cheerhandbooks.com → quiz.cheerhandbooks.com. They're separate properties.

---

## Who to ping if something looks off

- DNS or domain config: dev team / GoDaddy account holder
- Vercel project / SSL / deployment: Dan Cotton
- Vercel project URL: https://vercel.com/dan-8076s-projects/coach-quiz
