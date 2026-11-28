'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const adapterModule = require('../assets/js/prediction-compatibility.js');

test('returns Matrix Destiny subconscious payload by Arcana number', () => {
  const payload = { arcana: 15, arcanaName: 'ปีศาจ', hiddenBelief: 'กลัวการสูญเสีย', hiddenNeed: 'อิสระ', subconsciousPattern: 'ยึดติด', reflectionPrompt: 'ฉันกลัวอะไร?', integrationGuidance: 'ค่อย ๆ เลือกใหม่' };
  const adapter = adapterModule.create({ Predictions: [{ id: 'engine1:prediction:matrix-arcana:15', data: { payload } }] });
  assert.deepEqual(adapter.getMatrixArcana(15), payload);
  assert.equal(adapter.getMatrixArcana(23), null);
});

test('returns structured Engine 1 specific prediction and rejects invalid lookup', () => {
  const payload = { overview: 'ภาพรวม', detail: 'รายละเอียด', advice: 'คำแนะนำ' };
  const adapter = adapterModule.create({ Predictions: [{ id: 'engine1:prediction:specific:love:7', data: { payload } }] });
  assert.deepEqual(adapter.getSpecificPrediction('love', 7), payload);
  assert.equal(adapter.getSpecificPrediction('engine3', 7), null);
  assert.equal(adapter.getSpecificPrediction('love', 10), null);
});

test('falls back cleanly when no published central records are available', () => {
  const adapter = adapterModule.create({ Predictions: [] });
  assert.equal(adapter.getMatrixArcana(1), null);
  assert.equal(adapter.getSpecificPrediction('work', 1), null);
});
