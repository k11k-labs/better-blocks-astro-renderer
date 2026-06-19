import type { InlineNode, StyleValue, TextNode } from './types';

// ── Block Style ──────────────────────────────────────────────────────

/**
 * Builds the inline style object for a block that supports alignment,
 * line-height, and indentation. Returns `undefined` when no style applies so
 * the element renders without a `style` attribute.
 */
export function getBlockStyle(block: {
  textAlign?: string;
  lineHeight?: string;
  indent?: number;
}): StyleValue | undefined {
  const style: Record<string, string> = {};
  if (block.textAlign) style.textAlign = block.textAlign;
  if (block.lineHeight) style.lineHeight = block.lineHeight;
  if (block.indent) style.marginLeft = `${block.indent * 2}rem`;
  return Object.keys(style).length > 0 ? style : undefined;
}

// ── Plain Text Extraction ────────────────────────────────────────────

export function getPlainText(children: InlineNode[]): string {
  return children
    .map((child) => {
      if (child.type === 'text') return child.text;
      if (child.type === 'link') return child.children.map((t) => t.text).join('');
      return '';
    })
    .join('');
}

// ── List Style Cycling ───────────────────────────────────────────────

const orderedStyles = ['decimal', 'lower-alpha', 'upper-roman'];
const unorderedStyles = ['disc', 'circle', 'square'];

export function getListStyleType(format: 'ordered' | 'unordered', indentLevel: number): string {
  const styles = format === 'ordered' ? orderedStyles : unorderedStyles;
  return styles[indentLevel % styles.length];
}

// ── Text Modifiers (Marks) ───────────────────────────────────────────

export type Mark = { name: string; value?: string };

/**
 * Returns the active marks for a text node in outer → inner order. This mirrors
 * the React renderer, which applies modifiers inside-out (`fontSize` ends up the
 * outermost wrapper and `code` the innermost), so the visual nesting matches.
 */
export function buildTextMarks(node: TextNode): Mark[] {
  const marks: Mark[] = [];
  if (node.fontSize) marks.push({ name: 'fontSize', value: node.fontSize });
  if (node.fontFamily) marks.push({ name: 'fontFamily', value: node.fontFamily });
  if (node.backgroundColor) marks.push({ name: 'backgroundColor', value: node.backgroundColor });
  if (node.color) marks.push({ name: 'color', value: node.color });
  if (node.bold) marks.push({ name: 'bold' });
  if (node.italic) marks.push({ name: 'italic' });
  if (node.uppercase) marks.push({ name: 'uppercase' });
  if (node.underline) marks.push({ name: 'underline' });
  if (node.strikethrough) marks.push({ name: 'strikethrough' });
  if (node.superscript) marks.push({ name: 'superscript' });
  if (node.subscript) marks.push({ name: 'subscript' });
  if (node.code) marks.push({ name: 'code' });
  return marks;
}

/**
 * The default HTML tag and inline style used to render a given mark when no
 * custom modifier component is supplied.
 */
export function getDefaultMarkRender(mark: Mark): { tag: string; style?: StyleValue } {
  switch (mark.name) {
    case 'code':
      return { tag: 'code' };
    case 'subscript':
      return { tag: 'sub' };
    case 'superscript':
      return { tag: 'sup' };
    case 'strikethrough':
      return { tag: 'del' };
    case 'underline':
      return { tag: 'span', style: { textDecoration: 'underline' } };
    case 'uppercase':
      return { tag: 'span', style: { textTransform: 'uppercase' } };
    case 'italic':
      return { tag: 'em' };
    case 'bold':
      return { tag: 'strong' };
    case 'color':
      return { tag: 'span', style: { color: mark.value } };
    case 'backgroundColor':
      return { tag: 'span', style: { backgroundColor: mark.value } };
    case 'fontFamily':
      return { tag: 'span', style: { fontFamily: mark.value } };
    case 'fontSize':
      return { tag: 'span', style: { fontSize: mark.value } };
    default:
      return { tag: 'span' };
  }
}

/**
 * The prop object passed to a custom modifier component for a given mark. Value
 * marks (color/background/font) forward their value; boolean marks pass nothing.
 */
export function getModifierProps(mark: Mark): Record<string, string> {
  if (mark.value === undefined) return {};
  return { [mark.name]: mark.value };
}
