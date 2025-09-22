// Variabel global untuk menyimpan operasi yang dipilih
let selectedOperation = null;

/* ==================================================
   EVENT LISTENER UNTUK TOMBOL OPERASI
   ================================================== */
document.querySelectorAll('.operation-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Hapus class "active" dari semua tombol
        document.querySelectorAll('.operation-btn').forEach(b => b.classList.remove('active'));

        // Tambahkan class "active" ke tombol yang diklik
        this.classList.add('active');

        // Simpan operasi yang dipilih
        selectedOperation = this.dataset.operation;
        document.getElementById('operation').value = selectedOperation;

        // Hitung hasil secara otomatis
        calculate();
    });
});

/* ==================================================
   FUNGSI: calculate()
   Reset pesan error.
   Ambil nilai input → ubah , jadi . supaya bisa diparse.
   Validasi angka kosong / tidak valid.
   Cek operasi (tambah, kurang, kali, bagi).
   Tampilkan hasil dengan format angka Indonesia (koma sebagai desimal).
   ================================================== */
function calculate() {
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.style.display = 'none';
        msg.textContent = '';
    });

    // Ambil nilai input (ganti koma dengan titik agar bisa diparse)
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

    if (!selectedOperation) {
        document.getElementById('hasil').textContent = 'Pilih operasi';
        return;
    }

    if (selectedOperation === 'divide' && angka2 === 0) {
        showError('error2', 'Tidak bisa membagi dengan nol');
        hasError = true;
    }

    if (hasError) {
        const hasil = document.getElementById('hasil');
        hasil.textContent = 'Input tidak valid. Harap masukkan angka yang benar';
        hasil.style.color = 'red';
        return;
    }

    // Lakukan perhitungan
    let result;
    switch(selectedOperation) {
        case 'add':
            result = angka1 + angka2;
            break;
        case 'subtract':
            result = angka1 - angka2;
            break;
        case 'multiply':
            result = angka1 * angka2;
            break;
        case 'divide':
            result = angka1 / angka2;
            break;
    }

    // Tampilkan hasil
    document.getElementById('hasil').style.color = 'black';
    document.getElementById('hasil').textContent = formatResult(result);
}

/* ==================================================
   FUNGSI: showError(elementId, message)
   Menampilkan pesan error spesifik di bawah input yang salah.
   ================================================== */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/* ==================================================
   FUNGSI: formatResult(result)
   Kalau hasil integer → tampil tanpa desimal.
   Kalau hasil pecahan → tampil maksimal 2 desimal,
   pakai format lokal Indonesia.
   ================================================== */
function formatResult(result) {
    if (Number.isInteger(result)) {
        return result.toLocaleString('id-ID');
    }
    return result.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}

/* ==================================================
   EVENT LISTENER ENTER
   Tekan Enter di input pertama → pindah ke input kedua.
   Tekan Enter di input kedua → langsung hitung hasil.
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
   Membatasi input supaya hanya angka,
   koma (untuk desimal Indonesia), dan minus (untuk bilangan negatif).
   Menghapus karakter lain otomatis saat user mengetik.
   ================================================== */
function allowOnlyNumbers(input) {
    input.addEventListener("input", function () {
        this.value = this.value
            .replace(/[^0-9,.-]/g, "")   // hanya angka, koma, minus
            .replace(/(,.*?),/g, "$1")   // hanya boleh satu koma
            .replace(/(-.*?)-/g, "$1");  // hanya boleh satu minus di depan
    });
}

// Terapkan ke kedua input
allowOnlyNumbers(document.getElementById("angka1"));
allowOnlyNumbers(document.getElementById("angka2"));
