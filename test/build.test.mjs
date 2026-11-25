import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { sortedProjects, fetchStars, renderCard, escapeHTML, root } from '../scripts/build.mjs';
const projects = JSON.parse(await readFile(root + 'data/projects.json','utf8'));
test('all 18 unique projects, requested removals, no IASR pin',()=>{
  assert.equal(projects.length,18);
  assert.equal(new Set(projects.map(p=>p.repo)).size,18);
  for (const name of ['screenanswer','mentor-match','jinke','University-faculty-information-system-demo-','TongjiTap','StrideTune','LiveCue','hanhua','learn.hachile.org','tjwild.hachile.org','agi.hachile.org','DayChime']) assert.ok(projects.some(p=>p.repo===name));
  assert.ok(!projects.some(p=>/Lithium|Mars-Base|GHCollege/.test(p.repo)));
  const sample = [{repo:'IASR'},{repo:'Alpha'},{repo:'Zebra'}];
  assert.deepEqual(sortedProjects(sample,{IASR:1,Alpha:1,Zebra:5}).map(p=>p.repo),['Zebra','Alpha','IASR']);
  assert.deepEqual(sample.map(p=>p.repo),['IASR','Alpha','Zebra']);
});
test('star refresh fails closed on errors or invalid counts',async()=>{
  const p = [{repo:'one'}];
  const response = data => async()=>({ok:true,json:async()=>data});
  assert.equal((await fetchStars(p,response({full_name:'GPDdev/one',stargazers_count:0}))).stars.one,0);
  await assert.rejects(fetchStars(p,async()=>({ok:false,status:403})),/403/);
  for(const count of [undefined,-1,'5',NaN]) await assert.rejects(fetchStars(p,response({full_name:'GPDdev/one',stargazers_count:count})),/Invalid/);
  await assert.rejects(fetchStars(p,response({full_name:'other/one',stargazers_count:1})),/Invalid/);
});
test('cards have bilingual text, safe markup, sources and unique art',()=>{
  assert.equal(escapeHTML('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
  for(const p of projects) {
    const html=renderCard(p,0,{[p.repo]:0});
    assert.match(html,/data-en=/);
    assert.ok(html.includes('https://github.com/GPDdev/'+p.repo));
    assert.ok(!html.includes('featured'));
    if(p.image) assert.ok(html.includes(p.imageCreditUrl || '/blob/main/'+p.imageSource));
  }
});
