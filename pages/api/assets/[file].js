import fs from 'fs';
import path from 'path';

const allowedFiles = new Set(['lazy_girls_hero.jpg', 'logo.jpg', 'script.js']);

const contentTypes = {
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript'
};

export default function handler(req, res) {
  const { file } = req.query;

  if (!file || Array.isArray(file) || !allowedFiles.has(file)) {
    res.status(404).send('Not found');
    return;
  }

  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    res.status(404).send('Not found');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = contentTypes[ext] || 'application/octet-stream';

  res.setHeader('Content-Type', contentType);
  res.send(fs.readFileSync(filePath));
}
