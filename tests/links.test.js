"use strict";

const test = require("node:test");
const assert = require("node:assert");
const os = require("os");
const path = require("path");
const fs = require("fs");
const request = require("supertest");

const { createApp } = require("../src/app");

/** Fresh app with an isolated temp data file per test run. */
function freshApp() {
  const dataFile = path.join(os.tmpdir(), `shortlink-${Date.now()}-${Math.random()}.json`);
  const app = createApp({ dataFile, baseUrl: "http://test.local" });
  return { app, dataFile };
}

test("health check responds ok", async () => {
  const { app } = freshApp();
  const res = await request(app).get("/health");
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, "ok");
});

test("creates a short link for a valid url", async () => {
  const { app } = freshApp();
  const res = await request(app).post("/api/links").send({ url: "https://example.com" });
  assert.strictEqual(res.status, 201);
  assert.ok(res.body.code);
  assert.strictEqual(res.body.url, "https://example.com");
  assert.match(res.body.shortUrl, /^http:\/\/test\.local\//);
});

test("rejects an invalid url with 400", async () => {
  const { app } = freshApp();
  const res = await request(app).post("/api/links").send({ url: "not-a-url" });
  assert.strictEqual(res.status, 400);
});

test("redirects /:code and counts the click", async () => {
  const { app } = freshApp();
  const code = (await request(app).post("/api/links").send({ url: "https://example.com" }))
    .body.code;

  const redirect = await request(app).get(`/${code}`);
  assert.strictEqual(redirect.status, 302);
  assert.strictEqual(redirect.headers.location, "https://example.com");

  const info = await request(app).get(`/api/links/${code}`);
  assert.strictEqual(info.body.clicks, 1);
});

test("returns 404 for unknown code", async () => {
  const { app } = freshApp();
  assert.strictEqual((await request(app).get("/api/links/nope12")).status, 404);
  assert.strictEqual((await request(app).get("/nope12")).status, 404);
});

test("deletes a short link", async () => {
  const { app } = freshApp();
  const code = (await request(app).post("/api/links").send({ url: "https://example.com" }))
    .body.code;
  assert.strictEqual((await request(app).delete(`/api/links/${code}`)).status, 204);
  assert.strictEqual((await request(app).get(`/api/links/${code}`)).status, 404);
});
