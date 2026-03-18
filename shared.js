/* ============================================================
   CrystalCraft — Shared JavaScript
   Подключается на всех страницах: <script src="shared.js"></script>
   ============================================================ */

var CC_PROXY = "https://script.google.com/macros/s/AKfycbyGiEaj_fr38WvRs15S66fKkChpqM81Z8VZfYPXygHILHvIo036rhnKcf1vs1aamLo3/exec";

/* === NAVIGATION === */
function ccNavToggle() {
  var l = document.getElementById('ccNavLinks'), b = document.querySelector('.cc-nav-burger');
  l.classList.toggle('open'); b.classList.toggle('open');
}
(function () {
  var p = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.cc-nav-link').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === p || (p === '' && href === '/') || (p === 'index.html' && href === '/')) {
      a.classList.add('active');
    }
  });
})();

/* === WIP MODAL === */
function ccShowWip() { document.getElementById('cc-wip-modal').classList.add('show'); document.body.style.overflow = 'hidden'; }
function ccCloseWip() { document.getElementById('cc-wip-modal').classList.remove('show'); document.body.style.overflow = ''; }
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') ccCloseWip(); });

/* === SERVER STATUS === */
async function ccLoadStatus() {
  try {
    var res = await fetch('https://api.mcsrvstat.us/3/mc.crystalcraft.pro');
    var data = await res.json();
    var dot = document.getElementById('cc-dot');
    var statusText = document.getElementById('cc-status-text');
    var onlineEl = document.getElementById('cc-online');
    var maxEl = document.getElementById('cc-max');
    var s1 = document.getElementById('cc-s1');
    var s2 = document.getElementById('cc-s2');
    if (!dot) return;
    if (data.online) {
      dot.className = 'cc-status-dot green';
      statusText.innerHTML = '<span style="color:#22c55e;font-weight:600">Онлайн</span>';
      if (s1) s1.classList.add('online');
      if (onlineEl) onlineEl.textContent = data.players ? data.players.online : '0';
      if (maxEl) maxEl.textContent = data.players ? data.players.max : '0';
      if (s2) s2.classList.add('online');
    } else {
      dot.className = 'cc-status-dot red';
      statusText.innerHTML = '<span style="color:#ef4444;font-weight:600">Оффлайн</span>';
      if (onlineEl) onlineEl.textContent = '0';
      if (maxEl) maxEl.textContent = '—';
    }
  } catch (e) {
    var st = document.getElementById('cc-status-text');
    if (st) st.textContent = 'Недоступно';
  }
}

function ccCopyIP() {
  navigator.clipboard.writeText('mc.crystalcraft.pro');
  var btn = document.getElementById('cc-copy-btn');
  if (!btn) return;
  btn.textContent = 'скопировано!';
  btn.classList.add('copied');
  setTimeout(function () { btn.textContent = 'копировать'; btn.classList.remove('copied'); }, 2000);
}

if (document.getElementById('cc-dot')) ccLoadStatus();

/* === AI CHAT === */
var ccHistory = [], ccLoading = false, ccSuggShown = true, ccOpened = false, ccIsFullscreen = false;

function ccToggleChat() {
  var box = document.getElementById('cc-chat-box');
  var ccMsgs = document.getElementById('cc-chat-msgs');
  ccOpened = !ccOpened;
  box.classList.toggle('open', ccOpened);
  if (ccOpened && ccMsgs.children.length === 0) {
    ccAddMsg('bot', 'Привет! Я <strong>CrystalAI</strong> — помощник форума CrystalCraft. 🔮<br>Спрашивай про правила, наказания или куда обратиться!');
  }
  if (ccOpened) setTimeout(function () { document.getElementById('cc-inp').focus(); }, 200);
}

function ccFmt(t) {
  return t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/(?<![">])(https?:\/\/\S+)/g, '<a href="$1">$1</a>')
    .replace(/\n/g, '<br>');
}

function ccAddMsg(role, html) {
  var ccMsgs = document.getElementById('cc-chat-msgs');
  var row = document.createElement('div');
  row.className = 'cc-msg-row ' + role;
  if (role === 'bot') {
    row.innerHTML = '<div class="cc-msg-av">🔮</div><div class="cc-bubble bot">' + html + '</div>';
  } else {
    row.innerHTML = '<div class="cc-bubble user">' + html + '</div>';
  }
  ccMsgs.appendChild(row);
  ccMsgs.scrollTop = ccMsgs.scrollHeight;
}

function ccShowTyping() {
  var ccMsgs = document.getElementById('cc-chat-msgs');
  var r = document.createElement('div');
  r.className = 'cc-typing'; r.id = 'cc-typing';
  r.innerHTML = '<div class="cc-msg-av">🔮</div><div class="cc-typing-bub"><div class="cc-td"></div><div class="cc-td"></div><div class="cc-td"></div></div>';
  ccMsgs.appendChild(r);
  ccMsgs.scrollTop = ccMsgs.scrollHeight;
}

function ccHideTyping() { var t = document.getElementById('cc-typing'); if (t) t.remove(); }

function ccPlaySound() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(830, ctx.currentTime);
    o.frequency.setValueAtTime(1050, ctx.currentTime + 0.07);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.28);
  } catch (e) {}
}

function ccPlaySendSound() {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var o = ctx.createOscillator(); var g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = 'sine';
    o.frequency.setValueAtTime(500, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.08);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.15);
  } catch (e) {}
}

function ccToggleFullscreen() {
  ccIsFullscreen = !ccIsFullscreen;
  var box = document.getElementById('cc-chat-box');
  var icon = document.getElementById('cc-fs-icon');
  box.classList.toggle('fullscreen', ccIsFullscreen);
  icon.className = ccIsFullscreen ? 'fas fa-compress' : 'fas fa-expand';
}

async function ccSend(preset) {
  var ccInp = document.getElementById('cc-inp');
  var ccSendBtn = document.getElementById('cc-send');
  var text = preset || ccInp.value.trim();
  if (!text || ccLoading) return;
  ccLoading = true; ccSendBtn.disabled = true;
  ccInp.value = ''; ccInp.style.height = 'auto';
  if (ccSuggShown) { document.getElementById('cc-chat-sugg').style.display = 'none'; ccSuggShown = false; }
  ccPlaySendSound();
  ccAddMsg('user', text.replace(/\n/g, '<br>'));
  ccHistory.push({ role: 'user', content: text });
  ccShowTyping();
  try {
    var h = ccHistory.slice(0, -1).slice(-6);
    var res = await fetch(CC_PROXY + '?msg=' + encodeURIComponent(text) + '&history=' + encodeURIComponent(JSON.stringify(h)), { method: 'GET' });
    var data = await res.json();
    var reply = data.reply || 'Не удалось получить ответ.';
    ccHistory.push({ role: 'assistant', content: reply });
    if (ccHistory.length > 20) ccHistory = ccHistory.slice(-18);
    ccHideTyping(); ccAddMsg('bot', ccFmt(reply)); ccPlaySound();
  } catch (err) {
    ccHideTyping(); ccAddMsg('bot', '⚠️ Ошибка подключения. Попробуй ещё раз.'); ccHistory.pop();
  }
  ccLoading = false; ccSendBtn.disabled = false;
  document.getElementById('cc-inp').focus();
}

document.addEventListener('DOMContentLoaded', function () {
  var inp = document.getElementById('cc-inp');
  if (!inp) return;
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ccSend(); } });
  inp.addEventListener('input', function () { inp.style.height = 'auto'; inp.style.height = Math.min(inp.scrollHeight, 80) + 'px'; });
});
