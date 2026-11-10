'use strict';
const intro = document.getElementById('intro');
const openButton = document.getElementById('openInvite');
const music = document.getElementById('bgMusic');
const toggle = document.getElementById('musicToggle');
const state = document.getElementById('musicState');
const notice = document.getElementById('musicNotice');
const petals = document.getElementById('petals');
const progress = document.getElementById('scrollProgress');
const backTop = document.querySelector('.back-top');
let userPaused = false;
let musicNotificationTimer;
music.volume = .48;
function updateMusic(){const on=!music.paused;state.textContent=on?'Tắt nhạc':'Bật nhạc';toggle.classList.toggle('is-playing',on);toggle.setAttribute('aria-label',on?'Tắt nhạc':'Bật nhạc');}
function notify(message){notice.textContent=message;notice.hidden=false;clearTimeout(musicNotificationTimer);musicNotificationTimer=setTimeout(()=>notice.hidden=true,3900);}
function playMusic(showTip=false){
  // Called directly from click/pointer gesture where possible.
  const attempt=music.play();
  if(attempt&&typeof attempt.catch==='function')attempt.catch(()=>{updateMusic();if(showTip)notify('Chạm nút ♫ để bật nhạc nhé!');});
  return attempt;
}
// Some desktop browsers allow autoplay; iOS/Android browsers may prohibit audible autoplay.
window.addEventListener('load',()=>{playMusic(false);});
openButton.addEventListener('click',()=>{
  userPaused=false;
  playMusic(true); // start in same user gesture before any asynchronous work
  intro.classList.add('opening');
  openButton.disabled=true;
  setTimeout(()=>{
    intro.classList.add('is-open');
    document.body.classList.remove('intro-active');
    document.querySelectorAll('.hero .reveal').forEach(el=>el.classList.add('visible'));
  },850);
  setTimeout(()=>intro.remove(),2000);
});
toggle.addEventListener('click',()=>{
  if(music.paused){userPaused=false;playMusic(true)}
  else{userPaused=true;music.pause()}
});
music.addEventListener('play',()=>{notice.hidden=true;updateMusic()});
music.addEventListener('pause',updateMusic);
music.addEventListener('error',()=>notify('Không tải được file nhạc. Vui lòng kiểm tra assets/wedding.mp3'));
updateMusic();
// Reduced-motion friendly reveal effects.
const revealObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}},{threshold:.09,rootMargin:'0px 0px -30px 0px'}):null;
document.querySelectorAll('.reveal').forEach(el=>revealObserver?revealObserver.observe(el):el.classList.add('visible'));
// Falling petals are CSS shapes, not videos, so they remain inline on mobile.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const maxPetals=window.matchMedia('(max-width: 600px)').matches?14:25;
function petal(){if(document.hidden||reduceMotion.matches||petals.childElementCount>=maxPetals)return;const el=document.createElement('span');el.className='petal'+(Math.random()<.35?' light':'');el.style.left=(Math.random()*100)+'vw';el.style.width=(8+Math.random()*11)+'px';el.style.height=(11+Math.random()*15)+'px';el.style.setProperty('--drift',(Math.random()*200-100)+'px');el.style.setProperty('--duration',(8+Math.random()*7)+'s');petals.append(el);el.addEventListener('animationend',()=>el.remove(),{once:true});}
if(!reduceMotion.matches){for(let i=0;i<9;i++)setTimeout(petal,i*180);setInterval(petal,680);}
let scrollScheduled=false;
function onScroll(){if(scrollScheduled)return;scrollScheduled=true;requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.width=(max>0?scrollY/max*100:0)+'%';backTop.classList.toggle('show',scrollY>500);scrollScheduled=false;});}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
