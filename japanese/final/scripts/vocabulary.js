/* Complete Vocabulary Bank: list (search/filter/sort), flashcards, self-test. */
window.JF = window.JF || {};

JF.vocabBank = (function () {
  var U = JF.ui, S = JF.store, esc = U.esc, icon = U.icon;
  var state = { q: '', src: '', part: '', cat: '', sort: 'source', saved: false, tab: 'list' };
  var test = null;

  /* Example sentences: first annotated sentence (with romaji & Thai) that contains the word */
  var examples = {};
  (function buildExamples() {
    var pool = [];
    JF.grammar.forEach(function (g) { g.examples.forEach(function (x) { pool.push(x); }); });
    JF.part1Expressions.forEach(function (x) { pool.push(x); });
    ['p1-answers', 'p6-main', 'p6-extra'].forEach(function (k) {
      JF.sets[k].items.forEach(function (it) {
        pool.push({ jp: it.jp, romaji: it.romaji, th: it.th });
        (it.model || []).forEach(function (m) { pool.push(m); });
      });
    });
    pool.forEach(function (x) {
      if (!x.jp || !x.th) return;
      U.tokenize(x.jp).forEach(function (tk) { if (tk.id && !examples[tk.id]) examples[tk.id] = x; });
    });
  })();

  function filtered() {
    var q = state.q.trim().toLowerCase();
    var qr = U.normRomaji(q);
    var out = JF.vocab.filter(function (v) {
      if (state.src && v.src.indexOf(state.src) < 0) return false;
      if (state.part && v.parts.indexOf(Number(state.part)) < 0) return false;
      if (state.cat && v.cat !== state.cat) return false;
      if (state.saved && !S.isReview(v.id)) return false;
      if (!q) return true;
      return v.kana.indexOf(q) >= 0 || v.jp.indexOf(q) >= 0 || U.toHira(v.kana).indexOf(U.toHira(q)) >= 0 ||
        v.th.toLowerCase().indexOf(q) >= 0 || (qr && U.normRomaji(v.romaji).indexOf(qr) >= 0);
    });
    if (state.sort === 'kana') {
      out = out.slice().sort(function (a, b) { return U.toHira(a.kana.replace(/[()（）～]/g, '')).localeCompare(U.toHira(b.kana.replace(/[()（）～]/g, '')), 'ja'); });
    }
    return out;
  }

  function opt(val, label, cur) { return '<option value="' + esc(val) + '"' + (String(cur) === String(val) ? ' selected' : '') + '>' + esc(label) + '</option>'; }

  function page(tab) {
    if (tab) state.tab = tab;
    var cats = JF.vocabCategories;
    var h = '<div class="vb" id="vb">';
    h += '<div class="tabs" role="tablist" aria-label="รูปแบบการทบทวน">' +
      tabBtn('list', 'รายการคำศัพท์', 'i-library') + tabBtn('flash', 'แฟลชการ์ดคำศัพท์', 'i-layers') + tabBtn('test', 'ทดสอบตัวเอง', 'i-clipboard') + '</div>';
    h += '<div class="vb-filters">' +
      '<label class="search"><span class="sr-only">ค้นหา</span>' + icon('i-search') +
      '<input type="search" id="vbQ" value="' + esc(state.q) + '" placeholder="ค้นหา ญี่ปุ่น / ฮิรางานะ / romaji / ไทย" autocomplete="off"></label>' +
      '<label class="fsel"><span class="sr-only">แหล่งที่มา</span><select id="vbSrc">' + opt('', 'ทุกเอกสาร', state.src) + opt('r', 'เอกสารติวก่อนสอบ', state.src) + opt('c5', 'บทที่ 5', state.src) + opt('c6', 'บทที่ 6', state.src) + '</select></label>' +
      '<label class="fsel"><span class="sr-only">Part</span><select id="vbPart">' + opt('', 'ทุก Part', state.part) + [1, 2, 3, 4, 5, 6, 7].map(function (n) { return opt(n, 'Part ' + n, state.part); }).join('') + '</select></label>' +
      '<label class="fsel"><span class="sr-only">หมวดหมู่</span><select id="vbCat">' + opt('', 'ทุกหมวด', state.cat) + Object.keys(cats).map(function (k) { return opt(k, cats[k], state.cat); }).join('') + '</select></label>' +
      '<label class="fsel"><span class="sr-only">เรียงลำดับ</span><select id="vbSort">' + opt('source', 'เรียงตามเอกสาร', state.sort) + opt('kana', 'เรียง あいうえお', state.sort) + '</select></label>' +
      '<label class="sw sw-inline"><input type="checkbox" id="vbSaved"' + (state.saved ? ' checked' : '') + '><span class="sw-ui" aria-hidden="true"></span><span>เฉพาะที่บันทึกไว้ ' + icon('i-star') + '</span></label>' +
      '</div>';
    h += '<div id="vbBody">' + body() + '</div></div>';
    return h;
  }
  function tabBtn(id, label, ic) {
    return '<button type="button" role="tab" class="tab" data-vbtab="' + id + '" aria-selected="' + (state.tab === id) + '">' + icon(ic) + label + '</button>';
  }

  function body() {
    var list = filtered();
    if (state.tab === 'flash') return flash(list);
    if (state.tab === 'test') return testHtml(list);
    return listHtml(list);
  }

  function listHtml(list) {
    var h = '<p class="vb-count">พบ <b>' + list.length + '</b> คำ จากทั้งหมด ' + JF.vocab.length + ' คำ</p>';
    if (!list.length) return h + '<p class="empty">ไม่พบคำที่ตรงกับเงื่อนไข</p>';
    h += '<ul class="vb-list">';
    list.forEach(function (v) {
      var ex = examples[v.id];
      var hasKanji = v.jp !== v.kana;
      h += '<li class="vb-item">' +
        '<div class="vb-main">' +
        '<div class="vb-word"><span class="vb-kana" lang="ja">' + esc(v.kana) + '</span>' + (hasKanji ? '<span class="vb-jp" lang="ja">' + esc(v.jp) + '</span>' : '') + '</div>' +
        '<p class="vb-romaji romaji">' + esc(v.romaji) + '</p>' +
        '<p class="vb-th th-meaning">' + esc(v.th) + '</p>' +
        (v.dict ? '<p class="vb-meta">รูปพจนานุกรม <span lang="ja">' + esc(v.dict) + '</span></p>' : '') +
        (v.note ? '<p class="vb-note">' + icon('i-alert') + esc(v.note) + '</p>' : '') +
        (ex ? '<p class="vb-ex">' + U.sentence(ex.jp, { audio: true }) + '<span class="romaji">' + esc(ex.romaji) + '</span><span class="th-meaning">' + esc(ex.th) + '</span></p>' : '') +
        '</div>' +
        '<div class="vb-side">' + U.audioBtn(v.tts || v.kana.replace(/[()（）～]/g, ''), 'ฟังเสียง ' + v.kana) + U.starBtn(v.id) + '</div>' +
        '<div class="vb-tags"><span class="tag">' + esc(JF.vocabCategories[v.cat]) + '</span>' +
        v.src.map(function (s) { return '<span class="tag tag-src">' + esc(JF.sourceLabels[s]) + '</span>'; }).join('') +
        v.parts.map(function (p) { return '<span class="tag tag-part">Part ' + p + '</span>'; }).join('') + '</div>' +
        '</li>';
    });
    return h + '</ul>';
  }

  function flash(list) {
    if (!list.length) return '<p class="empty">ไม่พบคำที่ตรงกับเงื่อนไข</p>';
    var cards = list.map(function (v) {
      var hasKanji = v.jp !== v.kana;
      return {
        key: v.id,
        front: '<span class="fc-big" lang="ja">' + esc(v.kana) + '</span>' + (hasKanji ? '<span class="fc-sub" lang="ja">' + esc(v.jp) + '</span>' : ''),
        back: '<span class="fc-r">' + esc(v.romaji) + '</span><span class="fc-th">' + esc(v.th) + '</span><span class="fc-sub">' + esc(JF.vocabCategories[v.cat]) + '</span>',
        say: v.tts || v.kana.replace(/[()（）～]/g, '')
      };
    });
    return '<p class="vb-count">แฟลชการ์ด ' + list.length + ' ใบ (ตามตัวกรองด้านบน)</p>' + JF.flash.deck('vocab', cards, { title: 'คำศัพท์' });
  }

  /* ---------- Self-test ---------- */
  function newTest(list) {
    var pool = list.filter(function (v) { return v.cat !== 'particle' && !/^～/.test(v.kana); });
    if (pool.length < 4) return null;
    var qs = U.shuffle(pool).slice(0, Math.min(10, pool.length)).map(function (v) {
      var others = U.shuffle(pool.filter(function (o) { return o.id !== v.id && o.th !== v.th; })).slice(0, 3);
      return { v: v, opts: U.shuffle([v].concat(others)), pick: null };
    });
    return { qs: qs, i: 0, dir: test ? test.dir : 'jp' };
  }
  function testHtml(list) {
    if (!test || test.stale) test = newTest(list);
    if (!test) return '<p class="empty">ต้องมีคำศัพท์อย่างน้อย 4 คำในตัวกรองเพื่อทำแบบทดสอบ</p>';
    var t = test;
    var h = '<div class="vt"><div class="vt-head"><div class="seg" role="group" aria-label="ทิศทางคำถาม">' +
      '<button type="button" data-vt="dir-jp" aria-pressed="' + (t.dir === 'jp') + '">ญี่ปุ่น → ไทย</button>' +
      '<button type="button" data-vt="dir-th" aria-pressed="' + (t.dir === 'th') + '">ไทย → ญี่ปุ่น</button></div>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-vt="new">' + icon('i-shuffle') + 'ชุดใหม่</button></div>';
    if (t.i >= t.qs.length) {
      var score = t.qs.filter(function (q) { return q.pick === q.v.id; }).length;
      h += '<div class="vt-result" role="status"><p class="vt-score"><b>' + score + '</b>/' + t.qs.length + '</p><p>ทำแบบทดสอบเสร็จแล้ว</p>';
      var wrong = t.qs.filter(function (q) { return q.pick !== q.v.id; });
      if (wrong.length) {
        h += '<p class="vt-wrong-title">คำที่ควรทบทวน</p><ul class="vt-wrong">' + wrong.map(function (q) {
          return '<li><span lang="ja">' + esc(q.v.kana) + '</span> <span class="romaji">' + esc(q.v.romaji) + '</span> — ' + esc(q.v.th) + U.audioBtn(q.v.kana) + U.starBtn(q.v.id) + '</li>';
        }).join('') + '</ul>';
      }
      return h + '<button type="button" class="btn btn-primary" data-vt="new">' + icon('i-rotate') + 'ทำอีกครั้ง</button></div></div>';
    }
    var q = t.qs[t.i];
    h += '<p class="vt-prog">ข้อ ' + (t.i + 1) + ' / ' + t.qs.length + '</p>';
    h += '<div class="vt-q">' + (t.dir === 'jp'
      ? '<span class="vt-word" lang="ja">' + esc(q.v.kana) + '</span>' + U.audioBtn(q.v.kana)
      : '<span class="vt-word">' + esc(q.v.th) + '</span>') + '</div>';
    h += '<div class="mc-opts">';
    q.opts.forEach(function (o, k) {
      var c = 'mc-opt';
      if (q.pick) { if (o.id === q.v.id) c += ' is-correct'; else if (o.id === q.pick) c += ' is-wrong'; }
      h += '<button type="button" class="' + c + '" data-vt="pick" data-id="' + o.id + '"' + (q.pick ? ' disabled' : '') + '>' +
        '<span class="mc-letter">' + U.letters[k] + '</span><span class="mc-text"' + (t.dir === 'th' ? ' lang="ja"' : '') + '>' + esc(t.dir === 'jp' ? o.th : o.kana) + '</span></button>';
    });
    h += '</div>';
    if (q.pick) {
      h += '<div class="fb ' + (q.pick === q.v.id ? 'fb-ok' : 'fb-no') + '" role="status"><p class="fb-title">' + icon(q.pick === q.v.id ? 'i-check' : 'i-x') + (q.pick === q.v.id ? 'ถูกต้อง!' : 'ยังไม่ถูก') + '</p>' +
        '<p><span lang="ja">' + esc(q.v.kana) + '</span> (' + esc(q.v.romaji) + ') = ' + esc(q.v.th) + '</p></div>' +
        '<button type="button" class="btn btn-primary" data-vt="next">ข้อต่อไป ' + icon('i-arrow-right') + '</button>';
    }
    return h + '</div>';
  }

  function refresh(keepTest) {
    if (!keepTest && test) test.stale = true;
    var b = document.getElementById('vbBody');
    if (b) b.innerHTML = body();
  }

  function bind() {
    var debounce;
    document.addEventListener('input', function (e) {
      if (e.target.id === 'vbQ') { clearTimeout(debounce); debounce = setTimeout(function () { state.q = e.target.value; refresh(); }, 160); }
    });
    document.addEventListener('change', function (e) {
      var id = e.target.id;
      if (id === 'vbSrc') state.src = e.target.value;
      else if (id === 'vbPart') state.part = e.target.value;
      else if (id === 'vbCat') state.cat = e.target.value;
      else if (id === 'vbSort') state.sort = e.target.value;
      else if (id === 'vbSaved') state.saved = e.target.checked;
      else return;
      refresh();
    });
    document.addEventListener('click', function (e) {
      var tb = e.target.closest('[data-vbtab]');
      if (tb) {
        state.tab = tb.getAttribute('data-vbtab');
        var hash = state.tab === 'flash' ? '#/vocab-flash' : '#/vocab';
        if (location.hash !== hash && (state.tab === 'flash' || location.hash === '#/vocab-flash')) { history.replaceState(null, '', hash); document.dispatchEvent(new CustomEvent('jf:route-soft')); }
        document.querySelectorAll('[data-vbtab]').forEach(function (b) { b.setAttribute('aria-selected', String(b === tb)); });
        refresh();
        return;
      }
      var vt = e.target.closest('[data-vt]');
      if (!vt || !test) return;
      var a = vt.getAttribute('data-vt');
      if (a === 'pick') { test.qs[test.i].pick = vt.getAttribute('data-id'); }
      else if (a === 'next') test.i++;
      else if (a === 'new') test.stale = true;
      else if (a === 'dir-jp' || a === 'dir-th') { test.dir = a.slice(4); }
      refresh(true);
      var nb = document.querySelector('#vbBody [data-vt="next"], #vbBody .mc-opt:not([disabled])');
      if (nb && a !== 'dir-jp' && a !== 'dir-th') nb.focus();
    });
  }

  return { page: page, bind: bind, examples: examples };
})();
