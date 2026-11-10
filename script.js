const audio = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicState = document.getElementById('musicState');
const notice = document.getElementById('musicNotice');
const petals = document.getElementById('petals');

let autoplayBlocked = false;
let musicStarted = false;

function updateMusicUI() {
  const paused = audio.paused;
  musicState.textContent = paused ? 'Bật nhạc' : 'Tắt nhạc';
  musicToggle.setAttribute('aria-label', paused ? 'Bật nhạc' : 'Tắt nhạc');
}

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
  clearTimeout(showNotice._timer);
  showNotice._timer = setTimeout(() => {
    notice.hidden = true;
  }, 4500);
}

async function tryPlayMusic(showBlockedNotice = false) {
  if (!audio) return;
  audio.volume = 0.45;
  try {
    await audio.play();
    musicStarted = true;
    autoplayBlocked = false;
    notice.hidden = true;
  } catch (err) {
    autoplayBlocked = true;
    if (showBlockedNotice) {
      showNotice('Trình duyệt đang chặn nhạc tự động. Chạm vào màn hình để bật nhạc ♡');
    }
  }
  updateMusicUI();
}

function setupMusic() {
  updateMusicUI();

  window.addEventListener('load', () => {
    tryPlayMusic(true);
  });

  document.addEventListener('pointerdown', () => {
    if (audio.paused) tryPlayMusic(false);
  }, { once: true });

  document.addEventListener('touchstart', () => {
    if (audio.paused) tryPlayMusic(false);
  }, { once: true, passive: true });

  musicToggle.addEventListener('click', async () => {
    if (audio.paused) {
      await tryPlayMusic(false);
    } else {
      audio.pause();
      updateMusicUI();
    }
  });

  audio.addEventListener('play', updateMusicUI);
  audio.addEventListener('pause', updateMusicUI);
}

function spawnPetal() {
  if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (petals.childElementCount > 34) return;

  const petal = document.createElement('i');
  petal.className = 'petal';
  petal.style.left = Math.random() * 100 + '%';
  petal.style.opacity = (0.38 + Math.random() * 0.42).toString();
  petal.style.width = (10 + Math.random() * 10) + 'px';
  petal.style.height = (14 + Math.random() * 14) + 'px';
  petal.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
  petal.style.animationDuration = (7 + Math.random() * 7) + 's';
  petals.appendChild(petal);

  petal.addEventListener('animationend', () => {
    petal.remove();
  }, { once: true });
}

function startPetals() {
  for (let i = 0; i < 10; i++) {
    setTimeout(spawnPetal, i * 240);
  }
  setInterval(spawnPetal, 620);
}

setupMusic();
startPetals();
