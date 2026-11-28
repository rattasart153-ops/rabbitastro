'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const store = require('../api/_prediction-store');

const mappings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'predictions', 'mappings.json'), 'utf8')).records;

test('all 45 SPECIFIC_PREDICTIONS_DETAILED mappings pass the legacy category/result schema', () => {
  const records = mappings.filter(record => record.parentId === 'SPECIFIC_PREDICTIONS_DETAILED');
  assert.equal(records.length, 45);
  const expectedCategories = ['work', 'money', 'health', 'love', 'interest'];
  for (const category of expectedCategories) {
    const group = records.filter(record => record.data.legacyCategory === category);
    assert.equal(group.length, 9, category);
    for (const record of group) {
      assert.equal(record.data.lookupType, 'legacy-category-result', record.id);
      assert.equal(record.data.resultNumber >= 1 && record.data.resultNumber <= 9, true, record.id);
      assert.equal(record.data.predictionId, 'engine1:prediction:specific:' + category + ':' + record.data.resultNumber, record.id);
      assert.equal(record.data.legacySourcePath, 'SPECIFIC_PREDICTIONS_DETAILED.' + category + '.' + record.data.resultNumber, record.id);
      assert.doesNotThrow(() => store.validateRecord('Mappings', record), record.id);
    }
  }
});

test('specific prediction mappings reject invalid or mismatched legacy keys', () => {
  const valid = mappings.find(record => record.parentId === 'SPECIFIC_PREDICTIONS_DETAILED');
  const invalidCases = [
    { ...valid.data, legacyCategory: 'career' },
    { ...valid.data, resultNumber: 0 },
    { ...valid.data, resultNumber: 10 },
    { ...valid.data, resultNumber: 1.5 },
    { ...valid.data, lookupType: 'unknown' },
    { ...valid.data, predictionId: 'engine1:prediction:specific:money:1' },
    { ...valid.data, legacySourcePath: 'SPECIFIC_PREDICTIONS_DETAILED.money.1' },
    { ...valid.data, adapterRequired: false }
  ];
  for (const data of invalidCases) {
    assert.throws(() => store.validateRecord('Mappings', { ...valid, data }), { message: 'INVALID_SPECIFIC_PREDICTION_MAPPING' });
  }
});

test('all 22 Matrix Arcana mappings retain their feature-based schema', () => {
  const records = mappings.filter(record => record.parentId === 'MATRIX_ARCANA');
  assert.equal(records.length, 22);
  for (const record of records) {
    assert.equal(record.data.feature, 'matrix-destiny', record.id);
    assert.equal(record.data.arcana >= 1 && record.data.arcana <= 22, true, record.id);
    assert.equal(record.data.predictionId, 'engine1:prediction:matrix-arcana:' + record.data.arcana, record.id);
    assert.doesNotThrow(() => store.validateRecord('Mappings', record), record.id);
  }
});

test('ordinary Mappings keep the prediction target and scope requirements', () => {
  const valid = { engineId: 'engine2', parentId: 'ordinary', data: { predictionId: 'prediction-1', feature: 'daily' } };
  assert.doesNotThrow(() => store.validateRecord('Mappings', valid));
  assert.throws(() => store.validateRecord('Mappings', { ...valid, data: { feature: 'daily' } }), { message: 'PREDICTION_TARGET_REQUIRED' });
  assert.throws(() => store.validateRecord('Mappings', { ...valid, data: { predictionId: 'prediction-1' } }), { message: 'MAPPING_SCOPE_REQUIRED' });
});

test('archived records cannot be published and do not trigger linked-record reads or writes', async () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_TOKEN;
  const calls = [];
  const archived = {
    id: 'archived-fixture', engineId: 'engine1', parentId: 'fixture',
    name: 'archived.fixture', title: 'Archived fixture',
    data: { predictionId: 'prediction-1', feature: 'natal' },
    status: 'archived', version: 3, sortOrder: 1
  };
  const collection = Buffer.from(JSON.stringify({ schemaVersion: 1, collection: 'Mappings', records: [archived] })).toString('base64');
  process.env.GITHUB_TOKEN = 'test-token';
  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method || 'GET' });
    if (String(url).includes('/contents/data/predictions/mappings.json?')) {
      return { ok: true, json: async () => ({ type: 'file', sha: 'mappings-sha', content: collection }) };
    }
    throw new Error('Unexpected GitHub request: ' + url);
  };
  try {
    await assert.rejects(store.publish('Mappings', archived.id, 'Full Admin'), { message: 'ARCHIVED_RECORD_CANNOT_PUBLISH' });
    assert.equal(calls.some(call => call.method === 'PUT'), false);
    assert.equal(calls.some(call => call.url.includes('predictions.json')), false);
  } finally {
    global.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = originalToken;
  }
});
