/* ============================================================
  codedbysanu — Dev Dashboard · script.js
   ============================================================ */

'use strict';

// ── DOM ──────────────────────────────────────────────────────
const canvas      = document.getElementById('space-canvas');
const ctx         = canvas.getContext('2d');
const repoGridEl  = document.getElementById('repo-grid');
const errorBoxEl  = document.getElementById('error-box');
const clockEl     = document.getElementById('clock');
const terminalOut = document.getElementById('terminal-output');
const cursorEl    = document.getElementById('cursor');
const repoCountEl = document.getElementById('repo-count');

// ============================================================
// 1. CANVAS — MINIMAL, PERFORMANT STARFIELD
//    One layer only. Nodes drift and connect.
//    NO float animation on cards — canvas handles all motion.
// ============================================================

let W, H, stars = [], raf;
const STAR_COUNT = 55;           // Reduced: enough visual, low CPU cost
const CONNECT_DIST = 100;
const pointer = { x: null, y: null, r: 130 };

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
  resize();
  initStars();
});

window.addEventListener('mousemove', e => { pointer.x = e.clientX; pointer.y = e.clientY; });
window.addEventListener('touchmove', e => {
  pointer.x = e.touches[0].clientX;
  pointer.y = e.touches[0].clientY;
}, { passive: true });
window.addEventListener('mouseleave', () => { pointer.x = null; pointer.y = null; });
window.addEventListener('touchend',   () => { pointer.x = null; pointer.y = null; });

class Star {
  constructor() { this.reset(true); }

  reset(random = false) {
    this.x    = random ? Math.random() * W : Math.random() * W;
    this.y    = random ? Math.random() * H : -5;
    this.r    = Math.random() * 1.4 + 0.4;
    this.vx   = (Math.random() - 0.5) * 0.35;
    this.vy   = (Math.random() - 0.5) * 0.35;
    this.mass = Math.random() * 15 + 5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap edges instead of bounce — feels more like space
    if (this.x < -10) this.x = W + 10;
    if (this.x > W + 10) this.x = -10;
    if (this.y < -10) this.y = H + 10;
    if (this.y > H + 10) this.y = -10;

    // Repulsion from pointer
    if (pointer.x !== null) {
      const dx   = pointer.x - this.x;
      const dy   = pointer.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist < pointer.r && dist > 0) {
        const force = ((pointer.r - dist) / pointer.r) * this.mass * 0.012;
        this.x -= (dx / dist) * force;
        this.y -= (dy / dist) * force;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 220, 180, 0.75)';
    ctx.fill();
  }
}

function initStars() {
  stars = Array.from({ length: STAR_COUNT }, () => new Star());
}

function drawConnections() {
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx   = stars[i].x - stars[j].x;
      const dy   = stars[i].y - stars[j].y;
      const dist = Math.hypot(dx, dy);
      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.28;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 220, 180, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.moveTo(stars[i].x, stars[i].y);
        ctx.lineTo(stars[j].x, stars[j].y);
        ctx.stroke();
      }
    }
  }
}

function tick() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  stars.forEach(s => { s.update(); s.draw(); });
  raf = requestAnimationFrame(tick);
}

resize();
initStars();
tick();

// Pause canvas when tab is hidden — saves battery on phone
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    cancelAnimationFrame(raf);
  } else {
    tick();
  }
});


// ============================================================
// 2. LIVE CLOCK
// ============================================================

function updateClock() {
  clockEl.textContent = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata'
  });
}
setInterval(updateClock, 1000);
updateClock();


// ============================================================
// 3. TERMINAL TYPEWRITER
//    Sequence: prompt → command → output, line by line.
//    Cursor hides after sequence completes.
// ============================================================

const SEQUENCE = [
  { type: 'prompt', text: '$ whoami' },
  { type: 'out',    text: 'saniya · codedbysanu', cls: 't-highlight' },
  { type: 'gap' },
  { type: 'prompt', text: '$ cat stack.txt' },
  { type: 'out',    text: 'HTML · CSS · JavaScript · C · Bash/Linux', cls: '' },
  { type: 'gap' },
  { type: 'prompt', text: '$ cat status.txt' },
  { type: 'out',    text: 'aiml diploma → targeting IT/CE lateral entry', cls: 't-amber' },
  { type: 'out',    text: 'cybersecurity & tech ', cls: '' },
  { type: 'gap' } 
];

// Speeds in ms
const SPEED_PROMPT = 38;   // typing speed for prompt lines
const SPEED_OUT    = 18;   // faster for output lines
const PAUSE_AFTER  = 320;  // pause after command before showing output

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function addLine(cls = '') {
  const span = document.createElement('span');
  span.className = `t-line ${cls}`;
  terminalOut.appendChild(span);
  return span;
}

async function typeText(el, text, speed) {
  for (const char of text) {
    el.textContent += char;
    await sleep(speed + Math.random() * (speed * 0.5)); // slight jitter = human feel
  }
}

async function runTerminal() {
  await sleep(600); // small initial delay

  for (const item of SEQUENCE) {
    if (item.type === 'gap') {
      addLine();
      await sleep(80);
      continue;
    }

    if (item.type === 'prompt') {
      const line = addLine();
      // Render prompt symbol in cyan
      const promptSpan = document.createElement('span');
      promptSpan.className = 't-prompt';
      promptSpan.textContent = '$ ';
      line.appendChild(promptSpan);

      // Type the command part after the prompt
      const cmdSpan = document.createElement('span');
      cmdSpan.className = 't-cmd';
      line.appendChild(cmdSpan);
      await typeText(cmdSpan, item.text.slice(2), SPEED_PROMPT);
      await sleep(PAUSE_AFTER);
      continue;
    }

    if (item.type === 'out') {
      const line = addLine(`t-out ${item.cls || ''}`);
      await typeText(line, item.text, SPEED_OUT);
      await sleep(60);
    }
  }

  // After sequence: cursor keeps blinking on last line (done via CSS)
  // Just move cursor to end
  terminalOut.appendChild(cursorEl);
}

runTerminal();


// ============================================================
// 4. GITHUB API + INTERSECTION OBSERVER
// ============================================================

const USERNAME = 'codedbysanu';
const API_URL  = `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=12`;

// Observer: trigger card-in animation only when card scrolls into view
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

async function fetchRepos() {
  try {
    const res = await fetch(API_URL, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!res.ok) {
      const remaining = res.headers.get('X-RateLimit-Remaining');
      if (res.status === 403 || remaining === '0') {
        throw new Error('GitHub API rate limit hit. Try again in ~60 min.');
      }
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }

    const repos = await res.json();
    renderRepos(repos);
  } catch (err) {
    repoGridEl.innerHTML = '';
    errorBoxEl.textContent = err.message;
    errorBoxEl.classList.remove('hidden');
  }
}

function renderRepos(repos) {
  // Filter forks, sort by updated, take top 10
  const filtered = repos
    .filter(r => !r.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 10);

  repoGridEl.innerHTML = '';

  if (filtered.length === 0) {
    repoGridEl.innerHTML = '<div class="loading-state">no repositories found.</div>';
    return;
  }

  repoCountEl.textContent = `${filtered.length} repos`;

  filtered.forEach((repo, i) => {
    const updated = new Date(repo.updated_at).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric'
    });

    const card = document.createElement('a');
    card.className = 'repo-card';
    card.href = repo.html_url;
    card.target = '_blank';
    card.rel = 'noopener';
    card.setAttribute('aria-label', `View ${repo.name} on GitHub`);

    // Stagger delay: cap at 4 columns worth
    card.style.animationDelay       = `${(i % 4) * 90}ms`;
    card.style.animationPlayState   = 'paused';

    const langDisplay = repo.language || 'misc';
    const stars       = repo.stargazers_count;

    card.innerHTML = `
      <span class="repo-name">${repo.name}</span>
      <p class="repo-desc">${repo.description || 'no description yet.'}</p>
      <div class="repo-meta">
        <span class="repo-lang">[${langDisplay}]</span>
        <span class="repo-stars">★ ${stars}</span>
        <span>${updated}</span>
      </div>
    `;

    repoGridEl.appendChild(card);
    observer.observe(card);
  });
}

fetchRepos();
