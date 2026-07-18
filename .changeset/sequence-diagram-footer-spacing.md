---
'@k11k/better-blocks-astro-renderer': patch
---

Fix server-rendered sequence diagrams to match how mermaid.js draws them. The `beautiful-mermaid` layout drew participant boxes only at the top of a sequence diagram and spaced the lifelines using a fixed minimum gap that ignored message-label widths, so long labels overflowed their lanes and crossed the lifelines while the footer boxes were missing entirely — a visible mismatch with the editor preview. A local `patch-package` patch now mirrors each participant box in a footer row (as mermaid.js does) and widens the inter-actor gap so every message label fits within the span of the actors it connects. No change to this package's API or output for any other diagram type.
