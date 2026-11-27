import http from 'node:http';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const revision=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const root=fileURLToPath(new URL('./',import.meta.url));
const origin='http://127.0.0.1:4183',token=crypto.randomBytes(24).toString('hex');
const pages=[['Startseite','/'],['Suche und Filter','/search'],['Region Zürich','/escort-zurich'],['Region Zug','/orte/zug'],['Region Genève','/escort-geneva'],['Clubs und Studios','/clubs'],['Echtes Profil','/profile/ch-f62306bf1ed6'],['Profile vergleichen','/compare-escorts'],['Merkliste','/favorites'],['Portalvergleich','/reviews'],['and6 Einzelbericht','/reviews/and6'],['Preise verstehen','/pricing'],['Sicherheit und Vertrauen','/safety'],['So funktioniert es','/how-it-works'],['Für Anbieter','/advertise'],['Zugang vorbereiten','/register'],['Anmelden','/login'],['Arbeitsbereich','/creator-dashboard'],['Profilentwurf','/create-post'],['Meldungen und Korrekturen','/report']];
const filename=i=>`${String(i+1).padStart(2,'0')}-desktop-mobile.jpg`;
const options=pages.map(([name],i)=>`<option value="${i}">${String(i+1).padStart(2,'0')} · ${name}</option>`).join('');
function stage(i,customHeight){const [name,path]=pages[i],height=customHeight|| (i===0?2500:i<6?2000:1680);return `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>${name} – Desktop und Mobile</title><style>*{box-sizing:border-box}body{margin:0;width:1406px;background:#130e19;color:#fff3ea;font:16px system-ui}.top{height:106px;padding:22px 24px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #513043}.top h1{font-size:26px;margin:0 0 6px}.top p{margin:0;color:#c4abbc;font-size:13px}.badge{font-size:12px;border:1px solid #81563d;border-radius:50px;padding:10px;color:#e4c395}.grid{display:grid;grid-template-columns:960px 390px;gap:16px;padding:16px 20px}.label{height:36px;color:#ff76a8;letter-spacing:.12em;font-size:12px;font-weight:700}.view{height:${height}px;overflow:hidden;border:1px solid #4b2a3c;border-radius:12px;background:#100e16}iframe{border:0;display:block;transform-origin:0 0}#desktop{width:1440px;height:${height*1.5}px;transform:scale(.6666666667)}#mobile{width:390px;height:${height}px}.end{height:40px;padding:0 20px;color:#c4abbc;font-size:11px}</style></head><body><header class="top"><div><h1>${String(i+1).padStart(2,'0')} · ${name}</h1><p>iwantsexnow.ch${path==='/'?'':path} · Swiss Night 2027 · lokaler Build · 27.11.2026</p></div><span class="badge">Isolierter Branch · nicht produktiv</span></header><div class="grid"><section><div class="label">DESKTOP · 1440 PX</div><div class="view"><iframe id="desktop" src="http://127.0.0.1:4181${path}" title="Desktop"></iframe></div></section><section><div class="label">MOBILE · 390 PX</div><div class="view"><iframe id="mobile" src="http://127.0.0.1:4181${path}" title="Mobile"></iframe></div></section></div><div class="end">Originalansichten · Längere Seiten setzen sich unterhalb des aufgenommenen Ausschnitts fort · Keine Demo-Profile</div></body></html>`;}
function saver(){return `<!doctype html><html lang="de"><meta charset="utf-8"><title>Lokaler Screenshot-Export</title><body><h1>Lokaler Screenshot-Export</h1><p>Speichert ausschliesslich JPEG-Aufnahmen im lokalen Screenshot-Ordner.</p><form><label>Seite<select name="page">${options}</select></label><label>Screenshotdaten<textarea name="image" rows="5" cols="60"></textarea></label><input type="hidden" name="token" value="${token}"><button>Screenshot speichern</button></form><p role="status">Bereit</p><script>document.querySelector('form').addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget;document.querySelector('[role=status]').textContent='Speichert';try{const response=await fetch('/save',{method:'POST',body:new URLSearchParams(new FormData(form))});const result=await response.json();document.querySelector('[role=status]').textContent=response.ok?'Gespeichert: '+result.file:'Fehler: '+result.error;}catch{document.querySelector('[role=status]').textContent='Fehler beim Speichern';}});</script></body></html>`;}
const server=http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('X-Content-Type-Options','nosniff');
 const url=new URL(req.url,origin);
 if(req.method==='POST'&&url.pathname==='/save'){
  if(req.headers.origin!==origin){res.writeHead(403);return res.end();}
  let text='';for await(const chunk of req){text+=chunk;if(text.length>12000000){res.writeHead(413);return res.end();}}
  const data=new URLSearchParams(text),i=Number(data.get('page'));
  if(data.get('token')!==token||!Number.isInteger(i)||!pages[i]){res.writeHead(400);return res.end();}
  const bytes=Buffer.from(data.get('image')||'','base64');
  if(bytes[0]!==255||bytes[1]!==216||bytes.length<1000){res.writeHead(400,{'Content-Type':'application/json'});return res.end(JSON.stringify({error:'Invalid JPEG'}));}
  const file=filename(i);await fs.writeFile(root+file,bytes);res.writeHead(200,{'Content-Type':'application/json'});return res.end(JSON.stringify({file,size:bytes.length}));
 }
 if(req.method!=='GET'){res.writeHead(405);return res.end();}
 if(url.pathname==='/device'){
  const i=Number(url.searchParams.get('page')||0),width=Number(url.searchParams.get('width')||390);
  if(!pages[i]||![320,390,768,1024,1440].includes(width)){res.writeHead(400);return res.end();}
  res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});
  return res.end(`<!doctype html><html><head><meta charset="utf-8"><title>Responsive test ${width}</title><style>body{margin:0;background:#0d0d16}iframe{width:${width}px;height:844px;border:0;display:block}</style></head><body><iframe id="device" title="Website ${width}px" src="http://127.0.0.1:4181${pages[i][1]}"></iframe></body></html>`);
 }
 if(url.pathname==='/save'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});return res.end(saver());}
 const i=Number(url.searchParams.get('page')||0);
 if(url.pathname==='/'&&Number.isInteger(i)&&pages[i]){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});const requestedHeight=Number(url.searchParams.get("height"));return res.end(stage(i,[844,1000,1400].includes(requestedHeight)?requestedHeight:undefined));}
 res.writeHead(404);res.end();
});
server.listen(4183,'127.0.0.1',()=>console.log('Local screenshot stage: '+origin));
await fs.writeFile(root+'manifest.json',JSON.stringify(pages.map(([name,path],i)=>({number:i+1,name,path,file:filename(i),desktopWidth:1440,mobileWidth:390,source:'http://127.0.0.1:4181'+path,scope:'upper page excerpt',branch:'feat/swiss-night-v2-20261127',commit:revision})),null,2));
