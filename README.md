# ShortLink API

A small RESTful **URL shortener** built with **Node.js + Express**, containerized with **Docker**.

A compact backend practice project — create short codes for long URLs, redirect on visit,
and track click counts.

## Features

- Create short codes for any valid `http(s)` URL
- `302` redirect from `/{code}` to the original URL
- Per-link click counting
- URL validation (`400` on bad input)
- File-backed JSON store (survives restarts via a Docker volume)
- Dockerfile + docker-compose with a healthcheck
- Test suite using Node's built-in test runner + supertest

## Tech stack

| Layer    | Choice            |
|----------|-------------------|
| Runtime  | Node.js 22        |
| Framework| Express 4         |
| Storage  | JSON file store   |
| Tests    | node:test + supertest |
| Container| Docker / docker-compose |

## API

| Method | Path               | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/health`          | Liveness check                       |
| POST   | `/api/links`       | Create a short link (`{ "url": ... }`) |
| GET    | `/api/links`       | List all links                       |
| GET    | `/api/links/{code}`| Get one link's info + click count    |
| DELETE | `/api/links/{code}`| Delete a link                        |
| GET    | `/{code}`          | Redirect (302) to the original URL   |

## Run locally

```bash
npm install
npm start
# API on http://localhost:3000
```

## Run with Docker

```bash
docker compose up --build
```

## Tests

```bash
npm install
npm test
```

## Example

```bash
# create
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.google.com"}'
# -> { "code": "Ab3xZ9", "shortUrl": "http://localhost:3000/Ab3xZ9", ... }

# visit (redirects)
curl -i http://localhost:3000/Ab3xZ9
```

## License

MIT — see [LICENSE](LICENSE).
