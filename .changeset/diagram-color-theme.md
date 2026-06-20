---
"@k11k/better-blocks-astro-renderer": minor
---

Render Mermaid diagrams in color. Previously diagrams were passed to `beautiful-mermaid` with no palette, so every color was derived from a single dark foreground and the output looked monochrome. They now default to the `github-light` theme, and a new `diagramTheme` prop on `BlocksRenderer` accepts either a built-in theme name (`github-dark`, `dracula`, `nord`, `tokyo-night`, …) or a custom color object (`{ bg, fg, line, accent, muted, surface, border }`). The theme also propagates to diagrams nested inside `callout` and `details` blocks.
