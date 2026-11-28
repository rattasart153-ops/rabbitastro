'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const store = require('../api/_prediction-store');

function encoded(collection, records) {
  return Buffer.from(JSON.stringify({ schemaVersion: 1, collection, records })).toString('base64');
}
function response(status, payload) {
  return { ok: status >= 200 && status < 300, status, json: async () => payload };
}
function installMock(t, options) {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_TOKEN;
  const calls = [];
  let records = options.records;
  let sha = options.sha || 'sha-current';
  let putCount = 0;
  process.env.GITHUB_TOKEN = 'test-token';
  global.fetch = async (url, request = {}) => {
    const method = request.method || 'GET';
    calls.push({ url: String(url), method, body: request.body ? JSON.parse(request.body) : null });
    if (String(url).includes('/contents/data/predictions/')) {
      if (method === 'GET') {
        return response(200, {
          type: 'file',
          sha,
          content: encoded(options.collection, records)
        });
      }
      if (method === 'PUT') {
        putCount += 1;
        const configured = options.putResponses && options.putResponses[putCount - 1];
        if (configured) {
          if (configured.status >= 200 && configured.status < 300 && configured.persist !== false) {
            const body = JSON.parse(Buffer.from(request.body.content, 'base64').toString('utf8'));
            records = body.records;
            sha = 'sha-after-' + putCount;
          }
          return response(configured.status, configured.payload || {});
        }
        const body = JSON.parse(Buffer.from(request.body.content, 'base64').toString('utf8'));
        records = body.records;
        sha = 'sha-after-' + putCount;
        return response(200, { commit: { sha: 'commit-' + putCount } });
      }
    }
    throw new Error('Unexpected GitHub request: ' + method + ' ' + url);
  };
  t.after(() => {
    global.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = originalToken;
  });
  return {
    calls,
    getRecords: () => records,
    getPutCount: () => putCount
  };
}

function record(overrides = {}) {
  return Object.assign({
    id: 'prediction-history-fixture',
    engineId: 'engine1',
    parentId: 'fixture',
    name: 'history.fixture',
    title: 'History fixture',
    description: '',
    content: 'current content',
    data: {},
    priority: 100,
    status: 'draft',
    version: 3,
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-03T00:00:00.000Z',
    updatedBy: 'Full Admin',
    history: []
  }, overrides);
}

test('save keeps at most 50 history snapshots and appends the previous current version', async t => {
  const snapshots = Array.from({ length: 55 }, (_, index) => ({
    id: 'prediction-history-fixture',
    engineId: 'engine1',
    name: 'history.fixture',
    title: 'History fixture',
    content: 'version ' + (index + 1),
    data: {},
    status: 'draft',
    version: index + 1,
    updatedAt: new Date(Date.UTC(2026, 0, index + 1)).toISOString()
  }));
  const current = record({ version: 56, content: 'version 56', history: snapshots });
  const mock = installMock(t, { collection: 'Predictions', records: [current] });
  await store.save('Predictions', Object.assign({}, current, { content: 'new content' }), 'Tester');
  const saved = mock.getRecords()[0];
  assert.equal(saved.version, 57);
  assert.equal(saved.history.length, 50);
  assert.equal(saved.history[0].version, 8);
  assert.equal(saved.history[49].version, 56);
  assert.equal(saved.history[49].content, 'version 56');
});

test('history returns current version first, followed by prior versions in descending order', async t => {
  const current = record({
    version: 3,
    history: [
      { version: 1, updatedAt: '2026-01-01T00:00:00.000Z', content: 'one' },
      { version: 2, updatedAt: '2026-01-02T00:00:00.000Z', content: 'two' }
    ]
  });
  installMock(t, { collection: 'Predictions', records: [current] });
  const versions = await store.history('Predictions', current.id);
  assert.deepEqual(versions.map(item => item.version), [3, 2, 1]);
  assert.equal(versions[0].record.content, 'current content');
  assert.equal(versions[0].record.history, undefined);
});

test('rollback restores selected content but creates a new version and preserves the record ID', async t => {
  const current = record({
    version: 3,
    content: 'latest content',
    history: [
      { id: 'prediction-history-fixture', engineId: 'engine1', name: 'history.fixture', title: 'History fixture', content: 'restored content', data: {}, status: 'draft', version: 1, updatedAt: '2026-01-01T00:00:00.000Z' },
      { id: 'prediction-history-fixture', engineId: 'engine1', name: 'history.fixture', title: 'History fixture', content: 'middle content', data: {}, status: 'draft', version: 2, updatedAt: '2026-01-02T00:00:00.000Z' }
    ]
  });
  const mock = installMock(t, { collection: 'Predictions', records: [current] });
  const result = await store.rollback('Predictions', current.id, 1, 'Tester');
  assert.equal(result.rolledBackFrom, 1);
  assert.equal(result.record.id, current.id);
  assert.equal(result.record.content, 'restored content');
  assert.equal(result.record.version, 4);
  assert.equal(result.record.status, 'draft');
  assert.equal(mock.getRecords()[0].history.at(-1).version, 3);
});

test('rollback of a previously published version performs a save then a publish', async t => {
  const current = record({
    version: 2,
    content: 'draft now',
    history: [
      { id: 'prediction-history-fixture', engineId: 'engine1', name: 'history.fixture', title: 'History fixture', content: 'published content', data: {}, status: 'published', version: 1, updatedAt: '2026-01-01T00:00:00.000Z' }
    ]
  });
  const mock = installMock(t, { collection: 'Predictions', records: [current] });
  const result = await store.rollback('Predictions', current.id, 1, 'Tester');
  assert.equal(result.record.status, 'published');
  assert.equal(result.record.content, 'published content');
  assert.equal(result.record.version, 4);
  assert.equal(mock.getPutCount(), 2);
});

test('if republishing a restored published version fails, rollback leaves the saved record in Draft', async t => {
  const current = record({
    version: 2,
    content: 'draft now',
    history: [
      { id: 'prediction-history-fixture', engineId: 'engine1', name: 'history.fixture', title: 'History fixture', content: 'published content', data: {}, status: 'published', version: 1, updatedAt: '2026-01-01T00:00:00.000Z' }
    ]
  });
  const mock = installMock(t, {
    collection: 'Predictions',
    records: [current],
    putResponses: [{ status: 200 }, { status: 500, persist: false }]
  });
  await assert.rejects(store.rollback('Predictions', current.id, 1, 'Tester'), { message: 'GITHUB_API_ERROR' });
  assert.equal(mock.getPutCount(), 2);
  assert.equal(mock.getRecords()[0].status, 'draft');
  assert.equal(mock.getRecords()[0].content, 'published content');
  assert.equal(mock.getRecords()[0].version, 3);
});

test('save sends the current GitHub blob SHA and rejects a stale concurrent write without retrying', async t => {
  const current = record();
  const mock = installMock(t, {
    collection: 'Predictions',
    records: [current],
    putResponses: [{ status: 409, payload: { message: 'sha mismatch' }, persist: false }]
  });
  await assert.rejects(
    store.save('Predictions', Object.assign({}, current, { content: 'concurrent edit' }), 'Tester'),
    { message: 'GITHUB_WRITE_CONFLICT', status: 409 }
  );
  const put = mock.calls.find(call => call.method === 'PUT');
  assert.equal(put.body.sha, 'sha-current');
  assert.equal(mock.getPutCount(), 1);
  assert.equal(mock.getRecords()[0].content, 'current content');
});

test('GitHub 422 write conflicts are surfaced as concurrency conflicts', async t => {
  const current = record();
  installMock(t, {
    collection: 'Predictions',
    records: [current],
    putResponses: [{ status: 422, payload: { message: 'unprocessable update' }, persist: false }]
  });
  await assert.rejects(
    store.save('Predictions', Object.assign({}, current, { content: 'stale edit' }), 'Tester'),
    { message: 'GITHUB_WRITE_CONFLICT', status: 422 }
  );
});
