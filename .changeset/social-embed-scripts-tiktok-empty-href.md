---
'@k11k/better-blocks-astro-renderer': patch
---

fix(social-embed): drop duplicate widget scripts, re-process TikTok, and avoid empty fallback hrefs

- **No duplicate widget scripts.** Widget `<script>` tags shipped inline in the embed markup — TikTok's oEmbed always ships one (there's no `omit_script` parameter) and hand-pasted Instagram/Facebook codes may too — are now stripped before render, so the lazy loader is the single script injector. This also repairs content saved by plugin versions that stored the scripts server-side.
- **TikTok re-processes.** The lazy loader now calls `tiktokEmbed.lib.render()` for embeds that scroll in after `embed.js` has loaded or that arrive via an `astro:page-load` view-transition navigation, with a fallback to re-injecting the script when the global is absent. Previously such TikTok embeds stayed a raw blockquote.
- **No empty fallback `href`.** The fallback card renders as a non-interactive `<div>` (instead of `<a href="">`) for embed-code-only nodes that carry no post URL. `SocialEmbedNode.url` is now optional to reflect this.
