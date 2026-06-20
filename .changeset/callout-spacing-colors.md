---
"@k11k/better-blocks-astro-renderer": patch
---

Fix bottom-heavy callout spacing and align callout styling with GitHub's light alert palette. The body's outer margins now collapse correctly (the scoped `:first-child`/`:last-child` rules are applied via `:global()` so they reach the cross-component body blocks), an ~8% accent-tinted background is added to match the editor preview, and the title spacing and per-variant colors match GitHub's official tokens.
