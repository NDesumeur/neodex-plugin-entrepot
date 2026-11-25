// Entrepôt : Pousse les caisses sur les marques jaunes. On ne peut que pousser, jamais tirer : 40 entrepôts faits main, du plus simple au plus dur.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Entrepôt</span><span class="hint">Flèches ou ZQSD · Retour : annuler · R : recommencer</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="224" height="176"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="enUndo">ANNULER</button><button class="btn" id="enFs">PLEIN ÉCRAN</button></div>
      <div class="row"><select id="enSet" class="f"><option value="neo">Entrepôts NeoDex (40)</option><option value="mb">Microban (128)</option></select></div>
      <div class="row"><select id="enSel" class="f"></select></div>
      <div class="hint" id="enCredit" hidden>Microban : niveaux de David W. Skinner (2000), libres de diffusion en citant l’auteur.</div>
      <div class="hint">On pousse une seule caisse à la fois. Une caisse coincée dans un coin ne ressortira plus : Retour pour annuler.</div><div class="hint">À la souris : clique à côté du personnage pour le faire avancer de ce côté.</div><div class="hint">Manette : croix ou stick pour marcher, B annuler, Y recommencer, A ou Start niveau suivant.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 560px;min-width:min(100%,340px);position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(300px,calc((100vh - 190px) * 224 / 176)));height:auto;aspect-ratio:224/176}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 224 / 176))}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "ENTREPÔT", T: {"k": "#0a0604", "k2": "#160e08", "fill": "#22160c", "fillOn": "#2e1e10", "hl": "#3a2614", "line": "#5a3a1a", "acc": "#ffd84a", "accL": "#fff4b0", "accS": "#c49a1a", "accD": "#4a3a06", "rivet": "#fff4b0", "btn": "#3a2614", "btnHi": "#6a4a24", "btnLo": "#160e08", "btnHov": "#4a3018", "btnHovHi": "#8a5e2e", "text": "#fff4e0", "muted": "#c8a880", "acc2": "#5fdf6a", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#0c0804", "bgDot": "#22160c", "bgDot2": "#160e08", "spark": "#5a3a1a", "spark2": "#5fdf6a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["kkkkkkkkkkkk", "kWWWWWWWWWWk", "kWddddddddwk", "kWdWwwwwwdwk", "kWdwWwwwddwk", "kWdwwWwdwdwk", "kWdwwdWwwdwk", "kWdwdwwWwdwk", "kWddwwwwWdwk", "kWddddddddwk", "kwwwwwwwwwwk", "kkkkkkkkkkkk"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
  // les trophées de NeoDex (3.4.8 et plus) : succès et records déclarés dans plugin.json ; sur un NeoDex plus ancien, rien ne se passe
  const trophy = id => { ctx.games?.unlock(id).catch(() => {}); };
  const trophyRecord = (id, v) => { if (v != null && Number.isFinite(+v)) ctx.games?.record(id, +v).catch(() => {}); };
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 224, H = 176, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Entrepôt : pousser les caisses sur les marques ; on pousse, on ne tire jamais. 40 niveaux faits main, rangés par difficulté et tous vérifiés par un solveur. ---------- */
const EN_LEVELS = [  // du plus simple au plus dur (nombre minimal de poussées, vérifié par un solveur : 2, 3, 4, 4, 4, 4, 4, 5, 5, 5, 7, 8, 18, 18, 18, 18, 19, 19, 19, 20, 20, 20, 20, 21, 22, 22, 23, 23, 24, 25, 25, 27, 27, 28, 28, 29, 31, 32, 34, 43)
  "  #####\n###   #\n#  $  #\n# #.# #\n# .$  #\n##  @##\n #####",
  "  ####\n###  #\n#@$  #\n### .#\n  ####",
  "######\n#    #\n# $$ #\n#@#..#\n######",
  "#######\n#.  # #\n#.$$  #\n#  @  #\n#######",
  "########\n#      #\n# $  $ #\n#.#  #.#\n#   @  #\n########",
  " ######\n #    #\n##$## #\n#  .  #\n# $@.##\n#  ###\n####",
  "  ######\n  #    #\n### $$ #\n#  .#. #\n# @ .$ #\n########",
  "#######\n#  .  #\n# $$$ #\n#.#@#.#\n#     #\n#######",
  " #######\n #  .  #\n##$$.$ #\n#  .@  #\n#      #\n########",
  "#######\n#.    #\n# $#$ #\n#.$ @.#\n#     #\n#######",
  "########\n#  .   #\n# $#$# #\n#  @   #\n# #$# .#\n#  .   #\n########",
  " #####\n #   ###\n##$#   #\n# @ $  #\n# ..#  #\n########",
  " ######\n#      #\n# $##  #\n# $  @ #\n###    #\n#..  ###\n#####",
  "##########\n#..  @   #\n# $##  $ #\n#  #   # #\n##########",
  "  #####\n  # .##\n ##  *+#\n#  $$ #\n#     #\n#   # #\n#######",
  "#######\n#.  $.#\n# #$# #\n# $   #\n# #@#.#\n#     #\n#######",
  "########\n#  @##.#\n# $$# .#\n# $    #\n# #   .#\n########",
  "#######\n#  . .#\n##$   #\n## #  #\n# $   #\n#+$   #\n#######",
  "#########\n# $   ..#\n#@$$   .#\n# $    .#\n#########",
  "  ######\n #   ###\n#.$@## #\n#.# $  #\n#      #\n#   ####\n#####",
  "#########\n#   ##  #\n#    $  #\n###$#   #\n # @.. #\n #######",
  "########\n# .  $@#\n##  $$ #\n#   # ##\n #. . ##\n #######",
  "#########\n## #  # #\n# $  $ @#\n# #   $ #\n#.   ## #\n#..  $ .#\n#########",
  "  #####\n##   ##\n# $  # #\n# # # .#\n#  $   #\n# #   +#\n ##  ###\n #####",
  " #####\n# #  ####\n#     *.#\n#    #$ #\n#  # #@ #\n#########",
  "  ####\n ##  #\n###  ###\n#@$$   #\n# $  ..#\n#. #####\n#####",
  " ########\n #     .#\n #   $###\n#@  # $ #\n# #$  # #\n##     .#\n####. ###\n#######",
  "######\n# .# #\n#  # .#\n#  $$@#\n#   $ #\n#. # ##\n#######",
  "#######\n#    .#\n# $#$.#\n#$ +$ #\n# $#$ #\n#. . .#\n#######",
  "  #######\n  #     #\n##. #$$ #\n#. ##  ##\n#  @  $##\n#.      #\n#########",
  "########\n#.#  .##\n#  $.$.#\n# @##  #\n# $  $ #\n# #   ##\n #######",
  "  #######\n # # #  #\n#@$ $   #\n#       #\n#  ######\n#    ..##\n#######",
  "##########\n#.+.     #\n#    $$$ #\n#####  ###\n  ###  #\n  ######",
  " #######\n ##   ##\n#  $  ###\n#  $$ ###\n#@$ #. ##\n# # .. .#\n #######",
  "########\n#.   $ #\n#   $$ #\n#  #$ @#\n#... ###\n#####",
  "  ######\n  #   .#\n###$   #\n#   $#.#\n#  $ #+#\n# #  ###\n ##  #\n #####",
  "   #####\n  ##   #\n####$# #\n#     $@#\n# # #   #\n#.*.    #\n#########",
  "##########\n# @ ##  .#\n# *    $ #\n#  #    ##\n# ##   ..#\n # $  $ #\n #   ## #\n ########",
  " # ####\n# ##  #\n#    $#\n#  .#@##\n## # $.#\n #     #\n #  # ##\n #####",
  "#########\n#. . #  #\n## $##  #\n#    $  #\n#   #$ .#\n#*###  @#\n#########",
];
// Microban, de David W. Skinner (2000) : 155 petits niveaux libres de diffusion en citant l’auteur ; on garde les 128 qui tiennent dans l’écran (les plus hauts tournés d’un quart de tour)
const EN_MB = ["####\n# .#\n#  ###\n#*@  #\n#  $ #\n#  ###\n####","######\n#    #\n# #@ #\n# $* #\n# .* #\n#    #\n######","  ####\n###  ####\n#     $ #\n# #  #$ #\n# . .#@ #\n#########","########\n#      #\n# .**$@#\n#      #\n#####  #\n    ####"," #######\n #     #\n # .$. #\n## $@$ #\n#  .$. #\n#      #\n########","###### #####\n#    ###   #\n# $$     #@#\n# $ #...   #\n#   ########\n#####","#######\n#     #\n# .$. #\n# $.$ #\n# .$. #\n# $.$ #\n#  @  #\n#######","      #####\n      #   #\n####  # # ##\n#  ####    #\n#.$      # #\n#.$#####   #\n#@ #   #####\n####","#####\n#.  ##\n#@$$ #\n##   #\n ##  #\n  ##.#\n   ###","      #####\n      #.  #\n      #.# #\n#######.# #\n# @ $ $ $ #\n# # # # ###\n#       #\n#########","  ######\n  #    #\n  # ##@##\n### # $ #\n# ..# $ #\n#       #\n#  ######\n####","#####\n#   ##\n# $  #\n## $ ####\n ###@.  #\n  #  .# #\n  #     #\n  #######","####\n#. ##\n#.@ #\n#. $#\n##$ ###\n # $  #\n #    #\n #  ###\n ####","#######\n#     #\n# # # #\n#. $*@#\n#   ###\n#####","     ###\n######@##\n#    .* #\n#   #   #\n#####$# #\n    #   #\n    #####"," ####\n #  ####\n #     ##\n## ##   #\n#. .# @$##\n#   # $$ #\n#  .#    #\n##########","#####\n# @ #\n#...#\n#$$$##\n#    #\n#    #\n######","#######\n#     #\n#. .  #\n# ## ##\n#  $ #\n###$ #\n  #@ #\n  #  #\n  ####","########\n#   .. #\n#  @$$ #\n##### ##\n   #  #\n   #  #\n   #  #\n   ####","#######\n#     ###\n#  @$$..#\n#### ## #\n  #     #\n  #  ####\n  #  #\n  ####","####\n#  ####\n# . . #\n# $$#@#\n##    #\n ######","#####\n#   ###\n#. .  #\n#   # #\n## #  #\n #@$$ #\n #    #\n #  ###\n ####","#######\n#  *  #\n#     #\n## # ##\n #$@.#\n #   #\n #####","# #####\n  #   #\n###$$@#\n#   ###\n#     #\n# . . #\n#######"," ####\n #  ###\n # $$ #\n##... #\n#  @$ #\n#   ###\n#####"," #####\n # @ #\n #   #\n###$ #\n# ...#\n# $$ #\n###  #\n  ####","######\n#   .#\n# ## ##\n#  $$@#\n# #   #\n#.  ###\n#####","#####\n#   #\n# @ #\n# $$###\n##. . #\n #    #\n ######","     #####\n     #   ##\n     #    #\n ######   #\n##     #. #\n# $ $ @  ##\n# ######.#\n#        #\n##########","####\n#  ###\n# $$ #\n#... #\n# @$ #\n#   ##\n#####","  ####\n ##  #\n##@$.##\n# $$  #\n# . . #\n###   #\n  #####"," ####\n##  ###\n#     #\n#.**$@#\n#   ###\n##  #\n ####","#######\n#. #  #\n#  $  #\n#. $#@#\n#  $  #\n#. #  #\n#######","  ####\n###  ####\n#       #\n#@$***. #\n#       #\n#########","  ####\n ##  #\n #. $#\n #.$ #\n #.$ #\n #.$ #\n #. $##\n #   @#\n ##   #\n  #####","      ###\n##### #.#\n#   ###.#\n#   $ #.#\n# $  $  #\n#####@# #\n    #   #\n    #####","##########\n#        #\n# ##.### #\n# # $$ . #\n# . @$## #\n#####    #\n    ######","#####\n#   ####\n# # # .#\n#    $ ###\n### #$.  #\n#   #@   #\n# # ######\n#   #\n#####"," #####\n #   #\n##   ##\n# $$$ #\n# .+. #\n#######","#######\n#     #\n#@$$$ ##\n#  #...#\n##    ##\n ######","   ####\n   #  #\n   #@ #\n####$.#\n#   $.#\n# # $.#\n#    ##\n######","     ####\n     # @#\n     #  #\n###### .#\n#   $  .#\n#  $$# .#\n#    ####\n###  #\n  ####","#####\n#@$.#\n#####","######\n#... #\n#  $ #\n# #$##\n#  $ #\n#  @ #\n######"," ######\n##    #\n#  ## #\n# # $ #\n#  * .#\n## #@##\n #   #\n #####","  #######\n###     #\n# $ $   #\n# ### #####\n# @ . .   #\n#   ###   #\n##### #####","######\n#  @ #\n#  # ##\n# .#  ##\n# .$$$ #\n# .#   #\n####   #\n   #####","######\n# @  #\n# $# #\n# $  #\n# $ ##\n### ####\n #  #  #\n #...  #\n #     #\n #######","  ####\n###  #####\n#  $  @..#\n# $    # #\n### #### #\n  #      #\n  ########","####\n#  ###\n#    ###\n#  $*@ #\n### .# #\n  #    #\n  ######","  ####\n### @#\n#  $ #\n#  *.#\n#  *.#\n#  $ #\n###  #\n  ####"," #####\n##. .##\n# * * #\n#  #  #\n# $ $ #\n## @ ##\n #####","      ######\n      #    #\n  ##### .  #\n###  ###.  #\n# $  $  . ##\n# @$$ # . #\n##    #####\n ######","########\n# @ #  #\n#      #\n#####$ #\n    #  ###\n ## #$ ..#\n ## #  ###\n    ####","#####\n#   ###\n#  $  #\n##* . #\n #   @#\n ######","  ####\n  #  #\n  #@ #\n  #  #\n### ####\n#    * #\n#  $   #\n#####. #\n    ####","####\n#  ####\n#.*$  #\n# .$# #\n## @  #\n #   ##\n #####","############\n#          #\n# ####### @##\n# #         #\n# #  $   #  #\n# $$ #####  #\n###  # # ...#\n  #### #    #\n       ######"," #########\n #       #\n##@##### #\n#  #   # #\n#  #   $.#\n#  ##$##.#\n##$##  #.#\n#   $  #.#\n#   #  ###\n########","########\n#      #\n# #### #\n# #...@#\n# ###$###\n# #     #\n#  $$ $ #\n####   ##\n   #.###\n   ###","   ##########\n####    ##  #\n#  $$$....$@#\n#      ###  #\n#   #### ####\n#####"," ######\n##    #\n#   $ #\n#  $$ #\n### .#####\n  ##.# @ #\n   #.  $ #\n   #. ####\n   ####","  ######\n  #    #\n  #  $ #\n ####$ #\n## $ $ #\n#....# ##\n#     @ #\n##  #   #\n ########","   #######\n  ##     ##\n  #  ###  ####\n### #   #$.  #\n#@$.         #\n### #   #$.  #\n  #  ###  ####\n  ##     ##\n   #######","#####\n#   ##\n# #  #\n#@$*.##\n##  . #\n # $# #\n ##   #\n  #####"," ####\n #  ######\n##    $  #\n# .# $   #\n# .#$#####\n# .@ #\n######","####  ####\n#  ####  #\n#  #  #  #\n#  #    $##\n#  . .#$  #\n#@ ## # $ #\n#   . #   #\n###########","#####\n# @ ####\n#      #\n# $ $$ #\n##$##  #\n#   ####\n# ..  #\n##..  #\n ###  #\n   ####","###########\n#     #   ###\n# $@$ # .  .#\n# ## ### ## #\n# #       # #\n# #   #   # #\n# ######### #\n#           #\n#############","    #######\n ####     #\n##  #  .  #\n#   ## ..##\n# $$   ###\n## ## $ #\n #  #   #\n #@ #####\n #  #\n ####","####\n#  #####\n# $$ $ #\n#      #\n## ## ##\n#...#@#\n# ### ##\n#      #\n#  #   #\n########"," ####\n #  #######\n #$ @#   .#\n## #$$   .#\n#  $  ##..#\n#   # #####\n###   #\n  #####"," #######\n## ....##\n#   ######\n#   $ $ @#\n###  $ $ #\n  ###    #\n    ######"," #######\n##  @  ##\n#       ###\n#  ###    #\n#  ... #  #\n######## ##\n  #    $ #\n  # $  $ #\n  #  #####\n  ####","##########\n# @ .... #\n#   ####$##\n## #  $ $ #\n # $      #\n #   ######\n #####"," #######\n##     ##\n#  $ $  #\n# $ $ $ #\n## ### ####\n #@  .....#\n ##     ###\n  #######"," #########\n #    #  #\n## $#$#  #\n#  .$.@  #\n#  .#    #\n##########","#####\n#   ###\n#  $  #####\n##.## #   #\n #  # #@$ #\n ##    $$ #\n ## ###   #\n #     ####\n #...  #\n #######"," #####\n #   #\n # . #\n## * #\n#  *##\n#  @##\n## $ #\n #   #\n #####","#####\n#   ###\n# .   ##\n##*#$  #\n# .# $ #\n# @## ##\n#     #\n#######","######\n#    ##\n# $ $ ##\n## $$  #\n # #   #\n # ## ##\n #  . .#\n # @. .#\n #  ####\n ####","########\n#  ... #\n#  ### ##\n#  # $  #\n## #@$  #\n # # $  #\n # ### #####\n #         #\n #   ###   #\n ##### #####","    ####\n  ###  ##\n ## $   #\n## $  # #\n# @#$$  #\n# ..  ###\n# ..###\n#####","     ####\n######  #\n#       #\n#  ... .#\n##$######\n# $  #\n#   $###\n##  $  #\n ## @  #\n  ######","##########\n#   ##   #\n# $  $@# #\n#### # $ #\n   #.#  ##\n # #.# $#\n # #.   #\n # #.   #\n   ######"," ########\n #  @   #\n # $  $ #\n### ## ###\n#  $..$  #\n#   ..   #\n##########","###########\n#    .##  #\n# $$@..$$ #\n#   ##.   #\n###########","#########\n# @ #   #\n# $ $   #\n##$### ##\n#  ...  #\n#   #   #\n######  #\n     ####","########\n#@     #\n# .$$. #\n# $..$ #\n# $..$ #\n# .$$. #\n#      #\n########","   ####\n   #  ########\n#### $ $.....#\n#   $   ######\n#@### ###\n#  $  #\n# $ # #\n## #  #\n #    #\n ######","#######\n# @#  #\n#.$   #\n#. # $##\n#.$#   #\n#. # $ #\n#  #   #\n########","###########\n#....#    #\n#  #   $$ #\n#  @  ##  #\n#     ##$ #\n######  $ #\n     #    #\n     ######","  #####\n  # . ##\n### $  #\n# . $#@#\n# #$ . #\n#  $ ###\n## . #\n #####","    #####\n#####   #\n#    $  #\n#  $#$#@#\n### #   #\n  # ... #\n  ###  ##\n    #  #\n    ####"," ########\n #      #\n #@   $ #\n## ###$ #\n# .....###\n# $ $ $  #\n###### # #\n     #   #\n     #####","########\n#      #\n# $*** #\n# *  * #\n# *  * #\n# ***. #\n#     @#\n########"," ## #### ####\n    #  ## ###\n##### $ ## ##\n#      $ ##\n# #@##  $ ###\n#   ###  $  #\n# #$#### ## #\n#     ..... #\n#############","  ####\n  #  #\n  # $####\n###. .  #\n# $ # $ #\n#  . .###\n####$ #\n   # @#\n   ####","#####\n#   #\n#   ######\n#   #    ###\n#   # $@$  #\n##..##$$$$ #\n #..     # #\n #..  #    #\n ###########"," #####\n##   # ######\n#  # ###    #\n# $    # @  #\n# $ $  # .  #\n##$ #####. ##\n # $#.   .  #\n #     ##.  #\n ####  ######\n    ####","######\n#    ###\n#  # $ #\n#  $ @ #\n## ## #####\n#  #......#\n# $ $ $ $ #\n##   ######\n #####","    #####\n#####   ####\n#     #    #\n#  #.....  #\n##  ## # ###\n #$$@$$$ #\n #     ###\n #######","     #####\n   ###   #\n####.....#\n# @$$$$$ #\n#     # ##\n#####   #\n    #####"," #### ####\n #  ###  ##\n #      @ #\n##..###   #\n#      #  #\n#...#$  # #\n# ## $$ $ #\n#  $    ###\n####  ###\n   ####"," #####\n##   ##\n#  $  ##\n# $ $  ##\n###$# . ##\n  # # .  #\n ## ##.  #\n # @  . ##\n #   #  #\n ########","  ######\n  #    ##\n ## ##  #\n # $$ # #\n # @$ # #\n #    # #\n#### #  #\n#  ... ##\n#     ##\n#######","##############\n#      #     #\n# $@$$ # . ..#\n## ## ### ## #\n # #       # #\n # #   #   # #\n # ######### #\n #           #\n #############","      #####\n      #   ##\n      # $  #\n######## #@##\n# .  # $ $  #\n#        $# #\n#...#####   #\n#####   #####"," ###########\n##.......  #\n# $$$$$$$@ #\n#   # # # ##\n# # #     #\n#   #######\n#####","## ####\n####  ####\n # $ $.  #\n## #  .$ #\n#   ##.###\n#  $  . #\n# @ #   #\n#  ######\n####","  #########\n###   #   #\n# * $ . . #\n#   $ ## ##\n####*#   #\n #  @  ###\n #   ###\n #####","  #########\n### @ #   #\n# * $ *.. #\n#   $ #   #\n####*#  ###\n #     ##\n #   ###\n #####","#####  #####\n#   ####.. #\n# $$$      #\n#   $#  .. #\n### @#  ## #\n  #  ##    #\n  ##########","########\n#  .#  ####\n# .@. $$  #\n#  .#$ $  #\n####    ###\n   #    #\n   ######","####\n# @###\n#.*  #####\n#..#$$ $ #\n##       #\n # # ##  #\n #   #####\n #####"," #######\n #  . .###\n # . . . #\n### #### #\n#  @$  $ #\n#  $$  $ #\n####   ###\n   #####","        ####\n#########  #\n#   ## $   #\n#  $   ##  #\n### #. .# ##\n  # #. .#$##\n  # #   #  #\n  # @ $    #\n  #  #######\n  ####","#######\n#     #####\n# $$#@##..#\n# #       #\n#  $ # #  #\n#### $  ..#\n   ########"," #######\n #     #\n## ###$##\n#.$   @ #\n# .. #$ #\n#.##  $ #\n#    ####\n######","       ####\n      ##  ###\n####  #  $  #\n#  #### $ $ #\n#   ..# #$  #\n#  #   @  ###\n## #..# ###\n # ## # #\n #      #\n ########","######## #####\n#  #   ###   #\n#      ## $  #\n#.# @ ## $  ##\n#.#   # $  ##\n#.#    $  ##\n#. ## #####\n##    #\n ######","  ########\n  #  # . #\n  #   .*.#\n  #  # * #\n####$##.##\n#      $ #\n# $ ## $ #\n#   @#   #\n##########","  ####\n  #  #\n  #  ####\n###$.$  #\n#  .@.  #\n#  $.$###\n####  #\n   #  #\n   ####"," #######\n##  .  ##\n# .$$$. #\n# $. .$ #\n#.$ @ $.#\n# $. .$ #\n# .$$$. #\n##  .  ##\n #######","       #####\n########   #\n#.   .  @#.#\n#  ###     #\n## $  #    #\n # $   #####\n # $#  #\n ## #  #\n  #   ##\n  #####"," ###\n##@#########\n# $#   #   #\n#       $  #\n## $#$### ##\n #  #.    #\n ####.#####\n    #.#\n    #.#\n    ###","   ####\n   #  #\n ###  #\n##  $ #\n#   # #\n# #$$ ######\n# #   #   .#\n#  $  @   .#\n###  ####..#\n  ####  ####","#############\n#.# @#  #   #\n#.#$$   # $ #\n#.#  # $#   #\n#.# $#  # $##\n#.#  # $#  #\n#.# $#  # $#\n#..  # $   #\n#..  #  #  #\n############"];
const EN_MB_N = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,86,87,89,90,91,94,95,97,100,102,103,104,106,107,109,110,111,112,114,115,116,117,118,119,124,125,126,127,128,129,130,131,132,133,134,135,136,137,140,141,142,146,147,149,151,153];  // numéros d’origine des niveaux Microban
const EN_OLD = [1, 2, 3, 11, 10, 7, 0, 4, 5, 8, 6, 9];  // où sont passés les 12 premiers entrepôts (pour garder les niveaux déjà finis)
const EN_T = 16;
const EN_PAL = {k: '#140a04', w: '#c88a4a', W: '#e8b070', d: '#8a5428', D: '#5a3418', y: '#ffd84a', Y: '#fff4b0', g: '#5fdf6a', s: '#ffd0a8', b: '#3f6aff', B: '#2a4aa0', r: '#ff4a5a', h: '#5a3418', e: '#ffffff'};
const EN_CRATE = ['kkkkkkkkkkkkkk', 'kWWWWWWWWWWWWk', 'kWddddddddddwk', 'kWdWwwwwwwwdwk', 'kWdwWwwwwwddwk', 'kWdwwWwwwdwdwk', 'kWdwwwWwdwwdwk', 'kWdwwwwdWwwdwk', 'kWdwwwdwwWwdwk', 'kWdwwdwwwwWdwk', 'kWdwdwwwwwwWwk', 'kWddddddddddwk', 'kwwwwwwwwwwwDk', 'kkkkkkkkkkkkkk'];
const EN_SPR = {
  crate: spr(EN_CRATE, EN_PAL), crateOk: spr(EN_CRATE, {...EN_PAL, w: '#e8c050', W: '#fff0a0', d: '#a07a18', D: '#6a5010'}),
  down: [spr(['...kkkkkk...', '..krrrrrrk..', '.krrrrrrrrk.', '.kkkkkkkkkk.', '..kssssssk..', '..kskssksk..', '..kssssssk..', '...kkkkkk...', '..kbbbbbbk..', '.kbbbbbbbbk.', '.ksbbbbbbsk.', '..kBBkkBBk..', '..kBk..kBk..', '..kkk..kkk..'], EN_PAL),
         spr(['...kkkkkk...', '..krrrrrrk..', '.krrrrrrrrk.', '.kkkkkkkkkk.', '..kssssssk..', '..kskssksk..', '..kssssssk..', '...kkkkkk...', '..kbbbbbbk..', '.kbbbbbbbbk.', '.ksbbbbbbsk.', '..kBBkkBBk..', '..kBk..kkk..', '..kkk.......'], EN_PAL)],
  up: [spr(['...kkkkkk...', '..krrrrrrk..', '.krrrrrrrrk.', '.krrrrrrrrk.', '..khhhhhhk..', '..khhhhhhk..', '..khhhhhhk..', '...kkkkkk...', '..kbbbbbbk..', '.kbbbbbbbbk.', '.ksbbbbbbsk.', '..kBBkkBBk..', '..kBk..kBk..', '..kkk..kkk..'], EN_PAL),
       spr(['...kkkkkk...', '..krrrrrrk..', '.krrrrrrrrk.', '.krrrrrrrrk.', '..khhhhhhk..', '..khhhhhhk..', '..khhhhhhk..', '...kkkkkk...', '..kbbbbbbk..', '.kbbbbbbbbk.', '.ksbbbbbbsk.', '..kBBkkBBk..', '..kkk..kBk..', '.......kkk..'], EN_PAL)],
  side: [spr(['...kkkkkk...', '..krrrrrrk..', '.krrrrrrrrkk', '.kkkkkkkkkk.', '..kssssssk..', '..ksssskssk.', '..kssssssk..', '...kkkkkk...', '...kbbbbk...', '..kbbbbbbk..', '..kbbsbbbk..', '...kBBBBk...', '...kBkkBk...', '...kkk.kkk..'], EN_PAL),
         spr(['...kkkkkk...', '..krrrrrrk..', '.krrrrrrrrkk', '.kkkkkkkkkk.', '..kssssssk..', '..ksssskssk.', '..kssssssk..', '...kkkkkk...', '...kbbbbk...', '..kbbbbbbk..', '..kbbsbbbk..', '...kBBBBk...', '..kBk..kBk..', '..kkk..kkk..'], EN_PAL)],
};
const EN_TILE = {
  floor: cnv(16, 16, b => { px(b, '#4a3424', 0, 0, 16, 16); for (let y = 0; y < 16; y += 4) { px(b, '#3a2618', 0, y, 16, 1); px(b, '#563e2c', 0, y + 1, 16, 1); px(b, '#3a2618', (y * 5) % 16, y, 1, 4); } }),
  wall: cnv(16, 16, b => { px(b, '#2a1414', 0, 0, 16, 16); for (let r = 0; r < 4; r++) for (let c = -1; c < 3; c++) { const x = c * 8 + (r % 2) * 4, y = r * 4; px(b, '#7a3a34', x + 1, y + 1, 7, 3); px(b, '#9a5048', x + 1, y + 1, 7, 1); px(b, '#5a2a26', x + 1, y + 3, 7, 1); } }),
  goal: cnv(16, 16, b => { for (let k = 3; k < 13; k++) { px(b, '#ffd84a', k, k); px(b, '#ffd84a', 15 - k, k); px(b, '#b08a10', k + 1, k); px(b, '#b08a10', 16 - k, k); } }),
};
const ens = gstore('entrepot', {level: 0, top: 0, best: {}, v: 2}); ens.rand ??= 0;
ens.mb ??= {level: 0, top: 0, best: {}}; ens.set ??= 'neo';
const enS = () => ens.set === 'mb' ? ens.mb : ens, enL = () => ens.set === 'mb' ? EN_MB : EN_LEVELS;
const enName = i => ens.set === 'mb' ? 'Microban ' + EN_MB_N[i] : 'Niveau ' + (i + 1);
if (ens.v !== 2) { const b = {}; for (const [k, v] of Object.entries(ens.best)) if (EN_OLD[k] != null) b[EN_OLD[k]] = v; ens.best = b; ens.top = Math.max(0, ...EN_OLD.filter((_, i) => i <= ens.top)); ens.level = EN_OLD[ens.level] ?? 0; ens.v = 2; }
function enRandom() {  // un entrepôt au hasard, construit à l'envers : les caisses partent des marques et le magasinier les TIRE, donc on peut toujours les y repousser
  const D = [[1, 0], [-1, 0], [0, 1], [0, -1]], w = 9, h = 8, nb = 2 + (Math.random() < .55);
  for (;;) {
    const wall = new Set(), floors = [];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { if (x === 0 || y === 0 || x === w - 1 || y === h - 1 || Math.random() < .2) wall.add(x + ',' + y); else floors.push([x, y]); }
    if (floors.length < 22) continue;
    const seen = new Set(), q = [floors[0].join()]; while (q.length) { const k = q.pop(); if (seen.has(k) || wall.has(k)) continue; seen.add(k); const [x, y] = k.split(',').map(Number); for (const [dx, dy] of D) q.push((x + dx) + ',' + (y + dy)); }
    if (seen.size !== floors.length) continue;  // tout le sol doit se tenir d'un seul morceau
    floors.sort(() => Math.random() - .5);
    const goals = floors.slice(0, nb).map(c => c.join()), boxes = floors.slice(0, nb).map(c => [...c]); let p = [...floors[nb]], pulls = 0;
    const boxAt = (x, y) => boxes.findIndex(b => b[0] === x && b[1] === y);
    for (let i = 0; i < 700; i++) {
      const [dx, dy] = D[Math.floor(Math.random() * 4)], nx = p[0] + dx, ny = p[1] + dy; if (wall.has(nx + ',' + ny) || boxAt(nx, ny) >= 0) continue;
      const bi = boxAt(p[0] - dx, p[1] - dy); if (bi >= 0 && Math.random() < .65) { boxes[bi] = [...p]; pulls++; } p = [nx, ny];
    }
    if (pulls < 12 || boxes.some(b => goals.includes(b.join()))) continue;
    const rows = []; for (let y = 0; y < h; y++) { let r = ''; for (let x = 0; x < w; x++) { const k = x + "," + y, go = goals.includes(k), b = boxAt(x, y) >= 0, me = p[0] === x && p[1] === y; r += wall.has(k) ? "#" : b ? (go ? '*' : '$') : me ? (go ? "+" : "@") : go ? "." : " "; } rows.push(r); }
    return rows.join('\n');
  }
}
const enNext = () => enLoad(en.i < 0 ? -1 : Math.min(enL().length - 1, enS().level + 1));
let en = null;
function enLoad(i = enS().level, src = i < 0 ? enRandom() : enL()[i]) {
  if (i >= 0) enS().level = i; saveGames(); const rows = src.split('\n').filter(r => r.trim()), wd = Math.max(...rows.map(r => r.length));
  const walls = new Set(), goals = new Set(), boxes = []; let p = null;
  rows.forEach((r, y) => [...r].forEach((c, x) => { const k = x + ',' + y; if (c === '#') walls.add(k); if ('.*+'.includes(c)) goals.add(k); if ('$*'.includes(c)) boxes.push([x, y]); if ('@+'.includes(c)) p = [x, y]; }));
  const inside = new Set(), q = [p.join(',')]; while (q.length) { const k = q.pop(); if (inside.has(k) || walls.has(k)) continue; inside.add(k); const [x, y] = k.split(',').map(Number); if (x < 0 || y < 0 || x >= wd || y >= rows.length) continue; q.push((x + 1) + ',' + y, (x - 1) + ',' + y, x + ',' + (y + 1), x + ',' + (y - 1)); }  // le sol, seulement à l'intérieur des murs
  en = Object.assign(en || {tick: 0, raf: 0}, {mode: 'play', anim: null, i, src, w: wd, h: rows.length, walls, goals, inside, boxes, p, dir: 'down', flip: false, step: 0, moves: 0, pushes: 0, hist: [], wonAt: 0});
  enInfo();
}
const enBox = (x, y) => en.boxes.findIndex(([a, b]) => a === x && b === y);
function enMove(dx, dy) {
  if (en.mode !== 'play') return;
  en.dir = dy > 0 ? 'down' : dy < 0 ? 'up' : 'side'; en.flip = dx < 0;
  const nx = en.p[0] + dx, ny = en.p[1] + dy; if (en.walls.has(nx + ',' + ny)) return;
  const bi = enBox(nx, ny);
  if (bi >= 0) { const bx = nx + dx, by = ny + dy; if (en.walls.has(bx + ',' + by) || enBox(bx, by) >= 0) return beep(120, .05); en.hist.push({p: en.p, b: en.boxes.map(b => [...b]), m: en.moves, u: en.pushes}); en.boxes[bi] = [bx, by]; en.pushes++; beep(150, .11, 'sawtooth', 70, .035); beep(95, .09, 'square', 60, .025); if (en.goals.has(bx + ',' + by)) setTimeout(() => beep(880, .08, 'triangle', 0, .06), 90); }
  else en.hist.push({p: en.p, b: en.boxes.map(b => [...b]), m: en.moves, u: en.pushes});
  en.anim = {t: performance.now(), dx, dy, bi};
  en.p = [nx, ny]; en.moves++; en.step++;
  if (en.boxes.every(([x, y]) => en.goals.has(x + ',' + y))) {
    en.mode = 'won'; en.wonAt = en.tick;
    if (en.i < 0) ens.rand++; else { const S = enS(), b = S.best[S.level]; if (!b || en.moves < b) S.best[S.level] = en.moves; if (S.level >= S.top) S.top = Math.min(enL().length - 1, S.level + 1); } saveGames(); enInfo(); [523, 659, 784, 1047].forEach((f, k) => setTimeout(() => beep(f, .15, 'triangle'), k * 100));
  }
}
function enUndo() { const h = en.hist.pop(); if (!h || en.mode !== 'play') return; en.p = h.p; en.boxes = h.b; en.moves = h.m; en.pushes = h.u; en.anim = null; beep(330, .04); }
function enDraw() {
  px(g, '#140a04', 0, 0, W, H);
  const ox = Math.floor((W - en.w * EN_T) / 2), oy = Math.floor((H - 14 - en.h * EN_T) / 2) + 14;
  for (let y = 0; y < en.h; y++) for (let x = 0; x < en.w; x++) { const k = x + ',' + y, X = ox + x * EN_T, Y = oy + y * EN_T; if (en.walls.has(k)) g.drawImage(EN_TILE.wall, X, Y); else if (en.inside.has(k)) { g.drawImage(EN_TILE.floor, X, Y); if (en.goals.has(k)) g.drawImage(EN_TILE.goal, X, Y); } }
  const A = en.anim, k = A ? Math.max(0, 1 - (performance.now() - A.t) / 110) : 0, sx = A ? -A.dx * EN_T * k : 0, sy = A ? -A.dy * EN_T * k : 0;  // le reste du glissement
  en.boxes.forEach(([x, y], i) => { const ok = en.goals.has(x + ',' + y) && !(A && A.bi === i && k > 0), mx = A && A.bi === i ? sx : 0, my = A && A.bi === i ? sy : 0; px(g, 'rgba(0,0,0,.35)', ox + x * EN_T + 2 + mx, oy + y * EN_T + 14 + my, 14, 2); g.drawImage(ok ? EN_SPR.crateOk : EN_SPR.crate, Math.round(ox + x * EN_T + 1 + mx), Math.round(oy + y * EN_T + my)); });
  const fr = EN_SPR[en.dir][en.step % 2], X = Math.round(ox + en.p[0] * EN_T + 2 + sx), Y = Math.round(oy + en.p[1] * EN_T + 1 + sy);
  if (en.flip) { g.save(); g.translate(X + 12, Y); g.scale(-1, 1); g.drawImage(fr, 0, 0); g.restore(); } else g.drawImage(fr, X, Y);
  px(g, '#2a1408', 0, 0, W, 13); px(g, '#5a3418', 0, 13, W, 1);
  pxFont(g, en.i < 0 ? 'AU HASARD' : ens.set === 'mb' ? 'MICROBAN ' + EN_MB_N[ens.mb.level] : 'NIVEAU ' + (ens.level + 1) + ' / ' + EN_LEVELS.length, 5, 10, '#ffd84a', 7); pxFont(g, en.moves + ' pas · ' + en.pushes + (en.pushes > 1 ? ' poussées' : ' poussée'), W - 5, 10, '#e8b070', 6, 'right');
  if (en.mode === 'won' && en.tick - en.wonAt > 30) gameText(g, W, [['RANGÉ !', '#ffd84a', 12], [en.moves + ' pas', '#ffffff'], [en.i < 0 ? 'Clic ou Entrée : un autre au hasard' : enS().level < enL().length - 1 ? 'Clic ou Entrée : niveau suivant' : 'Tous les niveaux sont faits !', '#e8b070']], 80);
}
document.addEventListener('keydown', e => {
  if (!keyOk(e) || !en) return; const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const d = {ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], z: [0, -1], s: [0, 1], q: [-1, 0], d: [1, 0]}[k];
  if (d) { e.preventDefault(); enMove(...d); }
  if (k === 'Backspace' || k === 'u') { e.preventDefault(); enUndo(); }
  if (k === 'r') enLoad(en.i, en.src);
  if (k === 'Enter' && en.mode === 'won') enNext();
});
cv.onpointerdown = e => {  // à la souris : un clic à côté du personnage le fait avancer dans cette direction
  e.preventDefault(); if (!en) return; if (en.mode === 'won') { if (en.tick - en.wonAt > 30) enNext(); return; }
  const [x, y] = cpos(e), ox = Math.floor((W - en.w * EN_T) / 2), oy = Math.floor((H - 14 - en.h * EN_T) / 2) + 14, dx = (x - ox) / EN_T - en.p[0] - .5, dy = (y - oy) / EN_T - en.p[1] - .5;
  if (Math.abs(dx) > Math.abs(dy)) enMove(Math.sign(dx), 0); else enMove(0, Math.sign(dy));
};
function enInfo() {
  setTimeout(enTrophies);
  const S = enS();
  showStats([['Niveaux finis', Object.keys(S.best).length + ' / ' + enL().length], ['Au hasard', ens.rand], ['Record sur ce niveau', en.i >= 0 && S.best[S.level] ? S.best[S.level] + ' pas' : '-']]);
  const rnd = el('option', '', 'Au hasard (nouveau à chaque fois)'); rnd.value = -1;
  $('enSel').replaceChildren(rnd, ...enL().map((_, i) => { const o = el('option', '', enName(i) + (S.best[i] ? ' ✓' : '')); o.value = i; o.disabled = i > S.top; return o; })); $('enSel').value = en.i < 0 ? -1 : S.level;
  $('enSet').value = ens.set; $('enCredit').hidden = ens.set !== 'mb';
}
$('enSel').onchange = () => { enLoad(+$('enSel').value); $('enSel').blur(); };
$('enSet').onchange = () => { ens.set = $('enSet').value === 'mb' ? 'mb' : 'neo'; enLoad(enS().level); $('enSet').blur(); };
$('enUndo').onclick = () => { enUndo(); $('enUndo').blur(); };
$('gNew').onclick = () => { enLoad(en.i); $('gNew').blur(); };
$('enFs').onclick = () => { $('enFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
{  // la manette : croix ou stick (maintenu : le pas se répète), B annuler (se répète aussi), Y recommencer, A ou Start niveau suivant
  let prev = [], hold = 0, last = '';
  const loop = () => {
    requestAnimationFrame(loop);
    const p = [...(navigator.getGamepads?.() || [])].find(Boolean);
    if (!p || !en || !view.classList.contains('on')) { prev = []; hold = 0; last = ''; return; }
    const now = p.buttons.map(b => b.pressed), was = prev, ax = p.axes[0] || 0, ay = p.axes[1] || 0; prev = now;
    const dir = now[12] || ay < -.5 ? 'u' : now[13] || ay > .5 ? 'd' : now[14] || ax < -.5 ? 'l' : now[15] || ax > .5 ? 'r' : now[1] ? 'b' : '';
    if (dir !== last) { last = dir; hold = 0; } else hold++;
    if (dir && (hold === 0 || hold >= 16 && (hold - 16) % 8 === 0)) { if (dir === 'b') enUndo(); else enMove(...{u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0]}[dir]); }
    if (now[3] && !was[3]) enLoad(en.i, en.src);
    if ((now[0] && !was[0] || now[9] && !was[9]) && en.mode === 'won' && en.tick - en.wonAt > 30) enNext();
  };
  requestAnimationFrame(loop);
}
function enCheck() {  // vérification : une poussée finit un petit entrepôt, un mur arrête, annuler revient ; les 40 niveaux sont bien formés et tiennent dans l'écran
  const keep = en, kl = ens.level, kb = {...ens.best}, kt = ens.top, kr = ens.rand, km = JSON.stringify(ens.mb), ks = ens.set, bad = [], vol = actx; actx = {currentTime: 0, createOscillator: () => { throw 0; }};
  en = null; enLoad(-1, '######\n#@ $.#\n######');
  enMove(-1, 0); if (en.moves !== 0) bad.push('mur'); enMove(1, 0); enUndo(); if (en.moves !== 0 || en.p[0] !== 1) bad.push('annuler');
  enMove(1, 0); enMove(1, 0); if (en.mode !== 'won' || en.pushes !== 1 || !en.anim || en.anim.bi !== 0) bad.push('poussée');
  const cnt = (r, re) => (r.match(re) || []).length;
  EN_LEVELS.forEach((l, i) => { const rows = l.split('\n'); if (cnt(l, /[$*]/g) !== cnt(l, /[.*+]/g) || cnt(l, /[@+]/g) !== 1 || rows.length > 10 || Math.max(...rows.map(r => r.length)) > 14) bad.push('niveau ' + (i + 1)); });
  EN_MB.forEach((l, i) => { const rows = l.split('\n'); if (cnt(l, /[$*]/g) !== cnt(l, /[.*+]/g) || cnt(l, /[@+]/g) !== 1 || rows.length > 10 || Math.max(...rows.map(r => r.length)) > 14) bad.push('microban ' + EN_MB_N[i]); });
  if (EN_MB.length !== EN_MB_N.length || EN_MB.length < 120 || new Set(EN_MB_N).size !== EN_MB_N.length) bad.push('liste microban');
  ens.set = 'mb'; ens.mb = {level: 3, top: 3, best: {}}; enLoad(); if (en.src !== EN_MB[3] || enName(3) !== 'Microban ' + EN_MB_N[3]) bad.push('collection');
  { const S = enS(); S.best[S.level] = 9; S.top = Math.max(S.top, S.level + 1); } if (ens.mb.top !== 4 || ens.best[3] === 9) bad.push('progression séparée');
  ens.set = 'neo'; enLoad(0); if (en.src !== EN_LEVELS[0]) bad.push('retour collection');
  if (new Set(EN_LEVELS).size !== EN_LEVELS.length || EN_LEVELS.length !== 40 || EN_OLD.length !== 12 || new Set(EN_OLD).size !== 12) bad.push('liste');
  const rs = Array.from({length: 15}, enRandom);  // les entrepôts au hasard : autant de caisses que de marques, un seul magasinier
  if (!rs.every(r => cnt(r, /[$*]/g) === cnt(r, /[.*+]/g) && cnt(r, /[@+]/g) === 1 && cnt(r, /\$/g) >= 2)) bad.push('hasard');
  actx = vol; en = keep; ens.level = kl; ens.best = kb; ens.top = kt; ens.rand = kr; ens.mb = JSON.parse(km); ens.set = ks;
  return bad.length ? bad.join(', ') : 'ok';
}
{ const c = enCheck(); console.assert(c === 'ok', 'entrepôt', c); }
cv.__en = {st: () => en, ens: () => ens, check: enCheck, load: (i, src) => enLoad(i, src), N: EN_LEVELS.length, MB: EN_MB.length};
// les trophées, tirés des statistiques et des records gardés (aussi à l'ouverture : ce qui a été fait avant compte)
function enTrophies() {
  const n = Object.keys(ens.best || {}).length, sig = [n, ens.rand].join(); if (sig === enTrophies.sig) return; enTrophies.sig = sig;
  trophyRecord('finis', n || null); trophyRecord('hasard', ens.rand || null);
  if (n >= 1) trophy('premier'); if (n >= 10) trophy('dix'); if (n >= 20) trophy('vingt'); if (n >= EN_LEVELS.length) trophy('tous');
  if (ens.rand >= 1) trophy('hasard'); if (ens.rand >= 10) trophy('hasard10');
}
ctx.onOpen(() => { if (!en) enLoad(); gameLoop(en, 'entrepot', () => {}, enDraw); enInfo(); });

}
