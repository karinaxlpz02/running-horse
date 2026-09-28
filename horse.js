const canvas = document.querySelector('#horse');
const ctx = canvas.getContext('2d');
const mask = document.createElement('canvas');
mask.width = 1000;
mask.height = 650;
const m = mask.getContext('2d', { willReadFrequently: true });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let time = 0.7;
let previous = 0;
const TAU = Math.PI * 2;
const glyphs = ' .:;+=xX%#@';
function oval(x, y, rx, ry, angle = 0) {
  m.beginPath(); m.ellipse(x, y, rx, ry, angle, 0, TAU); m.fill();
}
function path(d) { m.fill(new Path2D(d)); }
function segment(a, b, startWidth, endWidth) {
  const angle = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const x = Math.sin(angle), y = -Math.cos(angle);
  m.beginPath();
  m.moveTo(a[0] + x * startWidth, a[1] + y * startWidth);
  m.lineTo(b[0] + x * endWidth, b[1] + y * endWidth);
  m.lineTo(b[0] - x * endWidth, b[1] - y * endWidth);
  m.lineTo(a[0] - x * startWidth, a[1] - y * startWidth);
  m.closePath(); m.fill(); oval(b[0], b[1], endWidth, endWidth);
}
function joint(p, length, angle) {
  return [p[0] + Math.sin(angle) * length, p[1] + Math.cos(angle) * length];
}
function leg(t, rear, far) {
  const phase = t + (far ? 0.65 : 0) + (rear ? 1.9 : 0);
  const swing = Math.sin(phase);
  const fold = Math.max(0, Math.cos(phase));
  const root = rear ? [365, 311] : [608, 307];
  const knee = joint(root, rear ? 87 : 101, rear ? -0.35 + swing * 0.7 : swing * 0.95);
  const ankle = joint(knee, rear ? 92 : 94, rear ? 0.3 + swing * 0.9 + fold * 0.95 : swing * 0.75 - fold * 1.9);
  const foot = joint(ankle, 34, rear ? swing * 0.65 : swing * 0.5 - fold * 0.8);
  m.fillStyle = far ? '#929292' : '#eeeeee';
  segment(root, knee, rear ? 31 : 22, rear ? 14 : 10);
  segment(knee, ankle, rear ? 12 : 9, 6);
  segment(ankle, foot, 7, 6);
  m.save(); m.translate(foot[0], foot[1]); m.rotate(-swing * 0.3);
  path('M -7 -5 L 8 -5 L 17 7 Q 5 13 -10 8 Z'); m.restore();
}
function shape(t) {
  m.clearRect(0, 0, 1000, 650);
  m.save(); m.translate(0, Math.sin(t * 2) * 9); m.translate(480, 280); m.rotate(Math.sin(t) * 0.018); m.translate(-480, -280);
  leg(t, true, true); leg(t, false, true);
  // Swept tail, with independently lagging strands.
  m.strokeStyle = '#c9c9c9'; m.lineCap = 'round';
  for (let i = 0; i < 19; i++) {
    m.lineWidth = 2.5 + (i % 4);
    m.beginPath(); m.moveTo(333, 254 + i * 1.2);
    m.bezierCurveTo(270, 234 + i, 217, 252 + Math.sin(t - i * 0.12) * 22, 99 + i * 3, 276 + i * 3 + Math.sin(t - i * 0.16) * 25); m.stroke();
  }
  // Back, barrel, flank, shoulder and chest form a single continuous silhouette.
  const barrel = m.createLinearGradient(0, 230, 0, 370);
  barrel.addColorStop(0, '#fafafa'); barrel.addColorStop(0.45, '#dfdfdf'); barrel.addColorStop(1, '#777777');
  m.fillStyle = barrel;
  path('M 319 257 C 334 223 375 222 407 236 C 452 252 503 247 554 236 C 583 224 600 222 622 237 C 652 252 664 288 651 320 C 639 348 617 357 589 353 C 559 356 525 365 486 365 C 449 365 425 347 398 341 C 363 353 332 334 321 305 C 315 289 310 274 319 257 Z');
  const muscle = m.createRadialGradient(574, 280, 9, 570, 294, 95);
  muscle.addColorStop(0, '#ffffff'); muscle.addColorStop(1, '#aaaaaa');
  m.fillStyle = muscle; oval(580, 289, 58, 65, -0.3);
  const haunch = m.createRadialGradient(347, 263, 5, 364, 284, 54);
  haunch.addColorStop(0, '#ffffff'); haunch.addColorStop(1, '#888888');
  m.fillStyle = haunch; oval(362, 280, 44, 49, 0.2);
  // A forward-carried head and sloping neck retain natural running proportions.
  m.save(); m.translate(60, 65); m.scale(0.92, 0.80);
  m.fillStyle = '#eeeeee';
  path('M 548 258 C 582 219 604 164 643 131 C 658 119 682 118 698 131 L 715 155 C 695 172 682 181 673 205 C 659 237 657 276 638 315 C 624 339 601 343 589 326 C 606 290 599 266 582 257 Z');
  path('M 662 134 C 671 114 698 117 713 131 C 724 143 729 151 742 166 L 784 198 C 792 205 793 215 785 223 C 777 231 760 229 748 220 L 712 199 C 690 200 674 188 671 170 Z');
  oval(699, 170, 23, 26, -0.3);
  path('M 676 132 Q 662 104 672 89 Q 685 99 688 125 Z');
  path('M 696 127 Q 694 100 705 91 Q 713 107 707 137 Z');
  m.strokeStyle = '#bcbcbc';
  for (let i = 0; i < 24; i++) {
    const u = i / 23, x = 670 - 99 * u, y = 127 + 117 * u;
    m.lineWidth = 3; m.beginPath(); m.moveTo(x, y);
    m.bezierCurveTo(x - 17, y - 9, x - 30, y + 4, x - 39 - Math.sin(t - u * 4) * 10, y + 5 + Math.cos(t + u * 5) * 9); m.stroke();
  }
  m.restore();
  leg(t, true, false); leg(t, false, false);
  m.save(); m.translate(60, 65); m.scale(0.92, 0.80);
  // Small negative spaces preserve the eye, nostril and mouth at glyph resolution.
  m.globalCompositeOperation = 'destination-out';
  oval(716, 155, 4.4, 3.5, -0.2); oval(777, 207, 4, 3, 0.5);
  m.lineWidth = 2.8; m.beginPath(); m.moveTo(765, 220); m.lineTo(784, 221); m.stroke();
  m.globalCompositeOperation = 'source-over'; m.restore(); m.restore();
}
function render(now) {
  const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
  previous = now;
  if (!reducedMotion.matches) time += delta * 6.7;
  const width = innerWidth, height = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = '#858585'; ctx.fillRect(0, 0, width, height);
  shape(time);
  const data = m.getImageData(0, 0, 1000, 650).data;
  const scale = Math.min(width * 0.94 / 730, height * 0.88 / 470);
  const ox = width / 2 - 447 * scale, oy = height / 2 - 318 * scale;
  ctx.fillStyle = '#ff6500'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `bold ${8 * scale}px monospace`;
  for (let y = 75; y < 575; y += 6) {
    for (let x = 65; x < 815; x += 4.5) {
      const at = (y * 1000 + Math.floor(x)) * 4;
      if (data[at + 3] < 110) continue;
      const texture = Math.sin(x * 0.071 + y * 0.039) * 0.5 + 0.5;
      const density = data[at] / 255;
      const index = Math.min(glyphs.length - 1, Math.floor(1 + density * 7 + texture * 1.5));
      ctx.globalAlpha = 0.65 + density * 0.35;
      ctx.fillText(glyphs[index], ox + x * scale, oy + y * scale);
    }
  }
  ctx.globalAlpha = 1; requestAnimationFrame(render);
}
requestAnimationFrame(render);
