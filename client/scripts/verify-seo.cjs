/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require("node:assert/strict");
const origin = process.env.SEO_TEST_URL || "http://localhost:3100";
const canonicalOrigin = process.env.SEO_CANONICAL_ORIGIN || "https://www.infraly.online";
const indexable = process.argv.includes("--indexable");
const meta = (html, key, attr = "name") => html.match(new RegExp('<meta[^>]*' + attr + '="' + key + '"[^>]*content="([^"]*)"'))?.[1];
const decode = value => value?.replace(/&amp;/g,"&").replace(/&#x27;/g,"'").replace(/&quot;/g,'"');
async function main() {
  const reports = [];
  const sitemapResponse = await fetch(origin + "/sitemap.xml");
  assert.equal(sitemapResponse.status,200);
  const xml = await sitemapResponse.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
  if (indexable) assert.equal(urls.length,15); else assert.equal(urls.length,0);
  const canonicalPages = ["/", "/docs", "/lead-management", "/compare/formspree", "/docs/ai-agent", "/docs/website-builders", "/docs/html", "/docs/react", "/docs/server", "/docs/fields", "/docs/environments", "/docs/spam", "/docs/responses", "/docs/glossary", "/docs/troubleshooting"];
  const titles = new Set(); const descriptions = new Set(); const pendingLinks = new Set();
  for (const pathname of canonicalPages) {
    const start = performance.now();
    const response = await fetch(origin+pathname,{headers:{"user-agent":"Googlebot"}, redirect:"manual"});
    const html = await response.text();
    assert.equal(response.status,200,pathname);
    if (!indexable) assert.ok(response.headers.get("x-robots-tag")?.includes("noindex"),pathname+" preview header");
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
    const description = decode(meta(html,"description"));
    assert.ok(title,pathname+" title"); assert.ok(description,pathname+" description");
    assert.equal(titles.has(title),false,pathname+" duplicate title"); titles.add(title);
    assert.equal(descriptions.has(description),false,pathname+" duplicate description"); descriptions.add(description);
    const canonical = decode(html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1]);
    assert.equal(canonical,canonicalOrigin+(pathname==="/"?"":pathname),pathname+" canonical");
    assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,pathname+" primary heading");
    assert.equal(meta(html,"robots"),indexable?"index, follow":"noindex, follow",pathname+" robots");
    assert.equal(meta(html,"og:url","property"),canonical,pathname+" og url");
    for(const script of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) JSON.parse(script[1]);
    if(pathname!=="/") assert.ok(html.includes('"BreadcrumbList"'),pathname+" breadcrumbs");
    for(const match of html.matchAll(/<a\b[^>]*href="(\/[^"#]*)"/g)) { const target=decode(match[1]).split("#")[0]; if(target) pendingLinks.add(target); }
    if(indexable) assert.ok(urls.some(url => new URL(url).href === new URL(canonical).href),pathname+" sitemap");
    reports.push({url:pathname,status:response.status,title:decode(title),description,canonical,robots:meta(html,"robots"),h1:html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1]?.replace(/<[^>]*>/g," "),bytes:Buffer.byteLength(html),ms:Math.round(performance.now()-start),links:(html.match(/<a\b/g)||[]).length});
  }
  for (const pathname of ["/sign-in","/sign-up"]) {
    const response=await fetch(origin+pathname); const html=await response.text();
    assert.equal(response.status,200,pathname); assert.ok(meta(html,"robots")?.includes("noindex")); assert.ok(response.headers.get("x-robots-tag")?.includes("noindex"));
    reports.push({url:pathname,status:response.status,title:decode(html.match(/<title>(.*?)<\/title>/s)?.[1]),description:decode(meta(html,"description")),robots:meta(html,"robots")});
  }
  for (const pathname of ["/dashboard","/dashboard/analytics","/dashboard/leads","/dashboard/forms","/dashboard/spam","/dashboard/settings","/onboarding"]) {
    const response=await fetch(origin+pathname,{redirect:"manual"}); assert.ok([302,307].includes(response.status),pathname+" protected redirect"); assert.ok(response.headers.get("location")?.includes("/sign-in")); assert.ok(response.headers.get("x-robots-tag")?.includes("noindex"));
  }
  for(const [from,to] of [["/docs?guide=html","/docs/html"],["/docs?guide=nextjs","/docs/react"],["/docs/nextjs","/docs/react"],["/docs/quickstart","/docs"],["/docs?guide=architecture","/docs"],["/docs/html/","/docs/html"],["/login","/sign-in"],["/signup","/sign-up"]]) {
    const response=await fetch(origin+from,{redirect:"manual"}); assert.equal(response.status,308,from); assert.equal(new URL(response.headers.get("location"),origin).pathname,to,from);
  }
  for(const pathname of ["/seo-missing-route","/docs/seo-missing-guide","/docs?guide=seo-missing-guide"]) {
    const response=await fetch(origin+pathname,{redirect:"manual",headers:{"user-agent":"Googlebot"}}); const html=await response.text(); assert.equal(response.status,404,pathname+" genuine 404"); assert.ok(html.includes('content="noindex"')||html.includes('content="noindex,'),pathname+" noindex");
  }
  for (const [host, protocol] of [["infraly.online", "https"], ["www.infraly.online", "http"]]) {
    if (indexable && ["localhost", "127.0.0.1"].includes(new URL(origin).hostname)) { const result = await new Promise((resolve, reject) => require("node:http").get(origin + "/docs/html", {headers:{host, "x-forwarded-proto":protocol}}, response => {response.resume(); resolve({status:response.statusCode,location:response.headers.location});}).on("error",reject)); assert.equal(result.status,308); assert.equal(result.location, canonicalOrigin + "/docs/html"); }
  }
  const parameterized=await (await fetch(origin+"/docs/html?utm_source=qa")).text(); assert.ok(parameterized.includes('href="'+canonicalOrigin+'/docs/html"'),"tracking canonical");
  const robotResponse=await fetch(origin+"/robots.txt"); const robots=await robotResponse.text(); assert.equal(robotResponse.status,200); assert.ok(robots.includes("Allow: /")); assert.equal(robots.includes("Sitemap:"),indexable);
  const image=await fetch(origin+"/social-preview"); assert.equal(image.status,200); assert.ok(image.headers.get("content-type")?.includes("image/png"));
  for(const target of pendingLinks) {
    const response=await fetch(origin+target,{method:"GET",redirect:"manual"}); assert.ok(response.status<400,"broken internal link: "+target+" "+response.status);
  }
  const result = {mode:indexable?"production":"non-indexable",reports,checkedInternalLinks:pendingLinks.size};
  if (process.env.SEO_REPORT_PATH) require("node:fs").writeFileSync(process.env.SEO_REPORT_PATH, JSON.stringify(result,null,2));
  console.log(JSON.stringify({mode:result.mode,pages:reports.length,checkedInternalLinks:pendingLinks.size,passed:true}));
}
main().catch(error=>{console.error(error);process.exitCode=1});

