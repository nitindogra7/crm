/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {spawn}=require('node:child_process');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function main(){
 const output=path.resolve(__dirname,'../../artifacts/seo');fs.mkdirSync(output,{recursive:true});
 const profile=fs.mkdtempSync(path.join(os.tmpdir(),'infraly-seo-chrome-'));
 const chrome=spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=9227','--remote-allow-origins=*','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
 let socket;
 try{
 let pages;for(let n=0;n<80;n++){try{pages=await(await fetch('http://localhost:9227/json/list')).json();if(pages.length)break;}catch{}await pause(200);}
 if(!pages?.length)throw Error('Chrome did not start');
 socket=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);await new Promise(resolve=>socket.addEventListener('open',resolve,{once:true}));
 let sequence=0;const pending=new Map(),errors=[];
 socket.addEventListener('message',event=>{const m=JSON.parse(event.data);if(m.id){const item=pending.get(m.id);pending.delete(m.id);if(m.error)item?.reject(Error(m.error.message));else item?.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
 const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 await send('Network.setBlockedURLs',{urls:['*google-analytics.com*','*googletagmanager.com*','*vercel-insights.com*','*/_vercel/insights/*']});
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await send('Emulation.setCPUThrottlingRate',{rate:4});
 await send('Network.emulateNetworkConditions',{offline:false,latency:100,downloadThroughput:200000,uploadThroughput:93750});
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`window.__seoVitals={lcp:0,cls:0};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__seoVitals.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__seoVitals.cls+=e.value}).observe({type:'layout-shift',buffered:true});`});
 const reports=[],base=process.env.SEO_TEST_URL||'http://localhost:3100',live=process.argv.includes('--live-only');
 const targets=live?[['live-home','https://www.infraly.online/'],['live-docs','https://www.infraly.online/docs?guide=html']]:[['home',base+'/'],['docs-html',base+'/docs/html'],['lead-management',base+'/lead-management'],['compare',base+'/compare/formspree'],['signup',base+'/sign-up']];
 for(const [label,url]of targets){errors.length=0;await send('Network.clearBrowserCache');await send('Page.navigate',{url});
 for(let n=0;n<100;n++){if(await evaluate("document.readyState==='complete' && document.URL!=='about:blank'"))break;await pause(250);}await pause(4000);
 const report=await evaluate(`JSON.parse(JSON.stringify({url:location.href,title:document.title,h1:[...document.querySelectorAll('h1')].map(n=>n.textContent),canonical:document.querySelector('link[rel=canonical]')?.href,viewport:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,mainOverflow:document.querySelector('main')?.scrollWidth>document.querySelector('main')?.clientWidth,links:document.querySelectorAll('a[href]').length,vitals:window.__seoVitals,navigation:performance.getEntriesByType('navigation').map(n=>({ttfb:Math.round(n.responseStart),domContentLoaded:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd)})),resources:performance.getEntriesByType('resource').reduce((a,r)=>{a.transferBytes+=r.transferSize;a.requests++;if(r.initiatorType==='script')a.scripts++;return a},{transferBytes:0,requests:0,scripts:0})}))`);
 report.label=label;report.errors=[...errors];reports.push(report);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,label+'-390.png'),Buffer.from(shot.data,'base64'));
 if(label==='docs-html'){await evaluate("document.querySelector('aside nav a[href=\"/docs/react\"]').click()");await pause(3500);report.clientNavigation=await evaluate("({path:location.pathname,h1:document.querySelector('h1')?.textContent,canonical:document.querySelector('link[rel=canonical]')?.href})");}
 console.log(JSON.stringify(report));}
 if(!live){await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await send('Emulation.setCPUThrottlingRate',{rate:1});for(const route of ['/','/docs/html','/lead-management','/compare/formspree']){await send('Page.navigate',{url:base+route});await pause(3500);const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(output,(route==='/'?'home':route.split('/').filter(Boolean).join('-'))+'-1440.png'),Buffer.from(shot.data,'base64'));}
 await send('Emulation.setScriptExecutionDisabled',{value:true});await send('Page.navigate',{url:base+'/docs/html'});await pause(2500);await send('Emulation.setScriptExecutionDisabled',{value:false});reports.push({label:'no-js-docs',...await evaluate("({h1:document.querySelector('h1')?.textContent,code:!!document.querySelector('pre code'),links:document.querySelectorAll('a[href]').length})")});}
 fs.writeFileSync(path.join(output,live?'live-lab.json':'local-lab.json'),JSON.stringify({conditions:'Chrome headless, 390x844, 4x CPU, 100ms RTT, 1.6Mbps down, cold cache; GA/Vercel collection blocked; single runs, not field CWV',reports},null,2));
 }finally{socket?.close();chrome.kill();}
}
main().catch(error=>{console.error(error);process.exitCode=1});
