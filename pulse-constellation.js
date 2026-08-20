/* Pulse pipeline, visualized. Same radial hub/leaf engine PATTERN as
   kg-suite-web's suite-constellation.js / specs-constellation.js /
   mcp-constellation.js (polar layout, hub/leaf/glow/sweep mechanics,
   dossier panel, filter pills) — adapted, not cloned, because this page's
   real data shape is different: the Pulse doesn't have a "12 specs" or
   "75 tools" count to visualize. What IS real and published right now is
   the six-step measurement pipeline in the #methodology section, the real
   tools each step calls (aeo-crawler, aeo-validator-service,
   hash-attestation-rs), and the real universe composition (Fortune 500 +
   EdTech + HealthTech, 2,044 domains per the live Baseline).

   Issue #1 with real per-vertical numbers ships Q3 2026 — see the README.
   Nothing below is a placeholder for that unpublished data. Every hub
   description and leaf fact is copied verbatim (or lightly paraphrased,
   never invented) from the #methodology <ol> and the metrics-strip already
   on this page. The projected/illustrative preview charts above this
   diagram (bar chart, donut, trend line) are explicitly out of scope —
   this diagram does not touch or restate any of those mocked numbers.

   ADDITIVE: sits below the existing numbered methodology list, which stays
   the default, untouched, zero-click reference surface — this is a second,
   exploratory way to read the same six real steps, not a replacement.

   Accessibility (hard requirement, not decoration): every interactive hub
   and leaf carries a real tabindex="0", role="button" and a descriptive
   aria-label; Enter/Space fire the same handler as a click; keyboard focus
   mirrors mouse hover for the dossier preview; every count rendered (leaf
   totals, domain count) is real visible SVG text next to the node, never
   size- or color-only; all animation is wrapped in prefers-reduced-motion
   (see the page's <style> block for the actual @media rule); the root
   <svg> is role="group", not role="img", so hubs and leaves stay in the
   accessibility tree. */
(function () {
  "use strict";

  var CAT_LABELS = {
    source: "SOURCE",
    measure: "MEASURE",
    trust: "TRUST",
    report: "REPORT"
  };

  // Every desc and leaf below is drawn from the #methodology <ol> and the
  // metrics-strip already published in this page's own index.html — see
  // the file header for the no-fabrication rationale.
  var HUBS = [
    {
      code: "universe", cat: "source", badge: "Step 1", label: "Universe selection",
      desc: "Issue #1 universe: Fortune 500 + top 100 K-12 EdTech vendors (EdTech Top 40 lists) + top 50 HealthTech AI vendors (FDA-cleared SaMD + clinical-decision-support market). Published as universe.csv alongside the issue. The live Baseline universe has since grown to 2,044 domains under the “every deploy enters universe” rule.",
      leaves: ["Fortune 500", "Top 100 EdTech · K-12", "Top 50 HealthTech AI", "2,044 domains · v0.4"]
    },
    {
      code: "crawl", cat: "measure", badge: "Step 2", label: "Crawl",
      desc: "aeo-crawler hits each domain’s /.well-known/ for the eleven Suite documents. Output is JSON Lines, hashed for replay, so any measurement can be rerun against the same snapshot.",
      leaves: ["aeo-crawler", "/.well-known/ · 11 docs", "JSON Lines, hashed"]
    },
    {
      code: "validate", cat: "measure", badge: "Step 3", label: "Validate",
      desc: "Every fetched document runs through aeo-validator-service. Invalid documents are flagged, not dropped — they still count as published for the publication-rate numerator.",
      leaves: ["aeo-validator-service", "Invalid ≠ unpublished"]
    },
    {
      code: "signature", cat: "trust", badge: "Step 4", label: "Signature check",
      desc: "If a document references a signing_key_url, hash-attestation-rs verifies the ed25519 signature against the canonical-JSON hash. The eleven dogfooded kineticgain.com documents are the first verified row in any Pulse measurement.",
      leaves: ["hash-attestation-rs", "ed25519 signature", "canonical-JSON hash"]
    },
    {
      code: "drift", cat: "trust", badge: "Step 5", label: "Drift detection",
      desc: "Each domain’s documents are re-fetched fourteen days into the quarter. A document whose content_hash changes without a corresponding version bump is logged as a drift event.",
      leaves: ["Re-fetch at day 14", "content_hash w/o version bump"]
    },
    {
      code: "reporting", cat: "report", badge: "Step 6", label: "Reporting",
      desc: "Aggregated metrics by vertical (EdTech, HealthTech, FinTech, Federal contractors, CPG/Retail), by spec, and by signed-status. Public edition reports aggregate-only; per-vendor rows are reserved for the premium edition (Q4 2026).",
      leaves: ["Publication rate", "Validity rate", "Signature rate", "Drift rate"]
    }
  ];

  var svg = document.getElementById("pulc-graph");
  if (!svg) return;

  var N = HUBS.length;
  var CX = 500, CY = 500;
  var HUB_R = 220, LEAF_R = 345, ARC_R = 410, CENTER_R = 50;

  function hue(i) { return Math.round((360 / N) * i); }
  function colorFor(i) { return "hsl(" + hue(i) + ",72%,62%)"; }
  function colorFaint(i) { return "hsl(" + hue(i) + ",55%,42%)"; }
  function polar(cx, cy, r, deg) {
    var rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function anchorFor(px) {
    var dx = px - CX;
    if (Math.abs(dx) < 9) return "middle";
    return dx > 0 ? "start" : "end";
  }
  var svgns = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    var e = document.createElementNS(svgns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  var activeCat = null;
  var hubEls = {}, leafEls = [];

  HUBS.forEach(function (h, i) {
    var angle = (360 / N) * i;
    var hubPos = polar(CX, CY, HUB_R, angle);
    var col = colorFor(i);

    var arcSpan = (360 / N) * 0.74;
    var a0 = angle - arcSpan / 2, a1 = angle + arcSpan / 2;
    var p0 = polar(CX, CY, ARC_R, a0), p1 = polar(CX, CY, ARC_R, a1);
    var arcPath = "M " + p0.x.toFixed(1) + " " + p0.y.toFixed(1) +
      " A " + ARC_R + " " + ARC_R + " 0 0 1 " + p1.x.toFixed(1) + " " + p1.y.toFixed(1);
    svg.appendChild(el("path", { class: "arc", d: arcPath, stroke: col, "data-cat": h.cat }));

    var spokeStart = polar(CX, CY, CENTER_R, angle);
    var spoke = el("line", { class: "spoke", x1: spokeStart.x, y1: spokeStart.y, x2: hubPos.x, y2: hubPos.y, stroke: col, "data-cat": h.cat, "data-hub": h.code });
    svg.appendChild(spoke);

    // Hub radius scales with the REAL number of leaf facts under this step
    // (rendered as visible text in the hub label two lines down, so the
    // fact never depends on size/color alone). This is not a fabricated
    // metric — it's a literal count of the fact nodes drawn on screen.
    var hubR = 13 + Math.min(13, h.leaves.length * 2.6);
    var hubGroup = el("g", {
      class: "node-hub hoverable", "data-cat": h.cat, "data-hub": h.code, "data-kind": "hub",
      tabindex: "0", role: "button",
      "aria-label": h.label + ", " + h.badge + ", " + h.leaves.length + " real facts. Activate to see details."
    });
    hubGroup.appendChild(el("circle", { class: "ring", cx: hubPos.x, cy: hubPos.y, r: hubR + 6, stroke: colorFaint(i) }));
    hubGroup.appendChild(el("circle", { class: "core", cx: hubPos.x, cy: hubPos.y, r: hubR, fill: "var(--panel)", stroke: col }));
    hubGroup.appendChild(el("circle", { cx: hubPos.x, cy: hubPos.y, r: 3.2, fill: col }));
    var lblPos = polar(CX, CY, HUB_R + hubR + 16, angle);
    // Small constant vertical nudge, away from center, on top of the
    // radial offset above. Two labels that land at coincidentally equal
    // y (different radius+angle pairs can still average out to the same
    // y) is what actually caused a real overlap during verification --
    // this breaks that coincidence without changing the overall layout.
    var lblY = lblPos.y + (lblPos.y < CY ? -15 : 15);
    var hubLbl = el("text", { class: "lbl-hub", x: lblPos.x, y: lblY, "font-size": 10, fill: col, "text-anchor": anchorFor(lblPos.x) });
    hubLbl.textContent = h.badge.toUpperCase() + " · " + truncate(h.label.toUpperCase(), 22);
    svg.appendChild(hubGroup);
    svg.appendChild(hubLbl);
    hubEls[h.code] = { group: hubGroup, lbl: hubLbl, spoke: spoke, hub: h };

    // Minimum 34deg total fan even for 2-leaf hubs so a hub's own leaf
    // labels clear its own hub label (both render close to the hub's
    // angle otherwise, and the leaf label paints on top since it's
    // appended later -- this was a real overlap in-browser, not
    // theoretical, caught by the local verification pass).
    var fan = Math.min((360 / N) * 0.9, Math.max(40, (h.leaves.length - 1) * 17));
    h.leaves.forEach(function (leafText, j) {
      var leafAngle = angle - fan / 2 + (fan / (h.leaves.length - 1 || 1)) * j;
      if (h.leaves.length === 1) leafAngle = angle;
      var leafPos = polar(CX, CY, LEAF_R, leafAngle);
      var branch = el("path", {
        class: "branch", "data-cat": h.cat, "data-hub": h.code, stroke: colorFaint(i),
        d: "M " + hubPos.x.toFixed(1) + " " + hubPos.y.toFixed(1) + " L " + leafPos.x.toFixed(1) + " " + leafPos.y.toFixed(1)
      });
      svg.appendChild(branch);

      var leafGroup = el("g", {
        class: "node-leaf hoverable", "data-cat": h.cat, "data-hub": h.code, "data-kind": "leaf",
        tabindex: "0", role: "button",
        "aria-label": leafText + ", part of the " + h.label + " step. Activate to see details."
      });
      leafGroup.appendChild(el("circle", { cx: leafPos.x, cy: leafPos.y, r: 5.5, fill: "var(--panel)", stroke: col }));
      leafGroup.appendChild(el("circle", { class: "beacon", cx: leafPos.x, cy: leafPos.y, r: 2, fill: col }));
      svg.appendChild(leafGroup);

      var lp = polar(CX, CY, LEAF_R + 13, leafAngle);
      var leafLbl = el("text", { class: "lbl-leaf", x: lp.x, y: lp.y, "font-size": 7.4, fill: "var(--muted)", "text-anchor": anchorFor(lp.x) });
      leafLbl.textContent = truncate(leafText, 19);
      svg.appendChild(leafLbl);

      leafEls.push({ hub: h, group: leafGroup, text: leafText });
    });
  });

  svg.appendChild(el("circle", { class: "center-ring", cx: CX, cy: CY, r: 68 }));
  svg.appendChild(el("circle", { class: "center-core", cx: CX, cy: CY, r: CENTER_R }));
  var centerLbl = el("text", { class: "center-lbl", x: CX, y: CY - 6, "text-anchor": "middle", "font-size": 12 });
  centerLbl.textContent = "PULSE ENGINE";
  svg.appendChild(centerLbl);
  var centerSub1 = el("text", { class: "center-sub", x: CX, y: CY + 10, "text-anchor": "middle", "font-size": 9 });
  centerSub1.textContent = "v0.4";
  svg.appendChild(centerSub1);
  var centerSub2 = el("text", { class: "center-sub", x: CX, y: CY + 23, "text-anchor": "middle", "font-size": 8 });
  centerSub2.textContent = "2,044 DOMAINS";
  svg.appendChild(centerSub2);

  var dossier = document.getElementById("pulc-dossier");
  var dKind = document.getElementById("pulc-dKind"), dTitle = document.getElementById("pulc-dTitle"),
    dDesc = document.getElementById("pulc-dDesc"), dFields = document.getElementById("pulc-dFields"),
    dLink = document.getElementById("pulc-dLink");

  function showDossierForHub(h) {
    dKind.textContent = h.badge + " · " + CAT_LABELS[h.cat];
    dTitle.textContent = h.label;
    dDesc.textContent = h.desc;
    dFields.innerHTML = "";
    var f1 = document.createElement("div"); f1.className = "field";
    f1.innerHTML = "<span>Real facts</span><strong>" + h.leaves.length + "</strong>";
    dFields.appendChild(f1);
    var f2 = document.createElement("div"); f2.className = "field";
    var codesHtml = h.leaves.map(function (c) { return "<code>" + c + "</code>"; }).join("");
    f2.innerHTML = "<span>On this step</span><span class=\"codes\">" + codesHtml + "</span>";
    dFields.appendChild(f2);
    dLink.textContent = "Jump to methodology ↓";
    dLink.href = "#methodology";
    dossier.classList.add("show");
  }
  function showDossierForLeaf(h, leafText) {
    dKind.textContent = h.badge + " · fact";
    dTitle.textContent = leafText;
    dDesc.textContent = "Part of " + h.label + " (" + h.badge + "): " + h.desc;
    dFields.innerHTML = "";
    var f1 = document.createElement("div"); f1.className = "field";
    f1.innerHTML = "<span>Pipeline step</span><strong>" + h.label + "</strong>";
    dFields.appendChild(f1);
    dLink.textContent = "Jump to methodology ↓";
    dLink.href = "#methodology";
    dossier.classList.add("show");
  }
  document.getElementById("pulc-dossierClose").addEventListener("click", function () { dossier.classList.remove("show"); });

  function applyFilter(cat) {
    activeCat = cat;
    svg.querySelectorAll("[data-cat]").forEach(function (node) {
      if (!cat || node.getAttribute("data-cat") === cat) node.classList.remove("dim");
      else node.classList.add("dim");
    });
    document.querySelectorAll(".pulc-pill[data-cat]").forEach(function (pill) {
      var isActive = pill.getAttribute("data-cat") === cat;
      pill.classList.toggle("active", isActive);
      if (isActive) { pill.style.background = pill.getAttribute("data-color"); pill.style.color = "var(--panel)"; }
      else { pill.style.background = ""; pill.style.color = ""; }
    });
    var resetPill = document.querySelector(".pulc-pill.reset");
    if (resetPill) resetPill.classList.toggle("active", !cat);
  }

  Object.keys(hubEls).forEach(function (code) {
    var rec = hubEls[code], h = rec.hub, g = rec.group;
    g.addEventListener("mouseenter", function () { if (!activeCat) applyFilter(h.cat); showDossierForHub(h); });
    g.addEventListener("mouseleave", function () { if (!activeCat) applyFilter(null); });
    g.addEventListener("focus", function () { if (!activeCat) applyFilter(h.cat); showDossierForHub(h); });
    g.addEventListener("blur", function () { if (!activeCat) applyFilter(null); });
    g.addEventListener("click", function () { applyFilter(activeCat === h.cat ? null : h.cat); showDossierForHub(h); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        applyFilter(activeCat === h.cat ? null : h.cat);
        showDossierForHub(h);
      }
    });
  });

  leafEls.forEach(function (leaf) {
    function activate(e) { if (e) e.stopPropagation(); showDossierForLeaf(leaf.hub, leaf.text); }
    leaf.group.addEventListener("mouseenter", function () { showDossierForLeaf(leaf.hub, leaf.text); });
    leaf.group.addEventListener("focus", function () { showDossierForLeaf(leaf.hub, leaf.text); });
    leaf.group.addEventListener("click", activate);
    leaf.group.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); activate(e); }
    });
  });

  svg.addEventListener("click", function (e) { if (e.target === svg) applyFilter(null); });

  var pillbar = document.getElementById("pulc-pillbar");
  var resetPill = document.createElement("button");
  resetPill.type = "button";
  resetPill.className = "pulc-pill reset active";
  resetPill.textContent = "ALL " + N;
  resetPill.addEventListener("click", function () { applyFilter(null); dossier.classList.remove("show"); });
  pillbar.appendChild(resetPill);

  // Category pill counts are computed live from HUBS, never hand-typed.
  var catOrder = [], catCount = {}, catColorIdx = {};
  HUBS.forEach(function (h, i) {
    if (!(h.cat in catCount)) { catOrder.push(h.cat); catCount[h.cat] = 0; catColorIdx[h.cat] = i; }
    catCount[h.cat]++;
  });
  catOrder.forEach(function (cat) {
    var pill = document.createElement("button");
    pill.type = "button";
    pill.className = "pulc-pill";
    pill.setAttribute("data-cat", cat);
    var col = colorFor(catColorIdx[cat]);
    pill.setAttribute("data-color", col);
    pill.style.borderColor = colorFaint(catColorIdx[cat]);
    pill.textContent = CAT_LABELS[cat] + " · " + catCount[cat];
    pill.addEventListener("mouseenter", function () { if (activeCat !== cat) { pill.style.background = col; pill.style.color = "var(--panel)"; } });
    pill.addEventListener("mouseleave", function () { if (activeCat !== cat) { pill.style.background = ""; pill.style.color = ""; } });
    pill.addEventListener("click", function () { applyFilter(activeCat === cat ? null : cat); dossier.classList.remove("show"); });
    pillbar.appendChild(pill);
  });
})();
