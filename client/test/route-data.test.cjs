/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function load(name) {
  const filename = path.join(__dirname, "../src/features/dashboard/data/" + name + ".ts");
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(code, { exports: compiledModule.exports, AbortController, Date, Map }, { filename });
  return compiledModule.exports;
}
const { resourcesForRoute } = load("route-data");
const { ResourceCache } = load("resource-cache");

test("routes request only their dependencies; settings requests no lists", () => {
  for (const [route, expected] of Object.entries({
    "/dashboard": ["overview"], "/dashboard/analytics": ["analytics"],
    "/dashboard/forms": ["forms", "keys"], "/dashboard/leads": ["forms", "leads"],
    "/dashboard/spam": ["forms", "spam"], "/dashboard/settings": [],
  })) assert.deepEqual(Array.from(resourcesForRoute(route)), expected);
});
test("repeat visits reuse fresh reads but writes invalidate them", async () => {
  const cache = new ResourceCache(); let calls = 0;
  const fetch = async () => ++calls;
  assert.equal(await cache.get("forms", 0, fetch), 1);
  assert.equal(await cache.get("forms", 0, fetch), 1);
  assert.equal(await cache.get("forms", 1, fetch), 2);
  assert.equal(await cache.get("forms", 1, fetch, true), 3);
});
test("simultaneous reads share one request", async () => {
  const cache = new ResourceCache(); let calls = 0; let resolve;
  const fetch = () => { calls++; return new Promise(done => { resolve = done; }); };
  const a = cache.get("leads", 0, fetch); const b = cache.get("leads", 0, fetch);
  resolve("result"); assert.equal(await a, "result"); assert.equal(await b, "result"); assert.equal(calls, 1);
});
test("failed reads can be retried", async () => {
  const cache = new ResourceCache();
  await assert.rejects(cache.get("spam", 0, async () => { throw new Error("offline"); }));
  assert.equal(await cache.get("spam", 0, async () => "retried"), "retried");
});
test("workspace changes abort pending requests and clear previous cached values", async () => {
  const cache = new ResourceCache(); let signal; let resolve;
  cache.seed("forms", "workspace-a", 0);
  const pending = cache.get("leads", 0, input => { signal = input; return new Promise(done => { resolve = done; }); });
  cache.clear(); assert.equal(signal.aborted, true);
  resolve("late-workspace-a"); await pending;
  assert.equal(await cache.get("forms", 0, async () => "workspace-b"), "workspace-b");
  assert.equal(await cache.get("leads", 0, async () => "workspace-b"), "workspace-b");
});
test("a write cannot reuse an older pending read", async () => {
  const cache = new ResourceCache(); let firstSignal; let resolve;
  const old = cache.get("forms", 0, signal => { firstSignal = signal; return new Promise(done => { resolve = done; }); });
  assert.equal(await cache.get("forms", 1, async () => "new"), "new");
  assert.equal(firstSignal.aborted, true);
  resolve("old"); await old;
  assert.equal(await cache.get("forms", 1, async () => "unexpected"), "new");
});
test("expired data is fetched again", async () => {
  const cache = new ResourceCache(-1); let calls = 0;
  await cache.get("forms", 0, async () => ++calls);
  await cache.get("forms", 0, async () => ++calls);
  assert.equal(calls, 2);
});
