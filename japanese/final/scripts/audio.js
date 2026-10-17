/* Centralized Japanese audio service (Web Speech API, ja-JP).
 * - Never falls back to a non-Japanese voice.
 * - Optional verified local audio files: JF.audioFiles = { 'text': 'assets/audio/file.mp3' }.
 * - All playback is user-initiated (no autoplay).
 */
window.JF = window.JF || {};
JF.audioFiles = JF.audioFiles || {};

JF.audio = (function () {
  var synth = window.speechSynthesis || null;
  var voice = null;
  var status = synth && window.SpeechSynthesisUtterance ? 'loading' : 'unsupported';
  var current = null;      // button currently playing
  var fileAudio = null;
  var listeners = [];

  var PREFERRED = /Nanami|Kyoko|Haruka|Ayumi|Sayaka|Otoya|Google 日本語|Ichiro|Keita|Mizuki/i;

  function pick() {
    if (!synth) return;
    var voices = synth.getVoices() || [];
    if (!voices.length) return;                       // still loading
    var ja = voices.filter(function (v) { return /^ja([-_]|$)/i.test(v.lang); });
    var best = ja.filter(function (v) { return PREFERRED.test(v.name); })[0] || ja[0] || null;
    voice = best;
    var next = voice ? 'ready' : 'novoice';
    if (next !== status) { status = next; listeners.forEach(function (f) { f(status); }); }
  }

  if (synth) {
    pick();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', pick);
    else synth.onvoiceschanged = pick;
    // Some browsers never fire voiceschanged when there are no voices at all
    setTimeout(function () { if (status === 'loading') { pick(); if (status === 'loading') { status = 'novoice'; listeners.forEach(function (f) { f(status); }); } } }, 2500);
  }

  function setPlaying(btn, on) {
    if (current && current !== btn) current.classList.remove('is-playing');
    if (btn) btn.classList.toggle('is-playing', on);
    current = on ? btn : null;
  }

  function message() {
    if (status === 'unsupported') return 'เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง (Web Speech API)';
    if (status === 'loading') return 'กำลังโหลดเสียงภาษาญี่ปุ่น… ลองกดอีกครั้ง';
    if (status === 'novoice') return 'ไม่พบเสียงภาษาญี่ปุ่นในเบราว์เซอร์/ระบบนี้ — ลองใช้ Microsoft Edge หรือ Chrome (บางเสียงต้องเชื่อมต่ออินเทอร์เน็ต)';
    return '';
  }

  function speak(text, btn) {
    if (!text) return;
    stop();
    var file = JF.audioFiles[text];
    if (file) {
      fileAudio = new Audio(file);
      setPlaying(btn, true);
      fileAudio.onended = fileAudio.onerror = function () { setPlaying(btn, false); };
      fileAudio.play().catch(function () { setPlaying(btn, false); });
      return;
    }
    if (status === 'loading') pick();
    if (!voice) { JF.ui.toast(message()); return; }
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.voice = voice;
    u.rate = Number(JF.store.setting('rate')) || 1;
    u.onend = u.onerror = function () { setPlaying(btn, false); };
    setPlaying(btn, true);
    synth.speak(u);
  }

  function stop() {
    if (synth) synth.cancel();
    if (fileAudio) { fileAudio.pause(); fileAudio = null; }
    setPlaying(null, false);
  }

  return {
    speak: speak,
    stop: stop,
    status: function () { return status; },
    voiceName: function () { return voice ? voice.name : ''; },
    message: message,
    onStatus: function (f) { listeners.push(f); }
  };
})();
