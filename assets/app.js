const toggle = document.querySelector('#lang-toggle');
const translated = [...document.querySelectorAll('[data-en]')];
const images = [...document.querySelectorAll('[data-en-alt]')];
const chinese = new Map(translated.map(node=>[node,node.textContent]));
const originalAlt = new Map(images.map(node=>[node,node.alt]));
function setLanguage(language) {
  const en = language === 'en';
  document.documentElement.lang = en ? 'en' : 'zh-CN';
  translated.forEach(node=>{node.textContent = en ? node.dataset.en : chinese.get(node);});
  images.forEach(node=>{node.alt = en ? node.dataset.enAlt : originalAlt.get(node);});
  toggle.textContent = en ? '中文' : 'EN';
  toggle.setAttribute('aria-label',en ? '切换为中文' : 'Switch to English');
  toggle.setAttribute('aria-pressed',String(en));
  document.querySelector('meta[name="description"]').content = en
    ? 'Software, tools, and experiments by GPDdev. Browse projects, screenshots, and source code.'
    : 'GPDdev 的软件、工具与实验。浏览项目截图、用途介绍与源代码。';
  try { localStorage.setItem('dev-language',en ? 'en' : 'zh-CN'); } catch {}
}
let saved = 'zh-CN';
try { saved = localStorage.getItem('dev-language') || saved; } catch {}
setLanguage(saved);
toggle.addEventListener('click',()=>setLanguage(document.documentElement.lang === 'en' ? 'zh-CN' : 'en'));
