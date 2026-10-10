"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

test("beranda memuat lima mockup yang dapat dipilih dengan kontrol aksesibel", () => {
  const homepage = read("index.html");

  assert.equal((homepage.match(/class="showcase-slide"/g) || []).length, 5);
  assert.equal((homepage.match(/role="tab" aria-controls=/g) || []).length, 5);
  assert.equal((homepage.match(/data-slide-dot="/g) || []).length, 5);
  assert.match(homepage, /data-slider-viewport/);
  assert.match(homepage, /aria-live="polite"/);
});

test("katalog menyediakan enam model dengan filter dan data stok yang konservatif", () => {
  const products = readJson("data/products.json");
  const catalogPage = read("layanan/thinkpad/index.html");

  assert.equal(products.length, 6);
  assert.ok(products.every((product) => ["ringan", "performa", "hemat"].includes(product.category)));
  assert.ok(products.every((product) => !("price" in product)));
  assert.match(catalogPage, /data-model-filter/);
  assert.match(catalogPage, /data-condition-filter/);
  assert.match(catalogPage, /data-price-filter/);
});

test("portfolio memiliki enam contoh lintas web, mobile, dan ERP serta disclaimer", () => {
  const projects = readJson("data/portfolio.json");
  const portfolioPage = read("portfolio/index.html");

  assert.equal(projects.length, 6);
  assert.deepEqual(new Set(projects.map((project) => project.category)), new Set(["Web", "Mobile", "ERP"]));
  assert.match(portfolioPage, /bukan studi kasus atau klaim hasil/);
});

test("contoh testimoni tidak ditampilkan tanpa persetujuan eksplisit", () => {
  const testimonials = readJson("data/testimonials.json");
  const script = read("js/kenzocomp.js");

  assert.equal(testimonials.length, 5);
  assert.ok(testimonials.every((entry) => entry.approved === false && entry.isSample === true));
  assert.match(script, /entry\.approved === true && entry\.isSample !== true/);
});

test("seluruh halaman sekunder memiliki metadata dan jalur aset lokal", () => {
  const pages = [
    "layanan/konsultasi/index.html",
    "layanan/thinkpad/index.html",
    "layanan/service/index.html",
    "portfolio/index.html",
    "tentang/index.html",
    "kontak/index.html"
  ];

  pages.forEach((page) => {
    const html = read(page);
    assert.match(html, /<title>[^<]+<\/title>/, page + " harus memiliki judul");
    assert.match(html, /name="description"/, page + " harus memiliki deskripsi SEO");
    assert.match(html, /property="og:title"/, page + " harus memiliki judul Open Graph");
    assert.match(html, /<main id="main">/, page + " harus memiliki main landmark");
    assert.match(html, /css\/kenzocomp-modern\.css/, page + " harus menggunakan stylesheet situs");
  });
});
