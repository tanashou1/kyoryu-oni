'use strict';

const field = document.querySelector('#field');
const canvas = document.querySelector('#jurassic');
const ctx = canvas.getContext('2d');
const spots = document.querySelector('#spots');
const feedback = document.querySelector('#feedback');
const progress = document.querySelector('#progress');
const ripple = document.querySelector('#ripple');
const peek = document.querySelector('#peek');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const species = Dinos.species.filter(animal => animal.id === 'allo' || animal.id === 'stego');
const roundCount = 3;
const zones = [
  { dx: 10, dy: -61, w: 270, h: 144 },
  { dx: 25, dy: -62, w: 270, h: 144 },
  { dx: 15, dy: -61, w: 256, h: 140 },
  { dx: 0, dy: -32, w: 318, h: 147 },
  { dx: 22, dy: -72, w: 250, h: 140 }
];
let deck;
let target;
let completed;
let misses;
let found;
let reveal = 0;
let nextTimer;
let rippleTimer;
let lastSpot;
let animation;
let hintTimer;

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const buttons = Jurassic.spots.map((spot, i) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hide-spot';
  button.onclick = event => {
    if (found) return;
    if (target.spot === spot) discover(event.detail === 0);
    else miss(event);
  };
  button.dataset.spot = i;
  spots.append(button);
  return button;
});

for (const _ of Array.from({ length: roundCount })) {
  progress.append(document.createElement('span'));
}

function centerOfTarget() {
  const { x, y, size } = Jurassic.animalPosition(target.spot, target.species);
  const nose = Dinos.mouth(target.species);
  return {
    x: target.spot.x * Jurassic.width + x + nose.x * size * .86,
    y: target.spot.y * worldHeight() + y + nose.y * size - 5
  };
}

function worldHeight() {
  return canvas.clientHeight * Jurassic.width / canvas.clientWidth;
}

function position(element, x, y) {
  element.style.left = `${x / Jurassic.width * 100}%`;
  element.style.top = `${y / worldHeight() * 100}%`;
}

function draw() {
  if (!target || !canvas.clientWidth || !canvas.clientHeight) return;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const pixelWidth = Math.round(canvas.clientWidth * dpr);
  const pixelHeight = Math.round(canvas.clientHeight * dpr);
  if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
  if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
  const scale = pixelWidth / Jurassic.width;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  Jurassic.paint(ctx, worldHeight(), target, reveal);
}

function layout() {
  if (!canvas.clientWidth || !canvas.clientHeight) return;
  const height = worldHeight();
  buttons.forEach((button, i) => {
    const spot = Jurassic.spots[i];
    const area = zones[i];
    position(button, spot.x * Jurassic.width + area.dx, spot.y * height + area.dy);
    button.style.width = `${area.w / Jurassic.width * 100}%`;
    button.style.height = `${area.h / height * 100}%`;
  });
  if (target && !peek.hidden) {
    const point = centerOfTarget();
    position(peek, point.x, point.y);
  }
  draw();
}

function updateProgress() {
  [...progress.children].forEach((dot, i) => dot.classList.toggle('done', i < completed));
  progress.setAttribute('aria-label', `${roundCount}ひきのうち ${completed}ひき`);
}

function beginRound() {
  found = false;
  reveal = 0;
  misses = 0;
  peek.hidden = true;
  ripple.hidden = true;
  const spot = deck.shift();
  lastSpot = spot;
  target = { spot, species: shuffled(species)[0] };
  buttons.forEach((button, i) => {
    const location = Jurassic.spots[i];
    const correct = location === spot;
    button.style.zIndex = correct ? '2' : '1';
    button.setAttribute('aria-label', location.name + (correct ? '。きょうりゅうが すこし みえるよ' : ''));
  });
  feedback.textContent = 'かくれた きょうりゅうは どこかな？';
  clearTimeout(hintTimer);
  hintTimer = setTimeout(showHint, 8000);
  layout();
}

function start() {
  ClearEffect.hide();
  clearTimeout(nextTimer);
  cancelAnimationFrame(animation);
  deck = shuffled(Jurassic.spots);
  if (deck[0] === lastSpot) [deck[0], deck[1]] = [deck[1], deck[0]];
  completed = 0;
  updateProgress();
  beginRound();
}

function showHint() {
  if (found) return;
  const point = centerOfTarget();
  position(peek, point.x, point.y);
  peek.hidden = false;
}

function showRipple(x, y, correct = false) {
  clearTimeout(rippleTimer);
  ripple.hidden = true;
  ripple.classList.toggle('correct', correct);
  position(ripple, x, y);
  ripple.getBoundingClientRect();
  ripple.hidden = false;
  rippleTimer = setTimeout(() => { ripple.hidden = true; }, correct ? 690 : 475);
}

function miss(event) {
  const rect = canvas.getBoundingClientRect();
  const scale = Jurassic.width / rect.width;
  if (event.detail) showRipple((event.clientX - rect.left) * scale, (event.clientY - rect.top) * scale);
  feedback.textContent = 'まだ かくれてるよ';
  misses++;
  if (misses >= 2) showHint();
}

function discover(keyboard) {
  found = true;
  clearTimeout(hintTimer);
  peek.hidden = true;
  completed++;
  updateProgress();
  feedback.textContent = target.species.name + '、みつけた！';
  const point = centerOfTarget();
  showRipple(point.x, point.y, true);
  const started = performance.now();
  function animate(now) {
    reveal = reduceMotion.matches ? 1 : Math.max(.01, Math.min(1, (now - started) / 260));
    draw();
    if (reveal < 1) animation = requestAnimationFrame(animate);
  }
  animation = requestAnimationFrame(animate);
  nextTimer = setTimeout(() => {
    if (completed === roundCount) ClearEffect.show(start);
    else {
      beginRound();
      if (keyboard) buttons[0].focus({ preventScroll: true });
    }
  }, 830);
}

field.addEventListener('click', event => {
  if (!found && !event.target.closest('.hide-spot')) miss(event);
});
new ResizeObserver(layout).observe(field);
start();
Dinos.ready.then(draw);
