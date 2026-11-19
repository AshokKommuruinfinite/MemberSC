import React, { useMemo, useState } from 'react';
import currentContent from './generated/content.json';
import baselineContent from './generated/baseline.json';

const NAV = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'coverage', label: 'My Coverage', icon: 'shield' },
  { id: 'doctors', label: 'Find Care', icon: 'heart' },
  { id: 'records', label: 'Health Records', icon: 'activity' },
  { id: 'messages', label: 'Messages', icon: 'message' },
  { id: 'resources', label: 'My Resources', icon: 'folder' },
  { id: 'wellness', label: 'Wellness', icon: 'sparkles' },
];
const PATHS = {
  overview: 'Home', coverage: 'MyCoverage', doctors: 'MyDoctor',
  records: 'MyHealthRecord', messages: 'MyMessages', resources: 'MyResources', wellness: 'MyWellness'
};
const LABELS = { overview: 'Overview', coverage: 'My Coverage', doctors: 'Find Care', records: 'Health Records', messages: 'Messages', resources: 'My Resources', wellness: 'Wellness', changes: 'Change Preview' };
const ICON_D = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
  heart: <><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></>,
  activity: <><path d="M3 12h4l3-6 4 12 3-6h4"/></>,
  message: <><path d="M20 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.95L3 21l1.95-4.5a9 9 0 0 1-.95-4A8.5 8.5 0 1 1 20 11.5Z"/></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></>,
  sparkles: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16ZM5 2l.7 1.8L7.5 4.5l-1.8.7L5 7l-.7-1.8-1.8-.7 1.8-.7L5 2Z"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  down: <path d="m6 9 6 6 6-6"/>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4"/></>,
  file: <><path d="M6 2h8l5 5v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"/><path d="M14 2v6h5M9 12h6M9 16h6"/></>,
  link: <><path d="M10 13a5 5 0 0 0 8.5 1l2-2a5 5 0 0 0-7-7l-1.2 1.2M14 11a5 5 0 0 0-8.5-1l-2 2a5 5 0 0 0 7 7l1.2-1.2"/></>,
  arrow: <><path d="M4 12h16m-7-7 7 7-7 7"/></>,
  check: <path d="m4 12 5 5L20 6"/>,
  close: <path d="M5 5l14 14M19 5 5 19"/>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  compare: <><rect x="3" y="4" width="8" height="16" rx="2"/><rect x="13" y="4" width="8" height="16" rx="2"/><path d="M7 8h1M17 8h1"/></>,
  circleCheck: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7h.01"/></>,
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,
};
function Icon({ name, size = 20, strokeWidth = 1.9, className = '' }) { return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICON_D[name] || ICON_D.file}</svg>; }

const pretty = (value) => String(value || '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]/g, ' ').replace(/\b(Market Place)\b/gi, 'Marketplace').replace(/\s+/g, ' ').trim();
function getFile(content, name) { return content.files.find(f => f.path.toLowerCase() === name.toLowerCase()); }
function getPairs(content) {
  const pairs = new Map();
  for (const f of content.files) {
    const m = f.path.match(/^MyResources\/(Documents|HelpfulLinks)\/([^/]+)\/([^/]+)\/(en|es)\.json$/i);
    if (m) pairs.set(`${m[2]}|${m[3]}`, { state: m[2], plan: m[3] });
  }
  return [...pairs.values()].sort((a,b) => a.state.localeCompare(b.state) || a.plan.localeCompare(b.plan));
}
function getResource(content, kind, state, plan, lang) {
  const path = `MyResources/${kind}/${state}/${plan}/${lang}.json`;
  const file = getFile(content, path);
  const raw = file?.data?.fields?.itemLevelList || file?.data?.itemLevelList || [];
  const items = Array.isArray(raw) ? raw.map((item, index) => {
    const o = typeof item === 'string' ? { id: item } : (item || {});
    const suffix = String(o.id || `item-${index}`).split('-').slice(-1)[0];
    return { ...o, id: String(o.id || `${kind}-${index}`), label: o.label || o.title || o.displayName || o.name || pretty(suffix), kind, sourcePath: file?.path || path };
  }) : [];
  return { items, path: file?.path || path, exists: Boolean(file) };
}
function getSection(content, section, lang) {
  const file = getFile(content, `${section}/${lang}.json`) || getFile(content, `${section}/en.json`);
  return { heading: file?.data?.heading || pretty(section), description: file?.data?.description || '', path: file?.path || `${section}/${lang}.json`, fields: file?.data?.fields || {} };
}
function getChanges(base, now) {
  const before = new Map(base.files.map(f => [f.path, f.data]));
  const after = new Map(now.files.map(f => [f.path, f.data]));
  const all = [...new Set([...before.keys(), ...after.keys()])].sort();
  return all.flatMap(name => {
    const b = before.get(name), a = after.get(name);
    if (b === undefined) return [{ name, type: 'added', before: null, after: a }];
    if (a === undefined) return [{ name, type: 'removed', before: b, after: null }];
    if (JSON.stringify(b) !== JSON.stringify(a)) return [{ name, type: 'updated', before: b, after: a }];
    return [];
  });
}
function resourceChangeCounts(before, after, kind, state, plan, locale) {
  const a = getResource(before, kind, state, plan, locale).items;
  const b = getResource(after, kind, state, plan, locale).items;
  const prev = new Map(a.map(i => [i.id, i]));
  const current = new Map(b.map(i => [i.id, i]));
  const added = b.filter(i => !prev.has(i.id));
  const removed = a.filter(i => !current.has(i.id));
  const updated = b.filter(i => prev.has(i.id) && JSON.stringify(prev.get(i.id)) !== JSON.stringify(i));
  return { added, removed, updated };
}

function App() {
  const options = useMemo(() => getPairs(currentContent), []);
  const initial = options.find(p => p.state.toUpperCase() === 'CA' && p.plan.toLowerCase() === 'marketplace') || options.find(p => p.state.toUpperCase() === 'TX' && p.plan.toLowerCase() === 'marketplace') || options[0] || {state:'CA',plan:'MarketPlace'};
  const [state, setState] = useState(initial.state);
  const [plan, setPlan] = useState(initial.plan);
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('overview');
  const [tab, setTab] = useState('Documents');
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBefore, setShowBefore] = useState(false);
  const [showAllDiff, setShowAllDiff] = useState(false);
  const [notice, setNotice] = useState('');
  const states = [...new Set(options.map(p => p.state))];
  const availablePlans = options.filter(p => p.state === state).map(p => p.plan);
  const content = showBefore ? baselineContent : currentContent;
  const docs = getResource(content, 'Documents', state, plan, lang);
  const links = getResource(content, 'HelpfulLinks', state, plan, lang);
  const diffs = useMemo(() => getChanges(baselineContent, currentContent), []);
  const currentDocs = getResource(currentContent, 'Documents', state, plan, lang);
  const currentLinks = getResource(currentContent, 'HelpfulLinks', state, plan, lang);
  const activeResource = tab === 'Documents' ? docs : links;
  const filteredResources = activeResource.items.filter(i => `${i.label} ${i.id}`.toLowerCase().includes(search.toLowerCase()));
  const section = getSection(content, PATHS[page] || 'Home', lang);
  const resourceSection = getSection(content, 'MyResources', lang);
  const changeCounts = resourceChangeCounts(baselineContent, currentContent, tab, state, plan, lang);
  function go(next) { setPage(next); setMobileOpen(false); setSearch(''); setDetail(null); }
  function pickState(next) { setState(next); setPlan(options.find(o => o.state === next)?.plan || 'MarketPlace'); setSearch(''); }
  function showToast(text) { setNotice(text); window.setTimeout(() => setNotice(''), 2800); }
  const sectionNames = [
    { id:'coverage', tag:'YOUR BENEFITS', icon:'shield', description: 'Coverage details and plan information', className:'ink' },
    { id:'doctors', tag:'CARE NETWORK', icon:'heart', description: 'Find doctors and care resources', className:'blue' },
    { id:'records', tag:'YOUR HEALTH', icon:'activity', description: 'Your health records and documents', className:'coral' },
  ];

  return <div className="app-shell">
    {mobileOpen && <button className="overlay" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><Icon name="shield" size={23}/></div><div><div className="brand-name">member<span>space</span></div><div className="brand-sub">MEMBERSC EXPERIENCE</div></div></div>
      <div className="sidebar-label">YOUR PORTAL</div>
      <nav className="nav-links" aria-label="Member portal navigation">
        {NAV.map(i => <button key={i.id} onClick={() => go(i.id)} className={`nav-link ${page === i.id ? 'active' : ''}`}><Icon name={i.icon} size={20}/><span>{i.label}</span>{i.id === 'resources' && <span className="nav-counter">{currentDocs.items.length + currentLinks.items.length}</span>}</button>)}
      </nav>
      <div className="sidebar-divider"/>
      <div className="sidebar-label">DEMO TOOLS</div>
      <button className={`nav-link secondary ${page === 'changes' ? 'active' : ''}`} onClick={() => go('changes')}><Icon name="compare" size={20}/><span>Change Preview</span>{diffs.length > 0 && <span className="nav-new">{diffs.length}</span>}</button>
      <div className="sidebar-spacer"/>
      <div className="sidebar-help"><div className="help-symbol"><Icon name="sparkles" size={20}/></div><div className="help-title">Built to demonstrate change.</div><p>One JSON change. One browser refresh. A clear before and after.</p><button onClick={() => go('changes')}>View change preview <Icon name="arrow" size={15}/></button></div>
      <div className="sidebar-foot"><span className="status-dot"/><span>Frontend-only demo</span><span className="sidebar-foot-version">v1.0</span></div>
    </aside>

    <main className="main-pane">
      <header className="topbar">
        <div className="topbar-left"><button className="mobile-menu" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Icon name="menu"/></button><span className="crumb-muted">Member Portal</span><Icon name="chevron" size={15} className="crumb-arrow"/><span className="crumb-active">{LABELS[page]}</span></div>
        <div className="topbar-right"><span className={`source-pill ${currentContent.source === 'repository' ? 'real' : ''}`}><span className="status-dot"/>{currentContent.source === 'repository' ? 'Connected to MemberSC JSON' : 'Sample JSON mode'}</span><div className="topbar-rule"/><button className="locale-switch" onClick={() => setLang(lang === 'en' ? 'es' : 'en')} aria-label="Change language"><Icon name="globe" size={17}/>{lang.toUpperCase()} <Icon name="down" size={14}/></button><div className="avatar">M</div></div>
      </header>
      <div className="content">
        <div className="context-strip"><div><span className="eyebrow">MEMBER EXPERIENCE</span><span className="strip-divider"/><span className="context-label">A simple, connected experience for your members</span></div><span className="demo-label">INTERACTIVE UI DEMO</span></div>
        {(page === 'overview') && <>
          <section className="hero"><div className="hero-content"><div className="hero-eyebrow"><span className="hero-dot"/> YOUR MEMBER EXPERIENCE, REIMAGINED</div><h1>Healthcare, made<br/><em>beautifully simple.</em></h1><p>All your plan essentials, helpful resources, and important documents in one welcoming place.</p><div className="hero-actions"><button className="primary-button" onClick={() => go('resources')}>Explore my resources <Icon name="arrow" size={18}/></button><span className="hero-action-note"><Icon name="circleCheck" size={16}/> No backend required</span></div></div><div className="hero-visual"><div className="hero-graphic"><div className="graphic-float small one"><Icon name="heart" size={18}/></div><div className="graphic-center"><div className="graphic-icon"><Icon name="shield" size={46}/></div><strong>Everything in<br/>one place.</strong><span>YOUR PLAN · YOUR WAY</span></div><div className="graphic-float small two"><Icon name="file" size={18}/></div><div className="graphic-label"><Icon name="check" size={15}/> Everything organized</div></div></div></section>
          <section className="quick-overview"><div className="section-heading"><div><span className="eyebrow blue-eyebrow">AT A GLANCE</span><h2>Good to have you here.</h2><p>Start with what matters most to you.</p></div><button className="text-action" onClick={() => go('resources')}>See all resources <Icon name="arrow" size={16}/></button></div><div className="stats-row"><div className="stat-card"><div className="stat-icon teal"><Icon name="file" size={22}/></div><div><strong>{currentDocs.items.length.toString().padStart(2,'0')}</strong><span>Plan documents</span></div><button aria-label="Open documents" className="stat-link" onClick={() => { setTab('Documents');go('resources'); }}><Icon name="arrow" size={17}/></button></div><div className="stat-card"><div className="stat-icon peach"><Icon name="link" size={22}/></div><div><strong>{currentLinks.items.length.toString().padStart(2,'0')}</strong><span>Helpful links</span></div><button aria-label="Open helpful links" className="stat-link" onClick={() => { setTab('HelpfulLinks');go('resources'); }}><Icon name="arrow" size={17}/></button></div><div className="stat-card"><div className="stat-icon lavender"><Icon name="layers" size={22}/></div><div><strong>{options.length.toString().padStart(2,'0')}</strong><span>Plan configurations</span></div><button aria-label="Choose plan" className="stat-link" onClick={() => go('resources')}><Icon name="arrow" size={17}/></button></div></div></section>
          <section className="explore-section"><div className="section-heading"><div><span className="eyebrow blue-eyebrow">FIND YOUR WAY</span><h2>What can we help you with?</h2><p>Navigate your plan with confidence.</p></div></div><div className="explore-grid">{sectionNames.map(s => <button onClick={() => go(s.id)} key={s.id} className="explore-card"><div className={`explore-icon ${s.className}`}><Icon name={s.icon} size={27}/></div><div className="explore-name">{LABELS[s.id]}</div><div className="explore-desc">{getSection(content, PATHS[s.id], lang).description || s.description}</div><span className="explore-arrow"><Icon name="arrow" size={18}/></span></button>)}</div></section>
          <div className="source-note"><Icon name="info" size={17}/><span>Resource lists and section headings come from JSON. Changes committed to <code>MemberPortal/Data/content</code> appear after pulling your branch.</span></div>
        </>}

        {page === 'resources' && <>
          <div className="page-head"><div><span className="eyebrow blue-eyebrow">RESOURCES & SUPPORT</span><h1>{resourceSection.heading}<span className="head-dot">.</span></h1><p>{resourceSection.description || "Important information for your plan, thoughtfully organized."}</p></div><div className="page-head-icon"><Icon name="folder" size={31}/></div></div>
          <div className="resource-toolbar"><div className="toolbar-intro"><span className="toolbar-overline">VIEWING RESOURCES FOR</span><strong>{pretty(plan)} <span className="toolbar-mid">/</span> {state.toUpperCase()}</strong></div><div className="toolbar-selects"><label>State<select aria-label="State" value={state} onChange={e => pickState(e.target.value)}>{states.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}</select></label><label>Plan type<select aria-label="Plan type" value={plan} onChange={e=> {setPlan(e.target.value);setSearch('');}}>{availablePlans.map(p=><option key={p} value={p}>{pretty(p)}</option>)}</select></label></div></div>
          <div className="resource-tabs-row"><div className="resource-tabs"><button className={tab==='Documents'?'selected':''} onClick={() => {setTab('Documents');setSearch('');}}><Icon name="file" size={18}/>Documents <span>{docs.items.length}</span></button><button className={tab==='HelpfulLinks'?'selected':''} onClick={() => {setTab('HelpfulLinks');setSearch('');}}><Icon name="link" size={18}/>Helpful Links <span>{links.items.length}</span></button></div><button className={`toggle-before ${showBefore?'is-before':''}`} onClick={() => setShowBefore(!showBefore)}><Icon name="compare" size={17}/>{showBefore?'Showing baseline':'Preview baseline'}</button></div>
          <div className="results-header"><div><h2>{tab==='Documents'?'Your plan documents':'Helpful resources'}</h2><p>{tab==='Documents'?'Find documents you may need for your plan.':'Browse helpful information and useful links.'}</p></div><div className="search-box"><Icon name="search" size={18}/><input aria-label="Search resources" value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${tab==='Documents'?'documents':'links'}...`}/></div></div>
          {activeResource.exists ? <div className="resource-grid">{filteredResources.map((item,i) => <button className="resource-card" key={`${item.id}-${i}`} onClick={()=>setDetail(item)}><div className={`resource-icon ${tab==='Documents'?'doc-icon':'link-icon'}`}><Icon name={tab==='Documents'?'file':'link'} size={25}/></div><div className="resource-card-body"><span className="resource-card-category">{tab==='Documents'?'PLAN DOCUMENT':'HELPFUL LINK'}</span><h3>{item.label}</h3><p>{tab==='Documents'?'View document information':'View helpful resource details'}</p></div><div className="resource-card-arrow"><Icon name="arrow" size={18}/></div></button>)}</div> : <div className="empty-state"><Icon name="folder" size={32}/><h3>No configuration found</h3><p>The selected plan does not have a {tab.toLowerCase()} JSON file for {lang.toUpperCase()}.</p></div>}
          {activeResource.exists && filteredResources.length===0 && <div className="empty-state"><Icon name="search" size={27}/><h3>No matching resources</h3><p>Try a different search.</p></div>}
          <div className="config-source"><div className="config-icon"><Icon name="layers" size={20}/></div><div><strong>Connected configuration</strong><p>{currentContent.contentDirectory}/{activeResource.path}</p></div><div className="config-tag"><span className="status-dot"/> {showBefore?'Baseline':(currentContent.source==='repository'?'Live JSON':'Sample JSON')}</div></div>
          {(changeCounts.added.length + changeCounts.removed.length + changeCounts.updated.length > 0) && <div className="changes-hint"><Icon name="sparkles" size={19}/><div><strong>We found changes in this resource list</strong><span>{changeCounts.added.length} added · {changeCounts.removed.length} removed · {changeCounts.updated.length} updated since baseline</span></div><button onClick={() => go('changes')}>Compare <Icon name="arrow" size={16}/></button></div>}
        </>}

        {page === 'changes' && <>
          <div className="page-head"><div><span className="eyebrow blue-eyebrow">SENZAI DEMONSTRATION</span><h1>See the difference<span className="head-dot">.</span></h1><p>Real changes to JSON, made visible. No backend or manual UI updates.</p></div><div className="page-head-icon"><Icon name="compare" size={31}/></div></div>
          <div className="change-banner"><div className="banner-badge"><Icon name="sparkles" size={20}/></div><div><strong>From Jira story to visible change</strong><p>Capture the original JSON, approve the SenzAI commit, pull your branch, and compare what changed.</p></div><span className="banner-live">LIVE COMPARISON</span></div>
          <div className="change-summary"><div><span>Changed JSON files</span><strong>{diffs.length}</strong></div><div><span>New files</span><strong>{diffs.filter(d=>d.type==='added').length}</strong></div><div><span>Updated files</span><strong>{diffs.filter(d=>d.type==='updated').length}</strong></div><div><span>Removed files</span><strong>{diffs.filter(d=>d.type==='removed').length}</strong></div></div>
          <div className="compare-heading"><div><h2>Configuration changes</h2><p>Comparing your saved baseline with your current local files.</p></div><button className="outline-btn" onClick={() => setShowAllDiff(!showAllDiff)}>{showAllDiff?'Show fewer details':'Show JSON details'}<Icon name="down" size={15}/></button></div>
          {diffs.length===0 ? <div className="empty-state diff-empty"><div className="empty-success"><Icon name="check" size={27}/></div><h3>All caught up. No changes yet.</h3><p>Run <code>npm run baseline</code>, make a SenzAI JSON change, and pull your GitHub branch to see before and after.</p></div> : <div className="diff-list">{diffs.map(d=><div key={d.name} className="diff-row"><div className="diff-row-main"><div className={`diff-symbol ${d.type}`}><Icon name={d.type==='removed'?'close':d.type==='added'?'check':'file'} size={19}/></div><div><strong>{d.name}</strong><span>{d.type==='updated'?'JSON content was modified':d.type==='added'?'New JSON configuration':'JSON file was removed'}</span></div><div className={`diff-badge ${d.type}`}>{d.type}</div></div>{showAllDiff && <div className="diff-json"><div><span>BEFORE</span><pre>{d.before?JSON.stringify(d.before,null,2):'Not present'}</pre></div><div><span>AFTER</span><pre>{d.after?JSON.stringify(d.after,null,2):'Not present'}</pre></div></div>}</div>)}</div>}
          <div className="demo-steps"><div className="step"><span>01</span><strong>Run original UI</strong><small>npm run dev</small></div><Icon name="arrow" size={18}/><div className="step"><span>02</span><strong>Save baseline</strong><small>npm run baseline</small></div><Icon name="arrow" size={18}/><div className="step"><span>03</span><strong>SenzAI + GitHub</strong><small>Approve JSON commit</small></div><Icon name="arrow" size={18}/><div className="step"><span>04</span><strong>Pull & refresh</strong><small>See UI changes</small></div></div>
        </>}

        {!['overview','resources','changes'].includes(page) && <>
          <div className="page-head"><div><span className="eyebrow blue-eyebrow">YOUR MEMBER PORTAL</span><h1>{section.heading}<span className="head-dot">.</span></h1><p>{section.description || `Explore your ${LABELS[page].toLowerCase()} information.`}</p></div><div className="page-head-icon"><Icon name={NAV.find(n=>n.id===page)?.icon || 'folder'} size={31}/></div></div>
          <div className="section-hero"><div className="section-decor"><Icon name={NAV.find(n=>n.id===page)?.icon || 'folder'} size={31}/></div><div><span className="eyebrow">YOUR DIGITAL MEMBER EXPERIENCE</span><h2>Everything you need, where you need it.</h2><p>This section's heading and description come from your MemberSC JSON configuration. More details can be added as Jira stories.</p><button className="primary-button" onClick={()=>go('resources')}>Explore plan resources <Icon name="arrow" size={17}/></button></div></div>
          <div className="section-details"><div className="detail-mini"><Icon name="file" size={22}/><div><span>Configuration source</span><strong>{section.path}</strong></div></div><div className="detail-mini"><Icon name="globe" size={22}/><div><span>Language</span><strong>{lang==='en'?'English':'Spanish'}</strong></div></div><div className="detail-mini"><Icon name="circleCheck" size={22}/><div><span>Implementation</span><strong>JSON-driven React UI</strong></div></div></div>
          <div className="source-note"><Icon name="info" size={17}/><span>This is a frontend-only demonstration. No real member records or live insurance services are connected.</span></div>
        </>}
        <footer className="page-footer"><span>© 2026 Infinite Confidential</span><span>MemberSC · Frontend-only proof of concept</span></footer>
      </div>
    </main>
    {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><div className="detail-modal" role="dialog" aria-modal="true" aria-label="Resource details" onClick={e=>e.stopPropagation()}><button className="modal-close" aria-label="Close" onClick={() => setDetail(null)}><Icon name="close"/></button><div className={`modal-icon ${detail.kind==='Documents'?'doc-icon':'link-icon'}`}><Icon name={detail.kind==='Documents'?'file':'link'} size={27}/></div><span className="eyebrow blue-eyebrow">{detail.kind==='Documents'?'PLAN DOCUMENT':'HELPFUL RESOURCE'}</span><h2>{detail.label}</h2><p className="modal-blurb">This item is displayed directly from your MemberSC JSON configuration.</p><div className="modal-metadata"><span>JSON item ID</span><code>{detail.id}</code><span>Source file</span><code>{detail.sourcePath}</code></div>{(detail.href || detail.url) && /^https?:\/\//.test(detail.href || detail.url) ? <a className="primary-button modal-action" href={detail.href || detail.url} target="_blank" rel="noreferrer">Open resource <Icon name="arrow" size={16}/></a> : <button className="primary-button modal-action" onClick={()=>showToast('Resource details are available. No document download URL is configured in JSON.')}>Got it <Icon name="check" size={16}/></button>}</div></div>}
    {notice && <div className="toast"><Icon name="circleCheck" size={18}/>{notice}</div>}
  </div>;
}
export default App;
