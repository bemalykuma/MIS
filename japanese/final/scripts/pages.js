/* Page renderers. Each returns an HTML string; app.js inserts it and calls page.after() if present. */
window.JF = window.JF || {};

JF.pages = (function () {
  var U = JF.ui, S = JF.store, X = JF.ex, V = JF.vocabById, esc = U.esc, icon = U.icon;
  var BP = JF.examBlueprint;

  function head(eyebrow, title, sub, extra) {
    return '<header class="page-head"><p class="eyebrow">' + esc(eyebrow) + '</p><h1 class="page-title">' + title + '</h1>' +
      (sub ? '<p class="page-sub">' + sub + '</p>' : '') + (extra || '') + '</header>';
  }
  function examLocked() { return S.setting('mode') === 'exam'; }
  function studyGate(inner, label) {
    if (!examLocked()) return inner;
    return '<div class="locked-card">' + icon('i-lock') + '<div><p><b>' + esc(label || 'เนื้อหาทบทวนถูกซ่อนในโหมดสอบ') + '</b></p>' +
      '<p>เนื้อหาส่วนนี้มีคำตอบอยู่ จึงซ่อนไว้ระหว่างทำข้อสอบ</p>' +
      '<button type="button" class="btn btn-sm btn-soft" data-mode-set="study">' + icon('i-book-open') + 'สลับเป็นโหมดเรียน</button></div></div>';
  }
  function card(title, body, cls, ic) {
    return '<section class="card ' + (cls || '') + '">' + (title ? '<h2 class="card-title">' + (ic ? icon(ic) : '') + title + '</h2>' : '') + body + '</section>';
  }
  function vocabRow(id, opts) {
    var v = V[id];
    opts = opts || {};
    return '<li class="vrow">' + (opts.img && v.img ? '<img src="assets/images/' + esc(v.img) + '" alt="" loading="lazy">' : '') +
      '<span class="vrow-jp" lang="ja">' + esc(v.kana) + (v.jp !== v.kana ? ' <small>' + esc(v.jp) + '</small>' : '') + '</span>' +
      '<span class="vrow-r romaji">' + esc(v.romaji) + '</span>' +
      '<span class="vrow-th th-meaning">' + esc(v.th) + '</span>' + U.audioBtn(v.tts || v.kana.replace(/[()（）～]/g, '')) + '</li>';
  }
  function sentRow(x) {
    return '<div class="srow"><div class="srow-jp">' + U.sentence(x.jp, { audio: true }) + '</div>' +
      '<p class="romaji">' + esc(x.romaji) + '</p><p class="th-meaning">' + esc(x.th) + '</p></div>';
  }
  function partSetsHtml(ids) { return ids.map(function (id) { return X.renderSet(id); }).join(''); }
  function partProgress(n) {
    var a = X.aggregate(X.partSets(n));
    return a.total ? Math.round(a.answered / a.total * 100) : 0;
  }

  /* ======================= OVERVIEW ======================= */
  function overview() {
    var all = X.aggregate(X.allSetIds());
    var pct = all.total ? Math.round(all.answered / all.total * 100) : 0;
    var last = S.state.last;
    var h = '<section class="hero-card">' +
      '<div class="hero-text"><p class="eyebrow">Japanese Final · 第5課–第6課</p>' +
      '<h1 class="hero-title"><span lang="ja">日本語</span> — Final Exam Preparation</h1>' +
      '<p class="hero-sub">Your complete Japanese final exam study companion.</p>' +
      '<p class="hero-desc">Learn, practice, listen, and review everything you need for your Japanese final.</p>' +
      '<div class="hero-actions">' +
      (last ? '<a class="btn btn-primary" href="#/' + esc(last) + '">' + icon('i-play') + 'เรียนต่อ</a>' : '<a class="btn btn-primary" href="#/part-1">' + icon('i-play') + 'เริ่มจาก Part 1</a>') +
      '<a class="btn btn-ghost" href="#/prefinal">' + icon('i-clipboard') + 'Pre-Final Practice</a></div></div>' +
      '<div class="hero-art" aria-hidden="true"><span lang="ja">日</span><span lang="ja">本</span><span lang="ja">語</span></div></section>';

    if (last) {
      h += '<a class="continue" href="#/' + esc(last) + '">' + icon('i-rotate') + '<span>กลับไปเรียนต่อที่ <b>' + esc(JF.app.routeTitle(last)) + '</b></span>' + icon('i-arrow-right') + '</a>';
    }

    var stats = [
      ['Parts ในข้อสอบ', BP.parts.length, 'i-list-checks'],
      ['คำศัพท์ทั้งหมด', JF.vocab.length, 'i-library'],
      ['ข้อฝึกทั้งหมด', all.total, 'i-clipboard'],
      ['ความคืบหน้า', pct + '%', 'i-flag'],
      ['ตอบแล้ว', all.answered, 'i-pencil'],
      ['ตอบถูก', all.correct, 'i-check']
    ];
    h += '<section class="stats" aria-label="สถิติการเรียน">' + stats.map(function (s) {
      return '<div class="stat"><span class="stat-ic">' + icon(s[2]) + '</span><p class="stat-num">' + s[1] + '</p><p class="stat-label">' + s[0] + '</p></div>';
    }).join('') + '</section>';

    // Blueprint
    h += '<section class="section"><div class="sec-head"><div><p class="eyebrow">Exam Blueprint</p><h2 class="sec-title">โครงสร้างข้อสอบ 7 Parts</h2>' +
      '<p class="sec-sub">สรุปจาก ' + esc(BP.source) + '</p></div><a class="btn btn-sm btn-ghost" href="#/blueprint">ดูรายละเอียด ' + icon('i-arrow-right') + '</a></div>';
    h += '<div class="bp-grid">' + BP.parts.map(function (p) {
      var pr = partProgress(p.num);
      return '<article class="bp-card"><div class="bp-top"><span class="bp-num">Part ' + p.num + '</span><span class="bp-count">' + (p.questionCount ? p.questionCount + ' ข้อ' : 'ไม่ระบุจำนวนข้อ') + '</span></div>' +
        '<h3 class="bp-title">' + esc(p.title) + '</h3><p class="bp-en">' + esc(p.titleEn) + '</p>' +
        '<p class="bp-format">' + icon('i-type') + esc(p.format) + '</p>' +
        '<p class="bp-confirmed">' + esc(p.confirmed[0]) + '</p>' +
        '<div class="bp-prog"><span class="bar"><span style="width:' + pr + '%"></span></span><span>' + pr + '%</span></div>' +
        '<div class="bp-actions"><a class="btn btn-sm btn-ghost" href="#/part-' + p.num + '">' + icon('i-book-open') + 'ทบทวน</a>' +
        '<a class="btn btn-sm btn-soft" href="#/part-' + p.num + '/practice">' + icon('i-pencil') + 'ฝึก</a></div></article>';
    }).join('') + '</div></section>';

    // Checklist + quick actions
    h += '<div class="two-col">';
    h += card('Study Checklist', checklistHtml(), 'checklist-card', 'i-list-checks');
    h += card('Quick Actions', '<div class="qa">' +
      qa('#/' + (last || 'part-1'), 'i-play', 'Continue Studying', 'เรียนต่อจากครั้งก่อน') +
      qa('#/part-1/practice', 'i-pencil', 'Practice Part 1', 'จับคู่สำนวน 15 ข้อ') +
      qa('#/vocab', 'i-library', 'Review Vocabulary', JF.vocab.length + ' คำจากทั้งสองเอกสาร') +
      qa('#/kana-chart', 'i-type', 'Study Kana', 'ฮิรางานะ / คาตาคานะ') +
      qa('#/prefinal', 'i-clipboard', 'Start Pre-Final Practice', 'แบบฝึกจากเอกสารติว') + '</div>', 'qa-card', 'i-arrow-right');
    h += '</div>';

    h += '<details class="card flags"><summary>' + icon('i-alert') + 'จุดในเอกสารที่ควรตรวจสอบ (' + BP.sourceFlags.length + ')</summary><ul>' +
      BP.sourceFlags.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></details>';
    h += audioNotice();
    return h;
  }
  function qa(href, ic, title, sub) {
    return '<a class="qa-item" href="' + href + '"><span class="qa-ic">' + icon(ic) + '</span><span><b>' + esc(title) + '</b><small>' + esc(sub) + '</small></span>' + icon('i-chevron-right', 'qa-go') + '</a>';
  }
  function checklistHtml() {
    var done = BP.checklist.filter(function (c) { return S.check(c.id); }).length;
    return '<p class="cl-prog"><b>' + done + '</b>/' + BP.checklist.length + ' หัวข้อ</p><ul class="cl">' + BP.checklist.map(function (c) {
      return '<li><label class="cb"><input type="checkbox" data-check="' + c.id + '"' + (S.check(c.id) ? ' checked' : '') + '><span class="cb-ui" aria-hidden="true">' + icon('i-check') + '</span><span>' + esc(c.label) + '</span></label>' +
        (c.part ? '<a class="cl-link" href="#/part-' + c.part + '" aria-label="ไปที่ Part ' + c.part + '">' + icon('i-chevron-right') + '</a>' : '<a class="cl-link" href="#/kana-chart" aria-label="ไปที่ตารางคานะ">' + icon('i-chevron-right') + '</a>') + '</li>';
    }).join('') + '</ul>';
  }
  function audioNotice() {
    var st = JF.audio.status();
    if (st === 'ready' || st === 'loading') return '';
    return '<p class="notice">' + icon('i-volume') + esc(JF.audio.message()) + '</p>';
  }

  /* ======================= BLUEPRINT ======================= */
  function blueprint() {
    var h = head('Dashboard', 'Exam Blueprint & Topics Checklist', 'โครงสร้างข้อสอบที่สรุปจาก <b>' + esc(BP.source) + '</b> และการจับคู่เนื้อหาในเอกสารกับหน้าต่างๆ ของเว็บ');
    h += '<div class="legend"><span><span class="src-badge src-doc">จากเอกสาร</span> เนื้อหาที่ยืนยันในเอกสาร</span><span><span class="src-badge src-derived">แปลงจากตารางในเอกสาร</span></span><span><span class="src-badge src-add">แบบฝึกเพิ่มเติม</span> เขียนขึ้นใหม่จากคำศัพท์/ไวยากรณ์เดียวกัน</span></div>';
    BP.parts.forEach(function (p) {
      h += '<section class="card bp-detail"><div class="bp-top"><span class="bp-num">Part ' + p.num + '</span><span class="bp-count">' + esc(p.countNote) + '</span></div>' +
        '<h2 class="card-title">' + esc(p.title) + ' <small>' + esc(p.titleEn) + '</small></h2>' +
        '<dl class="dl"><dt>รูปแบบคำตอบ</dt><dd>' + esc(p.format) + '</dd><dt>คำสั่งในเอกสาร</dt><dd>“' + esc(p.instructions) + '”</dd>' +
        (p.displayRule ? '<dt>หมายเหตุการแสดงผล</dt><dd>' + esc(p.displayRule) + '</dd>' : '') + '</dl>' +
        '<p class="mini-title">หัวข้อที่ยืนยันแล้ว</p><ul class="ticks">' + p.confirmed.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
        (p.grammar.length ? '<p class="mini-title">ไวยากรณ์ที่เกี่ยวข้อง</p><div class="chips">' + p.grammar.map(grammarChip).join('') + '</div>' : '') +
        '<div class="bp-actions"><a class="btn btn-sm btn-soft" href="#/part-' + p.num + '">ไปที่ Part ' + p.num + ' ' + icon('i-arrow-right') + '</a></div></section>';
    });
    h += card('Content Coverage Audit', coverage(), '', 'i-list-checks');
    h += card('Study Checklist', checklistHtml(), 'checklist-card', 'i-check');
    h += '<section class="card flags"><h2 class="card-title">' + icon('i-alert') + 'จุดในเอกสารที่ควรตรวจสอบ</h2><ul>' + BP.sourceFlags.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul></section>';
    return h;
  }
  function grammarChip(id) {
    var g = JF.grammar.filter(function (x) { return x.id === id; })[0];
    return g ? '<a class="chip chip-link" href="#/grammar/' + id + '">' + icon('i-lightbulb') + esc(g.title.split(/[／/(—]/)[0].trim()) + '</a>' : '';
  }
  function coverage() {
    var rows = [
      ['เอกสารติว หน้า 1–3 (ประโยค 15 ข้อ)', 'Part 1 · Pre-Final', '#/part-1'],
      ['เอกสารติว Part 1 จับคู่ความหมาย', 'Part 1 · Pre-Final · Answer Key', '#/part-1'],
      ['เอกสารติว Part 2 คันจิเรื่องวัน', 'Part 2 · Pre-Final', '#/part-2'],
      ['เอกสารติว Part 3 (การอ่านพิเศษ, ～ます, คำบอกเวลา, ～も)', 'Part 3 · Grammar · Pre-Final', '#/part-3'],
      ['โน้ตเขียนมือ: 一人で / かぞくと / デパートで', 'Part 3 (ข้อ 12–14) · Grammar', '#/part-3'],
      ['เอกสารติว Part 4 + โน้ต バス くるま', 'Part 4 · Pre-Final', '#/part-4'],
      ['เอกสารติว Part 5 + โน้ต "ช้อยเป็น hira+romanji"', 'Part 5 · Pre-Final', '#/part-5'],
      ['เอกสารติว Part 6', 'Part 6 · Pre-Final', '#/part-6'],
      ['เอกสารติว Part 7 (5 ข้อ 10 คะแนน)', 'Part 7 · Pre-Final', '#/part-7'],
      ['บทที่ 5 ไวยากรณ์ 1–4 (へ, ～も, で ยานพาหนะ, と / 一人で)', 'Grammar & Memory Tips', '#/grammar'],
      ['บทที่ 5 คำศัพท์สถานที่ / ยานพาหนะ', 'Vocabulary Bank · Part 4', '#/vocab'],
      ['บทที่ 6 คำศัพท์ 44 คำ', 'Vocabulary Bank', '#/vocab'],
      ['บทที่ 6 ไวยากรณ์ 1–7 (を, をします, なにを, で สถานที่, ～ませんか, ～ましょう)', 'Grammar & Memory Tips', '#/grammar'],
      ['บทที่ 6 เรื่อง なん/なに ("ไม่ออกสอบ")', 'Grammar (หมายเหตุ) · Vocabulary Bank', '#/grammar/g-nani']
    ];
    return '<div class="table-wrap"><table class="tbl"><thead><tr><th>ส่วนของเอกสาร</th><th>อยู่ในหน้า</th></tr></thead><tbody>' +
      rows.map(function (r) { return '<tr><td>' + esc(r[0]) + '</td><td><a href="' + r[2] + '">' + esc(r[1]) + '</a></td></tr>'; }).join('') + '</tbody></table></div>';
  }

  /* ======================= PART PAGES ======================= */
  function partHead(n) {
    var p = BP.parts[n - 1];
    var pr = partProgress(n);
    return '<header class="part-head">' +
      '<div class="part-badge"><span>Part</span><b>' + n + '</b></div>' +
      '<div class="part-head-text"><p class="eyebrow">' + esc(p.titleEn) + '</p><h1 class="page-title">' + esc(p.title) + '</h1>' +
      '<p class="part-instr">“' + esc(p.instructions) + '”</p>' +
      '<div class="part-meta"><span>' + icon('i-type') + esc(p.format) + '</span><span>' + icon('i-list-checks') + esc(p.countNote) + '</span>' +
      (p.displayRule ? '<span>' + icon('i-eye') + esc(p.displayRule) + '</span>' : '') + '</div>' +
      (p.grammar.length ? '<div class="chips">' + p.grammar.map(grammarChip).join('') + '</div>' : '') +
      '</div><div class="part-prog"><span class="ring" style="--p:' + pr + '"><b>' + pr + '%</b></span><span>ตอบแล้ว</span>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-reset-part="' + n + '">' + icon('i-rotate') + 'รีเซ็ต Part</button></div></header>' +
      '<nav class="part-tabs" aria-label="ส่วนของหน้า"><a href="#/part-' + n + '/study">' + icon('i-book-open') + 'ทบทวน</a><a href="#/part-' + n + '/practice">' + icon('i-pencil') + 'ฝึก</a></nav>';
  }
  function practiceSection(ids, extraNote) {
    return '<section class="section" id="practice"><div class="sec-head"><div><p class="eyebrow">Practice</p><h2 class="sec-title">แบบฝึก</h2>' +
      (extraNote ? '<p class="sec-sub">' + extraNote + '</p>' : '') + '</div></div>' + partSetsHtml(ids) + '</section>';
  }
  function studySection(inner) {
    return '<section class="section" id="study"><div class="sec-head"><div><p class="eyebrow">Study</p><h2 class="sec-title">ทบทวนเนื้อหา</h2></div></div>' + studyGate(inner) + '</section>';
  }

  function part1() {
    var h = partHead(1);
    var table = '<div class="table-wrap"><table class="tbl tbl-p1"><thead><tr><th>#</th><th>สำนวนภาษาญี่ปุ่น</th><th class="th-meaning">ความหมาย</th></tr></thead><tbody>' +
      JF.part1Expressions.map(function (x, i) {
        return '<tr><td>' + (i + 1) + '</td><td>' + U.sentence(x.jp, { audio: true }) + '<span class="romaji">' + esc(x.romaji) + '</span></td><td class="th-meaning">' + esc(x.th) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
    var game = X.matchGame('p1', [
      { label: 'ภาษาญี่ปุ่น', items: JF.part1Expressions.map(function (x, i) { return { key: 'e' + i, html: '<span lang="ja">' + esc(U.plainText(x.jp)) + '</span><small class="romaji">' + esc(x.romaji) + '</small>', say: U.ttsText(x.jp) }; }) },
      { label: 'ความหมาย', items: JF.part1Expressions.map(function (x, i) { return { key: 'e' + i, html: esc(x.th) }; }) }
    ], 'เกมจับคู่สำนวน (ฝึกเล่น ไม่นับคะแนน)');
    h += studySection(card('สำนวนคำถาม 15 สำนวน', '<p class="muted">แตะ/วางเมาส์บนคำเพื่อดูความหมาย · โจทย์ Part 1 แสดงเป็นฮิรางานะทั้งหมด</p>' + table, '', 'i-book-open') + card('', game, 'game-card'));
    h += practiceSection(['p1-match', 'p1-answers']);
    return h;
  }

  function part2() {
    var form = S.setting('dayForm');
    var h = partHead(2);
    var cards = JF.days.map(function (d) {
      var v = V[d.id];
      return '<article class="day-card" data-day="' + d.id + '"><div class="day-el el-' + d.el + '">' + icon('e-' + d.el) + '<span>' + esc(d.elTh) + ' · ' + esc(d.elEn) + '</span></div>' +
        '<p class="day-kanji" lang="ja">' + esc(form === 'full' ? v.jp : v.docForm) + '</p>' +
        '<p class="day-tip">' + esc(d.tip) + '</p>' +
        '<div class="day-reveal"><p class="day-r" data-part="reading"><span lang="ja">' + esc(v.kana) + '</span> <span class="romaji">' + esc(v.romaji) + '</span></p>' +
        '<p class="day-m" data-part="meaning">' + esc(v.th) + '</p></div>' +
        '<div class="day-actions"><button type="button" class="btn btn-sm btn-ghost" data-day-reveal="reading">' + icon('i-eye') + 'คำอ่าน</button>' +
        '<button type="button" class="btn btn-sm btn-ghost" data-day-reveal="meaning">' + icon('i-eye') + 'ความหมาย</button>' + U.audioBtn(v.kana, 'ฟังเสียง ' + v.kana) + '</div></article>';
    }).join('');
    var memory = '<div class="memory-intro"><p><b lang="ja">曜日（ようび）</b> คือคำต่อท้ายที่แปลว่า "วัน (ในสัปดาห์)" — ทุกวันจึงลงท้ายด้วย <span lang="ja">ようび</span> เหมือนกัน ' +
      'ส่วนตัวคันจิตัวแรกคือ <b>ธาตุ/ดวงดาว</b> ประจำวัน: <span lang="ja">月</span> พระจันทร์ · <span lang="ja">火</span> ไฟ · <span lang="ja">水</span> น้ำ · <span lang="ja">木</span> ต้นไม้ · <span lang="ja">金</span> ทอง · <span lang="ja">土</span> ดิน · <span lang="ja">日</span> พระอาทิตย์</p>' +
      '<div class="seg" role="group" aria-label="รูปแบบการเขียน"><button type="button" data-dayform="doc" aria-pressed="' + (form !== 'full') + '">ตามเอกสาร <span lang="ja">月ようび</span></button>' +
      '<button type="button" data-dayform="full" aria-pressed="' + (form === 'full') + '">รูปเต็ม <span lang="ja">月曜日</span></button></div></div>' +
      '<div class="day-grid" id="dayGrid">' + cards + '</div>' +
      '<div class="day-tools"><button type="button" class="btn btn-sm btn-ghost" data-day-all="show">' + icon('i-eye') + 'เปิดทั้งหมด</button><button type="button" class="btn btn-sm btn-ghost" data-day-all="hide">' + icon('i-eye-off') + 'ซ่อนทั้งหมด (โหมดท่องจำ)</button></div>';

    var drill = '<div class="drill" id="dayDrill">' + drillInner() + '</div>';
    var deck = JF.flash.deck('days', JF.days.map(function (d) {
      var v = V[d.id];
      return { key: d.id, front: '<span class="fc-big" lang="ja">' + esc(form === 'full' ? v.jp : v.docForm) + '</span>', back: '<span class="fc-big" lang="ja">' + esc(v.kana) + '</span><span class="fc-r">' + esc(v.romaji) + '</span><span class="fc-th">' + esc(v.th) + '</span><span class="fc-sub">' + esc(d.elTh) + ' · ' + esc(d.elEn) + '</span>', say: v.kana };
    }), { title: 'วันในสัปดาห์' });
    var game = X.matchGame('days', [
      { label: 'คันจิ', items: JF.days.map(function (d) { var v = V[d.id]; return { key: d.id, html: esc(form === 'full' ? v.jp : v.docForm), lang: 'ja', say: v.kana }; }) },
      { label: 'ฮิรางานะ', items: JF.days.map(function (d) { return { key: d.id, html: esc(V[d.id].kana), lang: 'ja' }; }) },
      { label: 'ความหมาย', items: JF.days.map(function (d) { return { key: d.id, html: esc(V[d.id].th) }; }) }
    ], 'จับคู่ คันจิ ↔ ฮิรางานะ ↔ ความหมาย');

    h += studySection(
      card('จำวันทั้ง 7 วันแบบง่าย ๆ', memory, 'memory-card', 'i-lightbulb') +
      '<div class="two-col">' + card('สุ่มฝึก (Random Practice)', drill, '', 'i-shuffle') + card('โหมดท่องจำ (Flashcards)', deck, '', 'i-layers') + '</div>' +
      card('', game, 'game-card'));
    h += practiceSection(['p2-days'], 'พิมพ์คำอ่านเป็นฮิรางานะเท่านั้น · ความหมายพิมพ์ "วันจันทร์" หรือ "จันทร์" ได้');
    return h;
  }
  var drillState = { i: Math.floor(Math.random() * 7), shown: false };
  function drillInner() {
    var d = JF.days[drillState.i], v = V[d.id];
    var form = S.setting('dayForm');
    return '<p class="drill-k" lang="ja">' + esc(form === 'full' ? v.jp : v.docForm) + '</p>' +
      (drillState.shown ? '<p class="drill-a"><span lang="ja">' + esc(v.kana) + '</span> · <span class="romaji">' + esc(v.romaji) + '</span> · ' + esc(v.th) + U.audioBtn(v.kana) + '</p>' : '<p class="drill-a drill-ph">นึกคำอ่านและความหมายในใจ แล้วกดเฉลย</p>') +
      '<div class="drill-actions"><button type="button" class="btn btn-sm btn-soft" data-drill="show">' + icon('i-eye') + 'เฉลย</button><button type="button" class="btn btn-sm btn-ghost" data-drill="next">' + icon('i-shuffle') + 'สุ่มวันถัดไป</button></div>';
  }

  function part3() {
    var h = partHead(3);
    var watch = '<div class="watch"><p class="watch-lead">' + icon('i-alert') + '<b>Watch Out!</b> 5 คำอ่านพิเศษที่ยืนยันว่าต้องจำ — ตัวเลข 4, 7, 9 อ่านได้หลายแบบ แต่กับ <span lang="ja">～じ</span> (โมง) และ <span lang="ja">～がつ</span> (เดือน) ต้องใช้คำอ่านตามนี้</p>' +
      '<div class="table-wrap"><table class="tbl tbl-watch"><thead><tr><th>เลข</th><th>คำอ่านทั่วไป</th><th><span lang="ja">～じ</span> โมง</th><th><span lang="ja">～がつ</span> เดือน</th></tr></thead><tbody>' +
      '<tr><td>4</td><td lang="ja">よん / し</td><td class="hl">' + w('4じ', 'よじ', 'yoji') + '<small>ไม่ใช่ よんじ</small></td><td class="hl">' + w('4がつ', 'しがつ', 'shigatsu') + '<small>ไม่ใช่ よんがつ</small></td></tr>' +
      '<tr><td>7</td><td lang="ja">なな / しち</td><td class="hl">' + w('7じ', 'しちじ', 'shichiji') + '</td><td>' + w('7がつ', 'しちがつ', 'shichigatsu') + '</td></tr>' +
      '<tr><td>9</td><td lang="ja">きゅう / く</td><td class="hl">' + w('9じ', 'くじ', 'kuji') + '<small>ไม่ใช่ きゅうじ</small></td><td class="hl">' + w('9がつ', 'くがつ', 'kugatsu') + '<small>ไม่ใช่ きゅうがつ</small></td></tr>' +
      '</tbody></table></div><p class="muted">ช่องที่ไฮไลต์คือ 5 คำที่เอกสารระบุ · 7がつ อ่าน しちがつ (ให้ไว้เพื่อเปรียบเทียบ)</p></div>';
    var hours = ['いちじ', 'にじ', 'さんじ', 'よじ', 'ごじ', 'ろくじ', 'しちじ', 'はちじ', 'くじ', 'じゅうじ', 'じゅういちじ', 'じゅうにじ'];
    var months = ['いちがつ', 'にがつ', 'さんがつ', 'しがつ', 'ごがつ', 'ろくがつ', 'しちがつ', 'はちがつ', 'くがつ', 'じゅうがつ', 'じゅういちがつ', 'じゅうにがつ'];
    var thMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    var special = [3, 6, 8];
    var extra = '<details class="extra"><summary>' + icon('i-book-open') + 'Extra Study Notes: ตารางเวลา 1–12 โมง และเดือน 1–12</summary><div class="table-wrap"><table class="tbl tbl-num"><thead><tr><th>#</th><th>～じ</th><th>～がつ</th><th>เดือน</th></tr></thead><tbody>' +
      hours.map(function (hh, i) {
        var s = special.indexOf(i) >= 0;
        return '<tr' + (s ? ' class="hl-row"' : '') + '><td>' + (i + 1) + '</td><td lang="ja">' + hh + U.audioBtn(hh) + '</td><td lang="ja">' + months[i] + U.audioBtn(months[i]) + '</td><td>' + thMonths[i] + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="muted">ข้อมูลเสริม (ไม่ได้อยู่ในเอกสาร) — แถวที่ไฮไลต์คือ 4, 7, 9</p></details>';
    var masu = '<div class="table-wrap"><table class="tbl tbl-masu"><thead><tr><th></th><th>บอกเล่า</th><th>ปฏิเสธ</th></tr></thead><tbody>' +
      '<tr><th>ปัจจุบัน</th><td>' + U.sentence('たべます', { audio: true }) + '<span class="romaji">tabemasu</span></td><td>' + U.sentence('たべません', { audio: true }) + '<span class="romaji">tabemasen</span></td></tr>' +
      '<tr><th>อดีต</th><td>' + U.sentence('たべました', { audio: true }) + '<span class="romaji">tabemashita</span></td><td>' + U.sentence('たべませんでした', { audio: true }) + '<span class="romaji">tabemasendeshita</span></td></tr></tbody></table></div>';
    var words = '<ul class="vlist">' + ['kinou', 'kyou', 'ashita', 'mainichi'].map(function (id) { return vocabRow(id); }).join('') + '</ul>' +
      '<div class="rule">' + icon('i-lightbulb') + '<p>คำแสดงคำถาม + <b lang="ja">も</b> + ปฏิเสธ = ไม่…เลย<br>' + U.sentence('なに|も|しません。', { audio: true }) + ' <span class="romaji">Nani mo shimasen.</span> <span class="th-meaning">ไม่ได้ทำอะไรเลย</span></p></div>';
    var parts = '<div class="rule">' + icon('i-lightbulb') + '<p>โน้ตเขียนมือในเอกสาร "เพิ่มเติมที่จะออกเพิ่ม" — <b>คำช่วยในประโยค</b> (คำศัพท์อาจไม่ใช่ตามนี้)<br>' +
      U.sentence('ひとりで|いきます。', { audio: true }) + ' <span class="th-meaning">ไปคนเดียว</span><br>' +
      U.sentence('かぞく|と|かえります。', { audio: true }) + ' <span class="th-meaning">กลับกับครอบครัว</span><br>' +
      U.sentence('デパート|で|かいます。', { audio: true }) + ' <span class="th-meaning">ซื้อที่ห้าง</span></p></div>';
    h += studySection(card('Watch Out! คำอ่านพิเศษ', watch + extra, 'watch-card', 'i-alert') +
      '<div class="two-col">' + card('รูปกริยา ～ます', masu + '<a class="chip chip-link" href="#/grammar/g-masu">' + icon('i-lightbulb') + 'ดูบทไวยากรณ์</a>', '', 'i-type') +
      card('คำบอกเวลา & ～も', words, '', 'i-timer') + '</div>' + card('คำช่วยที่จะออกเพิ่ม', parts, '', 'i-flag'));
    h += practiceSection(['p3-main'], 'ปรนัย 4 ตัวเลือก · ครอบคลุม 4じ 7じ 9じ 4がつ 9がつ ครบทั้ง 5 คำ');
    return h;
  }
  function w(surface, kana, romaji) {
    return '<span class="wo" lang="ja">' + esc(surface) + ' = <b>' + esc(kana) + '</b></span>' + U.audioBtn(kana) + '<span class="romaji">' + esc(romaji) + '</span>';
  }

  function part4() {
    var h = partHead(4);
    var grid = '<div class="pic-grid">' + ['densha', 'hikouki', 'jitensha', 'fune', 'basu', 'kuruma'].map(picCard).join('') + '</div>' +
      '<p class="mini-title">ยานพาหนะอื่นในบทที่ 5</p><div class="pic-grid pic-sm">' + ['chikatetsu', 'takushii', 'tukutuku', 'aruite'].map(picCard).join('') + '</div>' +
      '<div class="rule">' + icon('i-lightbulb') + '<p>ใช้กับ <b lang="ja">で</b>: ' + U.sentence('バス|で|いきます。', { audio: true }) + ' <span class="th-meaning">ไปโดยรถบัส</span> · เดินไปใช้ ' + U.sentence('あるいて|いきます。', { audio: true }) + ' (ไม่มี で)</p></div>';
    h += studySection(card('คำศัพท์ยานพาหนะ', grid, '', 'i-image'));
    h += practiceSection(['p4-main', 'p4-extra'], 'ดูภาพแล้วพิมพ์คำตอบเป็นภาษาญี่ปุ่น · バス เป็นคำทับศัพท์ต้องเขียนด้วยคาตาคานะ');
    return h;
  }
  function picCard(id) {
    var v = V[id];
    return '<figure class="pic"><img src="assets/images/' + esc(v.img) + '" alt="' + esc(v.th) + '" loading="lazy">' +
      '<figcaption><span lang="ja">' + esc(v.kana) + '</span>' + U.audioBtn(v.kana) + '<span class="romaji">' + esc(v.romaji) + '</span><span class="th-meaning">' + esc(v.th) + '</span></figcaption>' +
      (/\.svg$/.test(v.img) ? '<span class="own-art" title="ภาพวาดประกอบใหม่ (ไม่มีในเอกสาร)">✎</span>' : '') + '</figure>';
  }

  function part5() {
    var h = partHead(5);
    var study = '<details class="extra"><summary>' + icon('i-book-open') + 'ทบทวนคำกริยา 10 คำก่อนทำแบบฝึก (มีคำแปล)</summary><div class="pic-grid">' +
      JF.part5Options.map(picCard).join('') + '</div></details>' +
      '<p class="muted">รูปแบบตามโน้ตในเอกสาร: "มีภาพกับช้อย ช้อยจะเป็น hira+romanji ให้เอาคำมาเติม" — ตัวเลือกแสดงเป็นฮิรางานะ + โรมาจิ เท่านั้น</p>';
    h += studySection(study);
    h += practiceSection(['p5-main'], 'ตัวเลือก (a–j) อยู่ด้านบน · ใต้ภาพแต่ละภาพให้เลือกตัวอักษรของคำที่ตรงกัน แล้วกดตรวจการจับคู่');
    return h;
  }

  function part6() {
    var h = partHead(6);
    var tips = '<ul class="ticks"><li>ตอบด้วยรูปกริยาเดียวกับคำถาม: <span lang="ja">～ましたか → ～ました</span> · <span lang="ja">～ますか → ～ます</span></li>' +
      '<li>คำแสดงคำถามแทนที่ด้วยคำตอบ: <span lang="ja">なんじ → ろくじ</span> · <span lang="ja">なんようび → もくようび</span></li>' +
      '<li>อย่าลืมคำช่วย <span lang="ja">に</span> หลังเวลา/วัน: <span lang="ja">ろくじに</span> · <span lang="ja">もくようびに</span></li>' +
      '<li>ระวังการอ่าน 4じ よじ · 7じ しちじ · 9じ くじ</li></ul>' +
      sentRow({ jp: 'けさ|なんじ|に|おきました|か。', romaji: 'Kesa nanji ni okimashita ka.', th: 'เช้านี้ตื่นกี่โมง' }) +
      sentRow({ jp: 'ろくじ|に|おきました。', romaji: 'Rokuji ni okimashita.', th: 'ตื่น 6 โมง' });
    h += studySection(card('เทคนิคการตอบ', tips, '', 'i-lightbulb'));
    h += practiceSection(['p6-main', 'p6-extra'], 'ข้อเขียนตรวจอัตโนมัติไม่ได้ทั้งหมด — ระบบจะตรวจโครงสร้างเบื้องต้น แสดงตัวอย่างคำตอบ แล้วให้คุณประเมินตัวเอง');
    return h;
  }

  function part7() {
    var h = partHead(7);
    var rules = '<div class="table-wrap"><table class="tbl"><thead><tr><th>ลำดับ</th><th>ส่วนของประโยค</th><th>ตัวอย่าง</th></tr></thead><tbody>' +
      '<tr><td>1</td><td>เวลา</td><td lang="ja">きのう・まいにち・あさ</td></tr>' +
      '<tr><td>2</td><td>บุคคล + と / ยานพาหนะ + で</td><td lang="ja">ともだちと・くるまで</td></tr>' +
      '<tr><td>3</td><td>สถานที่ + へ / สถานที่ + で</td><td lang="ja">だいがくへ・デパートで</td></tr>' +
      '<tr><td>4</td><td>กรรม + を</td><td lang="ja">えいがを・パンを</td></tr>' +
      '<tr><td>5</td><td>กริยา (ท้ายประโยคเสมอ)</td><td lang="ja">いきます・みました</td></tr></tbody></table></div>' +
      '<p class="muted">ลำดับ 2–4 สลับกันได้บ้าง แต่ <b>กริยาต้องอยู่ท้ายสุด</b> และคำช่วยต้องตามหลังคำที่มันกำกับ · สไลด์บทที่ 6 (คำนาม を) ระบุว่า "ออกข้อสอบพาร์ทเรียงประโยค"</p>';
    h += studySection(card('หลักการเรียงประโยค', rules, '', 'i-list-checks'));
    h += practiceSection(['p7-main', 'p7-extra'], 'ข้อสอบจริง 5 ข้อ 10 คะแนน (ข้อละ 2 คะแนน)');
    return h;
  }

  /* ======================= GRAMMAR ======================= */
  function grammar() {
    var h = head('Study Resources', 'Grammar & Memory Tips', 'ไวยากรณ์จากบทที่ 5–6 และเอกสารติว ที่ใช้ได้กับหลาย Part · <b>ไม่ใช่ Part ของข้อสอบ</b>');
    h += '<nav class="chips gnav" aria-label="หัวข้อไวยากรณ์">' + JF.grammar.map(function (g) {
      return '<a class="chip chip-link" href="#/grammar/' + g.id + '">' + esc(g.title.split(/[／(—]/)[0].trim()) + '</a>';
    }).join('') + '</nav>';
    JF.grammar.forEach(function (g) {
      var qsId = 'gq-' + g.id;
      if (!JF.sets[qsId]) {
        JF.sets[qsId] = { title: 'Mini quiz', compact: true, src: 'additional', items: [{ id: 'q', type: 'mc', src: 'additional', q: g.quiz.q, jp: g.quiz.jp, options: g.quiz.options, answer: g.quiz.answer, explain: g.quiz.explain }] };
      }
      h += '<article class="card gcard" id="' + g.id + '">' +
        '<div class="g-top"><span class="g-tag">' + esc(g.tag) + '</span><span class="src-badge src-doc">' + esc(JF.sourceLabels[g.src]) + '</span>' +
        (g.parts.length ? '<span class="g-parts">' + g.parts.map(function (p) { return '<a href="#/part-' + p + '">Part ' + p + '</a>'; }).join('') + '</span>' : '') + '</div>' +
        '<h2 class="card-title">' + esc(g.title) + '</h2>' +
        '<p class="g-pattern" lang="ja">' + esc(g.pattern) + '</p>' +
        '<dl class="dl"><dt>ความหมาย</dt><dd>' + esc(g.meaning) + '</dd><dt>การใช้</dt><dd>' + esc(g.usage) + '</dd>' +
        (g.pron ? '<dt>การออกเสียง</dt><dd>' + esc(g.pron) + '</dd>' : '') + '</dl>' +
        '<div class="g-examples">' + g.examples.map(function (x) {
          return '<div class="g-ex"><div class="srow-jp">' + U.sentence(x.jp, { audio: true }) + '</div><p class="romaji">' + esc(x.romaji) + '</p><p class="th-meaning">' + esc(x.th) + '</p>' +
            '<div class="bd" aria-label="แยกคำ">' + x.bd.map(function (b) { return '<span class="bd-cell"><span lang="ja">' + esc(b[0]) + '</span><small>' + esc(b[1]) + '</small></span>'; }).join('') + '</div></div>';
        }).join('') + '</div>' +
        (g.compare ? '<div class="rule">' + icon('i-lightbulb') + '<p>' + esc(g.compare) + '</p></div>' : '') +
        (g.note ? '<p class="g-note">' + icon('i-alert') + esc(g.note) + '</p>' : '') +
        '<p class="mini-title">ข้อผิดพลาดที่พบบ่อย</p><ul class="crosses">' + g.mistakes.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
        '<p class="mini-title">Mini quiz</p>' + X.renderSet(qsId) +
        '</article>';
    });
    return h;
  }

  /* ======================= KANA CHART ======================= */
  var kq = null;
  function kanaChart() {
    var sc = S.setting('kanaScript'), showR = S.setting('kanaRomaji');
    var h = head('Study Resources', 'Japanese Kana Reference', 'ตารางฮิรางานะ・คาตาคานะ · แตะตัวอักษรเพื่อฟังเสียงและดูรายละเอียด');
    h += '<div class="kana-tools"><div class="seg" role="group" aria-label="ชนิดตัวอักษร">' +
      '<button type="button" data-kscript="h" aria-pressed="' + (sc === 'h') + '"><span lang="ja">ひらがな</span> Hiragana</button>' +
      '<button type="button" data-kscript="k" aria-pressed="' + (sc === 'k') + '"><span lang="ja">カタカナ</span> Katakana</button></div>' +
      '<label class="sw sw-inline"><input type="checkbox" id="kRomaji"' + (showR ? ' checked' : '') + '><span class="sw-ui" aria-hidden="true"></span><span>แสดงโรมาจิ</span></label></div>';
    h += '<div class="kana-layout"><div class="kana-charts' + (showR ? '' : ' no-r') + '" id="kanaCharts">';
    JF.kana.sections.forEach(function (s) { h += kanaSection(s, sc); });
    h += '<details class="extra"><summary>' + esc(JF.kana.rare.title) + '</summary>' + kanaSection({ id: 'rare', title: '', cols: ['—'], rows: JF.kana.rare.rows }, sc) + '</details>';
    h += '</div><aside class="kana-side"><div class="card kana-detail" id="kanaDetail" aria-live="polite"><p class="muted">แตะตัวอักษรในตารางเพื่อดูรายละเอียด</p></div>' +
      '<div class="card kq" id="kanaQuiz">' + kqInner() + '</div></aside></div>';
    return h;
  }
  function kanaSection(s, sc) {
    var h = '<section class="kana-sec">' + (s.title ? '<h2 class="kana-sec-title">' + esc(s.title) + '</h2>' : '') +
      '<div class="kana-table" role="table" aria-label="' + esc(s.title || 'kana') + '" style="--kcols:' + s.cols.length + '">' +
      '<div class="kr kr-head" role="row"><span role="columnheader" class="kh"></span>' + s.cols.map(function (c) { return '<span role="columnheader" class="kh">' + esc(c) + '</span>'; }).join('') + '</div>';
    s.rows.forEach(function (r) {
      h += '<div class="kr" role="row"><span role="rowheader" class="kh kh-row" lang="ja">' + esc(sc === 'k' ? toKata(r[0]) : r[0]) + '</span>';
      r[1].forEach(function (c) {
        if (!c) { h += '<span class="kc kc-empty" role="cell"></span>'; return; }
        var ch = sc === 'k' ? c[1] : c[0];
        h += '<span role="cell"><button type="button" class="kc" data-kana="' + esc(ch) + '" data-r="' + esc(c[2]) + '" data-alt="' + esc(sc === 'k' ? c[0] : c[1]) + '" aria-label="' + esc(ch + ' ' + c[2]) + '"><span class="kc-ch" lang="ja">' + esc(ch) + '</span><span class="kc-r">' + esc(c[2]) + '</span></button></span>';
      });
      h += '</div>';
    });
    return h + '</div></section>';
  }
  function toKata(s) { return String(s).replace(/[ぁ-ゖ]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) + 0x60); }); }
  function kanaDetail(ch, r, alt) {
    var note = JF.kana.notes[ch] || JF.kana.notes[U.toHira(ch)] || '';
    return '<p class="kd-ch" lang="ja">' + esc(ch) + '</p><p class="kd-r">' + esc(r) + '</p>' +
      '<p class="kd-alt">' + (/[ァ-ヶ]/.test(ch) ? 'ฮิรางานะ' : 'คาตาคานะ') + ': <span lang="ja">' + esc(alt) + '</span></p>' +
      (note ? '<p class="kd-note">' + esc(note) + '</p>' : '') + U.audioBtn(ch, 'ฟังเสียง ' + ch, 'au-lg');
  }
  function kqNew() {
    var sc = S.setting('kanaScript');
    var pool = JF.kana.all.filter(function (c) { return c.group !== 'yoon'; });
    var c = pool[Math.floor(Math.random() * pool.length)];
    var opts = [c.r];
    U.shuffle(pool).forEach(function (o) { if (opts.length < 4 && opts.indexOf(o.r) < 0) opts.push(o.r); });
    kq = { ch: sc === 'k' ? c.k : c.h, r: c.r, opts: U.shuffle(opts), pick: null, score: kq ? kq.score : 0, n: kq ? kq.n : 0 };
  }
  function kqInner() {
    if (!kq) kqNew();
    var h = '<h2 class="card-title">' + icon('i-clipboard') + 'Mini Quiz <small>' + kq.score + '/' + kq.n + '</small></h2>' +
      '<p class="kq-ch" lang="ja">' + esc(kq.ch) + '</p><div class="kq-opts">';
    kq.opts.forEach(function (o) {
      var c = 'mc-opt';
      if (kq.pick) { if (o === kq.r) c += ' is-correct'; else if (o === kq.pick) c += ' is-wrong'; }
      h += '<button type="button" class="' + c + '" data-kq="pick" data-v="' + esc(o) + '"' + (kq.pick ? ' disabled' : '') + '>' + esc(o) + '</button>';
    });
    h += '</div>';
    if (kq.pick) h += '<button type="button" class="btn btn-sm btn-primary" data-kq="next">ตัวถัดไป ' + icon('i-arrow-right') + '</button>';
    return h;
  }

  /* ======================= KANA FLASHCARDS ======================= */
  var kf = { deck: 'h', ext: false };
  function kanaFlash() {
    var h = head('Study Resources', 'Kana Flashcards', 'แฟลชการ์ดฮิรางานะ / คาตาคานะ · บันทึกความคืบหน้าในเครื่องนี้');
    h += '<div class="kana-tools"><div class="seg" role="group" aria-label="เลือกชุดการ์ด">' +
      [['h', 'Hiragana ひらがな'], ['k', 'Katakana カタカナ'], ['mix', 'Mixed รวม'], ['hard', 'Difficult ใบที่ต้องฝึก']].map(function (d) {
        return '<button type="button" data-kf="' + d[0] + '" aria-pressed="' + (kf.deck === d[0]) + '">' + esc(d[1]) + '</button>';
      }).join('') + '</div>' +
      '<label class="sw sw-inline"><input type="checkbox" id="kfExt"' + (kf.ext ? ' checked' : '') + '><span class="sw-ui" aria-hidden="true"></span><span>รวมเสียงขุ่น / กึ่งขุ่น / เสียงควบ</span></label></div>';
    h += '<div id="kfDeck">' + kfDeck() + '</div>';
    h += '<p class="muted kbd-help">คีย์ลัด: <kbd>Space</kbd> พลิก · <kbd>←</kbd><kbd>→</kbd> เลื่อน · <kbd>K</kbd> รู้แล้ว · <kbd>J</kbd> ต้องฝึก</p>';
    return h;
  }
  function kfDeck() {
    var src = kf.ext ? JF.kana.all : JF.kana.basicList;
    function mk(c, script) {
      var ch = script === 'k' ? c.k : c.h;
      return { key: script + ':' + ch, front: '<span class="fc-kana" lang="ja">' + esc(ch) + '</span>', back: '<span class="fc-big">' + esc(c.r) + '</span><span class="fc-sub">' + (script === 'k' ? 'カタカナ Katakana' : 'ひらがな Hiragana') + ' · <span lang="ja">' + esc(script === 'k' ? c.h : c.k) + '</span></span>' + (JF.kana.notes[c.h] ? '<span class="fc-hint">' + esc(JF.kana.notes[c.h]) + '</span>' : ''), say: ch };
    }
    var cards;
    if (kf.deck === 'h') cards = src.map(function (c) { return mk(c, 'h'); });
    else if (kf.deck === 'k') cards = src.map(function (c) { return mk(c, 'k'); });
    else cards = src.map(function (c) { return mk(c, 'h'); }).concat(src.map(function (c) { return mk(c, 'k'); }));
    return JF.flash.deck('kana-' + kf.deck, cards, { title: 'คานะ', store: 'kana', onlyHard: kf.deck === 'hard' });
  }

  /* ======================= PRE-FINAL ======================= */
  var timer = { start: 0, acc: 0, run: false, iv: null };
  function prefinal() {
    var exam = S.setting('mode') === 'exam';
    var h = head('Final Preparation', 'Pre-Final Practice', 'แบบฝึกหัดจาก <b>เอกสารติวก่อนสอบปลายภาค</b> ตามลำดับและการจัดกลุ่มในเอกสาร');
    h += '<section class="card pf-mode"><div class="pf-mode-row"><div><h2 class="card-title">' + icon(exam ? 'i-graduation' : 'i-book-open') + (exam ? 'Mock Exam Mode' : 'Practice Mode') + '</h2>' +
      '<p class="muted">' + (exam ? 'ซ่อนเฉลย คำใบ้ และการตรวจทีละข้อ — ทำให้ครบแล้วกด "ส่งคำตอบทั้งหมด" เพื่อดูคะแนนแยกตาม Part' : 'ตรวจทีละข้อได้ทันที พร้อมคำอธิบาย · ความคืบหน้าถูกบันทึกไว้') + '</p></div>' +
      '<div class="seg" role="group" aria-label="โหมด"><button type="button" data-mode-set="study" aria-pressed="' + !exam + '">Practice</button><button type="button" data-mode-set="exam" aria-pressed="' + exam + '">Mock Exam</button></div></div>' +
      '<div class="pf-tools"><div class="timer" id="pfTimer"><span class="timer-label">' + icon('i-timer') + 'จับเวลา (ไม่บังคับ)</span><span class="timer-val" id="pfTime">' + fmt(elapsed()) + '</span>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-timer="toggle">' + icon(timer.run ? 'i-pause' : 'i-play') + (timer.run ? 'หยุด' : 'เริ่ม') + '</button>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-timer="reset">' + icon('i-rotate') + 'รีเซ็ต</button></div>' +
      '<p class="muted small">เอกสารไม่ได้ระบุเวลาสอบ — ตัวจับเวลานี้เป็นเครื่องมือเสริมเท่านั้น</p></div>' +
      '<div class="pf-actions">' + (exam ? '<button type="button" class="btn btn-primary" data-pf="submit-all">' + icon('i-flag') + 'ส่งคำตอบทั้งหมด</button>' : '') +
      '<button type="button" class="btn btn-ghost" data-pf="reset-all">' + icon('i-rotate') + 'รีเซ็ต Pre-Final ทั้งหมด</button></div></section>';
    h += '<section class="card" id="pfResults">' + pfResults() + '</section>';
    h += '<nav class="chips pf-nav" aria-label="ไปยังส่วน">' + JF.prefinal.map(function (s) { return '<a class="chip chip-link" href="#/prefinal/' + s.id + '">' + esc(s.title.split('·')[0].trim()) + '</a>'; }).join('') + '</nav>';
    JF.prefinal.forEach(function (s) { h += '<div class="pf-block" id="' + s.id + '">' + X.renderSet(s.id) + '</div>'; });
    return h;
  }
  function pfResults() {
    var rows = '', tot = { total: 0, correct: 0, incorrect: 0, unanswered: 0, pending: 0, shown: 0 };
    JF.prefinal.forEach(function (s) {
      var r = X.stats(s.id);
      for (var k in tot) tot[k] += r[k] || 0;
      rows += '<tr><td><a href="#/prefinal/' + s.id + '">' + esc(s.title) + '</a></td><td>' + r.total + '</td><td class="r-ok">' + (r.shown ? r.correct : '–') + '</td><td class="r-no">' + (r.shown ? r.incorrect : '–') + '</td><td>' + r.unanswered + '</td><td>' + (r.shown && r.pending ? r.pending : '–') + '</td></tr>';
    });
    var score = tot.total ? Math.round(tot.correct / tot.total * 100) : 0;
    return '<h2 class="card-title">' + icon('i-list-checks') + 'ผลลัพธ์แยกตาม Part</h2>' +
      '<div class="pf-sum"><div class="res-score"><b>' + (tot.shown ? score + '%' : '–') + '</b><span>คะแนนรวม</span></div><ul class="res-list">' +
      '<li class="r-ok">' + icon('i-check') + 'ถูก <b>' + tot.correct + '</b></li><li class="r-no">' + icon('i-x') + 'ผิด <b>' + tot.incorrect + '</b></li>' +
      '<li class="r-skip">ยังไม่ตอบ <b>' + tot.unanswered + '</b></li><li class="r-self">' + icon('i-pencil') + 'รอตรวจเอง <b>' + tot.pending + '</b></li></ul></div>' +
      '<div class="table-wrap"><table class="tbl tbl-res"><thead><tr><th>ส่วน</th><th>ข้อ</th><th>ถูก</th><th>ผิด</th><th>ยังไม่ตอบ</th><th>ตรวจเอง</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="muted small">ข้อเขียน (Part 6) ตรวจอัตโนมัติไม่ได้ — ให้เทียบกับตัวอย่างคำตอบแล้วประเมินตัวเอง</p>';
  }
  function elapsed() { return timer.acc + (timer.run ? Date.now() - timer.start : 0); }
  function fmt(ms) { var s = Math.floor(ms / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); }
  function timerAct(a) {
    if (a === 'toggle') {
      if (timer.run) { timer.acc = elapsed(); timer.run = false; clearInterval(timer.iv); }
      else { timer.start = Date.now(); timer.run = true; timer.iv = setInterval(function () { var t = document.getElementById('pfTime'); if (t) t.textContent = fmt(elapsed()); }, 500); }
    } else { timer.acc = 0; timer.start = Date.now(); if (!timer.run) clearInterval(timer.iv); }
    var el = document.getElementById('pfTimer');
    if (el) {
      el.querySelector('#pfTime').textContent = fmt(elapsed());
      el.querySelector('[data-timer="toggle"]').innerHTML = icon(timer.run ? 'i-pause' : 'i-play') + (timer.run ? 'หยุด' : 'เริ่ม');
    }
  }

  /* ======================= ANSWER KEY ======================= */
  var AK = [
    { part: 1, sets: ['pf-a', 'pf-1'] },
    { part: 2, sets: ['pf-2'] },
    { part: 3, sets: ['p3-main', 'pf-3'] },
    { part: 4, sets: ['pf-4', 'p4-extra'] },
    { part: 5, sets: ['pf-5'] },
    { part: 6, sets: ['pf-6', 'p6-extra'] },
    { part: 7, sets: ['pf-7', 'p7-extra'] }
  ];
  function answersLocked() {
    return S.setting('mode') === 'exam' && JF.prefinal.some(function (s) { return !S.meta(s.id).submitted; });
  }
  function answers() {
    var h = head('Final Preparation', 'Answer Key &amp; Explanations', 'รวมเฉลยและคำอธิบายแบบฝึกหัดก่อนสอบปลายภาค');
    if (answersLocked()) {
      return h + '<div class="locked-card big">' + icon('i-lock') + '<div><p><b>เฉลยถูกล็อกในโหมดสอบ</b></p><p>ส่งคำตอบ Pre-Final Practice ให้ครบทุกส่วนก่อน หรือสลับเป็นโหมดเรียนเพื่อดูเฉลย</p>' +
        '<div class="row-gap"><a class="btn btn-sm btn-soft" href="#/prefinal">' + icon('i-clipboard') + 'ไปที่ Pre-Final</a><button type="button" class="btn btn-sm btn-ghost" data-mode-set="study">' + icon('i-book-open') + 'สลับเป็นโหมดเรียน</button></div></div></div>';
    }
    h += '<div class="ak-toolbar"><nav class="chips" aria-label="ไปยัง Part">' + AK.map(function (a) { return '<a class="chip chip-link" href="#/answers/ak-' + a.part + '">Part ' + a.part + '</a>'; }).join('') + '</nav>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-ak="none-all">' + icon('i-eye-off') + 'ซ่อนทั้งหมด</button></div>';
    AK.forEach(function (a) {
      var p = BP.parts[a.part - 1];
      h += '<section class="card ak-part" id="ak-' + a.part + '"><div class="ak-head"><h2 class="card-title"><span class="bp-num">Part ' + a.part + '</span>' + esc(p.title) + '</h2>' +
        '<div class="row-gap"><button type="button" class="btn btn-sm btn-soft" data-ak="all">' + icon('i-eye') + 'เปิดเฉลยทั้ง Part</button><button type="button" class="btn btn-sm btn-ghost" data-ak="none">' + icon('i-eye-off') + 'ซ่อน</button></div></div>';
      var mistakes = [];
      p.grammar.forEach(function (gid) { var g = JF.grammar.filter(function (x) { return x.id === gid; })[0]; if (g) mistakes.push(g.mistakes[0]); });
      a.sets.forEach(function (sid) {
        var set = JF.sets[sid];
        h += '<div class="ak-set"><div class="ex-head-row"><h3 class="ak-set-title">' + esc(set.title) + '</h3>' + X.srcBadge(set.src) + '</div>';
        set.items.forEach(function (it, i) {
          h += '<div class="ak-item" data-locked="0"><div class="ak-q"><span class="ex-num">' + (i + 1) + '</span><div class="ak-q-body">' + questionHtml(it) + '</div></div>' +
            '<div class="ak-btns"><button type="button" class="btn btn-sm btn-ghost" data-ak="ans" aria-expanded="false">' + icon('i-key') + 'ดูเฉลย</button>' +
            '<button type="button" class="btn btn-sm btn-ghost" data-ak="exp" aria-expanded="false">' + icon('i-lightbulb') + 'ดูคำอธิบาย</button></div>' +
            '<div class="ak-ans" hidden>' + X.answerHtml(it, set) + '</div>' +
            '<div class="ak-exp" hidden>' + (it.explain ? '<p>' + U.rich(it.explain) + '</p>' : '') +
            (p.grammar.length ? '<p class="ak-g">ไวยากรณ์: ' + p.grammar.slice(0, 3).map(grammarChip).join('') + '</p>' : '') +
            (mistakes.length ? '<p class="ak-m">' + icon('i-alert') + 'ข้อผิดพลาดที่พบบ่อย: ' + esc(mistakes.slice(0, 2).join(' · ')) + '</p>' : '') + '</div></div>';
        });
        h += '</div>';
      });
      h += '</section>';
    });
    return h;
  }
  function questionHtml(it) {
    switch (it.type) {
      case 'match':
        return (it.origHtml ? '<span class="jp-sent" lang="ja">' + it.origHtml + '</span>' : U.sentence(it.jp)) + '<span class="romaji">' + esc(it.romaji) + '</span>' +
          '<span class="ak-hint">' + (it.list === 'p1th' ? 'ความหมายคือ?' : 'คำถามคือ?') + '</span>';
      case 'mc':
        return '<span>' + U.rich(it.q, { plain: true }) + '</span>' + (it.jp ? ' ' + U.sentence(it.jp, { plain: true }) : '') + (it.big ? ' <b lang="ja">' + esc(it.big) + '</b>' : '') +
          '<span class="ak-opts">' + it.options.map(function (o, k) { return U.letters[k] + '. ' + esc(o); }).join('　') + '</span>';
      case 'text':
        return (it.img ? '<img class="ak-img" src="assets/images/' + esc(it.img) + '" alt="' + esc(it.alt || '') + '" loading="lazy">' : '') +
          (it.big ? '<b class="ak-big" lang="ja">' + esc(it.big) + '</b>' + (it.bigSub ? ' <small>' + esc(it.bigSub) + '</small>' : '') : '') +
          '<span class="ak-hint">' + esc(it.fields.map(function (f) { return f.label; }).join(' + ')) + '</span>';
      case 'bank':
        return '<img class="ak-img" src="assets/images/' + esc(it.img) + '" alt="' + esc(it.alt || '') + '" loading="lazy"><span class="ak-hint">ภาพนี้คือคำกริยาใด?</span>';
      case 'open':
        return U.sentence(it.jp) + '<span class="romaji">' + esc(it.romaji) + '</span>';
      case 'order':
        return '<span lang="ja" class="ak-chips">' + esc(it.chips.join(' / ')) + '</span>';
    }
    return '';
  }

  /* ======================= Events for page widgets ======================= */
  function bind() {
    document.addEventListener('click', function (e) {
      var t;
      if ((t = e.target.closest('[data-day-reveal]'))) {
        t.closest('.day-card').classList.toggle('show-' + t.getAttribute('data-day-reveal'));
      } else if ((t = e.target.closest('[data-day-all]'))) {
        var on = t.getAttribute('data-day-all') === 'show';
        document.querySelectorAll('.day-card').forEach(function (c) { c.classList.toggle('show-reading', on); c.classList.toggle('show-meaning', on); });
      } else if ((t = e.target.closest('[data-dayform]'))) {
        S.setting('dayForm', t.getAttribute('data-dayform'));
        JF.app.rerender();
      } else if ((t = e.target.closest('[data-drill]'))) {
        if (t.getAttribute('data-drill') === 'show') drillState.shown = true;
        else { var n; do { n = Math.floor(Math.random() * 7); } while (n === drillState.i); drillState = { i: n, shown: false }; }
        var dd = document.getElementById('dayDrill'); if (dd) dd.innerHTML = drillInner();
      } else if ((t = e.target.closest('[data-kscript]'))) {
        S.setting('kanaScript', t.getAttribute('data-kscript')); kq = null; JF.app.rerender();
      } else if ((t = e.target.closest('.kc[data-kana]'))) {
        JF.audio.speak(t.getAttribute('data-kana'), null);
        var d = document.getElementById('kanaDetail');
        if (d) d.innerHTML = kanaDetail(t.getAttribute('data-kana'), t.getAttribute('data-r'), t.getAttribute('data-alt'));
        document.querySelectorAll('.kc.is-sel').forEach(function (x) { x.classList.remove('is-sel'); });
        t.classList.add('is-sel');
      } else if ((t = e.target.closest('[data-kq]'))) {
        if (t.getAttribute('data-kq') === 'pick') { kq.pick = t.getAttribute('data-v'); kq.n++; if (kq.pick === kq.r) kq.score++; JF.audio.speak(kq.ch); }
        else kqNew();
        var q = document.getElementById('kanaQuiz'); if (q) { q.innerHTML = kqInner(); var f = q.querySelector('[data-kq]:not([disabled])'); if (f) f.focus(); }
      } else if ((t = e.target.closest('[data-kf]'))) {
        kf.deck = t.getAttribute('data-kf'); JF.flash.stopAll(); JF.app.rerender();
      } else if ((t = e.target.closest('[data-timer]'))) {
        timerAct(t.getAttribute('data-timer'));
      } else if ((t = e.target.closest('[data-pf]'))) {
        if (t.getAttribute('data-pf') === 'submit-all') {
          var un = 0; JF.prefinal.forEach(function (s) { un += X.stats(s.id).unanswered; });
          if (un && !window.confirm('ยังมี ' + un + ' ข้อที่ยังไม่ได้ตอบ ต้องการส่งคำตอบทั้งหมดเลยหรือไม่?')) return;
          JF.prefinal.forEach(function (s) { if (!S.meta(s.id).submitted) X.submitSet(s.id); });
          JF.app.rerender();
          var r = document.getElementById('pfResults'); if (r) r.scrollIntoView({ block: 'start' });
        } else if (window.confirm('รีเซ็ตคำตอบ Pre-Final Practice ทั้งหมด?')) {
          JF.prefinal.forEach(function (s) { S.resetSet(s.id); });
          JF.app.rerender();
        }
      } else if ((t = e.target.closest('[data-ak]'))) {
        var a = t.getAttribute('data-ak');
        if (a === 'ans' || a === 'exp') {
          var box = t.closest('.ak-item').querySelector('.ak-' + a);
          box.hidden = !box.hidden; t.setAttribute('aria-expanded', String(!box.hidden));
        } else {
          var scope = a === 'none-all' ? document : t.closest('.ak-part');
          var show = a === 'all';
          scope.querySelectorAll('.ak-ans, .ak-exp').forEach(function (b) { b.hidden = !show; });
          scope.querySelectorAll('[data-ak="ans"], [data-ak="exp"]').forEach(function (b) { b.setAttribute('aria-expanded', String(show)); });
        }
      } else if ((t = e.target.closest('[data-reset-part]'))) {
        var pn = Number(t.getAttribute('data-reset-part'));
        if (!window.confirm('รีเซ็ตคำตอบทั้งหมดใน Part ' + pn + '?')) return;
        X.partSets(pn).forEach(function (id) { S.resetSet(id); });
        JF.app.rerender();
      }
    });
    document.addEventListener('change', function (e) {
      if (e.target.id === 'kRomaji') {
        S.setting('kanaRomaji', e.target.checked);
        var c = document.getElementById('kanaCharts'); if (c) c.classList.toggle('no-r', !e.target.checked);
      } else if (e.target.id === 'kfExt') {
        kf.ext = e.target.checked; JF.flash.stopAll();
        var d = document.getElementById('kfDeck'); if (d) d.innerHTML = kfDeck();
      } else if (e.target.matches('[data-check]')) {
        S.check(e.target.getAttribute('data-check'), e.target.checked);
        document.querySelectorAll('.cl-prog').forEach(function (p) {
          p.innerHTML = '<b>' + BP.checklist.filter(function (c) { return S.check(c.id); }).length + '</b>/' + BP.checklist.length + ' หัวข้อ';
        });
      }
    });
    document.addEventListener('jf:progress', function () {
      var r = document.getElementById('pfResults');
      if (r) r.innerHTML = pfResults();
    });
  }

  return {
    overview: overview, blueprint: blueprint,
    part: function (n) { return [null, part1, part2, part3, part4, part5, part6, part7][n](); },
    grammar: grammar, kanaChart: kanaChart, kanaFlash: kanaFlash, prefinal: prefinal, answers: answers,
    bind: bind
  };
})();
