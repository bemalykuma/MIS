/* Exercise engine — renders, grades and persists every practice set.
 * Item types: match | mc | text | bank | open | order
 * Study mode: per-item "check" with immediate feedback.
 * Exam mode : no feedback, hints or translations until the set is submitted.
 */
window.JF = window.JF || {};

JF.ex = (function () {
  var U = JF.ui, S = JF.store, V = JF.vocabById, esc = U.esc, icon = U.icon;
  var L = U.letters;

  var SRC_LABEL = {
    doc: ['src-doc', 'จากเอกสาร'],
    derived: ['src-derived', 'แปลงจากตารางในเอกสาร'],
    additional: ['src-add', 'แบบฝึกเพิ่มเติม']
  };
  function srcBadge(src) {
    var s = SRC_LABEL[src] || SRC_LABEL.doc;
    return '<span class="src-badge ' + s[0] + '">' + s[1] + '</span>';
  }

  function mode() { return S.setting('mode'); }
  function effMode(set) { return set.compact ? 'study' : mode(); }
  function st(setId, item) { return S.answer(setId, item.id) || {}; }
  function feedbackOn(setId, set, item) {
    if (S.meta(setId).submitted) return true;
    if (set.type === 'bank') return false;
    return effMode(set) === 'study' && !!st(setId, item).checked;
  }
  function vocabWord(id) { return V[id]; }

  /* ================= Grading ================= */
  function checkField(f, input) {
    input = input || '';
    if (!input.trim()) return { ok: false, empty: true };
    if (f.kind === 'thai') {
      var t = U.normThai(input);
      return { ok: f.answers.some(function (a) { return U.normThai(a) === t; }) };
    }
    var n = U.normKana(input);
    var answers = f.answers.map(U.normKana);
    if (answers.indexOf(n) >= 0) return { ok: true };
    if (U.isRomaji(input)) {
      var r = U.normRomaji(input);
      var rOk = (f.romaji || []).some(function (a) { return U.normRomaji(a) === r; });
      if (f.kind === 'reading') return rOk ? { ok: true } : { ok: false, note: longVowelNote(r, f.romaji) };
      if (rOk) return { ok: false, note: f.hira ? 'อ่านถูก แต่ข้อนี้ต้องตอบเป็นฮิรางานะ: ' + f.answers[0] : 'อ่านถูก แต่ข้อนี้ต้องตอบเป็นอักษรญี่ปุ่น (คานะ)' };
      return { ok: false };
    }
    var h = U.toHira(n);
    if (answers.some(function (a) { return U.toHira(a) === h; })) {
      if (f.kind === 'reading') return { ok: true, note: 'คำอ่านควรเขียนเป็นฮิรางานะ' };
      var kata = /[ァ-ヶ]/.test(f.answers[0]);
      return { ok: false, note: kata ? 'คำนี้เป็นคำทับศัพท์ ต้องเขียนด้วยคาตาคานะ: ' + f.answers[0] : 'คำนี้เขียนด้วยฮิรางานะ: ' + f.answers[0] };
    }
    return { ok: false };
  }
  function longVowelNote(r, romajis) {
    var strip = function (s) { return s.replace(/ou|uu|oo/g, 'o').replace(/aa/g, 'a').replace(/ii/g, 'i'); };
    if ((romajis || []).some(function (a) { return strip(U.normRomaji(a)) === strip(r); })) return 'ระวังเสียงยาว เช่น ようび = yōbi / youbi';
    return '';
  }

  function grade(item, s) {
    var v = s.v;
    switch (item.type) {
      case 'match': return { answered: !!v, ok: v === item.answer };
      case 'mc': return { answered: v !== undefined && v !== null && v !== '', ok: Number(v) === item.answer };
      case 'bank': return { answered: !!v, ok: v === item.answer };
      case 'text':
        v = v || {};
        var fields = {}, all = true, any = false;
        item.fields.forEach(function (f) {
          var r = checkField(f, v[f.key]);
          fields[f.key] = r;
          if (!r.ok) all = false;
          if (!r.empty) any = true;
        });
        return { answered: any, ok: all, fields: fields };
      case 'open':
        return { answered: !!(v && String(v).trim()), self: true, ok: s.self === 'ok' ? true : s.self === 'no' ? false : null };
      case 'order':
        var seq = (v || []).map(function (i) { return item.chips[i]; });
        var full = seq.length === item.chips.length;
        return { answered: seq.length > 0, ok: full && item.answers.some(function (a) { return a.join('|') === seq.join('|'); }) };
    }
    return { answered: false, ok: false };
  }

  function stats(setId) {
    var set = JF.sets[setId];
    var r = { total: set.items.length, answered: 0, shown: 0, correct: 0, incorrect: 0, unanswered: 0, pending: 0 };
    set.items.forEach(function (it) {
      var s = st(setId, it), g = grade(it, s);
      if (g.answered) r.answered++; else r.unanswered++;
      if (!feedbackOn(setId, set, it)) return;
      r.shown++;
      if (!g.answered) return;
      if (g.ok === true) r.correct++;
      else if (g.ok === false) r.incorrect++;
      else r.pending++;
    });
    return r;
  }

  /* ================= Rendering ================= */
  function renderSet(setId) {
    var set = JF.sets[setId];
    if (!set) return '';
    var m = S.meta(setId);
    var em = effMode(set);
    var h = '<section class="ex-set' + (set.compact ? ' is-compact' : '') + (set.type === 'bank' ? ' is-bank' : '') +
      '" id="set-' + setId + '" data-set="' + setId + '">';
    if (!set.compact) h += headHtml(setId, set);
    if (set.type === 'bank') h += bankHtml(setId, set);
    else {
      h += '<div class="ex-items">';
      set.items.forEach(function (it, i) { h += itemHtml(setId, set, it, i); });
      h += '</div>';
    }
    if (!set.compact) h += footHtml(setId, set, m, em);
    h += '</section>';
    return h;
  }

  function headHtml(setId, set) {
    var s = stats(setId);
    var pct = Math.round(s.answered / s.total * 100);
    var hint = '';
    if (set.hintWords && effMode(set) === 'study' && !S.meta(setId).submitted) {
      hint = '<details class="hint-bank"><summary>' + icon('i-lightbulb') + 'คำใบ้: รายการคำศัพท์</summary><div class="chips">' +
        U.shuffle(set.hintWords, setId).map(function (w) { return '<span class="chip" lang="ja">' + esc(w) + '</span>'; }).join('') + '</div></details>';
    }
    return '<header class="ex-head">' +
      '<div class="ex-head-text"><div class="ex-head-row"><h3 class="ex-title">' + esc(set.title) + '</h3>' + srcBadge(set.src) + '</div>' +
      (set.note ? '<p class="ex-note">' + esc(set.note) + '</p>' : '') + hint + '</div>' +
      '<div class="ex-prog" aria-label="ตอบแล้ว ' + s.answered + ' จาก ' + s.total + ' ข้อ">' +
      '<span class="ex-prog-num"><b>' + s.answered + '</b>/' + s.total + '</span>' +
      '<span class="bar"><span style="width:' + pct + '%"></span></span></div>' +
      '</header>';
  }

  function footHtml(setId, set, m, em) {
    var s = stats(setId);
    var btns = '';
    if (m.submitted) {
      btns += '<span class="ex-done">' + icon('i-check') + 'ส่งคำตอบแล้ว</span>';
    } else if (em === 'exam' || set.type === 'bank') {
      btns += '<button type="button" class="btn btn-primary" data-act="submit">' + icon('i-flag') + (set.type === 'bank' && em === 'study' ? 'ตรวจการจับคู่' : 'ส่งคำตอบ') + '</button>';
    } else {
      btns += '<button type="button" class="btn btn-primary" data-act="check-all">' + icon('i-check') + 'ตรวจทุกข้อที่ตอบแล้ว</button>';
    }
    if (s.shown && (s.incorrect || s.unanswered)) btns += '<button type="button" class="btn btn-ghost" data-act="only-wrong" aria-pressed="false">' + icon('i-eye') + 'ดูเฉพาะข้อที่ผิด/ยังไม่ตอบ</button>';
    btns += '<button type="button" class="btn btn-ghost" data-act="reset">' + icon('i-rotate') + 'รีเซ็ตชุดนี้</button>';

    var res = '';
    if (s.shown) {
      var score = Math.round(s.correct / s.total * 100);
      res = '<div class="ex-result" role="status">' +
        '<div class="res-score"><b>' + score + '%</b><span>คะแนน</span></div>' +
        '<ul class="res-list">' +
        '<li class="r-ok">' + icon('i-check') + 'ถูก <b>' + s.correct + '</b></li>' +
        '<li class="r-no">' + icon('i-x') + 'ผิด <b>' + s.incorrect + '</b></li>' +
        '<li class="r-skip">ยังไม่ตอบ <b>' + s.unanswered + '</b></li>' +
        (s.pending ? '<li class="r-self">' + icon('i-pencil') + 'รอตรวจเอง <b>' + s.pending + '</b></li>' : '') +
        '</ul>' + (em === 'study' && !m.submitted && s.shown < s.total ? '<p class="res-note">นับจากข้อที่ตรวจแล้ว ' + s.shown + ' ข้อ</p>' : '') + '</div>';
    } else if (em === 'exam' && !m.submitted) {
      res = '<p class="ex-exam-note">' + icon('i-lock') + 'โหมดสอบ: จะเห็นผลหลังจากกดส่งคำตอบ</p>';
    }
    return '<footer class="ex-foot"><div class="ex-actions">' + btns + '</div>' + res + '</footer>';
  }

  function itemHtml(setId, set, it, i) {
    var s = st(setId, it), fb = feedbackOn(setId, set, it), g = grade(it, s);
    var em = effMode(set), m = S.meta(setId);
    var cls = 'ex-item ex-' + it.type;
    if (fb) cls += g.ok === true ? ' is-ok' : g.ok === false ? ' is-no' : ' is-self';
    if (fb && !g.answered) cls += ' is-skip';
    var disabled = fb && (m.submitted || em === 'exam') ? ' disabled' : '';
    var h = '<article class="' + cls + '" id="it-' + setId + '-' + it.id + '" data-item="' + it.id + '" data-locked="' + (fb ? '0' : '1') + '">';
    h += '<div class="ex-item-head"><span class="ex-num">' + (i + 1) + '</span>';
    if (it.src && it.src !== set.src) h += srcBadge(it.src);
    if (it.handwritten) h += '<span class="src-badge src-hand">โน้ตเขียนมือในเอกสาร</span>';
    if (em === 'exam' && !fb && g.answered) h += '<span class="saved">' + icon('i-check') + 'บันทึกแล้ว</span>';
    h += '</div><div class="ex-body">';
    h += bodyHtml(setId, set, it, s, fb, disabled);
    h += '</div>';
    // actions
    if (!fb && em === 'study' && set.type !== 'bank') {
      h += '<div class="ex-item-actions"><button type="button" class="btn btn-sm btn-soft" data-act="check">' + icon('i-check') +
        (it.type === 'open' ? 'ตรวจโครงสร้าง & ดูตัวอย่างคำตอบ' : 'ตรวจคำตอบ') + '</button></div>';
    }
    if (fb) h += feedbackHtml(setId, set, it, s, g);
    if (fb && em === 'study' && !m.submitted) {
      h += '<div class="ex-item-actions"><button type="button" class="btn btn-sm btn-ghost" data-act="retry">' + icon('i-rotate') + 'ลองใหม่</button></div>';
    }
    h += '</article>';
    return h;
  }

  function bodyHtml(setId, set, it, s, fb, disabled) {
    var h = '';
    var name = 'r-' + setId + '-' + it.id;
    switch (it.type) {
      case 'match':
        h += '<div class="q-prompt">' + (it.origHtml ? '<span class="jp-sent jp-big" lang="ja">' + it.origHtml + '</span>' : U.sentence(it.jp, { big: true })) +
          U.audioBtn(U.ttsText(it.jp)) + '</div>';
        h += '<p class="romaji">' + esc(it.romaji) + '</p>';
        if (it.origHtml) h += '<p class="q-orig-note">ต้นฉบับ (คันจิพร้อมคำอ่าน)</p>';
        var list = JF.lists[it.list];
        h += '<label class="fld"><span class="fld-label">' + (it.list === 'p1th' ? 'ความหมายภาษาไทย' : 'คำถามที่ตรงกับคำตอบนี้') + '</span>' +
          '<select data-act="val"' + disabled + '><option value="">— เลือก —</option>' +
          U.shuffle(list, it.list).map(function (o) {
            return '<option value="' + esc(o) + '"' + (s.v === o ? ' selected' : '') + '>' + esc(o) + '</option>';
          }).join('') + '</select></label>';
        break;

      case 'mc':
        if (it.q) h += '<p class="q-text">' + U.rich(it.q, { plain: it.noHint && !fb }) + '</p>';
        if (it.jp) h += '<div class="q-prompt">' + U.sentence(it.jp, { big: true, plain: !fb }) + '</div>';
        if (it.big) h += '<div class="q-big" lang="ja">' + esc(it.big) + '</div>';
        h += '<div class="mc-opts" role="radiogroup">';
        it.options.forEach(function (o, k) {
          var c = 'mc-opt';
          if (fb && k === it.answer) c += ' is-correct';
          else if (fb && Number(s.v) === k) c += ' is-wrong';
          h += '<label class="' + c + '"><input type="radio" name="' + name + '" value="' + k + '" data-act="val"' +
            (String(s.v) === String(k) ? ' checked' : '') + disabled + '><span class="mc-letter">' + L[k] + '</span>' +
            '<span class="mc-text"' + (it.optionsTh ? '' : ' lang="ja"') + '>' + esc(o) + '</span></label>';
        });
        h += '</div>';
        break;

      case 'text':
        if (it.img) h += figure(it);
        if (it.big) {
          var bigText = it.dayId && S.setting('dayForm') === 'full' ? it.bigAlt : it.big;
          h += '<div class="q-big" lang="ja">' + esc(bigText) + '</div>';
          if (it.bigSub) h += '<p class="q-bigsub">' + esc(it.bigSub) + '</p>';
        }
        h += '<div class="fld-row">';
        var vals = s.v || {};
        it.fields.forEach(function (f) {
          h += '<label class="fld"><span class="fld-label">' + esc(f.label) + '</span>' +
            '<input type="text" data-act="val" data-key="' + f.key + '" value="' + esc(vals[f.key] || '') + '" placeholder="' + esc(f.placeholder || '') + '"' +
            (f.kind === 'thai' ? ' lang="th"' : ' lang="ja"') + ' autocomplete="off" autocapitalize="off" spellcheck="false"' + disabled + '></label>';
        });
        h += '</div>';
        break;

      case 'open':
        h += '<div class="q-prompt">' + U.sentence(it.jp, { big: true }) + U.audioBtn(U.ttsText(it.jp)) + '</div>';
        h += '<p class="romaji">' + esc(it.romaji) + '</p>';
        if (fb) h += '<p class="q-th">' + esc(it.th) + '</p>';
        h += '<label class="fld fld-wide"><span class="fld-label">คำตอบของคุณ (ภาษาญี่ปุ่น)</span>' +
          '<textarea rows="2" data-act="val" lang="ja" spellcheck="false"' + disabled + '>' + esc(s.v || '') + '</textarea></label>';
        break;

      case 'order':
        var used = s.v || [];
        h += '<p class="q-text">เรียงคำให้เป็นประโยคที่ถูกต้อง</p>';
        h += '<p class="q-text ord-th">“' + esc(it.th) + '”</p>';
        h += '<div class="ord-line" aria-label="ประโยคที่เรียงแล้ว">';
        if (!used.length) h += '<span class="ord-ph">แตะคำด้านล่างเพื่อเรียงประโยค</span>';
        used.forEach(function (ci, k) {
          h += '<button type="button" class="chip chip-on" data-act="ord-remove" data-k="' + k + '"' + disabled + ' lang="ja">' + esc(it.chips[ci]) + chipRomaji(it.chips[ci]) + '</button>';
        });
        h += '</div><div class="ord-bank">';
        it.chips.forEach(function (c, ci) {
          var isUsed = used.indexOf(ci) >= 0;
          h += '<button type="button" class="chip' + (isUsed ? ' is-used' : '') + '" data-act="ord-add" data-i="' + ci + '"' + (isUsed || disabled ? ' disabled' : '') + ' lang="ja">' + esc(c) + chipRomaji(c) + '</button>';
        });
        h += '</div>';
        if (used.length && !disabled) h += '<button type="button" class="btn btn-sm btn-ghost" data-act="ord-clear">' + icon('i-rotate') + 'ล้าง</button>';
        break;
    }
    return h;
  }

  function chipRomaji(c) {
    var hit = JF.vocabSurface[c];
    var v = hit && V[hit.id];
    return v ? '<span class="romaji chip-r">' + esc(hit.form ? '' : v.romaji) + '</span>' : '';
  }

  function figure(it) {
    return '<figure class="q-img"><button type="button" class="img-zoom" data-zoom="assets/images/' + esc(it.img) + '" aria-label="ขยายภาพ">' +
      '<img src="assets/images/' + esc(it.img) + '" alt="' + esc(it.alt || 'ภาพประกอบ') + '" loading="lazy"></button>' +
      (it.ownArt ? '<figcaption class="own-art" title="ภาพวาดประกอบใหม่ (ไม่มีในเอกสาร)">✎ ภาพประกอบใหม่</figcaption>' : '') + '</figure>';
  }

  /* ---------- Part 5: word bank (choices on top, pictures below) ---------- */
  function bankHtml(setId, set) {
    var m = S.meta(setId);
    var h = '<div class="bank-choices" aria-label="ตัวเลือกคำศัพท์">';
    set.options.forEach(function (vid, k) {
      var v = V[vid];
      h += '<div class="bank-choice"><span class="bank-letter">' + L[k] + '.</span>' +
        '<span class="bank-text"><span class="bank-kana" lang="ja">' + esc(v.kana) + '</span> ' +
        '<span class="bank-romaji">(' + esc(v.romaji) + ')</span></span>' + U.audioBtn(v.kana, 'ฟังเสียงตัวเลือก ' + L[k]) + '</div>';
    });
    h += '</div><div class="bank-grid">';
    set.items.forEach(function (it, i) {
      var s = st(setId, it), fb = !!m.submitted, g = grade(it, s);
      var cls = 'ex-item bank-card';
      if (fb) cls += g.ok ? ' is-ok' : ' is-no';
      if (fb && !g.answered) cls += ' is-skip';
      h += '<article class="' + cls + '" id="it-' + setId + '-' + it.id + '" data-item="' + it.id + '" data-locked="' + (fb ? '0' : '1') + '">';
      h += '<div class="ex-item-head"><span class="ex-num">' + (i + 1) + '</span></div>';
      h += figure(it);
      h += '<label class="fld bank-select"><span class="fld-label">คำตอบ</span><select data-act="val"' + (fb ? ' disabled' : '') + '><option value="">—</option>' +
        set.options.map(function (vid, k) { return '<option value="' + vid + '"' + (s.v === vid ? ' selected' : '') + '>' + L[k] + '</option>'; }).join('') +
        '</select></label>';
      if (fb) h += feedbackHtml(setId, set, it, s, g);
      h += '</article>';
    });
    return h + '</div>';
  }

  /* ---------- Feedback ---------- */
  function feedbackHtml(setId, set, it, s, g) {
    var cls = g.ok === true ? 'fb-ok' : g.ok === false ? 'fb-no' : 'fb-self';
    var title = !g.answered ? 'ยังไม่ได้ตอบ' : g.ok === true ? 'ถูกต้อง!' : g.ok === false ? 'ยังไม่ถูก' : 'ตรวจด้วยตนเอง';
    var h = '<div class="fb ' + (g.answered ? cls : 'fb-skip') + '" role="status">';
    h += '<p class="fb-title">' + icon(g.ok === true ? 'i-check' : g.ok === false || !g.answered ? 'i-x' : 'i-pencil') + title + '</p>';

    if (it.type === 'text' && g.fields) {
      it.fields.forEach(function (f) {
        var r = g.fields[f.key];
        if (r.note) h += '<p class="fb-note">' + icon('i-alert') + esc(r.note) + '</p>';
        else if (!r.ok && !r.empty && it.fields.length > 1) h += '<p class="fb-note">' + icon('i-x') + esc(f.label) + ' ยังไม่ถูก</p>';
      });
    }
    if (it.type === 'open') h += openReview(it, s);
    h += '<div class="fb-answer">' + answerHtml(it, set) + '</div>';
    if (it.explain) h += '<p class="fb-explain">' + U.rich(it.explain) + '</p>';
    h += '</div>';
    return h;
  }

  function openReview(it, s) {
    var txt = U.nfkc(s.v || '').replace(/時/g, 'じ').replace(/曜日/g, 'ようび').replace(/[\s　]/g, '');
    var h = '<ul class="fb-checks">';
    (it.check || []).forEach(function (c) {
      var ok = c.any.some(function (p) { return txt.indexOf(p) >= 0; });
      h += '<li class="' + (ok ? 'c-ok' : 'c-no') + '">' + icon(ok ? 'i-check' : 'i-x') + esc(c.tip) + '</li>';
    });
    h += '</ul><div class="self-row"><span>คำตอบของคุณถูกต้องไหม?</span>' +
      '<button type="button" class="btn btn-sm ' + (s.self === 'ok' ? 'btn-ok' : 'btn-ghost') + '" data-act="self" data-v="ok" aria-pressed="' + (s.self === 'ok') + '">' + icon('i-check') + 'ถูกแล้ว</button>' +
      '<button type="button" class="btn btn-sm ' + (s.self === 'no' ? 'btn-no' : 'btn-ghost') + '" data-act="self" data-v="no" aria-pressed="' + (s.self === 'no') + '">' + icon('i-x') + 'ยังไม่ถูก</button></div>';
    return h;
  }

  /* Correct-answer block (also used by the Answer Key page) */
  function answerHtml(it, set) {
    var h = '<span class="fb-label">' + (it.type === 'open' ? 'ตัวอย่างคำตอบ' : 'คำตอบที่ถูก') + '</span>';
    switch (it.type) {
      case 'match':
        if (it.list === 'p1th') {
          h += '<div class="ans-line">' + U.sentence(it.jp, { audio: true }) + '</div><p class="romaji">' + esc(it.romaji) + '</p><p class="ans-th">= ' + esc(it.answer) + '</p>';
        } else {
          var q = JF.part1Expressions.filter(function (x) { return x.jp === it.answerJp; })[0];
          h += '<div class="ans-line">' + U.sentence(it.answerJp, { audio: true }) + '</div>' +
            (q ? '<p class="romaji">' + esc(q.romaji) + '</p><p class="ans-th">' + esc(q.th) + '</p>' : '') +
            '<p class="ans-sub">คำตอบ: ' + U.sentence(it.jp) + ' — ' + esc(it.th || '') + '</p>';
        }
        break;
      case 'mc':
        var o = it.options[it.answer];
        h += '<div class="ans-line"><span class="mc-letter">' + L[it.answer] + '</span>' +
          (it.optionsTh ? esc(o) : '<span class="jp-sent" lang="ja">' + esc(o) + '</span>' + U.audioBtn(o)) + '</div>';
        if (it.jp) h += '<p class="ans-sub">' + U.sentence(it.jp.replace(/（\s*）|（　+）/, it.optionsTh ? '' : o), { audio: !it.optionsTh }) + '</p>';
        break;
      case 'text':
        var v = it.answerVocab && V[it.answerVocab];
        h += '<div class="ans-line"><span lang="ja" class="jp-sent">' + esc(it.answerText) + '</span>' + U.audioBtn(v ? v.kana : it.fields[0].answers[0]) + '</div>';
        break;
      case 'bank':
        var k = set.options.indexOf(it.answer), bv = V[it.answer];
        h += '<div class="ans-line"><span class="mc-letter">' + L[k] + '</span><span lang="ja" class="jp-sent">' + esc(bv.kana) + '</span>' +
          '<span class="ans-r">(' + esc(bv.romaji) + ')</span>' + U.audioBtn(bv.kana) + '</div><p class="ans-th">' + esc(bv.th) + '</p>';
        break;
      case 'open':
        it.model.forEach(function (md) {
          h += '<div class="ans-line">' + U.sentence(md.jp, { audio: true }) + '</div><p class="romaji">' + esc(md.romaji) + '</p><p class="ans-th">' + esc(md.th) + '</p>';
        });
        break;
      case 'order':
        h += '<div class="ans-line">' + U.sentence(it.answers[0].join('|') + '。', { audio: true }) + '</div><p class="romaji">' + esc(it.romaji) + '</p><p class="ans-th">' + esc(it.th) + '</p>';
        if (it.answers.length > 1) h += '<p class="ans-sub">ลำดับนี้ก็ถูกเช่นกัน: <span lang="ja">' + esc(it.answers.slice(1).map(function (a) { return a.join(''); }).join(' / ')) + '</span></p>';
        break;
    }
    return h;
  }

  /* ================= Re-render helpers ================= */
  function rerenderSet(setId) {
    var el = document.getElementById('set-' + setId);
    if (!el) return;
    var wrongOnly = el.classList.contains('only-wrong');
    U.hidePopover();
    el.outerHTML = renderSet(setId);
    if (wrongOnly) { var n = document.getElementById('set-' + setId); if (n) applyWrongOnly(n, true); }
    document.dispatchEvent(new CustomEvent('jf:progress', { detail: { setId: setId } }));
  }
  function rerenderHead(setId) {
    var el = document.getElementById('set-' + setId);
    var set = JF.sets[setId];
    if (!el || set.compact) return;
    var head = el.querySelector('.ex-head');
    if (head) { var tmp = document.createElement('div'); tmp.innerHTML = headHtml(setId, set); head.replaceWith(tmp.firstChild); }
    document.dispatchEvent(new CustomEvent('jf:progress', { detail: { setId: setId } }));
  }
  function applyWrongOnly(setEl, on) {
    setEl.classList.toggle('only-wrong', on);
    var b = setEl.querySelector('[data-act="only-wrong"]');
    if (b) b.setAttribute('aria-pressed', String(on));
  }

  /* ================= Events (delegated, bound once) ================= */
  function ctx(target) {
    var setEl = target.closest('[data-set]');
    if (!setEl) return null;
    var setId = setEl.getAttribute('data-set');
    var itemEl = target.closest('[data-item]');
    var set = JF.sets[setId];
    var item = itemEl && set.items.filter(function (x) { return x.id === itemEl.getAttribute('data-item'); })[0];
    return { setEl: setEl, setId: setId, set: set, item: item };
  }

  function onValue(e) {
    var t = e.target;
    if (t.getAttribute('data-act') !== 'val') return;
    var c = ctx(t);
    if (!c || !c.item) return;
    var it = c.item;
    if (it.type === 'mc') S.setAnswer(c.setId, it.id, { v: Number(t.value) });
    else if (it.type === 'text') {
      var cur = (S.answer(c.setId, it.id) || {}).v || {};
      var nv = {}; for (var k in cur) nv[k] = cur[k];
      nv[t.getAttribute('data-key')] = t.value;
      S.setAnswer(c.setId, it.id, { v: nv });
    } else S.setAnswer(c.setId, it.id, { v: t.value });
    if (e.type === 'change') {
      rerenderHead(c.setId);
      if (effMode(c.set) === 'exam') {
        var head = c.setEl.querySelector('#it-' + c.setId + '-' + it.id + ' .ex-item-head');
        if (head && !head.querySelector('.saved')) head.insertAdjacentHTML('beforeend', '<span class="saved">' + icon('i-check') + 'บันทึกแล้ว</span>');
      }
    }
  }

  function onClick(e) {
    var b = e.target.closest('[data-act]');
    if (!b || b.getAttribute('data-act') === 'val') {
      var z = e.target.closest('[data-zoom]');
      if (z) zoom(z.getAttribute('data-zoom'), z.querySelector('img').alt);
      return;
    }
    var act = b.getAttribute('data-act');
    if (act.indexOf('mg') === 0) return mgClick(b, act);
    var c = ctx(b);
    if (!c) return;
    var it = c.item, setId = c.setId;
    var cur = it ? (S.answer(setId, it.id) || {}) : null;

    switch (act) {
      case 'check':
        if (it.type === 'text') syncInputs(c);
        S.setAnswer(setId, it.id, { checked: true });
        rerenderSet(setId);
        focusItem(setId, it.id, '.fb');
        break;
      case 'retry':
        S.setAnswer(setId, it.id, { checked: false, self: null });
        rerenderSet(setId);
        focusItem(setId, it.id, 'input, select, textarea, .chip');
        break;
      case 'self':
        S.setAnswer(setId, it.id, { self: b.getAttribute('data-v') });
        rerenderSet(setId);
        break;
      case 'check-all':
        syncInputs(c);
        var n = 0;
        c.set.items.forEach(function (x) { if (grade(x, S.answer(setId, x.id) || {}).answered) { S.setAnswer(setId, x.id, { checked: true }); n++; } });
        if (!n) { U.toast('ยังไม่มีข้อที่ตอบ'); return; }
        rerenderSet(setId);
        scrollToResult(setId);
        break;
      case 'submit':
        syncInputs(c);
        var s = stats(setId);
        if (s.unanswered && !window.confirm('ยังมี ' + s.unanswered + ' ข้อที่ยังไม่ได้ตอบ ต้องการส่งคำตอบเลยหรือไม่?')) return;
        submitSet(setId);
        scrollToResult(setId);
        break;
      case 'reset':
        if (!window.confirm('รีเซ็ตคำตอบทั้งหมดในชุด "' + c.set.title + '" ?')) return;
        S.resetSet(setId);
        rerenderSet(setId);
        U.toast('รีเซ็ตแล้ว');
        break;
      case 'only-wrong':
        applyWrongOnly(c.setEl, !c.setEl.classList.contains('only-wrong'));
        break;
      case 'ord-add':
        var arr = (cur.v || []).slice();
        arr.push(Number(b.getAttribute('data-i')));
        S.setAnswer(setId, it.id, { v: arr });
        rerenderSet(setId);
        focusItem(setId, it.id, '.ord-bank .chip:not([disabled])') || focusItem(setId, it.id, '[data-act="check"]');
        break;
      case 'ord-remove':
        var arr2 = (cur.v || []).slice();
        arr2.splice(Number(b.getAttribute('data-k')), 1);
        S.setAnswer(setId, it.id, { v: arr2 });
        rerenderSet(setId);
        focusItem(setId, it.id, '.ord-bank .chip:not([disabled])');
        break;
      case 'ord-clear':
        S.setAnswer(setId, it.id, { v: [] });
        rerenderSet(setId);
        focusItem(setId, it.id, '.ord-bank .chip');
        break;
    }
  }

  function syncInputs(c) {
    c.setEl.querySelectorAll('input[type="text"][data-act="val"], textarea[data-act="val"]').forEach(function (el) {
      onValue({ target: el, type: 'input' });
    });
  }
  function submitSet(setId) {
    var set = JF.sets[setId];
    set.items.forEach(function (x) { S.setAnswer(setId, x.id, { checked: true }); });
    S.setMeta(setId, { submitted: true, at: Date.now() });
    rerenderSet(setId);
  }
  function focusItem(setId, itemId, sel) {
    var el = document.getElementById('it-' + setId + '-' + itemId);
    var t = el && el.querySelector(sel);
    if (t) { if (!t.hasAttribute('tabindex') && t.classList.contains('fb')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: false }); return true; }
    return false;
  }
  function scrollToResult(setId) {
    var el = document.querySelector('#set-' + setId + ' .ex-result');
    if (el) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }

  /* Image enlargement */
  function zoom(src, alt) {
    var d = document.createElement('div');
    d.className = 'zoom';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'ภาพขยาย');
    d.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '"><button type="button" class="icon-btn zoom-close" aria-label="ปิด">' + icon('i-x') + '</button>';
    var prev = document.activeElement;
    function close() { d.remove(); document.removeEventListener('keydown', key); if (prev) prev.focus(); }
    function key(e) { if (e.key === 'Escape') close(); }
    d.addEventListener('click', close);
    document.addEventListener('keydown', key);
    document.body.appendChild(d);
    d.querySelector('button').focus();
  }

  /* ================= Matching game (practice, not scored) ================= */
  var games = {};
  function matchGame(id, cols, title) {
    games[id] = { cols: cols, title: title, sel: [], matched: {}, wrong: null, order: cols.map(function (c) { return U.shuffle(c.items.map(function (x) { return x.key; })); }) };
    return '<div class="mg" id="mg-' + id + '">' + mgInner(id) + '</div>';
  }
  function mgInner(id) {
    var g = games[id];
    var total = g.cols[0].items.length, done = Object.keys(g.matched).length;
    var h = '<div class="mg-head"><p class="mg-title">' + esc(g.title) + '</p><span class="mg-count">' + done + '/' + total + '</span>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-act="mg-reset" data-g="' + id + '">' + icon('i-shuffle') + 'เริ่มใหม่</button></div>';
    h += '<p class="mg-help">เลือกการ์ดหนึ่งใบจากแต่ละคอลัมน์ที่มีความหมายตรงกัน</p>';
    h += '<div class="mg-cols" style="--cols:' + g.cols.length + '">';
    g.cols.forEach(function (col, ci) {
      h += '<div class="mg-col"><p class="mg-col-label">' + esc(col.label) + '</p>';
      g.order[ci].forEach(function (key) {
        var it = col.items.filter(function (x) { return x.key === key; })[0];
        var c = 'mg-card';
        if (g.matched[key]) c += ' is-matched';
        else if (g.wrong && g.wrong[ci] === key) c += ' is-wrong';
        else if (g.sel[ci] === key) c += ' is-sel';
        h += '<button type="button" class="' + c + '" data-act="mg" data-g="' + id + '" data-c="' + ci + '" data-k="' + esc(key) + '"' +
          (g.matched[key] ? ' disabled' : '') + ' aria-pressed="' + (g.sel[ci] === key) + '"' + (it.lang ? ' lang="' + it.lang + '"' : '') + '>' + it.html + '</button>';
      });
      h += '</div>';
    });
    h += '</div>';
    if (done === total) h += '<p class="mg-win" role="status">' + icon('i-check') + 'จับคู่ครบทุกคู่แล้ว เยี่ยมมาก!</p>';
    return h;
  }
  function mgRender(id) {
    var el = document.getElementById('mg-' + id);
    if (el) el.innerHTML = mgInner(id);
  }
  function mgClick(b, act) {
    var id = b.getAttribute('data-g'), g = games[id];
    if (!g) return;
    if (act === 'mg-reset') {
      g.sel = []; g.matched = {}; g.wrong = null;
      g.order = g.cols.map(function (c) { return U.shuffle(c.items.map(function (x) { return x.key; })); });
      return mgRender(id);
    }
    var ci = Number(b.getAttribute('data-c')), key = b.getAttribute('data-k');
    g.wrong = null;
    g.sel[ci] = g.sel[ci] === key ? undefined : key;
    var full = g.cols.every(function (_, i) { return g.sel[i] !== undefined; });
    if (full) {
      var same = g.sel.every(function (k) { return k === g.sel[0]; });
      if (same) { g.matched[g.sel[0]] = true; var w = g.cols[0].items.filter(function (x) { return x.key === g.sel[0]; })[0]; if (w && w.say) JF.audio.speak(w.say); }
      else { g.wrong = g.sel.slice(); setTimeout(function () { g.wrong = null; mgRender(id); }, 650); }
      g.sel = [];
    }
    mgRender(id);
    var again = document.querySelector('#mg-' + id + ' [data-c="' + ci + '"][data-k="' + key + '"]');
    if (again && !again.disabled) again.focus();
  }

  function bind() {
    document.addEventListener('change', onValue);
    document.addEventListener('input', onValue);
    document.addEventListener('click', onClick);
  }

  /* ================= Aggregates ================= */
  function partSets(n) {
    return Object.keys(JF.sets).filter(function (k) {
      var s = JF.sets[k];
      return s.part === n && k.indexOf('pf-') !== 0 && !s.compact;
    });
  }
  function aggregate(setIds) {
    var r = { total: 0, answered: 0, correct: 0, shown: 0 };
    setIds.forEach(function (id) {
      var s = stats(id);
      r.total += s.total; r.answered += s.answered; r.correct += s.correct; r.shown += s.shown;
    });
    return r;
  }
  function allSetIds() {
    return Object.keys(JF.sets).filter(function (k) { return !JF.sets[k].compact; });
  }

  return {
    renderSet: renderSet, rerenderSet: rerenderSet, submitSet: submitSet, stats: stats, grade: grade,
    answerHtml: answerHtml, srcBadge: srcBadge, matchGame: matchGame, bind: bind,
    partSets: partSets, aggregate: aggregate, allSetIds: allSetIds, feedbackOn: feedbackOn
  };
})();
