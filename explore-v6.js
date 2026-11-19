'use strict';

const modes = {
  find: { title: 'きょうりゅう どこかな？', hint: 'おなじ きょうりゅうを さがしてね！', goal: 3 },
  tracks: { title: 'あしあと ぺたぺた', hint: 'ひかる あしあとを ぽん！', goal: 5 },
  shadow: { title: 'きょうりゅう かげあわせ', hint: 'かげと おなじ きょうりゅうは どれかな？', goal: 3 }
};
const mode = new URLSearchParams(location.search).get('game');
const game = Object.hasOwn(modes, mode) ? mode : 'find';
const { title, hint, goal } = modes[game];
const stage = document.querySelector('#stage');
const clue = document.querySelector('#clue');
const choices = document.querySelector('#choices');
const feedback = document.querySelector('#feedback');
const progress = document.querySelector('#progress');

document.title = title;
document.querySelector('#title').textContent = title;
document.querySelector('#hint').textContent = hint;
stage.dataset.game = game;

let completed = 0;
let pending;
let locked = false;
let previous;
let illustrations = [];

function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function paint({ canvas, animal, silhouette }) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Dinos.draw(ctx, 150, 137, Math.min(1.06, 113 / Dinos.height(animal)), animal);
  if (silhouette) {
    ctx.clearRect(0, 139, 300, 21);
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = '#343849';
    ctx.fillRect(0, 0, 300, 160);
    ctx.globalCompositeOperation = 'source-over';
  }
}

function picture(host, animal, silhouette = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 160;
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  const drawing = { canvas, animal, silhouette };
  illustrations.push(drawing);
  paint(drawing);
}

function updateProgress() {
  progress.replaceChildren(...Array.from({ length: goal }, (_, i) => {
    const dot = document.createElement('span');
    dot.classList.toggle('done', i < completed);
    return dot;
  }));
  progress.setAttribute('aria-label', `${completed} / ${goal}`);
}

function stamp(button, symbol) {
  let marker = button.querySelector('.marker');
  if (!marker) {
    marker = document.createElement('span');
    marker.className = 'marker';
    marker.setAttribute('aria-hidden', 'true');
    button.append(marker);
  }
  marker.textContent = symbol;
}

function finishStep(button, next) {
  locked = true;
  button.classList.remove('try-again');
  button.classList.add('correct');
  stamp(button, '✓');
  completed++;
  updateProgress();
  if (completed === goal) {
    feedback.textContent = 'やったね！';
    ClearEffect.show(start);
    return;
  }
  feedback.textContent = game === 'tracks' ? 'ぺたっ！' : 'みつけたね！';
  pending = setTimeout(next, game === 'tracks' ? 160 : 620);
}

function tryAgain(button) {
  feedback.textContent = game === 'tracks' ? 'ひかる あしあとを ぽん！' : 'もういちど さがそう！';
  button.classList.add('try-again');
  stamp(button, '↻');
}

function showChoices() {
  locked = false;
  illustrations = [];
  choices.replaceChildren();
  clue.replaceChildren();
  clue.hidden = false;

  // Keep shadow choices visually distinct, even on a small screen.
  const pool = game === 'shadow'
    ? Dinos.species.filter(animal => ['tyranno', 'spino', 'stego', 'mosa', 'trike', 'ptera', 'argentine'].includes(animal.id))
    : Dinos.species;
  const animal = shuffle(pool.filter(item => item !== previous))[0];
  previous = animal;
  const label = document.createElement('span');
  label.textContent = game === 'shadow' ? 'この かげは だれ？' : 'さがす きょうりゅう';
  clue.append(label);
  clue.setAttribute('aria-label', game === 'shadow' ? 'さがす きょうりゅうの かげ' : animal.name);
  picture(clue, animal, game === 'shadow');

  const options = shuffle([animal, ...shuffle(pool.filter(item => item !== animal)).slice(0, 2)]);
  for (const option of options) {
    const button = document.createElement('button');
    button.className = 'choice';
    button.setAttribute('aria-label', option.name);
    picture(button, option);
    button.onclick = () => {
      if (locked) return;
      if (option === animal) finishStep(button, showChoices);
      else tryAgain(button);
    };
    choices.append(button);
  }
}

const footprint = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M23 43c-6 0-9-5-9-11 0-4-4-8-8-12-3-4-4-7-2-9 3-1 7 2 12 8l3 4c0-8 0-15 2-19 1-3 4-3 5 0 2 4 2 11 2 19l4-5c5-6 9-8 11-6 2 2 0 5-3 9-4 5-7 8-7 12 0 5-4 10-10 10Z"/></svg>';

function showTracks() {
  illustrations = [];
  choices.replaceChildren();
  clue.replaceChildren();
  clue.hidden = false;
  const animal = Dinos.pick(previous);
  previous = animal;
  const label = document.createElement('span');
  label.textContent = animal.name + 'に あいに いこう！';
  clue.append(label);
  picture(clue, animal);
  const tracks = [];
  function highlight() {
    locked = false;
    tracks.forEach((button, index) => {
      button.classList.toggle('next', index === completed);
      button.disabled = index < completed;
      button.setAttribute('aria-label', index === completed ? 'ひかる あしあと' : `あしあと ${index + 1}`);
    });
  }
  for (let i = 0; i < goal; i++) {
    const button = document.createElement('button');
    button.className = 'choice track';
    button.innerHTML = footprint;
    button.onclick = () => {
      if (locked) return;
      if (i === completed) {
        button.classList.remove('next');
        finishStep(button, highlight);
      } else {
        tryAgain(button);
      }
    };
    choices.append(button);
    tracks.push(button);
  }
  highlight();
}

function start() {
  clearTimeout(pending);
  completed = 0;
  feedback.textContent = '';
  updateProgress();
  if (game === 'tracks') showTracks();
  else showChoices();
}

start();
Dinos.ready.then(() => illustrations.forEach(paint));
