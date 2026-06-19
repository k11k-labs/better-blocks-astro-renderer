<h1 align="center">Better Blocks Astro Renderer</h1>

<p align="center">Native Astro renderer for Strapi v5 Blocks content — supports all standard blocks plus Better Blocks features: color, highlight, text alignment, nested lists, to-do lists, tables, media embeds, image captions, and more. Zero client-side JavaScript.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@k11k/better-blocks-astro-renderer">
    <img alt="npm version" src="https://img.shields.io/npm/v/@k11k/better-blocks-astro-renderer.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@k11k/better-blocks-astro-renderer">
    <img alt="npm downloads" src="https://img.shields.io/npm/dm/@k11k/better-blocks-astro-renderer.svg" />
  </a>
  <a href="https://github.com/k11k-labs/better-blocks-astro-renderer/blob/main/LICENSE">
    <img alt="license" src="https://img.shields.io/npm/l/@k11k/better-blocks-astro-renderer.svg" />
  </a>
</p>

<p align="center">
  <img src="./docs/playground-showcase.png" alt="Strapi editor (left) and rendered output (right)" width="800" />
</p>

---

## Table of Contents

1. [Why?](#why)
2. [Compatibility](#compatibility)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Supported Blocks](#supported-blocks)
6. [Supported Modifiers](#supported-modifiers)
7. [Custom Renderers](#custom-renderers)
8. [TypeScript](#typescript)
9. [Contributing](#contributing)
10. [License](#license)

---

## Why?

The official Strapi blocks renderers are built for React. If your site is built with [Astro](https://astro.build/), you _can_ render Strapi blocks through the [`@astrojs/react`](https://docs.astro.build/en/guides/integrations-guide/react/) integration — but that pulls React into your build for what is purely presentational content.

This package is a **native Astro renderer**. It renders Strapi v5 Blocks content — including every feature the [Better Blocks](https://github.com/k11k-labs/strapi-plugin-better-blocks) plugin adds (color marks, text alignment, to-do lists, tables, media embeds, and more) — using plain `.astro` components. The output is **static HTML with zero client-side JavaScript**, and math is rendered to a string on the server (see [Math (KaTeX)](#math-katex)).

It is a **drop-in renderer** that handles all Better Blocks features out of the box — no configuration needed.

## Compatibility

| Strapi Version | Renderer Version | Astro Version |
| -------------- | ---------------- | ------------- |
| v5.x           | v0.x             | &ge; 4        |

## Installation

```bash
# Using yarn
yarn add @k11k/better-blocks-astro-renderer

# Using npm
npm install @k11k/better-blocks-astro-renderer
```

**Peer dependencies:** `astro >= 4`

## Usage

```astro
---
import { BlocksRenderer } from '@k11k/better-blocks-astro-renderer';

const { blocks } = Astro.props;
---

<BlocksRenderer content={blocks} />
```

That's it. All Better Blocks features — colors, tables, to-do lists, media embeds, alignment, and more — work automatically, and the component renders to static HTML (no hydration, no client directive).

A typical page that fetches from Strapi:

```astro
---
import { BlocksRenderer, type BlocksContent } from '@k11k/better-blocks-astro-renderer';
// Import the KaTeX stylesheet once (e.g. in a shared layout) so math displays correctly.
import 'katex/dist/katex.min.css';

const res = await fetch('https://your-strapi.example.com/api/articles?status=published');
const { data } = await res.json();
---

{
  data.map((article: { content: BlocksContent }) => (
    <article>
      <BlocksRenderer content={article.content} />
    </article>
  ))
}
```

### Math (KaTeX)

Math nodes are rendered with [KaTeX](https://katex.org/) — inline math becomes a `<span class="katex-inline">` and block math a `<div class="katex-block">`. Rendering happens via `katex.renderToString` on the server, so it works during SSR and static builds with **no client-side hydration step**.

KaTeX needs its stylesheet to display correctly. Import it **once** in your app (for example in a shared layout):

```astro
---
import 'katex/dist/katex.min.css';
---
```

`katex` ships as a dependency of this package, so the stylesheet resolves without a separate install. If KaTeX fails to parse a formula, the renderer falls back to the raw LaTeX source instead of crashing.

## Supported Blocks

| Block                           | Default element     | Source                      |
| ------------------------------- | ------------------- | --------------------------- |
| `paragraph`                     | `<p>`               | Strapi core                 |
| `heading` (1&ndash;6)           | `<h1>`&ndash;`<h6>` | Strapi core                 |
| `list` (ordered/unordered/todo) | `<ol>` / `<ul>`     | Strapi core + Better Blocks |
| `list-item`                     | `<li>`              | Strapi core                 |
| `link`                          | `<a>`               | Strapi core                 |
| `quote`                         | `<blockquote>`      | Strapi core                 |
| `code`                          | `<pre><code>`       | Strapi core                 |
| `image`                         | `<figure><img>`     | Strapi core                 |
| `horizontal-line`               | `<hr>`              | Better Blocks               |
| `table`                         | `<table>`           | Better Blocks               |
| `media-embed`                   | `<iframe>` (16:9)   | Better Blocks               |
| `math` (inline/block)           | `<span>` / `<div>`  | Better Blocks               |

### Block properties

| Property      | Applies to                | Description                                           |
| ------------- | ------------------------- | ----------------------------------------------------- |
| `textAlign`   | paragraph, heading, quote | Text alignment (`left`, `center`, `right`, `justify`) |
| `lineHeight`  | paragraph, heading, quote | CSS line-height value (e.g. `1.5`, `2.0`)             |
| `indent`      | paragraph, heading, quote | Block indentation level (`marginLeft: N * 2rem`)      |
| `indentLevel` | list                      | Cycling list-style-type per nesting depth             |
| `format`      | list                      | `ordered`, `unordered`, or `todo`                     |
| `checked`     | list-item (in todo lists) | Checkbox state (`true`/`false`)                       |
| `target`      | link                      | `_blank` for new-tab links                            |
| `rel`         | link                      | `noopener noreferrer` for new-tab links               |
| `caption`     | image                     | Text displayed below the image                        |
| `imageAlign`  | image                     | Image alignment (`left`, `center`, `right`)           |
| `url`         | media-embed               | Embed URL (YouTube/Vimeo iframe src)                  |
| `originalUrl` | media-embed               | Original user-provided URL                            |
| `format`      | math                      | `inline` (`<span>`) or `block` (`<div>`)              |
| `value`       | math                      | LaTeX source rendered with KaTeX                      |

## Supported Modifiers

| Modifier          | Default element                   | Source        |
| ----------------- | --------------------------------- | ------------- |
| `bold`            | `<strong>`                        | Strapi core   |
| `italic`          | `<em>`                            | Strapi core   |
| `underline`       | `<span>`                          | Strapi core   |
| `strikethrough`   | `<del>`                           | Strapi core   |
| `code`            | `<code>`                          | Strapi core   |
| `uppercase`       | `<span style="text-transform">`   | Better Blocks |
| `superscript`     | `<sup>`                           | Better Blocks |
| `subscript`       | `<sub>`                           | Better Blocks |
| `color`           | `<span style="color">`            | Better Blocks |
| `backgroundColor` | `<span style="background-color">` | Better Blocks |
| `fontFamily`      | `<span style="font-family">`      | Better Blocks |
| `fontSize`        | `<span style="font-size">`        | Better Blocks |

## Custom Renderers

Override any block type or text modifier with your own Astro component. Pass a map of type → component via the `blocks` and `modifiers` props. Each custom component receives its props through `Astro.props` and its inner content through the default `<slot />`.

### Custom block renderers

```astro
---
import { BlocksRenderer } from '@k11k/better-blocks-astro-renderer';
import MyParagraph from '../components/MyParagraph.astro';
import MyImage from '../components/MyImage.astro';
import MyTable from '../components/MyTable.astro';

const { blocks } = Astro.props;
---

<BlocksRenderer
  content={blocks}
  blocks={{
    paragraph: MyParagraph,
    image: MyImage,
    table: MyTable,
  }}
/>
```

```astro
---
// src/components/MyImage.astro
const { image, caption, imageAlign } = Astro.props;
---

<figure style={{ textAlign: imageAlign }}>
  <img src={image.url} alt={image.alternativeText || ''} loading="lazy" />
  {caption && <figcaption>{caption}</figcaption>}
</figure>
```

The props each custom block component receives:

| Block                                                      | Props (plus `<slot />` for children where applicable)         |
| ---------------------------------------------------------- | ------------------------------------------------------------- |
| `paragraph`                                                | `{ style?}`                                                   |
| `heading`                                                  | `{ level: 1–6; style? }`                                      |
| `list`                                                     | `{ format: 'ordered' \| 'unordered' \| 'todo'; indentLevel }` |
| `list-item`                                                | `{ checked? }`                                                |
| `link`                                                     | `{ url; target?; rel? }`                                      |
| `quote`                                                    | `{ style? }`                                                  |
| `code`                                                     | `{ plainText }` (also via `<slot />`)                         |
| `image`                                                    | `{ image; caption?; imageAlign? }` (no slot)                  |
| `horizontal-line`                                          | _none_                                                        |
| `table` / `table-row` / `table-cell` / `table-header-cell` | children via `<slot />`                                       |
| `media-embed`                                              | `{ url; originalUrl? }` (no slot)                             |
| `math`                                                     | `{ formula; inline }` (no slot) — bring your own math engine  |

### Custom modifier renderers

```astro
---
import { BlocksRenderer } from '@k11k/better-blocks-astro-renderer';
import Highlight from '../components/Highlight.astro';

const { blocks } = Astro.props;
---

<BlocksRenderer content={blocks} modifiers={{ backgroundColor: Highlight }} />
```

```astro
---
// src/components/Highlight.astro
const { backgroundColor } = Astro.props;
---

<mark style={{ backgroundColor }}><slot /></mark>
```

The color/size/font modifiers receive a value prop (`color`, `backgroundColor`, `fontFamily`, `fontSize`); the rest receive only their `<slot />`.

## TypeScript

All types are exported:

```ts
import type {
  BlocksContent,
  BlocksRendererProps,
  BlockNode,
  TextNode,
  LinkNode,
  ListNode,
  ListItemNode,
  ParagraphNode,
  HeadingNode,
  QuoteNode,
  CodeNode,
  ImageNode,
  HorizontalLineNode,
  TableNode,
  TableRowNode,
  TableCellNode,
  TableHeaderCellNode,
  MediaEmbedNode,
  MathNode,
  TextAlign,
  CustomBlocksConfig,
  CustomModifiersConfig,
} from '@k11k/better-blocks-astro-renderer';
```

## Contributing

Contributions are welcome! The easiest way to get started is with Docker:

```bash
# Clone the repository
git clone https://github.com/k11k-labs/better-blocks-astro-renderer.git
cd better-blocks-astro-renderer

# Start the playground with Docker
cd playground
docker compose up
```

This will start a Strapi v5 instance with the Better Blocks plugin and an Astro app that renders the content — all pre-configured with a showcase article.

- **Strapi admin:** http://localhost:1337/admin (login: `admin@example.com` / `admin12#`)
- **Astro app:** http://localhost:4321

### Development workflow

1. Edit the `.astro` components in `src/`
2. The Astro app picks up the change automatically — there is no build step

### Without Docker

```bash
# Install dependencies (no build step — the renderer ships .astro source)
yarn install

# Start Strapi
cd playground/strapi && cp .env.example .env && npm install && npm run dev

# Start the Astro app (in another terminal)
cd playground/astro-app && npm install && npm run dev
```

### Running tests

```bash
yarn test        # Run tests (Astro container API + Vitest)
yarn test:ts     # Type check (astro check)
yarn lint        # Check formatting
```

## Community & Support

- [GitHub Issues](https://github.com/k11k-labs/better-blocks-astro-renderer/issues) &mdash; Bug reports and feature requests

## Related

- [@k11k/better-blocks-react-renderer](https://github.com/k11k-labs/better-blocks-react-renderer) &mdash; React renderer with the same Better Blocks support
- [@k11k/strapi-plugin-better-blocks](https://github.com/k11k-labs/strapi-plugin-better-blocks) &mdash; Strapi plugin that extends the Blocks editor with colors, tables, to-do lists, media embeds, and more

## License

[MIT License](LICENSE) &copy; [k11k-labs](https://github.com/k11k-labs)
