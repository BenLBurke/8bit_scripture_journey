# 8-Bit Scripture Journey

A retro, story-driven **8-bit adventure game** for teenagers, following two of
the earliest and greatest stories of the Old Testament:

- 🌈 **Joseph — The Dreamer of Egypt** (Genesis 37–50)
- 👑 **David — The Shepherd King** (1 Samuel 16 – Psalms)

It plays like a classic NES-era visual adventure: pixel-art characters, a
typewriter dialogue box, branching choices, "Did You Know?" scripture cards,
and a couple of light action mini-games — all wrapped in chiptune sound.

## ▶️ How to play

No build, no install, no internet required. Just open the game:

```bash
# from this folder, either double-click index.html, or:
python3 -m http.server 8000   # then visit http://localhost:8000
```

Then open `index.html` (or the local URL) in any modern browser.

### Controls

| Action  | Keyboard            | Touch        |
|---------|---------------------|--------------|
| Confirm / advance text | `Enter`, `Z`, `Space` | **A** button / tap screen |
| Back to menu | `Esc`, `X` | **B** button |
| Move / choose | Arrow keys | D-pad |
| Mute sound | `M` | — |

On phones and tablets, an on-screen gamepad appears automatically.

## 📖 The stories

**Joseph** — his coat of many colors, his dreams, being sold into slavery by his
brothers, serving Potiphar, resisting temptation, prison, interpreting
Pharaoh's dreams, rising to govern Egypt, and finally forgiving his brothers
(*"You meant evil… but God meant it for good."* — Genesis 50:20).

**David** — defending the flock from a lion and a bear, being anointed by
Samuel, defeating Goliath with a sling and faith, becoming king, his downfall
and repentance after Nathan's rebuke, and writing the Psalms
(*"The Lord is my shepherd."* — Psalm 23:1).

Each chapter mixes **storytelling** with **education**: choices teach right
decisions, and scripture "Did You Know?" cards give the real Bible references so
players can look them up themselves. You earn **Faith points** for wise choices
and mini-game victories; your best score per chapter is saved locally.

## 🎮 Mini-games

- **Defend the Flock** (David) — time your strike against the lion and the bear.
- **Sling of Faith** (David) — line up the sight on Goliath and loose the stone.

## 🧱 How it's built

Plain HTML5 Canvas + vanilla JavaScript — **no frameworks, no assets, no build
tooling**. Everything is generated procedurally:

| File | Purpose |
|------|---------|
| `index.html` | Page shell, canvas, touch controls |
| `css/style.css` | Retro framing + pixel-perfect scaling |
| `js/audio.js` | WebAudio chiptune sound effects (synthesized) |
| `js/sprites.js` | Pixel-art characters via re-colorable templates |
| `js/backgrounds.js` | Procedurally drawn scenes (desert, pit, Egypt, prison…) |
| `js/stories.js` | All story content, choices, and scripture facts |
| `js/engine.js` | Game loop, dialogue, choices, mini-games, scoring |

Want to add a scene or fix a verse? It's all data — edit `js/stories.js` and
add beats to a chapter's `beats` array.

---

*Built as an educational, story-first project. Scripture references are from the
Old Testament (Genesis, 1–2 Samuel, Psalms).*
