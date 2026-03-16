/* ── DOM refs ── */
const html         = document.documentElement;
const displayEl    = document.getElementById('display');
const currentEl    = document.getElementById('current');
const exprEl       = document.getElementById('expr');
const themeToggle  = document.getElementById('themeToggle');
const historyToggle= document.getElementById('historyToggle');
const historyPanel = document.getElementById('historyPanel');
const historyList  = document.getElementById('historyList');
const clearHistBtn = document.getElementById('clearHistory');

/* ── State ── */
let state = {
  current:           '0',
  prev:              null,
  op:                null,
  justEvaled:        false,
  awaitingNextDigit: false,
};

let calcHistory = [];   // { expr, result }
let historyOpen = false;

/* ──────────────── Display ──────────────── */
function updateDisplay() {
  currentEl.textContent = state.current;
  const len = state.current.length;
  currentEl.className = 'current' +
    (len > 12 ? ' xsmall' : len > 9 ? ' small' : '');
}

function showExpr(str) {
  exprEl.textContent = str;
}

/* ──────────────── Theme ──────────────── */
function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('calc-theme', theme);
}

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// Restore saved theme
const savedTheme = localStorage.getItem('calc-theme');
if (savedTheme) applyTheme(savedTheme);

/* ──────────────── History Panel ──────────────── */
function toggleHistory() {
  historyOpen = !historyOpen;
  historyPanel.classList.toggle('open', historyOpen);
  historyToggle.classList.toggle('active', historyOpen);
}

historyToggle.addEventListener('click', toggleHistory);

clearHistBtn.addEventListener('click', () => {
  calcHistory = [];
  renderHistory();
});

function renderHistory() {
  if (calcHistory.length === 0) {
    historyList.innerHTML = '<li class="history-panel__empty">No calculations yet.</li>';
    return;
  }
  historyList.innerHTML = '';
  // newest first
  [...calcHistory].reverse().forEach((entry, i) => {
    const li = document.createElement('li');
    li.className = 'history-item' + (i === 0 ? ' new' : '');
    li.innerHTML = `
      <span class="history-item__expr">${entry.expr}</span>
      <span class="history-item__result">${entry.result}</span>
    `;
    // Click to recall result
    li.addEventListener('click', () => {
      state.current    = entry.result;
      state.justEvaled = true;
      state.prev       = null;
      state.op         = null;
      showExpr(entry.expr);
      updateDisplay();
    });
    historyList.appendChild(li);
  });
}

function pushHistory(expr, result) {
  calcHistory.push({ expr, result });
  if (calcHistory.length > 50) calcHistory.shift(); // cap at 50
  if (historyOpen) renderHistory();
  // If panel is closed, open it briefly can be annoying — skip auto-open
}

/* ──────────────── Button helpers ──────────────── */
function flash(btn) {
  btn.classList.add('flash');
  setTimeout(() => btn.classList.remove('flash'), 120);
}

function shakeError() {
  displayEl.classList.remove('shake');
  void displayEl.offsetWidth;
  displayEl.classList.add('shake');
  setTimeout(() => displayEl.classList.remove('shake'), 400);
}

function rippleEffect(btn, e) {
  const r    = document.createElement('span');
  r.className = 'ripple';
  const rect  = btn.getBoundingClientRect();
  const size  = Math.max(rect.width, rect.height);
  r.style.cssText = `
    width:${size}px; height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY  - rect.top  - size / 2}px
  `;
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

/* ──────────────── Calculator logic ──────────────── */
function applyOp(a, op, b) {
  const x = parseFloat(a), y = parseFloat(b);
  switch (op) {
    case '+': return x + y;
    case '−': return x - y;
    case '×': return x * y;
    case '÷': return y === 0 ? null : x / y;
  }
}

function formatResult(n) {
  if (n === null || !isFinite(n)) return 'Error';
  return parseFloat(n.toPrecision(12)).toString();
}

function handleAction(action, value) {
  switch (action) {

    case 'digit':
      if (state.justEvaled) {
        state.current    = value;
        state.justEvaled = false;
        showExpr('');
      } else {
        state.current = state.current === '0'
          ? value
          : (state.current.length < 14 ? state.current + value : state.current);
      }
      updateDisplay();
      break;

    case 'dot':
      if (state.justEvaled) {
        state.current    = '0.';
        state.justEvaled = false;
        showExpr('');
      } else if (!state.current.includes('.')) {
        state.current += '.';
      }
      updateDisplay();
      break;

    case 'op':
      if (state.op && !state.justEvaled) {
        const res = applyOp(state.prev, state.op, state.current);
        if (res === null) {
          shakeError();
          state.current = 'Error';
          state.prev = null; state.op = null;
          updateDisplay(); return;
        }
        state.prev    = formatResult(res);
        state.current = state.prev;
      } else {
        state.prev = state.current;
      }
      state.op               = value;
      state.justEvaled       = false;
      state.awaitingNextDigit = true;
      showExpr(`${state.prev} ${value}`);
      updateDisplay();
      break;

    case 'equals': {
      if (state.op && state.prev !== null) {
        const exprStr = `${state.prev} ${state.op} ${state.current}`;
        const res     = applyOp(state.prev, state.op, state.current);
        if (res === null) {
          shakeError();
          state.current = 'Error';
          state.prev = null; state.op = null; state.justEvaled = false;
          updateDisplay(); return;
        }
        const resultStr = formatResult(res);
        showExpr(`${exprStr} =`);
        pushHistory(`${exprStr} =`, resultStr);
        state.current    = resultStr;
        state.prev       = null;
        state.op         = null;
        state.justEvaled = true;
        // Refresh history list if open
        if (historyOpen) renderHistory();
      }
      updateDisplay();
      break;
    }

    case 'clear':
      state = { current:'0', prev:null, op:null, justEvaled:false, awaitingNextDigit:false };
      showExpr('');
      updateDisplay();
      break;

    case 'sign':
      if (state.current !== '0' && state.current !== 'Error') {
        state.current = state.current.startsWith('-')
          ? state.current.slice(1)
          : '-' + state.current;
        updateDisplay();
      }
      break;

    case 'percent':
      if (state.current !== 'Error') {
        state.current    = formatResult(parseFloat(state.current) / 100);
        state.justEvaled = true;
        updateDisplay();
      }
      break;
  }
}

/* ──────────────── Pointer events ──────────────── */
document.querySelector('.grid').addEventListener('pointerdown', e => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  rippleEffect(btn, e);
  flash(btn);

  const { action, value } = btn.dataset;
  if (!action) return;

  if (state.awaitingNextDigit && action === 'digit') {
    state.current           = value;
    state.awaitingNextDigit = false;
    updateDisplay();
    return;
  }
  if (state.awaitingNextDigit && action !== 'op') {
    state.awaitingNextDigit = false;
  }

  handleAction(action, value);
});

/* ──────────────── Keyboard ──────────────── */
document.addEventListener('keydown', e => {
  const map = {
    '0':'0','1':'1','2':'2','3':'3','4':'4',
    '5':'5','6':'6','7':'7','8':'8','9':'9',
    '.':'.', ',':'.',
    '+':'+', '-':'−', '*':'×', '/':'÷',
    'Enter':'=', '=':'=',
    'Backspace':'back', 'Escape':'clear', '%':'percent'
  };
  const k = map[e.key];
  if (!k) return;
  e.preventDefault();

  if (k === 'back') {
    if (state.current.length > 1 && !state.justEvaled && state.current !== 'Error')
      state.current = state.current.slice(0, -1);
    else state.current = '0';
    updateDisplay();
  } else if ('0123456789'.includes(k)) {
    if (state.awaitingNextDigit) {
      state.current = k; state.awaitingNextDigit = false; updateDisplay();
    } else { handleAction('digit', k); }
  } else if (k === '.')      { handleAction('dot'); }
  else if (['+','−','×','÷'].includes(k)) { handleAction('op', k); }
  else if (k === '=')        { handleAction('equals'); }
  else if (k === 'clear')    { handleAction('clear'); }
  else if (k === 'percent')  { handleAction('percent'); }
});

/* ── Init ── */
updateDisplay();
