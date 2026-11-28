(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(typeof globalThis !== 'undefined' ? globalThis : root);
  else root.RABBITASTRO_PREDICTION_ADAPTER = factory(root);
})(typeof window !== 'undefined' ? window : this, function (root) {
  'use strict';

  function create(runtime) {
    var predictions = runtime && Array.isArray(runtime.Predictions) ? runtime.Predictions : [];
    var byId = Object.create(null);
    predictions.forEach(function (record) { if (record && record.id) byId[record.id] = record; });

    function getMatrixArcana(number) {
      var n = Number(number);
      if (!Number.isInteger(n) || n < 1 || n > 22) return null;
      var record = byId['engine1:prediction:matrix-arcana:' + n];
      var payload = record && record.data && record.data.payload;
      return payload && payload.arcana === n ? payload : null;
    }

    function getDeity(number) {
      var n = Number(number);
      if (!Number.isInteger(n) || n < 1 || n > 9) return null;
      var record = byId['engine2:deity:' + n];
      if (!record || record.engineId !== 'engine2' || record.parentId !== 'GOD_DATA' || record.status !== 'published') return null;
      var payload = record.data && record.data.payload;
      if (!payload || payload.rabbitNumber !== n || !payload.godInfo || !payload.godRitual) return null;
      return { godInfo: payload.godInfo, godRitual: payload.godRitual };
    }

    function getSpecificPrediction(category, resultNumber) {
      var categories = ['work', 'money', 'health', 'love', 'interest'];
      var n = Number(resultNumber);
      if (categories.indexOf(String(category)) < 0 || !Number.isInteger(n) || n < 1 || n > 9) return null;
      var record = byId['engine1:prediction:specific:' + category + ':' + n];
      var payload = record && record.data && record.data.payload;
      if (!payload || typeof payload.overview !== 'string') return null;
      return { overview: payload.overview, detail: payload.detail || '', advice: payload.advice || '' };
    }

    return { getMatrixArcana: getMatrixArcana, getSpecificPrediction: getSpecificPrediction, getDeity: getDeity };
  }

  var adapter = {
    create: create,
    getMatrixArcana: function (number) {
      return create(root.RABBITASTRO_PREDICTION_RUNTIME).getMatrixArcana(number);
    },
    getSpecificPrediction: function (category, resultNumber) {
      return create(root.RABBITASTRO_PREDICTION_RUNTIME).getSpecificPrediction(category, resultNumber);
    },
    getDeity: function (number) {
      return create(root.RABBITASTRO_PREDICTION_RUNTIME).getDeity(number);
    }
  };

  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    window.fetch('/api/public-predictions', { method: 'GET', cache: 'no-store', credentials: 'same-origin' })
      .then(function (response) { if (!response.ok) throw new Error('PUBLIC_PREDICTIONS_UNAVAILABLE'); return response.json(); })
      .then(function (data) {
        if (!data || !data.ok || !data.runtime) throw new Error('INVALID_PUBLIC_PREDICTIONS');
        window.RABBITASTRO_PREDICTION_RUNTIME = data.runtime;
        window.dispatchEvent(new CustomEvent('rabbitastro:predictions-ready', { detail: { count: (data.runtime.Predictions || []).length } }));
      })
      .catch(function (error) {
        // Legacy JS data remains the fallback; a missing/unpublished central collection is non-fatal.
        if (window.console && console.info) console.info('Rabbitastro central predictions unavailable; using legacy fallback.', error.message);
      });
  }

  return adapter;
});
