---
"@k11k/better-blocks-astro-renderer": minor
---

Fix cross-origin file downloads and add a `filePreview` toggle for file buttons.

File-mode download buttons are now tagged `data-bb-download` and force a real download via a small scoped progressive-enhancement script (a blob fetch saved from a same-origin object URL). The native `download` attribute is ignored for cross-origin assets (Strapi/CDN), which made PDFs, videos and images preview inline instead of saving. Without JavaScript the anchor still works via its `href` + `download` attributes, and a CORS-blocked fetch falls back to native navigation.

Adds the `filePreview` option (mirrors the editor field): when `true`, the file opens in a new tab (`target="_blank" rel="noopener noreferrer"`, no download) for preview instead of downloading — this path stays fully zero-JS. `filePreview` is also passed through to custom `button` renderers.
