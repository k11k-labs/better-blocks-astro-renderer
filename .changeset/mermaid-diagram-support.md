---
'@k11k/better-blocks-astro-renderer': minor
---

Add support for block-level Mermaid `diagram` nodes from the Better Blocks plugin (`{ type: 'diagram', format: 'mermaid', value }`). Diagrams are pre-rendered to inline SVG on the server with `beautiful-mermaid`, so the output is static HTML with **zero client-side JavaScript** — no browser, no hydration, no Chromium download. Supported diagram types (flowchart, sequence, state, class, ER, xychart) render to `<div class="mermaid-diagram">`; unsupported types and parse errors fall back to the raw source in `<pre class="mermaid-source">` so content is never lost. The block can be overridden with a custom `diagram` renderer that receives `code` and `format` props.
