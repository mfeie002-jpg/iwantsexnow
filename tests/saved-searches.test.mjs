import test from 'node:test';
import assert from 'node:assert/strict';
import {MAX_SAVED_SEARCHES,parseSavedSearches,removeSavedSearch,saveSearch,safeSavedSearchHref,SAVED_SEARCH_KEY} from '../src/components/night/saved-searches.ts';
import {CANTONS,CATEGORIES,REGIONS,filtersFromQuery} from '../src/lib/night-catalogue.ts';

function storage(initial='[]') {
 let value=initial;
 return {getItem:key=>key===SAVED_SEARCH_KEY?value:null,setItem:(key,next)=>{assert.equal(key,SAVED_SEARCH_KEY);value=next;},read:()=>value};
}
test('strict and inclusive budget links stay distinct, and time aliases share one saved entry',()=>{
 const local=storage();
 const href='/search?canton=ZH&under60=300&now=1';
 assert.equal(saveSearch(local,{href,label:'Unter CHF 300'}).outcome,'saved');
 assert.equal(safeSavedSearchHref(href),'/search?available=1&canton=ZH&under60=300');
 assert.equal(saveSearch(local,{href:'/search?available=1&under60=300&canton=ZH',label:'Same'}).outcome,'exists');
 assert.equal(saveSearch(local,{href:'/search?max60=300&now=true&canton=ZH',label:'Bis CHF 300'}).outcome,'saved');
 for(const query of ['under60=300&max60=300','under60=banane','available=0&now=1','under60=300&under60=200']){
   assert.equal(safeSavedSearchHref('/search?'+query),null,query);
 }
});
test('saved search restoration rejects external and non-discovery destinations',()=>{
 for(const input of ['https://evil.example/search','//evil.example/search','/\\evil.example/search','/login','/search#fragment','/search?canton=ZH&canton=ZG','/search?redirect=https://evil.example','/search\n'])assert.equal(safeSavedSearchHref(input),null,input);
 assert.equal(safeSavedSearchHref('/search?category=massage&canton=ZH'),'/search?canton=ZH&category=massage');
 assert.equal(safeSavedSearchHref('/kategorie/zuerich/dinner-date'),'/kategorie/zuerich/dinner-date');
});
test('malformed stored data cannot break discovery or add invalid entries',()=>{
 for(const input of ['bad json','null','{}','[null,42]'])assert.deepEqual(parseSavedSearches(input),[]);
 const entries=parseSavedSearches(JSON.stringify([{href:'/search?canton=ZH',label:' Zürich '},{href:'/search?canton=ZH',label:'Duplicate'},{href:'/login',label:'Invalid'}]));
 assert.deepEqual(entries,[{href:'/search?canton=ZH',label:'Zürich'}]);
});
test('saving is explicit, deduplicated and preserves all existing searches at the limit',()=>{
 const local=storage();
 for(const canton of ['ZH','ZG','BS','BE','LU'])assert.equal(saveSearch(local,{href:`/search?canton=${canton}`,label:canton}).outcome,'saved');
 const before=local.read();
 assert.equal(parseSavedSearches(before).length,MAX_SAVED_SEARCHES);
 assert.equal(saveSearch(local,{href:'/search?canton=GE',label:'Genève'}).outcome,'full');
 assert.equal(local.read(),before);
 assert.equal(saveSearch(local,{href:'/search?canton=ZH',label:'Zürich'}).outcome,'exists');
 assert.equal(local.read(),before);
});
test('query order does not create duplicates and optional text remains encoded',()=>{
 const local=storage();
 assert.equal(saveSearch(local,{href:'/search?category=massage&canton=ZH&q=Baar%20%26%20Cham',label:'Search'}).outcome,'saved');
 assert.equal(saveSearch(local,{href:'/search?canton=ZH&q=Baar+%26+Cham&category=massage',label:'Same'}).outcome,'exists');
});
test('failed writes do not return a success state or replace the stored selections',()=>{
 const local=storage(JSON.stringify([{href:'/search?canton=ZH',label:'Zürich'}]));
 const before=local.read();
 const denied={getItem:local.getItem,setItem:()=>{throw new Error('QuotaExceeded');}};
 assert.throws(()=>saveSearch(denied,{href:'/search?canton=ZG',label:'Zug'}),/QuotaExceeded/);
 assert.throws(()=>removeSavedSearch(denied,'/search?canton=ZH'),/QuotaExceeded/);
 assert.equal(local.read(),before);
});
test('removing one search preserves others and frees an available slot',()=>{
 const local=storage();
 saveSearch(local,{href:'/search?canton=ZH',label:'Zürich'});
 saveSearch(local,{href:'/search?canton=ZG',label:'Zug'});
 assert.deepEqual(removeSavedSearch(local,'/search?canton=ZH'),[{href:'/search?canton=ZG',label:'Zug'}]);
 assert.deepEqual(parseSavedSearches(local.read()),[{href:'/search?canton=ZG',label:'Zug'}]);
});
test('restoration rejects invalid filter values before any navigation or write',()=>{
 const invalid=['canton=INVALID','category=evil','max=-100','max=abc','max=Infinity','max=NaN','max=1e300','max=0x100','max=9007199254740992','price=free','available=3','wa=yes','sort=rating','q=%00private'];
 const local=storage();
 for(const query of invalid){
  const href=`/search?${query}`;
  assert.equal(safeSavedSearchHref(href),null,href);
  assert.equal(saveSearch(local,{href,label:'Invalid'}).outcome,'invalid',href);
 }
 assert.equal(local.read(),'[]');
});
test('only implemented regional and service landing pages can be restored',()=>{
 for(const href of ['/orte/unknown','/kategorie/unknown/dinner-date','/kategorie/zuerich/invalid','/kategorie/unknown/invalid','/orte/zug/extra','/search/','/unknown/../search','/orte/%7Aug'])assert.equal(safeSavedSearchHref(href),null,href);
 for(const region of [...REGIONS.map(item=>item.slug),'zurich','baden','winterthur']){
  assert.equal(safeSavedSearchHref(`/orte/${region}`),`/orte/${region}`);
  for(const service of ['girlfriend-experience','tantra-massage','haus-und-hotelbesuche','domina-bdsm','dinner-date','trans-escort','paare-und-bisex'])assert.equal(safeSavedSearchHref(`/kategorie/${region}/${service}`),`/kategorie/${region}/${service}`);
 }
});
test('all public canton/category options restore as valid catalogue filters',()=>{
 for(const canton of CANTONS)for(const category of CATEGORIES){
  const href=safeSavedSearchHref(`/search?canton=${canton}&category=${category.id}&max=200.50&price=missing&available=1&wa=1&sort=price`);
  assert.ok(href);
  const filters=filtersFromQuery(Object.fromEntries(new URL(href,'https://local.invalid').searchParams));
  assert.equal(filters.invalid,undefined);assert.equal(filters.canton,canton);assert.equal(filters.category,category.id);assert.equal(filters.max,200.5);
 }
});
test('default and case aliases share a saved slot while invalid stored records are discarded',()=>{
 assert.equal(safeSavedSearchHref('/search?canton=zh&category=ALL&max=0&available=0&wa=0&sort=default&price='),'/search?canton=ZH');
 const local=storage();
 assert.equal(saveSearch(local,{href:'/search?canton=zh&category=ALL',label:'Zürich'}).outcome,'saved');
 assert.equal(saveSearch(local,{href:'/search?canton=ZH',label:'Same'}).outcome,'exists');
 assert.deepEqual(parseSavedSearches(JSON.stringify([{href:'/search?canton=INVALID',label:'Invalid'},{href:'/search?canton=ZH',label:'Valid'},{href:'/kategorie/unknown/invalid',label:'Unknown route'}])),[{href:'/search?canton=ZH',label:'Valid'}]);
});
