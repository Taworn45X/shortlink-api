"use strict";

const express = require("express");

/** Basic http/https URL validation. */
function isValidUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Build the /api/links router around a store instance. */
function createLinksRouter(store, baseUrl) {
  const router = express.Router();

  const withShortUrl = (link) => ({ ...link, shortUrl: `${baseUrl}/${link.code}` });

  router.post("/", (req, res) => {
    const { url } = req.body || {};
    if (!isValidUrl(url)) {
      return res.status(400).json({ error: "A valid http(s) 'url' is required" });
    }
    return res.status(201).json(withShortUrl(store.create(url)));
  });

  router.get("/", (_req, res) => {
    res.json(store.all().map(withShortUrl));
  });

  router.get("/:code", (req, res) => {
    const link = store.get(req.params.code);
    if (!link) return res.status(404).json({ error: "Short link not found" });
    return res.json(withShortUrl(link));
  });

  router.delete("/:code", (req, res) => {
    if (!store.remove(req.params.code)) {
      return res.status(404).json({ error: "Short link not found" });
    }
    return res.status(204).send();
  });

  return router;
}

module.exports = { createLinksRouter, isValidUrl };
