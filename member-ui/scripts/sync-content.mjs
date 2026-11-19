import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The UI is intended to be added as /member-ui in the MemberSC repository root.
// A few older sample repo layouts used lowercase data; accept either without changing files.
const candidates = [
  path.resolve(root, '..', 'MemberPortal', 'Data', 'content'),
  path.resolve(root, '..', 'MemberPortal', 'data', 'content'),
  path.resolve(root, '..', 'data', 'content'),
];
const repoContent = candidates.find((candidate) => fs.existsSync(candidate));
const fixtureContent = path.join(root, 'sample-content');
const out = path.join(root, 'src', 'generated');

export function getContentDirectory() {
  return repoContent || fixtureContent;
}

function readFiles(dir, relative = '', files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a,b) => a.name.localeCompare(b.name))) {
    const name = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) readFiles(path.join(dir, entry.name), name, files);
    else if (entry.isFile() && entry.name.endsWith('.json')) {
      const fullPath = path.join(dir, entry.name);
      try {
        files.push({ path: name, data: JSON.parse(fs.readFileSync(fullPath, 'utf8')) });
      } catch (err) {
        console.warn(`[MemberSC] Invalid JSON skipped: ${name}: ${err.message}`);
      }
    }
  }
  return files;
}

export function syncContent({ silent = false } = {}) {
  const contentDir = getContentDirectory();
  if (!fs.existsSync(contentDir)) throw new Error(`Missing JSON folder: ${contentDir}`);
  const isRepository = Boolean(repoContent) && contentDir === repoContent;
  const payload = {
    source: isRepository ? 'repository' : 'sample',
    contentDirectory: isRepository ? path.relative(path.resolve(root, '..'), contentDir).split(path.sep).join('/') : 'member-ui/sample-content',
    files: readFiles(contentDir)
  };
  fs.mkdirSync(out, { recursive: true });
  const output = path.join(out, 'content.json');
  const content = JSON.stringify(payload, null, 2) + '\n';
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== content) fs.writeFileSync(output, content);
  const baseline = path.join(out, 'baseline.json');
  // On first integration into an actual MemberSC checkout, start with a clean baseline.
  // Do not compare repository content with bundled sample data.
  let staleBaseline = !fs.existsSync(baseline);
  if (!staleBaseline) {
    try {
      const old = JSON.parse(fs.readFileSync(baseline, 'utf8'));
      staleBaseline = old.source !== payload.source || old.contentDirectory !== payload.contentDirectory;
    } catch { staleBaseline = true; }
  }
  if (staleBaseline) fs.writeFileSync(baseline, content);
  if (!silent) console.log(`[MemberSC] Loaded ${payload.files.length} ${payload.source} JSON files from ${contentDir}`);
  return payload;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) syncContent();
