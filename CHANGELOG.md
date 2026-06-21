# @k11k/better-blocks-astro-renderer

## 0.7.0

### Minor Changes

- [#22](https://github.com/k11k-labs/better-blocks-astro-renderer/pull/22) [`02fd553`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/02fd553bfcde708c645f665e0cad91575b088ac0) Thanks [@kkukielka](https://github.com/kkukielka)! - Fix cross-origin file downloads and add a `filePreview` toggle for file buttons.

  File-mode download buttons are now tagged `data-bb-download` and force a real download via a small scoped progressive-enhancement script (a blob fetch saved from a same-origin object URL). The native `download` attribute is ignored for cross-origin assets (Strapi/CDN), which made PDFs, videos and images preview inline instead of saving. Without JavaScript the anchor still works via its `href` + `download` attributes, and a CORS-blocked fetch falls back to native navigation.

  Adds the `filePreview` option (mirrors the editor field): when `true`, the file opens in a new tab (`target="_blank" rel="noopener noreferrer"`, no download) for preview instead of downloading — this path stays fully zero-JS. `filePreview` is also passed through to custom `button` renderers.

## 0.6.0

### Minor Changes

- [#18](https://github.com/k11k-labs/better-blocks-astro-renderer/pull/18) [`6b5acfb`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/6b5acfb83e33904e2feb0cbc9b57b386d2a2951c) Thanks [@kkukielka](https://github.com/kkukielka)! - Add support for the `button` block (WordPress-style CTA + Media Library file download). Link mode renders an `<a>` with `href`/`target`/`rel`/`aria-label`; file mode renders a download link with an optional file-type icon (`showFileIcon`) and human-readable size (`showFileSize`). The `style` object is applied as inline CSS, `alignment` controls a block-level wrapper, and hover colors are exposed as `--bb-button-hover-*` custom properties wired up by a scoped stylesheet (hover transition + keyboard focus ring, zero client-side JavaScript). The block is overridable through the `blocks.button` prop.

## 0.5.1

### Patch Changes

- [#16](https://github.com/k11k-labs/better-blocks-astro-renderer/pull/16) [`d61c771`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/d61c77174d9534a12b3c0dcaf53c081d7d8af3c4) Thanks [@kkukielka](https://github.com/kkukielka)! - Render Mermaid diagrams in color. Previously diagrams were passed to `beautiful-mermaid` with no palette, so every color was derived from a single dark foreground and the output looked monochrome. They now default to a palette that mirrors mermaid.js's familiar look (lavender node fills, purple borders, dark edges), and a new `diagramTheme` prop on `BlocksRenderer` accepts either a built-in theme name (`github-light`, `github-dark`, `dracula`, `nord`, `tokyo-night`, …) or a custom color object (`{ bg, fg, line, accent, muted, surface, border }`). The theme also propagates to diagrams nested inside `callout` and `details` blocks.

## 0.5.0

### Minor Changes

- [#12](https://github.com/k11k-labs/better-blocks-astro-renderer/pull/12) [`26e1a4a`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/26e1a4aa212ca34a62f2248577ed786d57b1d720) Thanks [@kkukielka](https://github.com/kkukielka)! - Add support for the `details` (collapsible) block. It renders a native, accessible `<details>` / `<summary>` disclosure with zero client-side JavaScript, honors `defaultOpen` via the HTML `open` attribute, supports arbitrarily nested `details`, and ships a scoped GitHub-inspired stylesheet (retheme via `--bb-details-*` custom properties). Replace the markup entirely through the `blocks.details` prop.

## 0.4.1

### Patch Changes

- [`e242e0a`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/e242e0a8daee451420bf675cb0f7a6c53f73d870) Thanks [@kkukielka](https://github.com/kkukielka)! - Fix bottom-heavy callout spacing and align callout styling with GitHub's light alert palette. The body's outer margins now collapse correctly (the scoped `:first-child`/`:last-child` rules are applied via `:global()` so they reach the cross-component body blocks), an ~8% accent-tinted background is added to match the editor preview, and the title spacing and per-variant colors match GitHub's official tokens.

## 0.4.0

### Minor Changes

- [#6](https://github.com/k11k-labs/better-blocks-astro-renderer/pull/6) [`43d33b5`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/43d33b5c84561f58669282275ff2011229cfe29a) Thanks [@kkukielka](https://github.com/kkukielka)! - Add support for `callout` (admonition) nodes from the Better Blocks plugin (`{ type: 'callout', variant, title?, children }`). Callouts render GitHub-style in five variants — note, tip, important, warning, caution — as an `<aside role="note">` with a colored left border, a title row (icon + label, or the node's custom `title`), and the nested block children rendered recursively. Colors ship in a scoped `<style>` (zero client-side JavaScript) and adapt to dark mode via `prefers-color-scheme`; the per-variant accent is exposed as a `--bb-callout-accent` custom property for easy retheming. The block can be overridden with a custom `callout` component that receives `variant` and `title` (children via `<slot />`).

## 0.3.0

### Minor Changes

- [#4](https://github.com/k11k-labs/better-blocks-astro-renderer/pull/4) [`7930308`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/79303080a7d8dade5305d7ce27a5378a5a1b969e) Thanks [@kkukielka](https://github.com/kkukielka)! - Add support for block-level Mermaid `diagram` nodes from the Better Blocks plugin (`{ type: 'diagram', format: 'mermaid', value }`). Diagrams are pre-rendered to inline SVG on the server with `beautiful-mermaid`, so the output is static HTML with **zero client-side JavaScript** — no browser, no hydration, no Chromium download. Supported diagram types (flowchart, sequence, state, class, ER, xychart) render to `<div class="mermaid-diagram">`; unsupported types and parse errors fall back to the raw source in `<pre class="mermaid-source">` so content is never lost. The block can be overridden with a custom `diagram` renderer that receives `code` and `format` props.

## 0.2.0

### Minor Changes

- [#1](https://github.com/k11k-labs/better-blocks-astro-renderer/pull/1) [`237946b`](https://github.com/k11k-labs/better-blocks-astro-renderer/commit/237946b5b99b6e581cea7e70443bb5137c77920f) Thanks [@kkukielka](https://github.com/kkukielka)! - Initial release. Native Astro renderer for Strapi v5 Blocks content with full Better Blocks support — paragraphs, headings, lists (ordered/unordered/todo), links, quotes, code, images, horizontal lines, tables, media embeds, and KaTeX math, plus all text modifiers (bold, italic, underline, strikethrough, code, uppercase, super/subscript, color, background color, font family, font size). Renders to static HTML with zero client-side JavaScript and supports custom block/modifier renderers via Astro components.
