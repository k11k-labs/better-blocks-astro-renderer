---
'@k11k/better-blocks-astro-renderer': minor
---

feat: GitHub-style defaults for tables, blockquotes, and code blocks

Tables, blockquotes, and code blocks now ship with GitHub-flavored defaults out of the box — no CSS to import.

- **Tables** render as `<table class="bb-table">` with bordered cells, a shaded header, and zebra-striped body rows. Leading header rows are grouped into `<thead>`, the rest into `<tbody>`, and the table scrolls horizontally on overflow. Retheme via the `--bb-table-*` custom properties.
- **Blockquotes** render as `<blockquote class="bb-quote">` with a muted left border and dimmed text. Retheme via the `--bb-quote-*` custom properties.
- **Code blocks** are syntax-highlighted with Shiki via Astro's built-in `<Code />` component (build/SSR, zero client-side JavaScript). The `code` node's new `language` field selects the grammar; unknown or missing languages fall back to `plaintext`. New `codeTheme` prop picks any bundled Shiki theme (`github-dark` default), and the opt-in `codeCopyButton` prop adds a copy button (off by default to preserve zero-JS output).

Each default carries stable `bb-*` classes and a scoped `<style>`, and — as with every block — can be fully overridden via `blocks={{ table, quote, code }}`.
