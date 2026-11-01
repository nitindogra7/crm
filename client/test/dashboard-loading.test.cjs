/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const { createStore } = require("zustand/vanilla");
function compile(relative, dependencies = {}) {
  const filename = path.join(__dirname, "../src/", relative);
  const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(code, {
    exports: compiledModule.exports, AbortController, URLSearchParams, Date, Map, console,
    require(id) { if (!(id in dependencies)) throw new Error("Unexpected import: " + id); return dependencies[id]; },
  }, { filename });
  return compiledModule.exports;
}
const { ResourceCache } = compile("features/dashboard/data/resource-cache.ts");
const routeData = compile("features/dashboard/data/route-data.ts");
const settle = () => new Promise(resolve => setImmediate(resolve));
function deferred() { let resolve; const promise = new Promise(done => { resolve = done; }); return { promise, resolve }; }
function setup() {
  let pathname = "/dashboard"; let cursor = 0; let revision = 0; let waiting = false;
  const slots = []; const effects = []; const requests = []; const save = deferred(); const page = deferred();
  const org = { id: "workspace-a", name: "A", slug: "a", activeEnvironment: "development" };
  const lead = { id: "lead-a", formId: "form-a", status: "New", receivedAt: new Date().toISOString() };
  const store = createStore(set => ({
    organizations: [], activeDashboardId: null, currentEnvironment: "development", workspace: {},
    forms: [], apiKeys: [], leads: [], spam: [],
    setOrganizations: organizations => set({ organizations }), setActiveDashboardId: activeDashboardId => set({ activeDashboardId }),
    setCurrentEnvironment: currentEnvironment => set({ currentEnvironment }), updateWorkspace: workspace => set({ workspace }),
    setForms: forms => set({ forms }), setApiKeys: apiKeys => set({ apiKeys }), setLeads: leads => set({ leads }), setSpam: spam => set({ spam }),
    addToast() {}, setSelectedLeadId: selectedLeadId => set({ selectedLeadId }),
  }));
  const changed = (prior, next) => !prior || next.some((value, index) => !Object.is(value, prior[index]));
  const react = {
    createContext: () => ({ Provider: "provider" }),
    useState(initial) {
      const slot = cursor++; if (!(slot in slots)) slots[slot] = typeof initial === "function" ? initial() : initial;
      return [slots[slot], value => { slots[slot] = typeof value === "function" ? value(slots[slot]) : value; }];
    },
    useRef(initial) { const slot = cursor++; return slots[slot] ||= { current: initial }; },
    useCallback(callback, deps) {
      const slot = cursor++; if (changed(slots[slot]?.deps, deps)) slots[slot] = { callback, deps };
      return slots[slot].callback;
    },
    useEffect(effect, deps) {
      const slot = cursor++;
      if (changed(slots[slot]?.deps, deps)) effects.push(() => { slots[slot]?.cleanup?.(); slots[slot] = { deps, cleanup: effect() }; });
    },
  };
  const getToken = async () => "token";
  const apiFetch = async (url, options = {}) => {
    requests.push({ url, options });
    if (options.method === "DELETE") { await save.promise; revision++; return { success: true }; }
    if (url === "/api/dashboards") return { success: true, data: [org] };
    if (url.startsWith("/api/dashboard/overview")) return { success: true, data: { forms: [], leads: [lead], stats: { totalLeads: 1, spamFlagged: 0 }, newLeads: 1, formCounts: [], sourceCounts: [] } };
    if (waiting) await page.promise;
    return { success: true, data: url.startsWith("/api/leads?") ? [lead] : [] };
  };
  const useAppStore = Object.assign(selector => selector(store.getState()), { getState: store.getState, setState: store.setState });
  const { DashboardProvider } = compile("features/dashboard/context/dashboard-context.tsx", {
    react, "react/jsx-runtime": { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    "next/dynamic": () => () => null, "next/navigation": { usePathname: () => pathname },
    "../data/resource-cache": { ResourceCache }, "../data/route-data": routeData,
    "zustand/react/shallow": { useShallow: selector => selector }, "@clerk/nextjs": { useAuth: () => ({ getToken }) },
    "@/shared/store": { useAppStore, useStats: () => ({}) },
    "@/shared/lib/optimistic-update": { optimisticUpdate: async (apply, save) => { apply(); await save(); } },
    "@/shared/lib/api-client": { apiFetch, getApiMutationVersion: () => revision },
  });
  const render = () => { cursor = 0; const node = DashboardProvider({ children: null }); effects.splice(0).forEach(effect => effect()); return node.props.value; };
  return { requests, store, render, save, page, navigate(route) { pathname = route; }, waitForPages() { waiting = true; } };
}
async function boot(app) { app.render(); await settle(); app.render(); await settle(); return app.render(); }
test("overview boot loads only workspace discovery and its own endpoint", async () => {
  const app = setup(); const context = await boot(app);
  assert.equal(context.isLoading, false);
  assert.equal(app.requests.length, 2);
  assert.equal(app.requests[0].url, "/api/dashboards");
  assert.match(app.requests[1].url, /^\/api\/dashboard\/overview\?/);
});
test("a completed write from the previous route cannot cancel current page reads", async () => {
  const app = setup(); const overview = await boot(app);
  const saving = overview.deleteLeadAsync("lead-a"); await settle();
  app.waitForPages(); app.navigate("/dashboard/leads"); app.render(); await settle();
  const reads = app.requests.filter(request => request.url.startsWith("/api/forms?") || request.url.startsWith("/api/leads?"));
  assert.equal(reads.length, 1); // Overview already cached forms for this workspace.
  assert.match(reads[0].url, /^\/api\/leads\?/);
  app.save.resolve(); await saving; await settle();
  assert.equal(reads.every(request => !request.options.signal.aborted), true);
  assert.equal(app.requests.filter(request => request.url.startsWith("/api/dashboard/overview?")).length, 1);
  app.page.resolve(); await settle();
  // A write invalidates a concurrent read, so the active page may refresh once.
  await settle();
  assert.equal(app.render().isLoading, false);
});
