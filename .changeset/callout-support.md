---
'@k11k/better-blocks-astro-renderer': minor
---

Add support for `callout` (admonition) nodes from the Better Blocks plugin (`{ type: 'callout', variant, title?, children }`). Callouts render GitHub-style in five variants — note, tip, important, warning, caution — as an `<aside role="note">` with a colored left border, a title row (icon + label, or the node's custom `title`), and the nested block children rendered recursively. Colors ship in a scoped `<style>` (zero client-side JavaScript) and adapt to dark mode via `prefers-color-scheme`; the per-variant accent is exposed as a `--bb-callout-accent` custom property for easy retheming. The block can be overridden with a custom `callout` component that receives `variant` and `title` (children via `<slot />`).
