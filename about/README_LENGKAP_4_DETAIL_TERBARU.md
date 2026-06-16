# README LENGKAP - SISTEM PENGOLAHAN NILAI SISWA SDN MANGUN JAYA 06

## Identitas Project

**Nama Project:** Sistem Pengolahan Nilai Siswa SDN Mangun Jaya 06  
**Jenis Aplikasi:** Aplikasi web sederhana  
**Skema:** Programmer  
**Fokus Project:** Login role, CRUD data, input nilai, validasi nilai, perhitungan nilai akhir, laporan nilai, database MySQL, pemrograman terstruktur, dan OOP.

---

# 1. DESKRIPSI PROJECT

Sistem Pengolahan Nilai Siswa SDN Mangun Jaya 06 adalah aplikasi berbasis web yang digunakan untuk membantu proses pengelolaan nilai siswa secara digital. Aplikasi ini dibuat untuk kebutuhan pembekalan dan ujikom skema Programmer.

Aplikasi ini memiliki alur sederhana, yaitu pengguna login terlebih dahulu, kemudian sistem membaca role pengguna. Setelah login berhasil, sistem menampilkan menu sesuai hak akses masing-masing. Role yang digunakan adalah Admin, Guru, dan Siswa.

Admin memiliki akses paling lengkap untuk mengelola data siswa, data guru, akun pengguna, data nilai, dan laporan. Guru dapat melakukan input nilai, mengubah nilai apabila terdapat kesalahan, serta melihat rekap nilai. Siswa hanya dapat melihat nilai pribadi dan status nilai berdasarkan mata pelajaran.

Aplikasi ini dibuat sederhana agar mudah dipahami dan mudah dijelaskan saat ujian. Program tidak menggunakan framework besar seperti React, Laravel, Express, Bootstrap, atau library tambahan yang rumit. Aplikasi hanya menggunakan HTML, CSS, JavaScript native, Node.js native, MySQL, dan package mysql2.

---

## 1.1 Tujuan Aplikasi

Tujuan aplikasi ini adalah:

1. Membantu proses pengelolaan data siswa secara digital.
2. Membantu admin mengelola data siswa, data guru, akun user, dan nilai.
3. Membantu guru dalam menginput nilai tugas, UTS, dan UAS.
4. Menghitung nilai akhir siswa secara otomatis.
5. Menentukan status Lulus atau Tidak Lulus berdasarkan nilai akhir.
6. Menampilkan laporan nilai siswa sesuai hak akses pengguna.
7. Menyimpan seluruh data ke database MySQL agar data tidak hilang saat browser ditutup.
8. Menunjukkan penerapan pemrograman terstruktur dan OOP pada satu aplikasi sederhana.

---

## 1.2 Teknologi yang Digunakan

| Bagian | Teknologi |
|---|---|
| Frontend | HTML, CSS, JavaScript Native |
| Backend | Node.js Native HTTP Server |
| Database | MySQL |
| Package Node.js | mysql2 |
| Database Tools | XAMPP MySQL dan phpMyAdmin |
| Frontend Server | Live Server VS Code |
| Editor | Visual Studio Code |

Aplikasi ini sengaja dibuat tanpa framework besar agar alur kode lebih mudah dipahami. Backend dibuat menggunakan Node.js native dengan module HTTP bawaan Node.js. Koneksi ke database MySQL menggunakan package mysql2.

---

## 1.3 Struktur Folder Project

Struktur folder project adalah sebagai berikut:

```text
project/
│
├── backend/
│   ├── database.sql
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── sync_akun_login_siswa_guru.sql
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

Penjelasan file:

| File / Folder | Keterangan |
|---|---|
| backend/server.js | File backend utama untuk API, login, CRUD, validasi, perhitungan nilai, dan koneksi database. |
| backend/database.sql | File SQL utama untuk membuat database, tabel, relasi, dan data awal. |
| backend/package.json | File konfigurasi Node.js dan dependency project. |
| backend/package-lock.json | File hasil install dependency dari npm. |
| backend/sync_akun_login_siswa_guru.sql | File SQL tambahan untuk menyinkronkan akun login siswa dan guru. |
| frontend/index.html | Struktur tampilan halaman aplikasi. |
| frontend/style.css | File desain tampilan aplikasi. |
| frontend/script.js | File logika frontend, request API, render tabel, modal edit/hapus, dan validasi. |
| README.md | Dokumentasi project. |

---

# 2. FITUR APLIKASI DAN HAK AKSES

Aplikasi ini memiliki tiga role utama, yaitu Admin, Guru, dan Siswa. Setiap role memiliki hak akses yang berbeda agar sistem lebih teratur.

---

## 2.1 Fitur Admin

Admin adalah pengguna dengan hak akses paling lengkap. Setelah login, admin dapat mengakses menu:

1. Dashboard
2. Data Siswa
3. Data Guru
4. Akun User
5. Input Nilai
6. Laporan
7. Logout

Fitur yang dapat dilakukan admin:

| Fitur | Keterangan |
|---|---|
| Login Admin | Admin dapat masuk ke sistem menggunakan username dan password admin. |
| Dashboard | Admin dapat melihat ringkasan total siswa, total guru, dan total nilai. |
| CRUD Data Siswa | Admin dapat menambah, melihat, mengubah, dan menghapus data siswa. |
| CRUD Data Guru | Admin dapat menambah, melihat, mengubah, dan menghapus data guru. |
| CRUD Akun User | Admin dapat melihat, menambah, mengubah, dan menghapus akun user. |
| CRUD Nilai | Admin dapat input, edit, hapus, dan melihat data nilai. |
| Laporan Nilai | Admin dapat melihat semua laporan nilai siswa. |
| Logout | Admin dapat keluar dari sistem. |

Admin juga dapat mengontrol akun guru dan siswa melalui menu **Akun User**. Menu ini digunakan untuk melihat username, password, role, dan NIS yang terhubung dengan akun siswa.

---

## 2.2 Fitur Guru

Guru memiliki akses untuk mengelola nilai siswa. Setelah login, guru dapat mengakses menu:

1. Dashboard
2. Input Nilai
3. Laporan
4. Logout

Fitur yang dapat dilakukan guru:

| Fitur | Keterangan |
|---|---|
| Login Guru | Guru dapat masuk menggunakan akun guru. |
| Dashboard Guru | Guru dapat melihat ringkasan data pada dashboard. |
| Input Nilai | Guru dapat memilih siswa dan guru/mapel, lalu menginput nilai tugas, UTS, dan UAS. |
| Edit Nilai | Guru dapat mengubah nilai apabila terdapat kesalahan input. |
| Laporan Nilai | Guru dapat melihat rekap nilai siswa. |
| Logout | Guru dapat keluar dari aplikasi. |

Guru tidak memiliki akses ke menu Data Siswa, Data Guru, dan Akun User karena fitur tersebut hanya untuk admin.

---

## 2.3 Fitur Siswa

Siswa memiliki akses terbatas. Setelah login, siswa hanya dapat mengakses menu:

1. Dashboard
2. Laporan
3. Logout

Fitur yang dapat dilakukan siswa:

| Fitur | Keterangan |
|---|---|
| Login Siswa | Siswa dapat login menggunakan username sesuai akun yang dibuat admin. |
| Dashboard Siswa | Siswa dapat melihat ringkasan data. |
| Laporan Nilai Pribadi | Siswa hanya dapat melihat nilai miliknya sendiri berdasarkan NIS. |
| Status Nilai | Siswa dapat melihat status Lulus atau Tidak Lulus pada setiap mata pelajaran. |
| Logout | Siswa dapat keluar dari aplikasi. |

Siswa tidak dapat menambah, mengubah, atau menghapus data. Siswa hanya melihat laporan nilai pribadi.

---

## 2.4 Menu Akun User

Menu Akun User adalah fitur tambahan pada versi terbaru program. Fitur ini dibuat agar admin dapat mengontrol akun login guru dan siswa secara lebih mudah.

Admin dapat mengelola data akun berikut:

| Field | Keterangan |
|---|---|
| Nama | Nama pemilik akun. |
| Username | Username yang digunakan untuk login. |
| Password | Password yang digunakan untuk login. |
| Role | Hak akses akun, yaitu admin, guru, atau siswa. |
| NIS | NIS untuk akun siswa agar laporan nilai pribadi dapat difilter. |

Aturan akun:

```text
Admin:
Username: admin
Password: admin123

Guru demo:
Username: guru
Password: guru123

Siswa demo:
Username: siswa
Password: siswa123

Guru per mapel:
Username: g001, g002, g003, dan seterusnya
Password: guru123

Siswa per NIS:
Username: NIS siswa
Password: siswa123
```

Jika admin menambahkan siswa, backend dapat membuat akun siswa otomatis. Username siswa memakai NIS, dan password default adalah siswa123. Jika admin menambahkan guru, backend dapat membuat akun guru otomatis. Username guru memakai ID guru huruf kecil, dan password default adalah guru123.

---

# 3. DATABASE DAN PERHITUNGAN NILAI

Database yang digunakan adalah MySQL dengan nama:

```sql
db_nilai_siswa_node
```

Database ini terdiri dari empat tabel utama:

1. users
2. siswa
3. guru
4. nilai

---

## 3.1 Tabel users

Tabel users digunakan untuk menyimpan akun login pengguna.

Struktur tabel:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  role ENUM('admin','guru','siswa') NOT NULL,
  nis VARCHAR(20) NULL
);
```

Penjelasan field:

| Field | Keterangan |
|---|---|
| id | Primary key akun user. |
| nama | Nama pengguna. |
| username | Username untuk login. |
| password | Password untuk login. |
| role | Hak akses pengguna, yaitu admin, guru, atau siswa. |
| nis | NIS siswa. Field ini digunakan agar siswa hanya melihat nilai miliknya sendiri. |

---

## 3.2 Tabel siswa

Tabel siswa digunakan untuk menyimpan data siswa.

Struktur tabel:

```sql
CREATE TABLE siswa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nis VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  kelas VARCHAR(20) NOT NULL
);
```

Penjelasan field:

| Field | Keterangan |
|---|---|
| id | Primary key siswa. |
| nis | Nomor Induk Siswa dan harus unik. |
| nama | Nama siswa. |
| kelas | Kelas siswa. Pada data awal menggunakan kelas 5A dan 6A. |

---

## 3.3 Tabel guru

Tabel guru digunakan untuk menyimpan data guru dan mata pelajaran.

Struktur tabel:

```sql
CREATE TABLE guru (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(20) NOT NULL UNIQUE,
  nama VARCHAR(100) NOT NULL,
  mapel VARCHAR(100) NOT NULL
);
```

Penjelasan field:

| Field | Keterangan |
|---|---|
| id | Primary key guru. |
| kode | ID guru, contohnya G001, G002, G003. |
| nama | Nama guru. |
| mapel | Mata pelajaran yang diajarkan guru. |

Contoh data guru dan mata pelajaran SD:

| Kode | Nama Guru | Mata Pelajaran |
|---|---|---|
| G001 | Ibu Siti Aminah | Pendidikan Agama Islam |
| G002 | Pak Budi Santoso | PPKn |
| G003 | Ibu Rina Wulandari | Bahasa Indonesia |
| G004 | Pak Andi Pratama | Matematika |
| G005 | Ibu Dewi Lestari | IPA |
| G006 | Pak Fajar Hidayat | IPS |
| G007 | Ibu Nia Kartika | SBdP |
| G008 | Pak Agus Setiawan | PJOK |
| G009 | Ibu Maya Safitri | Bahasa Inggris |
| G010 | Pak Deden Kurniawan | Bahasa Sunda |

---

## 3.4 Tabel nilai

Tabel nilai digunakan untuk menyimpan nilai siswa.

Struktur tabel:

```sql
CREATE TABLE nilai (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_siswa INT NOT NULL,
  id_guru INT NOT NULL,
  tugas DECIMAL(5,2) NOT NULL,
  uts DECIMAL(5,2) NOT NULL,
  uas DECIMAL(5,2) NOT NULL,
  akhir DECIMAL(5,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  FOREIGN KEY (id_siswa) REFERENCES siswa(id) ON DELETE CASCADE,
  FOREIGN KEY (id_guru) REFERENCES guru(id) ON DELETE CASCADE
);
```

Penjelasan field:

| Field | Keterangan |
|---|---|
| id | Primary key nilai. |
| id_siswa | Relasi ke tabel siswa. |
| id_guru | Relasi ke tabel guru. |
| tugas | Nilai tugas siswa. |
| uts | Nilai UTS siswa. |
| uas | Nilai UAS siswa. |
| akhir | Nilai akhir hasil perhitungan otomatis. |
| status | Status Lulus atau Tidak Lulus. |

---

## 3.5 Relasi Database

Relasi database:

```text
users.nis  -> siswa.nis
siswa.id   -> nilai.id_siswa
guru.id    -> nilai.id_guru
```

Penjelasan relasi:

1. Tabel users menyimpan akun login.
2. Akun siswa dihubungkan ke data siswa menggunakan NIS.
3. Tabel nilai mengambil data siswa melalui id_siswa.
4. Tabel nilai mengambil data guru dan mata pelajaran melalui id_guru.
5. Jika data siswa dihapus, nilai siswa yang terkait ikut terhapus karena menggunakan ON DELETE CASCADE.
6. Jika data guru dihapus, nilai yang terkait dengan guru tersebut ikut terhapus karena menggunakan ON DELETE CASCADE.

---

## 3.6 Data Awal

Pada versi terbaru, data dapat diisi dengan:

| Data | Jumlah |
|---|---|
| Siswa | 20 data siswa |
| Guru | 10 data guru/mapel |
| Nilai | 200 data nilai |
| Akun user | Admin, guru, siswa, akun guru per kode, dan akun siswa per NIS |

Setiap siswa dapat memiliki nilai dari semua guru atau mata pelajaran. Dengan 20 siswa dan 10 guru/mapel, maka jumlah data nilai dapat menjadi 200 baris.

Status nilai yang muncul pada laporan adalah status per mata pelajaran, bukan rata-rata seluruh mata pelajaran. Artinya, seorang siswa bisa Lulus pada mata pelajaran Matematika, tetapi Tidak Lulus pada mata pelajaran IPS jika nilai akhirnya kurang dari 70.

---

## 3.7 Rumus Perhitungan Nilai

Rumus nilai akhir:

```text
Nilai Akhir = (30% x Tugas) + (30% x UTS) + (40% x UAS)
```

Dalam kode JavaScript backend:

```js
function hitungNilaiAkhir(tugas, uts, uas) {
  return Number((tugas * 0.3 + uts * 0.3 + uas * 0.4).toFixed(2));
}
```

Contoh perhitungan:

```text
Tugas = 97
UTS   = 94
UAS   = 100

Nilai Akhir = (97 x 0.3) + (94 x 0.3) + (100 x 0.4)
Nilai Akhir = 29.1 + 28.2 + 40
Nilai Akhir = 97.30
Status      = Lulus
```

Ketentuan status:

| Nilai Akhir | Status |
|---|---|
| >= 70 | Lulus |
| < 70 | Tidak Lulus |

Validasi nilai:

```text
Nilai tugas, UTS, dan UAS harus berada pada rentang 0 sampai 100.
```

---

# 4. CARA SETUP, RUN, API, DAN PENGUJIAN

Bagian ini menjelaskan cara menjalankan aplikasi dari awal sampai berhasil digunakan.

---

## 4.1 Persiapan Aplikasi

Pastikan aplikasi berikut sudah terinstall:

1. XAMPP
2. Node.js
3. Visual Studio Code
4. Extension Live Server di VS Code

Cek Node.js dan npm:

```bash
node -v
npm -v
```

Jika muncul nomor versi, berarti Node.js dan npm sudah siap digunakan.

---

## 4.2 Menjalankan MySQL

Langkah menjalankan MySQL:

1. Buka XAMPP Control Panel.
2. Klik Start pada Apache.
3. Klik Start pada MySQL.
4. Buka browser.
5. Masuk ke phpMyAdmin:

```text
http://localhost/phpmyadmin
```

---

## 4.3 Import Database

Langkah import database:

1. Buka phpMyAdmin.
2. Klik tab Import.
3. Pilih file:

```text
backend/database.sql
```

4. Pastikan format adalah SQL.
5. Klik Go.
6. Pastikan database berikut muncul:

```text
db_nilai_siswa_node
```

Jika sudah muncul, berarti database berhasil dibuat.

Jika ingin mengisi data lengkap siswa, guru, akun, dan nilai, jalankan file SQL data lengkap yang sudah disiapkan. Data lengkap berisi siswa, guru mata pelajaran SD, akun login, dan nilai random lulus/tidak lulus.

---

## 4.4 Install Dependency Backend

Buka terminal VS Code dari folder project, lalu jalankan:

```bash
cd backend
npm install
```

Package yang dipakai hanya:

```text
mysql2
```

Package mysql2 digunakan agar backend Node.js dapat terhubung ke database MySQL.

---

## 4.5 Menjalankan Backend

Masih di folder backend, jalankan:

```bash
npm start
```

Atau:

```bash
node server.js
```

Jika berhasil, backend berjalan pada:

```text
http://localhost:3001
```

Backend harus tetap aktif selama aplikasi digunakan. Jika terminal backend ditutup, proses login dan data dari database tidak akan berjalan.

---

## 4.6 Menjalankan Frontend

Langkah menjalankan frontend:

1. Buka project di VS Code.
2. Masuk ke folder frontend.
3. Klik kanan file:

```text
frontend/index.html
```

4. Pilih:

```text
Open with Live Server
```

Alamat frontend biasanya:

```text
http://127.0.0.1:5500/frontend/index.html
```

Jika halaman login muncul, berarti frontend berhasil dijalankan.

---

## 4.7 Urutan Run yang Benar

Urutan yang benar saat menjalankan aplikasi:

```text
1. Buka XAMPP.
2. Start Apache dan MySQL.
3. Pastikan database db_nilai_siswa_node sudah ada di phpMyAdmin.
4. Buka terminal di folder project.
5. Masuk ke folder backend dengan command cd backend.
6. Jalankan npm install jika belum pernah.
7. Jalankan npm start.
8. Jalankan frontend/index.html menggunakan Live Server.
9. Login menggunakan akun admin, guru, atau siswa.
```

---

## 4.8 Akun Login

Akun demo:

| Role | Username | Password |
|---|---|---|
| Admin | admin | admin123 |
| Guru | guru | guru123 |
| Siswa | siswa | siswa123 |

Akun guru per mata pelajaran:

| Contoh Username | Password |
|---|---|
| g001 | guru123 |
| g002 | guru123 |
| g003 | guru123 |
| g004 | guru123 |
| g010 | guru123 |

Akun siswa per NIS:

| Contoh Username | Password |
|---|---|
| 2026001 | siswa123 |
| 2026008 | siswa123 |
| 2026013 | siswa123 |
| 2026020 | siswa123 |

---

## 4.9 Konfigurasi Database di Backend

Konfigurasi database ada di file:

```text
backend/server.js
```

Contoh konfigurasi:

```js
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_nilai_siswa_node'
});
```

Penjelasan:

| Konfigurasi | Nilai | Keterangan |
|---|---|---|
| host | localhost | Database berjalan secara lokal. |
| user | root | User default MySQL XAMPP. |
| password | kosong | Password default XAMPP biasanya kosong. |
| database | db_nilai_siswa_node | Nama database yang digunakan aplikasi. |

Jika MySQL kamu memakai password, ubah bagian:

```js
password: ''
```

menjadi:

```js
password: 'password_mysql_kamu'
```

---

## 4.10 Endpoint API Backend

Backend menyediakan API untuk frontend.

### Login

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | /login | Login berdasarkan username dan password. |

Contoh request:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

---

### Data Siswa

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | /students | Menampilkan semua siswa. |
| POST | /students | Menambah siswa. |
| PUT | /students/:id | Mengubah siswa. |
| DELETE | /students/:id | Menghapus siswa. |

Contoh data:

```json
{
  "nis": "2026001",
  "nama": "Ahmad Fikri",
  "kelas": "5A"
}
```

---

### Data Guru

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | /teachers | Menampilkan semua guru. |
| POST | /teachers | Menambah guru. |
| PUT | /teachers/:id | Mengubah guru. |
| DELETE | /teachers/:id | Menghapus guru. |

Contoh data:

```json
{
  "kode": "G004",
  "nama": "Pak Andi Pratama",
  "mapel": "Matematika"
}
```

---

### Data Akun User

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | /users | Menampilkan semua akun user. |
| POST | /users | Menambah akun user. |
| PUT | /users/:id | Mengubah akun user. |
| DELETE | /users/:id | Menghapus akun user. |

Contoh data:

```json
{
  "nama": "Raka Pratama",
  "username": "2026008",
  "password": "siswa123",
  "role": "siswa",
  "nis": "2026008"
}
```

---

### Data Nilai

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | /grades | Menampilkan laporan nilai. |
| POST | /grades | Menambah nilai siswa. |
| PUT | /grades/:id | Mengubah nilai siswa. |
| DELETE | /grades/:id | Menghapus nilai siswa. |

Contoh data:

```json
{
  "id_siswa": 1,
  "id_guru": 1,
  "tugas": 90,
  "uts": 85,
  "uas": 95
}
```

Nilai akhir dan status tidak dikirim dari frontend. Backend menghitung nilai akhir dan status secara otomatis.

---

## 4.11 Pemrograman Terstruktur

Pemrograman terstruktur diterapkan melalui fungsi-fungsi berikut.

### validasiNilai()

Fungsi ini memeriksa apakah nilai berupa angka dan berada pada rentang 0 sampai 100.

```js
function validasiNilai(nilai) {
  return !isNaN(nilai) && nilai >= 0 && nilai <= 100;
}
```

### hitungNilaiAkhir()

Fungsi ini menghitung nilai akhir berdasarkan nilai tugas, UTS, dan UAS.

```js
function hitungNilaiAkhir(tugas, uts, uas) {
  return Number((tugas * 0.3 + uts * 0.3 + uas * 0.4).toFixed(2));
}
```

### statusKelulusan()

Fungsi ini menentukan status nilai berdasarkan nilai akhir.

```js
function statusKelulusan(akhir) {
  return akhir >= 70 ? 'Lulus' : 'Tidak Lulus';
}
```

---

## 4.12 Pemrograman Berorientasi Objek

OOP diterapkan melalui class Siswa, Guru, dan Nilai.

### Class Siswa

```js
class Siswa {
  constructor(data) {
    this.nis = data.nis;
    this.nama = data.nama;
    this.kelas = data.kelas;
  }

  lengkap() {
    return this.nis && this.nama && this.kelas;
  }
}
```

Class Siswa digunakan untuk membentuk objek siswa dan memeriksa kelengkapan data siswa.

---

### Class Guru

```js
class Guru {
  constructor(data) {
    this.kode = data.kode;
    this.nama = data.nama;
    this.mapel = data.mapel;
  }

  lengkap() {
    return this.kode && this.nama && this.mapel;
  }
}
```

Class Guru digunakan untuk membentuk objek guru dan memeriksa kelengkapan data guru.

---

### Class Nilai

```js
class Nilai {
  constructor(data) {
    this.id_siswa = data.id_siswa;
    this.id_guru = data.id_guru;
    this.tugas = Number(data.tugas);
    this.uts = Number(data.uts);
    this.uas = Number(data.uas);
    this.akhir = hitungNilaiAkhir(this.tugas, this.uts, this.uas);
    this.status = statusKelulusan(this.akhir);
  }

  valid() {
    return this.id_siswa &&
      this.id_guru &&
      validasiNilai(this.tugas) &&
      validasiNilai(this.uts) &&
      validasiNilai(this.uas);
  }
}
```

Class Nilai digunakan untuk membentuk objek nilai, menghitung nilai akhir, dan menentukan status nilai.

---

## 4.13 Cara Pengujian Aplikasi

### Pengujian Login Admin

Data uji:

```text
Username: admin
Password: admin123
```

Hasil yang diharapkan:

```text
Masuk ke dashboard admin dan menu admin tampil lengkap.
```

---

### Pengujian Login Guru

Data uji:

```text
Username: guru
Password: guru123
```

Hasil yang diharapkan:

```text
Masuk ke dashboard guru dan menu guru tampil sesuai hak akses.
```

---

### Pengujian Login Siswa

Data uji:

```text
Username: siswa
Password: siswa123
```

Hasil yang diharapkan:

```text
Masuk ke dashboard siswa dan hanya melihat menu Dashboard, Laporan, dan Logout.
```

---

### Pengujian Login Gagal

Data uji:

```text
Username: salah
Password: salah
```

Hasil yang diharapkan:

```text
Sistem menampilkan pesan Username atau password salah.
```

---

### Pengujian CRUD Data Siswa

Data uji:

```text
NIS: 2026021
Nama: Contoh Siswa
Kelas: 5A
```

Hasil yang diharapkan:

```text
Data siswa dapat ditambah, ditampilkan, diedit, dan dihapus.
```

---

### Pengujian CRUD Data Guru

Data uji:

```text
ID Guru: G011
Nama Guru: Contoh Guru
Mata Pelajaran: Matematika
```

Hasil yang diharapkan:

```text
Data guru dapat ditambah, ditampilkan, diedit, dan dihapus.
```

---

### Pengujian CRUD Akun User

Data uji:

```text
Nama: Akun Tes
Username: akuntes
Password: 12345
Role: siswa
NIS: 2026001
```

Hasil yang diharapkan:

```text
Akun user dapat ditambah, ditampilkan, diedit, dan dihapus oleh admin.
```

---

### Pengujian Input Nilai Valid

Data uji:

```text
Tugas: 97
UTS: 94
UAS: 100
```

Hasil yang diharapkan:

```text
Nilai diterima, nilai akhir menjadi 97.30, dan status Lulus.
```

---

### Pengujian Input Nilai Tidak Valid

Data uji:

```text
Tugas: 120
UTS: 80
UAS: 90
```

Hasil yang diharapkan:

```text
Sistem menolak input karena nilai harus berada pada rentang 0 sampai 100.
```

---

### Pengujian Laporan Siswa

Data uji:

```text
Login menggunakan akun siswa, misalnya 2026008 / siswa123.
```

Hasil yang diharapkan:

```text
Siswa hanya melihat laporan nilai miliknya sendiri.
```

---

## 4.14 Troubleshooting

### Error: Cannot find module server.js

Penyebab:

```text
Terminal tidak berada di folder backend.
```

Solusi:

```bash
cd backend
node server.js
```

---

### Error: Unknown database db_nilai_siswa_node

Penyebab:

```text
Database belum dibuat atau belum diimport.
```

Solusi:

```text
Import file backend/database.sql melalui phpMyAdmin.
```

---

### Error: Access denied for user root

Penyebab:

```text
Password MySQL tidak sesuai dengan konfigurasi backend.
```

Solusi:

```text
Ubah password pada koneksi database di file backend/server.js.
```

---

### Login gagal padahal username dan password benar

Penyebab yang mungkin:

```text
Backend belum berjalan.
Database belum aktif.
Akun belum ada di tabel users.
Frontend tidak terhubung ke localhost:3001.
```

Solusi:

```text
Pastikan XAMPP MySQL aktif.
Pastikan backend berjalan dengan npm start.
Pastikan akun ada di tabel users.
Pastikan API backend menggunakan http://localhost:3001.
```

---

### Data tidak tampil di laporan

Penyebab yang mungkin:

```text
Tabel nilai masih kosong.
Relasi siswa atau guru belum sesuai.
Akun siswa belum memiliki NIS yang sama dengan tabel siswa.
```

Solusi:

```text
Cek tabel nilai di phpMyAdmin.
Pastikan nilai.id_siswa terhubung dengan siswa.id.
Pastikan nilai.id_guru terhubung dengan guru.id.
Pastikan users.nis sama dengan siswa.nis untuk akun siswa.
```

---

## 4.15 Catatan Penting

1. Backend harus berjalan agar login dan data dapat diproses.
2. Frontend hanya menampilkan halaman dan mengirim request ke backend.
3. Database menyimpan data users, siswa, guru, dan nilai.
4. Nilai akhir dan status dihitung di backend.
5. Siswa hanya melihat nilai berdasarkan NIS akun yang sedang login.
6. Admin dapat mengelola akun user melalui menu Akun User.
7. Status Lulus/Tidak Lulus pada laporan adalah status nilai per mata pelajaran.
8. Password masih dibuat sederhana karena project ini difokuskan untuk pembelajaran dasar CRUD, validasi, database, fungsi, dan OOP.
9. Untuk sistem produksi, password sebaiknya disimpan dalam bentuk hash.

---

## 4.16 Kesimpulan

Aplikasi Sistem Pengolahan Nilai Siswa SDN Mangun Jaya 06 sudah memiliki fitur utama yang dibutuhkan dalam project pembekalan skema Programmer. Aplikasi mendukung login berdasarkan role, CRUD data siswa, CRUD data guru, CRUD akun user, input nilai, edit nilai, hapus nilai, validasi nilai, perhitungan nilai akhir otomatis, status Lulus/Tidak Lulus, dan laporan nilai sesuai hak akses.

Program ini juga sudah menerapkan pemrograman terstruktur melalui fungsi validasiNilai(), hitungNilaiAkhir(), dan statusKelulusan(). Selain itu, program menerapkan OOP melalui class Siswa, Guru, dan Nilai.

Dengan struktur sederhana menggunakan HTML, CSS, JavaScript native, Node.js native, MySQL, dan mysql2, aplikasi ini mudah dijalankan, mudah dipahami, dan mudah dijelaskan saat ujian LSP.
