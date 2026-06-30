/* ----------------------------------------------------------------------------
   8-Bit Scripture Journey — game engine.
   States: title -> menu -> story (with fact cards, choices, mini-games) ->
   chapter end. Everything renders to a 256x224 canvas, scaled up by CSS.
---------------------------------------------------------------------------- */
(() => {
  const canvas = document.getElementById("screen");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const FONT = '"Courier New", monospace';
  const SAVE_KEY = "scripture_journey_save_v1";

  // ---- persistent progress (which chapters cleared, best faith score) ----
  let save = { joseph: null, david: null };
  try { Object.assign(save, JSON.parse(localStorage.getItem(SAVE_KEY)) || {}); } catch (e) {}
  function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

  // ---- global game state ----
  const game = {
    mode: "title",      // title | menu | story | fact | choiceSelect | choiceResp | minigame | end
    menuIndex: 0,
    chapterKey: null,
    beats: [],
    beatIndex: 0,
    step: null,
    tw: null,           // typewriter
    selIndex: 0,
    faith: 0,
    mg: null,
    flash: 0,
    t: 0,               // global time (seconds)
  };

  const CHAPTERS = ["joseph", "david"];

  // ------------------------------------------------------------------ text
  function setFont(px) { ctx.font = `${px}px ${FONT}`; }

  function text(str, x, y, { size = 8, color = "#e8e6d0", align = "left", shadow = true } = {}) {
    setFont(size);
    ctx.textAlign = align;
    ctx.textBaseline = "top";
    if (shadow) { ctx.fillStyle = "#000"; ctx.fillText(str, x + 1, y + 1); }
    ctx.fillStyle = color;
    ctx.fillText(str, x, y);
  }

  function wrap(str, maxW, size) {
    setFont(size);
    const words = str.split(" ");
    const lines = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? cur + " " + w : w;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // typewriter helpers -------------------------------------------------------
  function startType(str) { game.tw = { full: str, n: 0, done: str.length === 0, acc: 0 }; }
  function updateType(dt) {
    const tw = game.tw;
    if (!tw || tw.done) return;
    tw.acc += dt;
    const cps = 48; // characters per second
    while (tw.acc > 1 / cps && tw.n < tw.full.length) {
      tw.acc -= 1 / cps;
      tw.n++;
      if (tw.full[tw.n - 1] !== " " && tw.n % 2 === 0) Sound.blip();
    }
    if (tw.n >= tw.full.length) tw.done = true;
  }
  function shownText() { return game.tw ? game.tw.full.slice(0, game.tw.n) : ""; }

  // --------------------------------------------------------------- rendering
  function drawScene(beat) {
    (Backgrounds[beat.bg] || Backgrounds.desert)(ctx);
    if (beat.sprites) {
      for (const s of beat.sprites) {
        const opts = { flip: s.flip };
        if (s.bob) opts.bob = game.t * 4 + (s.x || 0);
        // Keep feet on a baseline just above the dialogue panel so legs stay visible.
        Sprites.draw(ctx, s.name, s.x, Math.min(s.y, 152), opts);
      }
    }
  }

  function panel(x, y, w, h, fill = "#101428", border = "#e0b020") {
    ctx.fillStyle = "#000"; ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.fillStyle = border; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
    ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  }

  function drawDialogue(speaker, body) {
    const x = 8, y = 156, w = 240, h = 60;
    panel(x, y, w, h);
    if (speaker && speaker !== "Narrator") {
      const tagW = ctx.measureText ? Math.max(40, speaker.length * 6 + 10) : 60;
      panel(x + 6, y - 9, tagW, 11, "#3a2e10", "#e0b020");
      text(speaker, x + 11, y - 7, { size: 8, color: "#ffe08a" });
    }
    const lines = wrap(body, w - 16, 8);
    lines.slice(0, 5).forEach((ln, i) => text(ln, x + 8, y + 6 + i * 10, { size: 8 }));
  }

  function drawHUD() {
    const c = STORIES[game.chapterKey];
    text(c.title, 8, 6, { size: 8, color: c.color });
    text("FAITH " + game.faith, 248, 6, { size: 8, color: "#ffe08a", align: "right" });
    // beat progress dots
    const total = c.beats.length;
    const dotW = Math.min(4, 200 / total);
    for (let i = 0; i < total; i++) {
      ctx.fillStyle = i <= game.beatIndex ? c.color : "#444";
      ctx.fillRect(8 + i * dotW, 17, Math.max(1, dotW - 1), 2);
    }
  }

  function drawFact(fact) {
    const x = 18, y = 36, w = 220, h = 150;
    panel(x, y, w, h, "#1a2240", "#5aa0e0");
    text("DID YOU KNOW?", 128, y + 8, { size: 10, color: "#9ad0ff", align: "center" });
    text(fact.ref, 128, y + 24, { size: 8, color: "#ffe08a", align: "center" });
    ctx.fillStyle = "#5aa0e0"; ctx.fillRect(x + 14, y + 36, w - 28, 1);
    const lines = wrap(fact.text, w - 28, 8);
    lines.forEach((ln, i) => text(ln, 128, y + 44 + i * 11, { size: 8, align: "center" }));
    if (blink()) text("[A] Continue", 128, y + h - 14, { size: 8, color: "#9ad0ff", align: "center" });
  }

  function drawChoice(beat) {
    const x = 8, y = 150, w = 240, h = 66;
    panel(x, y, w, h);
    const pl = wrap(beat.choice.prompt, w - 16, 8);
    pl.forEach((ln, i) => text(ln, x + 8, y + 5 + i * 9, { size: 8, color: "#ffe08a" }));
    let oy = y + 7 + pl.length * 9;
    beat.choice.options.forEach((opt, i) => {
      const sel = i === game.selIndex;
      const lines = wrap((sel ? "▶ " : "  ") + opt.label, w - 16, 8);
      lines.forEach((ln, j) => {
        text(ln, x + 8, oy, { size: 8, color: sel ? "#fff" : "#a8a8b8" });
        oy += 9;
      });
    });
  }

  function blink() { return Math.floor(game.t * 2) % 2 === 0; }

  // -------------------------------------------------------------- title/menu
  function drawTitle() {
    Backgrounds.title(ctx);
    Sprites.draw(ctx, "joseph", 60, 186, { bob: game.t * 3 });
    Sprites.draw(ctx, "davidKing", 198, 186, { bob: game.t * 3 + 2 });
    text("8-BIT", 128, 40, { size: 22, color: "#e0b020", align: "center" });
    text("SCRIPTURE", 128, 64, { size: 22, color: "#e8e6d0", align: "center" });
    text("JOURNEY", 128, 88, { size: 22, color: "#5aa0e0", align: "center" });
    text("Stories of Joseph & King David", 128, 116, { size: 8, color: "#c8c8d8", align: "center" });
    if (blink()) text("PRESS  ENTER", 128, 188, { size: 10, color: "#ffe08a", align: "center" });
  }

  function drawMenu() {
    Backgrounds.title(ctx);
    text("CHOOSE YOUR JOURNEY", 128, 20, { size: 10, color: "#e8e6d0", align: "center" });
    CHAPTERS.forEach((key, i) => {
      const c = STORIES[key];
      const sel = i === game.menuIndex;
      const y = 50 + i * 70;
      panel(24, y, 208, 58, sel ? "#202848" : "#141828", sel ? c.color : "#444");
      Sprites.draw(ctx, key === "joseph" ? "joseph" : "david", 56, y + 52, {});
      text(c.title, 92, y + 8, { size: 14, color: c.color });
      text(c.subtitle, 92, y + 24, { size: 8, color: "#e8e6d0" });
      text(c.verse, 92, y + 36, { size: 8, color: "#9aa0b0" });
      const done = save[key];
      if (done) text("✓ CLEARED  Faith " + done.faith, 92, y + 47, { size: 8, color: "#7adf7a" });
      else if (sel && blink()) text("[A] Start", 92, y + 47, { size: 8, color: "#ffe08a" });
    });
    text("▲▼ select    [A] start    M mute", 128, 206, { size: 8, color: "#9aa0b0", align: "center" });
  }

  function drawEnd() {
    const c = STORIES[game.chapterKey];
    Backgrounds.night(ctx);
    Sprites.draw(ctx, game.chapterKey === "joseph" ? "josephRuler" : "davidKing", 128, 150, { bob: game.t * 3 });
    panel(24, 24, 208, 86, "#101428", c.color);
    text("CHAPTER COMPLETE!", 128, 32, { size: 11, color: c.color, align: "center" });
    text(c.title + " - " + c.subtitle, 128, 48, { size: 8, color: "#e8e6d0", align: "center" });
    text("Faith Earned: " + game.faith, 128, 64, { size: 9, color: "#ffe08a", align: "center" });
    const verse = game.chapterKey === "joseph"
      ? "\"...God meant it for good.\" Gen 50:20"
      : "\"The Lord is my shepherd.\" Psalm 23:1";
    wrap(verse, 188, 8).forEach((ln, i) =>
      text(ln, 128, 80 + i * 10, { size: 8, color: "#c8c8d8", align: "center" }));
    if (blink()) text("[A] Back to Menu", 128, 200, { size: 9, color: "#9ad0ff", align: "center" });
  }

  // ------------------------------------------------------------- mini-games
  // Defend the flock: time a strike against the lion, then the bear.
  function FlockGame(onDone) {
    return {
      beasts: ["lion", "bear"], phase: 0, marker: 0, dir: 1,
      zone: [0.40, 0.60], feedback: "", fb: 0, beastX: 70, win: false, t: 0,
      points: 0,
      update(dt) {
        this.t += dt;
        if (this.fb > 0) this.fb -= dt;
        if (this.win) { this.beastX -= 90 * dt; if (this.beastX < -40) onDone(this.points); return; }
        this.marker += this.dir * dt * 0.9;
        if (this.marker > 1) { this.marker = 1; this.dir = -1; }
        if (this.marker < 0) { this.marker = 0; this.dir = 1; }
        // beast slowly advances for tension
        this.beastX = 70 + Math.sin(this.t * 3) * 6;
      },
      confirm() {
        if (this.win) return;
        if (this.marker >= this.zone[0] && this.marker <= this.zone[1]) {
          Sound.hit(); this.points += 1;
          this.phase++;
          if (this.phase >= this.beasts.length) { this.win = true; Sound.victory(); }
          else { this.feedback = "Drove it off!"; this.fb = 0.8; }
        } else { Sound.wrong(); this.feedback = "Too soon! Steady..."; this.fb = 0.9; }
      },
      draw() {
        const beast = this.win ? this.beasts[this.phase - 1] : this.beasts[this.phase];
        Sprites.draw(ctx, beast, this.beastX, 150, {});
        Sprites.draw(ctx, "david", 196, 150, { flip: true });
        if (!this.win) {
          Sprites.draw(ctx, "sheep", 230, 150, {});
          // timing bar
          const bx = 38, by = 132, bw = 180, bh = 10;
          panel(bx, by, bw, bh, "#101428", "#e0b020");
          ctx.fillStyle = "#2a6a3a";
          ctx.fillRect(bx + this.zone[0] * bw, by, (this.zone[1] - this.zone[0]) * bw, bh);
          ctx.fillStyle = "#fff";
          ctx.fillRect(bx + this.marker * bw - 1, by - 2, 3, bh + 4);
          drawDialogue("Defend the Flock!",
            "A " + beast + " attacks! Press [A] when the white marker is in the GREEN zone.");
        } else {
          drawDialogue("David", "The Lord delivered me from the lion and the bear!");
        }
        if (this.fb > 0) text(this.feedback, 128, 120, { size: 9, color: "#ffe08a", align: "center" });
      },
    };
  }

  // Sling vs Goliath: time the crosshair over the giant's head, then loose.
  function SlingGame(onDone) {
    return {
      state: "aim", cy: 140, dir: 1, throws: 0, stoneT: 0, capY: 0,
      targetY: 122, targetH: 13, fall: 0, fb: "", fbt: 0, points: 0,
      update(dt) {
        if (this.fbt > 0) this.fbt -= dt;
        if (this.state === "aim") {
          this.cy += this.dir * dt * 70;
          if (this.cy > 178) { this.cy = 178; this.dir = -1; }
          if (this.cy < 104) { this.cy = 104; this.dir = 1; }
        } else if (this.state === "throw") {
          this.stoneT += dt * 2.4;
          if (this.stoneT >= 1) {
            if (Math.abs(this.capY - this.targetY) <= this.targetH) {
              this.state = "win"; this.fall = 0; Sound.hit(); Sound.victory();
              this.points = Math.max(1, 4 - this.throws);
            } else {
              this.state = "aim"; this.fb = "Missed! Steady your aim."; this.fbt = 1; Sound.wrong();
            }
          }
        } else if (this.state === "win") {
          this.fall += dt;
          if (this.fall > 1.1) onDone(this.points);
        }
      },
      confirm() {
        if (this.state !== "aim") return;
        this.capY = this.cy; this.state = "throw"; this.stoneT = 0;
        this.throws++; Sound.sling();
      },
      draw() {
        const gy = this.state === "win" ? 150 + this.fall * 60 : 150;
        Sprites.draw(ctx, "goliath", 78, gy, { flip: this.state === "win" ? false : false });
        if (this.state === "win") { /* toppled */ }
        Sprites.draw(ctx, "david", 196, 150, { flip: true });
        if (this.state === "aim") {
          // crosshair over Goliath's head
          ctx.strokeStyle = "#ff5050"; ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(78, this.cy, 7, 0, 2 * Math.PI); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(70, this.cy); ctx.lineTo(86, this.cy);
          ctx.moveTo(78, this.cy - 8); ctx.lineTo(78, this.cy + 8); ctx.stroke();
          drawDialogue("Sling of Faith!",
            "Move the sight over the giant. Press [A] to loose the stone! (Stones used: " + this.throws + ")");
        } else if (this.state === "throw") {
          const sx = 196 + (78 - 196) * this.stoneT;
          const sy = 150 + (this.capY - 150) * this.stoneT;
          ctx.fillStyle = "#d8d8c0"; ctx.fillRect(sx - 1, sy - 1, 3, 3);
          drawDialogue("Sling of Faith!", "The stone flies in the name of the Lord!");
        } else {
          drawDialogue("David", "The battle is the Lord's! The giant has fallen!");
        }
        if (this.fbt > 0) text(this.fb, 128, 116, { size: 9, color: "#ffe08a", align: "center" });
      },
    };
  }

  // --------------------------------------------------------------- flow
  function startChapter(key) {
    game.chapterKey = key;
    game.beats = STORIES[key].beats;
    game.beatIndex = 0;
    game.faith = 0;
    startBeat(0);
  }
  function startBeat(i) {
    game.beatIndex = i;
    game.step = { factShown: false, choiceDone: false, mgDone: false };
    game.mode = "story";
    startType(game.beats[i].text || "");
  }
  function nextStoryStep() {
    const beat = game.beats[game.beatIndex];
    if (beat.fact && !game.step.factShown) { game.mode = "fact"; return; }
    if (beat.choice && !game.step.choiceDone) {
      game.mode = "choiceSelect"; game.selIndex = 0; return;
    }
    if (beat.minigame && !game.step.mgDone) {
      game.mode = "minigame";
      const done = (pts) => {
        game.faith += pts; game.step.mgDone = true; game.mg = null;
        game.mode = "story"; nextStoryStep();
      };
      game.mg = beat.minigame === "flock" ? FlockGame(done) : SlingGame(done);
      return;
    }
    advanceBeat();
  }
  function advanceBeat() {
    if (game.beatIndex + 1 >= game.beats.length) {
      game.mode = "end";
      Sound.fanfare();
      const prev = save[game.chapterKey];
      if (!prev || game.faith > prev.faith) { save[game.chapterKey] = { faith: game.faith }; persist(); }
    } else {
      startBeat(game.beatIndex + 1);
    }
  }

  // --------------------------------------------------------------- input
  function confirm() {
    Sound.resume();
    switch (game.mode) {
      case "title": Sound.select(); game.mode = "menu"; break;
      case "menu": Sound.select(); startChapter(CHAPTERS[game.menuIndex]); break;
      case "story":
        if (game.tw && !game.tw.done) { game.tw.n = game.tw.full.length; game.tw.done = true; }
        else { Sound.select(); nextStoryStep(); }
        break;
      case "fact": Sound.select(); game.step.factShown = true; game.mode = "story"; nextStoryStep(); break;
      case "choiceSelect": {
        const beat = game.beats[game.beatIndex];
        const opt = beat.choice.options[game.selIndex];
        if (opt.correct) { Sound.correct(); game.faith += (opt.points || 1); }
        else Sound.wrong();
        startType(opt.response);
        game.mode = "choiceResp";
        break;
      }
      case "choiceResp":
        if (game.tw && !game.tw.done) { game.tw.n = game.tw.full.length; game.tw.done = true; }
        else { Sound.select(); game.step.choiceDone = true; game.mode = "story"; nextStoryStep(); }
        break;
      case "minigame": if (game.mg) game.mg.confirm(); break;
      case "end": Sound.select(); game.mode = "menu"; break;
    }
  }
  function back() {
    Sound.back();
    if (game.mode === "menu") game.mode = "title";
    else if (["story", "fact", "choiceSelect", "choiceResp", "minigame", "end"].includes(game.mode)) {
      game.mode = "menu"; game.mg = null;
    }
  }
  function dir(dy) {
    if (game.mode === "menu") {
      game.menuIndex = (game.menuIndex + dy + CHAPTERS.length) % CHAPTERS.length; Sound.move();
    } else if (game.mode === "choiceSelect") {
      const n = game.beats[game.beatIndex].choice.options.length;
      game.selIndex = (game.selIndex + dy + n) % n; Sound.move();
    }
  }

  function handle(action) {
    if (action === "confirm") confirm();
    else if (action === "back") back();
    else if (action === "up") dir(-1);
    else if (action === "down") dir(1);
    else if (action === "mute") { const m = Sound.toggleMute(); if (!m) Sound.select(); }
  }

  const KEYMAP = {
    Enter: "confirm", " ": "confirm", z: "confirm", Z: "confirm",
    Escape: "back", x: "back", X: "back", Backspace: "back",
    ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down",
    ArrowLeft: "up", ArrowRight: "down", // left/right also cycle choices/menu
    m: "mute", M: "mute",
  };
  window.addEventListener("keydown", (e) => {
    const a = KEYMAP[e.key];
    if (!a) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
    handle(a);
  });

  // touch buttons -> actions
  const TOUCHMAP = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "up", ArrowRight: "down", Enter: "confirm", Escape: "back" };
  document.querySelectorAll("#touch-controls .tb").forEach((btn) => {
    const act = TOUCHMAP[btn.dataset.key];
    const fire = (e) => { e.preventDefault(); handle(act); };
    btn.addEventListener("touchstart", fire, { passive: false });
    btn.addEventListener("mousedown", fire);
  });
  // tapping the canvas confirms (handy on mobile for dialogue advance)
  canvas.addEventListener("pointerdown", () => handle("confirm"));

  // --------------------------------------------------------------- main loop
  let last = performance.now();
  function frame(now) {
    let dt = (now - last) / 1000; last = now;
    if (dt > 0.1) dt = 0.1;
    game.t += dt;

    if (game.mode === "story" || game.mode === "choiceResp") updateType(dt);
    if (game.mode === "minigame" && game.mg) game.mg.update(dt);

    // ---- render ----
    ctx.clearRect(0, 0, W, H);
    if (game.mode === "title") { drawTitle(); requestAnimationFrame(frame); return; }
    if (game.mode === "menu") { drawMenu(); requestAnimationFrame(frame); return; }
    if (game.mode === "end") { drawEnd(); requestAnimationFrame(frame); return; }

    const beat = game.beats[game.beatIndex];
    drawScene(beat);
    drawHUD();

    if (game.mode === "minigame" && game.mg) {
      game.mg.draw();
    } else if (game.mode === "choiceSelect") {
      drawChoice(beat);
    } else if (game.mode === "choiceResp") {
      drawDialogue(beat.speaker, shownText());
      if (game.tw.done && blink()) text("▼", 236, 206, { size: 8, color: "#ffe08a" });
    } else {
      drawDialogue(beat.speaker, shownText());
      if (game.tw && game.tw.done && blink()) text("▼", 236, 206, { size: 8, color: "#ffe08a" });
    }

    if (game.mode === "fact") drawFact(beat.fact);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
