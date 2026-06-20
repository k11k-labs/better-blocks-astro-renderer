---
"@k11k/better-blocks-astro-renderer": minor
---

Add support for the `button` block (WordPress-style CTA + Media Library file download). Link mode renders an `<a>` with `href`/`target`/`rel`/`aria-label`; file mode renders a download link with an optional file-type icon (`showFileIcon`) and human-readable size (`showFileSize`). The `style` object is applied as inline CSS, `alignment` controls a block-level wrapper, and hover colors are exposed as `--bb-button-hover-*` custom properties wired up by a scoped stylesheet (hover transition + keyboard focus ring, zero client-side JavaScript). The block is overridable through the `blocks.button` prop.
