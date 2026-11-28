'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const adapterModule = require('../assets/js/prediction-compatibility.js');

function makePublishedFixture() {
  const Predictions = [];
  ['work', 'money', 'health', 'love', 'interest'].forEach((category) => {
    for (let n = 1; n <= 9; n++) {
      Predictions.push({
        id: `engine1:prediction:specific:${category}:${n}`,
        engineId: 'engine1', parentId: 'SPECIFIC_PREDICTIONS_DETAILED', status: 'published',
        data: { payload: { overview: `${category}-${n}`, detail: 'detail', advice: 'advice' } }
      });
    }
  });
  for (let n = 1; n <= 22; n++) {
    Predictions.push({
      id: `engine1:prediction:matrix-arcana:${n}`,
      engineId: 'engine1', parentId: 'MATRIX_ARCANA', status: 'published',
      data: { payload: { arcana: n, arcanaName: `Arcana ${n}`, hiddenBelief: 'belief', hiddenNeed: 'need', subconsciousPattern: 'pattern', reflectionPrompt: 'question', integrationGuidance: 'guidance' } }
    });
  }
  for (let n = 1; n <= 9; n++) {
    Predictions.push({
      id: `engine2:deity:${n}`, engineId: 'engine2', parentId: 'GOD_DATA', status: 'published',
      data: { payload: { rabbitNumber: n, godInfo: { name: `Deity ${n}` }, godRitual: { why: `Ritual ${n}` } } }
    });
  }
  return { Predictions };
}

test('resolves all 22 Matrix Destiny Arcana payloads', () => {
  const adapter = adapterModule.create(makePublishedFixture());
  for (let n = 1; n <= 22; n++) {
    const result = adapter.getMatrixArcana(n);
    assert.equal(result.arcana, n);
    assert.ok(result.hiddenBelief && result.hiddenNeed && result.subconsciousPattern);
    assert.ok(result.reflectionPrompt && result.integrationGuidance);
  }
  assert.equal(adapter.getMatrixArcana(0), null);
  assert.equal(adapter.getMatrixArcana(23), null);
});

test('resolves all 45 Engine 1 specific prediction payloads', () => {
  const adapter = adapterModule.create(makePublishedFixture());
  ['work', 'money', 'health', 'love', 'interest'].forEach((category) => {
    for (let n = 1; n <= 9; n++) {
      const result = adapter.getSpecificPrediction(category, n);
      assert.equal(result.overview, `${category}-${n}`);
      assert.equal(result.detail, 'detail');
      assert.equal(result.advice, 'advice');
    }
  });
  assert.equal(adapter.getSpecificPrediction('engine3', 7), null);
  assert.equal(adapter.getSpecificPrediction('love', 10), null);
});

test('resolves all 9 Engine 2 deity and ritual payloads without changing their contents', () => {
  const adapter = adapterModule.create(makePublishedFixture());
  for (let n = 1; n <= 9; n++) {
    const result = adapter.getDeity(n);
    assert.equal(result.godInfo.name, `Deity ${n}`);
    assert.equal(result.godRitual.why, `Ritual ${n}`);
  }
  assert.equal(adapter.getDeity(0), null);
  assert.equal(adapter.getDeity(10), null);
});

test('unpublished or incomplete Engine 2 records use the legacy fallback', () => {
  const adapter = adapterModule.create({ Predictions: [
    { id: 'engine2:deity:1', engineId: 'engine2', parentId: 'GOD_DATA', status: 'draft', data: { payload: { rabbitNumber: 1, godInfo: {}, godRitual: {} } } },
    { id: 'engine2:deity:2', engineId: 'engine2', parentId: 'GOD_DATA', status: 'published', data: { payload: { rabbitNumber: 2, godInfo: {} } } }
  ] });
  assert.equal(adapter.getDeity(1), null);
  assert.equal(adapter.getDeity(2), null);
});

test('returns null when central records are unavailable so legacy fallback can run', () => {
  const adapter = adapterModule.create({ Predictions: [] });
  assert.equal(adapter.getMatrixArcana(1), null);
  assert.equal(adapter.getSpecificPrediction('work', 1), null);
  assert.equal(adapter.getDeity(1), null);
});

test('global adapter reads the latest published runtime without rebuilding the page', () => {
  const previous = globalThis.RABBITASTRO_PREDICTION_RUNTIME;
  globalThis.RABBITASTRO_PREDICTION_RUNTIME = makePublishedFixture();
  try {
    assert.equal(adapterModule.getMatrixArcana(22).arcana, 22);
    assert.equal(adapterModule.getSpecificPrediction('interest', 9).overview, 'interest-9');
    assert.equal(adapterModule.getDeity(9).godInfo.name, 'Deity 9');
  } finally {
    if (previous === undefined) delete globalThis.RABBITASTRO_PREDICTION_RUNTIME;
    else globalThis.RABBITASTRO_PREDICTION_RUNTIME = previous;
  }
});
