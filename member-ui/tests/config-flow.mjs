import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const originalRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(),'membersc-ui-config-test-'));
try {
  const repo = path.join(sandbox,'MemberSC');
  const ui = path.join(repo,'member-ui');
  const scripts = path.join(ui,'scripts');
  const content = path.join(repo,'MemberPortal','Data','content');
  const resource = path.join(content,'MyResources','Documents','CA','MarketPlace','en.json');
  const structure = {fields:{itemLevelList:[{id:'plan-handbook',label:'Member Handbook'}]}};
  fs.mkdirSync(path.dirname(resource),{recursive:true});
  fs.mkdirSync(scripts,{recursive:true});
  fs.writeFileSync(resource, JSON.stringify(structure));
  fs.copyFileSync(path.join(originalRoot,'scripts','sync-content.mjs'),path.join(scripts,'sync-content.mjs'));
  fs.copyFileSync(path.join(originalRoot,'scripts','capture-baseline.mjs'),path.join(scripts,'capture-baseline.mjs'));
  fs.writeFileSync(path.join(ui,'package.json'),' {"type":"module"} ');
  const run = script => {
    const r = spawnSync(process.execPath,[path.join(scripts,script)],{cwd:ui,encoding:'utf8'});
    if (r.status !== 0) throw new Error(`${script} failed: ${r.stderr} ${r.stdout}`);
  };
  const read = name => JSON.parse(fs.readFileSync(path.join(ui,'src','generated',name),'utf8'));
  run('sync-content.mjs');
  assert.equal(read('content.json').source,'repository','must select actual MemberPortal JSON over bundled sample');
  assert.equal(read('content.json').files[0].data.fields.itemLevelList.length,1);
  run('capture-baseline.mjs');
  const savedBaseline = JSON.stringify(read('baseline.json'));
  structure.fields.itemLevelList.push({id:'plan-formulary',label:'Formulary'});
  fs.writeFileSync(resource, JSON.stringify(structure));
  run('sync-content.mjs');
  assert.equal(read('content.json').files[0].data.fields.itemLevelList.length,2,'current JSON must update');
  assert.equal(JSON.stringify(read('baseline.json')),savedBaseline,'original baseline must remain unchanged');
  fs.unlinkSync(resource);
  run('sync-content.mjs');
  assert.equal(read('content.json').files.length,0,'removed files must disappear from manifest');
  console.log('PASS: repository discovery, initial baseline, updated JSON, preserved before-state, removed JSON');
} finally {fs.rmSync(sandbox,{recursive:true,force:true});}
