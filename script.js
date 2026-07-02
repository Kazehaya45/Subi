/* ===========================================================
   SUBI — Apology Visual Novel — script.js
   =========================================================== */

/* ---------------------------------------------------------
   0. CHIBI CHARACTER BUILDER (single reusable SVG)
   --------------------------------------------------------- */
function chibiMarkup(){
  return `
  <svg class="chibi" viewBox="0 0 200 280">
    <g class="chibi-body-float">
      <ellipse class="chibi-shadow" cx="100" cy="272" rx="46" ry="8" fill="rgba(90,60,80,0.15)"/>
      <!-- legs -->
      <rect x="72" y="238" width="20" height="28" rx="9" fill="#7a6a99"/>
      <rect x="108" y="238" width="20" height="28" rx="9" fill="#7a6a99"/>
      <ellipse cx="82" cy="266" rx="14" ry="8" fill="#4a3d5c"/>
      <ellipse cx="118" cy="266" rx="14" ry="8" fill="#4a3d5c"/>
      <!-- body/hoodie -->
      <path class="hoodie-body" d="M60 150 C60 130 80 120 100 120 C120 120 140 130 140 150 L146 232 C146 248 128 256 100 256 C72 256 54 248 54 232 Z" fill="#c9b3f5"/>
      <path class="hoodie-collar" d="M78 121 Q100 146 122 121 Q100 116 78 121 Z" fill="#b299e8"/>
      <circle cx="94" cy="168" r="4" fill="#8a72c2"/>
      <circle cx="106" cy="168" r="4" fill="#8a72c2"/>
      <!-- arms -->
      <ellipse class="arm arm-left" cx="50" cy="172" rx="15" ry="32" fill="#c9b3f5" transform="rotate(14 50 172)"/>
      <g class="arm arm-right">
        <ellipse cx="150" cy="172" rx="15" ry="32" fill="#c9b3f5" transform="rotate(-14 150 172)"/>
      </g>
      <!-- head -->
      <g class="chibi-head-tilt">
        <path class="hair-back" d="M40 95 C40 38 66 12 100 12 C134 12 160 38 160 95 C150 68 130 58 100 58 C70 58 50 68 40 95 Z" fill="#6b4630"/>
        <circle class="face" cx="100" cy="96" r="56" fill="#ffe3c7"/>
        <!-- ears -->
        <circle cx="45" cy="100" r="9" fill="#ffe3c7"/>
        <circle cx="155" cy="100" r="9" fill="#ffe3c7"/>

        <!-- eyes -->
        <g class="eyes-normal chibi-eyes-group">
          <ellipse cx="78" cy="99" rx="9.5" ry="12.5" fill="#3a2e2e"/>
          <ellipse cx="122" cy="99" rx="9.5" ry="12.5" fill="#3a2e2e"/>
          <circle cx="81" cy="93" r="3" fill="#fff"/>
          <circle cx="125" cy="93" r="3" fill="#fff"/>
        </g>
        <g class="eyes-happy chibi-eyes-group">
          <path d="M68 99 Q78 88 88 99" stroke="#3a2e2e" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M112 99 Q122 88 132 99" stroke="#3a2e2e" stroke-width="4.5" fill="none" stroke-linecap="round"/>
        </g>
        <g class="eyes-nervous chibi-eyes-group">
          <ellipse cx="78" cy="101" rx="7" ry="9" fill="#3a2e2e"/>
          <ellipse cx="122" cy="101" rx="7" ry="9" fill="#3a2e2e"/>
          <path d="M68 87 Q78 82 86 88" stroke="#3a2e2e" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M114 88 Q122 82 132 87" stroke="#3a2e2e" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
        <g class="eyes-sad chibi-eyes-group">
          <ellipse cx="78" cy="103" rx="9" ry="11" fill="#3a2e2e"/>
          <ellipse cx="122" cy="103" rx="9" ry="11" fill="#3a2e2e"/>
          <path d="M70 90 Q78 96 88 92" stroke="#3a2e2e" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M112 92 Q122 96 130 90" stroke="#3a2e2e" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
        <g class="eyes-closed chibi-eyes-group">
          <path d="M68 99 Q78 103 88 99" stroke="#3a2e2e" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M112 99 Q122 103 132 99" stroke="#3a2e2e" stroke-width="4" fill="none" stroke-linecap="round"/>
        </g>

        <path class="sweat" d="M138 74 q5 9 0 15 q-5 -2 -3 -9 q1 -4 3 -6" fill="#bfe6ff"/>

        <g class="blush">
          <ellipse cx="66" cy="113" rx="9" ry="6" fill="#ff9fb8"/>
          <ellipse cx="134" cy="113" rx="9" ry="6" fill="#ff9fb8"/>
        </g>

        <path class="mouth mouth-smile" d="M85 128 Q100 142 115 128" stroke="#c2555f" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path class="mouth mouth-nervous" d="M90 130 Q100 126 110 130" stroke="#c2555f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path class="mouth mouth-sad" d="M88 133 Q100 122 112 133" stroke="#c2555f" stroke-width="3.5" fill="none" stroke-linecap="round"/>

        <path class="hair-front" d="M42 68 C52 42 78 30 100 30 C122 30 148 42 158 68 C142 52 122 47 100 47 C78 47 58 52 42 68 Z" fill="#5a3a26"/>
      </g>
    </g>
  </svg>`;
}

function mountChibis(){
  document.querySelectorAll('.chibi-wrap').forEach(wrap=>{
    const expr = wrap.getAttribute('data-expr') || 'smile';
    wrap.innerHTML = chibiMarkup();
    const svg = wrap.querySelector('.chibi');
    svg.setAttribute('data-expr', expr);
    // random blink cycle
    scheduleBlink(svg, expr);
  });
}

function scheduleBlink(svg, baseExpr){
  if(baseExpr === 'sad' || baseExpr === 'nervous') return; // keep their expression steady
  const blink = ()=>{
    const current = svg.getAttribute('data-expr');
    if(current !== baseExpr) return; // don't blink mid-transition
    svg.setAttribute('data-expr','blink');
    setTimeout(()=> svg.setAttribute('data-expr', baseExpr), 160);
  };
  setInterval(blink, 3200 + Math.random()*2600);
}

function setExpr(wrapEl, expr, revertTo, revertAfter){
  const svg = wrapEl.querySelector('.chibi');
  if(!svg) return;
  svg.setAttribute('data-expr', expr);
  if(revertTo){
    setTimeout(()=> svg.setAttribute('data-expr', revertTo), revertAfter || 1400);
  }
}

/* ---------------------------------------------------------
   1. AUDIO ENGINE (Web Audio API — synthesized, no files)
   --------------------------------------------------------- */
const AudioEngine = (()=>{
  let ctx=null, masterGain=null, padGain=null, isMuted=false, started=false;
  let padOsc1=null, padOsc2=null, lfo=null;

  function init(){
    if(started) return;
    started = true;
    ctx = new (window.AudioContext||window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.9;
    masterGain.connect(ctx.destination);

    // soft ambient pad
    padGain = ctx.createGain();
    padGain.gain.value = 0.05;
    padGain.connect(masterGain);

    padOsc1 = ctx.createOscillator();
    padOsc1.type = 'sine';
    padOsc1.frequency.value = 261.6; // C4
    padOsc2 = ctx.createOscillator();
    padOsc2.type = 'sine';
    padOsc2.frequency.value = 329.6; // E4

    lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(padGain.gain);

    padOsc1.connect(padGain);
    padOsc2.connect(padGain);
    padOsc1.start(); padOsc2.start(); lfo.start();
  }

  function blip(freq=880, dur=0.12, type='sine', vol=0.16){
    if(!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = vol;
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g); g.connect(masterGain);
    o.start();
    o.stop(ctx.currentTime + dur + 0.05);
  }

  return {
    unlock(){ if(!started) init(); if(ctx && ctx.state==='suspended') ctx.resume(); },
    click(){ this.unlock(); blip(720,0.09,'triangle',0.14); },
    chime(){ this.unlock(); blip(880,0.35,'sine',0.12); setTimeout(()=>blip(1180,0.4,'sine',0.1),120); },
    pop(){ this.unlock(); blip(500+Math.random()*300,0.15,'square',0.06); },
    sparkle(){ this.unlock(); blip(1400+Math.random()*400,0.2,'sine',0.05); },
    toggleMute(){
      this.unlock();
      isMuted = !isMuted;
      if(masterGain) masterGain.gain.setTargetAtTime(isMuted?0:0.9, ctx.currentTime, 0.2);
      return isMuted;
    },
    get muted(){ return isMuted; }
  };
})();

document.addEventListener('click', ()=> AudioEngine.unlock(), { once:true });

const soundToggle = document.getElementById('soundToggle');
soundToggle.addEventListener('click', ()=>{
  const muted = AudioEngine.toggleMute();
  soundToggle.querySelector('.icon-on').style.display = muted? 'none':'block';
  soundToggle.querySelector('.icon-off').style.display = muted? 'block':'none';
});

function playClick(){ AudioEngine.click(); }

/* ---------------------------------------------------------
   2. LOADER
   --------------------------------------------------------- */
window.addEventListener('DOMContentLoaded', ()=>{
  mountChibis();
  buildLoaderPetals();
  buildNavDots();
  buildScene3Decor();
  buildScene6Garden();
  buildScene8Decor();
  initAmbientCanvas();
  initCursor();

  let progress = 0;
  const fill = document.getElementById('loaderFill');
  const timer = setInterval(()=>{
    progress += Math.random()*18 + 6;
    if(progress >= 100){
      progress = 100;
      clearInterval(timer);
      fill.style.width = '100%';
      setTimeout(()=>{
        document.getElementById('loader').classList.add('hide');
        AudioEngine.unlock();
      }, 400);
      return;
    }
    fill.style.width = progress + '%';
  }, 260);
});

function buildLoaderPetals(){
  const holder = document.getElementById('loaderPetals');
  for(let i=0;i<14;i++){
    const p = document.createElement('div');
    const size = 10+Math.random()*10;
    p.style.cssText = `position:absolute; left:${Math.random()*100}%; top:-20px; width:${size}px; height:${size}px;
      background: radial-gradient(circle at 30% 30%, #ffd7e6, #ff9fc2); border-radius: 60% 40% 60% 40%;
      opacity:.85; animation: petalFallLoader ${5+Math.random()*4}s linear ${Math.random()*3}s infinite;`;
    holder.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `@keyframes petalFallLoader{ from{ transform: translateY(-20px) rotate(0deg);} to{ transform: translateY(110vh) rotate(360deg);} }`;
  document.head.appendChild(style);
}

/* ---------------------------------------------------------
   3. NAV DOTS + SCROLL SPY
   --------------------------------------------------------- */
function buildNavDots(){
  const scenes = document.querySelectorAll('.scene');
  const nav = document.getElementById('sceneNav');
  scenes.forEach((s,i)=>{
    const b = document.createElement('button');
    b.title = s.dataset.title || ('Scene '+(i+1));
    b.addEventListener('click', ()=>{ playClick(); s.scrollIntoView({behavior:'smooth'}); });
    nav.appendChild(b);
  });
  const dots = nav.querySelectorAll('button');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const idx = Array.from(scenes).indexOf(e.target);
        dots.forEach(d=>d.classList.remove('active'));
        dots[idx].classList.add('active');
        onSceneEnter(e.target.id);
      }
    });
  }, { threshold: 0.5 });
  scenes.forEach(s=>io.observe(s));
}

function scrollToId(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:'smooth'});
}

function onSceneEnter(id){
  if(id === 'scene3') revealAppreciationCards();
  if(id === 'scene5') maybeInitGame();
  if(id === 'scene9') triggerConfettiBurst();
}

/* ---------------------------------------------------------
   4. CURSOR GLOW + PARTICLE TRAIL
   --------------------------------------------------------- */
function initCursor(){
  const glow = document.getElementById('cursorGlow');
  const canvas = document.getElementById('cursorParticles');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);

  let particles = [];
  let last = {x: window.innerWidth/2, y: window.innerHeight/2};

  window.addEventListener('mousemove', (e)=>{
    glow.style.left = e.clientX+'px';
    glow.style.top = e.clientY+'px';
    const dist = Math.hypot(e.clientX-last.x, e.clientY-last.y);
    if(dist > 18){
      particles.push({x:e.clientX,y:e.clientY,vx:(Math.random()-0.5)*0.6,vy:-Math.random()*0.8-0.3,life:1,size:2+Math.random()*3});
      last = {x:e.clientX,y:e.clientY};
    }
  });

  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy; p.life -= 0.02;
      ctx.globalAlpha = Math.max(p.life,0);
      ctx.fillStyle = '#ff9fc2';
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fill();
    });
    particles = particles.filter(p=>p.life>0);
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ---------------------------------------------------------
   5. AMBIENT CANVAS: petals / hearts / sparkles / clouds
   --------------------------------------------------------- */
function initAmbientCanvas(){
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width = window.innerWidth; canvas.height = document.documentElement.scrollHeight; }
  resize(); window.addEventListener('resize', resize);

  const items = [];
  const kinds = ['petal','heart','sparkle'];
  function spawn(){
    if(items.length > 70) return;
    const kind = kinds[Math.floor(Math.random()*kinds.length)];
    items.push({
      kind,
      x: Math.random()*canvas.width,
      y: window.scrollY - 40,
      vy: 0.4+Math.random()*0.7,
      vx: (Math.random()-0.5)*0.6,
      size: kind==='sparkle'? 3+Math.random()*3 : 10+Math.random()*10,
      rot: Math.random()*360,
      vr: (Math.random()-0.5)*2,
      life: 1,
      hue: kind==='petal'? '#ffb6c1' : kind==='heart' ? '#ff8fab' : '#fff4c2'
    });
  }
  setInterval(spawn, 500);

  function drawHeart(x,y,size,color,rot){
    ctx.save();
    ctx.translate(x,y); ctx.rotate(rot*Math.PI/180); ctx.scale(size/20,size/20);
    ctx.beginPath();
    ctx.moveTo(0,4);
    ctx.bezierCurveTo(-10,-6,-20,4,0,18);
    ctx.bezierCurveTo(20,4,10,-6,0,4);
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }
  function drawPetal(x,y,size,color,rot){
    ctx.save();
    ctx.translate(x,y); ctx.rotate(rot*Math.PI/180);
    ctx.beginPath();
    ctx.ellipse(0,0,size/2,size/3.2,0,0,Math.PI*2);
    ctx.fillStyle = color; ctx.fill();
    ctx.restore();
  }
  function drawSparkle(x,y,size,color){
    ctx.save();
    ctx.translate(x,y);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0,-size); ctx.lineTo(size*0.3,-size*0.3); ctx.lineTo(size,0);
    ctx.lineTo(size*0.3,size*0.3); ctx.lineTo(0,size); ctx.lineTo(-size*0.3,size*0.3);
    ctx.lineTo(-size,0); ctx.lineTo(-size*0.3,-size*0.3);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    items.forEach(p=>{
      p.y += p.vy; p.x += p.vx + Math.sin(p.y*0.01)*0.3; p.rot += p.vr;
      const screenBottom = window.scrollY + window.innerHeight + 60;
      if(p.y > screenBottom) p.life = 0;
      ctx.globalAlpha = 0.85;
      if(p.kind==='heart') drawHeart(p.x,p.y,p.size,p.hue,p.rot);
      else if(p.kind==='petal') drawPetal(p.x,p.y,p.size,p.hue,p.rot);
      else drawSparkle(p.x,p.y,p.size,p.hue);
    });
    for(let i=items.length-1;i>=0;i--) if(items[i].life<=0) items.splice(i,1);
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ---------------------------------------------------------
   6. SCENE 1 → SCENE 2
   --------------------------------------------------------- */
document.getElementById('openHeartBtn').addEventListener('click', ()=>{
  playClick(); AudioEngine.chime();
  scrollToId('scene2');
});

/* ---------------------------------------------------------
   7. SCENE 2 — ENVELOPE + TYPEWRITER
   --------------------------------------------------------- */
const LETTER_TEXT = `Hi Subi,

I know I made a mistake. Not one I can brush off, and not one I want to explain away. I've spent real time thinking about what happened, and about how it must have felt on your side of it.

I'm not writing this to defend myself. I just wanted to be honest, and to say it properly instead of leaving it unsaid.

Thank you for reading this far already.`;

let envelopeOpened = false;
document.getElementById('envelope').addEventListener('click', function(){
  if(envelopeOpened) return;
  envelopeOpened = true;
  playClick(); AudioEngine.chime();
  this.classList.add('open');
  document.getElementById('envelopeHint').classList.add('hidden');
  setExpr(document.querySelector('.chibi-scene2'), 'nervous');

  setTimeout(typeLetter, 1300);
});

function typeLetter(){
  const el = document.getElementById('typewriterText');
  let i = 0;
  el.textContent = '';
  const interval = setInterval(()=>{
    el.textContent += LETTER_TEXT[i];
    if(i % 6 === 0) AudioEngine.sparkle();
    i++;
    if(i >= LETTER_TEXT.length){
      clearInterval(interval);
      document.getElementById('scene2Next').classList.remove('hidden');
      setExpr(document.querySelector('.chibi-scene2'), 'hopeful');
    }
  }, 28);
}

document.getElementById('scene2Next').addEventListener('click', ()=>{ playClick(); scrollToId('scene3'); });

/* ---------------------------------------------------------
   8. SCENE 3 — APPRECIATION
   --------------------------------------------------------- */
function buildScene3Decor(){
  const field = document.getElementById('flowerField3');
  const flowerEmojis = ['🌸','🌷','🌼','💮','🌺'];
  for(let i=0;i<22;i++){
    const f = document.createElement('span');
    f.className = 'flower';
    f.textContent = flowerEmojis[Math.floor(Math.random()*flowerEmojis.length)];
    f.style.left = (Math.random()*100)+'%';
    f.style.animationDelay = (Math.random()*2)+'s';
    f.style.fontSize = (1.2+Math.random()*1.4)+'rem';
    field.appendChild(f);
  }
  const bhold = document.getElementById('butterflies3');
  for(let i=0;i<6;i++){
    const b = document.createElement('span');
    b.className='butterfly'; b.textContent='🦋';
    b.style.left = (10+Math.random()*80)+'%';
    b.style.top = (10+Math.random()*70)+'%';
    b.style.animationDuration = (5+Math.random()*4)+'s';
    b.style.animationDelay = (Math.random()*3)+'s';
    bhold.appendChild(b);
  }
}

let cardsRevealed = false;
function revealAppreciationCards(){
  if(cardsRevealed) return; cardsRevealed = true;
  document.querySelectorAll('.app-card').forEach((c,i)=>{
    setTimeout(()=> c.classList.add('in-view'), i*220);
  });
  setExpr(document.querySelector('.chibi-scene3'),'happy','smile',1800);
}
document.getElementById('scene3Next').addEventListener('click', ()=>{ playClick(); scrollToId('scene4'); });

/* ---------------------------------------------------------
   9. SCENE 4 — FLOWER GARDEN / BOUQUET
   --------------------------------------------------------- */
document.getElementById('bouquetWrap').addEventListener('click', function(){
  if(this.classList.contains('given')) return;
  this.classList.add('given');
  playClick(); AudioEngine.chime();
  setExpr(document.querySelector('#chibiWalk'), 'happy');
  burstPetalsAt(this.getBoundingClientRect());
  document.getElementById('gardenMessage').classList.remove('hidden');
  document.getElementById('garden-hint').classList.add('hidden');
  document.getElementById('scene4Next').classList.remove('hidden');
});
document.getElementById('scene4Next').addEventListener('click', ()=>{ playClick(); scrollToId('scene5'); });

function burstPetalsAt(rect){
  const canvas = document.getElementById('ambientCanvas');
  // simple DOM based burst for immediate visual feedback
  for(let i=0;i<24;i++){
    const p = document.createElement('div');
    const size = 8+Math.random()*10;
    const angle = Math.random()*360;
    const dist = 60+Math.random()*120;
    p.style.cssText = `position:fixed; left:${rect.left+rect.width/2}px; top:${rect.top+rect.height/2}px;
      width:${size}px; height:${size}px; border-radius:60% 40% 60% 40%;
      background: radial-gradient(circle at 30% 30%, #ffe1a8, #ff9fc2);
      pointer-events:none; z-index:999; transition: transform 1s ease-out, opacity 1s ease-out;`;
    document.body.appendChild(p);
    requestAnimationFrame(()=>{
      const dx = Math.cos(angle*Math.PI/180)*dist;
      const dy = Math.sin(angle*Math.PI/180)*dist - 60;
      p.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random()*360}deg)`;
      p.style.opacity = '0';
    });
    setTimeout(()=>p.remove(), 1100);
  }
}

/* ---------------------------------------------------------
   10. SCENE 5 — MINI GAME: pop the storm clouds
   --------------------------------------------------------- */
let gameInitialized = false;
let gameScore = 0;
const GAME_TOTAL = 15;
let cloudsLeft = GAME_TOTAL;
let gameStarted = false;

function maybeInitGame(){
  if(gameInitialized) return;
  gameInitialized = true;
  document.getElementById('startGameBtn').classList.remove('hidden');
}

document.getElementById('startGameBtn').addEventListener('click', function(){
  playClick();
  this.classList.add('hidden');
  gameStarted = true;
  spawnClouds();
});

const cloudSVG = `<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="30" cy="38" rx="26" ry="18" fill="#8b84a8"/>
  <ellipse cx="55" cy="28" rx="30" ry="22" fill="#746c94"/>
  <ellipse cx="75" cy="40" rx="20" ry="15" fill="#8b84a8"/>
  <ellipse cx="45" cy="42" rx="34" ry="16" fill="#635b82"/>
</svg>`;

function spawnClouds(){
  const stage = document.getElementById('gameStage');
  const stageRect = stage.getBoundingClientRect();
  for(let i=0;i<GAME_TOTAL;i++){
    setTimeout(()=>{
      if(!gameStarted) return;
      const cloud = document.createElement('div');
      cloud.className = 'storm-cloud';
      cloud.innerHTML = cloudSVG;
      const maxX = stage.clientWidth - 90;
      const maxY = stage.clientHeight - 100;
      cloud.style.left = (20+Math.random()*Math.max(maxX-20,40)) + 'px';
      cloud.style.top = (20+Math.random()*Math.max(maxY-20,40)) + 'px';
      cloud.addEventListener('click', onCloudPop, {once:true});
      stage.appendChild(cloud);
    }, i*450);
  }
}

function onCloudPop(e){
  const cloud = e.currentTarget;
  playClick(); AudioEngine.pop();
  cloud.classList.add('popped');
  gameScore++;
  cloudsLeft--;
  document.getElementById('gameScore').textContent = gameScore;
  document.getElementById('gameCloudsLeft').textContent = Math.max(cloudsLeft,0);
  document.getElementById('gameProgress').style.width = Math.round((gameScore/GAME_TOTAL)*100)+'%';

  const rewards = ['💖','🌸','✨','🌷','💫'];
  const result = document.createElement('div');
  result.className = 'pop-result';
  result.textContent = rewards[Math.floor(Math.random()*rewards.length)];
  result.style.left = cloud.style.left;
  result.style.top = cloud.style.top;
  document.getElementById('gameStage').appendChild(result);
  setTimeout(()=>result.remove(), 1000);

  const chibiGame = document.getElementById('chibiGame');
  const exprs = ['happy','smile'];
  setExpr(chibiGame, exprs[Math.floor(Math.random()*exprs.length)], 'smile', 900);

  setTimeout(()=>cloud.remove(), 500);

  if(gameScore >= GAME_TOTAL){
    setTimeout(()=>{
      document.getElementById('gameVictory').classList.remove('hidden');
      setExpr(chibiGame,'happy');
    }, 600);
  }
}

document.getElementById('scene5Next').addEventListener('click', ()=>{ playClick(); scrollToId('scene6'); });

/* ---------------------------------------------------------
   11. SCENE 6 — MEMORY GARDEN (30+ star messages)
   --------------------------------------------------------- */
const STAR_MESSAGES = [
  "You have a way of making people feel heard.",
  "Your kindness is the kind that doesn't ask for anything back.",
  "You're more thoughtful than you probably give yourself credit for.",
  "The way you care about people is genuinely rare.",
  "You showed patience I didn't always deserve.",
  "Your honesty, even when it was hard, meant something.",
  "You have a good heart. That's not a small thing.",
  "Even on hard days, you still chose to be kind.",
  "You deserve people who show up for you the way you show up for them.",
  "Your time is valuable, and I don't take it for granted.",
  "You listen in a way that makes people feel safe.",
  "You're allowed to take up space and be exactly who you are.",
  "Your strength shows in quiet ways, not just loud ones.",
  "You make the people around you a little braver.",
  "You never owed me your forgiveness, and you still gave me your time.",
  "Your laugh is one of those things that makes a room lighter.",
  "You think of others in ways that often go unnoticed.",
  "You're someone worth knowing, exactly as you are.",
  "Your feelings have always been valid, even when I didn't handle them well.",
  "You carry more grace than you realize.",
  "You have every right to protect your peace.",
  "Your presence made ordinary days feel a little brighter.",
  "You're allowed to move forward at whatever pace feels right.",
  "You gave more understanding than most people would have.",
  "Your voice matters, and it always did.",
  "You are not responsible for anyone else's mistakes.",
  "You deserve softness, especially from yourself.",
  "The care you put into things doesn't go unseen.",
  "You are worthy of good things, simply because you exist.",
  "Whatever you choose from here, I hope it brings you peace.",
  "You made this — whatever it was — better just by being you in it.",
  "I hope your future is full of people who treat you with the care you give so easily."
];

function buildScene6Garden(){
  const starsLayer = document.getElementById('starsLayer');
  const modal = document.getElementById('starModal');
  const modalText = document.getElementById('starModalText');
  const progressEl = document.getElementById('starsProgress');
  let foundCount = 0;

  STAR_MESSAGES.forEach((msg, idx)=>{
    const star = document.createElement('button');
    star.className = 'mem-star';
    star.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.9L22 9.7l-5.5 4.8L18 22l-6-4-6 4 1.5-7.5L2 9.7l7.1-0.8L12 2z"/></svg>`;
    star.style.left = (4+Math.random()*90) + '%';
    star.style.top = (6+Math.random()*82) + '%';
    star.addEventListener('click', ()=>{
      playClick(); AudioEngine.sparkle();
      modalText.textContent = msg;
      modal.classList.remove('hidden');
      if(!star.classList.contains('found')){
        star.classList.add('found');
        foundCount++;
        progressEl.textContent = `${foundCount} / ${STAR_MESSAGES.length} stars found`;
        if(foundCount >= 8) document.getElementById('scene6Next').classList.remove('hidden');
      }
    });
    starsLayer.appendChild(star);
  });

  document.getElementById('starModalClose').addEventListener('click', ()=>{
    playClick();
    modal.classList.add('hidden');
  });

  const fireflyHolder = document.getElementById('fireflies6');
  for(let i=0;i<18;i++){
    const f = document.createElement('span');
    f.className='firefly';
    f.style.left=(Math.random()*100)+'%';
    f.style.top=(Math.random()*100)+'%';
    f.style.animationDuration=(6+Math.random()*6)+'s';
    f.style.animationDelay=(Math.random()*4)+'s';
    fireflyHolder.appendChild(f);
  }
  const lanternHolder = document.getElementById('lanterns6');
  const lanternEmojis = ['🏮'];
  for(let i=0;i<7;i++){
    const l = document.createElement('span');
    l.className='lantern';
    l.textContent = lanternEmojis[0];
    l.style.left=(Math.random()*90)+'%';
    l.style.animationDuration=(11+Math.random()*8)+'s';
    l.style.animationDelay=(Math.random()*10)+'s';
    lanternHolder.appendChild(l);
  }
}

document.getElementById('scene6Next').addEventListener('click', ()=>{ playClick(); scrollToId('scene7'); });

/* ---------------------------------------------------------
   12. SCENE 7 — LETTER
   --------------------------------------------------------- */
document.getElementById('scene7Next').addEventListener('click', ()=>{ playClick(); scrollToId('scene8'); });

/* ---------------------------------------------------------
   13. SCENE 8 — FINAL SUNRISE
   --------------------------------------------------------- */
function buildScene8Decor(){
  const birdsHolder = document.getElementById('birds8');
  for(let i=0;i<5;i++){
    const b = document.createElement('span');
    b.className='bird'; b.textContent='🕊️';
    b.style.top = (10+Math.random()*40)+'%';
    b.style.animationDuration = (10+Math.random()*8)+'s';
    b.style.animationDelay = (Math.random()*6)+'s';
    birdsHolder.appendChild(b);
  }
  const field = document.getElementById('flowerField8');
  const flowerEmojis = ['🌸','🌷','🌼','💮'];
  for(let i=0;i<18;i++){
    const f = document.createElement('span');
    f.className = 'flower';
    f.textContent = flowerEmojis[Math.floor(Math.random()*flowerEmojis.length)];
    f.style.left = (Math.random()*100)+'%';
    f.style.animationDelay = (Math.random()*2)+'s';
    field.appendChild(f);
  }
}

document.getElementById('surpriseBtn').addEventListener('click', ()=>{
  playClick(); AudioEngine.chime();
  scrollToId('scene9');
});

/* ---------------------------------------------------------
   14. SCENE 9 — GIFT + CONFETTI
   --------------------------------------------------------- */
let confettiFired = false;
function triggerConfettiBurst(){
  if(confettiFired) return; confettiFired = true;
  runConfetti(140);
}

function runConfetti(count){
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  const scene = document.getElementById('scene9');
  canvas.width = scene.clientWidth;
  canvas.height = scene.clientHeight;

  const colors = ['#ff8fab','#c9b3f5','#ffd58a','#b6f2c9','#ffe1cf'];
  const pieces = [];
  for(let i=0;i<count;i++){
    pieces.push({
      x: canvas.width/2 + (Math.random()-0.5)*200,
      y: canvas.height*0.3,
      vx: (Math.random()-0.5)*8,
      vy: -Math.random()*8-4,
      size: 5+Math.random()*6,
      color: colors[Math.floor(Math.random()*colors.length)],
      rot: Math.random()*360,
      vr: (Math.random()-0.5)*10,
      life: 1,
      shape: Math.random()>0.5?'rect':'heart'
    });
  }
  function drawHeart(x,y,size,color,rot){
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot*Math.PI/180); ctx.scale(size/20,size/20);
    ctx.beginPath(); ctx.moveTo(0,4);
    ctx.bezierCurveTo(-10,-6,-20,4,0,18);
    ctx.bezierCurveTo(20,4,10,-6,0,4);
    ctx.fillStyle = color; ctx.fill(); ctx.restore();
  }
  function loop(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive = false;
    pieces.forEach(p=>{
      p.vy += 0.15; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if(p.y < canvas.height+20){ alive = true; }
      ctx.globalAlpha = p.life;
      if(p.shape === 'heart') drawHeart(p.x,p.y,p.size,p.color,p.rot);
      else{
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
        ctx.restore();
      }
    });
    ctx.globalAlpha = 1;
    if(alive) requestAnimationFrame(loop);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  loop();
}

document.getElementById('giftBox').addEventListener('click', function(){
  if(this.classList.contains('open')) return;
  this.classList.add('open');
  playClick(); AudioEngine.chime();
  setExpr(document.getElementById('chibiScene9'), 'wave');
  document.getElementById('giftHint').classList.add('hidden');
  document.getElementById('scene9Next').classList.remove('hidden');
  runConfetti(90);

  const rect = this.getBoundingClientRect();
  for(let i=0;i<16;i++){
    setTimeout(()=>{
      const h = document.createElement('div');
      h.className = 'mini-heart';
      h.textContent = '💖';
      h.style.left = (rect.left + rect.width/2 + (Math.random()-0.5)*80) + 'px';
      h.style.top = (rect.top + Math.random()*20) + 'px';
      h.style.position = 'fixed';
      document.body.appendChild(h);
      setTimeout(()=>h.remove(), 2500);
    }, i*100);
  }
});

document.getElementById('scene9Next').addEventListener('click', ()=>{ playClick(); scrollToId('scene10'); });

/* ---------------------------------------------------------
   15. SCENE 10 — CREDITS / RESTART
   --------------------------------------------------------- */
document.getElementById('restartBtn').addEventListener('click', ()=>{
  playClick();
  scrollToId('scene1');
});
