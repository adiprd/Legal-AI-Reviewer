# AI Legal Document Reviewer

## Gambaran Umum

AI Legal Document Reviewer adalah aplikasi web berbasis AI yang dirancang untuk menganalisis dokumen hukum secara otomatis. Aplikasi ini menggunakan teknik natural language processing untuk mendeteksi klausul-klausul penting, mengidentifikasi potensi risiko, dan memberikan rekomendasi analisis terhadap dokumen hukum.

## Fitur Utama

### 1. **Analisis Dokumen Otomatis**
- Deteksi klausul-klausul hukum standar
- Identifikasi kata kunci dan pola dalam dokumen
- Ekstraksi konteks sekitar klausul yang terdeteksi
- Analisis tingkat kepercayaan untuk setiap deteksi

### 2. **Deteksi Risiko Hukum**
- Identifikasi istilah berisiko tinggi
- Peringatan untuk klausul yang berpotensi merugikan
- Klasifikasi tingkat risiko (Rendah, Sedang, Tinggi, Kritis)
- Scoring risiko otomatis

### 3. **Visualisasi Hasil**
- Dashboard statistik lengkap
- Tampilan klausul yang terdeteksi
- Daftar masalah dan peringatan
- Badge tingkat risiko dengan warna kode

### 4. **Export Laporan**
- Generate laporan analisis dalam format JSON
- Data lengkap termasuk metadata dokumen
- Timestamp dan summary analisis

## Teknologi yang Digunakan

### Frontend
- **HTML5**: Struktur aplikasi web
- **CSS3**: Styling dengan design system minimalis
- **Vanilla JavaScript**: Logic aplikasi dan interaksi
- **Font Awesome**: Ikon untuk UI

### Backend (Client-side)
- **DocumentProcessor**: Class untuk pemrosesan dokumen
- **RuleEngine**: Engine untuk evaluasi aturan hukum
- **FileReader API**: Untuk membaca file upload

### Data & Konfigurasi
- **JSON-based Rules**: Aturan deteksi dalam format JSON
- **Pattern Matching**: Deteksi berdasarkan kata kunci
- **Risk Scoring Algorithm**: Perhitungan skor risiko otomatis

## Struktur Project

```
legal-ai-reviewer/
├── index.html                 # Main application
├── css/
│   └── style.css             # Stylesheet minimalis
├── js/
│   ├── app.js                # Main application logic
│   ├── documentProcessor.js  # Document processing engine
│   └── ruleEngine.js         # Rule evaluation engine
├── config/
│   └── legalRules.json       # Legal rules configuration
└── samples/
    └── sample-contract.txt   # Contoh dokumen untuk testing
```

## Aturan Deteksi yang Diimplementasi

### Klausul yang Dideteksi
1. **Klausul Kerahasiaan** (Confidentiality)
2. **Klausul Tanggung Jawab** (Liability)
3. **Klausul Pengakhiran** (Termination)
4. **Klausul Pembayaran** (Payment)
5. **Klausul Kekayaan Intelektual** (Intellectual Property)
6. **Klausul Hukum yang Berlaku** (Governing Law)

### Indikator Risiko
- **High Risk Terms**: Istilah tanpa batas, selamanya, mutlak
- **Warning Signs**: Denda, sanksi, sepihak, keadaan memaksa
- **Document Length**: Validasi kelengkapan dokumen

## Instalasi dan Menjalankan

### Prerequisites
- Web browser modern (Chrome, Firefox, Safari, Edge)
- Python 3.x (untuk local server)
- Atau web server lainnya

### Langkah Menjalankan

1. **Clone atau download project**
```bash
cd legal-ai-reviewer
```

2. **Jalankan local server**
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js (jika ada)
npx http-server

# Atau menggunakan PHP (jika ada)
php -S localhost:8000
```

3. **Akses aplikasi**
```
Buka browser dan akses: http://localhost:8000
```

4. **Testing dengan sample**
```
Upload file: samples/sample-contract.txt
```

## Cara Penggunaan

### 1. Upload Dokumen
- Klik area upload atau drag & drop file
- Format yang didukung: .txt, .pdf, .doc, .docx
- File akan divalidasi sebelum diproses

### 2. Analisis Dokumen
- Klik tombol "Analisis Dokumen"
- Sistem akan memproses dan menganalisis konten
- Progress indicator akan ditampilkan

### 3. Review Hasil
- Lihat statistik summary (klausul, masalah, skor risiko)
- Periksa klausul yang terdeteksi
- Review potensi masalah dan peringatan
- Perhatikan tingkat risiko keseluruhan

### 4. Export Laporan
- Klik tombol "Export Laporan" untuk menyimpan hasil
- Laporan disimpan dalam format JSON
- Dapat digunakan untuk dokumentasi atau analisis lanjutan

## Konfigurasi Aturan

### Menambah Klausul Baru
Edit file `config/legalRules.json`:

```json
{
  "new_clause": {
    "keywords": ["kata_kunci1", "kata_kunci2"],
    "risk_level": "medium",
    "description": "Deskripsi Klausul Baru"
  }
}
```

### Menyesuaikan Risk Scoring
Parameter yang dapat disesuaikan:
- `weights` untuk tingkat risiko (low:1, medium:3, high:5)
- `threshold` untuk klasifikasi risiko
- `min_contract_length` untuk validasi dokumen

## Customization

### Warna Tema
Aplikasi menggunakan design system dengan warna utama biru (#2563eb). Untuk mengubah tema, edit variabel CSS di `css/style.css`:

```css
:root {
    --primary: #your-color;
    --primary-dark: #dark-variant;
    --primary-light: #light-variant;
}
```

### Menambah Bahasa
Saat ini aplikasi menggunakan Bahasa Indonesia. Untuk menambah bahasa lain:
1. Tambahkan terjemahan di file JavaScript
2. Update teks UI di `index.html`
3. Sesuaikan aturan deteksi di `legalRules.json`

## Troubleshooting

### Masalah Umum

1. **File tidak bisa diupload**
   - Pastikan format file didukung (.txt, .pdf, .doc, .docx)
   - Check ukuran file tidak terlalu besar
   - Pastikan browser mendukung FileReader API

2. **Analisis tidak berjalan**
   - Check console browser untuk error messages
   - Pastikan file `legalRules.json` terload dengan benar
   - Verify bahwa dokumen mengandung teks yang bisa diproses

3. **Hasil tidak akurat**
   - Review aturan deteksi di `legalRules.json`
   - Tambahkan kata kunci yang lebih spesifik
   - Adjust threshold confidence jika diperlukan

### Browser Compatibility
- Chrome 80+ (Recommended)
- Firefox 75+
- Safari 13+
- Edge 80+

## Pengembangan Lanjutan

### Fitur yang Dapat Ditambahkan

1. **Enhanced NLP**
   - Integration dengan library NLP seperti Compromise atau Natural
   - Entity recognition untuk nama pihak, nilai, tanggal
   - Semantic analysis untuk understanding konteks

2. **Machine Learning**
   - Model klasifikasi untuk jenis dokumen
   - Predictive analysis untuk risk assessment
   - Learning dari feedback pengguna

3. **Integration**
   - Cloud storage integration (Google Drive, Dropbox)
   - API endpoints untuk batch processing
   - Database untuk history analisis

4. **Advanced Features**
   - Comparative analysis antara dokumen
   - Template recommendation
   - Legal compliance checking
   - Multi-language support

## Kontribusi

Kontribusi untuk pengembangan dipersilakan. Beberapa area yang dapat dikembangkan:

1. **Improve Detection Accuracy**
   - Tambahkan lebih banyak pola deteksi
   - Implementasi context-aware analysis
   - Better false positive reduction

2. **UI/UX Improvements**
   - Enhanced visualization
   - Interactive risk analysis
   - Mobile-responsive design

3. **Backend Development**
   - Server-side processing
   - User authentication
   - Data persistence

## Lisensi

Project ini menggunakan MIT License.

## Disclaimer

AI Legal Document Reviewer adalah tool bantu analisis dan tidak menggantikan konsultasi dengan professional hukum. Hasil analisis harus diverifikasi oleh legal expert sebelum digunakan untuk keputusan hukum yang mengikat.

---

**AI Legal Document Reviewer** - Membantu analisis dokumen hukum dengan kecerdasan buatan untuk deteksi risiko dan compliance checking yang lebih efisien.
