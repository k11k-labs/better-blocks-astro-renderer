# @k11k/better-blocks-astro-renderer

## 0.3.0

### Minor Changes

- [`7824386`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/78243868013d4dce2dff08a7fa551b4b716ecabf) Thanks [@kkukielka](https://github.com/kkukielka)! - Add support for block-level Mermaid `diagram` nodes from the Better Blocks plugin (`{ type: 'diagram', format: 'mermaid', value }`). Diagrams are pre-rendered to inline SVG on the server with `beautiful-mermaid`, so the output is static HTML with **zero client-side JavaScript** — no browser, no hydration, no Chromium download. Supported diagram types (flowchart, sequence, state, class, ER, xychart) render to `<div class="mermaid-diagram">`; unsupported types and parse errors fall back to the raw source in `<pre class="mermaid-source">` so content is never lost. The block can be overridden with a custom `diagram` renderer that receives `code` and `format` props.

## 0.2.0

### Minor Changes

- [#1](https://github.com/k11k-labs/better-blocks-astro-renderer/pull/1) [`237946b`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/237946b5b99b6e581cea7e70443bb5137c77920f) Thanks [@kkukielka](https://github.com/kkukielka)! - Initial release. Native Astro renderer for Strapi v5 Blocks content with full Better Blocks support — paragraphs, headings, lists (ordered/unordered/todo), links, quotes, code, images, horizontal lines, tables, media embeds, and KaTeX math, plus all text modifiers (bold, italic, underline, strikethrough, code, uppercase, super/subscript, color, background color, font family, font size). Renders to static HTML with zero client-side JavaScript and supports custom block/modifier renderers via Astro components.
