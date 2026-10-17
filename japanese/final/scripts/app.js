/* App shell: router, sidebar, header controls, theme, settings. */
window.JF = window.JF || {};

JF.app = (function () {
  var U = JF.ui, S = JF.store, X = JF.ex, P = JF.pages, esc = U.esc, icon = U.icon;
  var root = document.documentElement;
  var main, current = { route: 'overview', sub: null };

  /* Part 4 study hint (word list) for Study Mode */
  JF.sets['p4-main'].hintWords = ['densha', 'hikouki', 'jitensha', 'fune', 'basu', 'kuruma'].map(function (id) { return JF.vocabById[id].kana; });

  var NAV = [
    { group: 'Dashboard', items: [
      { id: 'overview', label: 'Exam Overview', th: 'ภาพรวมการสอบ', icon: 'i-grid' },
      { id: 'blueprint', label: 'Exam Blueprint', th: 'โครงสร้าง & Checklist', icon: 'i-list-checks' }
    ] },
    { group: 'Exam Practice', items: JF.examBlueprint.parts.map(function (p) {
      return { id: p.id, label: 'Part ' + p.num, th: p.title, part: p.num };
    }) },
    { group: 'Study Resources', items: [
      { id: 'grammar', label: 'Grammar & Memory Tips', th: 'ไวยากรณ์และเทคนิคจำ', icon: 'i-lightbulb' },
      { id: 'kana-chart', label: 'Hiragana / Katakana Chart', th: 'ตารางคานะ', icon: 'i-type' },
      { id: 'kana-flash', label: 'Kana Flashcards', th: 'แฟลชการ์ดคานะ', icon: 'i-layers' },
      { id: 'vocab-flash', label: 'Vocabulary Flashcards', th: 'แฟลชการ์ดคำศัพท์', icon: 'i-layers' },
      { id: 'vocab', label: 'Complete Vocabulary Bank', th: 'คลังคำศัพท์ทั้งหมด', icon: 'i-library' }
    ] },
    { group: 'Final Preparation', items: [
      { id: 'prefinal', label: 'Pre-Final Practice', th: 'แบบฝึกจากเอกสารติว', icon: 'i-clipboard' },
      { id: 'answers', label: 'Answer Key & Explanations', th: 'เฉลยและคำอธิบาย', icon: 'i-key' }
    ] }
  ];
  var collapsed = {};

  function findNav(id) {
    for (var g = 0; g < NAV.length; g++) for (var i = 0; i < NAV[g].items.length; i++) if (NAV[g].items[i].id === id) return { group: NAV[g].group, item: NAV[g].items[i] };
    return null;
  }
  function routeTitle(route) {
    var r = String(route || '').split('/')[0];
    var n = findNav(r);
    return n ? (n.item.part ? n.item.label + ' · ' + n.item.th : n.item.label) : r;
  }

  /* ---------- Sidebar ---------- */
  function renderNav() {
    var el = document.getElementById('sbNav');
    var h = '';
    NAV.forEach(function (g, gi) {
      var open = !collapsed[gi];
      h += '<div class="sb-group' + (open ? '' : ' is-collapsed') + '">' +
        '<button type="button" class="sb-group-btn" data-sbgroup="' + gi + '" aria-expanded="' + open + '" aria-controls="sbg-' + gi + '">' + esc(g.group) + icon('i-chevron', 'sb-chev') + '</button>' +
        '<ul class="sb-list" id="sbg-' + gi + '">';
      g.items.forEach(function (it) {
        var active = current.route === it.id;
        var marker = '';
        if (it.part) {
          var a = X.aggregate(X.partSets(it.part));
          var pct = a.total ? Math.round(a.answered / a.total * 100) : 0;
          marker = '<span class="sb-prog' + (pct === 100 ? ' is-done' : '') + '" style="--p:' + pct + '" title="ตอบแล้ว ' + a.answered + '/' + a.total + '" aria-label="ตอบแล้ว ' + pct + '%"></span>';
        }
        h += '<li><a class="sb-link' + (active ? ' is-active' : '') + '" href="#/' + it.id + '"' + (active ? ' aria-current="page"' : '') + '>' +
          (it.part ? '<span class="sb-num">' + it.part + '</span>' : icon(it.icon)) +
          '<span class="sb-text"><span class="sb-label">' + esc(it.label) + '</span><span class="sb-th">' + esc(it.th) + '</span></span>' + marker + '</a></li>';
      });
      h += '</ul></div>';
    });
    el.innerHTML = h;
  }

  function crumbs() {
    var n = findNav(current.route);
    var el = document.getElementById('crumbs');
    var parts = ['<a href="#/overview">Japanese Final</a>'];
    if (n && current.route !== 'overview') {
      parts.push('<span>' + esc(n.group) + '</span>');
      parts.push('<span aria-current="page">' + esc(n.item.label) + '</span>');
    }
    el.innerHTML = '<ol>' + parts.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ol>';
  }

  /* ---------- Router ---------- */
  function parse() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var seg = h.split('/');
    return { route: seg[0] || 'overview', sub: seg[1] || null };
  }

  function render(opts) {
    opts = opts || {};
    JF.flash.stopAll();
    U.hidePopover();
    var r = current.route, html;
    var m = r.match(/^part-([1-7])$/);
    if (m) html = P.part(Number(m[1]));
    else if (r === 'overview') html = P.overview();
    else if (r === 'blueprint') html = P.blueprint();
    else if (r === 'grammar') html = P.grammar();
    else if (r === 'kana-chart') html = P.kanaChart();
    else if (r === 'kana-flash') html = P.kanaFlash();
    else if (r === 'vocab') html = JF.vocabBank.page('list');
    else if (r === 'vocab-flash') html = JF.vocabBank.page('flash');
    else if (r === 'prefinal') html = P.prefinal();
    else if (r === 'answers') html = P.answers();
    else { current.route = 'overview'; html = P.overview(); }

    var y = window.scrollY;
    main.innerHTML = '<div class="page' + (opts.keepScroll ? '' : ' page-enter') + '">' + html + '</div>';
    document.title = (current.route === 'overview' ? '' : routeTitle(current.route) + ' — ') + '日本語 Final';
    renderNav();
    crumbs();

    if (opts.keepScroll) window.scrollTo(0, y);
    else if (current.sub) {
      var target = document.getElementById(current.sub);
      if (target) { target.scrollIntoView({ block: 'start' }); if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
      else window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
      if (!opts.initial) main.focus({ preventScroll: true });
    }
  }

  function onHash() {
    var p = parse();
    var sameRoute = p.route === current.route;
    current = p;
    if (sameRoute && p.sub && document.getElementById(p.sub)) {
      var t = document.getElementById(p.sub);
      t.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      return;
    }
    render();
    if (current.route !== 'overview') S.setLast(current.route + (current.sub && /^(practice|study)$/.test(current.sub) ? '/' + current.sub : ''));
    closeDrawer();
  }

  /* ---------- Mode ---------- */
  function setMode(m) {
    if (m !== 'study' && m !== 'exam') return;
    S.setting('mode', m);
    if (m === 'exam') root.setAttribute('data-mode', 'exam'); else root.removeAttribute('data-mode');
    syncModeButtons();
    render({ keepScroll: true });
    U.toast(m === 'exam' ? 'เปิดโหมดสอบ — ซ่อนเฉลยและคำใบ้จนกว่าจะส่งคำตอบ' : 'เปิดโหมดเรียน — ตรวจคำตอบได้ทันที');
  }
  function syncModeButtons() {
    var m = S.setting('mode');
    document.querySelectorAll('.mode-switch [data-mode-set]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode-set') === m)); });
  }

  /* ---------- Settings ---------- */
  function syncSettings() {
    document.getElementById('setRomaji').checked = S.setting('romaji') !== false;
    document.getElementById('setThai').checked = S.setting('thai') !== false;
    var rate = String(S.setting('rate'));
    document.querySelectorAll('[data-rate]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-rate') === rate)); });
    audioStatus();
  }
  function audioStatus() {
    var el = document.getElementById('audioStatus');
    var st = JF.audio.status();
    el.className = 'sm-audio st-' + st;
    el.textContent = st === 'ready' ? 'เสียง: ' + JF.audio.voiceName() : JF.audio.message();
  }
  function toggleSettings(open) {
    var btn = document.getElementById('settingsBtn'), menu = document.getElementById('settingsMenu');
    if (open === undefined) open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    if (open) { syncSettings(); var f = menu.querySelector('input'); if (f) f.focus(); }
  }

  /* ---------- Drawer (mobile / tablet) ---------- */
  function openDrawer() {
    document.body.classList.add('sb-open');
    document.getElementById('scrim').hidden = false;
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'true');
    var a = document.querySelector('.sb-link.is-active') || document.querySelector('.sb-link');
    if (a) a.focus();
  }
  function closeDrawer() {
    if (!document.body.classList.contains('sb-open')) return;
    document.body.classList.remove('sb-open');
    document.getElementById('scrim').hidden = true;
    var mb = document.getElementById('menuBtn');
    mb.setAttribute('aria-expanded', 'false');
  }

  /* ---------- Init ---------- */
  function init() {
    main = document.getElementById('main');
    U.initPopover();
    X.bind();
    JF.flash.bind();
    JF.vocabBank.bind();
    P.bind();

    // Theme (shared with the Learning Hub)
    document.getElementById('themeBtn').addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('mis-theme', next); } catch (e) {}
    });

    // Global delegated controls
    document.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-say]'))) { e.preventDefault(); JF.audio.speak(t.getAttribute('data-say'), t); return; }
      if ((t = e.target.closest('[data-star]'))) {
        var on = S.toggleReview(t.getAttribute('data-star'));
        document.querySelectorAll('[data-star="' + t.getAttribute('data-star') + '"]').forEach(function (b) {
          b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on));
          b.setAttribute('aria-label', on ? 'นำออกจากรายการทบทวน' : 'บันทึกไว้ทบทวน');
        });
        U.toast(on ? 'บันทึกไว้ในรายการทบทวนแล้ว' : 'นำออกจากรายการทบทวนแล้ว');
        return;
      }
      if ((t = e.target.closest('[data-mode-set]'))) { setMode(t.getAttribute('data-mode-set')); return; }
      if ((t = e.target.closest('[data-sbgroup]'))) {
        var gi = t.getAttribute('data-sbgroup'); collapsed[gi] = !collapsed[gi]; renderNav();
        var b = document.querySelector('[data-sbgroup="' + gi + '"]'); if (b) b.focus();
        return;
      }
      if ((t = e.target.closest('[data-rate]'))) { S.setting('rate', Number(t.getAttribute('data-rate'))); syncSettings(); return; }
      if (e.target.closest('#settingsBtn')) { toggleSettings(); return; }
      if (!e.target.closest('.settings-wrap')) { var menu = document.getElementById('settingsMenu'); if (!menu.hidden) toggleSettings(false); }
      if (e.target.closest('#menuBtn')) { openDrawer(); return; }
      if (e.target.closest('#sbClose') || e.target.closest('#scrim')) { closeDrawer(); document.getElementById('menuBtn').focus(); return; }
      if (e.target.closest('.sb-link') && document.body.classList.contains('sb-open')) closeDrawer();
    });
    document.getElementById('setRomaji').addEventListener('change', function (e) { S.setting('romaji', e.target.checked); root.classList.toggle('hide-romaji', !e.target.checked); });
    document.getElementById('setThai').addEventListener('change', function (e) { S.setting('thai', e.target.checked); root.classList.toggle('hide-thai', !e.target.checked); });
    document.getElementById('stopAudio').addEventListener('click', function () { JF.audio.stop(); });
    document.getElementById('resetAll').addEventListener('click', function () {
      if (!window.confirm('รีเซ็ตความคืบหน้าทั้งหมด (คำตอบ คะแนน แฟลชการ์ด checklist และคำที่บันทึกไว้)?\nการกระทำนี้ย้อนกลับไม่ได้')) return;
      S.resetAll(); root.removeAttribute('data-mode'); syncModeButtons(); toggleSettings(false); render(); U.toast('รีเซ็ตความคืบหน้าทั้งหมดแล้ว');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var menu = document.getElementById('settingsMenu');
      if (!menu.hidden) { toggleSettings(false); document.getElementById('settingsBtn').focus(); }
      if (document.body.classList.contains('sb-open')) { closeDrawer(); document.getElementById('menuBtn').focus(); }
    });
    document.addEventListener('jf:progress', renderNav);
    document.addEventListener('jf:route-soft', function () { current = parse(); renderNav(); crumbs(); });
    JF.audio.onStatus(audioStatus);

    syncModeButtons();
    window.addEventListener('hashchange', onHash);
    current = parse();
    render({ initial: true });
    if (current.route !== 'overview') S.setLast(current.route);
  }

  return { init: init, rerender: function () { render({ keepScroll: true }); }, routeTitle: routeTitle };
})();

JF.app.init();
