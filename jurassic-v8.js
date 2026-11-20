'use strict';

window.Jurassic = (() => {
  const width = 960;
  const spots = [
    { name: 'きの うしろ', x: .23, y: .49, cover: tree, dx: 25, dy: -6 },
    { name: 'いわの うしろ', x: .69, y: .44, cover: rock, dx: 39, dy: -3 },
    { name: 'シダの なか', x: .19, y: .80, cover: ferns, dx: 27, dy: -4 },
    { name: 'みずの なか', x: .77, y: .79, cover: pond, dx: 2, dy: 0 },
    { name: 'たおれた きの うしろ', x: .46, y: .71, cover: log, dx: 25, dy: -3 }
  ];

  function shape(ctx, color, path) {
    ctx.fillStyle = color;
    ctx.fill(new Path2D(path));
  }

  function ellipse(ctx, color, x, y, rx, ry, angle = 0) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, angle, 0, 2 * Math.PI);
    ctx.fill();
  }

  function gradient(ctx, y0, y1, top, bottom) {
    const color = ctx.createLinearGradient(0, y0, 0, y1);
    color.addColorStop(0, top);
    color.addColorStop(1, bottom);
    return color;
  }

  function fern(ctx, x, y, scale, color, turn = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * turn, scale);
    for (const angle of [-1.05, -.6, -.16, .36, .85]) {
      ctx.save();
      ctx.rotate(angle);
      const frond = new Path2D('M0 0Q-9-42 0-82Q10-39 0 0Z');
      for (let i = 0; i < 7; i++) {
        const h = -12 - i * 9;
        const leaf = 22 - i * 2.6;
        frond.ellipse(-leaf * .45, h - 4, leaf * .68, 3.6, .42, 0, 2 * Math.PI);
        frond.ellipse(leaf * .45, h - 6, leaf * .68, 3.8, -.4, 0, 2 * Math.PI);
      }
      ctx.fillStyle = color;
      ctx.fill(frond);
      ctx.restore();
    }
    ctx.restore();
  }

  function conifer(ctx, x, y, scale, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    shape(ctx, color, 'M-7 0L-4-32Q-24-25-43-28Q-26-36-17-54L-31-51Q-14-65-10-78L-20-76Q-6-93 1-117Q9-91 22-76L11-79Q18-62 34-51L19-53Q28-35 44-29Q23-24 5-33L8 0Z');
    ctx.restore();
  }

  function landscape(ctx, h) {
    ctx.fillStyle = gradient(ctx, 0, h * .58, '#a9cbc1', '#fff0bd');
    ctx.fillRect(0, 0, width, h);
    ellipse(ctx, '#ffeab0', 757, h * .15, 45, 45);
    ellipse(ctx, '#f3efd390', 800, h * .19, 121, 12);
    ellipse(ctx, '#f7f0d5b0', 204, h * .17, 127, 9);
    ctx.save();
    ctx.scale(1, h / 600);
    shape(ctx, '#9ab4a6', 'M0 251Q130 151 219 192Q265 215 329 157L443 66L516 123L570 161Q623 170 668 210Q824 107 960 189V600H0Z');
    shape(ctx, '#849e8c', 'M443 66L516 123L570 161L527 154L489 135L465 129L447 141L425 120L391 155L354 171Z');
    shape(ctx, '#729480', 'M0 263Q115 212 201 255Q254 278 360 231Q455 183 557 246Q644 277 784 217Q869 180 960 237V600H0Z');
    ctx.restore();
    for (let i = 0; i < 33; i++) {
      const x = i * 31;
      const y = h * (.405 + .033 * Math.sin(i * .55));
      conifer(ctx, x, y, .41 + .18 * (1 + Math.cos(i * 4)), i % 3 ? '#5f806b' : '#688875');
    }
    ctx.save();
    ctx.scale(1, h / 600);
    shape(ctx, gradient(ctx, 240, 600, '#a9b17e', '#718c5e'), 'M0 262Q150 209 328 273Q459 307 593 257Q772 207 960 268V600H0Z');
    shape(ctx, '#c5b88d', 'M377 600C422 533 363 486 411 430C461 373 595 340 638 299C664 276 646 264 610 254C679 264 712 291 681 321C643 358 548 381 529 428C505 483 607 546 583 600Z');
    shape(ctx, '#e0cda371', 'M437 600C465 542 424 496 465 440Q492 404 590 364Q509 412 502 440C488 496 557 551 526 600Z');
    ctx.restore();

    // Repeatable ground texture remains in place as each animal moves.
    for (let i = 0; i < 120; i++) {
      const x = ((i * 163) % 977);
      const y = h * (.45 + ((i * 257) % 911) / 1680);
      ellipse(ctx, i % 4 ? '#45674028' : '#ebd4a475', x, y, 2 + i % 6, 1 + i % 3, (i % 3 - 1) * .25);
    }
    for (const [x, y, scale] of [[22,.64,1],[92,.91,.64],[336,.94,1],[873,.55,.6],[934,.95,1.5],[12,.97,1.4]]) {
      fern(ctx, x, h * y, scale, '#57794e');
    }
    fern(ctx, 505, h * .43, .43, '#789360', -1);
    fern(ctx, 383, h * .50, .44, '#718955');
  }

  function tree(ctx) {
    ellipse(ctx, '#3e523a30', 2, 0, 104, 18);
    for (const [x, y, rx, ry, color] of [
      [-60,-211,79,37,'#344f44'], [50,-193,100,33,'#3c5c4a'], [-24,-247,98,34,'#496753'],
      [46,-249,86,37,'#486f58'], [-50,-272,72,30,'#6f8660'], [42,-287,71,25,'#68815d']
    ]) ellipse(ctx, color, x, y, rx, ry, -.07);
    shape(ctx, gradient(ctx,-230,10,'#655545','#4d463b'), 'M-82 8Q-47-12-46-38L-44-153L-68-204L-51-208L-27-174L-11-237L9-242L12-177L58-229L73-218L39-153Q44-83 39-32Q42-5 82 8Q42 16 18 1Q-16 12-34 2Q-52 13-82 8Z');
    shape(ctx, '#9a8062', 'M-30-20L-27-144L-42-190L-20-155L-8-172L-11-100L-4-15L-22 4L-18-28Z');
    shape(ctx, '#7c6c52', 'M15-2L15-73L9-135L35-164L28-123L29-44L47 3L31 0L20-17L20 4Z');
    fern(ctx, -58, 10, .47, '#5b7c50');
  }

  function rock(ctx) {
    ellipse(ctx, '#55594842', 0, 2, 104, 18);
    shape(ctx, gradient(ctx,-116,6,'#b7b7a6','#757e70'), 'M-91-7L-99-29L-78-80L-35-113L22-117L65-100L96-59L88-13L42 5L-57 6Z');
    shape(ctx, '#d2c9ae', 'M-78-80L-35-113L22-117L65-100L35-81L-3-82L-31-57L-69-51Z');
    shape(ctx, '#626d63', 'M35-81L65-100L96-59L88-13L42 5L57-39Z');
    shape(ctx, '#a4a898', 'M-69-51L-31-57L-3-82L-6-48L-28-17L-74-12L-91-7Z');
    shape(ctx, '#7f9669', 'M-92-18Q-63-32-54-21Q-40-12-21-21Q-18-13-28-5L-65 2L-91-7Z');
    ellipse(ctx, '#9d9e83', 99, 1, 14, 8, -.12);
  }

  function ferns(ctx) {
    ellipse(ctx, '#40543233', 1, -2, 91, 19);
    fern(ctx, -50, 6, 1.15, '#365e4b');
    fern(ctx, 36, 15, 1.40, '#446b48', -1);
    fern(ctx, -17, 14, 1.54, '#527b50', -1);
    fern(ctx, 72, 16, .77, '#739452');
    fern(ctx, -64, 20, .75, '#799d5b');
  }

  function pond(ctx) {
    ellipse(ctx, '#748f66', 0, -13, 158, 62);
    ellipse(ctx, gradient(ctx,-70,43,'#94c6b7','#518e94'), 0, -13, 143, 55);
    for (const [x, y, rx] of [[-82,-37,30],[-9,-51,43],[61,-23,41],[-35,10,49],[71,18,14]]) {
      ellipse(ctx, '#c7e4cf88', x, y, rx, 2.1);
    }
    ellipse(ctx, '#7da64f', -102, -2, 16, 7, .11);
    ellipse(ctx, '#97b574', 94, 7, 13, 5, -.14);
    fern(ctx, 107, 22, .56, '#607e51');
    fern(ctx, -126, 18, .54, '#6a884e', -1);
  }

  function log(ctx) {
    ctx.save();
    ctx.rotate(-.12);
    ellipse(ctx, '#66523737', -5, 2, 110, 13);
    shape(ctx, gradient(ctx,-76,-9,'#987854','#5e4f43'), 'M-103-18L-105-47L-89-62L-51-63L-67-86L-59-94L-30-64L21-68L45-93L51-88L40-68L92-69Q108-61 107-39Q105-17 87-15L-66-10Z');
    shape(ctx, '#c4a378', 'M-101-41L-92-57L87-67Q76-58 71-51L-15-45L-52-48Z');
    shape(ctx, '#7d895b', 'M-89-63L-50-64L-35-52L-8-61L36-60L66-67L78-63L67-51L27-48L-6-54L-41-46L-70-53Z');
    ellipse(ctx, '#523f36', 92, -40, 24, 26, .14);
    ellipse(ctx, '#bf9d72', 93, -39, 19, 22, .14);
    ellipse(ctx, '#9f7a56', 96, -39, 12, 15, .14);
    ellipse(ctx, '#b89164', 94, -40, 8, 10, .14);
    ctx.restore();
    fern(ctx, -68, 2, .44, '#7b9257');
  }

  function animalPosition(spot, species) {
    const size = spot.cover === tree ? .92 : 1;
    const dy = spot.cover === pond ? -80 - Dinos.mouth(species).y * size : spot.dy;
    return { x: spot.dx, y: dy, size };
  }

  function paint(ctx, h, target, reveal = 0) {
    landscape(ctx, h);
    for (const spot of [...spots].sort((a, b) => a.y - b.y)) {
      ctx.save();
      ctx.translate(spot.x * width, spot.y * h);
      if (spot === target?.spot && !reveal) {
        const { x, y, size } = animalPosition(spot, target.species);
        Dinos.draw(ctx, x, y, size, target.species);
      }
      spot.cover(ctx);
      ctx.restore();
    }
    if (target && reveal) {
      const { spot, species } = target;
      const { x, y, size } = animalPosition(spot, species);
      const revealedX = Math.min(width - 137, spot.x * width + x + 34 * reveal);
      const revealedY = spot.y * h + y - 12 * reveal;
      ellipse(ctx, '#fff1af82', revealedX, revealedY - 48, 132, 92);
      Dinos.draw(ctx, revealedX, revealedY, size * (1 + .07 * reveal), species);
      for (let i = 0; i < 5; i++) {
        const angle = .48 + i * .62;
        const sx = revealedX + Math.cos(angle) * 132;
        const sy = revealedY - Math.sin(angle) * 147;
        shape(ctx, '#fff7c9', `M${sx} ${sy-9}l3 6 6 3-6 3-3 6-3-6-6-3 6-3Z`);
      }
    }
  }

  return { width, spots, animalPosition, paint };
})();
