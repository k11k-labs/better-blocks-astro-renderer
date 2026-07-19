---
'@k11k/better-blocks-astro-renderer': minor
---

feat: table cell alignment, spans, and semantic header rows

Adds renderer support for the table authoring features from Better Blocks.

- **`align`** — `table-cell` / `table-header-cell` may carry `align` (`left` / `center` / `right`), mapped to inline `text-align`. Omitted means left, so existing documents render unchanged.
- **`colSpan` / `rowSpan`** — map straight onto the `colspan` / `rowspan` HTML attributes. Omitted (or `1`) emits no attribute, matching hand-written HTML — a spanned-over slot simply has no node.
- **Semantic header rows** — a leading row whose cells are all header cells is grouped into `<thead>` and its cells render as `<th scope="col">` for screen-reader header announcement; the rest go into `<tbody>` as `<td>`.
- Cell `children` continue to route through the standard inline renderer, so marks (bold, links, inline math, colors, …) render inside cells.

Custom `table-cell` / `table-header-cell` overrides now receive `align`, `colSpan`, and `rowSpan` as props.
