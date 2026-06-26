# ShortLink API

โปรเจกต์ย่อ URL ครับ ทำไว้ฝึก Node.js กับ Express แล้วก็ลอง Docker ไปด้วย
หลักการง่ายๆ คือเอา URL ยาวๆ มาแปลงเป็นโค้ดสั้นๆ พอมีคนกดลิงก์สั้นก็เด้งไปหน้าจริง
แถมนับด้วยว่าโดนกดไปกี่ครั้งแล้ว

อยากลองทำอะไรที่ไม่ใช่ Python บ้าง เลยหยิบ Node มาเล่นดู

## ทำอะไรได้บ้าง

- ย่อ URL → ได้โค้ดสั้นๆ มา
- กดลิงก์สั้นแล้วเด้งไป URL จริง (redirect 302)
- นับจำนวนคลิกของแต่ละลิงก์
- เช็ค URL ก่อนว่าเป็น http/https จริงไหม (ไม่งั้นตอบ 400)
- เก็บข้อมูลลงไฟล์ JSON เลยไม่หายตอนปิดเครื่อง
- รันผ่าน Docker ได้

## ที่ใช้ทำ

Node.js · Express · เก็บข้อมูลเป็นไฟล์ JSON · เทสต์ด้วย node:test + supertest · Docker

## เส้นทาง (endpoints)

| Method | Path | ทำอะไร |
|--------|------|--------|
| GET | `/health` | เช็คว่ายังอยู่ |
| POST | `/api/links` | ย่อ URL ใหม่ (ส่ง `{ "url": "..." }`) |
| GET | `/api/links` | ดูลิงก์ทั้งหมด |
| GET | `/api/links/{code}` | ดูข้อมูลลิงก์ + จำนวนคลิก |
| DELETE | `/api/links/{code}` | ลบลิงก์ |
| GET | `/{code}` | เด้งไป URL จริง |

## วิธีรัน

```bash
npm install
npm start
```

เปิด http://localhost:3000

## วิธีรัน (Docker)

```bash
docker compose up --build
```

## รันเทส

```bash
npm install
npm test
```

## ลองยิงดู

```bash
# ย่อลิงก์
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://www.google.com\"}"
# ได้ code มาแล้วลองเปิด http://localhost:3000/<code> มันจะเด้งไป google
```

---

## English (short version)

A small URL shortener I built to practice Node.js / Express and Docker.
Most of my projects are in Python, so I wanted to try something different.

- Shorten any valid `http(s)` URL into a short code
- `302` redirect from `/{code}` to the original URL
- Counts clicks per link
- Data saved to a JSON file (survives restarts)
- Tests with Node's built-in test runner + supertest

Run: `npm start` → http://localhost:3000
Docker: `docker compose up --build`
Tests: `npm test`

License: MIT
