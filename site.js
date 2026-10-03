/* ============================================================
   site.js — Kos Griya Cempaka
   Memuat content.json (dengan fallback), me-render seluruh
   halaman, memasang interaksi, dan menyuntik JSON-LD.
   ============================================================ */
import {
  waLink,
  loadContent,
  initFaq,
  initMobileNav,
  initCopyButtons,
  setYear,
  esc,
} from "./shared/utils.js";
import { navbarHTML } from "./shared/components/navbar.js";
import { footerHTML } from "./shared/components/footer.js";
import { sectionHeadHTML } from "./shared/components/section-head.js";

/* ---------- Fallback bila content.json gagal dimuat ---------- */
const FALLBACK = {
  brand: {
    mark: "GC",
    name: "Kos Griya Cempaka",
    tagline: "Kos nyaman dekat kampus untuk mahasiswa dan pekerja muda.",
  },
  nav: {
    links: [
      { href: "#unit", label: "Unit" },
      { href: "#galeri", label: "Galeri" },
      { href: "#fasilitas", label: "Fasilitas" },
      { href: "#lokasi", label: "Lokasi" },
      { href: "#faq", label: "FAQ" },
    ],
    cta: { label: "Hubungi Pemilik" },
  },
  hero: {
    eyebrow: "Kos eksklusif · Karangmalang, Yogyakarta",
    title: "Tinggal nyaman dekat kampus, harga jelas tanpa biaya tersembunyi.",
    desc: "Kos Griya Cempaka punya 12 kamar bersih dengan Wi-Fi kencang, dapur bersama, dan parkir berpagar. Survei dulu, cocok baru bayar.",
    ctaPrimary: { href: "#unit", label: "Lihat Unit" },
    ctaSecondary: { label: "Chat WhatsApp" },
    stats: [
      { value: "12", label: "Kamar" },
      { value: "50 Mbps", label: "Wi-Fi" },
      { value: "Rp 550 rb", label: "Harga mulai / bulan" },
    ],
  },
  units: {
    index: "01",
    eyebrow: "PILIH KAMARMU",
    title: "Unit kamar",
    desc: "Empat tipe kamar sesuai bujet. Harga sudah termasuk air dan iuran kebersihan. Listrik token per kamar ditanggung penghuni.",
    list: [
      {
        id: "ekonomi",
        name: "Kamar Ekonomi",
        price: 550000,
        status: "penuh",
        facilities: [
          "Kasur single + bantal",
          "Lemari pakaian kecil",
          "Kipas angin",
          "Kamar mandi luar (sharing)",
        ],
      },
      {
        id: "standar",
        name: "Kamar Standar",
        price: 750000,
        status: "tersedia",
        facilities: [
          "Kasur single + bantal",
          "Lemari pakaian",
          "Meja & kursi belajar",
          "Kipas angin",
          "Kamar mandi luar (sharing)",
        ],
      },
      {
        id: "plus",
        name: "Kamar Plus AC",
        price: 1100000,
        status: "tersedia",
        facilities: [
          "AC ½ PK",
          "Kasur single + bantal",
          "Lemari pakaian",
          "Meja & kursi belajar",
          "Kamar mandi dalam",
        ],
      },
      {
        id: "deluxe",
        name: "Kamar Deluxe",
        price: 1450000,
        status: "tersedia",
        facilities: [
          "AC ½ PK",
          "Spring bed + bantal & guling",
          "Lemari besar 2 pintu",
          "Meja belajar + rak buku",
          "TV 32 inci",
          "Kamar mandi dalam + water heater",
        ],
      },
    ],
  },
  gallery: {
    index: "02",
    eyebrow: "INTIP SUASANA",
    title: "Galeri",
    desc: "Ilustrasi suasana kos. Foto asli menyusul — survei langsung tetap yang paling meyakinkan.",
    items: [
      { icon: "bed", title: "Kamar tidur", desc: "Kasur nyaman, meja belajar, dan pencahayaan hangat." },
      { icon: "building", title: "Gedung kos", desc: "Bangunan 2 lantai dengan 12 kamar dan area parkir berpagar." },
      { icon: "kitchen", title: "Dapur bersama", desc: "Kompor, kulkas, dan dispenser untuk dipakai bersama." },
      { icon: "wifi", title: "Area Wi-Fi", desc: "Sinyal kencang sampai lantai 2, cocok untuk kuliah daring." },
    ],
  },
  facilities: {
    index: "03",
    eyebrow: "FASILITAS UMUM",
    title: "Semua penghuni bisa pakai",
    desc: "Fasilitas bersama terawat dan dibersihkan rutin setiap hari.",
    list: [
      { icon: "wifi", title: "Wi-Fi 50 Mbps", desc: "Internet cepat di semua kamar dan area bersama." },
      { icon: "kitchen", title: "Dapur bersama", desc: "Kompor gas, kulkas, dan dispenser. Buka 05.00–21.00." },
      { icon: "parking", title: "Parkir motor", desc: "Area parkir berpagar dan beratap, gratis untuk penghuni." },
      { icon: "cctv", title: "CCTV 24 jam", desc: "Kamera pengawas di area parkir dan pintu masuk." },
      { icon: "laundry", title: "Area cuci & jemur", desc: "Mesin cuci koin dan jemuran di lantai atas." },
      { icon: "sofa", title: "Ruang tamu", desc: "Sofa dan TV untuk menerima tamu atau santai bareng." },
    ],
  },
  location: {
    index: "04",
    eyebrow: "LOKASI & AKSES",
    title: "Dekat ke mana-mana",
    desc: "Lokasi strategis di Karangmalang. TODO: ganti alamat dan estimasi waktu dengan data asli.",
    address: "Jl. Cempaka No. 27, Karangmalang, Depok, Sleman, Yogyakarta",
    access: [
      "3 menit jalan kaki ke kampus (TODO: tulis nama kampus asli)",
      "5 menit ke minimarket, ATM, dan warung makan",
      "10 menit ke Stasiun Lempuyangan",
      "15 menit ke kawasan Malioboro",
      "20 menit ke Bandara Adisutjipto (TODO: sesuaikan bila pindah bandara)",
    ],
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Jl.+Cempaka+Karangmalang+Depok+Sleman+Yogyakarta",
    mapLabel: "Buka di Google Maps",
  },
  terms: {
    index: "05",
    eyebrow: "SYARAT SEWA",
    title: "Aturan main yang jelas",
    desc: "Baca dulu sebelum booking supaya tidak ada salah paham.",
    list: [
      "Bawa fotokopi KTP atau kartu pelajar saat survei dan akad sewa.",
      "Pembayaran di muka, minimal masa sewa 3 bulan.",
      "Uang muka 50% menahan kamar maksimal 7 hari.",
      "Tamu yang menginap wajib lapor ke pengelola.",
      "Dilarang membawa hewan peliharaan ke area kos.",
      "Gerbang dikunci pukul 22.00 WIB; pulang lewat jam itu hubungi pengelola.",
      "Dilarang merokok di dalam kamar; area merokok tersedia di teras belakang.",
    ],
  },
  faq: {
    index: "06",
    eyebrow: "TANYA JAWAB",
    title: "Pertanyaan yang sering masuk",
    desc: "",
    list: [
      {
        q: "Apakah listrik dan air sudah termasuk harga sewa?",
        a: "Air PDAM dan iuran kebersihan sudah termasuk. Listrik memakai token per kamar dan ditanggung penghuni, rata-rata Rp 50–100 ribu per bulan tergantung pemakaian.",
      },
      {
        q: "Boleh bawa kendaraan?",
        a: "Boleh. Parkir motor gratis di area berpagar dan beratap. Untuk mobil, belum tersedia lahan parkir di dalam kos.",
      },
      {
        q: "Boleh masak di kamar?",
        a: "Tidak boleh memasak di kamar karena alasan keamanan. Silakan pakai dapur bersama yang buka pukul 05.00–21.00.",
      },
      {
        q: "Bagaimana cara booking kamar?",
        a: "Chat WhatsApp pemilik, jadwalkan survei, lalu bayar uang muka 50% untuk menahan kamar maksimal 7 hari. Pelunasan dilakukan saat akad sewa.",
      },
      {
        q: "Apakah boleh membawa tamu menginap?",
        a: "Boleh, maksimal 2 malam per bulan dan wajib lapor ke pengelola. Tamu lawan jenis tidak diperkenankan menginap.",
      },
    ],
  },
  contact: {
    index: "07",
    eyebrow: "KONTAK PEMILIK",
    title: "Tanya atau jadwalkan survei",
    desc: "Chat WhatsApp untuk respons tercepat. Survei bisa pagi sampai sore setiap hari.",
    owner: "Budi Santoso",
    ownerNote: "TODO: ganti nama pemilik asli",
    phone: "6281234567890",
    phoneDisplay: "+62 812-3456-7890",
    phoneNote: "TODO: ganti nomor WA asli",
    hours: "Setiap hari, 08.00–20.00 WIB",
    address: "Jl. Cempaka No. 27, Karangmalang, Depok, Sleman, Yogyakarta",
    ctaLabel: "Chat WhatsApp Sekarang",
    defaultMessage:
      "Halo, saya tertarik dengan Kos Griya Cempaka. Boleh tanya-tanya dulu?",
  },
  footer: {
    note: "TODO: ganti seluruh data dummy (nama, alamat, nomor WA) dengan data asli sebelum dipublikasikan.",
    socials: [
      { href: "https://instagram.com/", label: "Instagram" },
      { href: "https://tiktok.com/", label: "TikTok" },
    ],
  },
};

/* ---------- Ikon SVG inline (tanpa gambar/foto orang) ---------- */
const S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const ICONS = {
  wifi: `<svg ${S}><path d="M5 12.5a10 10 0 0 1 14 0"/><path d="M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/></svg>`,
  kitchen: `<svg ${S}><path d="M4 11h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-6z"/><path d="M2.5 11h19"/><path d="M9.5 8c0-1.6 1.2-1.8 1.2-3.4M14.5 8c0-1.6 1.2-1.8 1.2-3.4"/></svg>`,
  parking: `<svg ${S}><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M10 16.5v-9h3.5a2.6 2.6 0 0 1 0 5.2H10"/></svg>`,
  cctv: `<svg ${S}><path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z"/><circle cx="12" cy="11" r="2.4"/><path d="M12 8.6V7.2"/></svg>`,
  laundry: `<svg ${S}><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M4 9.5h16"/><circle cx="12" cy="14.5" r="4.2"/><circle cx="7.2" cy="6.2" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  sofa: `<svg ${S}><path d="M6 11V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3"/><path d="M4 12.5A1.8 1.8 0 0 1 7.6 12.5V14h8.8v-1.5a1.8 1.8 0 0 1 3.6 0V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3.5z"/><path d="M6 18v2.5M18 18v2.5"/></svg>`,
  bed: `<svg ${S}><path d="M3 18.5V9"/><path d="M3 13.5h18v5"/><path d="M3 15.5h18"/><circle cx="6.6" cy="10.4" r="1.6"/><path d="M21 13.5v-2a3 3 0 0 0-3-3h-6.5v5"/></svg>`,
  building: `<svg ${S}><rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h1.6M13.4 7H15M9 11h1.6M13.4 11H15M9 15h1.6M13.4 15H15"/><path d="M10.2 21v-2.6h3.6V21"/></svg>`,
};

/* Ilustrasi gedung kos untuk hero (SVG inline, dekoratif). */
function heroIllustration() {
  return `
  <svg viewBox="0 0 520 400" role="img" aria-label="Ilustrasi gedung kos dua lantai berwarna hijau dan krem dengan pepohonan">
    <circle cx="448" cy="72" r="34" fill="#c98f2d" opacity="0.9"/>
    <ellipse cx="260" cy="352" rx="225" ry="30" fill="#0e6b57" opacity="0.14"/>
    <rect x="70" y="252" width="14" height="86" rx="4" fill="#8a6a45"/>
    <circle cx="77" cy="228" r="40" fill="#0e6b57" opacity="0.8"/>
    <circle cx="52" cy="252" r="26" fill="#0e6b57" opacity="0.65"/>
    <rect x="436" y="272" width="12" height="66" rx="4" fill="#8a6a45"/>
    <circle cx="442" cy="250" r="32" fill="#0e6b57" opacity="0.8"/>
    <path d="M104 150 L260 66 L416 150 Z" fill="#0e6b57"/>
    <rect x="126" y="150" width="268" height="192" rx="6" fill="#ffffff" stroke="#16302b" stroke-width="4"/>
    <rect x="186" y="112" width="148" height="32" rx="16" fill="#c98f2d"/>
    <text x="260" y="134" text-anchor="middle" font-family="Sora, sans-serif" font-size="17" font-weight="800" fill="#ffffff" letter-spacing="2">GRIYA CEMPAKA</text>
    <g fill="#dcede6" stroke="#16302b" stroke-width="3">
      <rect x="150" y="176" width="52" height="52" rx="4"/>
      <rect x="234" y="176" width="52" height="52" rx="4"/>
      <rect x="318" y="176" width="52" height="52" rx="4"/>
      <rect x="150" y="252" width="52" height="52" rx="4"/>
      <rect x="318" y="252" width="52" height="52" rx="4"/>
    </g>
    <rect x="238" y="262" width="44" height="80" rx="6" fill="#16302b"/>
    <circle cx="274" cy="304" r="4" fill="#c98f2d"/>
    <rect x="234" y="150" width="52" height="12" rx="6" fill="#16302b" opacity="0.15"/>
  </svg>`;
}

/* ---------- Pembantu ---------- */
function rupiah(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

function statusLabel(status) {
  return status === "tersedia" ? "Tersedia" : "Penuh";
}

/* Kartu satu unit kamar. */
function unitCard(unit, phone, brandName) {
  const available = unit.status === "tersedia";
  const harga = `${rupiah(unit.price)}`;
  const pesan = available
    ? `Halo, saya tertarik dengan ${unit.name} (${harga}/bulan) di ${brandName}. Apakah masih tersedia? Boleh info cara surveinya?`
    : `Halo, saya tertarik dengan ${unit.name} (${harga}/bulan) di ${brandName}, tapi statusnya penuh. Apakah ada daftar tunggu?`;
  const facilities = (unit.facilities || [])
    .map((f) => `<li>${esc(f)}</li>`)
    .join("");
  return `
  <article class="unit-card${available ? "" : " is-penuh"}">
    <div class="unit-top">
      <h3 class="unit-name">${esc(unit.name)}</h3>
      <span class="badge ${available ? "badge-tersedia" : "badge-penuh"}">${esc(statusLabel(unit.status))}</span>
    </div>
    <p class="unit-price">${esc(harga)}<small> /bulan</small></p>
    <ul class="unit-facilities">${facilities}</ul>
    <a class="btn btn-primary" href="${waLink(phone, pesan)}" target="_blank" rel="noopener noreferrer">
      Tanya Unit Ini
    </a>
  </article>`;
}

/* ---------- Render tiap seksi ---------- */
function renderHero(hero, phone, defaultMessage) {
  const stats = (hero.stats || [])
    .map(
      (s) =>
        `<li><span class="stat-value">${esc(s.value)}</span><span class="stat-label">${esc(s.label)}</span></li>`
    )
    .join("");
  return `
  <section class="hero" id="beranda" aria-label="Beranda">
    <div class="wrap hero-grid">
      <div>
        <p class="hero-eyebrow">${esc(hero.eyebrow)}</p>
        <h1 class="hero-title">${esc(hero.title)}</h1>
        <p class="hero-desc">${esc(hero.desc)}</p>
        <div class="hero-cta">
          <a class="btn btn-primary" href="${esc(hero.ctaPrimary.href)}">${esc(hero.ctaPrimary.label)}</a>
          <a class="btn btn-outline" href="${waLink(phone, defaultMessage || "")}" target="_blank" rel="noopener noreferrer">${esc(hero.ctaSecondary.label)}</a>
        </div>
        <ul class="hero-stats">${stats}</ul>
      </div>
      <div class="hero-visual">${heroIllustration()}</div>
    </div>
  </section>`;
}

function renderUnits(units, phone, brandName) {
  const cards = (units.list || [])
    .map((u) => unitCard(u, phone, brandName))
    .join("");
  return `
  <section class="section" id="unit" aria-label="Daftar unit kamar">
    <div class="wrap">
      ${sectionHeadHTML({ index: units.index, eyebrow: units.eyebrow, title: units.title, desc: units.desc })}
      <div class="unit-grid">${cards}</div>
    </div>
  </section>`;
}

function renderGallery(gallery) {
  const items = (gallery.items || [])
    .map(
      (g, i) => `
      <figure class="gallery-item">
        <div class="gallery-visual gv-${(i % 4) + 1}" role="img" aria-label="${esc(g.title)} — ${esc(g.desc)}">
          ${ICONS[g.icon] || ""}
        </div>
        <figcaption><strong>${esc(g.title)}</strong><span>${esc(g.desc)}</span></figcaption>
      </figure>`
    )
    .join("");
  return `
  <section class="section" id="galeri" aria-label="Galeri">
    <div class="wrap">
      ${sectionHeadHTML({ index: gallery.index, eyebrow: gallery.eyebrow, title: gallery.title, desc: gallery.desc })}
      <div class="gallery-grid">${items}</div>
    </div>
  </section>`;
}

function renderFacilities(facilities) {
  const cards = (facilities.list || [])
    .map(
      (f) => `
      <div class="facility-card">
        <span class="facility-icon">${ICONS[f.icon] || ""}</span>
        <h3>${esc(f.title)}</h3>
        <p>${esc(f.desc)}</p>
      </div>`
    )
    .join("");
  return `
  <section class="section" id="fasilitas" aria-label="Fasilitas umum">
    <div class="wrap">
      ${sectionHeadHTML({ index: facilities.index, eyebrow: facilities.eyebrow, title: facilities.title, desc: facilities.desc })}
      <div class="facility-grid">${cards}</div>
    </div>
  </section>`;
}

function renderLocation(location) {
  const access = (location.access || [])
    .map((a) => `<li>${esc(a)}</li>`)
    .join("");
  return `
  <section class="section" id="lokasi" aria-label="Lokasi dan akses">
    <div class="wrap">
      ${sectionHeadHTML({ index: location.index, eyebrow: location.eyebrow, title: location.title, desc: location.desc })}
      <div class="location-grid">
        <div class="location-card">
          <address class="location-address">${esc(location.address)}</address>
          <ul class="access-list">${access}</ul>
          <a class="btn btn-outline" href="${esc(location.mapUrl)}" target="_blank" rel="noopener noreferrer">${esc(location.mapLabel)}</a>
        </div>
        <div class="location-card">
          <h3>Jadwal survei</h3>
          <p>Datang langsung atau chat WhatsApp dulu supaya ada yang menemani. Bawa fotokopi KTP atau kartu pelajar bila ingin langsung booking.</p>
        </div>
      </div>
    </div>
  </section>`;
}

function renderTerms(terms) {
  const list = (terms.list || []).map((t) => `<li>${esc(t)}</li>`).join("");
  return `
  <section class="section" id="syarat" aria-label="Syarat sewa">
    <div class="wrap">
      ${sectionHeadHTML({ index: terms.index, eyebrow: terms.eyebrow, title: terms.title, desc: terms.desc })}
      <ol class="terms-list">${list}</ol>
    </div>
  </section>`;
}

function renderFaq(faq) {
  const items = (faq.list || [])
    .map(
      (f) => `
      <div class="faq-item" data-faq-item>
        <button class="faq-q" data-faq-q type="button">
          <span>${esc(f.q)}</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-a" data-faq-a><p>${esc(f.a)}</p></div>
      </div>`
    )
    .join("");
  return `
  <section class="section" id="faq" aria-label="Pertanyaan yang sering ditanyakan">
    <div class="wrap">
      ${sectionHeadHTML({ index: faq.index, eyebrow: faq.eyebrow, title: faq.title, desc: faq.desc })}
      <div class="faq-list" data-faq>${items}</div>
    </div>
  </section>`;
}

function renderContact(contact, brandName) {
  const wa = waLink(contact.phone, contact.defaultMessage);
  return `
  <section class="section" id="kontak" aria-label="Kontak pemilik">
    <div class="wrap">
      <div class="contact-card">
        <div>
          <p class="section-index" style="color:#a9b3ab">${esc(contact.index)} / ${esc(contact.eyebrow)}</p>
          <h2>${esc(contact.title)}</h2>
          <p class="contact-desc">${esc(contact.desc)}</p>
          <div class="contact-rows">
            <div class="contact-row">
              <span class="lbl">Pemilik (${esc(contact.ownerNote)})</span>
              <span class="val">${esc(contact.owner)}</span>
            </div>
            <div class="contact-row">
              <span class="lbl">WhatsApp (${esc(contact.phoneNote)})</span>
              <span class="val">${esc(contact.phoneDisplay)}</span>
              <button class="btn-copy" type="button" data-copy="${esc(contact.phone)}" aria-label="Salin nomor WhatsApp pemilik">Salin nomor</button>
            </div>
            <div class="contact-row">
              <span class="lbl">Jam respons</span>
              <span class="val">${esc(contact.hours)}</span>
            </div>
            <div class="contact-row">
              <span class="lbl">Alamat</span>
              <span class="val">${esc(contact.address)}</span>
            </div>
          </div>
        </div>
        <div>
          <a class="btn btn-wa-big" href="${wa}" target="_blank" rel="noopener noreferrer">${esc(contact.ctaLabel)}</a>
          <p class="contact-note">Membuka WhatsApp dengan pesan terisi otomatis.</p>
        </div>
      </div>
    </div>
  </section>`;
}

/* ---------- JSON-LD RealEstateAgent ---------- */
function injectJsonLd(data) {
  const brand = data.brand || {};
  const contact = data.contact || {};
  const prices = ((data.units || {}).list || [])
    .map((u) => Number(u.price) || 0)
    .filter(Boolean);
  const digits = String(contact.phone || "").replace(/\D/g, "");
  const ld = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: brand.name,
    description: brand.tagline,
    telephone: digits ? `+${digits}` : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address,
      addressLocality: "Sleman",
      addressRegion: "Yogyakarta",
      addressCountry: "ID",
    },
    openingHours: "Mo-Su 08:00-20:00",
  };
  if (prices.length) {
    ld.priceRange = `Rp ${Math.min(...prices).toLocaleString("id-ID")} - Rp ${Math.max(...prices).toLocaleString("id-ID")}`;
  }
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}

/* ---------- Jalankan ---------- */
async function main() {
  const notice = document.getElementById("content-notice");
  const data = await loadContent("content.json", FALLBACK, notice);
  const brand = data.brand || {};
  const phone = (data.contact || {}).phone || "";

  document.getElementById("nav-root").innerHTML = navbarHTML({
    brand: { name: brand.name, mark: brand.mark, tagline: brand.tagline },
    links: (data.nav || {}).links || [],
    cta: { href: waLink(phone, (data.contact || {}).defaultMessage || ""), label: ((data.nav || {}).cta || {}).label || "Hubungi Pemilik" },
  });

  const konten = document.getElementById("konten");
  konten.innerHTML =
    renderHero(data.hero || {}, phone, (data.contact || {}).defaultMessage) +
    renderUnits(data.units || {}, phone, brand.name) +
    renderGallery(data.gallery || {}) +
    renderFacilities(data.facilities || {}) +
    renderLocation(data.location || {}) +
    renderTerms(data.terms || {}) +
    renderFaq(data.faq || {}) +
    renderContact(data.contact || {}, brand.name);

  document.getElementById("footer-root").innerHTML = footerHTML({
    brand: { name: brand.name, tagline: brand.tagline },
    contact: {
      address: (data.location || {}).address || "",
      hours: (data.contact || {}).hours || "",
      phone: (data.contact || {}).phoneDisplay || "",
    },
    socials: ((data.footer || {}).socials || []),
    note: ((data.footer || {}).note || ""),
  });

  initMobileNav();
  initFaq();
  initCopyButtons();
  setYear();
  injectJsonLd(data);
}

main();
