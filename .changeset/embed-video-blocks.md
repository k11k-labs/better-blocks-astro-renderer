---
'@k11k/better-blocks-astro-renderer': minor
---

feat: render the new `embed` and `video` blocks

Adds two block types introduced by Better Blocks, both static HTML with no client-side JavaScript.

- **`embed`** — a generic third-party embed (YouTube, Vimeo, Loom, Wistia, Dailymotion, api.video, generic). Renders the plugin-sanitized `embedHtml` verbatim via `set:html` inside a `<figure class="bb-embed">` with a CSS `aspect-ratio` box and flex alignment. Aligned embeds are capped by the retheme-able `--bb-embed-max-width`; `alignment: none` flows full-width. Optional `title`/`caption` render as `<figcaption>`s. Override via `blocks={{ embed }}`.
- **`video`** — a provider-aware player (`local`, `mux`, `api-video`, `cloudinary`, `custom`) rendered as a native `<video>`. Picks the source from `url` → `file.url` → a Mux stream derived from `playbackId` (with a derived poster), maps `player.*` 1:1 to the element (`muted` forced on with `autoplay`), adds a `<track kind="captions">` from `transcript`, and wires `caption` via `aria-describedby`. HLS/DASH sources only play natively in Safari, so streaming figures are marked `data-hls` and fall back to the poster plus an open-link — override via `blocks={{ video }}` for a cross-browser player.

Existing `media-embed` handling is unchanged; the plugin deprecates it but keeps rendering documents that still contain it.
