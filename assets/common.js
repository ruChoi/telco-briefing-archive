/* 아카이브 공통 유틸 — index.json/브리핑 JSON을 읽어 렌더링 (빌드 불필요) */

const CARRIERS = { skt: "SKT", kt: "KT", "lg-uplus": "LG U+" };
const KIND_LABEL = { highlight: "오늘의 하이라이트", new: "신규", closing: "마감 임박", ongoing: "진행 중" };
const DOW = ["일", "월", "화", "수", "목", "금", "토"];

// GitHub Pages(하위 경로)와 로컬 서버 양쪽에서 동작하도록 상대 경로 기준
function basePath() {
  // /briefing.html 등 루트의 html에서 호출된다는 전제
  return ".";
}

async function fetchJSON(path) {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00+09:00");
  return `${iso} (${DOW[d.getDay()]})`;
}

function fmtPeriod(p) {
  if (!p || (!p.start && !p.end)) return "";
  return `${p.start || "?"} ~ ${p.end || "?"}`;
}

function dday(end, base) {
  if (!end) return null;
  const b = base ? new Date(base + "T00:00:00+09:00") : new Date();
  const e = new Date(end + "T00:00:00+09:00");
  const diff = Math.round((e - new Date(b.getFullYear(), b.getMonth(), b.getDate(), 0, 0, 0, 0)) / 86400000);
  if (diff < 0) return "종료";
  if (diff === 0) return "D-DAY";
  return `D-${diff}`;
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v; // 신뢰 문자열 전용 (라벨 등)
    else node.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}
