'use strict';
const opening = document.getElementById('opening');
const openInvite = document.getElementById('openInvite');
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicText = document.getElementById('musicText');
const musicHint = document.getElementById('musicHint');
const petalLayer = document.getElementById('petalLayer');
const scrollProgress = document.getElementById('scrollProgress');
let pausedByUser = false;
let hintTimer;
let introOpened = false;
bgMusic.volume = 0.42;

function updateMusicButton() {
  const playing = !bgMusic.paused;
  musicText.textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
  musicToggle.classList.toggle('is-playing', playing);
  musicToggle.setAttribute('aria-label', playing ? 'Tắt nhạc nền' : 'Bật nhạc nền');
}
function hint(message) {
  musicHint.textContent = message;
  musicHint.hidden = false;
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => { musicHint.hidden = true; }, 3500);
}
function startMusic(showTip = false) {
  // Called synchronously in click handler: best possible chance on iOS / Android.
  const attempt = bgMusic.play();
  if (attempt && typeof attempt.catch === 'function') {
    attempt.catch(() => { if (showTip) hint('Chạm nút ♫ để bật nhạc nhé!'); updateMusicButton(); });
  }
  return attempt;
}
// Attempt sound on load. Some browsers block audible autoplay.
window.addEventListener('load', () => { if (!pausedByUser) startMusic(false); });
openInvite.addEventListener('click', () => {
  if (introOpened) return;
  introOpened = true;
  openInvite.disabled = true;
  pausedByUser = false;
  startMusic(true);
  opening.classList.add('opening-animation');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.setTimeout(() => opening.classList.add('opening-out'), reduce ? 180 : 2450);
  window.setTimeout(() => {
    document.body.classList.remove('intro-locked');
    opening.remove();
  }, reduce ? 400 : 3340);
});
musicToggle.addEventListener('click', () => {
  if (bgMusic.paused) { pausedByUser = false; startMusic(true); }
  else { pausedByUser = true; bgMusic.pause(); }
});
bgMusic.addEventListener('play', () => { musicHint.hidden = true; updateMusicButton(); });
bgMusic.addEventListener('pause', updateMusicButton);
bgMusic.addEventListener('error', () => hint('Không tải được nhạc. Kiểm tra assets/wedding.mp3'));
updateMusicButton();
// Reveal sections. If unsupported, leave everything visible.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px 40px 0px', threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
// CSS petals: never opens a separate video on mobile.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width:720px)').matches;
const maxPetals = mobile ? 13 : 23;
function addPetal() {
  if (document.hidden || reduceMotion.matches || petalLayer.childElementCount >= maxPetals) return;
  const el = document.createElement('span');
  el.className = Math.random() > .68 ? 'petal soft' : 'petal';
  el.style.left = Math.random() * 99 + 'vw';
  el.style.width = 8 + Math.random() * 8 + 'px';
  el.style.height = 10 + Math.random() * 12 + 'px';
  el.style.setProperty('--drift', Math.round(Math.random() * 170 - 85) + 'px');
  el.style.setProperty('--speed', (8 + Math.random() * 6).toFixed(1) + 's');
  petalLayer.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}
if (!reduceMotion.matches) {
  for (let i = 0; i < 7; i++) setTimeout(addPetal, i * 210);
  setInterval(addPetal, mobile ? 870 : 630);
}
let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (limit > 0 ? (window.scrollY / limit * 100) : 0) + '%';
    ticking = false;
  });
}, { passive:true });
