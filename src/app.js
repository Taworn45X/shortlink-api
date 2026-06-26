"use strict";

const express = require("express");
const { LinkStore } = require("./store");
const { createLinksRouter } = require("./routes/links");

/** Create the Express app. A custom store/baseUrl can be injected for tests. */
function createApp(options = {}) {
  const store = options.store || new LinkStore(options.dataFile);
  const baseUrl = options.baseUrl || process.env.BASE_URL || "http://localhost:3000";

  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.get("/", (_req, res) =>
    res.json({ name: "ShortLink API", endpoints: ["/api/links", "/health"] })
  );

  app.use("/api/links", createLinksRouter(store, baseUrl));

  // Public redirect: GET /:code -> 302 to the original URL.
  app.get("/:code", (req, res) => {
    const link = store.registerClick(req.params.code);
    if (!link) return res.status(404).json({ error: "Short link not found" });
    return res.redirect(302, link.url);
  });

  return app;
}

module.exports = { createApp };
