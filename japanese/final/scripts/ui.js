/* Shared UI helpers: escaping, icons, annotated sentences, vocabulary popover, toast, text normalization. */
window.JF = window.JF || {};

JF.ui = (function () {
  var V = JF.vocabById, SURF = JF.vocabSurface;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + name + '"/></svg>';
  }

  /* ---------- Tokens ---------- */
  var PUNCT = /^(.*?)([。、．，.,？?！!]+)$/;
  function tokenize(str) {
    var out = [];
    String(str).split('|').forEach(function (raw) {
      if (!raw) return;
      var forced = null;
      var at = raw.indexOf('@');
      if (at > 0) { forced = raw.slice(at + 1); raw = raw.slice(0, at); }
      var m = raw.match(PUNCT), word = raw, tail = '';
      if (m && m[1]) { word = m[1]; tail = m[2]; }
      else if (m && !m[1]) { word = ''; tail = m[2]; }
      if (word) {
        var hit = forced ? { id: forced, form: null } : SURF[word];
        out.push({ t: word, id: hit && V[hit.id] ? hit.id : null, form: hit ? hit.form : null });
      }
      if (tail) out.push({ t: tail, punct: true });
    });
    return out;
  }
  function plainText(str) { return String(str).replace(/\|/g, '').replace(/@[a-z_]+/gi, ''); }

  /* Text sent to speech synthesis: numerals replaced by verified kana readings, blanks skipped */
  function ttsText(str) {
    return tokenize(str).map(function (tk) {
      if (tk.punct) return tk.t;
      if (/^[（(]\s*[）)]$/.test(tk.t)) return '、';
      var v = tk.id && V[tk.id];
      if (v && /[0-9０-９]/.test(tk.t)) return v.kana;
      return tk.t;
    }).join('');
  }

  /* Annotated Japanese sentence. opts: { plain, audio, big, cls } */
  function sentence(str, opts) {
    opts = opts || {};
    var html = tokenize(str).map(function (tk) {
      if (tk.punct || !tk.id || opts.plain) return esc(tk.t);
      return '<span class="w" tabindex="0" role="button" data-v="' + tk.id + '"' +
        (tk.form ? ' data-f="' + esc(tk.form.ending) + '"' : '') + '>' + esc(tk.t) + '</span>';
    }).join('');
    var s = '<span class="jp-sent' + (opts.big ? ' jp-big' : '') + (opts.cls ? ' ' + opts.cls : '') + '" lang="ja">' + html + '</span>';
    if (opts.audio) s += audioBtn(ttsText(str));
    return s;
  }

  /* Rich text with inline [[tokens]] sentences */
  function rich(text, opts) {
    opts = opts || {};
    var parts = String(text || '').split(/\[\[|\]\]/);
    return parts.map(function (p, i) {
      return i % 2 ? sentence(p, { plain: opts.plain }) : esc(p);
    }).join('');
  }

  function audioBtn(text, label, cls) {
    if (!text) return '';
    return '<button type="button" class="au' + (cls ? ' ' + cls : '') + '" data-say="' + esc(text) + '" aria-label="' + esc(label || ('ฟังเสียง: ' + text)) + '" title="ฟังเสียง">' + icon('i-volume') + '</button>';
  }
  function starBtn(id) {
    var on = JF.store.isReview(id);
    return '<button type="button" class="star' + (on ? ' is-on' : '') + '" data-star="' + id + '" aria-pressed="' + on + '" aria-label="' + (on ? 'นำออกจากรายการทบทวน' : 'บันทึกไว้ทบทวน') + '" title="บันทึกไว้ทบทวน">' + icon('i-star') + '</button>';
  }

  /* ---------- Normalization for answer checking ---------- */
  function nfkc(s) { return String(s || '').normalize ? String(s || '').normalize('NFKC') : String(s || ''); }
  function normKana(s) {
    return nfkc(s).replace(/[\s　]+/g, '').replace(/[。、．，.,!！?？「」『』]/g, '').replace(/[〜~]/g, '～');
  }
  function toHira(s) {
    return String(s).replace(/[ァ-ヶ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0x60); });
  }
  function isRomaji(s) { return /^[a-zāīūēôâêîûō'’\-\s]+$/i.test(nfkc(s).trim()) && /[a-z]/i.test(s); }
  function normRomaji(s) {
    return nfkc(s).toLowerCase()
      .replace(/ō|ô/g, 'ou').replace(/ū|û/g, 'uu').replace(/ā|â/g, 'aa').replace(/ī|î/g, 'ii').replace(/ē|ê/g, 'ee')
      .replace(/[\s'’\-.]/g, '').replace(/oo/g, 'ou');
  }
  function normThai(s) {
    return nfkc(s).toLowerCase().replace(/ํา/g, 'ำ').replace(/[\s.]/g, '');
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el || !msg) return;
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('is-on'); }, 3200);
  }

  /* ---------- Vocabulary popover ---------- */
  var pop, anchor = null, showT, hideT, refocusing = false;
  var TYPE_LABEL = { verb: 'คำกริยา', particle: 'คำช่วย', 'na-adj': 'คำคุณศัพท์ な' };

  function popHtml(id, form) {
    var v = V[id];
    var hasKanji = v.jp !== v.kana;
    var h = '<div class="pop-head"><span class="pop-word" lang="ja">' + esc(hasKanji ? v.jp : v.kana) + '</span>' +
      audioBtn(v.tts || v.kana.replace(/[()（）～]/g, ''), 'ฟังเสียง ' + v.kana) + starBtn(id) + '</div>';
    h += '<dl class="pop-dl">';
    if (hasKanji) h += '<dt>คำอ่าน</dt><dd lang="ja">' + esc(v.kana) + '</dd>';
    h += '<dt>โรมาจิ</dt><dd>' + esc(v.romaji) + '</dd>';
    h += '<dt>ความหมาย</dt><dd>' + esc(v.th) + '</dd>';
    if (v.dict) h += '<dt>รูปพจนานุกรม</dt><dd lang="ja">' + esc(v.dict) + '</dd>';
    if (form) {
      var f = JF.verbForms.filter(function (x) { return '～' + x[0] === form; })[0];
      h += '<dt>รูปในประโยค</dt><dd><span lang="ja">' + esc(form) + '</span>' + (f ? ' · ' + esc(f[1]) : '') + '</dd>';
    }
    if (v.type && TYPE_LABEL[v.type]) h += '<dt>ชนิดคำ</dt><dd>' + TYPE_LABEL[v.type] + '</dd>';
    h += '</dl>';
    if (v.note) h += '<p class="pop-note">' + esc(v.note) + '</p>';
    return h;
  }

  function isLocked(el) {
    return !!el.closest('[data-locked="1"]');
  }

  function show(el) {
    if (!pop) return;
    if (isLocked(el)) return;
    anchor = el;
    pop.innerHTML = popHtml(el.getAttribute('data-v'), el.getAttribute('data-f'));
    pop.hidden = false;
    el.setAttribute('aria-expanded', 'true');
    place();
  }
  function hide() {
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    if (anchor) anchor.removeAttribute('aria-expanded');
    anchor = null;
  }
  function place() {
    if (!anchor || pop.hidden) return;
    var r = anchor.getBoundingClientRect();
    var pw = pop.offsetWidth, ph = pop.offsetHeight, vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var left = Math.min(Math.max(8, r.left + r.width / 2 - pw / 2), vw - pw - 8);
    var top = r.bottom + 8;
    if (top + ph > vh - 8 && r.top - ph - 8 > 8) top = r.top - ph - 8;
    pop.style.left = left + 'px';
    pop.style.top = Math.max(8, top) + 'px';
  }

  function initPopover() {
    pop = document.getElementById('pop');
    var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    document.addEventListener('mouseover', function (e) {
      if (!fine) return;
      var w = e.target.closest && e.target.closest('.w');
      if (w) { clearTimeout(hideT); clearTimeout(showT); showT = setTimeout(function () { show(w); }, 90); }
      else if (e.target.closest && e.target.closest('#pop')) clearTimeout(hideT);
    });
    document.addEventListener('mouseout', function (e) {
      if (!fine) return;
      var w = e.target.closest && (e.target.closest('.w') || e.target.closest('#pop'));
      if (w) { clearTimeout(showT); hideT = setTimeout(hide, 220); }
    });
    document.addEventListener('click', function (e) {
      var w = e.target.closest('.w');
      if (w) {
        e.preventDefault();
        if (isLocked(w)) { toast('ดูคำแปลได้หลังตรวจคำตอบข้อนี้'); return; }
        if (anchor === w && !fine) hide(); else show(w);
        return;
      }
      if (!e.target.closest('#pop')) hide();
    });
    document.addEventListener('keydown', function (e) {
      var w = e.target.closest && e.target.closest('.w');
      if (w && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); if (anchor === w) hide(); else show(w); }
      if (e.key === 'Escape' && !pop.hidden) { var a = anchor; hide(); if (a) { refocusing = true; a.focus(); refocusing = false; } }
    });
    var ptrDown = 0;
    document.addEventListener('pointerdown', function () { ptrDown = Date.now(); }, true);
    document.addEventListener('focusin', function (e) {
      var w = e.target.closest && e.target.closest('.w');
      if (w && (refocusing || Date.now() - ptrDown < 600)) return;      // pointer focus is handled by click
      if (w && !isLocked(w)) show(w);
      else if (!e.target.closest('#pop')) hide();
    });
    window.addEventListener('scroll', function () { if (anchor) place(); }, { passive: true, capture: true });
    window.addEventListener('resize', hide);
  }

  /* Deterministic shuffle (stable per seed so options don't jump between renders) */
  function seeded(seedStr) {
    var h = 2166136261;
    for (var i = 0; i < seedStr.length; i++) { h ^= seedStr.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }
  function shuffle(arr, seed) {
    var a = arr.slice(), rnd = seed ? seeded(String(seed)) : Math.random;
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  return {
    esc: esc, icon: icon, tokenize: tokenize, plainText: plainText, ttsText: ttsText, sentence: sentence, rich: rich,
    audioBtn: audioBtn, starBtn: starBtn, toast: toast, initPopover: initPopover, hidePopover: hide,
    nfkc: nfkc, normKana: normKana, toHira: toHira, isRomaji: isRomaji, normRomaji: normRomaji, normThai: normThai,
    shuffle: shuffle, letters: 'abcdefghijklmnopqrstuvwxyz'
  };
})();
