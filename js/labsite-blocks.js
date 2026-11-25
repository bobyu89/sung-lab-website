/* LabSite 相簿與動畫 v2：由 LabSite 編輯器產生，更新時會被覆寫。
   把 <div class="ls-album" data-album="…" data-layout="grid|carousel|masonry">
   填上 data/albums.json 裡那本相簿的照片；點照片可放大瀏覽。 */
(function () {
  "use strict";
  var cache = {};
  function load(base) {
    if (window.__lsAlbums) return Promise.resolve(window.__lsAlbums);
    if (!cache[base])
      cache[base] = fetch(base + "data/albums.json", { cache: "no-cache" })
        .then(function (r) { return r.ok ? r.json() : null; })
        .catch(function () { return null; });
    return cache[base];
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }
  function item(photo, base, i, open) {
    var li = el("li");
    var fig = el("figure");
    var btn = el("button", "ls-album-open");
    btn.type = "button";
    btn.setAttribute("aria-label", (photo.caption || "照片") + "（放大）");
    var img = el("img");
    img.src = base + photo.src;
    img.alt = photo.caption || "";
    img.loading = "lazy";
    btn.appendChild(img);
    btn.addEventListener("click", function () { open(i, btn); });
    fig.appendChild(btn);
    if (photo.caption) fig.appendChild(el("figcaption", "", photo.caption));
    li.appendChild(fig);
    return li;
  }
  function lightbox(photos, base, start, back) {
    var i = start;
    var box = el("div", "ls-lightbox");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "照片");
    var img = el("img");
    var cap = el("p");
    var close = el("button", "close", "×");
    close.type = "button";
    close.setAttribute("aria-label", "關閉");
    var prev = el("button", "prev", "‹");
    prev.type = "button";
    prev.setAttribute("aria-label", "上一張");
    var next = el("button", "next", "›");
    next.type = "button";
    next.setAttribute("aria-label", "下一張");
    var fig = el("div");
    fig.appendChild(img);
    fig.appendChild(cap);
    box.appendChild(fig);
    box.appendChild(close);
    if (photos.length > 1) {
      box.appendChild(prev);
      box.appendChild(next);
    }
    function show() {
      var p = photos[i];
      img.src = base + p.src;
      img.alt = p.caption || "";
      cap.textContent = (p.caption ? p.caption + "　" : "") + (i + 1) + " / " + photos.length;
    }
    function go(d) {
      i = (i + d + photos.length) % photos.length;
      show();
    }
    function done() {
      document.removeEventListener("keydown", key);
      box.parentNode && box.parentNode.removeChild(box);
      document.body.style.overflow = "";
      if (back) back.focus();
    }
    function key(e) {
      if (e.key === "Escape") done();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    }
    close.addEventListener("click", done);
    prev.addEventListener("click", function () { go(-1); });
    next.addEventListener("click", function () { go(1); });
    box.addEventListener("click", function (e) { if (e.target === box) done(); });
    document.addEventListener("keydown", key);
    show();
    document.body.appendChild(box);
    document.body.style.overflow = "hidden";
    close.focus();
  }
  function render(node, data) {
    var base = node.getAttribute("data-base") || "";
    var id = node.getAttribute("data-album");
    var layout = node.getAttribute("data-layout") || "grid";
    var album = null;
    var list = (data && data.albums) || [];
    for (var k = 0; k < list.length; k++) if (list[k].id === id) album = list[k];
    node.innerHTML = "";
    if (!album || !album.photos || !album.photos.length) {
      node.appendChild(el("p", "ls-album-empty", album ? "這本相簿還沒有照片。" : ""));
      return;
    }
    var photos = album.photos;
    var open = function (i, btn) { lightbox(photos, base, i, btn); };
    if (layout === "carousel") {
      var wrap = el("div", "ls-album-carousel");
      var track = el("ul", "ls-album-track");
      for (var c = 0; c < photos.length; c++) track.appendChild(item(photos[c], base, c, open));
      wrap.appendChild(track);
      if (photos.length > 1) {
        var step = function (d) { track.scrollBy({ left: d * track.clientWidth * 0.8, behavior: "smooth" }); };
        var p = el("button", "ls-album-nav prev", "‹");
        p.type = "button";
        p.setAttribute("aria-label", "往前");
        p.addEventListener("click", function () { step(-1); });
        var n = el("button", "ls-album-nav next", "›");
        n.type = "button";
        n.setAttribute("aria-label", "往後");
        n.addEventListener("click", function () { step(1); });
        wrap.appendChild(p);
        wrap.appendChild(n);
      }
      node.appendChild(wrap);
      return;
    }
    var ul = el("ul", layout === "masonry" ? "ls-album-masonry" : "ls-album-grid");
    for (var g = 0; g < photos.length; g++) ul.appendChild(item(photos[g], base, g, open));
    node.appendChild(ul);
  }
  function start() {
    var nodes = document.querySelectorAll(".ls-album[data-album]");
    for (var i = 0; i < nodes.length; i++)
      (function (node) {
        load(node.getAttribute("data-base") || "").then(function (data) { render(node, data); });
      })(nodes[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  /* 數字從 0 跳到寫好的數字（保留前後文字，例如 30+、2,400） */
  function countUp(el) {
    var text = el.textContent;
    var m = text.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
    if (!m || reduce) return;
    var target = parseFloat(m[2].replace(/,/g, ""));
    var decimals = (m[2].split(".")[1] || "").length;
    var comma = m[2].indexOf(",") >= 0;
    var start = null;
    function fmt(v) {
      var s = v.toFixed(decimals);
      return comma ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : s;
    }
    function step(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / 1400);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = m[1] + fmt(target * eased) + m[3];
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = text;
    }
    requestAnimationFrame(step);
  }

  /* 進度條：讀「75%」這類文字，畫出長度 */
  function fillProgress(section) {
    var items = section.querySelectorAll(".ls-progress li");
    for (var i = 0; i < items.length; i++) {
      var v = items[i].querySelector(".ls-progress-value");
      var n = v ? parseFloat(v.textContent) : 0;
      items[i].style.setProperty("--ls-value", Math.max(0, Math.min(100, isNaN(n) ? 0 : n)) + "%");
    }
  }

  function arrive(el) {
    el.classList.add("ls-in");
    var counts = el.querySelectorAll(".ls-stat strong");
    for (var i = 0; i < counts.length; i++) countUp(counts[i]);
    if (el.querySelector(".ls-progress")) fillProgress(el);
  }

  /* 依序出現：每個子項目延遲一點 */
  function stagger(el) {
    var lists = el.querySelectorAll(".ls-stagger");
    for (var i = 0; i < lists.length; i++)
      for (var j = 0; j < lists[i].children.length; j++) lists[i].children[j].style.transitionDelay = j * 0.08 + "s";
  }

  function startAnimations() {
    var els = document.querySelectorAll("[data-ls-anim], .ls-stats-section, .ls-progress-section, .ls-timeline-section");
    if (!els.length) return;
    if (reduce || !("IntersectionObserver" in window)) {
      for (var i = 0; i < els.length; i++) arrive(els[i]);
      return;
    }
    root.classList.add("ls-anim-on");
    // threshold 0 + bottom margin: tall blocks still appear on phones.
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            arrive(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    for (var k = 0; k < els.length; k++) {
      if (els[k].getAttribute("data-ls-anim") === "stagger") stagger(els[k]);
      io.observe(els[k]);
    }
  }

  /* 分頁標籤：由每個 .ls-tab-title 產生按鈕 */
  function startTabs() {
    var groups = document.querySelectorAll(".ls-tabs");
    for (var g = 0; g < groups.length; g++)
      (function (box, n) {
        var tabs = box.querySelectorAll(".ls-tab");
        if (!tabs.length || box.querySelector(".ls-tab-buttons")) return;
        var bar = document.createElement("div");
        bar.className = "ls-tab-buttons";
        bar.setAttribute("role", "tablist");
        var buttons = [];
        function select(i, focus) {
          for (var t = 0; t < tabs.length; t++) {
            tabs[t].hidden = t !== i;
            buttons[t].setAttribute("aria-selected", t === i ? "true" : "false");
            buttons[t].tabIndex = t === i ? 0 : -1;
          }
          if (focus) buttons[i].focus();
        }
        for (var t = 0; t < tabs.length; t++)
          (function (i) {
            var title = tabs[i].querySelector(".ls-tab-title");
            var b = document.createElement("button");
            b.type = "button";
            b.setAttribute("role", "tab");
            b.id = "ls-tab-" + n + "-" + i;
            b.textContent = title ? title.textContent : "分頁 " + (i + 1);
            tabs[i].setAttribute("role", "tabpanel");
            tabs[i].setAttribute("aria-labelledby", b.id);
            b.addEventListener("click", function () { select(i, false); });
            b.addEventListener("keydown", function (e) {
              if (e.key === "ArrowRight") select((i + 1) % tabs.length, true);
              if (e.key === "ArrowLeft") select((i - 1 + tabs.length) % tabs.length, true);
            });
            buttons.push(b);
            bar.appendChild(b);
          })(t);
        box.insertBefore(bar, box.firstChild);
        box.classList.add("ls-tabs-ready");
        select(0, false);
      })(groups[g], g);
  }

  /* 跑馬燈：複製一份內容，接得起來地循環 */
  function startMarquees() {
    if (reduce) return;
    var boxes = document.querySelectorAll(".ls-marquee");
    for (var i = 0; i < boxes.length; i++) {
      var track = boxes[i].querySelector(".ls-marquee-track");
      if (!track || track.getAttribute("data-ls-cloned")) continue;
      var items = track.children.length;
      for (var j = 0; j < items; j++) {
        var copy = track.children[j].cloneNode(true);
        copy.setAttribute("aria-hidden", "true");
        track.appendChild(copy);
      }
      track.setAttribute("data-ls-cloned", "1");
      track.style.setProperty("--ls-marquee-time", Math.max(16, items * 4) + "s");
      boxes[i].classList.add("ls-marquee-on");
    }
  }

  function start() {
    startTabs();
    startMarquees();
    startAnimations();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
