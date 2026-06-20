import type { ButtonFile, ButtonStyle, InlineNode, StyleValue, TextNode } from './types';

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

// ── Button (CTA / File Download) ─────────────────────────────────────

// Emoji icons keyed by file extension (falls back to a MIME-type group, then a
// generic paperclip). Mirrors the icon mapping in the editor's button modal.
const FILE_ICONS: Record<string, string> = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  txt: '📃',
  md: '📃',
  rtf: '📃',
  xls: '📊',
  xlsx: '📊',
  csv: '📊',
  ppt: '📽️',
  pptx: '📽️',
  zip: '🗜️',
  rar: '🗜️',
  '7z': '🗜️',
  gz: '🗜️',
  tar: '🗜️',
  png: '🖼️',
  jpg: '🖼️',
  jpeg: '🖼️',
  gif: '🖼️',
  svg: '🖼️',
  webp: '🖼️',
  mp3: '🎵',
  wav: '🎵',
  ogg: '🎵',
  mp4: '🎬',
  mov: '🎬',
  avi: '🎬',
  webm: '🎬',
};

/** Emoji icon for a file, by extension then MIME group, with a generic fallback. */
export function getFileIcon(file: ButtonFile): string {
  const ext = (file.ext ?? '').replace(/^\./, '').toLowerCase();
  if (ext && FILE_ICONS[ext]) return FILE_ICONS[ext];

  const mime = file.mime ?? '';
  if (mime.startsWith('image/')) return '🖼️';
  if (mime.startsWith('audio/')) return '🎵';
  if (mime.startsWith('video/')) return '🎬';
  if (mime === 'application/pdf') return '📄';
  return '📎';
}

/** Human-readable byte size, e.g. 5242880 → "5 MB". */
export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  const rounded = i === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[i]}`;
}

/**
 * Builds the inline style object for a button. Sensible defaults keep an
 * unstyled button looking like a button; hover colors can't be expressed
 * inline, so they're exposed as `--bb-button-hover-*` custom properties for the
 * scoped stylesheet (or consumer CSS) to wire up.
 */
export function getButtonStyle(style?: ButtonStyle): StyleValue {
  const out: Record<string, string> = {
    display: 'inline-block',
    textDecoration: 'none',
    cursor: 'pointer',
  };
  if (!style) return out;
  // Mirror the base colors into custom properties too, so the scoped `:hover`
  // rule can fall back to them when no hover color is set (otherwise an unset
  // hover var would compute to `transparent`/inherited on hover).
  if (style.backgroundColor) {
    out.backgroundColor = style.backgroundColor;
    out['--bb-button-bg'] = style.backgroundColor;
  }
  if (style.textColor) {
    out.color = style.textColor;
    out['--bb-button-color'] = style.textColor;
  }
  if (style.borderRadius) out.borderRadius = style.borderRadius;
  if (style.fontSize) out.fontSize = style.fontSize;
  if (style.fontWeight) out.fontWeight = style.fontWeight;
  if (style.padding) out.padding = style.padding;
  if (style.border) out.border = style.border;
  if (style.hoverBackgroundColor) out['--bb-button-hover-bg'] = style.hoverBackgroundColor;
  if (style.hoverTextColor) out['--bb-button-hover-color'] = style.hoverTextColor;
  return out;
}
