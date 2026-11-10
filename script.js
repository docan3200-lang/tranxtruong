'use strict';
const intro = document.getElementById('intro');
const openInvite = document.getElementById('openInvite');
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicState = document.getElementById('musicState');
const musicNotice = document.getElementById('musicNotice');
const petalsWrap = document.getElementById('petals');
const progressBar = document.getElementById('progressBar');

music.volume = 0.46;
let noticeTimer;

function updateMusicUI() {
  const isPlaying = !music.paused;
  musicState.textContent = isPlaying ? 'Tắt nhạc' : 'Bật nhạc';
  musicToggle.setAttribute('aria-label', isPlaying ? 'Tắt nhạc' : 'Bật nhạc');
}

function showNotice(text) {
  musicNotice.textContent = text;
  musicNotice.hidden = false;
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => {
    musicNotice.hidden = true;
  }, 4200);
}

async function tryPlayMusic(showTip = false) {
  try {
    await music.play();
    musicNotice.hidden = true;
  } catch (error) {
    if (showTip) showNotice('Trình duyệt có thể chặn nhạc tự động. Chạm vào trang để bật nhạc nhé.');
  }
  updateMusicUI();
}

window.addEventListener('load', () => {
  tryPlayMusic(false);
});

openInvite.addEventListener('click', () => {
  // Kích hoạt nhạc ngay trong sự kiện chạm, không chờ Promise trước hoạt ảnh.
  void tryPlayMusic(true);
  intro.classList.add('opening');
  openInvite.disabled = true;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cardReveal = reduced ? 100 : 1050;
  const leave = reduced ? 250 : 3100;
  setTimeout(() => intro.classList.add('card-revealed'), cardReveal);
  setTimeout(() => intro.classList.add('is-open'), leave);
  setTimeout(() => {
    document.body.classList.remove('has-intro');
    intro.remove();
  }, leave + (reduced ? 50 : 850));
});

musicToggle.addEventListener('click', async () => {
  if (music.paused) {
    await tryPlayMusic(true);
  } else {
    music.pause();
    updateMusicUI();
  }
});

music.addEventListener('play', updateMusicUI);
music.addEventListener('pause', updateMusicUI);
music.addEventListener('error', () => showNotice('Không tải được file nhạc. Hãy kiểm tra assets/wedding.mp3'));
updateMusicUI();

const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  : null;

document.querySelectorAll('.reveal').forEach((el) => {
  if (!el.classList.contains('visible')) {
    if (observer) observer.observe(el);
    else el.classList.add('visible');
  }
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile = window.matchMedia('(max-width: 767px)').matches;
const maxPetals = mobile ? 14 : 24;

function spawnPetal() {
  if (document.hidden || reduceMotion.matches || petalsWrap.childElementCount >= maxPetals) return;
  const petal = document.createElement('span');
  petal.className = 'petal' + (Math.random() < 0.35 ? ' light' : '');
  petal.style.left = Math.random() * 100 + 'vw';
  petal.style.width = 8 + Math.random() * 10 + 'px';
  petal.style.height = 11 + Math.random() * 13 + 'px';
  petal.style.setProperty('--drift', (Math.random() * 180 - 90) + 'px');
  petal.style.setProperty('--duration', (8 + Math.random() * 6) + 's');
  petalsWrap.appendChild(petal);
  petal.addEventListener('animationend', () => petal.remove(), { once: true });
}

if (!reduceMotion.matches) {
  for (let i = 0; i < 8; i++) setTimeout(spawnPetal, i * 210);
  setInterval(spawnPetal, 700);
}

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();
