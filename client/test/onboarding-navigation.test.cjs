/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function compile(relative, globals) {
  const filename = path.join(__dirname, '../src', relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, process, AbortSignal, console: { error() {} }, ...globals }, { filename });
  return exports;
}

function setup({ fails = false } = {}) {
  const states = [];
  let cursor = 0;
  let effects = [];
  const timers = new Map();
  const destinations = [];
  const workspaces = [];
  let requests = 0;
  const hook = compile('features/onboarding/hooks/use-onboarding-form.ts', {
    require(id) {
      if (id === 'react') return {
        useState(initial) {
          const index = cursor++;
          if (!(index in states)) states[index] = initial;
          return [states[index], value => { states[index] = value; }];
        },
        useEffect(effect) { effects.push(effect); },
        useCallback(callback) { return callback; },
      };
      if (id === 'next/navigation') return { useRouter: () => ({ replace: dest => destinations.push(dest) }) };
      if (id === '@clerk/nextjs') return {
        useUser: () => ({ isLoaded: true, user: { id: 'test-user', firstName: 'Alex', primaryEmailAddress: { emailAddress: 'alex@example.com' } } }),
        useAuth: () => ({ getToken: async () => 'test-token' }),
      };
      if (id === '@/shared/store') return { useAppStore: select => select({ initWorkspace: value => workspaces.push(value) }) };
      if (id === '../constants') return { slugify: () => 'alex-workspace' };
      if (id === 'canvas-confetti') throw new Error('Optional animation unavailable');
      throw new Error(id);
    },
    window: {
      location: { replace: dest => destinations.push(dest) },
      setTimeout(callback, delay) { assert.equal(delay, 1200); timers.set(1, callback); return 1; },
      clearTimeout(id) { timers.delete(id); },
    },
    fetch: async () => {
      requests++;
      return { ok: !fails, json: async () => fails ? { error: 'Could not save' } : { data: { name: 'Saved workspace', slug: 'saved-slug' } } };
    },
  }).useOnboardingForm;
  function render() { cursor = 0; effects = []; const result = hook(); const cleanup = effects.map(effect => effect()); return { ...result, cleanup }; }
  return { render, timers, destinations, workspaces, requests: () => requests };
}

test('successful onboarding saves the workspace then automatically enters the dashboard', async () => {
  const app = setup();
  const initial = app.render();
  assert.equal(app.timers.size, 0);
  await initial.handleSubmit();
  assert.equal(app.workspaces[0].slug, 'saved-slug');
  const success = app.render();
  assert.equal(success.isSuccess, true);
  assert.equal(success.isSubmitting, false);
  assert.equal(app.timers.size, 1);
  app.timers.get(1)();
  assert.deepEqual(app.destinations, ['/dashboard']);
  await success.handleSubmit();
  assert.equal(app.requests(), 1, 'completed onboarding must not submit again');
});

test('failed onboarding stays on the form without scheduling navigation', async () => {
  const app = setup({ fails: true });
  await app.render().handleSubmit();
  const failed = app.render();
  assert.equal(failed.isSuccess, false);
  assert.equal(failed.submitError, 'Could not save');
  assert.equal(app.timers.size, 0);
  assert.equal(app.workspaces.length, 0);
  assert.deepEqual(app.destinations, []);
});

test('the manual dashboard action navigates immediately', () => {
  const app = setup();
  app.render().redirectToDashboard();
  assert.deepEqual(app.destinations, ['/dashboard']);
});

test('leaving the success screen cancels its pending redirect', async () => {
  const app = setup();
  await app.render().handleSubmit();
  const success = app.render();
  for (const cleanup of success.cleanup) if (cleanup) cleanup();
  assert.equal(app.timers.size, 0);
  assert.deepEqual(app.destinations, []);
});

test('dashboard checks fresh onboarding status after an earlier incomplete result', async () => {
  let completed = false;
  const layout = compile('app/dashboard/layout.tsx', {
    require(id) {
      if (id === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }) };
      if (id === 'next/navigation') return { redirect: dest => { throw new Error('redirect:' + dest); } };
      if (id === '@clerk/nextjs/server') return { auth: async () => ({ userId: 'test-user', getToken: async () => 'test-token' }) };
      if (id.includes('dashboard-context')) return { DashboardProvider: 'Provider' };
      if (id.includes('dashboard-shell')) return { DashboardShell: 'Shell' };
      throw new Error(id);
    },
    fetch: async (_url, options) => {
      assert.equal(options.cache, 'no-store');
      assert.equal(options.next, undefined);
      return { ok: true, json: async () => ({ isOnboarded: completed, onboarding: completed ? { name: 'Saved workspace' } : null }) };
    },
  }).default;
  await assert.rejects(layout({ children: 'Dashboard' }), /redirect:\/onboarding/);
  completed = true;
  const result = await layout({ children: 'Dashboard' });
  assert.equal(result.props.initialWorkspace.name, 'Saved workspace');
});
