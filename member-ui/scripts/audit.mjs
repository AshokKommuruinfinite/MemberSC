import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncContent, getContentDirectory } from './sync-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let errors = 0;
let warnings = 0;
function fail(message) { errors++; console.error('FAIL:', message); }
function warn(message) { warnings++; console.warn('WARN:', message); }
function pass(message) { console.log('PASS:', message); }

const needed = ['package.json','index.html','vite.config.mjs','src/main.jsx','src/App.jsx',
  'src/styles.css','scripts/sync-content.mjs','scripts/capture-baseline.mjs',
  'START_UI_WINDOWS.bat','START_UI_MAC_LINUX.sh','sample-content'];
for (const name of needed) {
  if (!fs.existsSync(path.join(root,name))) fail('Missing required file/folder: ' + name);
}
if (!errors) pass('Required frontend files and launch scripts exist');

let content;
try { content = syncContent({silent:true}); } catch (e) { fail('JSON sync failed: ' + e.message); }
if (content) {
  const dir = getContentDirectory();
  let total = 0;
  const walk = folder => {
    for (const entry of fs.readdirSync(folder,{withFileTypes:true})) {
      const file = path.join(folder,entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.toLowerCase().endsWith('.json')) {
        total++;
        try { JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'')); }
        catch(e) { fail('Invalid JSON ' + path.relative(dir,file) + ': ' + e.message); }
      }
    }
  };
  walk(dir);
  pass(`${total} JSON files scanned; ${content.files.length} loaded`);
  if (total !== content.files.length) fail(`Sync silently skipped ${total-content.files.length} JSON files`);
  if (content.source !== 'repository') warn('Demo is using sample JSON; MemberSC repository content was not found beside member-ui');
  const resourceFiles = content.files.filter(f=>/^(MyResources\/)(Documents|HelpfulLinks)\/[^/]+\/[^/]+\/(en|es)\.json$/i.test(f.path));
  if (!resourceFiles.length) warn('No matching MyResources Documents/HelpfulLinks plan files; resource cards may appear empty');
  else pass(`${resourceFiles.length} state/plan resource list JSON files matched`);
  for (const f of resourceFiles) {
    const list = f.data?.fields?.itemLevelList ?? f.data?.itemLevelList;
    if (!Array.isArray(list)) warn(`No itemLevelList array in ${f.path}; UI will show no resource cards there`);
    else if (list.some(i=>i === null || (typeof i !== 'object' && typeof i !== 'string'))) warn(`Unexpected list item type in ${f.path}`);
  }
  try {
    const baseline = JSON.parse(fs.readFileSync(path.join(root,'src/generated/baseline.json'),'utf8'));
    if (baseline.source !== content.source || baseline.contentDirectory !== content.contentDirectory)
      warn('Baseline has a different JSON source; run npm run baseline before SenzAI changes');
    else pass('Baseline matches the selected data source');
  } catch(e) { fail('Cannot read the saved baseline: ' + e.message); }
}
console.log(`\nAudit result: ${errors} error(s), ${warnings} warning(s)`);
if (errors) process.exitCode = 1;
