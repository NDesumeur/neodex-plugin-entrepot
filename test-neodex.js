// lancé par le test « local » de NeoDex : la vérification interne, une poussée animée au clavier, annuler, un entrepôt fini,
// la manette (marcher, annuler, recommencer), le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('gc').__en, en = T.st(); ${code} })()`);
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'entrepot-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  const keep = await C('return JSON.stringify(T.ens());');
  // le premier niveau, puis le dernier pour la capture
  await C('T.load(0); return 0;'); await sleep(150); await shot('0-niveau1');
  await C('T.load(T.N - 1); return 0;'); await sleep(150); await shot('1-niveau40');
  // une poussée au clavier, saisie en plein glissement
  await C(`T.load(-1, '#######\\n#@ $ .#\\n#######'); return 0;`); await key('ArrowRight'); await key('ArrowRight'); await sleep(40); await shot('2-glisse');
  if (await C('return en.pushes + "|" + en.boxes[0][0];') !== '1|4') throw new Error('la caisse devait avancer d\'une case');
  await key('Backspace'); if (await C('return en.pushes + "|" + en.p[0];') !== '0|2') throw new Error('annuler devait reculer la poussée');
  await key('ArrowRight'); await key('ArrowRight'); await key('ArrowRight'); await sleep(700);
  if (await C('return en.mode;') !== 'won') throw new Error('l\'entrepôt devait être rangé'); await shot('3-range');
  // la manette : croix droite pousse, B annule, Y recommence
  await pj(`(() => { const pad = {axes: [0, 0], buttons: Array.from({length: 17}, () => ({pressed: false}))}; window.__pad = pad; navigator.getGamepads = () => [pad]; return 0; })()`);
  const btn = async (i, ms = 80) => { await pj(`(__pad.buttons[${i}].pressed = true, 0)`); await sleep(ms); await pj(`(__pad.buttons[${i}].pressed = false, 0)`); await sleep(80); };
  await C(`T.load(-1, '########\\n#@ $  .#\\n########'); return 0;`); await sleep(50);
  await btn(15); await btn(15); if (await C('return en.pushes;') !== 1) throw new Error('la croix devait pousser la caisse');
  await btn(1); if (await C('return en.pushes;') !== 0) throw new Error('B devait annuler');
  await btn(15, 700); if (await C('return en.moves;') < 3) throw new Error('la croix maintenue devait répéter le pas');
  await btn(3); if (await C('return en.moves;') !== 0) throw new Error('Y devait recommencer');
  await pj(`navigator.getGamepads = () => [], 0`);
  await C(`Object.assign(T.ens(), JSON.parse(${JSON.stringify(keep)})); T.load(T.ens().level); return 0;`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('enFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 300) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · poussée animée · annuler · rangé · manette · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
