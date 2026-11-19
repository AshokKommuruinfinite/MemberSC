import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncContent } from './sync-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
syncContent();
fs.copyFileSync(path.join(root, 'src/generated/content.json'), path.join(root, 'src/generated/baseline.json'));
console.log('[MemberSC] Baseline captured. Run SenzAI, pull the branch, then open Change Preview to compare.');
