import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

const cleanScriptTag = (html) =>
  html.replace(/<script[^>]*src="script\.js"[^>]*><\/script>/i, '');

export const loadPage = (fileName) => {
  const filePath = path.join(ROOT_DIR, `${fileName}.html`);
  const raw = fs.readFileSync(filePath, 'utf8');
  const titleMatch = raw.match(/<title>([^<]*)<\/title>/i);
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

  const title = titleMatch ? titleMatch[1].trim() : 'Lazy Girls Tax';
  const body = bodyMatch ? cleanScriptTag(bodyMatch[1]) : cleanScriptTag(raw);

  return { title, body };
};
