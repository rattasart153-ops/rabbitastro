'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'assets/js/02-horakratai-engine.js'), 'utf8');
const predictions = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/predictions/predictions.json'), 'utf8'));
const mappings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/predictions/mappings.json'), 'utf8'));

function readObject(marker) {
  const markerIndex = source.indexOf(marker);
  assert.notEqual(markerIndex, -1, marker + ' exists');
  const start = source.indexOf('{', markerIndex);
  let depth = 0, inString = false, escaped = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) return vm.runInNewContext('(' + source.slice(start, i + 1) + ')');
  }
  throw new Error('Unclosed object: ' + marker);
}

test('Engine 2 central drafts preserve every GOD_DATA and GOD_RITUAL field for all 9 rabbit numbers', () => {
  const gods = readObject('var GOD_DATA');
  const rituals = readObject('var GOD_RITUAL');
  const records = predictions.records.filter(x => x.engineId === 'engine2' && x.parentId === 'GOD_DATA');
  assert.equal(records.length, 9);
  for (let n = 1; n <= 9; n++) {
    const record = records.find(x => x.id === 'engine2:deity:' + n);
    assert.ok(record, 'missing deity ' + n);
    assert.equal(record.status, 'draft');
    assert.deepEqual(JSON.parse(JSON.stringify(record.data.payload.godInfo)), JSON.parse(JSON.stringify(gods[n])));
    assert.deepEqual(JSON.parse(JSON.stringify(record.data.payload.godRitual)), JSON.parse(JSON.stringify(rituals[n])));
  }
});

test('Engine 2 mappings preserve the original rabbit-number lookup and default feature', () => {
  const records = mappings.records.filter(x => x.engineId === 'engine2' && x.parentId === 'GOD_DATA');
  assert.equal(records.length, 9);
  for (let n = 1; n <= 9; n++) {
    const record = records.find(x => x.id === 'engine2:mapping:deity:' + n);
    assert.ok(record);
    assert.equal(record.status, 'draft');
    assert.equal(record.data.predictionId, 'engine2:deity:' + n);
    assert.equal(record.data.rabbitNumber, n);
    assert.equal(record.data.feature, 'default');
  }
});
