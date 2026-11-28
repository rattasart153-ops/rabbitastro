'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'api', 'predictions.js'), 'utf8');

function createHarness({ role = 'full', validSession = true } = {}) {
  const calls = { runtime: 0, auth: [] };
  const store = {
    async runtime() {
      calls.runtime += 1;
      return { Predictions: [{ id: 'published-fixture' }] };
    }
  };
  const module = { exports: {} };
  const handler = vm.runInNewContext(
    '(function(require, module, process, fetch) { ' + source + '\n; return module.exports; })',
    {}
  )(
    id => {
      if (id === './_prediction-store') return store;
      throw new Error('Unexpected module: ' + id);
    },
    module,
    { env: { GAS_WEB_APP_URL: 'https://gas.example.invalid/mock' } },
    async (_url, options) => {
      const payload = JSON.parse(options.body);
      calls.auth.push(payload);
      return {
        json: async () => validSession
          ? { ok: true, role, username: 'fixture-admin' }
          : { ok: false, code: 'UNAUTHORIZED' }
      };
    }
  );

  async function invoke({ method = 'GET', token = 'mock-token' } = {}) {
    const headers = {};
    const res = {
      statusCode: 200,
      payload: undefined,
      headers,
      setHeader(name, value) { headers[name] = value; },
      status(code) { this.statusCode = code; return this; },
      json(value) { this.payload = value; return this; }
    };
    await handler({ method, headers: token ? { 'x-admin-token': token } : {} }, res);
    return res;
  }

  return { invoke, calls };
}

test('Full Admin and Read-Only Admin can both read the authenticated prediction runtime', async () => {
  for (const role of ['full', 'readonly']) {
    const h = createHarness({ role });
    const res = await h.invoke();
    assert.equal(res.statusCode, 200);
    assert.equal(res.payload.ok, true);
    assert.equal(res.payload.runtime.Predictions[0].id, 'published-fixture');
    assert.equal(h.calls.runtime, 1);
    assert.equal(res.headers['Cache-Control'], 'no-store, max-age=0');
  }
});

test('missing and expired sessions cannot read the prediction runtime', async () => {
  const missing = createHarness();
  const missingRes = await missing.invoke({ token: '' });
  assert.equal(missingRes.statusCode, 401);
  assert.equal(missing.calls.runtime, 0);

  const expired = createHarness({ validSession: false });
  const expiredRes = await expired.invoke();
  assert.equal(expiredRes.statusCode, 401);
  assert.equal(expired.calls.runtime, 0);
});

test('prediction runtime endpoint is GET-only', async () => {
  const h = createHarness();
  const res = await h.invoke({ method: 'POST' });
  assert.equal(res.statusCode, 405);
  assert.equal(res.headers.Allow, 'GET');
  assert.equal(h.calls.runtime, 0);
});
