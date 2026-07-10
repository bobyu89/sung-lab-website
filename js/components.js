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
  { key: "index", label: "首頁", labelEn: "Home", href: "index.html" },
  { key: "pi", label: "主持人", labelEn: "PI", href: "pi.html" },
  { key: "research-group", label: "研究", labelEn: "Research", children: [
    { key: "research", label: "研究主題", labelEn: "Research Focus", href: "research.html" },
    { key: "projects", label: "研究計畫", labelEn: "Projects", href: "projects.html" }
  ] },
  { key: "output-group", label: "研究成果", labelEn: "Output", children: [
    { key: "awards", label: "得獎紀錄", labelEn: "Awards", href: "awards.html" },
    { key: "publications", label: "成果發表", labelEn: "Publications", href: "publications.html" },
    { key: "conferences", label: "研討會論文", labelEn: "Conference Papers", href: "conferences.html" }
  ] },
  { key: "members", label: "團隊成員", labelEn: "Members", href: "members.html" },
  { key: "resources-group", label: "資源", labelEn: "Resources", children: [
    { key: "education", label: "教學資源", labelEn: "Teaching", href: "education.html" },
    { key: "collaboration", label: "合作交流", labelEn: "Collaboration", href: "collaboration.html" },
    { key: "resources", label: "開放資源", labelEn: "Open Resources", href: "resources.html" }
  ] },
  { key: "gallery", label: "活動花絮", labelEn: "Gallery", href: "gallery.html" },
  { key: "contact", label: "聯絡我們", labelEn: "Contact", href: "index.html#contact" }
];

/* UI strings (zh / en). EN pages live under en/ and call initLayout(page, "en"). */
const UI_STRINGS = {
  zh: {
    cta: "加入我們",
    langLabel: "EN",
    langTitle: "Switch to English",
    contactHeading: "聯絡資訊",
    quickLinks: "快速連結",
    friendLinks: "友好連結",
    friendName: "智慧醫療轉譯及創新實驗室",
    friendSub: "賀彥中 助理教授",
    friendHref: "https://bobyu89.github.io/ycho-lab-website/",
    navAria: "開啟導覽選單",
    back: "返回"
  },
  en: {
    cta: "Join Us",
    langLabel: "中文",
    langTitle: "切換為中文",
    contactHeading: "Contact",
    quickLinks: "Quick Links",
    friendLinks: "Partner Labs",
    friendName: "Smart Health Translation & Innovation Lab",
    friendSub: "Dr. Yen-Chung Ho",
    friendHref: "https://bobyu89.github.io/ycho-lab-website/en/",
    navAria: "Open navigation menu",
    back: "Back"
  }
};

let SITE_LANG = "zh";

/* --------------------------------------------------------------------------
   Templates
   -------------------------------------------------------------------------- */
function renderHeader(activePage) {
  const t = UI_STRINGS[SITE_LANG];
  const navLinks = NAV_ITEMS.map((item) => {
    const label = SITE_LANG === "en" ? item.labelEn : item.label;
    if (item.children) {
      const childActive = item.children.some((c) => c.key === activePage);
      const childLinks = item.children.map((c) => {
        const cLabel = SITE_LANG === "en" ? c.labelEn : c.label;
        const isActive = c.key === activePage;
        return `<li><a class="nav-dropdown__link${isActive ? " active" : ""}" href="${c.href}"${isActive ? ' aria-current="page"' : ""}>${cLabel}</a></li>`;
      }).join("");
      return `<li class="nav-item nav-item--dropdown">` +
        `<button type="button" class="nav-link nav-link--parent${childActive ? " active" : ""}" aria-haspopup="true" aria-expanded="false">${label}<span class="nav-caret" aria-hidden="true">▾</span></button>` +
        `<div class="nav-dropdown"><ul class="nav-dropdown__card">${childLinks}</ul></div></li>`;
    }
    const isActive = item.key === activePage;
    return `<li class="nav-item"><a class="nav-link${isActive ? " active" : ""}" href="${item.href}"${isActive ? ' aria-current="page"' : ""}>${label}</a></li>`;
  }).join("");

  /* language switch: zh page -> en/<same>.html ; en page -> ../<same>.html */
  const pageFile = (activePage === "contact" ? "index" : activePage) + ".html";
  const langHref = SITE_LANG === "en" ? "../" + pageFile : "en/" + pageFile;
  const brandName = SITE_LANG === "en" ? SITE.nameEn : SITE.nameZh;
  const brandSub = SITE_LANG === "en" ? SITE.nameZh : SITE.nameEn;

  return `
<header class="site-header">
  <div class="container site-header__inner">
    <a class="site-header__brand" href="index.html">
      <span class="site-header__logo">${LOGO_SVG}</span>
      <span class="site-header__brandtext">
        <span class="site-header__name">${brandName}</span>
        <span class="site-header__name-en mono-en">${brandSub}</span>
      </span>
    </a>
    <button type="button" class="hamburger" id="hamburger-btn" aria-expanded="false" aria-label="${t.navAria}" aria-controls="site-nav">
      <span class="hamburger__line"></span>
      <span class="hamburger__line"></span>
      <span class="hamburger__line"></span>
    </button>
    <nav class="site-nav" id="site-nav">
      <button type="button" class="drawer-close" id="drawer-close" aria-label="${t.navAria}">&times;</button>
      <ul class="site-nav__list">
        ${navLinks}
      </ul>
      <a class="lang-switch" href="${langHref}" title="${t.langTitle}" lang="${SITE_LANG === "en" ? "zh-Hant" : "en"}">${t.langLabel}</a>
      <a class="btn btn-primary btn-cta" href="index.html#contact">${t.cta}</a>
    </nav>
  </div>
  <div class="nav-backdrop" id="nav-backdrop" aria-hidden="true"></div>
</header>`;
}

function renderFooter() {
  const t = UI_STRINGS[SITE_LANG];
  const flatNav = [];
  NAV_ITEMS.forEach((item) => {
    if (item.children) flatNav.push(...item.children);
    else if (item.key !== "contact") flatNav.push(item);
  });
  const quickLinks = flatNav
    .map((item) => `<li><a href="${item.href}">${SITE_LANG === "en" ? item.labelEn : item.label}</a></li>`)
    .join("");
  const footName = SITE_LANG === "en" ? SITE.nameEn : SITE.nameZh;
  const footTagline = SITE_LANG === "en" ? SITE.taglineEn : SITE.tagline;
  const footPi = SITE_LANG === "en" ? SITE.piEn : SITE.pi;
  const footDept = SITE_LANG === "en" ? SITE.deptEn : SITE.dept;

  return `
<footer class="site-footer section--pink">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      <span class="site-footer__logo">${LOGO_SVG}</span>
      <p class="site-footer__name">${footName}</p>
      <p class="site-footer__tagline">${footTagline}</p>
    </div>
    <div class="site-footer__contact">
      <h3>${t.contactHeading}</h3>
      <p>${footPi}</p>
      <p>${footDept}</p>
      <p>${SITE.phone}</p>
      <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
    </div>
    <div class="site-footer__links">
      <h3>${t.quickLinks}</h3>
      <ul>
        ${quickLinks}
      </ul>
    </div>
    <div class="site-footer__links">
      <h3>${t.friendLinks}</h3>
      <ul>
        <li><a href="${t.friendHref}" target="_blank" rel="noopener">${t.friendName}<span class="friend-sub">${t.friendSub}</span></a></li>
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
function initLayout(activePage, lang) {
  SITE_LANG = lang === "en" ? "en" : "zh";
  document.body.insertAdjacentHTML("afterbegin", renderHeader(activePage));
  document.body.insertAdjacentHTML("beforeend", renderFooter());
  document.body.insertAdjacentHTML("beforeend", renderLightbox());

  /* 返回鍵 — 首頁以外的每一頁都注入，置於頁面 hero 內左上角、與內容切齊；
     回上一頁（無歷史則回首頁） */
  if (activePage !== "index" && activePage !== "contact") {
    const t = UI_STRINGS[SITE_LANG];
    const btn =
      `<button type="button" class="back-link" id="page-back">` +
      `<span class="back-link__arrow" aria-hidden="true">←</span>${t.back}</button>`;
    const heroInner = document.querySelector(".page-hero__inner");
    if (heroInner) {
      heroInner.insertAdjacentHTML("afterbegin", `<div class="page-back">${btn}</div>`);
    } else {
      const header = document.querySelector(".site-header");
      if (header) header.insertAdjacentHTML("afterend", `<div class="page-back page-back--bar"><div class="container">${btn}</div></div>`);
    }
    const backBtn = document.getElementById("page-back");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (window.history.length > 1) window.history.back();
        else window.location.href = "index.html";
      });
    }
  }

  const hamburger = document.getElementById("hamburger-btn");
  const nav = document.getElementById("site-nav");
  const backdrop = document.getElementById("nav-backdrop");
  const drawerClose = document.getElementById("drawer-close");

  if (hamburger && nav) {
    const setOpen = (open) => {
      hamburger.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("site-nav--open", open);
      if (backdrop) backdrop.classList.toggle("nav-backdrop--show", open);
      document.body.classList.toggle("nav-open", open);
    };

    hamburger.addEventListener("click", () => {
      setOpen(hamburger.getAttribute("aria-expanded") !== "true");
    });
    if (backdrop) backdrop.addEventListener("click", () => setOpen(false));
    if (drawerClose) drawerClose.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("site-nav--open")) setOpen(false);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
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
   News ticker - homepage slim marquee under the header; renders only when
   #news-ticker exists. Content duplicated x2 for the CSS translateX(-50%)
   seamless loop; hover pauses via CSS.
   -------------------------------------------------------------------------- */
function renderNewsTicker(items) {
  const ticker = document.getElementById("news-ticker");
  if (!ticker || !items || !items.length) return;
  const esc = (str) => String(str || "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const top = items.slice(0, 5);
  const seg = top.map((n) => {
    const text = (SITE_LANG === "en" && n.content_en) ? n.content_en : n.content;
    return `<span class="news-ticker__item"><span class="news-ticker__date mono-en">${esc(n.date)}</span>${esc(text)}</span>`;
  }).join("");
  ticker.innerHTML = `<a class="news-ticker__link" href="#news" aria-label="${SITE_LANG === "en" ? "Latest news" : "最新消息"}">` +
    `<div class="news-ticker__track">${seg}${seg}</div></a>`;
  const track = ticker.querySelector(".news-ticker__track");
  if (track) track.style.animationDuration = Math.max(24, top.length * 9) + "s";
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
