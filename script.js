// Variabel global untuk menyimpan operasi matematika yang dipilih user
let selectedOperation = null;

/* ==================================================
   EVENT LISTENER UNTUK TOMBOL OPERASI
   - Saat tombol operasi (+, -, ×, ÷) diklik:
     1. Hapus status "active" dari semua tombol.
     2. Tambahkan class "active" hanya ke tombol yang dipilih.
     3. Simpan operasi yang dipilih ke variabel global.
     4. Jalankan fungsi calculate() untuk langsung menampilkan hasil.
   ================================================== */
document.querySelectorAll('.operation-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.operation-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        selectedOperation = this.dataset.operation;
        document.getElementById('operation').value = selectedOperation;
        calculate();
    });
});

/* ==================================================
   FUNGSI: calculate()
   Tujuan:
   - Melakukan proses utama perhitungan.
   Langkah-langkah:
   1. Reset pesan error.
   2. Ambil input angka dari user (ganti koma → titik).
   3. Validasi apakah input benar (angka, bukan kosong).
   4. Cek apakah operasi sudah dipilih.
   5. Khusus pembagian: cek apakah pembagi nol.
   6. Jika valid → lakukan perhitungan sesuai operasi.
   7. Tampilkan hasil dengan format Indonesia.
   ================================================== */
function calculate() {
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });

    // Ambil input angka dan konversi koma → titik
    const angka1 = parseFloat(document.getElementById('angka1').value.replace(',', '.'));
    const angka2 = parseFloat(document.getElementById('angka2').value.replace(',', '.'));

    // Validasi input
    let hasError = false;

    if (isNaN(angka1)) {
        showError('error1', 'Harap masukkan angka yang valid');
        hasError = true;
    }

    if (isNaN(angka2)) {
        showError('error2', 'Harap masukkan angka yang valid');
        hasError = true;
    }

    // Kalau belum pilih operasi
    if (!selectedOperation) {
        document.getElementById('hasil').textContent = 'Pilih operasi';
        return;
    }

    // Cek pembagian dengan nol
    if (selectedOperation === 'divide' && angka2 === 0) {
        showError('error2', 'Tidak bisa membagi dengan nol secara matematika tidak ada hasil yang konsisten');
        hasError = true;
    }

    // Kalau ada error → hentikan
    if (hasError) {
        const hasil = document.getElementById('hasil');
        hasil.textContent = 'Input tidak valid. Harap masukkan angka yang benar';
        hasil.style.color = 'red';
        return;
    }

    // Lakukan perhitungan sesuai operasi
    let result;
    switch(selectedOperation) {
        case 'add':      // Penjumlahan
            result = angka1 + angka2;
            break;
        case 'subtract': // Pengurangan
            result = angka1 - angka2;
            break;
        case 'multiply': // Perkalian
            result = angka1 * angka2;
            break;
        case 'divide':   // Pembagian
            result = angka1 / angka2;
            break;
    }

    // Tampilkan hasil dengan format Indonesia
    document.getElementById('hasil').style.color = 'black';
    document.getElementById('hasil').textContent = formatResult(result);
}

/* ==================================================
   FUNGSI: showError(elementId, message)
   Tujuan:
   - Menampilkan pesan error di bawah input tertentu.
   - Contoh: "Harap masukkan angka yang valid" atau
             "Tidak bisa membagi dengan nol".
   ================================================== */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/* ==================================================
   FUNGSI: formatResult(result)
   Tujuan:
   - Memformat hasil supaya rapi.
   Aturan:
   - Kalau hasil bilangan bulat → tampil tanpa desimal.
   - Kalau hasil pecahan → maksimal 2 angka di belakang koma.
   - Gunakan format lokal Indonesia (koma untuk desimal).
   ================================================== */
function formatResult(result) {
    if (Number.isInteger(result)) {
        return result.toLocaleString('id-ID');
    }
    return result.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

/* ==================================================
   EVENT LISTENER ENTER
   Tujuan:
   - Mempermudah input dengan keyboard.
   Aturan:
   - Tekan Enter di input pertama → fokus pindah ke input kedua.
   - Tekan Enter di input kedua → langsung jalankan perhitungan.
   ================================================== */
document.getElementById('angka1').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('angka2').focus();
    }
});
document.getElementById('angka2').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculate();
    }
});

/* ==================================================
   FUNGSI: allowOnlyNumbers(input)
   Tujuan:
   - Membatasi input supaya hanya angka, koma, dan minus.
   Aturan:
   - Hapus karakter selain [0-9 , . -]
   - Hanya boleh 1 koma (untuk desimal).
   - Hanya boleh 1 tanda minus, dan harus di depan.
   ================================================== */
function allowOnlyNumbers(input) {
    input.addEventListener("input", function () {
        this.value = this.value
            .replace(/[^0-9,.-]/g, "")   // hanya angka, koma, minus
            .replace(/(,.*?),/g, "$1")   // hanya boleh satu koma
            .replace(/(-.*?)-/g, "$1");  // hanya boleh satu minus di depan
    });
}

// Terapkan pembatasan input ke kedua kotak angka
allowOnlyNumbers(document.getElementById("angka1"));
allowOnlyNumbers(document.getElementById("angka2"));
