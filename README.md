# REST API STOCK GUDANG

REST API sederhana untuk mengelola data stok barang gudang menggunakan Node.js, Express.js, dan MySQL.

Project ini dibuat sebagai latihan Backend Development sekaligus portofolio untuk menunjukkan implementasi dasar REST API, operasi CRUD, validasi input, dan integrasi database.

---

》Fitur

- CRUD Data Barang
- Validasi Input
- Validasi SKU Unik
- Validasi Stok Tidak Boleh Negatif
- Response JSON yang Konsisten
- HTTP Status Code yang Sesuai
- MySQL Connection Pool
- Environment Variable (.env)
- Error Handling
- 404 Handler

---

》Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- nodemon

---

》Struktur Project

.
├── server.js
├── package.json
├── package-lock.json
├── schema.sql
├── .env.example
├── .gitignore
└── README.md

---

》Instalasi

Clone repository

git clone https://github.com/username/stock-gudang-api.git

Masuk ke folder project

cd stock-gudang-api

Install dependency

npm install

Buat file ".env"

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=stok_gudang
PORT=3000

Import database

schema.sql

Jalankan server

npm run dev

atau

npm start

Server berjalan di

http://localhost:3000

---

》Endpoint

Method| Endpoint| Deskripsi
GET| /api/barang| Menampilkan seluruh barang
GET| /api/barang/:id| Menampilkan barang berdasarkan ID
POST| /api/barang| Menambahkan barang
PUT| /api/barang/:id| Mengubah data barang
DELETE| /api/barang/:id| Menghapus barang

---

》Contoh Request

POST /api/barang

{
  "nama": "Keyboard Mechanical",
  "sku": "KB001",
  "stok": 20
}

---

》Contoh Response

{
  "status": "success",
  "message": "Barang berhasil ditambahkan.",
  "data": {
    "id": 1,
    "nama": "Keyboard Mechanical",
    "sku": "KB001",
    "stok": 20
  }
}

---

》Database

Tabel utama terdiri dari beberapa field berikut:

Field| Tipe
id| INT
nama| VARCHAR
sku| VARCHAR (UNIQUE)
stok| INT
created_at| TIMESTAMP
updated_at| TIMESTAMP

---

》Pengujian

API dapat diuji menggunakan:

- Postman
- Insomnia
- Thunder Client
- cURL

---

》Tujuan Project

Project ini dibuat untuk mempelajari:

- REST API
- Express.js
- MySQL
- CRUD
- Validasi Data
- Error Handling
- Backend Development Dasar

---

》License

Project ini dibuat untuk tujuan pembelajaran dan portofolio.