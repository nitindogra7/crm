/* CommonJS runs these Node tests without changing the application module format. */
/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const { createStore } = require('zustand/vanilla');

function setup() {
  const store = createStore(() => ({
    activeDashboardId: 'workspace-a', currentEnvironment: 'development',
    leads: [{ id: 'a', status: 'New' }, { id: 'b', status: 'New' }],
    forms: [{ id: 'form-a', leadCount: 2 }], spam: [], apiKeys: [],
  }));
  const filename = path.join(__dirname, '../src/shared/lib/optimistic-update.ts');
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(code, {
    exports: compiledModule.exports,
    require(id) {
      assert.equal(id, '@/shared/store/use-app-store');
      return { useAppStore: store };
    },
  }, { filename });
  return { store, update: compiledModule.exports.optimisticUpdate };
}
function deferred() {
  let resolve, reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
}

test('an optimistic change appears before the save completes and remains on success', async () => {
  const { store, update } = setup();
  const save = deferred();
  const pending = update(() => store.setState({ leads: [{ id: 'a', status: 'Qualified' }] }), () => save.promise);
  assert.equal(store.getState().leads[0].status, 'Qualified');
  save.resolve(); await pending;
  assert.equal(store.getState().leads[0].status, 'Qualified');
});

test('a failed save restores its row while preserving a later edit to another row', async () => {
  const { store, update } = setup();
  const save = deferred();
  const pending = update(() => store.setState(state => ({ leads: state.leads.map(lead => lead.id === 'a' ? { ...lead, status: 'Qualified' } : lead) })), () => save.promise);
  store.setState(state => ({ leads: state.leads.map(lead => lead.id === 'b' ? { ...lead, status: 'Archived' } : lead) }));
  save.reject(new Error('offline'));
  await assert.rejects(pending, /offline/);
  assert.equal(store.getState().leads[0].status, 'New');
  assert.equal(store.getState().leads[1].status, 'Archived');
});

test('rollback preserves a newer edit to the same row', async () => {
  const { store, update } = setup();
  const save = deferred();
  const pending = update(() => store.setState(state => ({ leads: state.leads.map(lead => lead.id === 'a' ? { ...lead, status: 'Qualified' } : lead) })), () => save.promise);
  store.setState(state => ({ leads: state.leads.map(lead => lead.id === 'a' ? { ...lead, status: 'Contacted' } : lead) }));
  save.reject(new Error('offline')); await assert.rejects(pending);
  assert.equal(store.getState().leads[0].status, 'Contacted');
});

test('a failed deletion restores original row order and associated form counts', async () => {
  const { store, update } = setup();
  await assert.rejects(update(() => store.setState(state => ({ leads: state.leads.slice(1), forms: [{ id: 'form-a', leadCount: 1 }] })), () => Promise.reject(new Error('offline'))));
  assert.equal(store.getState().leads.map(lead => lead.id).join(','), 'a,b');
  assert.equal(store.getState().forms[0].leadCount, 2);
});

for (const change of [{ activeDashboardId: 'workspace-b' }, { currentEnvironment: 'production' }]) {
  test('rollback does not copy data into a different ' + Object.keys(change)[0], async () => {
    const { store, update } = setup();
    const save = deferred();
    const pending = update(() => store.setState({ leads: [] }), () => save.promise);
    store.setState({ ...change, leads: [], forms: [] });
    save.reject(new Error('offline')); await assert.rejects(pending);
    assert.equal(store.getState().leads.length, 0);
    assert.equal(store.getState().forms.length, 0);
  });
}
