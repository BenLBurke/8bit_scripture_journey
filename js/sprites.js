/* ----------------------------------------------------------------------------
   8-bit sprite system.
   Sprites are authored as small grids of single characters. Each character maps
   to a hex colour via a per-character palette, so one humanoid "template" can be
   re-coloured into many Bible characters. '.' / ' ' means transparent.
---------------------------------------------------------------------------- */

// Generic standing person (16 x 16).
//  H hair  S skin  k skin-shade  E eye  R robe  B belt  F feet/sandals
const T_PERSON = [
  "................",
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HSSSSSSH....",
  "....SSSSSSSS....",
  "....SkESSEkS....",
  "....SSSSSSSS....",
  "....SSSkkSSS....",
  "......SSSS......",
  "....RRRRRRRR....",
  "...RRRRRRRRRR...",
  "..RRRRRRRRRRRR..",
  "..RRRRBBBBRRRR..",
  "...RRRRRRRRRR...",
  "...RRRR..RRRR...",
  "...FFF....FFF...",
];

// Joseph's coat of many colours — striped robe (symbols 1-4 = stripe colours).
const T_COAT = [
  "................",
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HSSSSSSH....",
  "....SSSSSSSS....",
  "....SkESSEkS....",
  "....SSSSSSSS....",
  "......SSSS......",
  "....11111111....",
  "...2222222222...",
  "..333333333333..",
  "..444444444444..",
  "..111144441111..",
  "...2222222222...",
  "...3333..3333...",
  "...FFF....FFF...",
];

// Headgear overlays (drawn on top of a person). G = headgear, g = shade.
const O_CROWN = [
  "................",
  "...G.G.GG.G.G...",
  "...GGGGGGGGGG...",
  "...GGgggggggG...",
  "................",
];
const O_EGYPT = [   // Egyptian nemes headdress framing the face
  "...GGGGGGGGGG...",
  "...GgggggggggG..",
  "...G........G...",
  "..GG........GG..",
  "..Gg........gG..",
  "..GG........GG..",
];
const O_HELMET = [
  "....GGGGGGGG....",
  "...GGGGGGGGGG...",
  "...Gggggggg G...",
  "...G........G...",
];

// ---- animals & props (authored directly with colour symbols) ----
// W wool  D dark  K skin/face  L leg  E eye
const A_SHEEP = [
  "............",
  "....WWWWW...",
  "...WWWWWWW..",
  "..WWWWWWWWDD",
  "..WWWWWWWWDE",
  "..WWWWWWWWDD",
  "..WLWWLWWL..",
  "..D..D..D...",
];
// Y body  M mane  D dark  E eye  T teeth
const A_LION = [
  "................",
  "...MMM..........",
  "..MMMMM.MMM.....",
  ".MMYYYMMYEYM....",
  ".MMYYYYYYYYM.YYY",
  "..YYYYYYYYYYYYYY",
  "..YYYYYYYYYYYYY.",
  "..Y.YY.YY.YY.Y..",
  "..D.DD.DD.DD.D..",
];
// B body  D dark  E eye  C claw
const A_BEAR = [
  "................",
  "..DD........DD..",
  ".DBBD......DBBD.",
  ".DBBBBBBBBBBBBD.",
  "DBBBBBBBBBBEBBBD",
  "DBBBBBBBBBBBBBBD",
  "DBBBBBBBBBBBBBBD",
  ".BBBBBBBBBBBBBB.",
  ".BB.BBB..BBB.BB.",
  ".CC.CCC..CCC.CC.",
];

// Palettes ------------------------------------------------------------------
const PAL = {
  skin: "#e0a878", skinShade: "#bd8050", eye: "#1a1208",
  hairBrown: "#5a3a1a", hairBlack: "#1c140c", hairRed: "#8a4a22",
  hairWhite: "#d4d2c0", hairGrey: "#9a988a",
  sandal: "#6a4a2a",
};

// Each character: which template/overlay to use and how to colour the symbols.
const CHARS = {
  // --- Joseph arc ---
  joseph: { tpl: T_COAT, scale: 3, colors: {
    H: PAL.hairBrown, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    "1": "#b8342a", "2": "#e0b020", "3": "#3a8a4a", "4": "#3858b0", F: PAL.sandal } },
  josephSlave: { tpl: T_PERSON, scale: 3, colors: {
    H: PAL.hairBrown, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#9a8a70", B: "#6a5a44", F: PAL.sandal } },
  josephRuler: { tpl: T_PERSON, scale: 3, overlay: O_EGYPT, colors: {
    H: PAL.hairBlack, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#e6e4d4", B: "#e0b020", F: PAL.sandal, G: "#e0b020", g: "#3858b0" } },

  brother:  { tpl: T_PERSON, scale: 3, colors: {
    H: PAL.hairBlack, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#7a5a3a", B: "#5a4028", F: PAL.sandal } },
  brother2: { tpl: T_PERSON, scale: 3, colors: {
    H: PAL.hairBrown, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#4a6a4a", B: "#34482e", F: PAL.sandal } },
  jacob:    { tpl: T_PERSON, scale: 3, colors: {
    H: PAL.hairWhite, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#8a7050", B: "#6a5238", F: PAL.sandal } },
  potiphar: { tpl: T_PERSON, scale: 3, overlay: O_EGYPT, colors: {
    H: PAL.hairBlack, S: "#c89868", k: "#a87848", E: PAL.eye,
    R: "#6838a0", B: "#e0b020", F: PAL.sandal, G: "#cfae50", g: "#202020" } },
  potipharWife: { tpl: T_PERSON, scale: 3, colors: {
    H: PAL.hairBlack, S: "#e6b488", k: "#c4905c", E: PAL.eye,
    R: "#b03878", B: "#e0b020", F: PAL.sandal } },
  pharaoh:  { tpl: T_PERSON, scale: 3, overlay: O_EGYPT, colors: {
    H: PAL.hairBlack, S: "#c89868", k: "#a87848", E: PAL.eye,
    R: "#e6e4d4", B: "#e0b020", F: PAL.sandal, G: "#e0b020", g: "#3858b0" } },
  guard:    { tpl: T_PERSON, scale: 3, overlay: O_HELMET, colors: {
    H: PAL.hairBlack, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#8a8a8a", B: "#5a5a5a", F: PAL.sandal, G: "#a87838", g: "#6a4a20" } },

  // --- David arc ---
  david:    { tpl: T_PERSON, scale: 2.6, colors: {
    H: PAL.hairRed, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#9a6a3a", B: "#6a4626", F: PAL.sandal } },
  davidKing:{ tpl: T_PERSON, scale: 3, overlay: O_CROWN, colors: {
    H: PAL.hairRed, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#6838a0", B: "#e0b020", F: PAL.sandal, G: "#e0b020", g: "#a07810" } },
  saul:     { tpl: T_PERSON, scale: 3.4, overlay: O_CROWN, colors: {
    H: PAL.hairGrey, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#b03828", B: "#e0b020", F: PAL.sandal, G: "#e0b020", g: "#a07810" } },
  samuel:   { tpl: T_PERSON, scale: 3, colors: {
    H: PAL.hairWhite, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#e6e4d4", B: "#b0aa90", F: PAL.sandal } },
  goliath:  { tpl: T_PERSON, scale: 4.6, overlay: O_HELMET, colors: {
    H: PAL.hairBlack, S: "#b88858", k: "#946238", E: PAL.eye,
    R: "#6a7a5a", B: "#4a5a3a", F: "#4a4a4a", G: "#b0902a", g: "#7a6418" } },
  bathsheba:{ tpl: T_PERSON, scale: 3, colors: {
    H: PAL.hairBlack, S: "#e6b488", k: "#c4905c", E: PAL.eye,
    R: "#c0c4d8", B: "#8890a8", F: PAL.sandal } },
  nathan:   { tpl: T_PERSON, scale: 3, colors: {
    H: PAL.hairGrey, S: PAL.skin, k: PAL.skinShade, E: PAL.eye,
    R: "#9a9488", B: "#6a665c", F: PAL.sandal } },

  // --- animals ---
  sheep: { tpl: A_SHEEP, scale: 3, colors: {
    W: "#e8e6d8", D: "#3a322a", E: PAL.eye, L: "#6a5a44" } },
  lion:  { tpl: A_LION, scale: 3, colors: {
    M: "#b07020", Y: "#e0a838", D: "#5a4020", E: PAL.eye } },
  bear:  { tpl: A_BEAR, scale: 3, colors: {
    B: "#6a4a2a", D: "#3a2616", E: PAL.eye, C: "#d8d8c0" } },
};

const Sprites = {
  // Width/height in source pixels for a character grid.
  size(name) {
    const c = CHARS[name];
    return { w: c.tpl[0].length, h: c.tpl.length, scale: c.scale };
  },

  // Draw a single grid at device pixel size `px`.
  _grid(ctx, grid, colors, x, y, px, flip) {
    const w = grid[0].length;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const ch = grid[row][col];
        const color = colors[ch];
        if (!color) continue;
        const dx = flip ? x + (w - 1 - col) * px : x + col * px;
        ctx.fillStyle = color;
        ctx.fillRect(Math.round(dx), Math.round(y + row * px), Math.ceil(px), Math.ceil(px));
      }
    }
  },

  /* Draw a character. (x, y) is the BOTTOM-CENTRE anchor (feet position),
     which makes it easy to stand characters on a ground line. */
  draw(ctx, name, x, y, opts = {}) {
    const c = CHARS[name];
    if (!c) return;
    const px = (opts.scale || c.scale);
    const w = c.tpl[0].length * px;
    const h = c.tpl.length * px;
    const left = Math.round(x - w / 2);
    let top = Math.round(y - h);
    if (opts.bob) top += Math.round(Math.sin(opts.bob) * px);
    const flip = !!opts.flip;
    this._grid(ctx, c.tpl, c.colors, left, top, px, flip);
    if (c.overlay) this._grid(ctx, c.overlay, c.colors, left, top, px, flip);
  },
};
