CREATE DATABASE IF NOT EXISTS gudang_db;
USE gudang_db;

CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    kategori VARCHAR(100) DEFAULT 'Umum',
    stok INT NOT NULL DEFAULT 0,
    lokasi VARCHAR(100) DEFAULT 'Belum Ditentukan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Data Awal untuk pengujian
INSERT INTO inventory (sku, nama, kategori, stok, lokasi) VALUES
('BRG-001', 'Laptop ASUS Rog', 'Elektronik', 15, 'Rak A-1'),
('BRG-002', 'Kursi Kerja Ergonomis', 'Furnitur', 40, 'Rak B-3')
ON DUPLICATE KEY UPDATE sku=sku;
