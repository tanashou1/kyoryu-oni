'use strict';

const board = document.querySelector('#board');
const message = document.querySelector('#status');
const settings = document.querySelector('#settings');
const toggle = document.querySelector('#settings-toggle');
const select = document.querySelector('#pairs');
const palette = [
  ['#aabfdb', '#e4edf8'], ['#dfad81', '#fae9d9'], ['#9cba8b', '#e7f1de'],
  ['#bd9dcc', '#f0e5f7'], ['#d5959e', '#fae0e5'], ['#80bcb6', '#dff2ef'],
  ['#c1b06c', '#f8f0cf'], ['#ab9f93', '#ece7df'], ['#919bce', '#e5e8f9'],
  ['#bf9568', '#f2e2cc'], ['#8ebaa0', '#e0f1e8']
];
let pairCount = 5;
let cards = [];
let first = null;
let locked = false;
let matched = 0;
let pending = null;

try {
  const saved = Number(localStorage.getItem('dino-memory-pairs'));
  if ([2, 3, 4, 5, 6, 8, 10, 11].includes(saved)) pairCount = saved;
} catch {}
select.value = String(pairCount);

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function layout() {
  const width = board.clientWidth;
  if (!width) return;
  const landscape = innerWidth > innerHeight && innerHeight < 600;
  const capacity = landscape ? Math.min(8, Math.floor(width / 80)) : Math.floor(width / 112);
  const columns = Math.min(cards.length, Math.max(3, capacity));
  const rowCount = Math.ceil(cards.length / columns);
  const cardWidth = Math.min(124, (width - 16) / (columns * 1.36));
  const cardHeight = cardWidth * (landscape ? .78 : .88);

  // Reserve room for the rotated corners, then vary both the gaps and card heights.
  const slotWidth = cardWidth + cardHeight * .22 + 6;
  const slotHeight = cardHeight + cardWidth * .22 + 6;
  let index = 0;
  let top = 8;
  for (let row = 0; row < rowCount; row++) {
    const remaining = cards.length - index;
    const rowsLeft = rowCount - row;
    const lean = row % 2 === 0 ? 1 : 0;
    const count = Math.min(columns, Math.floor(remaining / rowsLeft) + lean);
    const rowCards = cards.slice(index, index + count);
    const freeWidth = Math.max(0, width - 16 - rowCards.length * slotWidth);
    const gaps = rowCards.map(card => card.spacing);
    gaps.push(rowCards[0].rowSpacing);
    const gapScale = freeWidth / gaps.reduce((sum, gap) => sum + gap);
    let left = 8;
    const drift = cardHeight * .29;

    rowCards.forEach((card, i) => {
      left += gaps[i] * gapScale;
      Object.assign(card.element.style, {
        left: `${left + (slotWidth - cardWidth) / 2}px`,
        top: `${top + (slotHeight - cardHeight) / 2 + card.stagger * drift}px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`
      });
      left += slotWidth;
    });
    index += rowCards.length;
    top += slotHeight + drift + rowCards[0].rowSpacing * 4;
  }
  board.style.height = `${top + 8}px`;
}

function paintCard(card) {
  const canvas = card.element.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Dinos.draw(ctx, 150, 141, Math.min(1, 112 / Dinos.height(card.animal)), card.animal);
}

function updateStatus() {
  message.textContent = `${matched} / ${pairCount}`;
  message.setAttribute('aria-label', `${pairCount} ペアのうち ${matched} ペア そろったよ`);
}

function conceal(card) {
  card.open = false;
  card.element.classList.remove('revealed');
  card.element.setAttribute('aria-label', card.backLabel);
  card.element.setAttribute('aria-pressed', 'false');
}

function start() {
  ClearEffect.hide();
  clearTimeout(pending);
  first = null;
  locked = false;
  matched = 0;
  const chosen = shuffle([...Dinos.species]).slice(0, pairCount);
  cards = shuffle(chosen.flatMap((animal, color) => [
    { animal, color }, { animal, color }
  ])).map((card, index) => {
    const element = document.createElement('button');
    card.element = element;
    card.backLabel = `${index + 1}まいめの カードを めくる`;
    card.spacing = .35 + Math.random() * 1.4;
    card.rowSpacing = .35 + Math.random() * 1.4;
    card.stagger = index % 2 ? .6 + Math.random() * .4 : Math.random() * .4;
    const angle = (4 + Math.random() * 8) * (Math.random() < .5 ? -1 : 1);
    card.matched = false;
    element.className = 'memory-card';
    element.style.setProperty('--angle', `${angle}deg`);
    element.style.setProperty('--edge', palette[card.color][0]);
    element.style.setProperty('--tint', palette[card.color][1]);
    element.innerHTML = '<span class="back" aria-hidden="true">✦</span><canvas width="300" height="170" aria-hidden="true"></canvas>';
    element.onclick = () => flip(card);
    conceal(card);
    paintCard(card);
    return card;
  });
  board.replaceChildren(...cards.map(card => card.element));
  layout();
  updateStatus();
}

function flip(card) {
  if (locked || card.open || card.matched) return;
  card.open = true;
  card.element.classList.add('revealed');
  card.element.setAttribute('aria-label', card.animal.name);
  card.element.setAttribute('aria-pressed', 'true');
  if (!first) {
    first = card;
    return;
  }
  const previous = first;
  first = null;
  if (previous.animal.id === card.animal.id) {
    for (const match of [previous, card]) {
      match.matched = true;
      match.element.classList.add('matched');
      match.element.setAttribute('aria-label', match.animal.name + ' そろった！');
    }
    matched++;
    updateStatus();
    if (matched === pairCount) {
      locked = true;
      ClearEffect.show(start);
    }
    return;
  }
  locked = true;
  pending = setTimeout(() => {
    conceal(previous);
    conceal(card);
    locked = false;
  }, 1000);
}

toggle.onclick = () => {
  settings.hidden = !settings.hidden;
  toggle.setAttribute('aria-expanded', String(!settings.hidden));
};
document.querySelector('#apply').onclick = () => {
  pairCount = Number(select.value);
  try { localStorage.setItem('dino-memory-pairs', String(pairCount)); } catch {}
  settings.hidden = true;
  toggle.setAttribute('aria-expanded', 'false');
  start();
  board.querySelector('button')?.focus({ preventScroll: true });
};
addEventListener('resize', layout);
new ResizeObserver(layout).observe(board);
start();
Dinos.ready.then(() => cards.forEach(paintCard));
