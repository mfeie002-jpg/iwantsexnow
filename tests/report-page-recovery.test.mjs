import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const key = 'abcdef12-abcd-4abc-8abc-abcdef123456';
const originalCase = 'aaaaaaaa-aaaa-8aaa-8aaa-aaaaaaaaaaaa';
const pageSource = process.env.IWSN_REPORT_PAGE_REVISION
  ? execFileSync('git', ['show', `${process.env.IWSN_REPORT_PAGE_REVISION}:src/pages/report.tsx`], {encoding:'utf8'})
  : fs.readFileSync(new URL('../src/pages/report.tsx', import.meta.url), 'utf8');

function compile(source, file, dependencies, extras = {}) {
  const output = ts.transpileModule(source, {fileName:file, compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}});
  const context = {exports:{},URL,require(name){if(name in dependencies)return dependencies[name];throw Error('Unexpected dependency ' + name);},...extras};
  vm.runInNewContext(output.outputText, context, {filename:file});
  return context.exports;
}
function loadLibrary(name, dependencies = {}) {
  const file = `src/lib/marketplace/${name}.ts`;
  return compile(fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8'), file, dependencies);
}
const validation = loadLibrary('report-input');
const session = loadLibrary('report-session', {'./report-input':validation});
class WorkspaceError extends Error { constructor(status) {super('REQUEST_FAILED');this.status=status;} }
const deferred = () => {let resolve,reject;const promise = new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};

// Executes the actual page component with a minimal deterministic hook/render
// adapter. These are UI-state contract tests, not a browser/layout substitute.
// Tests drive public form callbacks; none reaches into indexed component state.
function page({query={id:'report-A'},ready=true,storedKey=null,submit=async()=>originalCase,check=async()=>originalCase}={}) {
  const slots = [], values = new Map(), submissions = [], checks = [], focus = [];
  if(storedKey)values.set(session.REPORT_SESSION_KEY,storedKey);
  const storage = {getItem:name=>values.get(name)??null,setItem:(name,value)=>values.set(name,value),removeItem:name=>values.delete(name)};
  const router = {isReady:ready,query};
  let cursor=0,dirty=false,pending=[],tree,oldRefs=[];
  const hooks = {
    useState(initial) {
      const i=cursor++;
      if(!(i in slots))slots[i]=initial;
      return [slots[i],next=>{const value=typeof next==='function'?next(slots[i]):next;if(!Object.is(value,slots[i])){slots[i]=value;dirty=true;}}];
    },
    useRef(initial) {const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
    useEffect(effect,deps) {const i=cursor++,old=slots[i];if(!old||deps.some((value,j)=>!Object.is(value,old[j])))pending.push(effect);slots[i]=deps;}
  };
  const jsx = (type,props)=>({type,props:props||{}});
  const Page = compile(pageSource,'src/pages/report.tsx',{
    react:hooks,'react/jsx-runtime':{jsx,jsxs:jsx,Fragment:Symbol('Fragment')},
    'next/router':{useRouter:()=>router},'next/link':{__esModule:true,default:'Link'},'@/components/SEO':{__esModule:true,default:'SEO'},
    '@/lib/marketplace/report-input':validation,
    '@/lib/marketplace/report-session':{...session,ensureReportSubmissionKey:(store,current)=>session.ensureReportSubmissionKey(store,current,()=>key)},
    '@/lib/marketplace/provider-workspace-client':{
      WorkspaceError,
      submitProviderReport:async body=>{submissions.push(JSON.parse(JSON.stringify(body)));return submit(body);},
      checkProviderReportReceipt:async identity=>{checks.push(identity);return check(identity);}
    }
  },{window:{sessionStorage:storage},requestAnimationFrame:callback=>callback()}).default;
  function walk(node,predicate,found=[]) {
    if(Array.isArray(node)){for(const child of node)walk(child,predicate,found);return found;}
    if(!node||typeof node!=='object')return found;
    if(predicate(node))found.push(node);
    walk(node.props?.children,predicate,found);
    return found;
  }
  function render() {
    for(let turns=0;turns<20;turns++) {
      cursor=0;dirty=false;pending=[];tree=Page();
      oldRefs.forEach(ref=>{ref.current=null;});oldRefs=[];
      walk(tree,node=>Boolean(node.props.ref)).forEach(node=>{
        const ref=node.props.ref;oldRefs.push(ref);
        ref.current={focus:()=>focus.push(node.props.id||node.props.role),scrollIntoView:()=>{}};
      });
      const effects=pending;pending=[];effects.forEach(effect=>effect());
      if(!dirty)return tree;
    }
    throw Error('Component did not settle');
  }
  const find=(predicate)=>walk(tree,predicate);
  const field=id=>{const found=find(node=>node.props.id===id);assert.equal(found.length,1,`Expected field ${id}`);return found[0];};
  const button=label=>{const found=find(node=>node.type==='button'&&node.props.children===label);assert.equal(found.length,1,`Expected button ${label}`);return found[0];};
  render();
  return {
    render,find,values,submissions,checks,focus,
    field,
    change(id,value){field(id).props.onChange({target:{value}});render();},
    navigate(nextQuery,nextReady=true){router.query=nextQuery;router.isReady=nextReady;render();},
    submit(){const form=find(node=>node.type==='form')[0];const result=form.props.onSubmit({preventDefault(){}});render();return result.finally(render);},
    click(label){const result=button(label).props.onClick();render();return Promise.resolve(result).finally(render);}
  };
}
const receiptVisible=app=>app.find(node=>node.type==='span'&&node.props.children===originalCase).length===1;

test('fresh reference prefill follows pristine navigation and preserves form validation constraints',()=>{
  const app=page({query:{id:'report-A',sourceUrl:'https://example.invalid/A'}});
  assert.equal(app.field('report-profile').props.value,'report-A');
  assert.equal(app.field('report-source').props.value,'https://example.invalid/A');
  app.navigate({profileId:'report-B'});
  assert.equal(app.field('report-profile').props.value,'report-B');
  assert.equal(app.field('report-source').props.value,'');
  for(const [id,max] of [['report-profile',150],['report-source',500],['report-details',400],['report-contact',120]])assert.equal(app.field(id).props.maxLength,max);
  assert.equal(app.field('report-profile').props['aria-describedby'],'report-reference-help');
});

test('typing before router readiness prevents late reference prefill from replacing user input',()=>{
  const app=page({query:{},ready:false});
  app.change('report-profile','user-entered-reference');
  app.change('report-source','https://example.invalid/user');
  app.navigate({id:'late-route-reference',sourceUrl:'https://example.invalid/route'});
  assert.equal(app.field('report-profile').props.value,'user-entered-reference');
  assert.equal(app.field('report-source').props.value,'https://example.invalid/user');
});

test('route changes during an uncertain submission preserve the original input and request identity',async()=>{
  const pending=deferred();
  const app=page({submit:()=>pending.promise});
  const request=app.submit();
  app.navigate({id:'report-B',sourceUrl:'https://example.invalid/B'});
  assert.equal(app.field('report-profile').props.value,'report-A');
  assert.equal(app.field('report-source').props.value,'');
  assert.equal(app.submissions[0].profileId,'report-A');
  pending.reject(new WorkspaceError(503));await request;
  app.navigate({id:'report-C'});
  assert.equal(app.field('report-profile').props.value,'report-A');
  assert.deepEqual([...app.values],[[session.REPORT_SESSION_KEY,key]]);
});

test('restored session identity prevents a new route reference from appearing to belong to the earlier report',()=>{
  const app=page({storedKey:key,query:{id:'unrelated-route-reference'}});
  assert.equal(app.field('report-profile').props.value,'');
  assert.equal(app.find(node=>node.type==='button'&&node.props.children==='Eingang erneut prüfen').length,1);
  assert.equal(app.submissions.length,0);assert.equal(app.checks.length,0);
});

test('recovered receipt is separate from edited unsaved fields and explicit new report uses the latest route',async()=>{
  const app=page({submit:async()=>{throw new WorkspaceError(503);}});
  await app.submit();
  app.change('report-profile','report-B-unsaved');
  app.change('report-contact','unsaved@example.invalid');
  await app.click('Eingang erneut prüfen');
  assert.equal(receiptVisible(app),true);
  assert.equal(app.find(node=>node.type==='h3'&&node.props.children==='Früherer Eingang bestätigt.').length,1);
  assert.equal(app.find(node=>['fieldset','input','textarea'].includes(node.type)).length,0);
  assert.equal(app.focus.at(-1),'status');
  app.navigate({id:'report-C',sourceUrl:'https://example.invalid/C'});
  assert.equal(receiptVisible(app),true);
  assert.equal(app.find(node=>['input','textarea'].includes(node.type)).length,0);
  assert.deepEqual([...app.values],[[session.REPORT_SESSION_KEY,key]]);
  await app.click('Neue Meldung beginnen');
  assert.equal(receiptVisible(app),false);assert.equal(app.values.size,0);
  assert.equal(app.field('report-profile').props.value,'report-C');
  assert.equal(app.field('report-source').props.value,'https://example.invalid/C');
  assert.equal(app.field('report-contact').props.value,'');
  assert.equal(app.field('report-details').props.value,'');
  assert.equal(app.submissions.length,1);assert.deepEqual(app.checks,[key]);
});

test('fresh successful submission shows a dedicated receipt without query-driven field reassociation',async()=>{
  const app=page();await app.submit();
  assert.equal(receiptVisible(app),true);
  assert.equal(app.find(node=>node.type==='h3'&&node.props.children==='Meldung gespeichert.').length,1);
  assert.equal(app.find(node=>['fieldset','input','textarea'].includes(node.type)).length,0);
  app.navigate({id:'another-reference'});
  assert.equal(receiptVisible(app),true);
  assert.equal(app.find(node=>['input','textarea'].includes(node.type)).length,0);
  assert.deepEqual([...app.values],[[session.REPORT_SESSION_KEY,key]]);
});
