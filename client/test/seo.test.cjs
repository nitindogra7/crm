/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
function load(relative) {
  const filename = path.resolve(__dirname, "../src", relative);
  const source = fs.readFileSync(filename, "utf8");
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const compiled = { exports: {} };
  const localRequire = name => name.startsWith(".") ? load(path.relative(path.resolve(__dirname, "../src"), path.resolve(path.dirname(filename), name + ".ts"))) : require(name);
  new Function("exports", "require", "process", code)(compiled.exports, localRequire, process);
  return compiled.exports;
}
const { getSiteConfig } = load("shared/lib/site-config.ts");
test("indexing permits production only and preview always wins", () => {
  assert.equal(getSiteConfig({ NODE_ENV: "production", VERCEL_ENV: "production" }).indexable, true);
  assert.equal(getSiteConfig({ NODE_ENV: "production", SEO_INDEXING_ENABLED: "true" }).indexable, true);
  for (const env of [
    {}, { NODE_ENV: "development", SEO_INDEXING_ENABLED: "true" },
    { NODE_ENV: "production" },
    { NODE_ENV: "production", VERCEL_ENV: "preview", SEO_INDEXING_ENABLED: "true" },
    { NODE_ENV: "production", VERCEL_ENV: "production", SEO_INDEXING_ENABLED: "false" },
  ]) assert.equal(getSiteConfig(env).indexable, false, JSON.stringify(env));
});
test("invalid public origins fail closed instead of leaking placeholder canonical URLs", () => {
  for (const origin of ["http://infraly.online", "https://localhost", "https://127.0.0.1", "https://example.com", "https://preview.test", "https://infraly.online/path", "https://infraly.online?tracking=1", "https://user:secret@infraly.online", "https://infraly.online:444", "broken"]) {
    const result = getSiteConfig({ NEXT_PUBLIC_APP_URL: origin, NODE_ENV: "production", VERCEL_ENV: "production" });
    assert.equal(result.origin, undefined, origin); assert.equal(result.indexable, false, origin);
  }
  assert.equal(getSiteConfig({ NEXT_PUBLIC_APP_URL: "https://infraly.online/" }).origin, "https://infraly.online");
});
test("JSON-LD cannot terminate its script and remains valid JSON", () => {
  const { jsonLd } = load("shared/lib/seo.ts");
  const value = { name: '</script><script>alert("x")</script>', text: "a\u2028b" };
  const serialized = jsonLd(value);
  assert.equal(serialized.includes("<"), false);
  assert.deepEqual(JSON.parse(serialized), value);
});
test("all guide aliases and internal guide links reach existing canonical pages", () => {
  const { DOC_PAGES, GUIDE_ALIASES, docHref, normalizeDocHref, findDocPage } = load("features/docs/data/docs-data.ts");
  const paths = new Set(DOC_PAGES.map(page => docHref(page.id)));
  assert.equal(paths.size, DOC_PAGES.length);
  for (const [alias, target] of Object.entries(GUIDE_ALIASES)) {
    assert.ok(findDocPage(alias), alias); assert.equal(docHref(alias), docHref(target));
  }
  for (const page of DOC_PAGES) for (const section of page.sections) for (const link of section.links || []) {
    if (link.href.startsWith("/docs")) assert.ok(paths.has(link.href.split("#")[0]), link.href);
    assert.equal(link.href.includes("?guide="), false, link.href);
  }
  assert.equal(normalizeDocHref("/docs?guide=nextjs#submit-with-fetch"), "/docs/react#submit-with-fetch");
  assert.equal(findDocPage("missing-guide"), undefined);
});


test("canonical host overrides cannot create a self-redirect loop", () => {
  const { canonicalRedirects } = load("shared/lib/site-config.ts");
  for (const origin of ["https://www.infraly.online", "https://infraly.online", "https://other-domain.net"]) {
    for (const redirect of canonicalRedirects({ origin, indexable: true })) {
      if (redirect.has.some(condition => condition.type === "header")) continue;
      assert.notEqual(redirect.has[0].value, new URL(redirect.destination.replace("/:path*", "")).hostname);
    }
  }
  assert.deepEqual(canonicalRedirects({ indexable: false }), []);
});
