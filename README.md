# procurement-pulse-landing

Static landing site for the **AI Procurement Pulse** — a quarterly research publication that measures vendor AI governance disclosure across the open internet, using the [Kinetic Gain Protocol Suite](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite) as its substrate.

Live at **[pulse.kineticgain.com](https://pulse.kineticgain.com)**.

## What this is

The Pulse is the *Cloudflare Radar of AI procurement*. Every ninety days we crawl ~1,200 vendor domains' `/.well-known/` endpoints, validate any Suite documents we find via [`aeo-validator-service`](https://github.com/mizcausevic-dev/aeo-validator-service), check signatures via [`hash-attestation-rs`](https://github.com/mizcausevic-dev/hash-attestation-rs), and publish a public report on:

- Publication rate by vertical (EdTech, HealthTech, FinTech, Federal, CPG)
- Signed-vs-unsigned ratios
- Drift events per 1k checks
- Decision Card adoption (the buyer side)
- A signature honor roll

**Issue #0 (this site) is the methodology issue.** Issue #1 with real data ships **Q3 2026 (July)**.

## What's here

```
.
├── index.html              # the manifesto + preview charts + signup
├── style.css               # emerald-on-slate publication palette
├── .github/workflows/
│   └── deploy.yml          # FTPS push to /pulse/ on Hostinger on push to main
└── README.md
```

No build step. Hand-written HTML + CSS + ~10 lines of inline JS for the email signup mailto fallback.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deployment

Pushes to `main` trigger a GitHub Actions workflow that FTP-syncs the site root to `/pulse/` on Hostinger.

Required repo secrets: `FTP_HOST`, `FTP_USER`, `FTP_PASS` (same values as every other landing repo in the org).

## Roadmap

- **Issue #0 (this site)**: methodology, projected charts, signup, manifesto.
- **Issue #1, Q3 2026 (July)**: first real-data report. Universe: Fortune 500 + top 100 K-12 EdTech + top 50 HealthTech AI vendors. ~1,200 domains.
- **Issue #2+**: quarterly cadence. Vertical deep-dives rotate (Issue #2 leads with EdTech, Issue #3 with HealthTech, etc.).
- **Premium edition** (Q4 2026): per-vendor named rows + downloadable CSV + drift change-logs. $499 per quarter for procurement teams.

## Related repositories

- **[kinetic-gain-protocol-suite](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite)** — the 11-spec substrate the Pulse measures
- **[aeo-crawler](https://github.com/mizcausevic-dev/aeo-crawler)** — the crawl engine
- **[aeo-validator-service](https://github.com/mizcausevic-dev/aeo-validator-service)** — always-on validator
- **[hash-attestation-rs](https://github.com/mizcausevic-dev/hash-attestation-rs)** — ed25519 signature verification
- **[audit-stream-py](https://github.com/mizcausevic-dev/audit-stream-py)** — the spine that records every crawl + validation event

## License

Apache-2.0 for the site code. The published report editions are © Kinetic Gain LLC, available free under a CC BY 4.0 license for the public edition.
