/* ----------------------------------------------------------------------------
   Background painter. Each scene is drawn procedurally so the game needs no
   image files. W = 256, H = 224 (NES-style internal resolution).
---------------------------------------------------------------------------- */
const W = 256, H = 224;

function rect(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

// vertical gradient made of horizontal bands (keeps the chunky retro feel)
function sky(ctx, top, bottom, h = 150) {
  const bands = 10;
  for (let i = 0; i < bands; i++) {
    ctx.fillStyle = mix(top, bottom, i / (bands - 1));
    ctx.fillRect(0, (i * h / bands) | 0, W, Math.ceil(h / bands));
  }
}
function mix(a, b, t) {
  const pa = hex(a), pb = hex(b);
  const r = Math.round(pa[0] + (pb[0] - pa[0]) * t);
  const g = Math.round(pa[1] + (pb[1] - pa[1]) * t);
  const bl = Math.round(pa[2] + (pb[2] - pa[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function hex(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// deterministic pseudo-random so scenery doesn't shimmer each frame
function rng(seed) { let s = seed; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; }

function stars(ctx, n, seed) {
  const r = rng(seed);
  ctx.fillStyle = "#fdfdf0";
  for (let i = 0; i < n; i++) {
    const x = (r() * W) | 0, y = (r() * 120) | 0;
    ctx.fillRect(x, y, 1, 1);
  }
}
function dunes(ctx, baseY, color, seed) {
  const r = rng(seed);
  ctx.fillStyle = color;
  for (let x = 0; x < W; x += 4) {
    const y = baseY + Math.sin((x + seed) * 0.05) * 6 + r() * 2;
    ctx.fillRect(x, y, 4, H - y);
  }
}
function bricks(ctx, x, y, w, h, c1, c2) {
  rect(ctx, x, y, w, h, c1);
  ctx.fillStyle = c2;
  for (let by = y; by < y + h; by += 8) {
    const off = ((by - y) / 8) % 2 ? 8 : 0;
    for (let bx = x - off; bx < x + w; bx += 16) ctx.fillRect(bx, by, 14, 1);
    ctx.fillRect(x, by, 1, 8);
  }
}

const Backgrounds = {
  // open desert / countryside by day
  desert(ctx) {
    sky(ctx, "#7db4e0", "#cfe6f2", 130);
    rect(ctx, 0, 130, W, H - 130, "#d8b066");
    dunes(ctx, 120, "#e0bc78", 11);
    rect(ctx, 0, 150, W, H - 150, "#c89a52");
    // sun
    rect(ctx, 206, 22, 18, 18, "#fdf0a0");
  },

  // the dry pit / cistern Joseph is thrown into
  pit(ctx) {
    sky(ctx, "#caa45a", "#e6c878", 70);
    rect(ctx, 0, 70, W, H - 70, "#7a5a32");
    // pit walls
    rect(ctx, 60, 40, 136, H - 40, "#4a3420");
    bricks(ctx, 60, 40, 136, H - 40, "#5a4026", "#3a2614");
    rect(ctx, 72, 60, 112, H - 60, "#241810");
  },

  // Egyptian interior (Potiphar's house / palace hall)
  egypt(ctx) {
    rect(ctx, 0, 0, W, H, "#caa45a");
    bricks(ctx, 0, 0, W, 150, "#cda85e", "#b08840");
    // columns
    for (const cx of [24, 116, 208]) {
      rect(ctx, cx, 10, 24, 160, "#e0c884");
      rect(ctx, cx, 10, 24, 8, "#caa45a");
      ctx.fillStyle = "#a07838";
      for (let yy = 18; yy < 170; yy += 6) ctx.fillRect(cx, yy, 24, 1);
    }
    rect(ctx, 0, 150, W, H - 150, "#9a7838");
    // hieroglyph hints
    ctx.fillStyle = "#7a5a28";
    for (let i = 0; i < 6; i++) ctx.fillRect(60 + i * 20, 24, 8, 8);
  },

  // prison cell
  prison(ctx) {
    rect(ctx, 0, 0, W, H, "#3a3a44");
    bricks(ctx, 0, 0, W, 150, "#4a4a56", "#2e2e38");
    rect(ctx, 0, 150, W, H - 150, "#26262e");
    // bars
    ctx.fillStyle = "#1a1a20";
    for (let x = 16; x < W; x += 26) ctx.fillRect(x, 0, 6, 150);
    rect(ctx, 0, 26, W, 6, "#1a1a20");
    // small barred window light
    rect(ctx, 188, 30, 36, 30, "#6a7a8a");
    ctx.fillStyle = "#1a1a20";
    rect(ctx, 204, 30, 4, 30, "#1a1a20");
  },

  // throne hall (Egypt rule / David's palace share this with a tint)
  throne(ctx) {
    rect(ctx, 0, 0, W, H, "#5a3a6a");
    bricks(ctx, 0, 0, W, 150, "#653f78", "#4a2e5a");
    rect(ctx, 0, 150, W, H - 150, "#3a2448");
    // red carpet
    ctx.fillStyle = "#a83030";
    ctx.beginPath();
    ctx.moveTo(108, 150); ctx.lineTo(148, 150);
    ctx.lineTo(176, H); ctx.lineTo(80, H); ctx.closePath(); ctx.fill();
    // throne dais
    rect(ctx, 96, 96, 64, 60, "#caa45a");
    rect(ctx, 108, 70, 40, 40, "#e0b020");
    rect(ctx, 112, 74, 32, 30, "#a87810");
  },

  // green pasture / shepherd field
  field(ctx) {
    sky(ctx, "#8cc0e8", "#d6ecf6", 120);
    rect(ctx, 0, 120, W, H - 120, "#6aa84a");
    rect(ctx, 0, 150, W, H - 150, "#4f8a38");
    // a few hills
    ctx.fillStyle = "#5e9a40";
    ctx.beginPath(); ctx.arc(50, 130, 40, Math.PI, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(200, 128, 50, Math.PI, 2 * Math.PI); ctx.fill();
    rect(ctx, 226, 24, 16, 16, "#fdf0a0"); // sun
  },

  // valley of Elah battlefield
  battlefield(ctx) {
    sky(ctx, "#b8a86a", "#e6d49a", 120);
    rect(ctx, 0, 120, W, H - 120, "#9a8a4a");
    dunes(ctx, 116, "#8a7a40", 7);
    rect(ctx, 0, 150, W, H - 150, "#7a6a36");
    // distant tents (two camps)
    for (const [bx, col] of [[20, "#7a5a4a"], [200, "#5a5a7a"]]) {
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = col;
        const tx = bx + i * 14;
        ctx.beginPath();
        ctx.moveTo(tx, 120); ctx.lineTo(tx + 6, 108); ctx.lineTo(tx + 12, 120);
        ctx.closePath(); ctx.fill();
      }
    }
  },

  // night sky (Joseph's dreams / David writing Psalms)
  night(ctx) {
    sky(ctx, "#0e1230", "#26305a", 150);
    stars(ctx, 90, 99);
    // moon
    rect(ctx, 198, 24, 22, 22, "#e8e8d0");
    rect(ctx, 192, 28, 8, 14, "#26305a");
    rect(ctx, 0, 150, W, H - 150, "#141838");
    dunes(ctx, 150, "#1a1f44", 3);
  },

  // rooftop at dusk (David & the temptation)
  rooftop(ctx) {
    sky(ctx, "#e08a4a", "#f0c070", 110);
    rect(ctx, 220, 18, 16, 16, "#fdd070"); // low sun
    rect(ctx, 0, 110, W, H - 110, "#7a5a3a");
    bricks(ctx, 0, 110, W, 40, "#8a6a44", "#6a4a2a");
    rect(ctx, 0, 150, W, H - 150, "#5a4030");
    // low parapet wall
    ctx.fillStyle = "#9a7a52";
    for (let x = 0; x < W; x += 16) ctx.fillRect(x, 150, 12, 10);
  },

  title(ctx) {
    sky(ctx, "#10143a", "#3a2a6a", 224);
    stars(ctx, 70, 7);
    // sun/halo glow on the horizon
    ctx.fillStyle = "#e0b020";
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.arc(128, 150, 70, 0, 2 * Math.PI); ctx.fill();
    ctx.globalAlpha = 1;
    dunes(ctx, 160, "#1c1640", 3);
  },
};
