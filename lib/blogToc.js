/**
 * Extract ## / ### headings from markdown for table of contents and anchor ids.
 * @param {string} markdown
 * @returns {{ depth: 2 | 3, text: string, id: string }[]}
 */
export function extractMarkdownToc(markdown) {
  const lines = String(markdown || '').split(/\r?\n/);
  const items = [];
  const used = new Map();

  for (const raw of lines) {
    const line = raw.trim();
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;

    const depth = /** @type {2 | 3} */ (match[1].length);
    let title = match[2].replace(/\s+#+\s*$/, '').trim();
    title = title.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
    title = title.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    if (!title) continue;

    let base = slugifyTitle(title);
    if (!base) base = 'section';

    let id = base;
    let n = 1;
    while (used.has(id)) {
      n += 1;
      id = `${base}-${n}`;
    }
    used.set(id, true);
    items.push({ depth, text: title, id });
  }

  return items;
}

export function slugifyTitle(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
