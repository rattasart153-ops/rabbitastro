'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'api', 'admin.js'), 'utf8');

function createHarness({ role = 'full', validSession = true } = {}) {
  const calls = { gas: [], store: [] };
  const store = {
    config() { calls.store.push(['config']); return { branch: 'test-matrix-of-destiny-rhd' }; },
    list(...args) { calls.store.push(['list', ...args]); return [{ id: 'fixture-record' }]; },
    save(...args) { calls.store.push(['save', ...args]); return { id: 'saved-record' }; },
    archive(...args) { calls.store.push(['archive', ...args]); return { ok: true }; },
    publish(...args) { calls.store.push(['publish', ...args]); return { id: 'published-record' }; },
    history(...args) { calls.store.push(['history', ...args]); return [{ version: 1 }]; },
    rollback(...args) { calls.store.push(['rollback', ...args]); return { record: { id: 'restored-record' } }; }
  };

  const module = { exports: {} };
  const handler = vm.runInNewContext(
    '(function(require, module, process, fetch) { ' + source + '\n; return module.exports; })',
    {}
  )(
    (id) => {
      if (id === './_prediction-store') return store;
      throw new Error('Unexpected module: ' + id);
    },
    module,
    { env: { GAS_WEB_APP_URL: 'https://gas.example.invalid/mock' } },
    async (_url, options) => {
        const payload = JSON.parse(options.body);
        calls.gas.push(payload);
        if (payload.action === 'adminValidateSession') {
          return { json: async () => validSession
            ? { ok: true, username: 'fixture-admin', role }
            : { ok: false, code: 'UNAUTHORIZED' } };
        }
        return { json: async () => ({ ok: true }) };
      }
  );

  async function invoke({ method = 'POST', body = {} } = {}) {
    const res = {
      statusCode: 200,
      payload: undefined,
      status(code) { this.statusCode = code; return this; },
      json(value) { this.payload = value; return this; }
    };
    await handler({ method, body }, res);
    return res;
  }

  return { invoke, calls };
}

test('both Full Admin and Read-Only Admin can list prediction records', async () => {
  for (const role of ['full', 'readonly']) {
    const h = createHarness({ role });
    const res = await h.invoke({ body: { action: 'predictionList', token: 'mock-token', collection: 'predictions' } });
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.ok, true);
    assert.equal(res.payload.records[0].id, 'fixture-record');
    assert.deepEqual(h.calls.store.map(call => call[0]), ['list']);
  }
});

test('Read-Only Admin is denied every prediction mutation before storage is touched', async () => {
  const actions = [
    ['predictionInitialize'],
    ['predictionSave', { collection: 'predictions', record: { id: 'x' } }],
    ['predictionDelete', { collection: 'predictions', id: 'x' }],
    ['predictionPublish', { collection: 'predictions', id: 'x' }],
    ['predictionHistory', { collection: 'predictions', id: 'x' }],
    ['predictionRollback', { collection: 'predictions', id: 'x', version: 1 }]
  ];

  for (const [action, extra = {}] of actions) {
    const h = createHarness({ role: 'readonly' });
    const res = await h.invoke({ body: { action, token: 'mock-token', ...extra } });
    assert.equal(res.statusCode, 403, action);
    assert.equal(res.payload.code, 'FORBIDDEN', action);
    assert.equal(h.calls.store.length, 0, action);
  }
});

test('Full Admin can reach the authorized mutation handlers', async () => {
  const cases = [
    ['predictionInitialize', {}, 'config'],
    ['predictionSave', { collection: 'predictions', record: { id: 'x' } }, 'save'],
    ['predictionDelete', { collection: 'predictions', id: 'x' }, 'archive'],
    ['predictionPublish', { collection: 'predictions', id: 'x' }, 'publish'],
    ['predictionHistory', { collection: 'predictions', id: 'x' }, 'history'],
    ['predictionRollback', { collection: 'predictions', id: 'x', version: 1 }, 'rollback']
  ];

  for (const [action, extra, expectedStoreCall] of cases) {
    const h = createHarness({ role: 'full' });
    const res = await h.invoke({ body: { action, token: 'mock-token', ...extra } });
    assert.equal(res.statusCode, 200, action);
    assert.ok(h.calls.store.some(call => call[0] === expectedStoreCall), action);
  }
});

test('missing or expired sessions are rejected before prediction data is accessed', async () => {
  for (const body of [
    { action: 'predictionList', collection: 'predictions' },
    { action: 'predictionSave', token: 'mock-token', collection: 'predictions', record: { id: 'x' } }
  ]) {
    const h = createHarness({ validSession: false });
    const res = await h.invoke({ body });
    assert.equal(res.statusCode, 401);
    assert.equal(res.payload.code, 'UNAUTHORIZED');
    assert.equal(h.calls.store.length, 0);
  }
});

test('unknown actions and non-POST methods are rejected', async () => {
  const unknown = createHarness();
  const badAction = await unknown.invoke({ body: { action: 'adminMakeMeOwner', token: 'mock-token' } });
  assert.equal(badAction.statusCode, 400);
  assert.equal(unknown.calls.gas.length, 0);

  const wrongMethod = await createHarness().invoke({ method: 'GET', body: { action: 'predictionList' } });
  assert.equal(wrongMethod.statusCode, 405);
});

test('adminSetCredentials is forwarded to GAS for server-side authorization', async () => {
  const h = createHarness({ role: 'readonly' });
  const res = await h.invoke({
    body: {
      action: 'adminSetCredentials',
      token: 'mock-token',
      fullUsername: 'mock-full',
      fullPassword: 'mock-full-password-123',
      readonlyUsername: 'mock-read',
      readonlyPassword: 'mock-read-password-123'
    }
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.ok, true);
  assert.equal(h.calls.gas[0].action, 'adminSetCredentials');
  // GAS enforces requireFullAdmin_; this API proxy test confirms the request is forwarded,
  // not that the external Apps Script authorization has been integration-tested.
});


test('GAS Full Admin guard rejects Read-Only sessions and accepts Full Admin sessions', () => {
  const gasSource = fs.readFileSync(path.join(__dirname, '..', 'google-apps-script', 'Code.gs'), 'utf8');
  let storedSession = '';
  const gasContext = vm.createContext({
    CacheService: { getScriptCache: () => ({ get: () => storedSession }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => key === 'ADMIN_AUTH_EPOCH' ? 'epoch-1' : null }) }
  });
  vm.runInContext(gasSource, gasContext);

  storedSession = JSON.stringify({ username: 'readonly-fixture', role: 'readonly', epoch: 'epoch-1' });
  assert.equal(gasContext.requireFullAdmin_('readonly-token'), null);
  assert.equal(gasContext.requireAdminSession_('readonly-token').role, 'readonly');

  storedSession = JSON.stringify({ username: 'full-fixture', role: 'full', epoch: 'epoch-1' });
  assert.equal(gasContext.requireFullAdmin_('full-token').role, 'full');
});

test('GAS rejects sessions from a previous authentication epoch', () => {
  const gasSource = fs.readFileSync(path.join(__dirname, '..', 'google-apps-script', 'Code.gs'), 'utf8');
  const gasContext = vm.createContext({
    CacheService: { getScriptCache: () => ({ get: () => JSON.stringify({ username: 'old-user', role: 'full', epoch: 'old-epoch' }) }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => key === 'ADMIN_AUTH_EPOCH' ? 'new-epoch' : null }) }
  });
  vm.runInContext(gasSource, gasContext);
  assert.equal(gasContext.requireAdminSession_('old-token'), null);
  assert.equal(gasContext.requireFullAdmin_('old-token'), null);
});
