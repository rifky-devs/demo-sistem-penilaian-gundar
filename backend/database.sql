-- =============================================================================
-- DATABASE: Sistem Pengolahan Nilai Mahasiswa — Universitas Gunadarma
-- Cara pakai: Import file ini ke phpMyAdmin (sekali saja)
-- Akun default & sync login sudah termasuk di file ini
-- =============================================================================

CREATE DATABASE IF NOT EXISTS db_nilai_gunadarma;
USE db_nilai_gunadarma;

-- Hapus tabel lama jika ada (urutan penting karena foreign key)
DROP TABLE IF EXISTS nilai;
DROP TABLE IF EXISTS mahasiswa;
DROP TABLE IF EXISTS dosen;
DROP TABLE IF EXISTS users;

-- -----------------------------------------------------------------------------
-- TABEL 1: users — Akun login (admin, dosen, mahasiswa)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  role ENUM('admin', 'dosen', 'mahasiswa') NOT NULL,
  nama VARCHAR(100) NOT NULL,
  reference_id INT NULL COMMENT 'ID mahasiswa/dosen terkait, NULL untuk admin'
);

-- -----------------------------------------------------------------------------
-- TABEL 2: mahasiswa — Data mahasiswa (NPM, nama, kelas/prodi)
-- -----------------------------------------------------------------------------
CREATE TABLE mahasiswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  npm VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  kelas_prodi VARCHAR(50) NOT NULL
);

-- -----------------------------------------------------------------------------
-- TABEL 3: dosen — Data dosen (NIDN, nama, mata kuliah)
-- -----------------------------------------------------------------------------
CREATE TABLE dosen (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nidn VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  mata_kuliah VARCHAR(100) NOT NULL
);

-- -----------------------------------------------------------------------------
-- TABEL 4: nilai — Nilai mahasiswa per mata kuliah
-- Rumus nilai_akhir: 30% tugas + 30% uts + 40% uas
-- Status: Lulus (>= 70) / Tidak Lulus (< 70)
-- -----------------------------------------------------------------------------
CREATE TABLE nilai (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mahasiswa_id INT NOT NULL,
  dosen_id INT NULL,
  mata_kuliah VARCHAR(100) NOT NULL,
  tugas DECIMAL(5,2) NOT NULL,
  uts DECIMAL(5,2) NOT NULL,
  uas DECIMAL(5,2) NOT NULL,
  nilai_akhir DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mahasiswa_id) REFERENCES mahasiswa(id) ON DELETE CASCADE,
  FOREIGN KEY (dosen_id) REFERENCES dosen(id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- DATA AWAL: Dosen & Mahasiswa
-- -----------------------------------------------------------------------------
INSERT INTO dosen (nidn, nama, mata_kuliah) VALUES
('0123456789', 'Dr. Budi Santoso', 'Pemrograman Web');

INSERT INTO mahasiswa (npm, nama, kelas_prodi) VALUES
('51422442', 'Rifky Muslim', '4IA26'),
('2026001', 'Ahmad Fikri', 'TI-3A'),
('2026002', 'Aisyah Zahra', 'SI-3B');

-- -----------------------------------------------------------------------------
-- AKUN LOGIN DEFAULT (langsung bisa dipakai untuk demo ujikom)
-- admin / admin123  |  dosen / dosen123  |  mahasiswa / mahasiswa123
-- -----------------------------------------------------------------------------
INSERT INTO users (username, password, role, nama, reference_id) VALUES
('admin', 'admin123', 'admin', 'Administrator', NULL),
('dosen', 'dosen123', 'dosen', 'Dr. Budi Santoso', 1),
('mahasiswa', 'mahasiswa123', 'mahasiswa', 'Rifky Muslim', 1);

-- -----------------------------------------------------------------------------
-- SYNC AKUN OTOMATIS (ganti sync_akun_login_siswa_guru.sql — tidak perlu dijalankan terpisah)
-- Mahasiswa: username = NPM, password = mahasiswa123
-- Dosen: username = NIDN huruf kecil, password = dosen123
-- -----------------------------------------------------------------------------
INSERT INTO users (username, password, role, nama, reference_id)
SELECT m.npm, 'mahasiswa123', 'mahasiswa', m.nama, m.id
FROM mahasiswa m
ON DUPLICATE KEY UPDATE nama = VALUES(nama), role = 'mahasiswa', reference_id = VALUES(reference_id);

INSERT INTO users (username, password, role, nama, reference_id)
SELECT LOWER(d.nidn), 'dosen123', 'dosen', d.nama, d.id
FROM dosen d
ON DUPLICATE KEY UPDATE nama = VALUES(nama), role = 'dosen', reference_id = VALUES(reference_id);

-- -----------------------------------------------------------------------------
-- DATA NILAI CONTOH (Tugas 90, UTS 85, UAS 95 → Akhir 90.50 → Lulus)
-- -----------------------------------------------------------------------------
INSERT INTO nilai (mahasiswa_id, dosen_id, mata_kuliah, tugas, uts, uas, nilai_akhir, status) VALUES
(1, 1, 'Pemrograman Web', 90, 85, 95, 90.50, 'Lulus');
