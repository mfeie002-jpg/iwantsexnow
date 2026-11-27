// Compress paired 1440px desktop and 390px mobile acceptance screenshots.
// Read-only transformation; does not touch the source screenshots.
const fs = require('node:fs');
const path = require('node:path');
const {createRequire} = require('node:module');
const loadNext = createRequire(require.resolve('next/package.json'));
const sharp = loadNext('sharp');

const source = path.resolve('output/flagship-v3/40-screens');
const dest = path.resolve('docs/preview/flagship-v3');
fs.mkdirSync(dest,{recursive:true});
const pages = [
 ['01-start','Startseite'],['02-search','Suche'],['03-profile-example','Beispielprofil'],
 ['04-regions','Regionen'],['05-zurich','Zuerich'],['06-categories','Kategorien'],
 ['07-massage','Massage'],['08-tantra','Tantra'],['09-studios','Studios'],
 ['10-high-class','High-Class'],['11-available','Jetzt frei'],
 ['12-portal-comparison','Portalvergleich'],['13-guide','Ratgeber'],
 ['14-pricing','Preise'],['15-safety','Sicherheit'],['16-provider','Anbieter'],
 ['17-login','Login'],['18-entry','Eintrag'],['19-report','Melden'],['20-about','Ueber uns']
];

const sanitize = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const cardFiles=[];
(async()=>{
 for(const [filename,label] of pages){
  const pc=path.join(source,filename+'-desktop.png');
  const phone=path.join(source,filename+'-mobile.png');
  if(!fs.existsSync(pc)||!fs.existsSync(phone))throw Error('Missing screenshot '+filename);
  const desktop=await sharp(pc).resize({width:900,height:563,fit:'contain',background:'#fff8f6'}).png().toBuffer();
  const mobile=await sharp(phone).resize({width:280,height:607,fit:'contain',background:'#fff8f6'}).png().toBuffer();
  const headings=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1230" height="70"><rect width="1230" height="70" fill="#281328"/><text x="22" y="30" font-family="Arial" font-size="21" fill="#ffffff" font-weight="bold">'+sanitize(label)+'</text><text x="22" y="52" font-family="Arial" font-size="13" fill="#ff9bbe">Desktop 1440 · Mobile 390 · Flagship V3</text></svg>');
  const out=path.join(dest,filename+'.jpg');
  await sharp({create:{width:1230,height:680,channels:3,background:'#fff8f6'}})
   .composite([{input:headings,left:0,top:0},{input:desktop,left:12,top:78},{input:mobile,left:934,top:73}])
   .jpeg({quality:80,mozjpeg:true}).toFile(out);
  cardFiles.push(out);
 }
 const tiles=[];
 for(let i=0;i<cardFiles.length;i++){
  tiles.push({input:await sharp(cardFiles[i]).resize(380,210,{fit:'cover',position:'north'}).jpeg({quality:76}).toBuffer(),left:12+(i%4)*391,top:55+Math.floor(i/4)*224});
 }
 const title=Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1590" height="50"><rect width="1590" height="50" fill="#281328"/><text x="20" y="31" fill="#ffffff" font-family="Arial" font-size="22" font-weight="bold">IWSN · 20 Seiten Desktop + Mobile</text></svg>');
 await sharp({create:{width:1590,height:1200,channels:3,background:'#fff8f6'}})
  .composite([{input:title,left:0,top:0},...tiles])
  .jpeg({quality:75,mozjpeg:true}).toFile(path.join(dest,'overview-20.jpg'));
 const sizes=cardFiles.map(f=>fs.statSync(f).size);
 console.log(JSON.stringify({pages:cardFiles.length,pairedScreenshots:cardFiles.length*2,bytes:sizes.reduce((a,b)=>a+b,0),overview:path.join(dest,'overview-20.jpg')}));
})().catch(err=>{console.error(err);process.exitCode=1});
