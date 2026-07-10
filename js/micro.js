/* ==========================================================================
   Micro-interactions — anime.js v4 漸進增強
   兩站共用同一份檔案（sung-lab-website / ycho-lab-website）：
   描線顏色自動從 CSS 變數讀取（--ecg、--cyan 或 --pink），不需要改任何參數。

   包含：
   1. ECG 分隔線描線動畫（scroll 觸發，svg.createDrawable）
   2. 首頁 Hero 標題逐字浮現 + chips 彈入
   3. 章節標題圖示彈跳（scroll 觸發）
   4. 燈箱開啟縮放淡入
   5. 導覽列進場（每個瀏覽階段一次）

   anime.js 未載入或使用者偏好減少動態時，全部靜默跳過，網站照常運作。
   ========================================================================== */
(function () {
  "use strict";

  if (!window.anime || typeof anime.animate !== "function") return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var animate = anime.animate;
  var stagger = anime.stagger;

  /* ECG 描線顏色：優先讀 --ecg（ycho 定義為臨床綠），否則退回品牌色變數 */
  var rootStyle = getComputedStyle(document.documentElement);
  var brand = (rootStyle.getPropertyValue("--ecg") || rootStyle.getPropertyValue("--cyan") || rootStyle.getPropertyValue("--pink") || "#888").trim();

  /* ------------------------------------------------------------------------
     1. ECG 分隔線描線 — 把靜態背景圖換成內嵌 SVG，進入視窗時畫出心電圖
     ------------------------------------------------------------------------ */
  function initEcgDraw() {
    if (!anime.svg || !anime.svg.createDrawable) return;

    document.querySelectorAll(".ecg-divider").forEach(function (div) {
      var width = div.clientWidth || 1200;
      var beat = 300; /* 與原背景圖同寬的一個心跳週期 */
      var cycles = Math.max(1, Math.round(width / beat));
      var points = [];
      for (var c = 0; c < cycles; c++) {
        var x = c * beat;
        points.push(
          x + ",20", (x + 60) + ",20", (x + 75) + ",5",
          (x + 90) + ",35", (x + 105) + ",20", (x + beat) + ",20"
        );
      }

      var ns = "http://www.w3.org/2000/svg";
      var svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", "0 0 " + (cycles * beat) + " 40");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("aria-hidden", "true");
      svg.style.cssText = "display:block;width:100%;height:100%";

      var line = document.createElementNS(ns, "polyline");
      line.setAttribute("points", points.join(" "));
      line.setAttribute("fill", "none");
      line.setAttribute("stroke", brand);
      line.setAttribute("stroke-width", "3");
      line.setAttribute("stroke-linecap", "round");
      line.setAttribute("stroke-linejoin", "round");
      svg.appendChild(line);

      div.style.backgroundImage = "none";
      div.appendChild(svg);

      var drawableResult = anime.svg.createDrawable(line);
      var drawable = Array.isArray(drawableResult) ? drawableResult[0] : drawableResult;

      /* 先隱藏筆畫，等進入視窗再畫 */
      if (anime.utils && anime.utils.set) {
        anime.utils.set(drawable, { draw: "0 0" });
      } else {
        animate(drawable, { draw: "0 0", duration: 0 });
      }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          animate(drawable, {
            draw: ["0 0", "0 1"],
            duration: 1500,
            ease: "inOutSine"
          });
        });
      }, { threshold: 0.5 });
      io.observe(div);
    });
  }

  /* ------------------------------------------------------------------------
     2. Hero 標題逐字浮現 + chips 彈入（只有首頁有 .hero__title）
     ------------------------------------------------------------------------ */
  /* 中文逐字、英文逐詞（避免英文單字被 inline-block 拆行） */
  var SPLIT_BY_WORD = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;

  function splitChars(el) {
    var spans = [];
    function wrap(frag, text) {
      var s = document.createElement("span");
      s.textContent = text;
      s.style.display = "inline-block";
      frag.appendChild(s);
      spans.push(s);
    }
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === Node.TEXT_NODE) {
          var frag = document.createDocumentFragment();
          var tokens = SPLIT_BY_WORD
            ? child.textContent.split(/(\s+)/)
            : Array.from(child.textContent);
          tokens.forEach(function (token) {
            if (token === "") return;
            if (token.trim() === "") {
              frag.appendChild(document.createTextNode(token));
              return;
            }
            wrap(frag, token);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      });
    }
    walk(el);
    return spans;
  }

  function initHeroIntro() {
    var title = document.querySelector(".hero__title");
    if (!title) return;

    var chars = splitChars(title);
    if (chars.length) {
      animate(chars, {
        opacity: [0, 1],
        y: ["0.45em", "0em"],
        duration: 650,
        delay: stagger(26),
        ease: "out(3)"
      });
    }

    var chips = document.querySelectorAll(".hero__chips .chip");
    if (chips.length) {
      animate(chips, {
        opacity: [0, 1],
        scale: [0.6, 1],
        duration: 500,
        delay: stagger(70, { start: chars.length * 26 + 200 }),
        ease: "outBack"
      });
    }
  }

  /* ------------------------------------------------------------------------
     3. 章節標題圖示彈跳 — 每個 section 標題旁的 logo 進入視窗時彈入
     ------------------------------------------------------------------------ */
  function initIconPop() {
    var icons = document.querySelectorAll(".section-header__icon");
    if (!icons.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        animate(entry.target, {
          opacity: [0, 1],
          scale: [0.4, 1],
          rotate: [-90, 0],
          duration: 800,
          ease: "outBack"
        });
      });
    }, { threshold: 0.6 });

    icons.forEach(function (icon) {
      icon.style.opacity = "0";
      io.observe(icon);
    });
  }

  /* ------------------------------------------------------------------------
     4. 燈箱開啟縮放淡入 — 包裝 components.js 的 openLightbox
     ------------------------------------------------------------------------ */
  function initLightboxPop() {
    var original = window.openLightbox;
    if (typeof original !== "function") return;
    window.openLightbox = function (src, caption) {
      original(src, caption);
      var content = document.querySelector(".lightbox__content");
      if (content) {
        animate(content, {
          opacity: [0, 1],
          scale: [0.92, 1],
          duration: 320,
          ease: "out(3)"
        });
      }
    };
  }

  /* ------------------------------------------------------------------------
     5. 導覽列進場 — 連結依序落下、CTA 彈入；每個瀏覽階段只播一次，
        換頁時不重複播放以免干擾
     ------------------------------------------------------------------------ */
  function initNavIntro() {
    var links = document.querySelectorAll(".site-nav__list .nav-link");
    if (!links.length) return;
    if (window.matchMedia("(max-width: 899px)").matches) return; /* 行動版收在漢堡選單 */
    try {
      if (sessionStorage.getItem("nav-intro-played")) return;
      sessionStorage.setItem("nav-intro-played", "1");
    } catch (e) {
      return; /* 無痕模式下 sessionStorage 不可用時直接略過 */
    }
    animate(links, {
      opacity: [0, 1],
      y: [-10, 0],
      duration: 450,
      delay: stagger(40),
      ease: "out(3)"
    });
    var cta = document.querySelector(".btn-cta");
    if (cta) {
      animate(cta, {
        opacity: [0, 1],
        scale: [0.7, 1],
        duration: 500,
        delay: links.length * 40 + 120,
        ease: "outBack"
      });
    }
  }

  function boot() {
    initEcgDraw();
    initHeroIntro();
    initIconPop();
    initLightboxPop();
    initNavIntro();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
