/* Flashcard decks (kana, vocabulary, days). Progress per deck in localStorage.
 * Keyboard: Space/Enter flip · ←/→ previous/next · K know · J need practice
 */
window.JF = window.JF || {};

JF.flash = (function () {
  var U = JF.ui, S = JF.store, esc = U.esc, icon = U.icon;
  var decks = {};

  function deck(id, cards, opts) {
    opts = opts || {};
    var d = decks[id] = { id: id, store: opts.store || id, all: cards, title: opts.title || '', idx: 0, flipped: false, auto: null, onlyHard: !!opts.onlyHard, order: null };
    d.order = list(d);
    return '<div class="fc" id="fc-' + id + '" tabindex="0" aria-label="แฟลชการ์ด ' + esc(d.title) + ' — Space พลิกการ์ด, ลูกศรซ้าย/ขวา เลื่อนการ์ด, K รู้แล้ว, J ต้องฝึก">' + inner(d) + '</div>';
  }
  function list(d) {
    var st = S.flash(d.store);
    var keys = d.all.map(function (c) { return c.key; });
    if (d.onlyHard) keys = keys.filter(function (k) { return st[k] === 'practice'; });
    return keys;
  }
  function card(d, key) { return d.all.filter(function (c) { return c.key === key; })[0]; }

  function inner(d) {
    var st = S.flash(d.store);
    var known = d.all.filter(function (c) { return st[c.key] === 'know'; }).length;
    var hard = d.all.filter(function (c) { return st[c.key] === 'practice'; }).length;
    var total = d.all.length;
    var h = '<div class="fc-status"><span>การ์ด <b>' + (d.order.length ? d.idx + 1 : 0) + '</b>/' + d.order.length + (d.onlyHard ? ' (เฉพาะที่ต้องฝึก)' : '') + '</span>' +
      '<span class="fc-k">' + icon('i-check') + 'รู้แล้ว ' + known + '/' + total + '</span>' +
      '<span class="fc-p">' + icon('i-alert') + 'ต้องฝึก ' + hard + '</span>' +
      '<span class="bar"><span style="width:' + Math.round(known / total * 100) + '%"></span></span></div>';

    if (!d.order.length) {
      h += '<div class="fc-empty">' + (d.onlyHard ? 'ยังไม่มีการ์ดที่ทำเครื่องหมาย "ต้องฝึก"' : 'ไม่มีการ์ดในชุดนี้') + '</div>';
    } else {
      var c = card(d, d.order[d.idx]), mark = st[c.key];
      h += '<div class="fc-card' + (d.flipped ? ' is-flipped' : '') + (mark ? ' mark-' + mark : '') + '" role="button" tabindex="0" data-fc="flip" aria-pressed="' + d.flipped + '" aria-label="' + (d.flipped ? 'ด้านหลัง — แตะเพื่อพลิกกลับ' : 'ด้านหน้า — แตะเพื่อพลิกการ์ด') + '">' +
        '<div class="fc-inner"><div class="fc-face fc-front">' + c.front + '</div><div class="fc-face fc-back">' + c.back + '</div></div></div>';
    }
    if (known === total) h += '<p class="fc-done" role="status">' + icon('i-check') + 'จำได้ครบทุกใบในชุดนี้แล้ว!</p>';

    var dis = d.order.length ? '' : ' disabled';
    h += '<div class="fc-controls">' +
      '<div class="fc-row">' +
      '<button type="button" class="btn btn-ghost" data-fc="prev" aria-label="การ์ดก่อนหน้า"' + dis + '>' + icon('i-chevron-left') + '<span class="hide-sm">ก่อนหน้า</span></button>' +
      '<button type="button" class="btn btn-soft" data-fc="flip"' + dis + '>' + icon('i-rotate') + 'พลิก</button>' +
      '<button type="button" class="btn btn-ghost" data-fc="say" aria-label="ฟังเสียง"' + dis + '>' + icon('i-volume') + '<span class="hide-sm">ฟังเสียง</span></button>' +
      '<button type="button" class="btn btn-ghost" data-fc="next" aria-label="การ์ดถัดไป"' + dis + '><span class="hide-sm">ถัดไป</span>' + icon('i-chevron-right') + '</button>' +
      '</div><div class="fc-row">' +
      '<button type="button" class="btn btn-ok-soft" data-fc="know"' + dis + '>' + icon('i-check') + 'รู้แล้ว (K)</button>' +
      '<button type="button" class="btn btn-no-soft" data-fc="practice"' + dis + '>' + icon('i-alert') + 'ต้องฝึก (J)</button>' +
      '</div><div class="fc-row fc-row-sm">' +
      '<button type="button" class="btn btn-sm btn-ghost" data-fc="shuffle">' + icon('i-shuffle') + 'สลับการ์ด</button>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-fc="restart">' + icon('i-rotate') + 'เริ่มใหม่</button>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-fc="auto" aria-pressed="' + !!d.auto + '">' + icon(d.auto ? 'i-pause' : 'i-play') + (d.auto ? 'หยุดอัตโนมัติ' : 'เล่นอัตโนมัติ') + '</button>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-fc="hard" aria-pressed="' + d.onlyHard + '">' + icon('i-alert') + (d.onlyHard ? 'ดูทุกใบ' : 'ทบทวนใบที่ต้องฝึก') + '</button>' +
      '<button type="button" class="btn btn-sm btn-ghost" data-fc="clear">' + icon('i-x') + 'ล้างเครื่องหมาย</button>' +
      '</div></div>';
    return h;
  }

  function render(d, keepFocus) {
    var el = document.getElementById('fc-' + d.id);
    if (!el) { stopAuto(d); return; }
    var focused = keepFocus && document.activeElement && document.activeElement.getAttribute('data-fc');
    el.innerHTML = inner(d);
    if (focused) { var b = el.querySelector('[data-fc="' + focused + '"]'); if (b && !b.disabled) b.focus(); else el.focus(); }
  }

  function step(d, dir) {
    if (!d.order.length) return;
    d.idx = (d.idx + dir + d.order.length) % d.order.length;
    d.flipped = false;
  }
  function stopAuto(d) { if (d.auto) { clearInterval(d.auto); d.auto = null; } }

  function act(d, a) {
    var st = S.flash(d.store), c = d.order.length ? card(d, d.order[d.idx]) : null;
    switch (a) {
      case 'flip': if (!c) return; d.flipped = !d.flipped; if (d.flipped && c.say) JF.audio.speak(c.say); break;
      case 'prev': step(d, -1); break;
      case 'next': step(d, 1); break;
      case 'say': if (c && c.say) JF.audio.speak(c.say); return;
      case 'know':
      case 'practice':
        if (!c) return;
        st[c.key] = a; S.save();
        if (d.onlyHard && a === 'know') { d.order = list(d); if (d.idx >= d.order.length) d.idx = 0; d.flipped = false; }
        else step(d, 1);
        break;
      case 'shuffle': d.order = U.shuffle(d.order); d.idx = 0; d.flipped = false; break;
      case 'restart': stopAuto(d); d.order = list(d); d.idx = 0; d.flipped = false; break;
      case 'hard': d.onlyHard = !d.onlyHard; d.order = list(d); d.idx = 0; d.flipped = false; break;
      case 'clear':
        if (!window.confirm('ล้างเครื่องหมาย "รู้แล้ว / ต้องฝึก" ของชุดนี้?')) return;
        var all = S.flash(d.store); d.all.forEach(function (x) { delete all[x.key]; }); S.save(); d.order = list(d); d.idx = 0; d.flipped = false; break;
      case 'auto':
        if (d.auto) stopAuto(d);
        else {
          d.auto = setInterval(function () {
            if (!document.getElementById('fc-' + d.id)) return stopAuto(d);
            if (!d.flipped) d.flipped = true;
            else if (d.idx === d.order.length - 1) { stopAuto(d); }
            else step(d, 1);
            render(d);
          }, 2600);
        }
        break;
    }
    render(d, true);
  }

  function bind() {
    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fc]');
      if (!b) return;
      var root = b.closest('.fc');
      var d = root && decks[root.id.slice(3)];
      if (d) act(d, b.getAttribute('data-fc'));
    });
    document.addEventListener('keydown', function (e) {
      var root = e.target.closest && e.target.closest('.fc');
      if (!root) return;
      var d = decks[root.id.slice(3)];
      if (!d) return;
      var onBtn = e.target.tagName === 'BUTTON';
      var k = e.key;
      if ((k === ' ' || k === 'Enter') && !onBtn) { e.preventDefault(); act(d, 'flip'); }
      else if (k === 'ArrowLeft') { e.preventDefault(); act(d, 'prev'); }
      else if (k === 'ArrowRight') { e.preventDefault(); act(d, 'next'); }
      else if (k === 'k' || k === 'K') act(d, 'know');
      else if (k === 'j' || k === 'J') act(d, 'practice');
    });
  }

  return { deck: deck, bind: bind, stopAll: function () { for (var k in decks) stopAuto(decks[k]); } };
})();
