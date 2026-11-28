"use strict";
const crypto = require("crypto");

const OWNER_REPO = process.env.GITHUB_REPOSITORY || "rattasart153-ops/rabbitastro";
const BRANCH = process.env.PREDICTION_BRANCH || "test-matrix-of-destiny-rhd";
const ROOT = "data/predictions/";
const COLLECTIONS = {
  Engines: "engines.json",
  Features: "features.json",
  Categories: "categories.json",
  Topics: "topics.json",
  Variables: "variables.json",
  Predictions: "predictions.json",
  Rules: "rules.json",
  Mappings: "mappings.json"
};
const ALLOWED_ENGINES = new Set(["engine1", "engine2", "engine3", "engine4"]);
const OPERATORS = new Set(["eq", "neq", "gt", "gte", "lt", "lte", "in", "between", "contains", "exists"]);

function config() {
  if (!process.env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN_NOT_CONFIGURED");
  return {
    token: process.env.GITHUB_TOKEN,
    repo: OWNER_REPO,
    branch: BRANCH
  };
}

async function github(path, options) {
  const cfg = config();
  const response = await fetch("https://api.github.com/repos/" + cfg.repo + path, {
    method: options && options.method || "GET",
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": "Bearer " + cfg.token,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: options && options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(response.status === 409 || response.status === 422 ? "GITHUB_WRITE_CONFLICT" : "GITHUB_API_ERROR");
    error.status = response.status;
    throw error;
  }
  return data;
}

function pathFor(collection) {
  if (!Object.prototype.hasOwnProperty.call(COLLECTIONS, collection)) throw new Error("INVALID_COLLECTION");
  return ROOT + COLLECTIONS[collection];
}

async function readCollection(collection) {
  const path = pathFor(collection);
  const cfg = config();
  const data = await github("/contents/" + path.split("/").map(encodeURIComponent).join("/") + "?ref=" + encodeURIComponent(cfg.branch));
  if (data.type !== "file" || !data.content) throw new Error("INVALID_JSON_STORE");
  const decoded = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
  const parsed = JSON.parse(decoded);
  if (!parsed || parsed.schemaVersion !== 1 || parsed.collection !== collection || !Array.isArray(parsed.records)) {
    throw new Error("INVALID_JSON_STORE");
  }
  return { path, sha: data.sha, records: parsed.records };
}

async function writeCollection(collection, current, records, message) {
  const cfg = config();
  const content = Buffer.from(JSON.stringify({
    schemaVersion: 1,
    collection,
    updatedAt: new Date().toISOString(),
    records
  }, null, 2) + "\n", "utf8").toString("base64");
  const body = { message, content, branch: cfg.branch };
  if (current && current.sha) body.sha = current.sha;
  const result = await github("/contents/" + current.path.split("/").map(encodeURIComponent).join("/"), {
    method: "PUT",
    body
  });
  return result.commit && result.commit.sha;
}

function cleanRecord(record, old, actor) {
  const now = new Date().toISOString();
  const id = String(record.id || (crypto.randomUUID ? crypto.randomUUID() : "rec-" + Date.now() + "-" + Math.random().toString(16).slice(2)));
  const priorHistory = old && Array.isArray(old.history) ? old.history.slice(-49) : [];
  if (old) {
    const snapshot = Object.assign({}, old);
    delete snapshot.history;
    priorHistory.push(snapshot);
  }
  const status = String(record.status || "draft");
  const allowedStatus = new Set(["draft", "inactive", "active", "published", "archived"]);
  if (!allowedStatus.has(status)) throw new Error("INVALID_STATUS");
  const normalized = {
    id,
    engineId: String(record.engineId || ""),
    parentId: String(record.parentId || ""),
    name: String(record.name || "").trim().slice(0, 160),
    title: String(record.title || "").trim().slice(0, 200),
    description: String(record.description || "").slice(0, 1000),
    content: String(record.content || "").slice(0, 40000),
    data: record.data && typeof record.data === "object" && !Array.isArray(record.data) ? record.data : {},
    priority: Number.isFinite(Number(record.priority)) ? Number(record.priority) : 100,
    status: status === "published" ? "draft" : status,
    version: old ? Number(old.version || 1) + 1 : 1,
    sortOrder: Number.isFinite(Number(record.sortOrder)) ? Number(record.sortOrder) : 100,
    createdAt: old && old.createdAt || now,
    updatedAt: now,
    updatedBy: actor,
    history: priorHistory
  };
  if (!normalized.name && !normalized.title) throw new Error("NAME_OR_TITLE_REQUIRED");
  return normalized;
}

function validateRecord(collection, record) {
  if (collection !== "Engines" && !ALLOWED_ENGINES.has(record.engineId)) throw new Error("INVALID_ENGINE");
  if (collection === "Engines" && !ALLOWED_ENGINES.has(record.engineId || record.id)) throw new Error("INVALID_ENGINE");
  if (collection === "Rules" || collection === "Mappings") {
    const data = record.data || {};
    if (collection === "Rules" && (record.parentId === "AGE_CYCLE_PROFILE" || data.ruleType === "AGE_CYCLE_PROFILE")) {
      // AGE_CYCLE_PROFILE is an interpretation profile, not a conditional prediction rule.
      const profile = data.profile;
      if (!profile || !Number.isInteger(profile.support) || !Number.isInteger(profile.challenge) ||
          profile.support < 1 || profile.support > 3 || profile.challenge < 1 || profile.challenge > 3) {
        throw new Error("INVALID_AGE_CYCLE_PROFILE");
      }
      return;
    }
    if (!data.predictionId) throw new Error("PREDICTION_TARGET_REQUIRED");
    if (collection === "Rules") {
      if (!Array.isArray(data.conditions) || !data.conditions.length || data.conditions.length > 50) throw new Error("RULE_CONDITIONS_REQUIRED");
      data.conditions.forEach((condition) => {
        if (!condition || typeof condition.variable !== "string" || !condition.variable || !OPERATORS.has(condition.operator)) {
          throw new Error("INVALID_RULE_CONDITION");
        }
      });
    }
    if (data.logic && data.logic !== "AND" && data.logic !== "OR") throw new Error("INVALID_RULE_LOGIC");
    if (!data.slot && !data.feature && !data.category && !data.topic) throw new Error("MAPPING_SCOPE_REQUIRED");
  }
}

async function list(collection, engineId) {
  const result = await readCollection(collection);
  let records = result.records;
  if (engineId) records = records.filter((record) => record.engineId === engineId);
  records.sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.name || "").localeCompare(String(b.name || "")));
  return records.map((record) => {
    const copy = Object.assign({}, record);
    delete copy.history;
    return copy;
  });
}

async function save(collection, record, actor) {
  if (!record || typeof record !== "object" || Array.isArray(record) || JSON.stringify(record).length > 45000) throw new Error("INVALID_RECORD");
  const current = await readCollection(collection);
  const index = current.records.findIndex((item) => item.id === record.id);
  const old = index >= 0 ? current.records[index] : null;
  const normalized = cleanRecord(record, old, actor);
  validateRecord(collection, normalized);
  const next = current.records.slice();
  if (index >= 0) next[index] = normalized;
  else next.push(normalized);
  await writeCollection(collection, current, next, (old ? "Update " : "Create ") + collection + " record " + normalized.id);
  const output = Object.assign({}, normalized);
  delete output.history;
  return output;
}

async function archive(collection, id, actor) {
  const current = await readCollection(collection);
  const index = current.records.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("RECORD_NOT_FOUND");
  const next = current.records.slice();
  next[index] = cleanRecord(Object.assign({}, next[index], { status: "archived" }), next[index], actor);
  await writeCollection(collection, current, next, "Archive " + collection + " record " + id);
  return { ok: true, id };
}

async function publish(collection, id, actor) {
  const current = await readCollection(collection);
  const index = current.records.findIndex((item) => item.id === id);
  if (index < 0) throw new Error("RECORD_NOT_FOUND");
  const target = current.records[index];
  if (collection === "Rules" || collection === "Mappings") {
    const data = target.data || {};
    const isAgeCycleProfile = collection === "Rules" &&
      (target.parentId === "AGE_CYCLE_PROFILE" || data.ruleType === "AGE_CYCLE_PROFILE");
    if (!isAgeCycleProfile) {
      const predictions = await readCollection("Predictions");
      const linked = predictions.records.find((item) => item.id === data.predictionId);
      if (!linked || linked.engineId !== target.engineId || linked.status !== "published") throw new Error("PUBLISHED_PREDICTION_REQUIRED");
    }
    validateRecord(collection, target);
  }
  const next = current.records.slice();
  next[index] = cleanRecord(Object.assign({}, target, { status: "published" }), target, actor);
  next[index].status = "published";
  await writeCollection(collection, current, next, "Publish " + collection + " record " + id);
  const output = Object.assign({}, next[index]);
  delete output.history;
  return output;
}

async function history(collection, id) {
  const current = await readCollection(collection);
  const record = current.records.find((item) => item.id === id);
  if (!record) throw new Error("RECORD_NOT_FOUND");
  const versions = (Array.isArray(record.history) ? record.history : []).map((item) => ({
    version: item.version,
    createdAt: item.updatedAt || item.createdAt,
    updatedBy: item.updatedBy,
    record: item
  }));
  versions.unshift({
    version: record.version,
    createdAt: record.updatedAt || record.createdAt,
    updatedBy: record.updatedBy,
    record: Object.assign({}, record, { history: undefined })
  });
  return versions.sort((a, b) => Number(b.version || 0) - Number(a.version || 0)).slice(0, 100);
}

async function rollback(collection, id, version, actor) {
  const versions = await history(collection, id);
  const selected = versions.find((item) => Number(item.version) === Number(version));
  if (!selected || !selected.record) throw new Error("VERSION_NOT_FOUND");
  const wasPublished = selected.record.status === "published";
  const restored = Object.assign({}, selected.record, { id });
  delete restored.history;
  const saved = await save(collection, restored, actor);
  const finalRecord = wasPublished ? await publish(collection, id, actor) : saved;
  return { record: finalRecord, rolledBackFrom: Number(version) };
}

async function runtime() {
  const names = ["Engines", "Features", "Categories", "Topics", "Variables", "Predictions", "Rules", "Mappings"];
  const pairs = await Promise.all(names.map(async (name) => [name, await list(name)]));
  const output = Object.fromEntries(pairs);
  output.Engines = output.Engines.filter((item) => item.status === "active");
  output.Features = output.Features.filter((item) => item.status === "active");
  output.Variables = output.Variables.filter((item) => item.status === "active");
  const activeEngines = new Set(output.Engines.map((item) => item.id));
  const enabledFeatures = {};
  output.Features.forEach((feature) => {
    if (!enabledFeatures[feature.engineId]) enabledFeatures[feature.engineId] = new Set();
    if (feature.data && feature.data.key) enabledFeatures[feature.engineId].add(feature.data.key);
  });
  ["Predictions", "Rules", "Mappings"].forEach((name) => {
    output[name] = output[name].filter((record) => {
      if (!activeEngines.has(record.engineId) || record.status !== "published") return false;
      const data = record.data || {};
      const enabled = enabledFeatures[record.engineId] || new Set();
      if (data.feature && !enabled.has(data.feature)) return false;
      if (data.slot) {
        const parts = String(data.slot).split(".");
        if (parts[0] !== record.engineId) return false;
        const key = parts[1] || "default";
        if (key === "base") {
          if (!["natal", "asc", "rhd"].some((item) => enabled.has(item))) return false;
        } else if (!enabled.has(key)) return false;
      }
      return true;
    });
  });
  output.Categories = output.Categories.filter((item) => item.status === "published" || item.status === "active");
  output.Topics = output.Topics.filter((item) => item.status === "published" || item.status === "active");
  return output;
}

module.exports = { COLLECTIONS, readCollection, list, save, archive, publish, history, rollback, runtime, config, validateRecord };
