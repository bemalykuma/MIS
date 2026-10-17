/* Local study progress (localStorage). No personal information is stored. */
window.JF = window.JF || {};

JF.store = (function () {
  var KEY = 'jpfinal:v1';
  var DEFAULT_SETTINGS = { romaji: true, thai: true, rate: 1, mode: 'study', dayForm: 'doc', kanaScript: 'h', kanaRomaji: true };

  function blank() {
    return { answers: {}, sets: {}, checklist: {}, flash: {}, review: {}, settings: {}, last: null };
  }
  function normalize(s) {
    var b = blank();
    for (var k in b) if (!s[k] || typeof s[k] !== typeof b[k]) s[k] = b[k];
    for (var d in DEFAULT_SETTINGS) if (!(d in s.settings)) s.settings[d] = DEFAULT_SETTINGS[d];
    return s;
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var s = JSON.parse(raw); if (s && typeof s === 'object') return normalize(s); }
    } catch (e) {}
    return normalize(blank());
  }

  var state = load();
  var timer = null;
  function save() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }, 120);
  }

  return {
    get state() { return state; },
    save: save,
    setting: function (k, v) {
      if (arguments.length > 1) { state.settings[k] = v; save(); }
      return state.settings[k];
    },
    answer: function (setId, itemId) {
      var s = state.answers[setId];
      return (s && s[itemId]) || null;
    },
    setAnswer: function (setId, itemId, patch) {
      var s = state.answers[setId] || (state.answers[setId] = {});
      var cur = s[itemId] || (s[itemId] = {});
      for (var k in patch) cur[k] = patch[k];
      save();
      return cur;
    },
    meta: function (setId) { return state.sets[setId] || {}; },
    setMeta: function (setId, patch) {
      var m = state.sets[setId] || (state.sets[setId] = {});
      for (var k in patch) m[k] = patch[k];
      save();
    },
    resetSet: function (setId) {
      delete state.answers[setId];
      delete state.sets[setId];
      save();
    },
    flash: function (deck) { return state.flash[deck] || (state.flash[deck] = {}); },
    resetFlash: function (deck) {
      if (deck) delete state.flash[deck]; else state.flash = {};
      save();
    },
    isReview: function (id) { return !!state.review[id]; },
    toggleReview: function (id) {
      if (state.review[id]) delete state.review[id]; else state.review[id] = 1;
      save();
      return !!state.review[id];
    },
    check: function (id, v) {
      if (arguments.length > 1) { if (v) state.checklist[id] = 1; else delete state.checklist[id]; save(); }
      return !!state.checklist[id];
    },
    setLast: function (route) { state.last = route; save(); },
    resetAll: function () {
      var keep = { romaji: state.settings.romaji, thai: state.settings.thai, rate: state.settings.rate };
      state = normalize(blank());
      for (var k in keep) state.settings[k] = keep[k];
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    }
  };
})();
