/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function setup(fetch) {
  const filename = path.join(__dirname, "../src/shared/lib/api-client.ts");
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(code, { exports: compiledModule.exports, process: { env: {} }, fetch, Headers, AbortSignal }, { filename });
  return compiledModule.exports;
}
const success = async () => ({ ok: true, json: async () => ({ success: true }) });
test("successful writes invalidate cached route reads; GET requests do not", async () => {
  const api = setup(success);
  await api.apiFetch("/api/forms"); assert.equal(api.getApiMutationVersion(), 0);
  await api.apiFetch("/api/forms", { method: "POST" }); assert.equal(api.getApiMutationVersion(), 1);
  await api.apiFetch("/api/forms/id", { method: "PATCH" }); assert.equal(api.getApiMutationVersion(), 2);
});
test("failed writes preserve the cache revision", async () => {
  const api = setup(async () => ({ ok: false, status: 400, json: async () => ({ error: "invalid" }) }));
  await assert.rejects(api.apiFetch("/api/forms", { method: "POST" }), /invalid/);
  assert.equal(api.getApiMutationVersion(), 0);
});
test("environment preferences avoid invalidating the fresh environment read", async () => {
  let request;
  const api = setup(async (_url, options) => { request = options; return success(); });
  await api.apiFetch("/api/dashboards/id", { method: "PATCH", invalidateResources: false });
  assert.equal(api.getApiMutationVersion(), 0); assert.equal("invalidateResources" in request, false);
});
test("request cancellation is preserved alongside the request timeout", async () => {
  const controller = new AbortController();
  const api = setup(async (_url, options) => {
    controller.abort(); assert.equal(options.signal.aborted, true); throw new Error("cancelled");
  });
  await assert.rejects(api.apiFetch("/api/forms", { signal: controller.signal }), /cancelled/);
});
