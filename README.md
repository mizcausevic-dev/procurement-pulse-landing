# procurement-pulse-landing

Static publication site for the **AI Procurement Pulse**, which reports dated observations of public AI governance disclosures. Its method refers to applicable documents from the [Kinetic Gain Protocol Suite](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite), currently twelve open specifications.

Live at **[pulse.kineticgain.com](https://pulse.kineticgain.com)**.

## What this is

The landing page links to Issues #1–#4 and a May 2026 methodology baseline. Each issue is a dated measurement with its own universe, limitations, and data links. The landing page is not a live crawl, and Issue #5 is not published here. The May baseline's reported signature verification does not establish current signature or schema validity.

The page includes projected chart formats, explicitly labeled illustrative. The email control opens a mail draft; sending that draft is required to request updates. There is no subscription backend.

## Published sections

- [Standing methodology](https://pulse.kineticgain.com/)
- [Issue #1](https://pulse.kineticgain.com/issue-1/) · [Issue #2](https://pulse.kineticgain.com/issue-2/) · [Issue #3](https://pulse.kineticgain.com/issue-3/) · [Issue #4](https://pulse.kineticgain.com/issue-4/)
- [Historical baseline](https://pulse.kineticgain.com/baseline/)

## Local preview

```powershell
cd C:\Users\chaus\Documents\Codex\repos\procurement-pulse-landing
python -m http.server 8080
# Open http://localhost:8080
```

## Deployment

The [deploy workflow](.github/workflows/deploy.yml) runs only when manually dispatched. A push to `main` does not publish this page. The workflow SFTP-extracts the site into the Hostinger `/pulse/` directory and checks the home page returns HTTP 200. It requires `FTP_HOST`, `FTP_USER`, and `SSH_PRIVATE_KEY` repository secrets. The HTTP 200 check does not prove that exact new bytes reached the host; verify the changed content and restore path after a release.

## Related repositories

- **[kinetic-gain-protocol-suite](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite)** — twelve open specifications
- **[procurement-pulse-engine](https://github.com/mizcausevic-dev/procurement-pulse-engine)** — dated measurement implementation and data artifacts
- **[aeo-crawler](https://github.com/mizcausevic-dev/aeo-crawler)** — the crawl engine
- **[aeo-validator-service](https://github.com/mizcausevic-dev/aeo-validator-service)** — validation service
- **[hash-attestation-rs](https://github.com/mizcausevic-dev/hash-attestation-rs)** — signature verification tooling
- **[mcp-kinetic-gain](https://github.com/mizcausevic-dev/mcp-kinetic-gain)** — published v0.10.0 MCP server with 75 Suite tools; separate from the static Pulse page

## License

Apache-2.0 for the site code. The published report editions are © Kinetic Gain LLC, available free under a CC BY 4.0 license for the public edition.
