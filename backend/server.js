/**
 * Backend Sistem Pengolahan Nilai Mahasiswa — Universitas Gunadarma
 * Teknologi: Node.js (HTTP native) + MySQL (mysql2)
 *
 * Alur kerja:
 * 1. Frontend mengirim request (fetch) ke route di server ini
 * 2. Server memproses data (validasi, hitung nilai, CRUD)
 * 3. Data disimpan / diambil dari MySQL
 * 4. Server mengirim response JSON ke frontend
 */

// =============================================================================
// 1. IMPORT LIBRARY & KONFIGURASI
// =============================================================================
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = 3001;

// =============================================================================
// 2. KONEKSI DATABASE MySQL
// =============================================================================
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_nilai_gunadarma',
  waitForConnections: true,
  connectionLimit: 10
});

// =============================================================================
// 3. OOP — Class Mahasiswa & Nilai (contoh untuk ujikom)
// =============================================================================

class Mahasiswa {
  constructor(npm, nama, kelasProdi) {
    this.npm = npm;
    this.nama = nama;
    this.kelasProdi = kelasProdi;
  }
}

class Nilai {
  constructor(tugas, uts, uas) {
    this.tugas = Number(tugas);
    this.uts = Number(uts);
    this.uas = Number(uas);
  }

  hitungNilaiAkhir() {
    return (this.tugas * 0.3) + (this.uts * 0.3) + (this.uas * 0.4);
  }

  tentukanStatusKelulusan() {
    return this.hitungNilaiAkhir() >= 70 ? 'Lulus' : 'Tidak Lulus';
  }
}

// =============================================================================
// 4. PEMROGRAMAN TERSTRUKTUR — Validasi & Perhitungan Nilai
// =============================================================================

/** Validasi nilai Tugas, UTS, UAS harus 0–100 */
function validasiNilai(tugas, uts, uas) {
  return tugas >= 0 && tugas <= 100 &&
         uts >= 0 && uts <= 100 &&
         uas >= 0 && uas <= 100;
}

/** Rumus: 30% Tugas + 30% UTS + 40% UAS */
function hitungNilaiAkhir(tugas, uts, uas) {
  return Number(((tugas * 0.3) + (uts * 0.3) + (uas * 0.4)).toFixed(2));
}

/** Status kelulusan ditentukan dengan percabangan ternary */
function tentukanStatusKelulusan(nilaiAkhir) {
  return nilaiAkhir >= 70 ? 'Lulus' : 'Tidak Lulus';
}

/** Gabungkan validasi, hitung akhir, dan tentukan status */
function prosesNilai(tugas, uts, uas) {
  if (!validasiNilai(tugas, uts, uas)) {
    return { error: 'Nilai Tugas, UTS, dan UAS harus angka 0 sampai 100' };
  }
  const nilaiObj = new Nilai(tugas, uts, uas);
  const akhir = Number(nilaiObj.hitungNilaiAkhir().toFixed(2));
  const status = tentukanStatusKelulusan(akhir);
  return { akhir, status };
}

// =============================================================================
// 5. HELPER FUNCTION
// =============================================================================

/** Kirim response JSON ke frontend (dengan CORS untuk Live Server) */
function send(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

/** Baca body request JSON dari frontend */
function body(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
  });
}

/** Jalankan query SQL ke MySQL (parameterized untuk keamanan) */
async function query(sql, params = []) {
  const [rows] = await db.execute(sql, params);
  return rows;
}

/** Ambil ID dari URL, contoh: /mahasiswa/5 → 5 */
function pathId(pathname, segment) {
  return Number(pathname.split('/')[segment]);
}

/** Buat akun login mahasiswa otomatis saat data mahasiswa ditambahkan */
async function buatAkunMahasiswa(mahasiswaId, npm, nama) {
  await query(
    `INSERT INTO users (username, password, role, nama, reference_id)
     VALUES (?, 'mahasiswa123', 'mahasiswa', ?, ?)
     ON DUPLICATE KEY UPDATE nama = VALUES(nama), role = 'mahasiswa', reference_id = VALUES(reference_id)`,
    [npm, nama, mahasiswaId]
  );
}

/** Buat akun login dosen otomatis saat data dosen ditambahkan */
async function buatAkunDosen(dosenId, nidn, nama) {
  const username = String(nidn).toLowerCase();
  await query(
    `INSERT INTO users (username, password, role, nama, reference_id)
     VALUES (?, 'dosen123', 'dosen', ?, ?)
     ON DUPLICATE KEY UPDATE nama = VALUES(nama), role = 'dosen', reference_id = VALUES(reference_id)`,
    [username, nama, dosenId]
  );
}

// =============================================================================
// 6. ROUTE SERVER — Menerima request dari frontend
// =============================================================================
const server = http.createServer(async (req, res) => {
  try {
    // Preflight CORS (browser)
    if (req.method === 'OPTIONS') return send(res, 200, { ok: true });

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;

    // ----- ROUTE: LOGIN -----
    if (req.method === 'POST' && path === '/login') {
      const data = await body(req);
      const users = await query(
        `SELECT u.*, m.npm, m.kelas_prodi, d.nidn
         FROM users u
         LEFT JOIN mahasiswa m ON u.role = 'mahasiswa' AND u.reference_id = m.id
         LEFT JOIN dosen d ON u.role = 'dosen' AND u.reference_id = d.id
         WHERE u.username = ? AND u.password = ?`,
        [data.username, data.password]
      );
      if (!users.length) return send(res, 401, { message: 'Username atau password salah' });
      return send(res, 200, users[0]);
    }

    // ----- ROUTE: AKUN USER -----
    if (req.method === 'GET' && path === '/users') {
      const rows = await query(
        `SELECT u.id, u.nama, u.username, u.password, u.role, u.reference_id, m.npm
         FROM users u
         LEFT JOIN mahasiswa m ON u.role = 'mahasiswa' AND u.reference_id = m.id
         ORDER BY u.role, u.username`
      );
      return send(res, 200, rows);
    }

    if (req.method === 'POST' && path === '/users') {
      const data = await body(req);
      if (!data.nama || !data.username || !data.password || !data.role) {
        return send(res, 400, { message: 'Data akun belum lengkap' });
      }
      await query(
        'INSERT INTO users (username, password, role, nama, reference_id) VALUES (?, ?, ?, ?, ?)',
        [data.username, data.password, data.role, data.nama, data.reference_id || null]
      );
      return send(res, 201, { message: 'Akun ditambahkan' });
    }

    if (req.method === 'PUT' && path.startsWith('/users/')) {
      const id = pathId(path, 2);
      const data = await body(req);
      if (!data.nama || !data.username || !data.password || !data.role) {
        return send(res, 400, { message: 'Data akun belum lengkap' });
      }
      await query(
        'UPDATE users SET username = ?, password = ?, role = ?, nama = ?, reference_id = ? WHERE id = ?',
        [data.username, data.password, data.role, data.nama, data.reference_id || null, id]
      );
      return send(res, 200, { message: 'Akun diperbarui' });
    }

    if (req.method === 'DELETE' && path.startsWith('/users/')) {
      const id = pathId(path, 2);
      const rows = await query('SELECT username FROM users WHERE id = ?', [id]);
      if (rows[0]?.username === 'admin') {
        return send(res, 400, { message: 'Akun admin utama tidak boleh dihapus' });
      }
      await query('DELETE FROM users WHERE id = ?', [id]);
      return send(res, 200, { message: 'Akun dihapus' });
    }

    // ----- ROUTE: MAHASISWA (CRUD) -----
    if (req.method === 'GET' && path === '/mahasiswa') {
      return send(res, 200, await query('SELECT * FROM mahasiswa ORDER BY id DESC'));
    }

    if (req.method === 'POST' && path === '/mahasiswa') {
      const data = await body(req);
      if (!data.npm || !data.nama || !data.kelas_prodi) {
        return send(res, 400, { message: 'Data mahasiswa belum lengkap (NPM, nama, kelas/prodi)' });
      }
      const mhs = new Mahasiswa(data.npm, data.nama, data.kelas_prodi);
      const result = await query(
        'INSERT INTO mahasiswa (npm, nama, kelas_prodi) VALUES (?, ?, ?)',
        [mhs.npm, mhs.nama, mhs.kelasProdi]
      );
      await buatAkunMahasiswa(result.insertId, mhs.npm, mhs.nama);
      return send(res, 201, { message: 'Mahasiswa dan akun login ditambahkan' });
    }

    if (req.method === 'PUT' && path.startsWith('/mahasiswa/')) {
      const id = pathId(path, 2);
      const data = await body(req);
      const old = await query('SELECT * FROM mahasiswa WHERE id = ?', [id]);
      if (!old.length) return send(res, 404, { message: 'Mahasiswa tidak ditemukan' });
      if (!data.npm || !data.nama || !data.kelas_prodi) {
        return send(res, 400, { message: 'Data mahasiswa belum lengkap' });
      }
      await query('UPDATE mahasiswa SET npm = ?, nama = ?, kelas_prodi = ? WHERE id = ?',
        [data.npm, data.nama, data.kelas_prodi, id]);
      await query('UPDATE users SET nama = ?, username = ?, role = "mahasiswa", reference_id = ? WHERE reference_id = ? AND role = "mahasiswa"',
        [data.nama, data.npm, id, id]);
      await query('UPDATE users SET nama = ?, username = ?, role = "mahasiswa", reference_id = ? WHERE username = ?',
        [data.nama, data.npm, id, old[0].npm]);
      await buatAkunMahasiswa(id, data.npm, data.nama);
      return send(res, 200, { message: 'Mahasiswa dan akun diperbarui' });
    }

    if (req.method === 'DELETE' && path.startsWith('/mahasiswa/')) {
      const id = pathId(path, 2);
      const old = await query('SELECT * FROM mahasiswa WHERE id = ?', [id]);
      if (old.length) {
        await query('DELETE FROM users WHERE reference_id = ? AND role = "mahasiswa"', [id]);
        await query('DELETE FROM users WHERE username = ?', [old[0].npm]);
      }
      await query('DELETE FROM mahasiswa WHERE id = ?', [id]);
      return send(res, 200, { message: 'Mahasiswa dan akun dihapus' });
    }

    // ----- ROUTE: DOSEN (CRUD) -----
    if (req.method === 'GET' && path === '/dosen') {
      return send(res, 200, await query('SELECT * FROM dosen ORDER BY id DESC'));
    }

    if (req.method === 'POST' && path === '/dosen') {
      const data = await body(req);
      if (!data.nidn || !data.nama || !data.mata_kuliah) {
        return send(res, 400, { message: 'Data dosen belum lengkap (NIDN, nama, mata kuliah)' });
      }
      const result = await query(
        'INSERT INTO dosen (nidn, nama, mata_kuliah) VALUES (?, ?, ?)',
        [data.nidn, data.nama, data.mata_kuliah]
      );
      await buatAkunDosen(result.insertId, data.nidn, data.nama);
      return send(res, 201, { message: 'Dosen dan akun login ditambahkan' });
    }

    if (req.method === 'PUT' && path.startsWith('/dosen/')) {
      const id = pathId(path, 2);
      const data = await body(req);
      const old = await query('SELECT * FROM dosen WHERE id = ?', [id]);
      if (!old.length) return send(res, 404, { message: 'Dosen tidak ditemukan' });
      if (!data.nidn || !data.nama || !data.mata_kuliah) {
        return send(res, 400, { message: 'Data dosen belum lengkap' });
      }
      await query('UPDATE dosen SET nidn = ?, nama = ?, mata_kuliah = ? WHERE id = ?',
        [data.nidn, data.nama, data.mata_kuliah, id]);
      await query('UPDATE users SET nama = ?, username = ?, role = "dosen", reference_id = ? WHERE reference_id = ? AND role = "dosen"',
        [data.nama, String(data.nidn).toLowerCase(), id, id]);
      await query('UPDATE users SET nama = ?, username = ?, role = "dosen", reference_id = ? WHERE username = ?',
        [data.nama, String(data.nidn).toLowerCase(), id, String(old[0].nidn).toLowerCase()]);
      await buatAkunDosen(id, data.nidn, data.nama);
      return send(res, 200, { message: 'Dosen dan akun diperbarui' });
    }

    if (req.method === 'DELETE' && path.startsWith('/dosen/')) {
      const id = pathId(path, 2);
      const old = await query('SELECT * FROM dosen WHERE id = ?', [id]);
      if (old.length) {
        await query('DELETE FROM users WHERE reference_id = ? AND role = "dosen"', [id]);
        await query('DELETE FROM users WHERE username = ?', [String(old[0].nidn).toLowerCase()]);
      }
      await query('DELETE FROM dosen WHERE id = ?', [id]);
      return send(res, 200, { message: 'Dosen dan akun dihapus' });
    }

    // ----- ROUTE: NILAI & LAPORAN -----
    if (req.method === 'GET' && path === '/nilai') {
      const rows = await query(`
        SELECT n.*, m.npm, m.nama AS nama_mahasiswa, m.kelas_prodi,
               d.nama AS nama_dosen, d.nidn
        FROM nilai n
        JOIN mahasiswa m ON n.mahasiswa_id = m.id
        LEFT JOIN dosen d ON n.dosen_id = d.id
        ORDER BY n.id DESC
      `);
      return send(res, 200, rows);
    }

    if (req.method === 'POST' && path === '/nilai') {
      const data = await body(req);
      const tugas = Number(data.tugas);
      const uts = Number(data.uts);
      const uas = Number(data.uas);

      if (!data.mahasiswa_id || !data.dosen_id) {
        return send(res, 400, { message: 'Mahasiswa dan dosen wajib dipilih' });
      }

      const hasil = prosesNilai(tugas, uts, uas);
      if (hasil.error) return send(res, 400, { message: hasil.error });

      const dosenRows = await query('SELECT mata_kuliah FROM dosen WHERE id = ?', [data.dosen_id]);
      const mataKuliah = dosenRows[0]?.mata_kuliah || '-';

      await query(
        `INSERT INTO nilai (mahasiswa_id, dosen_id, mata_kuliah, tugas, uts, uas, nilai_akhir, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.mahasiswa_id, data.dosen_id, mataKuliah, tugas, uts, uas, hasil.akhir, hasil.status]
      );
      return send(res, 201, { message: 'Nilai disimpan', nilai_akhir: hasil.akhir, status: hasil.status });
    }

    if (req.method === 'PUT' && path.startsWith('/nilai/')) {
      const id = pathId(path, 2);
      const data = await body(req);
      const tugas = Number(data.tugas);
      const uts = Number(data.uts);
      const uas = Number(data.uas);

      if (!data.mahasiswa_id || !data.dosen_id) {
        return send(res, 400, { message: 'Data nilai belum lengkap' });
      }

      const hasil = prosesNilai(tugas, uts, uas);
      if (hasil.error) return send(res, 400, { message: hasil.error });

      const dosenRows = await query('SELECT mata_kuliah FROM dosen WHERE id = ?', [data.dosen_id]);
      const mataKuliah = dosenRows[0]?.mata_kuliah || '-';

      await query(
        `UPDATE nilai SET mahasiswa_id = ?, dosen_id = ?, mata_kuliah = ?, tugas = ?, uts = ?, uas = ?,
         nilai_akhir = ?, status = ? WHERE id = ?`,
        [data.mahasiswa_id, data.dosen_id, mataKuliah, tugas, uts, uas, hasil.akhir, hasil.status, id]
      );
      return send(res, 200, { message: 'Nilai diperbarui', nilai_akhir: hasil.akhir, status: hasil.status });
    }

    if (req.method === 'DELETE' && path.startsWith('/nilai/')) {
      await query('DELETE FROM nilai WHERE id = ?', [pathId(path, 2)]);
      return send(res, 200, { message: 'Nilai dihapus' });
    }

    return send(res, 404, { message: 'Route tidak ditemukan' });
  } catch (error) {
    console.error('Server error:', error.message);
    return send(res, 500, { message: error.message || 'Terjadi kesalahan pada server' });
  }
});

// =============================================================================
// 7. JALANKAN SERVER
// =============================================================================
server.listen(PORT, () => {
  console.log('Backend Universitas Gunadarma jalan di http://localhost:' + PORT);
});
