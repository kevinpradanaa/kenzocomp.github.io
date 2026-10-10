# KenzoComp

Situs company profile statis untuk KenzoComp, partner IT lokal berbasis di
Sidoarjo yang melayani Sidoarjo dan Surabaya. Situs ini tetap bisa disajikan
langsung dari GitHub Pages, Apache, atau Laragon: tidak memerlukan Node server,
build step, framework runtime, atau dependensi instalasi.

## Struktur

```text
index.html                     Beranda dan slider preview interaktif
layanan/
  konsultasi/index.html        ERP, custom software, web dan mobile
  thinkpad/index.html          Katalog ThinkPad dan filter
  service/index.html           Detail service dan formulir booking
portfolio/index.html           Portfolio dan filter kategori
tentang/index.html             Profil, visi, dan prinsip layanan
kontak/index.html              Form konsultasi dan peta area Sidoarjo
css/kenzocomp-modern.css       Token, komponen, dan breakpoint responsif
js/kenzocomp.js                Slider, menu, filter, dan form WhatsApp
data/products.json             Data referensi ThinkPad
data/portfolio.json            Ilustrasi kategori solusi
data/testimonials.json         Struktur testimoni dengan persetujuan
sitemap.xml                    Sitemap situs
robots.txt                     Petunjuk crawler
tests/site.test.js              Pemeriksaan konten dan kontrak data
```

CSS memakai token native, bukan Tailwind. Pilihan ini mempertahankan penyajian
statis yang sudah digunakan situs dan menghindari langkah build baru. Bootstrap
Icons yang sudah tersedia di project digunakan untuk ikon. Tidak ada framework
UI atau animasi eksternal yang wajib dimuat.

## Menjalankan lokal

Buka `index.html` lewat local web server (misalnya Apache/Laragon atau VS Code
Live Server). Katalog dan portfolio dimuat dengan `fetch`, jadi pembukaan
halaman memakai skema `file://` tidak didukung.

Semua CTA WhatsApp saat ini menggunakan nomor publik yang telah tercantum di
situs sebelumnya. Ubah nomor pada `js/kenzocomp.js` (`whatsappNumber`) dan pada
tautan WhatsApp di HTML secara konsisten bila nomor resmi berbeda.

## Memperbarui konten

- **Produk:** edit `data/products.json`. Field `category` menerima `ringan`,
  `performa`, atau `hemat`. `price` bersifat opsional; rentang harga hanya
  memfilter unit yang benar-benar memiliki `price` numerik. Ketersediaan,
  kondisi, garansi, harga, dan spesifikasi harus dikonfirmasi per unit.
- **Portfolio:** edit `data/portfolio.json`. Visual dan deskripsi yang saat ini
  disediakan adalah ilustrasi jenis solusi, bukan klaim pekerjaan klien.
- **Testimoni:** edit `data/testimonials.json`; hanya entri dengan
  `"approved": true` dan `"isSample": false` ditampilkan. Ganti contoh dan
  dapatkan izin pelanggan sebelum menerbitkan kutipan atau identitas.
- **Informasi bisnis:** verifikasi kontak, jam operasional, area layanan, rating,
  dan klaim lainnya sebelum publikasi. Form kontak membuka WhatsApp dan tidak
  mengirim atau menyimpan data ke server.

## Verifikasi

Jalankan pemeriksaan konten/data menggunakan Node.js 18 atau lebih baru:

```powershell
node --test
node --check js\kenzocomp.js
git diff --check
```

Pemeriksaan responsif manual disarankan pada lebar 320, 768, 1024, dan 1440 px.
