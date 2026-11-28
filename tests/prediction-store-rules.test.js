'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const store = require('../api/_prediction-store');

test('all 22 AGE_CYCLE_PROFILE records pass the dedicated profile schema', () => {
  const collection = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'predictions', 'rules.json'), 'utf8'));
  const profiles = collection.records.filter(record => record.parentId === 'AGE_CYCLE_PROFILE');
  assert.equal(profiles.length, 22);
  for (const record of profiles) {
    assert.equal(record.data.ruleType, 'AGE_CYCLE_PROFILE', record.id);
    assert.doesNotThrow(() => store.validateRecord('Rules', record), record.id);
  }
});

test('AGE_CYCLE_PROFILE rejects missing or out-of-range interpretation scores', () => {
  const base = { engineId: 'engine1', parentId: 'AGE_CYCLE_PROFILE', data: { ruleType: 'AGE_CYCLE_PROFILE', profile: { support: 3, challenge: 1 } } };
  assert.throws(() => store.validateRecord('Rules', { ...base, data: { ...base.data, profile: { support: 0, challenge: 1 } } }), { message: 'INVALID_AGE_CYCLE_PROFILE' });
  assert.throws(() => store.validateRecord('Rules', { ...base, data: { ruleType: 'AGE_CYCLE_PROFILE' } }), { message: 'INVALID_AGE_CYCLE_PROFILE' });
});

test('ordinary Rules retain prediction target, conditions, logic and scope validation', () => {
  const valid = { engineId: 'engine1', parentId: 'ordinary-rule', data: {
    predictionId: 'prediction-1', slot: 'engine1.base', logic: 'AND',
    conditions: [{ variable: 'birth.month', operator: 'eq', value: 1 }]
  } };
  assert.doesNotThrow(() => store.validateRecord('Rules', valid));
  assert.throws(() => store.validateRecord('Rules', { ...valid, data: { ...valid.data, predictionId: '' } }), { message: 'PREDICTION_TARGET_REQUIRED' });
  assert.throws(() => store.validateRecord('Rules', { ...valid, data: { ...valid.data, conditions: [] } }), { message: 'RULE_CONDITIONS_REQUIRED' });
  assert.throws(() => store.validateRecord('Rules', { ...valid, data: { ...valid.data, slot: '', feature: '', category: '', topic: '' } }), { message: 'MAPPING_SCOPE_REQUIRED' });
});

test('Mappings keep their existing prediction target and scope requirements', () => {
  const valid = { engineId: 'engine1', data: { predictionId: 'prediction-1', feature: 'natal' } };
  assert.doesNotThrow(() => store.validateRecord('Mappings', valid));
  assert.throws(() => store.validateRecord('Mappings', { engineId: 'engine1', data: { feature: 'natal' } }), { message: 'PREDICTION_TARGET_REQUIRED' });
});

test('AGE_CYCLE_PROFILE publish does not require a linked Prediction record', async () => {
  const originalFetch = global.fetch;
  const originalToken = process.env.GITHUB_TOKEN;
  const calls = [];
  const profileRecord = {
    id: 'age-profile-fixture', engineId: 'engine1', parentId: 'AGE_CYCLE_PROFILE',
    name: 'AGE_CYCLE_PROFILE.fixture', title: 'Age profile fixture',
    data: { ruleType: 'AGE_CYCLE_PROFILE', profile: { support: 3, challenge: 1 } },
    status: 'draft', version: 1, sortOrder: 1
  };
  const collection = Buffer.from(JSON.stringify({ schemaVersion: 1, collection: 'Rules', records: [profileRecord] })).toString('base64');
  process.env.GITHUB_TOKEN = 'test-token';
  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), method: options.method || 'GET' });
    if (String(url).includes('/contents/data/predictions/rules.json?')) {
      return { ok: true, json: async () => ({ type: 'file', sha: 'rules-sha', content: collection }) };
    }
    if (String(url).includes('/contents/data/predictions/rules.json') && options.method === 'PUT') {
      return { ok: true, json: async () => ({ commit: { sha: 'published-commit' } }) };
    }
    throw new Error('Unexpected GitHub request: ' + url);
  };
  try {
    const result = await store.publish('Rules', profileRecord.id, 'Full Admin');
    assert.equal(result.status, 'published');
    assert.equal(result.data.profile.support, 3);
    assert.equal(calls.filter(call => call.url.includes('predictions.json')).length, 0);
    assert.ok(calls.some(call => call.method === 'PUT'));
  } finally {
    global.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = originalToken;
  }
});
