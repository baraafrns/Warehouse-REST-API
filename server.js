/**
 * REST API STOCK GUDANG
 * Author : Baraafrns
 * Stack  : Node.js + Express + MySQL
 * Version: 1.0.0
 */

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CONNECTION POOL CONFIG
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// DB CONNECTION
(async () => {
    try {
        const connection = await db.getConnection();
        console.log(`》Berhasil terhubung ke database MySQL (${process.env.DB_NAME})`);
        connection.release();
    } catch (err) {
        console.error('!! Gagal terhubung ke database MySQL:', err.message);
        process.exit(1);
    }
})();

// --- ENDPOINTS ---

// 1. GET ALL ITEMS 
app.get('/api/stok', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM inventory');
        res.status(200).json({
            status: "success",
            message: "Berhasil mengambil data stok gudang",
            data: results
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 2. GET ITEM BY ID 
app.get('/api/stok/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const [results] = await db.query('SELECT * FROM inventory WHERE id = ?', [itemId]);
        
        if (results.length === 0) {
            return res.status(404).json({ status: "fail", message: "Barang tidak ditemukan!" });
        }
        res.status(200).json({ status: "success", data: results[0] });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 3. CREATE ITEM 
app.post('/api/stok', async (req, res) => {
    try {
        const { sku, nama, kategori, stok, lokasi } = req.body;

        // Validasi field kosong
        if (!sku || !nama || stok === undefined) {
            return res.status(400).json({ status: "fail", message: "SKU, Nama, dan Stok wajib diisi!" });
        }

        // VALIDASI STOK: Menolak nilai di bawah 0
        const inputStok = parseInt(stok);
        if (inputStok < 0) {
            return res.status(400).json({ status: "fail", message: "Gagal! Jumlah stok tidak boleh bernilai negatif." });
        }

        const query = 'INSERT INTO inventory (sku, nama, kategori, stok, lokasi) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [sku, nama, kategori || 'Umum', inputStok, lokasi || 'Belum Ditentukan']);
        
        // Ambil data yang baru dimasukkan untuk menampilkan full timestamps
        const [newItem] = await db.query('SELECT * FROM inventory WHERE id = ?', [result.insertId]);

        res.status(201).json({
            status: "success",
            message: "Barang berhasil ditambahkan",
            data: newItem[0]
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ status: "fail", message: "SKU sudah terdaftar di gudang!" });
        }
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 4. UPDATE ITEM 
app.put('/api/stok/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const { nama, kategori, stok, lokasi } = req.body;

        const [results] = await db.query('SELECT * FROM inventory WHERE id = ?', [itemId]);
        if (results.length === 0) {
            return res.status(404).json({ status: "fail", message: "Barang tidak ditemukan!" });
        }

        const currentItem = results[0];
        const updatedNama = nama || currentItem.nama;
        const updatedKategori = kategori || currentItem.kategori;
        const updatedStok = stok !== undefined ? parseInt(stok) : currentItem.stok;
        const updatedLokasi = lokasi || currentItem.lokasi;

        // VALIDASI STOK
        if (updatedStok < 0) {
            return res.status(400).json({ status: "fail", message: "Gagal! Jumlah perubahan stok tidak boleh kurang dari 0." });
        }

        const updateQuery = 'UPDATE inventory SET nama = ?, kategori = ?, stok = ?, lokasi = ? WHERE id = ?';
        await db.query(updateQuery, [updatedNama, updatedKategori, updatedStok, updatedLokasi, itemId]);
        
        // Ambil data ter-update untuk menampilkan perubahan nilai 'updated_at'
        const [updatedResult] = await db.query('SELECT * FROM inventory WHERE id = ?', [itemId]);

        res.status(200).json({
            status: "success",
            message: "Data stok berhasil diperbarui",
            data: updatedResult[0]
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// 5. DELETE ITEM
app.delete('/api/stok/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        const [result] = await db.query('DELETE FROM inventory WHERE id = ?', [itemId]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "fail", message: "Barang tidak ditemukan!" });
        }
        res.status(200).json({ status: "success", message: `Barang dengan ID ${itemId} berhasil dihapus dari gudang.` });
    } catch (err) {
        res.status(500).json({ status: "error", message: err.message });
    }
});

// MIDDLEWARE 404 - JIKA RUTE TIDAK DITEMUKAN
app.use((req, res, next) => {
    res.status(404).json({
        status: "fail",
        message: `》Maaf, endpoint atau rute URL [${req.method}] ${req.originalUrl} tidak ditemukan di sistem API Gudang.`
    });
});

app.listen(PORT, () => {
    console.log(`》Server Gudang API berjalan di http://localhost:${PORT}`);
});
