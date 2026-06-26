"use strict";

const fs = require("fs");
const path = require("path");

const ALPHABET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * A tiny file-backed key/value store for short links.
 * Data is kept in memory and flushed to a JSON file on every write,
 * which is plenty for a demo service and survives container restarts
 * when the data directory is mounted as a volume.
 */
class LinkStore {
  constructor(file) {
    this.file = file || path.join(__dirname, "..", "data", "links.json");
    this.links = this._load();
  }

  _load() {
    try {
      return JSON.parse(fs.readFileSync(this.file, "utf-8"));
    } catch {
      return {};
    }
  }

  _save() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(this.links, null, 2));
  }

  _randomCode(length = 6) {
    let code = "";
    for (let i = 0; i < length; i += 1) {
      code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return code;
  }

  create(url) {
    let code = this._randomCode();
    while (this.links[code]) code = this._randomCode();
    this.links[code] = { code, url, clicks: 0, createdAt: new Date().toISOString() };
    this._save();
    return this.links[code];
  }

  get(code) {
    return this.links[code] || null;
  }

  all() {
    return Object.values(this.links).sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  }

  registerClick(code) {
    if (!this.links[code]) return null;
    this.links[code].clicks += 1;
    this._save();
    return this.links[code];
  }

  remove(code) {
    if (!this.links[code]) return false;
    delete this.links[code];
    this._save();
    return true;
  }
}

module.exports = { LinkStore };
