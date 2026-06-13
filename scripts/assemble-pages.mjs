import { cp, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const siteDir = join(root, "site");

async function pathExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderInline(value) {
  const tokens = [];
  let output = escapeHtml(value).replace(/`([^`]+)`/g, (_match, code) => {
    const token = `@@CODE${tokens.length}@@`;
    tokens.push(`<code>${code}</code>`);
    return token;
  });

  output = output
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => `<a href="${href}">${label}</a>`);

  return tokens.reduce((current, token, index) => current.replace(`@@CODE${index}@@`, token), output);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function renderTable(lines) {
  const [headerLine, , ...bodyLines] = lines;
  const headers = splitTableRow(headerLine);
  const rows = bodyLines.map(splitTableRow);

  return `<table>
  <thead><tr>${headers.map((header) => `<th scope="col">${renderInline(header)}</th>`).join("")}</tr></thead>
  <tbody>
    ${rows
      .map((row) => `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`)
      .join("\n    ")}
  </tbody>
</table>`;
}

function startsBlock(line, nextLine = "") {
  return (
    line.startsWith("#") ||
    line.startsWith("```") ||
    /^[-*] /.test(line) ||
    /^\d+\. /.test(line) ||
    (line.startsWith("|") && nextLine.startsWith("|"))
  );
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const nextLine = lines[index + 1] ?? "";

    if (line.trim() === "") {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const code = [];
      index += 1;

      while (index < lines.length && !lines[index].startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }

      html.push(`<pre><code class="language-${escapeHtml(language)}">${escapeHtml(code.join("\n"))}</code></pre>`);
      index += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      html.push(`<h${level} id="${slugify(text)}">${renderInline(text)}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.startsWith("|") && nextLine.startsWith("|")) {
      const tableLines = [];
      while (index < lines.length && lines[index].startsWith("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      html.push(renderTable(tableLines));
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items = [];
      while (index < lines.length && /^[-*] /.test(lines[index])) {
        const item = lines[index].replace(/^[-*]\s+/, "");
        const checkbox = /^\[[ xX]\]\s+/.exec(item);
        const checked = /^\[[xX]\]/.test(item);
        items.push(
          checkbox
            ? `<li><input type="checkbox" disabled${checked ? " checked" : ""}> ${renderInline(item.replace(/^\[[ xX]\]\s+/, ""))}</li>`
            : `<li>${renderInline(item)}</li>`
        );
        index += 1;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items = [];
      while (index < lines.length && /^\d+\. /.test(lines[index])) {
        items.push(`<li>${renderInline(lines[index].replace(/^\d+\.\s+/, ""))}</li>`);
        index += 1;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() !== "" && !startsBlock(lines[index], lines[index + 1] ?? "")) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`);
  }

  return html.join("\n");
}

function removeLeadingTitle(markdown, title) {
  const normalized = markdown.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  if (lines[0]?.trim() !== `# ${title}`) {
    return normalized;
  }

  let start = 1;
  while (lines[start]?.trim() === "") {
    start += 1;
  }

  return lines.slice(start).join("\n");
}

function documentShell({ title, description, body, backHref = "../" }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)} | Frontend Performance Lab</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f6f7fb;
        color: #172033;
      }
      *,
      *::before,
      *::after { box-sizing: border-box; }
      body { margin: 0; }
      main { width: min(960px, 100%); margin: 0 auto; padding: 44px 20px 64px; }
      nav { margin-bottom: 28px; }
      a { color: #0b6f72; font-weight: 700; }
      h1 { margin: 0 0 10px; font-size: clamp(2rem, 5vw, 3.4rem); line-height: 1; }
      h2 { margin-top: 36px; }
      h3 { margin-top: 28px; }
      p, li { line-height: 1.68; color: #4d5a73; }
      table { display: block; width: 100%; max-width: 100%; overflow-x: auto; border-collapse: collapse; margin: 20px 0; background: #fff; }
      th, td { border: 1px solid #d7dce8; padding: 10px 12px; text-align: left; vertical-align: top; }
      th { background: #eef2f7; color: #172033; }
      pre { max-width: 100%; overflow: auto; border: 1px solid #d7dce8; border-radius: 8px; padding: 16px; background: #172033; color: #eef3ff; }
      code { font-family: "SFMono-Regular", Consolas, monospace; }
      .deck { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 24px; }
      .deck a { display: block; min-height: 110px; border: 1px solid #d7dce8; border-radius: 8px; padding: 18px; background: #fff; color: inherit; text-decoration: none; }
      .deck span { display: block; margin-top: 8px; color: #63708a; font-weight: 400; line-height: 1.5; }
      .lead { max-width: 760px; color: #4d5a73; }
      @media (prefers-color-scheme: dark) {
        :root { background: #111827; color: #eef3ff; }
        p, li, .lead, .deck span { color: #bac5dc; }
        a { color: #79e0dc; }
        table, .deck a { background: #182235; }
        th { background: #222d42; color: #eef3ff; }
        th, td, pre, .deck a { border-color: #2d3a52; }
      }
    </style>
  </head>
  <body>
    <main>
      <nav><a href="${backHref}">Frontend Performance Lab</a></nav>
      <h1>${escapeHtml(title)}</h1>
      ${description ? `<p class="lead">${escapeHtml(description)}</p>` : ""}
      ${body}
    </main>
  </body>
</html>
`;
}

async function writeMarkdownPage({ source, target, title, description, backHref }) {
  const markdown = await readFile(source, "utf8");
  const bodyMarkdown = removeLeadingTitle(markdown, title);
  await mkdir(target, { recursive: true });
  await writeFile(
    join(target, "index.html"),
    documentShell({
      title,
      description,
      body: renderMarkdown(bodyMarkdown),
      backHref
    })
  );
}

function docsIndexPage() {
  return documentShell({
    title: "Documentation",
    description: "Manual measurement notes, metrics definitions, and before/after result templates for the performance lab.",
    backHref: "../",
    body: `<section class="deck" aria-label="Documentation pages">
      <a href="./metrics/"><strong>Metrics</strong><span>Signals captured by the app panels, build output, coverage, and manual result templates.</span></a>
      <a href="./profiling-notes/"><strong>Profiling Notes</strong><span>How to inspect the slow and optimized implementations without changing the comparison.</span></a>
      <a href="./browser-trace-export/"><strong>Browser Trace Export</strong><span>Manual Chrome and Edge DevTools trace workflow for focused benchmark scenarios.</span></a>
      <a href="./results-before-after/"><strong>Results Before and After</strong><span>Placeholders for real browser measurements. No invented performance numbers.</span></a>
    </section>`
  });
}

async function main() {
  await mkdir(siteDir, { recursive: true });
  await rm(join(siteDir, "docs"), { recursive: true, force: true });
  await rm(join(siteDir, "benchmark"), { recursive: true, force: true });
  await mkdir(join(siteDir, "docs"), { recursive: true });
  await mkdir(join(siteDir, "benchmark"), { recursive: true });
  await writeFile(join(siteDir, "docs", "index.html"), docsIndexPage());
  await writeMarkdownPage({
    source: join(root, "docs", "metrics.md"),
    target: join(siteDir, "docs", "metrics"),
    title: "Metrics",
    description: "Runtime, bundle, coverage, and manual measurement fields used by the lab.",
    backHref: "../"
  });
  await writeMarkdownPage({
    source: join(root, "docs", "profiling-notes.md"),
    target: join(siteDir, "docs", "profiling-notes"),
    title: "Profiling Notes",
    description: "Measurement workflow and implementation notes for the slow and optimized apps.",
    backHref: "../"
  });
  await writeMarkdownPage({
    source: join(root, "docs", "browser-trace-export.md"),
    target: join(siteDir, "docs", "browser-trace-export"),
    title: "Browser Trace Export",
    description: "Manual DevTools trace export workflow for focused benchmark scenarios.",
    backHref: "../"
  });
  await writeMarkdownPage({
    source: join(root, "docs", "results-before-after.md"),
    target: join(siteDir, "docs", "results-before-after"),
    title: "Results Before and After",
    description: "Manual result placeholders that must be filled only with real browser measurements.",
    backHref: "../"
  });
  await writeMarkdownPage({
    source: join(root, "benchmark", "README.md"),
    target: join(siteDir, "benchmark"),
    title: "Benchmark Protocol",
    description: "Deterministic benchmark scenarios and measurement rules for both apps.",
    backHref: "../"
  });
  await writeFile(join(siteDir, ".nojekyll"), "");

  const coverageExists = await pathExists(join(siteDir, "coverage", "index.html"));
  const typedocExists = await pathExists(join(siteDir, "typedoc", "index.html"));
  const slowExists = await pathExists(join(siteDir, "slow", "index.html"));
  const optimizedExists = await pathExists(join(siteDir, "optimized", "index.html"));

  if (await pathExists(join(root, "LICENSE"))) {
    await cp(join(root, "LICENSE"), join(siteDir, "LICENSE"));
  }

  await writeFile(
    join(siteDir, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Frontend Performance Lab</title>
    <style>
      :root {
        color-scheme: light dark;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f6f7fb;
        color: #172033;
      }
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      body {
        margin: 0;
      }
      main {
        max-width: 1120px;
        margin: 0 auto;
        padding: 48px 20px;
      }
      h1 {
        margin: 0 0 12px;
        font-size: clamp(2rem, 4vw, 4rem);
        line-height: 1;
      }
      p {
        max-width: 760px;
        color: #4d5a73;
        line-height: 1.65;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-top: 28px;
      }
      a {
        display: block;
        min-height: 120px;
        padding: 20px;
        border: 1px solid #d7dce8;
        border-radius: 8px;
        color: inherit;
        text-decoration: none;
        background: #fff;
      }
      a:hover,
      a:focus-visible {
        outline: 3px solid #34a0a4;
        outline-offset: 2px;
      }
      strong {
        display: block;
        margin-bottom: 8px;
        font-size: 1.1rem;
      }
      span {
        color: #63708a;
        line-height: 1.5;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          background: #111827;
          color: #eef3ff;
        }
        p,
        span {
          color: #bac5dc;
        }
        a {
          background: #182235;
          border-color: #2d3a52;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Frontend Performance Lab</h1>
      <p>
        A portfolio-grade React performance case study with intentionally slow and optimized implementations,
        benchmark instrumentation, coverage, TypeDoc output, and reproducible measurement notes.
      </p>
      <section class="grid" aria-label="Site sections">
        ${slowExists ? '<a href="./slow/"><strong>Slow App</strong><span>Baseline implementation with deliberate render, bundle, and list pressure.</span></a>' : ""}
        ${optimizedExists ? '<a href="./optimized/"><strong>Optimized App</strong><span>The same UI with targeted memoization, virtualization, lazy loading, and state locality.</span></a>' : ""}
        ${coverageExists ? '<a href="./coverage/"><strong>Coverage</strong><span>HTML coverage generated by Vitest and the V8 provider.</span></a>' : ""}
        ${typedocExists ? '<a href="./typedoc/"><strong>TypeDoc</strong><span>Documentation for benchmark, profiling, data, and performance helper APIs.</span></a>' : ""}
        <a href="./docs/"><strong>Documentation</strong><span>Metrics, profiling notes, and before/after result templates as static HTML pages.</span></a>
        <a href="./docs/results-before-after/"><strong>Results Template</strong><span>Before and after metrics table with placeholders for manual measurements.</span></a>
        <a href="./benchmark/"><strong>Benchmark Protocol</strong><span>Reusable scenarios and measurement flow for both apps.</span></a>
      </section>
    </main>
  </body>
</html>
`
  );
}

await main();
