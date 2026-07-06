/* ==========================================================================
   Sung Lab Website — Shared Components
   護理創新及專科訓練研究室 (Nursing Innovation & NP Training Lab)
   LOGO_SVG, initLayout(activePage), openLightbox(src, caption)
   ========================================================================== */

/* --------------------------------------------------------------------------
   Logo — four-petal medical cross with a centered heart
   Gradient: #FF79BC -> #FFA042
   -------------------------------------------------------------------------- */
const LOGO_SVG = `
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="護理創新及專科訓練研究室 Logo">
  <defs>
    <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF79BC"/>
      <stop offset="100%" stop-color="#FFA042"/>
    </linearGradient>
  </defs>
  <g fill="url(#logo-grad)">
    <rect x="24" y="4" width="16" height="24" rx="8"/>
    <rect x="24" y="36" width="16" height="24" rx="8"/>
    <rect x="4" y="24" width="24" height="16" rx="8"/>
    <rect x="36" y="24" width="24" height="16" rx="8"/>
    <rect x="24" y="24" width="16" height="16" rx="6"/>
  </g>
  <path d="M32 41.2c-4.6-3.9-9.6-7.8-9.6-12.6 0-3.1 2.5-5.6 5.6-5.6 1.8 0 3.5.9 4 2.3.5-1.4 2.2-2.3 4-2.3 3.1 0 5.6 2.5 5.6 5.6 0 4.8-5 8.7-9.6 12.6z"
    fill="#FFFFFF"/>
</svg>`.trim();

/* --------------------------------------------------------------------------
   Nav items — order is significant
   -------------------------------------------------------------------------- */
const NAV_ITEMS = [
  { key: "index", label: "首頁", href: "index.html" },
  { key: "research", label: "研究主題", href: "research.html" },
  { key: "publications", label: "成果發表", href: "publications.html" },
  { key: "education", label: "教學資源", href: "education.html" },
  { key: "members", label: "團隊成員", href: "members.html" },
  { key: "collaboration", label: "合作交流", href: "collaboration.html" },
  { key: "gallery", label: "活動花絮", href: "gallery.html" },
  { key: "resources", label: "開放資源", href: "resources.html" },
  { key: "contact", label: "聯絡我們", href: "index.html#contact" }
];

/* --------------------------------------------------------------------------
   Templates
   -------------------------------------------------------------------------- */
function renderHeader(activePage) {
  const navLinks = NAV_ITEMS.map((item) => {
    const isActive = item.key === activePage;
    return `<li><a class="nav-link${isActive ? " active" : ""}" href="${item.href}"${isActive ? ' aria-current="page"' : ""}>${item.label}</a></li>`;
  }).join("");

  return `
<header class="site-header">
  <div class="container site-header__inner">
    <a class="site-header__brand" href="index.html">
      <span class="site-header__logo">${LOGO_SVG}</span>
      <span class="site-header__brandtext">
        <span class="site-header__name">${SITE.nameZh}</span>
        <span class="site-header__name-en mono-en">${SITE.nameEn}</span>
      </span>
    </a>
    <button type="button" class="hamburger" id="hamburger-btn" aria-expanded="false" aria-label="開啟導覽選單" aria-controls="site-nav">
      <span class="hamburger__line"></span>
      <span class="hamburger__line"></span>
      <span class="hamburger__line"></span>
    </button>
    <nav class="site-nav" id="site-nav">
      <ul class="site-nav__list">
        ${navLinks}
      </ul>
      <a class="btn btn-primary btn-cta" href="index.html#contact">加入我們</a>
    </nav>
  </div>
</header>`;
}

function renderFooter() {
  const quickLinks = NAV_ITEMS.slice(0, 8)
    .map((item) => `<li><a href="${item.href}">${item.label}</a></li>`)
    .join("");

  return `
<footer class="site-footer section--pink">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      <span class="site-footer__logo">${LOGO_SVG}</span>
      <p class="site-footer__name">${SITE.nameZh}</p>
      <p class="site-footer__tagline">${SITE.tagline}</p>
    </div>
    <div class="site-footer__contact">
      <h3>聯絡資訊</h3>
      <p>${SITE.pi}</p>
      <p>${SITE.dept}</p>
      <p>${SITE.phone}</p>
      <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
    </div>
    <div class="site-footer__links">
      <h3>快速連結</h3>
      <ul>
        ${quickLinks}
      </ul>
    </div>
    <div class="site-footer__links">
      <h3>友好連結</h3>
      <ul>
        <li><a href="https://bobyu89.github.io/ycho-lab-website/" target="_blank" rel="noopener">智慧醫療轉譯及創新實驗室<span class="friend-sub">賀彥中 助理教授</span></a></li>
      </ul>
    </div>
  </div>
  <div class="container">
    <p class="site-footer__copyright">© 2026 ${SITE.nameZh}</p>
  </div>
</footer>`;
}

function renderLightbox() {
  return `
<div class="lightbox" id="lightbox" hidden>
  <div class="lightbox__backdrop" data-lightbox-close></div>
  <figure class="lightbox__content">
    <img class="lightbox__img" id="lightbox-img" src="" alt="">
    <figcaption class="lightbox__caption" id="lightbox-caption"></figcaption>
  </figure>
  <button type="button" class="lightbox__close" aria-label="關閉燈箱" data-lightbox-close>&times;</button>
</div>`;
}

/* --------------------------------------------------------------------------
   initLayout — injects header, footer, and lightbox DOM; wires interactions
   -------------------------------------------------------------------------- */
function initLayout(activePage) {
  document.body.insertAdjacentHTML("afterbegin", renderHeader(activePage));
  document.body.insertAdjacentHTML("beforeend", renderFooter());
  document.body.insertAdjacentHTML("beforeend", renderLightbox());

  const hamburger = document.getElementById("hamburger-btn");
  const nav = document.getElementById("site-nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("site-nav--open", !expanded);
      hamburger.setAttribute("aria-label", expanded ? "開啟導覽選單" : "關閉導覽選單");
    });

    nav.querySelectorAll(".nav-link, .btn-cta").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "開啟導覽選單");
        nav.classList.remove("site-nav--open");
      });
    });
  }

  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hasAttribute("hidden")) {
        closeLightbox();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Lightbox — open/close
   -------------------------------------------------------------------------- */
function openLightbox(src, caption) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const captionEl = document.getElementById("lightbox-caption");
  if (!lightbox || !img || !captionEl) return;

  img.src = src;
  img.alt = caption || "";
  captionEl.textContent = caption || "";
  lightbox.removeAttribute("hidden");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  if (!lightbox) return;

  lightbox.setAttribute("hidden", "");
  document.body.classList.remove("lightbox-open");
  if (img) img.src = "";
}
