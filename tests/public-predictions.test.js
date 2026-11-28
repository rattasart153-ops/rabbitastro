'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'api', 'public-predictions.js'), 'utf8');

test('public prediction endpoint exposes only published allowlisted Engine 1 and Engine 2 records', async () => {
  const store = { async runtime() { return { Predictions: [
    { id: 'e1-matrix', engineId: 'engine1', parentId: 'MATRIX_ARCANA', status: 'published', title: 'Arcana', content: '', data: { payload: { arcana: 1 }, secret: 'hidden' }, history: [{ version: 1 }] },
    { id: 'e1-draft', engineId: 'engine1', parentId: 'MATRIX_ARCANA', status: 'draft', title: 'Draft', content: '', data: { payload: {} } },
    { id: 'e2-deity', engineId: 'engine2', parentId: 'GOD_DATA', status: 'published', title: 'Deity', content: '', data: { payload: { rabbitNumber: 1, godInfo: { name: 'Deity' }, godRitual: {} }, secret: 'hidden' }, history: [{ version: 1 }] },
    { id: 'e2-wrong-parent', engineId: 'engine2', parentId: 'OTHER', status: 'published', title: 'Wrong', content: '', data: { payload: {} } },
    { id: 'e3', engineId: 'engine3', parentId: 'OREGURAM', status: 'published', title: 'Other engine', content: '', data: { payload: {} } }
  ] }; } };
  const module = { exports: {} };
  const handler = vm.runInNewContext('(function(require, module) { ' + source + '\n; return module.exports; })', {})(
    id => { if (id === './_prediction-store') return store; throw new Error('Unexpected module: ' + id); }, module
  );
  const headers = {};
  const res = { statusCode: 200, headers, payload: null, setHeader(k,v){headers[k]=v;}, status(c){this.statusCode=c;return this;}, json(v){this.payload=v;return this;} };
  await handler({ method: 'GET' }, res);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(JSON.parse(JSON.stringify(res.payload.runtime.Predictions.map(x => x.id))), ['e1-matrix', 'e2-deity']);
  assert.equal(res.payload.runtime.Predictions[1].data.payload.godInfo.name, 'Deity');
  assert.equal(res.payload.runtime.Predictions[1].data.secret, undefined);
  assert.equal(res.payload.runtime.Predictions[1].history, undefined);
  assert.match(headers['Cache-Control'], /s-maxage=60/);
});

test('public prediction endpoint remains GET-only', async () => {
  const module = { exports: {} };
  const handler = vm.runInNewContext('(function(require, module) { ' + source + '\n; return module.exports; })', {})(
    () => ({ runtime: async () => { throw new Error('must not run'); } }), module
  );
  const headers = {};
  const res = { statusCode: 200, headers, setHeader(k,v){headers[k]=v;}, status(c){this.statusCode=c;return this;}, json(v){this.payload=v;return this;} };
  await handler({ method: 'POST' }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(headers.Allow, 'GET');
});
