// CHỈNH THÔNG TIN TẠI ĐÂY. Thay đường dẫn mẫu bằng liên kết thực tế.
const CONFIG = {
  rsvpUrl: '', // Ví dụ: 'https://docs.google.com/forms/d/e/XXXXX/viewform'
  intimateAddress: '[Điền địa chỉ tiệc thân mật]',
  intimateMapUrl: '', // Dán link Google Maps
  weddingAddress: '[Điền địa chỉ tiệc cưới]',
  weddingMapUrl: '' // Dán link Google Maps
};
const $ = id => document.getElementById(id);
$('intimateAddress').textContent = CONFIG.intimateAddress;
$('weddingAddress').textContent = CONFIG.weddingAddress;
function setLink(id,url){if(url && /^https:\/\//i.test(url)) $(id).href=url; else $(id).removeAttribute('href');}
setLink('intimateMap',CONFIG.intimateMapUrl);setLink('weddingMap',CONFIG.weddingMapUrl);
if(CONFIG.rsvpUrl && /^https:\/\//i.test(CONFIG.rsvpUrl)) $('rsvpButton').href=CONFIG.rsvpUrl;
else {$('rsvpButton').href='#';$('rsvpButton').addEventListener('click',e=>{e.preventDefault();alert('Cần thêm link Google Forms vào script.js → CONFIG.rsvpUrl trước khi gửi thiệp.');});}
const audio=$('bgMusic'), toggle=$('musicToggle');let started=false;
function updateMusic(){ $('musicState').textContent=audio.paused?'Tắt':'Bật';toggle.setAttribute('aria-label',audio.paused?'Bật nhạc':'Tắt nhạc');}
async function playMusic(){try{await audio.play();}catch(err){console.info('Nhạc chưa thể phát. Hãy kiểm tra tệp MP3 và thao tác người dùng.',err);}updateMusic();}
$('openInvite').addEventListener('click',()=>{$('cover').classList.add('hidden');started=true;playMusic();});
toggle.addEventListener('click',()=>{if(audio.paused)playMusic();else{audio.pause();updateMusic();}});
audio.addEventListener('pause',updateMusic);audio.addEventListener('play',updateMusic);
const petals=$('petals');let count=0;function spawnPetal(){if(document.hidden||window.matchMedia('(prefers-reduced-motion: reduce)').matches||count>=25)return;const el=document.createElement('i');el.className='petal';el.style.left=Math.random()*100+'%';el.style.opacity=(.25+Math.random()*.4).toString();el.style.setProperty('--drift',(Math.random()*180-90)+'px');el.style.animationDuration=(6+Math.random()*6)+'s';el.style.width=(8+Math.random()*8)+'px';petals.appendChild(el);count++;el.addEventListener('animationend',()=>{el.remove();count--;},{once:true});}
setInterval(spawnPetal,650);for(let i=0;i<7;i++)setTimeout(spawnPetal,i*220);
