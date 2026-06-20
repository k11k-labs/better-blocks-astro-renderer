# @k11k/better-blocks-astro-renderer

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
