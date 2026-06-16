# Sistem Pengolahan Nilai Siswa

Aplikasi sederhana untuk login role, CRUD siswa, CRUD guru, kelola akun, input nilai, hitung nilai akhir, status kelulusan, dan laporan.

## Stack
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js native
- Database: MySQL
- Package: mysql2

## Login Default
- Admin: admin / admin123
- Guru: g001 / guru123
- Siswa: NIS siswa / siswa123

## Cara Run
1. Start Apache dan MySQL di XAMPP.
2. Buka phpMyAdmin dan pilih database `db_nilai_siswa_node`.
3. Jalankan file `backend/sync_akun_login_siswa_guru.sql` di tab SQL agar akun siswa/guru tersinkron.
4. Jalankan backend:

```bash
cd backend
npm install
npm start
```

5. Jalankan frontend:

```text
Klik kanan frontend/index.html -> Open with Live Server
```

## Catatan
- Admin bisa melihat, menambah, edit, dan hapus akun di menu `Akun User`.
- Saat admin tambah siswa, akun siswa otomatis dibuat dengan username NIS dan password `siswa123`.
- Saat admin tambah guru, akun guru otomatis dibuat dengan username ID guru huruf kecil dan password `guru123`.
