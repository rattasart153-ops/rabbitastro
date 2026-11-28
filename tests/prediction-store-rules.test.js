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
