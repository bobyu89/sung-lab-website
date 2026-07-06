# 護理創新及專科訓練研究室網站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 依 `docs/superpowers/specs/2026-07-06-sung-lab-website-design.md` 建置宋建美老師的多頁式研究室網站（品牌粉橙、8 頁、Google 試算表/雲端後台含降級）。

**Architecture:** 純靜態 HTML/CSS/JS。共用 header/footer 由 `js/components.js` 注入；站名/統計/動態資料集中在 `js/data.js`（Google 端點失敗時回退內建備用資料）；動畫集中在 `js/animations.js`。無建置工具，直接以靜態伺服器預覽。

**Tech Stack:** HTML5、CSS custom properties、原生 JS（IntersectionObserver、fetch）、Google Fonts（Noto Sans TC / Inter）、Tabler Icons（inline SVG 複製）、Firebase Hosting。

## Global Constraints

- 品牌色（精確值）：`--pink:#FF79BC`、`--orange:#FFA042`、`--peach:#FFE6D6`、`--pink-bg:#FFF2F6`、`--white:#FFFFFF`、`--gray:#6B7280`、`--ink:#374151`、`--pink-deep:#D9367F`
- **小字級文字禁用 #FF79BC 與 #FFA042**（對比不足）；文字用 `--ink`／`--gray`／`--pink-deep`
- **白字按鈕底色一律用深色變體** `--pink-deep`／`--orange-deep`（#FF79BC/#FFA042 配白字未達 WCAG AA；淺色只作 hover 光暈、描邊、裝飾）
- 所有動畫包在 `@media (prefers-reduced-motion: no-preference)` 或等效 JS 檢查內
- 文案一律取自 `docs/content/pi-sung-chien-mei.md`，**不得虛構研究內容**；論文列表中 `Sung, C. M.` 與 `宋建美` 加 `<strong>`
- 站名「護理創新及專科訓練研究室」與英文名、統計數字只寫在 `js/data.js` 的 `SITE` 常數
- 佔位區塊用 `.wip` 樣式呈現「建置中」，不留空白
- 每個 Task 結束 commit，英文 conventional commits
- 驗證一律用 Preview 工具（`.claude/launch.json` 的 `lab-site` 伺服器）＋ `preview_inspect`/`preview_snapshot`，不可只看程式碼

---

### Task 1: 設計系統與專案骨架

**Files:**
- Create: `css/main.css`、`firebase.json`、`.gitignore`、`.claude/launch.json`、`index.html`（暫時煙霧測試版）

**Interfaces:**
- Produces: CSS 變數（上方 Global Constraints 全部）＋類別 `.container`（max-width:1200px）、`.section`、`.section--pink`（淡粉底）、`.card`、`.card--peach`、`.btn`、`.btn-primary`（莓粉底白字膠囊＋箭頭）、`.btn-outline`（橘橙描邊）、`.chip`（膠囊籤）、`.mono-en`（Inter 英文小標）、`.reveal`／`.reveal.in`（進場）、`.blob`、`.dots`（點陣背景）、`.ecg-divider`（心電圖分隔線）、`.wip`（建置中佔位）、`.avatar`（縮寫圓形頭像）

- [ ] **Step 1:** 建立 `css/main.css`，開頭為：

```css
:root {
  --pink: #FF79BC;
  --pink-deep: #D9367F;
  --orange: #FFA042;
  --peach: #FFE6D6;
  --pink-bg: #FFF2F6;
  --orange-deep: #D9480F;
  --white: #FFFFFF;
  --gray: #6B7280;
  --ink: #374151;
  --radius: 20px;
  --radius-pill: 999px;
  --shadow-card: 0 10px 30px rgba(255, 121, 188, 0.14);
  --grad-brand: linear-gradient(135deg, #FF79BC, #FFA042);
  --font-sans: "Noto Sans TC", "Inter", system-ui, sans-serif;
  --font-en: "Inter", "Noto Sans TC", sans-serif;
}
```

接著 reset（`*{box-sizing:border-box}`、body 白底 `--ink` 文字）、Google Fonts 由各頁 `<link>` 載入、以及 Interfaces 列的全部類別。`.btn-primary` hover 微放大＋箭頭右移；`.reveal{opacity:0;transform:translateY(18px);transition:.6s}` `.reveal.in{opacity:1;transform:none}`；`.blob` 為大圓角漸層模糊塊、緩慢漂移 keyframes；`.ecg-divider` 用 inline SVG background 畫心電圖線。動畫全部包在 `@media (prefers-reduced-motion: no-preference)`，reduce 時 `.reveal` 直接可見。

- [ ] **Step 2:** 建立 `firebase.json`：

```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/docs/**", "**/node_modules/**", "**/tools/**"]
  }
}
```

`.gitignore`：`.firebase/`、`*.log`、`node_modules/`。`.claude/launch.json`：

```json
{
  "version": "0.0.1",
  "configurations": [
    { "name": "lab-site", "runtimeExecutable": "npx", "runtimeArgs": ["--yes", "http-server", "-p", "5173", "-c-1", "."], "port": 5173 }
  ]
}
```

- [ ] **Step 3:** 建立煙霧測試版 `index.html`：引 main.css 與 Google Fonts（`Noto+Sans+TC:wght@400;500;700;900`、`Inter:wght@500;600;800`），body 放一個 `.section--pink` 內含 `.card`（標題＋`.chip`＋`.btn-primary`）與一個 `.blob`。
- [ ] **Step 4:** 用 Preview 啟動 `lab-site`，`preview_inspect` 驗證：`.btn-primary` 的 `background-color` 為 `rgb(217, 54, 127)`（--pink-deep）、`.card` 的 `border-radius` 為 `20px`；`preview_screenshot` 確認整體粉橙氛圍。
- [ ] **Step 5:** Commit：`git add -A && git commit -m "feat: design system foundation"`

### Task 2: 共用元件（logo／導覽列／頁尾／燈箱）

**Files:**
- Create: `js/components.js`、`js/data.js`（先只放 `SITE` 常數）
- Modify: `index.html`

**Interfaces:**
- Produces（components.js，全域函式）:
  - `initLayout(activePage)`——注入 header＋footer＋燈箱 DOM；`activePage` ∈ `'index'|'research'|'publications'|'education'|'members'|'collaboration'|'resources'`，對應導覽項加 `.active`
  - `openLightbox(src, caption)`／Esc 與點背景關閉
  - `LOGO_SVG`——四瓣醫療十字＋中央愛心 inline SVG 字串，漸層 `#FF79BC→#FFA042`
- Produces（data.js）:

```js
const SITE = {
  nameZh: "護理創新及專科訓練研究室",
  nameEn: "Nursing Innovation & NP Training Lab",
  tagline: "結合專師照護、實證研究、教育創新與科技應用",
  pi: "宋建美 助理教授",
  dept: "國防醫學大學護理學院",
  email: "sungcm@mail.ndmutsgh.edu.tw",
  phone: "02-87923100 分機 18765",
  stats: { publications: 23, projects: 11, areas: 4, members: null } // members=null → 顯示「招募中」
};
```

- [ ] **Step 1:** 寫 `js/components.js`：`LOGO_SVG`（`<svg viewBox="0 0 64 64">` 四瓣十字 path＋愛心 path，`<linearGradient>` 粉→橙）；header 模板（白底、左 logo＋`SITE.nameZh`＋英文小字、中導覽 8 項、右 `.btn-primary` 橘橙變體「加入我們」連 `index.html#contact`；<900px 收合漢堡、按鈕 `aria-expanded`）；footer 模板（`.section--pink` 底：堆疊 logo＋tagline、聯絡資訊（`SITE.pi`/`SITE.dept`/`SITE.phone`/`SITE.email`）、快速連結、`© 2026 ` + nameZh）；燈箱 DOM＋`openLightbox`。
- [ ] **Step 2:** `index.html` 引入 `js/data.js`、`js/components.js` 並呼叫 `initLayout('index')`。
- [ ] **Step 3:** Preview 驗證：`preview_snapshot` 確認導覽 8 項與 footer 聯絡資訊完整；`preview_resize` mobile 後漢堡選單可開合；首頁項有 `.active`。
- [ ] **Step 4:** Commit：`feat: shared layout components and site constants`

### Task 3: 首頁 Hero＋研究核心領域＋動畫引擎

**Files:**
- Create: `js/animations.js`
- Modify: `index.html`（換掉煙霧測試內容）

**Interfaces:**
- Produces（animations.js）: `initReveal()`（IntersectionObserver 對 `.reveal` 加 `.in`，同群 `data-reveal-group` 錯開 0.1s）、`initCounters()`（`[data-count]` 由 0 滾動至目標，僅一次）、均在 `prefers-reduced-motion: reduce` 時直接套用最終態
- Hero 文案（定案）：主標 `以護理、研究與創新，打造更智慧的臨床未來`（「研究與創新」用粉、「智慧」用橙的 `<span>` 強調）；副文 = `SITE.tagline` ＋「以實證推動照護品質，提升健康福祉。」；按鈕：`探索研究`（primary→research.html）、`查看成果`（outline→publications.html）；特色籤：`實證為本`・`創新驅動`・`以人為本`
- Hero 右側：`<img class="hero-art" src="assets/hero-illustration.png" alt="護理研究插畫">`，檔案不存在時 CSS 背景顯示粉漸層佔位（`onerror` 換 class）
- 四卡文案（由內容文件提煉，實作時照抄此處）：
  1. **專科護理師發展與訓練**——探討專師執業環境、領導風格與工作滿意度，培育新世代進階護理人才。
  2. **創新教學與 3D 列印應用**——以 3D 列印教具與教育性桌遊革新臨床訓練與衛教。
  3. **認知訓練與失智照護**——發展多面向認知訓練，改善輕度認知障礙與失智長者的認知功能。
  4. **吞嚥健康與高齡復健**——以舌肌力訓練與吞嚥復健實證，守護高齡者進食安全與生活品質。

- [ ] **Step 1:** index.html 完成 Hero（淡粉底＋`.dots`＋`.blob`×2＋`.ecg-divider`）與「研究核心領域」四張 `.card`（icon 位置先用 Tabler icons 的 inline SVG：stethoscope／printer-3d 類／brain／dental 類，粉橙上色），區塊標題左側加 logo 小圖示、右側 `.mono-en` 小標 `OUR FOCUS`。
- [ ] **Step 2:** 寫 `js/animations.js` 兩個 init 並在 index 底部呼叫。
- [ ] **Step 3:** Preview 驗證：捲動時卡片錯開淡入；`preview_eval` 模擬 reduced-motion 需直接顯示；三尺寸版面不破。
- [ ] **Step 4:** Commit：`feat: homepage hero and research focus`

### Task 4: 資料層（試算表＋Drive＋降級）

**Files:**
- Modify: `js/data.js`

**Interfaces:**
- Produces（全部 async、失敗回傳 fallback，不 throw）:
  - `CONFIG = { SHEET_ID: "", DRIVE_FOLDER_ID: "", DRIVE_API_KEY: "" }`（空字串＝直接用 fallback）
  - `fetchNews() -> [{date, category, content, link}]`（category ∈ 榮譽|發表|活動|公告；日期新→舊）
  - `fetchEvents() -> [{date, title, description, image, pinned}]`
  - `fetchPhotos(limit) -> [{src, thumb, caption}]`（limit=0 全量）
- gviz 解析：回應剝除 `google.visualization.Query.setResponse(` 前綴與 `);` 後綴再 `JSON.parse`，欄位依表頭名對應
- `FALLBACK_NEWS`（5 筆，取自內容文件的真實事實）：

```js
const FALLBACK_NEWS = [
  { date: "2026-01-15", category: "發表", content: "社區健康照護護理師臨床與成本效益之統合分析刊登於 International Journal of Nursing Studies", link: "" },
  { date: "2025-06-01", category: "發表", content: "3D 列印植入式中心靜脈導管模型培訓研究成果發表", link: "" },
  { date: "2024-10-01", category: "發表", content: "〈專科護理師組織氣候、領導風格與工作滿意度關係之初探〉刊登於《護理雜誌》", link: "" },
  { date: "2024-08-01", category: "活動", content: "「教育性桌遊對臨床醫護人員同理心與情緒智力成效」計畫啟動", link: "" },
  { date: "2023-08-01", category: "公告", content: "3D 列印教具培訓課程研究計畫執行中，歡迎臨床夥伴交流", link: "" }
];
```

  - `FALLBACK_EVENTS`（2 筆，由上表 pinned 主題改寫）、`FALLBACK_PHOTOS`（8 筆，`assets/placeholder-{1..8}.svg` 粉橙漸層 SVG，caption 如「活動照片佔位」）

- [ ] **Step 1:** 實作三個 fetch＋fallback＋8 個佔位 SVG（寫入 assets/，`<svg>` 漸層矩形＋十字浮水印，各檔僅數行）。
- [ ] **Step 2:** Preview console 以 `preview_eval` 呼叫 `fetchNews().then(...)` 驗證 CONFIG 為空時回傳 5 筆 fallback、排序正確。
- [ ] **Step 3:** Commit：`feat: data layer with google sheets/drive + fallbacks`

### Task 5: 首頁後半（最新消息／成果總覽／團隊／聯絡）

**Files:**
- Modify: `index.html`、`css/main.css`（metric card、news 卡、表單樣式）

**Interfaces:**
- Consumes: `fetchNews`、`SITE.stats`、`initCounters`
- 消息區：3 則預覽卡（日期徽章＋分類 `.chip`＋內容一行截斷），分類籤色：榮譽=莓粉底、發表=橘橙底、活動=蜜桃底、公告=灰描邊（全部深色字）
- 成果總覽：metric card ×4（icon＋大數字 `data-count`＋中文標籤＋英文小字 `Publications/Projects/Research Areas/Members`）；`stats.members === null` 時第四卡數字顯示「招募中」且不套 `data-count`
- 團隊預覽:主持人卡（`.avatar` 顯示「宋」、姓名職稱、專長一行：內外科護理・急重症護理・老人護理…）＋一張 `.wip` 卡「成員名單整理中——歡迎加入我們」連 `#contact`
- 聯絡區 `id="contact"`：左表單（姓名、Email、主題 `<select>`：加入研究團隊|實習與見習|合作與交流|其他、訊息 `<textarea>`），送出組 `mailto:SITE.email?subject=[網站來信] {主題} - {姓名}&body={訊息}%0A%0A聯絡人：{姓名} ({Email})` 並 `window.location.href`；右三張引導卡（加入研究團隊／實習與見習／合作與交流，各一句說明）

- [ ] **Step 1:** 實作四區 HTML＋渲染函式（`renderNews()` 於 DOMContentLoaded 呼叫 `fetchNews` 取前 3 筆）＋表單 mailto JS（阻止預設送出、必填檢查姓名與訊息）。
- [ ] **Step 2:** Preview 驗證：fallback 消息 3 則正確顯示、數字滾動一次、表單填寫後 `preview_eval` 檢查組出的 mailto URL 編碼正確、`preview_snapshot` 確認聯絡資訊。
- [ ] **Step 3:** Commit：`feat: homepage news, stats, team, contact sections`

### Task 6: 六個子頁

**Files:**
- Create: `research.html`、`publications.html`、`education.html`、`members.html`、`collaboration.html`、`resources.html`
- Modify: `css/main.css`（頁首橫幅 `.page-hero`、時間軸表格、論文列表樣式）

**Interfaces:**
- Consumes: `initLayout(page)`、`initReveal()`、`fetchPhotos(0)`、`openLightbox`
- 共用 `.page-hero`：淡粉底小橫幅（`.mono-en` 英文頁名＋中文大標＋一句描述＋`.ecg-divider`）
- 內容對照 `docs/content/pi-sung-chien-mei.md`（實作時整份讀入，逐條照抄）：
  - `research.html`：四領域各一節（Task 3 摘要擴寫為 2–3 句，引用對應論文/計畫編號的主題，不虛構）＋「研究計畫」表格 11 列（名稱/角色/補助單位/期間），進行中計畫加 `.chip` `進行中`
  - `publications.html`：英文期刊 20 篇＋中文 1 篇，各 `<li>` 完整書目、`Sung, C. M.`/`宋建美` 用 `<strong>`；每篇尾留 `<a class="doi" hidden>DOI</a>` 佔位；頁尾註「共 23 篇，其餘書目補齊中」
  - `education.html`：四區（課程教學／訓練模組／學生作品／臨床教學）；訓練模組區放兩張真實雛形卡（3D 列印中心靜脈導管教具、教育性桌遊——文字取自計畫 9、11 名稱），其餘 `.wip`
  - `members.html`：主持人完整介紹（現職、學歷 3 筆、專長 7 項——重點 `<strong>`）＋`.wip`「成員名單整理中」
  - `collaboration.html`：三張 `.wip` 卡（合作夥伴／研究招募／產學連結）＋活動花絮照片牆（`fetchPhotos(0)` masonry、點擊 `openLightbox`）
  - `resources.html`：三張 `.wip` 卡（開放工具／衛教素材／研究 protocol）
- 每頁 `<title>`：`{頁名}｜護理創新及專科訓練研究室`

- [ ] **Step 1:** 建 `research.html` 與 `publications.html`（內容量最大，先做）。
- [ ] **Step 2:** 建其餘四頁。
- [ ] **Step 3:** Preview 逐頁驗證：導覽高亮正確、publications 21 條書目與粗體、research 表 11 列、燈箱可開關、三尺寸不破版。
- [ ] **Step 4:** Commit：`feat: six subpages`

### Task 7: 驗收、素材規格清單與維護說明

**Files:**
- Create: `assets/素材規格清單.md`、`README-維護說明.md`
- Modify: 驗收發現的問題

- [ ] **Step 1:** 全站驗收：三尺寸（1280/768/375）逐頁 `preview_screenshot`；`preview_eval` 模擬 reduced-motion；斷網情境（CONFIG 留空即是）備用內容檢查；對照 `docs/content/pi-sung-chien-mei.md` 清點：學歷 3、專長 7、計畫 11、論文 21、聯絡資訊。跑 `npx --yes lighthouse http://localhost:5173 --only-categories=performance,accessibility --chrome-flags="--headless" --output=json --output-path=./lighthouse.json`（結果不入版控），效能與無障礙需 ≥ 90，未達則修正。
- [ ] **Step 2:** 寫 `assets/素材規格清單.md`：hero-illustration.png（比例 4:3、建議 ≥1200px 寬、去背或白底、風格描述＋AI prompt 範例）、各頁 page-hero 選配圖、成員照（1:1 ≥400px）、icon pack 替換說明（檔名對應表）。
- [ ] **Step 3:** 寫 `README-維護說明.md`：試算表建立與發布步驟、news/events 欄位、雲端資料夾與 API 金鑰申請、CONFIG 填法、照片命名建議（`2026-06-15 活動名稱.jpg`）、Firebase 專案建立與 `firebase deploy`、改站名/統計數字改 `js/data.js` 的 `SITE`。
- [ ] **Step 4:** Commit：`docs: asset spec and maintenance guide`＋修正項各自 commit。
