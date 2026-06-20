import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { parseHTML } from 'linkedom';
import { describe, it, expect, beforeAll } from 'vitest';

import BlocksRenderer from '../src/BlocksRenderer.astro';
import type { BlocksContent, CustomBlocksConfig, CustomModifiersConfig } from '../src/types';

import CustomParagraph from './fixtures/CustomParagraph.astro';
import CustomHeading from './fixtures/CustomHeading.astro';
import CustomLink from './fixtures/CustomLink.astro';
import CustomHr from './fixtures/CustomHr.astro';
import CustomEmbed from './fixtures/CustomEmbed.astro';
import CustomTable from './fixtures/CustomTable.astro';
import CustomRow from './fixtures/CustomRow.astro';
import CustomTh from './fixtures/CustomTh.astro';
import CustomTd from './fixtures/CustomTd.astro';
import CustomImage from './fixtures/CustomImage.astro';
import CustomMath from './fixtures/CustomMath.astro';
import CustomDiagram from './fixtures/CustomDiagram.astro';
import CustomCallout from './fixtures/CustomCallout.astro';
import CustomDetails from './fixtures/CustomDetails.astro';
import CustomBold from './fixtures/CustomBold.astro';
import CustomColor from './fixtures/CustomColor.astro';
import CustomBg from './fixtures/CustomBg.astro';

let container: AstroContainer;

beforeAll(async () => {
  container = await AstroContainer.create();
});

type RenderProps = { blocks?: CustomBlocksConfig; modifiers?: CustomModifiersConfig };

async function render(content: BlocksContent | null, props: RenderProps = {}) {
  const raw = await container.renderToString(BlocksRenderer, {
    props: { content, ...props },
  });
  // Strip Astro's dev-only source-mapping attributes for clean assertions.
  const html = raw.replace(/ data-astro-source-(file|loc)="[^"]*"/g, '');
  const { document } = parseHTML(`<!doctype html><html><body>${html}</body></html>`);
  return { html, document, container: document.body as unknown as HTMLElement };
}

/** Normalized inline-style string (whitespace removed) for substring checks. */
function styleOf(el: Element | null): string {
  return (el?.getAttribute('style') ?? '').replace(/\s/g, '');
}

function byText(root: ParentNode, text: string): Element | null {
  return (
    Array.from(root.querySelectorAll('*')).find((el) =>
      Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent === text)
    ) ?? null
  );
}

describe('BlocksRenderer', () => {
  it('returns empty for empty content', async () => {
    const { container } = await render([]);
    expect(container.innerHTML.trim()).toBe('');
  });

  it('returns empty for undefined-ish content', async () => {
    const { container } = await render(null);
    expect(container.innerHTML.trim()).toBe('');
  });

  // ── Paragraphs ───────────────────────────────────────────────────

  it('renders a paragraph with plain text', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Hello world' }] },
    ]);
    const p = container.querySelector('p');
    expect(p).not.toBeNull();
    expect(p?.textContent).toBe('Hello world');
  });

  // ── Headings ─────────────────────────────────────────────────────

  it('renders headings h1-h6', async () => {
    const { container } = await render([
      { type: 'heading', level: 1, children: [{ type: 'text', text: 'H1' }] },
      { type: 'heading', level: 2, children: [{ type: 'text', text: 'H2' }] },
      { type: 'heading', level: 3, children: [{ type: 'text', text: 'H3' }] },
    ]);
    expect(container.querySelector('h1')?.textContent).toBe('H1');
    expect(container.querySelector('h2')?.textContent).toBe('H2');
    expect(container.querySelector('h3')?.textContent).toBe('H3');
  });

  // ── Standard Marks ───────────────────────────────────────────────

  it('renders bold text', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Bold', bold: true }] },
    ]);
    expect(container.querySelector('strong')?.textContent).toBe('Bold');
  });

  it('renders italic text', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Italic', italic: true }] },
    ]);
    expect(container.querySelector('em')?.textContent).toBe('Italic');
  });

  it('renders underline text', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Under', underline: true }] },
    ]);
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('Under');
    expect(styleOf(span)).toContain('text-decoration:underline');
  });

  it('renders strikethrough text', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Strike', strikethrough: true }] },
    ]);
    expect(container.querySelector('del')?.textContent).toBe('Strike');
  });

  it('renders inline code', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Code', code: true }] },
    ]);
    expect(container.querySelector('code')?.textContent).toBe('Code');
  });

  // ── Color & Background Marks ─────────────────────────────────────

  it('renders text with color', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Red', color: '#E53E3E' }] },
    ]);
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('Red');
    expect(styleOf(span)).toContain('color:#E53E3E');
  });

  it('renders text with backgroundColor', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Highlighted', backgroundColor: '#FED7D7' }],
      },
    ]);
    const span = container.querySelector('span');
    expect(span?.textContent).toBe('Highlighted');
    expect(styleOf(span)).toContain('background-color:#FED7D7');
  });

  it('renders text with both color and backgroundColor', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Both', color: '#E53E3E', backgroundColor: '#FED7D7' }],
      },
    ]);
    expect(container.querySelector('span[style*="background-color"]')).not.toBeNull();
    expect(container.querySelector('span[style*="color"]')).not.toBeNull();
  });

  it('renders bold + color combined', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'BoldRed', bold: true, color: '#E53E3E' }],
      },
    ]);
    const strong = container.querySelector('strong');
    expect(strong?.textContent).toBe('BoldRed');
    expect(strong?.closest('span[style*="color"]')).not.toBeNull();
  });

  // ── Links ────────────────────────────────────────────────────────

  it('renders links', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            children: [{ type: 'text', text: 'Click me' }],
          },
        ],
      },
    ]);
    const a = container.querySelector('a');
    expect(a?.textContent).toBe('Click me');
    expect(a?.getAttribute('href')).toBe('https://example.com');
  });

  it('renders links with target="_blank" and rel', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            target: '_blank',
            rel: 'noopener noreferrer',
            children: [{ type: 'text', text: 'External' }],
          },
        ],
      },
    ]);
    const a = container.querySelector('a');
    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('does not set target when not provided', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            url: 'https://example.com',
            children: [{ type: 'text', text: 'Normal' }],
          },
        ],
      },
    ]);
    expect(container.querySelector('a')?.hasAttribute('target')).toBe(false);
  });

  // ── Lists ────────────────────────────────────────────────────────

  it('renders unordered lists', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'unordered',
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Item 1' }] },
          { type: 'list-item', children: [{ type: 'text', text: 'Item 2' }] },
        ],
      },
    ]);
    const li = byText(container, 'Item 1');
    expect(li?.closest('ul')).not.toBeNull();
    expect(li?.closest('li')).not.toBeNull();
  });

  it('renders ordered lists', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'ordered',
        children: [{ type: 'list-item', children: [{ type: 'text', text: 'First' }] }],
      },
    ]);
    expect(byText(container, 'First')?.closest('ol')).not.toBeNull();
  });

  it('renders nested lists', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'unordered',
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Parent' }] },
          {
            type: 'list',
            format: 'unordered',
            children: [{ type: 'list-item', children: [{ type: 'text', text: 'Child' }] }],
          },
        ],
      },
    ]);
    const childLi = byText(container, 'Child')?.closest('li');
    const nestedUl = childLi?.closest('ul');
    const outerUl = nestedUl?.parentElement?.closest('ul');
    expect(outerUl).not.toBeNull();
  });

  it('applies cycling list-style-type for unordered lists based on indentLevel', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'unordered',
        indentLevel: 0,
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Level 0' }] },
          {
            type: 'list',
            format: 'unordered',
            indentLevel: 1,
            children: [
              { type: 'list-item', children: [{ type: 'text', text: 'Level 1' }] },
              {
                type: 'list',
                format: 'unordered',
                indentLevel: 2,
                children: [{ type: 'list-item', children: [{ type: 'text', text: 'Level 2' }] }],
              },
            ],
          },
        ],
      },
    ]);
    const uls = container.querySelectorAll('ul');
    expect(styleOf(uls[0])).toContain('list-style-type:disc');
    expect(styleOf(uls[1])).toContain('list-style-type:circle');
    expect(styleOf(uls[2])).toContain('list-style-type:square');
  });

  it('applies cycling list-style-type for ordered lists based on indentLevel', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'ordered',
        indentLevel: 0,
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Level 0' }] },
          {
            type: 'list',
            format: 'ordered',
            indentLevel: 1,
            children: [
              { type: 'list-item', children: [{ type: 'text', text: 'Level 1' }] },
              {
                type: 'list',
                format: 'ordered',
                indentLevel: 2,
                children: [{ type: 'list-item', children: [{ type: 'text', text: 'Level 2' }] }],
              },
            ],
          },
        ],
      },
    ]);
    const ols = container.querySelectorAll('ol');
    expect(styleOf(ols[0])).toContain('list-style-type:decimal');
    expect(styleOf(ols[1])).toContain('list-style-type:lower-alpha');
    expect(styleOf(ols[2])).toContain('list-style-type:upper-roman');
  });

  it('cycles list-style-type back to start after exhausting styles', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'unordered',
        indentLevel: 3,
        children: [{ type: 'list-item', children: [{ type: 'text', text: 'Level 3' }] }],
      },
    ]);
    expect(styleOf(container.querySelector('ul'))).toContain('list-style-type:disc');
  });

  it('defaults to indentLevel 0 when not provided', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'unordered',
        children: [{ type: 'list-item', children: [{ type: 'text', text: 'No indent' }] }],
      },
    ]);
    expect(styleOf(container.querySelector('ul'))).toContain('list-style-type:disc');
  });

  it('supports mixed ordered/unordered nested lists with indentLevel', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'unordered',
        indentLevel: 0,
        children: [
          { type: 'list-item', children: [{ type: 'text', text: 'Bullet' }] },
          {
            type: 'list',
            format: 'ordered',
            indentLevel: 1,
            children: [{ type: 'list-item', children: [{ type: 'text', text: 'Numbered' }] }],
          },
        ],
      },
    ]);
    expect(styleOf(container.querySelector('ul'))).toContain('list-style-type:disc');
    expect(styleOf(container.querySelector('ol'))).toContain('list-style-type:lower-alpha');
  });

  // ── To-do Lists ──────────────────────────────────────────────────

  it('renders to-do list with checkboxes', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'todo',
        children: [
          { type: 'list-item', checked: false, children: [{ type: 'text', text: 'Unchecked' }] },
          { type: 'list-item', checked: true, children: [{ type: 'text', text: 'Checked' }] },
        ],
      },
    ]);
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0].hasAttribute('checked')).toBe(false);
    expect(checkboxes[1].hasAttribute('checked')).toBe(true);
  });

  it('applies strikethrough and opacity to checked to-do items', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'todo',
        children: [
          { type: 'list-item', checked: true, children: [{ type: 'text', text: 'Done' }] },
        ],
      },
    ]);
    const span = byText(container, 'Done');
    expect(styleOf(span)).toContain('text-decoration:line-through');
    expect(styleOf(span)).toContain('opacity:0.6');
  });

  it('renders to-do list without bullet markers', async () => {
    const { container } = await render([
      {
        type: 'list',
        format: 'todo',
        children: [
          { type: 'list-item', checked: false, children: [{ type: 'text', text: 'Task' }] },
        ],
      },
    ]);
    expect(styleOf(container.querySelector('ul'))).toContain('list-style:none');
  });

  // ── Quote ────────────────────────────────────────────────────────

  it('renders blockquote', async () => {
    const { container } = await render([
      { type: 'quote', children: [{ type: 'text', text: 'Wise words' }] },
    ]);
    expect(byText(container, 'Wise words')?.closest('blockquote')).not.toBeNull();
  });

  // ── Code Block ───────────────────────────────────────────────────

  it('renders code block', async () => {
    const { container } = await render([
      { type: 'code', children: [{ type: 'text', text: 'const x = 1;' }] },
    ]);
    const code = container.querySelector('code');
    expect(code?.textContent).toBe('const x = 1;');
    expect(code?.closest('pre')).not.toBeNull();
  });

  // ── Image ────────────────────────────────────────────────────────

  it('renders images', async () => {
    const { container } = await render([
      {
        type: 'image',
        image: {
          url: 'https://example.com/img.png',
          alternativeText: 'An image',
          width: 200,
          height: 100,
        },
        children: [{ type: 'text', text: '' }],
      },
    ]);
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('An image');
    expect(img?.getAttribute('src')).toBe('https://example.com/img.png');
    expect(img?.getAttribute('width')).toBe('200');
    expect(img?.getAttribute('height')).toBe('100');
  });

  it('renders image with caption', async () => {
    const { container } = await render([
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        caption: 'A beautiful photo',
        children: [{ type: 'text', text: '' }],
      },
    ]);
    expect(container.querySelector('figcaption')?.textContent).toBe('A beautiful photo');
  });

  it('does not render figcaption when caption is empty', async () => {
    const { container } = await render([
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        children: [{ type: 'text', text: '' }],
      },
    ]);
    expect(container.querySelector('figcaption')).toBeNull();
  });

  it('renders image inside a figure element', async () => {
    const { container } = await render([
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        children: [{ type: 'text', text: '' }],
      },
    ]);
    expect(container.querySelector('figure')).not.toBeNull();
  });

  it('renders image with alignment', async () => {
    const { container } = await render([
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        imageAlign: 'left',
        children: [{ type: 'text', text: '' }],
      },
    ]);
    expect(styleOf(container.querySelector('figure'))).toContain('text-align:left');
  });

  it('defaults image alignment to center', async () => {
    const { container } = await render([
      {
        type: 'image',
        image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
        children: [{ type: 'text', text: '' }],
      },
    ]);
    expect(styleOf(container.querySelector('figure'))).toContain('text-align:center');
  });

  // ── Horizontal Line ──────────────────────────────────────────────

  it('renders horizontal line', async () => {
    const { container } = await render([
      { type: 'horizontal-line', children: [{ type: 'text', text: '' }] },
    ]);
    expect(container.querySelector('hr')).not.toBeNull();
  });

  // ── Text Alignment ───────────────────────────────────────────────

  it('renders paragraph with text alignment', async () => {
    const { container } = await render([
      { type: 'paragraph', textAlign: 'center', children: [{ type: 'text', text: 'Centered' }] },
    ]);
    expect(styleOf(container.querySelector('p'))).toContain('text-align:center');
  });

  it('renders heading with text alignment', async () => {
    const { container } = await render([
      {
        type: 'heading',
        level: 2,
        textAlign: 'right',
        children: [{ type: 'text', text: 'Right H2' }],
      },
    ]);
    expect(styleOf(container.querySelector('h2'))).toContain('text-align:right');
  });

  it('renders blockquote with text alignment', async () => {
    const { container } = await render([
      { type: 'quote', textAlign: 'center', children: [{ type: 'text', text: 'Centered quote' }] },
    ]);
    expect(styleOf(container.querySelector('blockquote'))).toContain('text-align:center');
  });

  it('does not apply textAlign style when not set', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Default' }] },
    ]);
    expect(container.querySelector('p')?.getAttribute('style')).toBeNull();
  });

  // ── Tables ───────────────────────────────────────────────────────

  it('renders a table with header and data cells', async () => {
    const { container } = await render([
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [
              { type: 'table-header-cell', children: [{ type: 'text', text: 'Name' }] },
              { type: 'table-header-cell', children: [{ type: 'text', text: 'Age' }] },
            ],
          },
          {
            type: 'table-row',
            children: [
              { type: 'table-cell', children: [{ type: 'text', text: 'Alice' }] },
              { type: 'table-cell', children: [{ type: 'text', text: '30' }] },
            ],
          },
        ],
      },
    ]);
    expect(container.querySelector('table')).not.toBeNull();
    expect(container.querySelectorAll('th')).toHaveLength(2);
    expect(container.querySelectorAll('td')).toHaveLength(2);
    expect(container.querySelector('th')?.textContent).toBe('Name');
    expect(container.querySelector('td')?.textContent).toBe('Alice');
  });

  it('renders table within tbody', async () => {
    const { container } = await render([
      {
        type: 'table',
        children: [
          {
            type: 'table-row',
            children: [{ type: 'table-cell', children: [{ type: 'text', text: 'Cell' }] }],
          },
        ],
      },
    ]);
    expect(container.querySelector('tbody')).not.toBeNull();
  });

  // ── Media Embed ──────────────────────────────────────────────────

  it('renders media embed as responsive iframe', async () => {
    const { container } = await render([
      {
        type: 'media-embed',
        url: 'https://www.youtube.com/embed/abc123',
        originalUrl: 'https://www.youtube.com/watch?v=abc123',
        children: [{ type: 'text', text: '' }],
      },
    ]);
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toBe('https://www.youtube.com/embed/abc123');
    expect(iframe?.hasAttribute('allowfullscreen')).toBe(true);
  });

  it('renders media embed wrapper with 16:9 aspect ratio', async () => {
    const { container } = await render([
      {
        type: 'media-embed',
        url: 'https://player.vimeo.com/video/12345',
        children: [{ type: 'text', text: '' }],
      },
    ]);
    const wrapper = container.querySelector('div');
    expect(styleOf(wrapper)).toContain('position:relative');
    expect(styleOf(wrapper)).toContain('padding-bottom:56.25%');
    expect(styleOf(wrapper)).toContain('height:0');
  });

  // ── Math (KaTeX) ─────────────────────────────────────────────────

  it('renders block math as a div.katex-block', async () => {
    const { container } = await render([
      { type: 'math', format: 'block', value: 'E = mc^2', children: [{ type: 'text', text: '' }] },
    ]);
    const block = container.querySelector('div.katex-block');
    expect(block).not.toBeNull();
    expect(block?.querySelector('.katex')).not.toBeNull();
    expect(block?.textContent).toContain('E = mc^2');
  });

  it('renders inline math as a span.katex-inline within a paragraph', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        children: [
          { type: 'text', text: 'Equation ' },
          {
            type: 'math',
            format: 'inline',
            value: 'a^2 + b^2 = c^2',
            children: [{ type: 'text', text: '' }],
          },
        ],
      },
    ]);
    const span = container.querySelector('span.katex-inline');
    expect(span).not.toBeNull();
    expect(span?.closest('p')).not.toBeNull();
    expect(span?.querySelector('.katex')).not.toBeNull();
  });

  it('renders inline math in non-display mode (no .katex-display wrapper)', async () => {
    const { container } = await render([
      { type: 'math', format: 'inline', value: 'x + y', children: [{ type: 'text', text: '' }] },
    ]);
    expect(container.querySelector('span.katex-inline')).not.toBeNull();
    expect(container.querySelector('.katex-display')).toBeNull();
  });

  it('renders block math in display mode (.katex-display wrapper)', async () => {
    const { container } = await render([
      {
        type: 'math',
        format: 'block',
        value: '\\frac{1}{2}',
        children: [{ type: 'text', text: '' }],
      },
    ]);
    expect(container.querySelector('.katex-display')).not.toBeNull();
  });

  it('uses custom math renderer with formula and inline props', async () => {
    const { container } = await render(
      [
        {
          type: 'paragraph',
          children: [
            {
              type: 'math',
              format: 'inline',
              value: '\\pi',
              children: [{ type: 'text', text: '' }],
            },
          ],
        },
        { type: 'math', format: 'block', value: '\\sum x', children: [{ type: 'text', text: '' }] },
      ],
      { blocks: { math: CustomMath } }
    );
    const els = container.querySelectorAll('[data-testid="custom-math"]');
    expect(els).toHaveLength(2);
    expect(els[0].getAttribute('data-formula')).toBe('\\pi');
    expect(els[0].getAttribute('data-inline')).toBe('true');
    expect(els[1].getAttribute('data-formula')).toBe('\\sum x');
    expect(els[1].getAttribute('data-inline')).toBe('false');
  });

  // ── Diagrams (Mermaid) ───────────────────────────────────────────

  it('renders a supported diagram to inline SVG on the server', async () => {
    const { container } = await render([
      {
        type: 'diagram',
        format: 'mermaid',
        value: 'graph TD\n  A[Start] --> B[End];',
        children: [{ type: 'text', text: '' }],
      },
    ]);
    const wrapper = container.querySelector('div.mermaid-diagram');
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector('svg')).not.toBeNull();
    expect(container.querySelector('pre.mermaid-source')).toBeNull();
  });

  it('falls back to raw source in a <pre> for unsupported diagram types', async () => {
    const { container } = await render([
      {
        type: 'diagram',
        format: 'mermaid',
        value: 'gantt\n  title A\n  section S\n  Task :a1, 2024-01-01, 30d',
        children: [{ type: 'text', text: '' }],
      },
    ]);
    const pre = container.querySelector('pre.mermaid-source');
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toContain('gantt');
    expect(container.querySelector('div.mermaid-diagram')).toBeNull();
  });

  it('uses a custom diagram renderer with code and format props', async () => {
    const { container } = await render(
      [
        {
          type: 'diagram',
          format: 'mermaid',
          value: 'graph TD\n  A --> B;',
          children: [{ type: 'text', text: '' }],
        },
      ],
      { blocks: { diagram: CustomDiagram } }
    );
    const el = container.querySelector('.custom-diagram');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('data-format')).toBe('mermaid');
    expect(el?.textContent).toContain('A --> B');
    expect(container.querySelector('div.mermaid-diagram')).toBeNull();
  });

  // ── Callouts (Admonitions) ───────────────────────────────────────

  it('renders a callout with the localized variant label and nested content', async () => {
    const { container } = await render([
      {
        type: 'callout',
        variant: 'warning',
        children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Be careful.' }] }],
      },
    ]);
    const aside = container.querySelector('aside.bb-callout.bb-callout-warning');
    expect(aside).not.toBeNull();
    expect(aside?.getAttribute('role')).toBe('note');
    expect(aside?.querySelector('.bb-callout-title')?.textContent).toContain('Warning');
    expect(aside?.querySelector('svg.bb-callout-icon')).not.toBeNull();
    expect(aside?.querySelector('.bb-callout-body p')?.textContent).toBe('Be careful.');
  });

  it('uses a custom title when provided', async () => {
    const { container } = await render([
      {
        type: 'callout',
        variant: 'tip',
        title: 'Pro tip',
        children: [{ type: 'paragraph', children: [{ type: 'text', text: 'x' }] }],
      },
    ]);
    expect(container.querySelector('.bb-callout-title')?.textContent).toContain('Pro tip');
  });

  it('uses a custom callout renderer with variant, title and children', async () => {
    const { container } = await render(
      [
        {
          type: 'callout',
          variant: 'important',
          title: 'Heads up',
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Body' }] }],
        },
      ],
      { blocks: { callout: CustomCallout } }
    );
    const el = container.querySelector('.custom-callout');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('data-variant')).toBe('important');
    expect(el?.getAttribute('data-title')).toBe('Heads up');
    expect(el?.textContent).toContain('Body');
    expect(container.querySelector('aside.bb-callout')).toBeNull();
  });

  // ── Details / Summary (Collapsible) ──────────────────────────────

  it('renders a details block with a summary and nested content', async () => {
    const { container } = await render([
      {
        type: 'details',
        summary: 'Click to expand',
        children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Hidden content.' }] }],
      },
    ]);
    const details = container.querySelector('details.bb-details');
    expect(details).not.toBeNull();
    // Closed by default when defaultOpen is omitted
    expect(details?.hasAttribute('open')).toBe(false);
    const summary = details?.querySelector('summary.bb-details-summary');
    expect(summary?.textContent).toBe('Click to expand');
    // Block children are rendered recursively inside the details
    expect(details?.querySelector('p')?.textContent).toBe('Hidden content.');
  });

  it('honors defaultOpen via the open attribute', async () => {
    const { container } = await render([
      {
        type: 'details',
        summary: 'Already open',
        defaultOpen: true,
        children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Visible.' }] }],
      },
    ]);
    expect(container.querySelector('details.bb-details')?.hasAttribute('open')).toBe(true);
  });

  it('supports arbitrarily nested details blocks', async () => {
    const { container } = await render([
      {
        type: 'details',
        summary: 'Outer',
        children: [
          {
            type: 'details',
            summary: 'Inner',
            children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Deep.' }] }],
          },
        ],
      },
    ]);
    const outer = container.querySelector('details.bb-details');
    const inner = outer?.querySelector('details.bb-details');
    expect(inner).not.toBeNull();
    expect(inner?.querySelector('summary')?.textContent).toBe('Inner');
    expect(inner?.querySelector('p')?.textContent).toBe('Deep.');
  });

  it('uses a custom details renderer with summary, defaultOpen and children', async () => {
    const { container } = await render(
      [
        {
          type: 'details',
          summary: 'More info',
          defaultOpen: true,
          children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Body' }] }],
        },
      ],
      { blocks: { details: CustomDetails } }
    );
    const el = container.querySelector('details.custom-details');
    expect(el).not.toBeNull();
    expect(el?.getAttribute('data-summary')).toBe('More info');
    expect(el?.hasAttribute('open')).toBe(true);
    expect(el?.textContent).toContain('Body');
    expect(container.querySelector('details.bb-details')).toBeNull();
  });

  // ── Text Modifiers: uppercase, superscript, subscript ────────────

  it('renders uppercase text', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'upper', uppercase: true }] },
    ]);
    expect(styleOf(byText(container, 'upper'))).toContain('text-transform:uppercase');
  });

  it('renders superscript text', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: '2', superscript: true }] },
    ]);
    expect(container.querySelector('sup')?.textContent).toBe('2');
  });

  it('renders subscript text', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'n', subscript: true }] },
    ]);
    expect(container.querySelector('sub')?.textContent).toBe('n');
  });

  // ── Text Marks: fontFamily, fontSize ─────────────────────────────

  it('renders text with fontFamily', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        children: [{ type: 'text', text: 'Serif', fontFamily: 'Georgia, serif' }],
      },
    ]);
    expect(styleOf(byText(container, 'Serif'))).toContain('font-family:Georgia,serif');
  });

  it('renders text with fontSize', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Big', fontSize: '24px' }] },
    ]);
    expect(styleOf(byText(container, 'Big'))).toContain('font-size:24px');
  });

  // ── Block Properties: lineHeight, indent ─────────────────────────

  it('renders paragraph with lineHeight', async () => {
    const { container } = await render([
      { type: 'paragraph', lineHeight: '1.8', children: [{ type: 'text', text: 'Spaced' }] },
    ]);
    expect(styleOf(container.querySelector('p'))).toContain('line-height:1.8');
  });

  it('renders heading with lineHeight', async () => {
    const { container } = await render([
      {
        type: 'heading',
        level: 2,
        lineHeight: '2.0',
        children: [{ type: 'text', text: 'Spaced H2' }],
      },
    ]);
    expect(styleOf(container.querySelector('h2'))).toContain('line-height:2.0');
  });

  it('renders paragraph with indent', async () => {
    const { container } = await render([
      { type: 'paragraph', indent: 2, children: [{ type: 'text', text: 'Indented' }] },
    ]);
    expect(styleOf(container.querySelector('p'))).toContain('margin-left:4rem');
  });

  it('renders block with combined textAlign, lineHeight, and indent', async () => {
    const { container } = await render([
      {
        type: 'paragraph',
        textAlign: 'center',
        lineHeight: '1.5',
        indent: 1,
        children: [{ type: 'text', text: 'Combined' }],
      },
    ]);
    const style = styleOf(container.querySelector('p'));
    expect(style).toContain('text-align:center');
    expect(style).toContain('line-height:1.5');
    expect(style).toContain('margin-left:2rem');
  });

  it('does not apply lineHeight or indent when not set', async () => {
    const { container } = await render([
      { type: 'paragraph', children: [{ type: 'text', text: 'Plain' }] },
    ]);
    expect(container.querySelector('p')?.getAttribute('style')).toBeNull();
  });

  // ── Custom Block Renderers ───────────────────────────────────────

  it('uses custom paragraph renderer', async () => {
    const { container } = await render(
      [{ type: 'paragraph', children: [{ type: 'text', text: 'Custom' }] }],
      { blocks: { paragraph: CustomParagraph } }
    );
    expect(container.querySelector('[data-testid="custom-p"]')).not.toBeNull();
    expect(byText(container, 'Custom')).not.toBeNull();
  });

  it('uses custom heading renderer', async () => {
    const { container } = await render(
      [{ type: 'heading', level: 2, children: [{ type: 'text', text: 'Title' }] }],
      { blocks: { heading: CustomHeading } }
    );
    expect(container.querySelector('[data-testid="heading-2"]')).not.toBeNull();
  });

  it('uses custom link renderer', async () => {
    const { container } = await render(
      [
        {
          type: 'paragraph',
          children: [
            {
              type: 'link',
              url: 'https://example.com',
              children: [{ type: 'text', text: 'Link' }],
            },
          ],
        },
      ],
      { blocks: { link: CustomLink } }
    );
    expect(container.querySelector('[data-testid="custom-link"]')?.getAttribute('href')).toBe(
      'https://example.com'
    );
  });

  it('uses custom horizontal-line renderer', async () => {
    const { container } = await render(
      [{ type: 'horizontal-line', children: [{ type: 'text', text: '' }] }],
      { blocks: { 'horizontal-line': CustomHr } }
    );
    expect(container.querySelector('[data-testid="custom-hr"]')).not.toBeNull();
  });

  it('uses custom media-embed renderer', async () => {
    const { container } = await render(
      [
        {
          type: 'media-embed',
          url: 'https://www.youtube.com/embed/abc',
          originalUrl: 'https://www.youtube.com/watch?v=abc',
          children: [{ type: 'text', text: '' }],
        },
      ],
      { blocks: { 'media-embed': CustomEmbed } }
    );
    expect(container.querySelector('[data-testid="custom-embed"]')).not.toBeNull();
  });

  it('uses custom table renderers', async () => {
    const { container } = await render(
      [
        {
          type: 'table',
          children: [
            {
              type: 'table-row',
              children: [
                { type: 'table-header-cell', children: [{ type: 'text', text: 'Header' }] },
              ],
            },
            {
              type: 'table-row',
              children: [{ type: 'table-cell', children: [{ type: 'text', text: 'Data' }] }],
            },
          ],
        },
      ],
      {
        blocks: {
          table: CustomTable,
          'table-row': CustomRow,
          'table-header-cell': CustomTh,
          'table-cell': CustomTd,
        },
      }
    );
    expect(container.querySelector('[data-testid="custom-table"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-testid="custom-row"]')).toHaveLength(2);
    expect(container.querySelector('[data-testid="custom-th"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="custom-td"]')).not.toBeNull();
  });

  it('uses custom image renderer with caption and alignment', async () => {
    const { container } = await render(
      [
        {
          type: 'image',
          image: { url: 'https://example.com/img.png', alternativeText: 'Photo' },
          caption: 'My caption',
          imageAlign: 'right',
          children: [{ type: 'text', text: '' }],
        },
      ],
      { blocks: { image: CustomImage } }
    );
    const el = container.querySelector('[data-testid="custom-img"]');
    expect(el?.getAttribute('data-caption')).toBe('My caption');
    expect(el?.getAttribute('data-align')).toBe('right');
  });

  // ── Custom Modifier Renderers ────────────────────────────────────

  it('uses custom bold modifier', async () => {
    const { container } = await render(
      [{ type: 'paragraph', children: [{ type: 'text', text: 'Bold', bold: true }] }],
      { modifiers: { bold: CustomBold } }
    );
    expect(container.querySelector('[data-testid="custom-bold"]')).not.toBeNull();
  });

  it('uses custom color modifier', async () => {
    const { container } = await render(
      [{ type: 'paragraph', children: [{ type: 'text', text: 'Colored', color: '#FF0000' }] }],
      { modifiers: { color: CustomColor } }
    );
    expect(
      container.querySelector('[data-testid="custom-color"]')?.getAttribute('data-color')
    ).toBe('#FF0000');
  });

  it('uses custom backgroundColor modifier', async () => {
    const { container } = await render(
      [
        {
          type: 'paragraph',
          children: [{ type: 'text', text: 'Highlighted', backgroundColor: '#FFFF00' }],
        },
      ],
      { modifiers: { backgroundColor: CustomBg } }
    );
    expect(container.querySelector('[data-testid="custom-bg"]')).not.toBeNull();
  });
});
