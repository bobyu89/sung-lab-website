/* ==========================================================================
   Sung Lab Website — Site Data
   護理創新及專科訓練研究室 (Nursing Innovation & NP Training Lab)
   ========================================================================== */

const SITE = {
  nameZh: "護理創新及專科護理師訓練研究室",
  nameEn: "Nursing Innovation & NP Training Lab",
  tagline: "結合專師照護、實證研究、教育創新與科技應用",
  taglineEn: "Integrating NP practice, evidence-based research, educational innovation, and technology",
  pi: "宋建美 助理教授",
  piEn: "Chien-Mei Sung, PhD, Assistant Professor",
  dept: "國防醫學大學護理學院",
  deptEn: "School of Nursing, National Defense Medical University",
  email: "sungchienmei@gmail.com",
  phone: "02-87923100 分機 18765",
  stats: { publications: 26, projects: 15, areas: 4, members: 3 } // members=null → 顯示「招募中」
};

/* ==========================================================================
   CONFIG — Google Sheets (gviz) + Google Drive source settings
   Empty strings mean "not configured" → fetchers resolve to FALLBACK_* data.
   ========================================================================== */
const CONFIG = {
  SHEET_ID: "" /* 最新消息改在 LabSite 編輯器管理；原試算表 1ni8NrLj3q0ItcYfs_35N4qBN-Qu-xO-37n4IJFeebRc */, // 網站最新消息（含英文欄）（建美老師研究室管理區）
  DRIVE_FOLDER_ID: "1cgZTh2naeiNb9TbhxjfKLm0H-GOrEY3Z",     // 活動照片資料夾（尚缺 API 金鑰，未啟用）
  DRIVE_API_KEY: ""
};

/* ==========================================================================
   FALLBACK data — shown whenever CONFIG is empty or a fetch/parse fails.
   Content is verbatim from the lab's real announcements/publications.
   ========================================================================== */
const FALLBACK_NEWS = [
  { date: "2026-08-11", category: "公告", content: "研究生李妍鋅論文計畫口試將於 8 月 11 日（二）11:00–13:00 舉行。", content_en: "Graduate student Yen-Hsin Lee's thesis proposal defense: Tuesday, Aug 11, 11:00-13:00.", link: "" },
  { date: "2026-08-07", category: "公告", content: "研究生游明勳論文計畫口試將於 8 月 7 日（五）11:00–13:00 舉行。", content_en: "Graduate student Ming-Hsun Yu's thesis proposal defense: Friday, Aug 7, 11:00-13:00.", link: "" },
  { date: "2026-07-06", category: "榮譽", content: "115 年度教育部教學實踐研究計畫「運用自適應學習與多重鷹架式策略之精準臨床推理教學模式融入『專科護理師角色與發展』課程之成效探討」獲核定補助", content_en: "The 2026 MOE Teaching Practice Research grant on a precision clinical-reasoning teaching model using adaptive learning and multi-layered scaffolding has been approved.", link: "" },
  { date: "2026-01-15", category: "發表", content: "社區健康照護護理師臨床與成本效益之統合分析刊登於 International Journal of Nursing Studies", content_en: "Meta-analysis of the clinical effectiveness and cost-effectiveness of primary community health care nurses published in the International Journal of Nursing Studies.", link: "" },
  { date: "2025-06-01", category: "發表", content: "3D 列印植入式中心靜脈導管模型培訓研究成果發表", content_en: "Research findings on the 3D-printed implantable central venous catheter training model presented.", link: "" },
  { date: "2024-10-01", category: "發表", content: "〈專科護理師組織氣候、領導風格與工作滿意度關係之初探〉刊登於《護理雜誌》", content_en: "Study on NP organizational climate, leadership style, and job satisfaction published in The Journal of Nursing (in Chinese).", link: "" },
  { date: "2024-08-01", category: "活動", content: "「教育性桌遊對臨床醫護人員同理心與情緒智力成效」計畫啟動", content_en: "Project launched: effects of an educational board game on clinicians' empathy and emotional intelligence.", link: "" },
  { date: "2023-08-01", category: "公告", content: "3D 列印教具培訓課程研究計畫執行中，歡迎臨床夥伴交流", content_en: "3D-printed teaching-aid training research is ongoing; clinical partners are welcome to collaborate.", link: "" }
];

/* 本地照片清單 — 把照片放進 assets/gallery/ 後在此登記即可顯示於活動花絮頁；
   caption 會成為照片說明與燈箱文字。設定 Drive API 後以雲端照片優先。
   範例：{ src: "assets/gallery/2026-06-15 EAFONS 研討會合影.jpg", caption: "2026-06-15 EAFONS 研討會合影" } */
const LOCAL_PHOTOS = [
  { src: "assets/gallery/55b862b0-bbe7-42c4-aa51-61245f1a9b8d-68b9ed.webp", caption: "114.08.21-29 宋建美老師前往巴塞隆納參加AMEE" },
  { src: "assets/gallery/739c7f7c-5521-4082-8e56-07c01e12bbd2-a03bfd.webp", caption: "114.08.21-29 宋建美老師 AMEE海報發表" },
  { src: "assets/gallery/b340674b-a3fa-41a2-81ea-0ec9362b0da5-ca8336.webp", caption: "115.07.15-22 護理學院師生一同前往多倫多參加 Sigma 37th INRC " },
  { src: "assets/gallery/dae6c478-59e6-45c2-9c95-52973ee1bfd9-dddbb5.webp", caption: "115.07.15-22 宋建美老師前往多倫多參加 Sigma 37th INRC" },
  { src: "assets/gallery/3accb5ee-fcbf-4e75-a540-796cb2b5edf0-ebe7e4.webp", caption: "115.07.15-22 宋建美老師 Sigma 37th INRC 口頭報告 " },
  { src: "assets/gallery/dc1f9f4a-53cc-4c39-8481-d11d735cb94c-36b7f5.webp", caption: "115.08.07 碩士生游明勳通過 Proposal 口試" },
  { src: "assets/gallery/1562f7ac-aecf-464f-ada6-cf0a674e5ed5-079b15.webp", caption: "115.08.11 碩士生李妍鋅通過 proposal 口試" },
  { src: "assets/gallery/d9b00bd4-83b9-4c70-a28c-22d7acb821bd-893872.webp", caption: "115.08.13 研究室聚餐" },
  { src: "assets/gallery/df7ede2f-70f4-4664-a4b6-c48ee6e7cc35-071edd.webp", caption: "115.08.20-28 宋建美老師前往維也納參加AMEE" },
  { src: "assets/gallery/d87fb436-942e-4277-90a8-4b32fa95cef2-a2c013.webp", caption: "115.08.20-28 宋建美老師 AMEE 海報發表" },
  { src: "assets/gallery/9e5b666f-c1a8-4150-ae02-b9b585303740-3eb5ae.webp", caption: "115.10.01 大學部導生聚" },
  { src: "assets/gallery/3b8ab703-c60f-4cc1-9e79-8fee88817f3c-09fd11.webp", caption: "115.10.06 研究室讀書會" }
];

const FALLBACK_PHOTOS = [
  { src: "assets/placeholder-1.svg", thumb: "assets/placeholder-1.svg", caption: "活動照片佔位 1" },
  { src: "assets/placeholder-2.svg", thumb: "assets/placeholder-2.svg", caption: "活動照片佔位 2" },
  { src: "assets/placeholder-3.svg", thumb: "assets/placeholder-3.svg", caption: "活動照片佔位 3" },
  { src: "assets/placeholder-4.svg", thumb: "assets/placeholder-4.svg", caption: "活動照片佔位 4" },
  { src: "assets/placeholder-5.svg", thumb: "assets/placeholder-5.svg", caption: "活動照片佔位 5" },
  { src: "assets/placeholder-6.svg", thumb: "assets/placeholder-6.svg", caption: "活動照片佔位 6" },
  { src: "assets/placeholder-7.svg", thumb: "assets/placeholder-7.svg", caption: "活動照片佔位 7" },
  { src: "assets/placeholder-8.svg", thumb: "assets/placeholder-8.svg", caption: "活動照片佔位 8" }
];

/* ==========================================================================
   Parsing helpers (private) — gviz response stripping + column mapping
   ========================================================================== */
(function () {
  "use strict";

  /* Strip the google.visualization.Query.setResponse(...); wrapper and JSON.parse. */
  function parseGvizResponse(text) {
    const start = text.indexOf("(");
    const end = text.lastIndexOf(")");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Unexpected gviz response format");
    }
    const jsonText = text.slice(start + 1, end);
    return JSON.parse(jsonText);
  }

  /* Build { headerLabel: colIndex } map from gviz table.cols. */
  function buildColumnIndex(table) {
    const index = {};
    (table.cols || []).forEach(function (col, i) {
      const label = (col.label || "").trim();
      if (label) index[label] = i;
    });
    return index;
  }

  /* Read a cell's value by header label from a gviz row; "" if missing/empty.
     Prefers the formatted display string (cell.f) so date-typed cells return
     their human-readable text (e.g. "2026-07-06") instead of the raw
     Date(2026,6,6) constructor value gviz puts in cell.v. */
  function cellValue(row, colIndex, label) {
    const i = colIndex[label];
    if (i === undefined) return "";
    const cell = row.c[i];
    if (!cell || cell.v === null || cell.v === undefined) return "";
    if (typeof cell.f === "string" && cell.f !== "") return cell.f;
    return cell.v;
  }

  /* Fetches the spreadsheet's FIRST sheet (no sheet-name dependency) and
     forces row 1 to be treated as column headers (headers=1), so the tab
     can be named anything as long as its columns match the expected labels. */
  async function fetchGvizSheet() {
    const url = "https://docs.google.com/spreadsheets/d/" + CONFIG.SHEET_ID +
      "/gviz/tq?tqx=out:json&headers=1";
    const res = await fetch(url);
    if (!res.ok) throw new Error("gviz fetch failed: " + res.status);
    const text = await res.text();
    const data = parseGvizResponse(text);
    const table = data.table;
    const colIndex = buildColumnIndex(table);
    return (table.rows || []).map(function (row) {
      return { row: row, colIndex: colIndex };
    });
  }

  function sortByDateDesc(items) {
    return items.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });
  }

  /* ------------------------------------------------------------------------
     fetchNews — reads "news" sheet, columns: date/category/content/link
     ------------------------------------------------------------------------ */
  /* 首頁最新消息只顯示一年內（含未來日期的預告）；若一年內沒有任何
     消息，退回顯示全部以免版面空白。 */
  function filterRecentNews(items) {
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    const recent = items.filter(function (n) {
      const d = new Date(n.date);
      return !isNaN(d) && d >= cutoff;
    });
    return recent.length ? recent : items;
  }

  window.fetchNews = async function fetchNews() {
    try {
      if (!CONFIG.SHEET_ID) return filterRecentNews(FALLBACK_NEWS);
      const rows = await fetchGvizSheet();
      if (!rows.length) return filterRecentNews(FALLBACK_NEWS);
      const news = rows.map(function (entry) {
        return {
          date: cellValue(entry.row, entry.colIndex, "date"),
          category: cellValue(entry.row, entry.colIndex, "category"),
          content: cellValue(entry.row, entry.colIndex, "content"),
          content_en: cellValue(entry.row, entry.colIndex, "content_en"),
          link: cellValue(entry.row, entry.colIndex, "link")
        };
      });
      return filterRecentNews(sortByDateDesc(news));
    } catch (err) {
      return filterRecentNews(FALLBACK_NEWS);
    }
  };

  /* ------------------------------------------------------------------------
     fetchPhotos — lists images from a Google Drive folder; limit=0 → all
     ------------------------------------------------------------------------ */
  /* 未設定 Drive 時的本地來源：LOCAL_PHOTOS 有內容就用它，否則用佔位圖 */
  /* 英文頁在 en/ 底下：照片路徑寫的是從網站根目錄算起，要先回到上一層 */
  var PHOTO_ROOT = /\/en\//.test(location.pathname) || /^en/i.test(document.documentElement.lang || "") ? "../" : "";
  function rooted(src) {
    return /^(https?:|\/|data:|\.\.\/)/.test(src) ? src : PHOTO_ROOT + src;
  }
  function localPhotos() {
    var list = LOCAL_PHOTOS.length ? LOCAL_PHOTOS : FALLBACK_PHOTOS;
    return list.map(function (p) {
      return { src: rooted(p.src), thumb: rooted(p.thumb || p.src), caption: p.caption || "" };
    });
  }

  window.fetchPhotos = async function fetchPhotos(limit) {
    try {
      if (!CONFIG.DRIVE_FOLDER_ID || !CONFIG.DRIVE_API_KEY) return applyLimit(localPhotos(), limit);
      const query = "'" + CONFIG.DRIVE_FOLDER_ID + "' in parents and mimeType contains 'image/'";
      const url = "https://www.googleapis.com/drive/v3/files?q=" + encodeURIComponent(query) +
        "&key=" + encodeURIComponent(CONFIG.DRIVE_API_KEY) +
        "&fields=" + encodeURIComponent("files(id,name)");
      const res = await fetch(url);
      if (!res.ok) throw new Error("drive fetch failed: " + res.status);
      const data = await res.json();
      const files = data.files || [];
      if (!files.length) return applyLimit(localPhotos(), limit);
      const photos = files.map(function (file) {
        const thumb = "https://drive.google.com/thumbnail?id=" + file.id + "&sz=w800";
        const caption = file.name.replace(/\.[^/.]+$/, "");
        return { src: thumb, thumb: thumb, caption: caption };
      });
      return applyLimit(photos, limit);
    } catch (err) {
      return applyLimit(localPhotos(), limit);
    }
  };

  /* 檔名開頭含 YYYY-MM-DD 時依活動日期新到舊排序；無日期者排最後 */
  function sortPhotosByCaptionDate(photos) {
    function dateOf(p) {
      const m = String(p.caption || "").match(/(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})/);
      return m ? new Date(+m[1], +m[2] - 1, +m[3]).getTime() : null;
    }
    return photos.slice().sort(function (a, b) {
      const da = dateOf(a);
      const db = dateOf(b);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return db - da;
    });
  }

  function applyLimit(photos, limit) {
    const sorted = sortPhotosByCaptionDate(photos);
    if (!limit) return sorted;
    return sorted.slice(0, limit);
  }
})();
