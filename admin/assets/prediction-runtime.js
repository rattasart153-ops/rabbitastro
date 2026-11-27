(function () {
  "use strict";
  var runtime = null;
  var loadPromise = null;
  var results = document.getElementById("results");
  var lastContextKey = "";

  function loadRuntime(force) {
    if (runtime && !force) return Promise.resolve(runtime);
    if (loadPromise && !force) return loadPromise;
    loadPromise = fetch("/api/predictions", { method: "GET", cache: "no-store", credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) throw new Error("PREDICTION_RUNTIME_UNAVAILABLE");
        return response.json();
      })
      .then(function (data) {
        if (!data || !data.ok || !data.runtime) throw new Error("PREDICTION_RUNTIME_UNAVAILABLE");
        runtime = data.runtime;
        window.RABBITASTRO_PREDICTION_RUNTIME = runtime;
        applySystemVisibility();
        return runtime;
      })
      .catch(function () { runtime = null; return null; })
      .finally(function () { loadPromise = null; });
    return loadPromise;
  }

  function applySystemVisibility() {
    if (!runtime) return;
    var enabledEngines = {};
    (runtime.Engines || []).forEach(function (item) { enabledEngines[item.id] = item.status === "active"; });
    var tabs = [
      ["engine1", "tabPerson"], ["engine2", "tabGod"],
      ["engine3", "tabOreguram"], ["engine4", "tabTarotRune"]
    ];
    tabs.forEach(function (entry) {
      var tab = document.getElementById(entry[1]);
      if (tab) tab.hidden = enabledEngines[entry[0]] === false;
    });
    var active = document.querySelector(".tab-btn.active");
    if (active && active.hidden) {
      var first = tabs.map(function (entry) { return document.getElementById(entry[1]); })
        .filter(function (node) { return node && !node.hidden; })[0];
      if (first) first.click();
    }
    var features = runtime.Features || [];
    if (features.length) {
      var enabled = {};
      features.forEach(function (item) {
        if (item.engineId === "engine1" && item.data) enabled[item.data.key] = item.status === "active";
      });
      var controls = [
        ["natal", '#baseViewGroup [data-view="natal"]'],
        ["asc", '#baseViewGroup [data-view="asc"]'],
        ["rhd", '#baseViewGroup [data-view="rhd"]'],
        ["short", '#topicViewGroup [data-view="short"]'],
        ["month", '#topicViewGroup [data-view="month"]']
      ];
      controls.forEach(function (entry) {
        var node = document.querySelector(entry[1]);
        if (node) node.hidden = enabled[entry[0]] === false;
      });
      var hasBase = ["natal","asc","rhd"].some(function (key) { return enabled[key] !== false; });
      var hasTopic = ["short","month"].some(function (key) { return enabled[key] !== false; });
      var baseMode = document.querySelector('#modeGroup [data-mode="base"]');
      var topicMode = document.querySelector('#modeGroup [data-mode="topic"]');
      if (baseMode) baseMode.hidden = !hasBase;
      if (topicMode) topicMode.hidden = !hasTopic;
      var rhd = document.getElementById("rhdControl");
      var baseBar = document.getElementById("baseBar");
      var topicBar = document.getElementById("topicBar");
      if (rhd) rhd.hidden = enabled.rhd === false;
      if (baseBar) baseBar.hidden = !hasBase;
      if (topicBar) topicBar.hidden = !hasTopic;
      ["baseViewGroup","topicViewGroup"].forEach(function (id) {
        var group = document.getElementById(id);
        if (!group) return;
        var current = group.querySelector(".chip-btn.active");
        if (current && current.hidden) {
          var next = Array.prototype.slice.call(group.querySelectorAll(".chip-btn")).filter(function (node) { return !node.hidden; })[0];
          if (next) next.click();
        }
      });
      var currentMode = document.querySelector('#modeGroup .chip-btn.active');
      if (currentMode && currentMode.hidden) {
        var nextMode = document.querySelector('#modeGroup .chip-btn:not([hidden])');
        if (nextMode) nextMode.click();
      }
    }
  }
  window.RABBITASTRO_APPLY_SYSTEM_VISIBILITY = applySystemVisibility;

  function selectedValue(selector, attribute) {
    var node = document.querySelector(selector + " .active");
    return node ? (node.getAttribute(attribute) || node.textContent.trim()) : "";
  }

  function getContext() {
    var activeTab = document.querySelector(".tab-btn.active");
    var tabId = activeTab ? activeTab.id : "tabPerson";
    var engine = tabId === "tabGod" ? "engine2" : tabId === "tabOreguram" ? "engine3" : tabId === "tabTarotRune" ? "engine4" : "engine1";
    var mode = selectedValue("#modeGroup", "data-mode") || "base";
    var feature = "default";
    var category = "";
    var topic = "";
    if (engine === "engine1") {
      if (mode === "topic") {
        feature = selectedValue("#topicViewGroup", "data-view") || "short";
        category = selectedValue("#catGroup", "data-cat");
        var activeSub = document.querySelector("#subTopicGroup .active");
        topic = activeSub ? activeSub.textContent.trim() : "";
      } else {
        var base = selectedValue("#baseViewGroup", "data-view") || "natal";
        feature = base === "natal" ? "base" : base;
      }
    } else if (engine === "engine3") {
      feature = "default";
    } else if (engine === "engine4") {
      feature = "default";
    }
    var value = function (id) { var el = document.getElementById(id); return el ? el.value : ""; };
    var noTime = document.getElementById("noBirthTime");
    var question = document.getElementById("oreguramQuestion");
    return {
      engine: engine,
      feature: feature,
      category: category,
      topic: topic,
      person: { firstName: value("fName"), lastName: value("fLast") },
      birth: { day: Number(value("bDay")) || 0, month: Number(value("bMonth")) || 0, year: Number(value("bYear")) || 0, hour: Number(value("bHour")) || 0, minute: Number(value("bMin")) || 0, noBirthTime: !!(noTime && noTime.checked) },
      oreguram: { questionId: question ? Number(question.value) || 0 : 0 },
      tarotRune: {}
    };
  }

  function getPath(object, path) {
    return String(path || "").split(".").reduce(function (value, key) {
      return value == null ? undefined : value[key];
    }, object);
  }

  function resolveVariable(name, context) {
    var definitions = runtime && runtime.Variables ? runtime.Variables : [];
    var definition = definitions.filter(function (item) {
      if (item.engineId !== context.engine) return false;
      var data = item.data || {};
      return data.key === name || item.name === name;
    })[0];
    if (!definition) return getPath(context, name);
    var config = definition.data || {};
    var value = config.source ? getPath(context, config.source) : getPath(context, name);
    if (value == null && Object.prototype.hasOwnProperty.call(config, "defaultValue")) value = config.defaultValue;
    if (config.dataType === "number" && value != null && value !== "") value = Number(value);
    if (config.dataType === "boolean") value = value === true || value === "true" || value === 1;
    return value;
  }

  function compare(actual, operator, expected) {
    if (operator === "exists") return expected === false ? actual == null : actual != null;
    if (operator === "eq") return String(actual) === String(expected);
    if (operator === "neq") return String(actual) !== String(expected);
    if (operator === "gt") return Number(actual) > Number(expected);
    if (operator === "gte") return Number(actual) >= Number(expected);
    if (operator === "lt") return Number(actual) < Number(expected);
    if (operator === "lte") return Number(actual) <= Number(expected);
    if (operator === "in") return Array.isArray(expected) && expected.map(String).indexOf(String(actual)) >= 0;
    if (operator === "between") return Array.isArray(expected) && expected.length === 2 && Number(actual) >= Number(expected[0]) && Number(actual) <= Number(expected[1]);
    if (operator === "contains") return Array.isArray(actual) ? actual.map(String).indexOf(String(expected)) >= 0 : String(actual == null ? "" : actual).indexOf(String(expected)) >= 0;
    return false;
  }

  function ruleMatches(rule, context) {
    var data = rule.data || {};
    if (data.slot && data.slot !== context.engine + "." + context.feature && data.slot !== context.engine + ".default") return false;
    if (data.feature && data.feature !== context.feature) return false;
    if (data.category && data.category !== context.category) return false;
    if (data.topic && data.topic !== context.topic) return false;
    var conditions = Array.isArray(data.conditions) ? data.conditions : [];
    if (!conditions.length) return !!(data.slot || data.feature || data.category || data.topic);
    var outcomes = conditions.map(function (condition) {
      return compare(resolveVariable(condition.variable, context), condition.operator, condition.value);
    });
    return String(data.logic || "AND").toUpperCase() === "OR" ? outcomes.some(Boolean) : outcomes.every(Boolean);
  }

  function predictionMatches(prediction, context) {
    var data = prediction.data || {};
    if (data.slot && data.slot !== context.engine + "." + context.feature && data.slot !== context.engine + ".default") return false;
    if (data.feature && data.feature !== context.feature) return false;
    if (data.category && data.category !== context.category) return false;
    if (data.topic && data.topic !== context.topic) return false;
    return !!(data.slot || data.feature || data.category || data.topic);
  }


  function renderTemplate(value, context) {
    return String(value == null ? "" : value).replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, function (match, key) {
      var resolved = resolveVariable(key, context);
      return resolved == null ? "" : String(resolved);
    });
  }

  function renderCentralBlock(context) {
    if (!runtime || !results || !results.isConnected) return;
    var predictions = runtime.Predictions || [];
    var rules = runtime.Rules || [];
    var byId = {};
    predictions.forEach(function (item) { byId[item.id] = item; });
    var selected = [];
    rules.filter(function (rule) { return rule.engineId === context.engine && ruleMatches(rule, context); })
      .sort(function (a, b) { return Number(b.priority || 0) - Number(a.priority || 0) || Number(a.sortOrder || 0) - Number(b.sortOrder || 0); })
      .forEach(function (rule) {
        var target = byId[(rule.data || {}).predictionId];
        if (target && target.engineId === context.engine && selected.indexOf(target) < 0) selected.push(target);
      });
    (runtime.Mappings || []).filter(function (mapping) {
      return mapping.engineId === context.engine && ruleMatches(mapping, context);
    }).sort(function (a, b) {
      return Number(b.priority || 0) - Number(a.priority || 0) || Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    }).forEach(function (mapping) {
      var target = byId[(mapping.data || {}).predictionId];
      if (target && target.engineId === context.engine && selected.indexOf(target) < 0) selected.push(target);
    });
    predictions.filter(function (item) {
      return item.engineId === context.engine && predictionMatches(item, context);
    }).sort(function (a, b) {
      return Number(b.priority || 0) - Number(a.priority || 0) || Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    }).forEach(function (item) {
      if (selected.indexOf(item) < 0) selected.push(item);
    });
    if (!selected.length) return;

    var section = document.createElement("section");
    section.setAttribute("data-central-predictions", "true");
    section.style.cssText = "margin-top:16px;padding:16px;border:1px solid #e7cdb5;border-left:4px solid #a66a3f;border-radius:12px;background:#fffaf5;";
    var heading = document.createElement("h3");
    heading.textContent = "📚 คำทำนายจากคลังส่วนกลาง";
    heading.style.cssText = "margin:0 0 12px;color:#704526;font-size:17px;";
    section.appendChild(heading);
    selected.forEach(function (item) {
      var article = document.createElement("article");
      article.style.cssText = "padding:11px 0;border-top:1px solid #eadfd5;line-height:1.8;white-space:pre-wrap;";
      var title = document.createElement("strong");
      title.textContent = item.title || item.name || "คำทำนาย";
      title.style.display = "block";
      article.appendChild(title);
      var body = document.createElement("div");
      body.textContent = renderTemplate(item.content || item.description || "", context);
      article.appendChild(body);
      section.appendChild(article);
    });
    results.appendChild(section);
  }

  function refresh() {
    if (!results || results.style.display === "none" || !results.childNodes.length) return;
    if (results.querySelector("[data-central-predictions]")) return;
    var context = getContext();
    var key = JSON.stringify(context);
    if (key === lastContextKey && runtime) return;
    lastContextKey = key;
    if (runtime) renderCentralBlock(context);
    else loadRuntime(false).then(function () {
      if (results && results.style.display !== "none" && !results.querySelector("[data-central-predictions]")) renderCentralBlock(getContext());
    });
  }

  if (results && typeof MutationObserver !== "undefined") {
    new MutationObserver(function () { refresh(); }).observe(results, { childList: true, subtree: false });
  }
  window.RABBITASTRO_RELOAD_PREDICTIONS = function () {
    lastContextKey = "";
    if (results) {
      var oldBlock = results.querySelector("[data-central-predictions]");
      if (oldBlock) oldBlock.remove();
    }
    return loadRuntime(true).then(function () {
      if (results && results.style.display !== "none" && results.childNodes.length) renderCentralBlock(getContext());
    });
  };
  loadRuntime(false);
})();
