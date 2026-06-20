---
"@k11k/better-blocks-astro-renderer": minor
---

Add support for the `details` (collapsible) block. It renders a native, accessible `<details>` / `<summary>` disclosure with zero client-side JavaScript, honors `defaultOpen` via the HTML `open` attribute, supports arbitrarily nested `details`, and ships a scoped GitHub-inspired stylesheet (retheme via `--bb-details-*` custom properties). Replace the markup entirely through the `blocks.details` prop.
