/**
 * Sistem Pengolahan Nilai Mahasiswa — Universitas Gunadarma
 * Frontend: HTML + CSS + JavaScript Native
 * Alur: fetch() → Backend Node.js → MySQL
 */

// =============================================================================
// 1. KONFIGURASI API
// =============================================================================
const API = 'http://localhost:3001'; // Alamat backend Node.js

// =============================================================================
// 2. STATE / DATA SEMENTARA
// =============================================================================
let user = null;           // User yang sedang login
let mahasiswaList = [];    // Data mahasiswa dari database
let dosenList = [];        // Data dosen dari database
let nilaiList = [];        // Data nilai / laporan dari database
let accounts = [];         // Data akun user (hanya admin)
let modalMode = '';        // Mode modal: edit / hapus
let modalId = null;        // ID data yang sedang diedit / dihapus

const $ = id => document.getElementById(id); // Shortcut ambil elemen HTML

// =============================================================================
// 3. OOP — Class Mahasiswa & Nilai (contoh untuk ujikom)
// =============================================================================

/** Class Mahasiswa: menyimpan atribut npm, nama, kelasProdi */
class Mahasiswa {
  constructor(npm, nama, kelasProdi) {
    this.npm = npm;
    this.nama = nama;
    this.kelasProdi = kelasProdi;
  }
}

/** Class Nilai: menyimpan nilai tugas, UTS, UAS dan method perhitungan */
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

/** Status kelulusan: Lulus jika nilai akhir >= 70 */
function tentukanStatusKelulusan(nilaiAkhir) {
  return nilaiAkhir >= 70 ? 'Lulus' : 'Tidak Lulus';
}

// =============================================================================
// 5. HELPER FUNCTION
// =============================================================================

/**
 * Fungsi umum request ke backend memakai fetch()
 * Frontend mengirim JSON → Backend memproses → Response JSON
 */
async function api(url, method = 'GET', data = null) {
  try {
    const opt = { method, headers: { 'Content-Type': 'application/json' } };
    if (data) opt.body = JSON.stringify(data);

    const res = await fetch(API + url, opt);
    let json;
    try {
      json = await res.json();
    } catch {
      throw new Error('Gagal membaca response server. Pastikan backend berjalan.');
    }

    if (!res.ok) throw new Error(json.message || 'Terjadi kesalahan pada server.');
    return json;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error('Tidak dapat terhubung ke backend. Jalankan server di http://localhost:3001');
    }
    throw err;
  }
}

/** Tampilkan pesan sukses / error di halaman */
function pesan(id, teks, sukses = false) {
  const el = $(id);
  if (!el) return;
  el.innerText = teks || '';
  el.className = teks
    ? 'msg d-block ' + (sukses ? 'text-success' : 'text-danger')
    : 'msg d-none';
}

/** Ubah role database ke label tampilan */
function labelRole(role) {
  if (role === 'dosen') return 'Dosen';
  if (role === 'mahasiswa') return 'Mahasiswa';
  if (role === 'admin') return 'Admin';
  return role;
}

/** Buat tabel HTML dari header dan baris data */
function table(head, rows) {
  if (!rows.length) {
    return `<table class="table table-hover align-middle mb-0">
      <thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody><tr><td colspan="${head.length}" class="text-center text-secondary py-4">Data belum tersedia</td></tr></tbody>
    </table>`;
  }
  return `<table class="table table-striped table-hover align-middle mb-0">
    <thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;
}

function statusHtml(status) {
  const cls = status === 'Lulus' ? 'badge-lulus' : 'badge-tidak-lulus';
  return `<span class="${cls}">${status}</span>`;
}

// =============================================================================
// 6. LOGIN DAN ROLE
// =============================================================================

/** Login: kirim username & password ke POST /login, backend cek di tabel users */
async function loginUser(e) {
  e.preventDefault();
  pesan('error', '');
  try {
    user = await api('/login', 'POST', {
      username: $('username').value.trim(),
      password: $('password').value
    });
    $('login').classList.add('hide');
    $('app').classList.remove('hide');
    $('userBox').innerHTML = `<i class="bi bi-person-circle me-2"></i>${user.nama} (${labelRole(user.role)})`;
    aturMenuRole();
    await load();
    show('dashboard');
  } catch (err) {
    pesan('error', err.message || 'Login gagal. Periksa username dan password.');
  }
}

/** Atur menu sidebar sesuai role: admin, dosen, mahasiswa */
function aturMenuRole() {
  document.querySelectorAll('.admin').forEach(el => {
    el.style.display = user.role === 'admin' ? 'block' : 'none';
  });
  document.querySelectorAll('.dosen').forEach(el => {
    el.style.display = (user.role === 'dosen' || user.role === 'admin') ? 'block' : 'none';
  });
}

// =============================================================================
// 7. LOAD DATA & RENDER TAMPILAN
// =============================================================================

/** Ambil semua data dari backend setelah login */
async function load() {
  try {
    mahasiswaList = await api('/mahasiswa');
    dosenList = await api('/dosen');
    nilaiList = await api('/nilai');
    accounts = user.role === 'admin' ? await api('/users') : [];
    render();
  } catch (err) {
    pesan('error', err.message);
  }
}

/** Pindah halaman (dashboard, mahasiswa, dosen, nilai, laporan) */
function show(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hide'));
  $(id).classList.remove('hide');

  document.querySelectorAll('.sidebar .nav-link').forEach(btn => btn.classList.remove('active'));
  const activeBtn = $('menu-' + id);
  if (activeBtn) activeBtn.classList.add('active');

  const judul = {
    dashboard: 'Dashboard',
    siswa: 'Data Mahasiswa',
    guru: 'Data Dosen',
    akun: 'Akun User',
    nilai: 'Input Nilai Mahasiswa',
    laporan: 'Laporan Nilai Mahasiswa'
  };
  $('title').innerText = judul[id] || 'Dashboard';
  render();
}

/** Render dashboard, tabel mahasiswa, dosen, akun, dan laporan nilai */
function render() {
  // Dashboard — ringkasan jumlah data
  $('totalSiswa').innerText = mahasiswaList.length;
  $('totalGuru').innerText = dosenList.length;
  $('totalNilai').innerText = nilaiList.length;

  // Dropdown input nilai
  $('pilihSiswa').innerHTML = '<option value="">Pilih Mahasiswa</option>' +
    mahasiswaList.map(m => `<option value="${m.id}">${m.npm} — ${m.nama}</option>`).join('');
  $('pilihGuru').innerHTML = '<option value="">Pilih Dosen</option>' +
    dosenList.map(d => `<option value="${d.id}">${d.nidn} — ${d.nama} (${d.mata_kuliah})</option>`).join('');

  // Tabel Data Mahasiswa
  $('tableSiswa').innerHTML = '<h5 class="fw-bold text-dark-purple mb-3"><i class="bi bi-table me-2"></i>Data Mahasiswa</h5>' +
    table(['NPM', 'Nama Mahasiswa', 'Kelas / Prodi', 'Aksi'],
      mahasiswaList.map(m => [m.npm, m.nama, m.kelas_prodi, aksiMahasiswa(m)]));

  // Tabel Data Dosen
  $('tableGuru').innerHTML = '<h5 class="fw-bold text-dark-purple mb-3"><i class="bi bi-table me-2"></i>Data Dosen</h5>' +
    table(['NIDN', 'Nama Dosen', 'Mata Kuliah', 'Aksi'],
      dosenList.map(d => [d.nidn, d.nama, d.mata_kuliah, aksiDosen(d)]));

  // Tabel Akun User (admin saja)
  if ($('tableAkun')) {
    $('tableAkun').innerHTML = '<h5 class="fw-bold text-dark-purple mb-3"><i class="bi bi-table me-2"></i>Data Akun User</h5>' +
      table(['Nama', 'Username', 'Password', 'Role', 'Ref ID', 'NPM', 'Aksi'],
        accounts.map(a => [
          a.nama, a.username, a.password, labelRole(a.role),
          a.reference_id || '-', a.npm || '-', aksiAkun(a)
        ]));
  }

  // Laporan Nilai — mahasiswa hanya melihat nilai sendiri
  const laporan = (user && user.role === 'mahasiswa')
    ? nilaiList.filter(n =>
        n.mahasiswa_id === user.reference_id ||
        n.npm === user.npm ||
        n.npm === user.username)
    : nilaiList;

  $('tableNilai').innerHTML = '<h5 class="fw-bold text-dark-purple mb-3"><i class="bi bi-table me-2"></i>Laporan Nilai Mahasiswa</h5>' +
    table(
      ['NPM', 'Nama', 'Kelas / Prodi', 'Dosen', 'Mata Kuliah', 'Tugas', 'UTS', 'UAS', 'Akhir', 'Status', 'Aksi'],
      laporan.map(n => [
        n.npm, n.nama_mahasiswa, n.kelas_prodi, n.nama_dosen || '-', n.mata_kuliah || '-',
        n.tugas, n.uts, n.uas, n.nilai_akhir, statusHtml(n.status), aksiNilai(n)
      ])
    );
}

// Tombol aksi di tabel
function aksiMahasiswa(m) {
  return `<button class="btn btn-sm btn-action-edit me-1" onclick="editMahasiswa(${m.id})">Edit</button>
          <button class="btn btn-sm btn-action-del" onclick="askDelete('mahasiswa', ${m.id})">Hapus</button>`;
}
function aksiDosen(d) {
  return `<button class="btn btn-sm btn-action-edit me-1" onclick="editDosen(${d.id})">Edit</button>
          <button class="btn btn-sm btn-action-del" onclick="askDelete('dosen', ${d.id})">Hapus</button>`;
}
function aksiAkun(a) {
  return `<button class="btn btn-sm btn-action-edit me-1" onclick="editAccount(${a.id})">Edit</button>
          <button class="btn btn-sm btn-action-del" onclick="askDelete('akun', ${a.id})">Hapus</button>`;
}
function aksiNilai(n) {
  if (user.role === 'mahasiswa') return '-';
  return `<button class="btn btn-sm btn-action-edit me-1" onclick="editGrade(${n.id})">Edit</button>
          <button class="btn btn-sm btn-action-del" onclick="askDelete('nilai', ${n.id})">Hapus</button>`;
}

// =============================================================================
// 8. CRUD MAHASISWA
// =============================================================================

async function addStudent() {
  pesan('msgSiswa', '');
  const npm = $('nis').value.trim();
  const nama = $('namaSiswa').value.trim();
  const kelasProdi = $('kelas').value;
  if (!npm || !nama || !kelasProdi) {
    return pesan('msgSiswa', 'NPM, nama, dan kelas/prodi wajib diisi.');
  }

  const mhs = new Mahasiswa(npm, nama, kelasProdi); // Contoh penggunaan class OOP
  try {
    await api('/mahasiswa', 'POST', { npm: mhs.npm, nama: mhs.nama, kelas_prodi: mhs.kelasProdi });
    $('nis').value = ''; $('namaSiswa').value = ''; $('kelas').value = '';
    await load();
    pesan('msgSiswa', 'Mahasiswa berhasil ditambahkan. Akun login otomatis dibuat (username = NPM).', true);
  } catch (err) {
    pesan('msgSiswa', err.message);
  }
}

// =============================================================================
// 9. CRUD DOSEN
// =============================================================================

async function addTeacher() {
  pesan('msgGuru', '');
  if (!$('kode').value.trim() || !$('namaGuru').value.trim() || !$('mapel').value.trim()) {
    return pesan('msgGuru', 'NIDN, nama dosen, dan mata kuliah wajib diisi.');
  }
  try {
    await api('/dosen', 'POST', {
      nidn: $('kode').value.trim(),
      nama: $('namaGuru').value.trim(),
      mata_kuliah: $('mapel').value.trim()
    });
    $('kode').value = ''; $('namaGuru').value = ''; $('mapel').value = '';
    await load();
    pesan('msgGuru', 'Dosen berhasil ditambahkan. Akun login otomatis dibuat (username = NIDN).', true);
  } catch (err) {
    pesan('msgGuru', err.message);
  }
}

// =============================================================================
// 10. CRUD AKUN USER
// =============================================================================

async function addAccount() {
  pesan('msgAkun', '');
  const data = {
    nama: $('akunNama').value.trim(),
    username: $('akunUsername').value.trim(),
    password: $('akunPassword').value,
    role: $('akunRole').value,
    reference_id: $('akunRef').value.trim() ? Number($('akunRef').value) : null
  };
  if (!data.nama || !data.username || !data.password || !data.role) {
    return pesan('msgAkun', 'Nama, username, password, dan role wajib diisi.');
  }
  try {
    await api('/users', 'POST', data);
    $('akunNama').value = ''; $('akunUsername').value = '';
    $('akunPassword').value = ''; $('akunRole').value = ''; $('akunRef').value = '';
    await load();
    pesan('msgAkun', 'Akun berhasil ditambahkan.', true);
  } catch (err) {
    pesan('msgAkun', err.message);
  }
}

// =============================================================================
// 11. INPUT NILAI — Validasi 0–100, kirim ke backend untuk disimpan ke MySQL
// =============================================================================

async function addGrade() {
  pesan('msgNilai', '');
  if (!$('pilihSiswa').value || !$('pilihGuru').value) {
    return pesan('msgNilai', 'Pilih mahasiswa dan dosen terlebih dahulu.');
  }

  const tugas = Number($('tugas').value);
  const uts = Number($('uts').value);
  const uas = Number($('uas').value);

  // Tolak nilai di luar 0–100 (misalnya 120 atau -1)
  if (!validasiNilai(tugas, uts, uas)) {
    alert('Nilai Tugas, UTS, dan UAS harus berada di rentang 0 sampai 100.');
    return pesan('msgNilai', 'Nilai Tugas, UTS, dan UAS harus 0 sampai 100.');
  }

  // Contoh OOP: hitung nilai akhir dan status di frontend (preview)
  const nilaiObj = new Nilai(tugas, uts, uas);
  nilaiObj.hitungNilaiAkhir();
  nilaiObj.tentukanStatusKelulusan();

  try {
    await api('/nilai', 'POST', {
      mahasiswa_id: $('pilihSiswa').value,
      dosen_id: $('pilihGuru').value,
      tugas, uts, uas
    });
    $('tugas').value = ''; $('uts').value = ''; $('uas').value = '';
    await load();
    show('laporan');
  } catch (err) {
    pesan('msgNilai', err.message);
  }
}

// =============================================================================
// 12. MODAL — Edit & Hapus Data
// =============================================================================

function openModal(title, body, mode, id, tombol) {
  modalMode = mode;
  modalId = id;
  $('modalTitle').innerText = title;
  $('modalBody').innerHTML = body;
  $('modalBtn').innerText = tombol;
  pesan('msgModal', '');
  $('modal').classList.remove('hide');
}

window.closeModal = function () {
  $('modal').classList.add('hide');
  modalMode = '';
  modalId = null;
};

function opsiKelas(value) {
  const list = ['4IA26', 'TI-3A', 'SI-3B', 'MI-2A'];
  return `<select id="editKelas" class="form-select">${list.map(k =>
    `<option value="${k}" ${value === k ? 'selected' : ''}>${k}</option>`
  ).join('')}</select>`;
}

function opsiRole(value) {
  return `<select id="editRole" class="form-select">
    <option value="admin" ${value === 'admin' ? 'selected' : ''}>admin</option>
    <option value="dosen" ${value === 'dosen' ? 'selected' : ''}>dosen</option>
    <option value="mahasiswa" ${value === 'mahasiswa' ? 'selected' : ''}>mahasiswa</option>
  </select>`;
}

function editMahasiswa(id) {
  const m = mahasiswaList.find(x => x.id === id);
  if (!m) return;
  openModal('Edit Data Mahasiswa',
    `<label>NPM</label><input id="editNpm" class="form-control" value="${m.npm}">
     <label>Nama Mahasiswa</label><input id="editNamaMhs" class="form-control" value="${m.nama}">
     <label>Kelas / Prodi</label>${opsiKelas(m.kelas_prodi)}`,
    'edit-mahasiswa', id, 'Simpan');
}

function editDosen(id) {
  const d = dosenList.find(x => x.id === id);
  if (!d) return;
  openModal('Edit Data Dosen',
    `<label>NIDN</label><input id="editNidn" class="form-control" value="${d.nidn}">
     <label>Nama Dosen</label><input id="editNamaDosen" class="form-control" value="${d.nama}">
     <label>Mata Kuliah</label><input id="editMataKuliah" class="form-control" value="${d.mata_kuliah}">`,
    'edit-dosen', id, 'Simpan');
}

function editAccount(id) {
  const a = accounts.find(x => x.id === id);
  if (!a) return;
  openModal('Edit Akun User',
    `<label>Nama</label><input id="editAkunNama" class="form-control" value="${a.nama}">
     <label>Username</label><input id="editAkunUsername" class="form-control" value="${a.username}">
     <label>Password</label><input id="editAkunPassword" class="form-control" value="${a.password}">
     <label>Role</label>${opsiRole(a.role)}
     <label>Reference ID</label><input id="editAkunRef" class="form-control" value="${a.reference_id || ''}">`,
    'edit-akun', id, 'Simpan');
}

function editGrade(id) {
  const n = nilaiList.find(x => x.id === id);
  if (!n) return;
  openModal('Edit Nilai Mahasiswa',
    `<label>Nilai Tugas (0–100)</label><input id="editTugas" type="number" min="0" max="100" class="form-control" value="${n.tugas}">
     <label>Nilai UTS (0–100)</label><input id="editUts" type="number" min="0" max="100" class="form-control" value="${n.uts}">
     <label>Nilai UAS (0–100)</label><input id="editUas" type="number" min="0" max="100" class="form-control" value="${n.uas}">`,
    'edit-nilai', id, 'Simpan');
}

function askDelete(tipe, id) {
  openModal('Hapus Data', '<p class="mb-0 text-muted">Yakin ingin menghapus data ini?</p>', 'hapus-' + tipe, id, 'Hapus');
}

window.submitModal = async function () {
  if (modalMode === 'edit-mahasiswa') return saveMahasiswa();
  if (modalMode === 'edit-dosen') return saveDosen();
  if (modalMode === 'edit-akun') return saveAccount();
  if (modalMode === 'edit-nilai') return saveGrade();
  if (modalMode.startsWith('hapus-')) return deleteData();
};

async function saveMahasiswa() {
  const data = {
    npm: $('editNpm').value.trim(),
    nama: $('editNamaMhs').value.trim(),
    kelas_prodi: $('editKelas').value
  };
  if (!data.npm || !data.nama || !data.kelas_prodi) {
    return pesan('msgModal', 'Data mahasiswa tidak boleh kosong.');
  }
  try {
    await api('/mahasiswa/' + modalId, 'PUT', data);
    closeModal(); await load();
  } catch (err) { pesan('msgModal', err.message); }
}

async function saveDosen() {
  const data = {
    nidn: $('editNidn').value.trim(),
    nama: $('editNamaDosen').value.trim(),
    mata_kuliah: $('editMataKuliah').value.trim()
  };
  if (!data.nidn || !data.nama || !data.mata_kuliah) {
    return pesan('msgModal', 'Data dosen tidak boleh kosong.');
  }
  try {
    await api('/dosen/' + modalId, 'PUT', data);
    closeModal(); await load();
  } catch (err) { pesan('msgModal', err.message); }
}

async function saveAccount() {
  const data = {
    nama: $('editAkunNama').value.trim(),
    username: $('editAkunUsername').value.trim(),
    password: $('editAkunPassword').value,
    role: $('editRole').value,
    reference_id: $('editAkunRef').value.trim() ? Number($('editAkunRef').value) : null
  };
  if (!data.nama || !data.username || !data.password || !data.role) {
    return pesan('msgModal', 'Data akun tidak boleh kosong.');
  }
  try {
    await api('/users/' + modalId, 'PUT', data);
    closeModal(); await load();
  } catch (err) { pesan('msgModal', err.message); }
}

async function saveGrade() {
  const n = nilaiList.find(x => x.id === modalId);
  if (!n) return;

  const tugas = Number($('editTugas').value);
  const uts = Number($('editUts').value);
  const uas = Number($('editUas').value);

  if (!validasiNilai(tugas, uts, uas)) {
    alert('Nilai harus berada di rentang 0 sampai 100.');
    return pesan('msgModal', 'Nilai Tugas, UTS, dan UAS harus 0 sampai 100.');
  }

  try {
    await api('/nilai/' + modalId, 'PUT', {
      mahasiswa_id: n.mahasiswa_id,
      dosen_id: n.dosen_id,
      tugas, uts, uas
    });
    closeModal(); await load();
  } catch (err) { pesan('msgModal', err.message); }
}

async function deleteData() {
  const route = {
    'hapus-mahasiswa': '/mahasiswa/',
    'hapus-dosen': '/dosen/',
    'hapus-akun': '/users/',
    'hapus-nilai': '/nilai/'
  }[modalMode] || '/nilai/';

  try {
    await api(route + modalId, 'DELETE');
    closeModal(); await load();
  } catch (err) { pesan('msgModal', err.message); }
}
