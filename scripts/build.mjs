import { readFile, writeFile, mkdir, cp, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const root = fileURLToPath(new URL('../', import.meta.url));
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const sortedProjects = (projects, stars) => [...projects].sort((a, b) => stars[b.repo] - stars[a.repo] || a.repo.toLowerCase().localeCompare(b.repo.toLowerCase(), 'en'));
const pair = (values, tag = 'span', attributes = '') => '<' + tag + ' ' + attributes + ' data-en="' + escapeHTML(values[1]) + '">' + escapeHTML(values[0]) + '</' + tag + '>';

export async function fetchStars(projects, request = fetch) {
  const headers = {Accept: 'application/vnd.github+json', 'User-Agent': 'GPDdev-project-showcase'};
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = 'Bearer ' + token;
  const entries = [];
  for (const {repo} of projects) {
    const response = await request('https://api.github.com/repos/GPDdev/' + encodeURIComponent(repo), {headers, signal: AbortSignal.timeout(20000)});
    if (!response.ok) throw new Error(repo + ': GitHub returned ' + response.status + '. Existing snapshot and deployed site are unchanged.');
    const data = await response.json();
    if (data.full_name?.toLowerCase() !== ('GPDdev/' + repo).toLowerCase() || !Number.isSafeInteger(data.stargazers_count) || data.stargazers_count < 0) throw new Error('Invalid GitHub response for ' + repo);
    entries.push([repo, data.stargazers_count]);
  }
  return {checkedAt: new Date().toISOString(), stars: Object.fromEntries(entries)};
}

const drawings = {
  relay: '<svg viewBox="0 0 600 330"><g fill="none" stroke="#9ab5eb" stroke-width="3"><path d="M60 225H280M280 225H390V155H520M390 225H520M390 225V295H520"/><circle cx="60" cy="225" r="13"/><rect x="252" y="197" width="56" height="56" rx="12" fill="#e7eeff"/><circle cx="520" cy="155" r="11"/><circle cx="520" cy="225" r="11"/><circle cx="520" cy="295" r="11"/></g><path d="m268 225 8 8 16-18" fill="none" stroke="#243c7b" stroke-width="4"/></svg><span class="art-title">AGI<br>Relay</span><span class="art-note">One endpoint. Multiple models.</span>',
  metro: '<svg viewBox="0 0 600 330"><g fill="none" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"><path stroke="#ca4d34" d="M-30 75H175L300 200H630"/><path stroke="#395a4a" d="M60 370V240L240 60H500"/><path stroke="#d5a448" d="M-30 285H180L345 120H630"/></g><g fill="#fbf5e8" stroke="#293e35" stroke-width="4"><circle cx="155" cy="75" r="9"/><circle cx="222" cy="122" r="12"/><circle cx="300" cy="200" r="12"/><circle cx="440" cy="200" r="9"/><circle cx="385" cy="60" r="9"/><circle cx="60" cy="285" r="12"/><circle cx="470" cy="120" r="9"/></g></svg><span class="art-title">SHANGHAI<br>METRO</span><span class="art-note">Routes, connected.</span>',
  iasr: '<div class="radar"><i></i><i></i><i></i><b class="blip b1"></b><b class="blip b2"></b><b class="blip b3"></b></div><span class="art-title">IASR</span><span class="art-note">Perception → events → evidence</span>',
  bronymap: '<div class="map-grid"><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="art-title">Near.<br>Never exact.</span><span class="art-note">10 km / 25 km</span>',
  jinke: '<div class="journal-sheet"><span>今刻</span><p>把这一刻，<br>留给自己。</p><i></i><i></i><i></i></div><span class="art-note">A little space for now.</span>',
  mentor: '<div class="match-path"><span>YOU</span><i></i><span>RESEARCH</span><i></i><span>MENTOR</span></div><span class="art-title">Find your<br>next chapter.</span><span class="art-note">Evidence before inference.</span>',
  advisor: '<div class="community"><i></i><i></i><i></i><i></i><i></i><strong>QQ</strong></div><span class="art-title">People.<br>Purpose.<br>Community.</span>',
  faculty: '<div class="data-sheet"><div><b>FACULTY</b><span>↗</span></div><p>Affiliation</p><i></i><p>Research</p><i></i><p>Publications</p><i></i></div><span class="art-title">Academic<br>connections.</span>'
};

export function renderCard(project, index, stars) {
  const {id, repo, title, desc, kind, tags, image, imageSource, imageKind, imageCredit, imageCreditUrl, alt, website, qqGroup} = project;
  const url = 'https://github.com/GPDdev/' + repo;
  const visual = image
    ? '<img src="assets/projects/' + escapeHTML(image) + '" alt="' + escapeHTML(alt[0]) + '" data-en-alt="' + escapeHTML(alt[1]) + '" loading="lazy" decoding="async">'
    : drawings[id];
  if (!visual) throw new Error('Missing artwork: ' + id);
  const caption = image ? '<a class="image-credit" href="' + escapeHTML(imageCreditUrl || url + '/blob/main/' + imageSource) + '">' + pair(imageCredit || (imageKind === 'cover' ? ['项目原图 ↗','Project artwork ↗'] : ['README 截图 ↗','README screenshot ↗'])) + '</a>' : '';
  return '<article class="project-card theme-' + id + '" data-repo="' + escapeHTML(repo) + '" data-stars="' + stars[repo] + '">\n' +
    '  <div class="project-art' + (image ? ' has-image' : '') + '">' + (image ? visual : '<div class="drawing" aria-hidden="true">' + visual + '</div>') + caption + '</div>\n' +
    '  <div class="project-body"><div class="card-meta"><span class="project-number">' + String(index + 1).padStart(2,'0') + '</span>' + pair(kind) + '<span class="stars" aria-label="' + stars[repo] + ' GitHub stars"><span aria-hidden="true">☆</span> ' + stars[repo] + '</span></div>\n' +
    pair(title, 'h3') + pair(desc, 'p', 'class="project-description"') +
    '<ul class="tags" aria-label="Technologies">' + tags.map(t=>'<li>'+escapeHTML(t)+'</li>').join('') + '</ul>' +
    (qqGroup ? '<p class="project-community">' + pair(['QQ 交流群','QQ group']) + '<strong>' + escapeHTML(qqGroup) + '</strong></p>' : '') +
    '<div class="project-links"><a href="' + url + '">GitHub <span aria-hidden="true">↗</span></a>' +
    (website ? '<a href="' + escapeHTML(website) + '">' + pair(['访问网站','Open site']) + ' <span aria-hidden="true">↗</span></a>' : '') + '</div></div>\n</article>';
}

export async function build(refresh = false) {
  const projects = JSON.parse(await readFile(resolve(root,'data/projects.json'),'utf8'));
  if (new Set(projects.map(p=>p.repo)).size !== projects.length) throw new Error('Duplicate repositories');
  for (const p of projects) {
    if (!/^[A-Za-z0-9_.-]+$/.test(p.repo) || !/^[a-z]+$/.test(p.id)) throw new Error('Invalid project identifier');
    for (const field of ['title','kind','desc']) if (!Array.isArray(p[field]) || p[field].length !== 2 || p[field].some(x=>typeof x !== 'string' || !x)) throw new Error('Missing bilingual ' + field + ': ' + p.repo);
    for (const link of [p.website, p.imageCreditUrl].filter(Boolean)) if (new URL(link).protocol !== 'https:') throw new Error('Expected HTTPS project link');
    if (p.image) await access(resolve(root,'assets/projects',p.image));
  }
  const snapshot = refresh ? await fetchStars(projects) : JSON.parse(await readFile(resolve(root,'data/stars.json'),'utf8'));
  for (const p of projects) if (!Number.isSafeInteger(snapshot.stars[p.repo]) || snapshot.stars[p.repo] < 0) throw new Error('Missing valid star count: ' + p.repo);
  if (!Number.isFinite(Date.parse(snapshot.checkedAt))) throw new Error('Invalid snapshot date');
  let html = await readFile(resolve(root,'index.html'),'utf8');
  const replaceBlock = (name, value) => {
    const expression = new RegExp('<!-- ' + name + ':start -->[\\s\\S]*?<!-- ' + name + ':end -->');
    if (!expression.test(html)) throw new Error('Missing generated block: ' + name);
    html = html.replace(expression, () => '<!-- ' + name + ':start -->' + value + '<!-- ' + name + ':end -->');
  };
  replaceBlock('projects', '\n' + sortedProjects(projects,snapshot.stars).map((p,i)=>renderCard(p,i,snapshot.stars)).join('\n') + '\n');
  replaceBlock('count', String(projects.length).padStart(2,'0'));
  replaceBlock('updated', '<time datetime="' + snapshot.checkedAt + '">' + new Date(snapshot.checkedAt).toLocaleDateString('en-CA',{timeZone:'Asia/Shanghai'}) + '</time>');
  if (refresh) await writeFile(resolve(root,'data/stars.json'),JSON.stringify(snapshot,null,2)+'\n');
  await writeFile(resolve(root,'index.html'),html);
  await mkdir(resolve(root,'dist'),{recursive:true});
  for (const file of ['index.html','assets','icon.png','CNAME']) await cp(resolve(root,file),resolve(root,'dist',file),{recursive:true});
  await mkdir(resolve(root,'dist/data'),{recursive:true});
  await cp(resolve(root,'data/stars.json'),resolve(root,'dist/data/stars.json'));
  await writeFile(resolve(root,'dist/.nojekyll'),'');
  console.log('Built ' + projects.length + ' projects, sorted by stars. Snapshot: ' + snapshot.checkedAt);
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  build(process.argv.includes('--refresh')).catch(error=>{console.error(error.message);process.exitCode=1;});
}
