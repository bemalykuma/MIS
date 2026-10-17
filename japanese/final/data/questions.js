/* Exercise content — Japanese Final.
 * Sentences use explicit token boundaries: "なんじ|に|おわります|か。"
 *   - each token is looked up by exact surface in JF.vocabSurface (no substring guessing)
 *   - trailing punctuation (。、？) is split off automatically
 *   - inside explanation text, [[tokens]] renders an annotated Japanese sentence
 * src: 'doc'       = reproduced from the review document
 *      'derived'   = converted from a table/list in the documents into a question
 *      'additional'= newly written practice from the same vocabulary & grammar
 */
window.JF = window.JF || {};

(function () {
  /* ======================================================================
     PART 1 — 15 question expressions (document table, page 4)
     ====================================================================== */
  var P1 = [
    { jp: 'なんがつ|です|か。', romaji: 'Nangatsu desu ka.', th: 'เดือนอะไรคะ/ครับ' },
    { jp: 'なんにち|です|か。', romaji: 'Nannichi desu ka.', th: 'วันที่เท่าไหร่คะ/ครับ' },
    { jp: 'なんようび|です|か。', romaji: "Nan'yōbi desu ka.", th: 'วันอะไรคะ/ครับ' },
    { jp: 'なんじ|です|か。', romaji: 'Nanji desu ka.', th: 'กี่โมงคะ/ครับ' },
    { jp: 'なんじ|に|おわります|か。', romaji: 'Nanji ni owarimasu ka.', th: 'เลิกกี่โมงคะ/ครับ' },
    { jp: 'なんじ|から|なんじ|まで|です|か。', romaji: 'Nanji kara nanji made desu ka.', th: 'ตั้งแต่กี่โมงถึงกี่โมงคะ/ครับ' },
    { jp: 'なんようび|から|なんようび|まで|です|か。', romaji: "Nan'yōbi kara nan'yōbi made desu ka.", th: 'ตั้งแต่วันอะไรถึงวันอะไรคะ/ครับ' },
    { jp: 'どこ|へ|いきます|か。', romaji: 'Doko e ikimasu ka.', th: 'จะไปที่ไหนคะ/ครับ' },
    { jp: 'なんで|だいがく|へ|きます|か。', romaji: 'Nande daigaku e kimasu ka.', th: 'มามหาวิทยาลัยโดยอะไรคะ/ครับ' },
    { jp: 'だれ|と|いきます|か。', romaji: 'Dare to ikimasu ka.', th: 'ไปกับใครคะ/ครับ' },
    { jp: 'だれ|が|いきます|か。', romaji: 'Dare ga ikimasu ka.', th: 'ใครไปคะ/ครับ' },
    { jp: 'いっしょに|いきません|か。', romaji: 'Issho ni ikimasen ka.', th: 'ไปด้วยกันไหมคะ/ครับ' },
    { jp: 'いくら|です|か。', romaji: 'Ikura desu ka.', th: 'ราคาเท่าไหร่' },
    { jp: 'なに|を|します|か。', romaji: 'Nani o shimasu ka.', th: 'ทำอะไร' },
    { jp: 'どんな|ところ|が|すき|です|か。', romaji: 'Donna tokoro ga suki desu ka.', th: 'ชอบสถานที่แบบไหน' }
  ];
  var P1_EXPLAIN = [
    'なん (อะไร) + がつ (เดือน) = เดือนอะไร',
    'なん + にち (วันที่) = วันที่เท่าไหร่',
    'なん + ようび (วันในสัปดาห์) = วันอะไร',
    'なん + じ (โมง) = กี่โมง',
    'に ชี้จุดเวลา + おわります (เลิก/จบ) → เลิกกี่โมง',
    'から = ตั้งแต่, まで = ถึง → ตั้งแต่กี่โมงถึงกี่โมง',
    'から…まで ใช้กับวันได้เหมือนกับเวลา',
    'どこ (ที่ไหน) + へ (ไปยัง อ่านว่า "เอะ") + いきます (ไป)',
    'なんで (โดยอะไร) ถามวิธีเดินทาง — คำตอบใช้ ยานพาหนะ + で',
    'だれ (ใคร) + と (กับ) → ไปกับใคร',
    'だれ + が (ชี้ประธาน) → ใครเป็นคนไป',
    '～ませんか = ชักชวน "…ด้วยกันไหม"',
    'いくら ใช้ถามราคา',
    'なに + を (กรรม) + します (ทำ) → ทำอะไร (เอกสารบทที่ 6 ระบุว่า "ออกสอบ")',
    'どんな (แบบไหน) + ところ (สถานที่) + が + すき (ชอบ)'
  ];
  var P1_TH = P1.map(function (x) { return x.th; });
  var P1_Q = P1.map(function (x, i) { return (i + 1) + '. ' + x.jp.replace(/\|/g, ''); });

  var part1Match = P1.map(function (x, i) {
    return {
      id: 'p1m-' + (i + 1), type: 'match', src: 'doc',
      jp: x.jp, romaji: x.romaji, list: 'p1th', answer: x.th, answerJp: x.jp,
      explain: P1_EXPLAIN[i]
    };
  });

  /* Pages 1–3: 15 answer sentences → matching question (no instruction printed; interpreted) */
  var A = [
    { jp: 'くじ|です。', orig: '９<ruby>時<rt>じ</rt></ruby>です。', romaji: 'Kuji desu.', th: '9 โมง', q: 4,
      ex: 'ตอบเวลา → ถาม [[なんじ|です|か。]] ・ 9 โมงอ่านว่า くじ (ต้นฉบับเขียน ９時 มีคำอ่าน じ กำกับ — ใน Part 1 แสดงเป็นฮิรางานะ)' },
    { jp: '800|バーツ|です。', romaji: 'Happyaku bātsu desu.', th: '800 บาท', q: 13, ex: 'ตอบราคา → ถาม [[いくら|です|か。]]' },
    { jp: 'かぞく|と|いきます。', romaji: 'Kazoku to ikimasu.', th: 'ไปกับครอบครัว', q: 10, ex: 'と = กับ → ถาม [[だれ|と|いきます|か。]]' },
    { jp: 'げつようび|です。', romaji: 'Getsuyōbi desu.', th: 'วันจันทร์', q: 3, ex: 'ตอบวันในสัปดาห์ → ถาม [[なんようび|です|か。]]' },
    { jp: '3がつ|です。', romaji: 'Sangatsu desu.', th: 'เดือนมีนาคม', q: 1, ex: 'ตอบเดือน → ถาม [[なんがつ|です|か。]]' },
    { jp: '4じ|に|おわります。', romaji: 'Yoji ni owarimasu.', th: 'เลิก 4 โมง', q: 5, ex: 'ตอบเวลาเลิก → ถาม [[なんじ|に|おわります|か。]] ・ 4じ อ่านว่า よじ' },
    { jp: '15にち|です。', romaji: 'Jūgonichi desu.', th: 'วันที่ 15', q: 2, ex: 'ตอบวันที่ → ถาม [[なんにち|です|か。]]' },
    { jp: 'ごぜん|9じ|から|ごご|3じ|まで|です。', romaji: 'Gozen kuji kara gogo sanji made desu.', th: 'ตั้งแต่ 9 โมงเช้าถึงบ่าย 3 โมง', q: 6, ex: '～から～まで ของเวลา → ถาม [[なんじ|から|なんじ|まで|です|か。]]' },
    { jp: 'げつようび|から|きんようび|まで|です。', romaji: "Getsuyōbi kara kin'yōbi made desu.", th: 'ตั้งแต่วันจันทร์ถึงวันศุกร์', q: 7, ex: '～から～まで ของวัน → ถาม [[なんようび|から|なんようび|まで|です|か。]]' },
    { jp: 'わたし|の|ともだち|が|いきます。', romaji: 'Watashi no tomodachi ga ikimasu.', th: 'เพื่อนของฉันไป', q: 11, ex: 'が ชี้ว่าใครเป็นคนทำ → ถาม [[だれ|が|いきます|か。]]' },
    { jp: 'くるま|で|だいがく|へ|きます。', romaji: 'Kuruma de daigaku e kimasu.', th: 'มามหาวิทยาลัยโดยรถยนต์', q: 9, ex: 'ยานพาหนะ + で → ถาม [[なんで|だいがく|へ|きます|か。]]' },
    { jp: 'しずかな|ところ|が|すき|です。', romaji: 'Shizuka na tokoro ga suki desu.', th: 'ชอบสถานที่ที่เงียบสงบ', q: 15, ex: 'บอกลักษณะสถานที่ที่ชอบ → ถาม [[どんな|ところ|が|すき|です|か。]]' },
    { jp: 'しょくどう|へ|いきます。', romaji: 'Shokudō e ikimasu.', th: 'ไปโรงอาหาร', q: 8, ex: 'สถานที่ + へ → ถาม [[どこ|へ|いきます|か。]]' },
    { jp: 'ほん|を|よみます。', romaji: 'Hon o yomimasu.', th: 'อ่านหนังสือ', q: 14, ex: 'บอกสิ่งที่ทำ → ถาม [[なに|を|します|か。]]' },
    { jp: 'ええ、|いいですね。', romaji: 'Ē, ii desu ne.', th: 'ครับ/ค่ะ ดีจังเลยนะ', q: 12, ex: 'ตอบรับคำชวน → คำถามคือ [[いっしょに|いきません|か。]]' }
  ];
  var part1Answers = A.map(function (x, i) {
    return {
      id: 'p1a-' + (i + 1), type: 'match', src: 'doc',
      jp: x.jp, romaji: x.romaji, th: x.th, list: 'p1q', answer: P1_Q[x.q - 1], answerJp: P1[x.q - 1].jp,
      explain: x.ex
    };
  });
  /* Pre-final copy keeps the original spelling (kanji with furigana) */
  var prefinalA = A.map(function (x, i) {
    return {
      id: 'pfa-' + (i + 1), type: 'match', src: 'doc',
      jp: x.jp, origHtml: x.orig || null, romaji: x.romaji, th: x.th, list: 'p1q', answer: P1_Q[x.q - 1], answerJp: P1[x.q - 1].jp,
      explain: x.ex
    };
  });

  /* ======================================================================
     PART 2 — Days of the week
     ====================================================================== */
  var DAYS = [
    { id: 'getsuyoubi', k: '月', th: ['วันจันทร์', 'จันทร์', 'monday', 'mon'], el: 'moon', elTh: 'พระจันทร์', elEn: 'Moon',
      tip: '月 (つき) = พระจันทร์ → Monday (Moon-day) = วันจันทร์' },
    { id: 'kayoubi', k: '火', th: ['วันอังคาร', 'อังคาร', 'tuesday', 'tue'], el: 'fire', elTh: 'ไฟ', elEn: 'Fire',
      tip: '火 (ひ) = ไฟ → ดาวอังคารสีแดงเหมือนไฟ' },
    { id: 'suiyoubi', k: '水', th: ['วันพุธ', 'พุธ', 'wednesday', 'wed'], el: 'water', elTh: 'น้ำ', elEn: 'Water',
      tip: '水 (みず) = น้ำ → ดาวพุธ = ดาวน้ำ (水星)' },
    { id: 'mokuyoubi', k: '木', th: ['วันพฤหัสบดี', 'พฤหัสบดี', 'วันพฤหัส', 'พฤหัส', 'thursday', 'thu'], el: 'tree', elTh: 'ต้นไม้', elEn: 'Tree / Wood',
      tip: '木 (き) = ต้นไม้ → ดาวพฤหัส = ดาวไม้ (木星)' },
    { id: 'kinyoubi', k: '金', th: ['วันศุกร์', 'ศุกร์', 'friday', 'fri'], el: 'gold', elTh: 'ทอง', elEn: 'Gold / Metal',
      tip: '金 (きん) = ทอง / โลหะ → ดาวศุกร์ = ดาวทอง (金星)' },
    { id: 'doyoubi', k: '土', th: ['วันเสาร์', 'เสาร์', 'saturday', 'sat'], el: 'earth', elTh: 'ดิน', elEn: 'Earth / Soil',
      tip: '土 (つち) = ดิน → Saturday ≈ Saturn ดาวเสาร์ = ดาวดิน (土星)' },
    { id: 'nichiyoubi', k: '日', th: ['วันอาทิตย์', 'อาทิตย์', 'sunday', 'sun'], el: 'sun', elTh: 'พระอาทิตย์', elEn: 'Sun',
      tip: '日 (ひ) = ดวงอาทิตย์ → Sunday = วันอาทิตย์' }
  ];
  function dayItem(d, i, prefix) {
    var v = JF.vocabById[d.id];
    return {
      id: prefix + (i + 1), type: 'text', src: 'doc',
      big: v.docForm, bigAlt: v.jp, dayId: d.id,
      fields: [
        { key: 'reading', label: 'คำอ่าน (ฮิรางานะ หรือ โรมาจิ)', kind: 'reading', answers: [v.kana], romaji: [v.romaji], placeholder: 'เช่น げつようび / getsuyoubi' },
        { key: 'th', label: 'ความหมายภาษาไทย', kind: 'thai', answers: d.th, placeholder: 'เช่น วันจันทร์' }
      ],
      answerText: v.kana + ' (' + v.romaji + ') — ' + v.th,
      answerVocab: d.id,
      explain: d.k + ' = ' + d.elTh + ' (' + d.elEn + ') + ようび → ' + v.kana + ' = ' + v.th
    };
  }
  JF.days = DAYS;

  /* ======================================================================
     PART 3 — 15 multiple-choice questions (additional practice from confirmed topics)
     ====================================================================== */
  var part3 = [
    { q: '「4 โมง」 ภาษาญี่ปุ่นอ่านว่าอะไร', big: '4じ', options: ['よんじ', 'よじ', 'しじ', 'よっつじ'], answer: 1, topic: 'special-readings',
      explain: '4時 อ่านว่า よじ (yoji) — ไม่ใช่ よんじ และไม่ใช่ しじ ・ ตัวเลข 4 ปกติอ่าน よん แต่กับ ～じ ต้องอ่าน よじ' },
    { q: '「7 โมง」 ภาษาญี่ปุ่นอ่านว่าอะไร', big: '7じ', options: ['しじ', 'ななつじ', 'しちじ', 'はちじ'], answer: 2, topic: 'special-readings',
      explain: '7時 ในบทเรียนนี้อ่านว่า しちじ (shichiji) ・ はちじ คือ 8 โมง ・ ななつ เป็นการนับชิ้นของ ไม่ใช้กับเวลา' },
    { q: '「9 โมง」 ภาษาญี่ปุ่นอ่านว่าอะไร', big: '9じ', options: ['きゅうじ', 'くじ', 'くうじ', 'ここのじ'], answer: 1, topic: 'special-readings',
      explain: '9時 อ่านว่า くじ (kuji) เสมอ — ถึงแม้เลข 9 ปกติอ่าน きゅう ได้ แต่ 9 โมงต้องเป็น くじ' },
    { q: '「เดือนเมษายน」 ภาษาญี่ปุ่นคือข้อใด', options: ['よんがつ', 'よがつ', 'しがつ', 'しげつ'], answer: 2, topic: 'special-readings',
      explain: '4月 อ่านว่า しがつ (shigatsu) — ไม่ใช่ よんがつ' },
    { q: '「เดือนกันยายน」 ภาษาญี่ปุ่นคือข้อใด', options: ['きゅうがつ', 'くがつ', 'くげつ', 'ここのがつ'], answer: 1, topic: 'special-readings',
      explain: '9月 อ่านว่า くがつ (kugatsu) — ไม่ใช่ きゅうがつ' },
    { q: 'รูปปฏิเสธ (ปัจจุบัน) ของ たべます คือข้อใด', options: ['たべました', 'たべません', 'たべませんでした', 'たべましょう'], answer: 1, topic: 'masu-forms',
      explain: '～ます → ～ません = ปัจจุบัน/อนาคต ปฏิเสธ: [[たべません。]] = ไม่กิน' },
    { q: 'เติมคำให้ถูกต้อง: 「เมื่อวานกินขนมปัง」', jp: 'きのう|パン|を|（　　）。', options: ['たべます', 'たべません', 'たべました', 'たべませんでした'], answer: 2, topic: 'masu-forms',
      explain: 'きのう (เมื่อวาน) เป็นอดีต + บอกเล่า → ～ました: [[きのう|パン|を|たべました。]]' },
    { q: '「ไม่ได้ดื่ม」 (อดีต ปฏิเสธ) คือข้อใด', options: ['のみません', 'のみました', 'のみませんでした', 'のみます'], answer: 2, topic: 'masu-forms',
      explain: 'อดีต ปฏิเสธ = ～ませんでした: [[のみませんでした。]]' },
    { q: '「พรุ่งนี้」 ภาษาญี่ปุ่นคือข้อใด', options: ['きのう', 'きょう', 'あした', 'まいにち'], answer: 2, topic: 'time-words',
      explain: 'きのう = เมื่อวาน ・ きょう = วันนี้ ・ あした = พรุ่งนี้ ・ まいにち = ทุกๆ วัน' },
    { q: '[[まいにち]] แปลว่าอะไร', options: ['เมื่อวาน', 'วันนี้', 'พรุ่งนี้', 'ทุกๆ วัน'], optionsTh: true, answer: 3, topic: 'time-words',
      explain: 'まい (ทุก) + にち (วัน) = ทุกๆ วัน', noHint: true },
    { q: 'เติมคำช่วย: 「พรุ่งนี้จะไม่ไปที่ไหนเลย」', jp: 'あした|どこ|（　）|いきません。', options: ['へ', 'も', 'を', 'で'], answer: 1, topic: 'mo-negative',
      explain: 'คำแสดงคำถาม + も + ปฏิเสธ = ไม่…เลย: [[あした|どこ|も|いきません。]] (ตัวอย่างจากแบบฝึกบทที่ 5)' },
    { q: 'เติมคำช่วย: 「ไปคนเดียว」', jp: 'ひとり|（　）|いきます。', options: ['と', 'へ', 'で', 'を'], answer: 2, topic: 'particles',
      explain: '一人で + กริยา = ทำคนเดียว: [[ひとりで|いきます。]] (โน้ต "เพิ่มเติมที่จะออกเพิ่ม" ในเอกสาร)' },
    { q: 'เติมคำช่วย: 「กลับกับครอบครัว」', jp: 'かぞく|（　）|かえります。', options: ['と', 'で', 'を', 'も'], answer: 0, topic: 'particles',
      explain: 'บุคคล + と = กับ…: [[かぞく|と|かえります。]] (โน้ต "เพิ่มเติมที่จะออกเพิ่ม")' },
    { q: 'เติมคำช่วย: 「ซื้อที่ห้างสรรพสินค้า」', jp: 'デパート|（　）|かいます。', options: ['へ', 'を', 'と', 'で'], answer: 3, topic: 'particles',
      explain: 'สถานที่ที่ทำกริยา + で: [[デパート|で|かいます。]] (โน้ต "เพิ่มเติมที่จะออกเพิ่ม") ・ ถ้าเป็นจุดหมายของการเคลื่อนที่จะใช้ へ' },
    { q: 'เติมคำช่วย: 「อ่านหนังสือ」', jp: 'ほん|（　）|よみます。', options: ['を', 'へ', 'で', 'と'], answer: 0, topic: 'particles',
      explain: 'を ชี้กรรม (สิ่งที่ถูกกระทำ) อ่านว่า "โอะ": [[ほん|を|よみます。]]' }
  ].map(function (x, i) { x.id = 'p3-' + (i + 1); x.type = 'mc'; x.src = 'additional'; return x; });

  /* ======================================================================
     PART 4 — Vehicles from pictures (answer in Japanese)
     ====================================================================== */
  function vehicle(id, i, prefix, src, accept) {
    var v = JF.vocabById[id];
    return {
      id: prefix + (i + 1), type: 'text', src: src, img: v.img, alt: 'ภาพยานพาหนะ ข้อ ' + (i + 1),
      fields: [{ key: 'jp', label: 'ตอบเป็นภาษาญี่ปุ่น', kind: 'kana', answers: accept || [v.kana], romaji: [v.romaji], placeholder: 'พิมพ์ฮิรางานะ / คาตาคานะ' }],
      answerText: v.kana + ' (' + v.romaji + ') — ' + v.th,
      answerVocab: id,
      explain: /[ァ-ヶ]/.test(v.kana)
        ? v.kana + ' เป็นคำทับศัพท์ จึงเขียนด้วยคาตาคานะ'
        : v.kana + ' = ' + v.th + ' ・ ใช้กับ で: [[' + v.kana + '|で|いきます。]] = ไปโดย' + v.th.split(' / ')[0]
    };
  }
  var P4 = ['densha', 'hikouki', 'jitensha', 'fune', 'basu', 'kuruma'];
  var P4_ACCEPT = { densha: ['でんしゃ', '電車'], kuruma: ['くるま', '車'] };
  var part4 = P4.map(function (id, i) { var it = vehicle(id, i, 'p4-', i < 4 ? 'doc' : 'doc', P4_ACCEPT[id]); if (i >= 4) it.handwritten = true; return it; });
  var part4Extra = ['chikatetsu', 'takushii', 'tukutuku'].map(function (id, i) { return vehicle(id, i, 'p4x-', 'additional'); });

  /* ======================================================================
     PART 5 — Verbs: picture & vocabulary matching (letters a, b, c …)
     Choices: hiragana + romaji only (no kanji, no translation) — see Part 5 correction.
     ====================================================================== */
  var P5_OPTIONS = ['tabemasu', 'benkyoushimasu', 'yomimasu', 'kaimasu', 'shukudaiwoshimasu', 'aimasu', 'nomimasu', 'kaerimasu', 'nemasu', 'okimasu'];
  var P5_PICTURE_ORDER = ['nomimasu', 'yomimasu', 'okimasu', 'kaimasu', 'shukudaiwoshimasu', 'tabemasu', 'nemasu', 'aimasu', 'kaerimasu', 'benkyoushimasu'];
  var P5_EXPLAIN = {
    tabemasu: 'たべます = กิน (รูปพจนานุกรม たべる) ・ [[やさい|を|たべます。]] = กินผัก',
    benkyoushimasu: 'べんきょうします = เรียน ・ [[にほんご|を|べんきょうします。]] = เรียนภาษาญี่ปุ่น',
    yomimasu: 'よみます = อ่าน (よむ) ・ [[ほん|を|よみます。]] = อ่านหนังสือ',
    kaimasu: 'かいます = ซื้อ (かう) ・ [[おみやげ|を|かいます。]] = ซื้อของฝาก',
    shukudaiwoshimasu: 'しゅくだいをします = ทำการบ้าน (คำนาม + をします)',
    aimasu: 'あいます = พบ / เจอ (あう) ・ ใช้คู่กับ に: ともだちに あいます = พบเพื่อน',
    nomimasu: 'のみます = ดื่ม (のむ) ・ [[コーヒー|を|のみます。]] = ดื่มกาแฟ',
    kaerimasu: 'かえります = กลับ (かえる) ・ [[うち|へ|かえります。]] = กลับบ้าน',
    nemasu: 'ねます = นอน (ねる)',
    okimasu: 'おきます = ตื่น (おきる) ・ [[けさ|なんじ|に|おきました|か。]] (Part 6)'
  };
  var part5 = P5_PICTURE_ORDER.map(function (id, i) {
    var v = JF.vocabById[id];
    return {
      id: 'p5-' + (i + 1), type: 'bank', src: 'doc', img: v.img, alt: 'ภาพคำกริยา ข้อ ' + (i + 1),
      answer: id, answerVocab: id, explain: P5_EXPLAIN[id],
      ownArt: /\.svg$/.test(v.img)
    };
  });

  /* ======================================================================
     PART 6 — Answer in Japanese (self-review)
     ====================================================================== */
  var part6 = [
    { jp: 'けさ|なんじ|に|おきました|か。', romaji: 'Kesa nanji ni okimashita ka.', th: 'เช้านี้ตื่นกี่โมง', src: 'doc',
      model: [{ jp: 'ろくじ|に|おきました。', romaji: 'Rokuji ni okimashita.', th: 'ตื่น 6 โมง' }, { jp: '7じ|に|おきました。', romaji: 'Shichiji ni okimashita.', th: 'ตื่น 7 โมง' }],
      check: [{ any: ['じに'], tip: 'บอกเวลา + に เช่น ろくじに' }, { any: ['おきました'], tip: 'ตอบด้วยรูปอดีต おきました เพราะถามว่า おきましたか' }],
      explain: 'คำถามเป็นอดีต (～ましたか) จึงตอบ ～ました ・ ใช้เวลาจริงของตัวเอง ระวังการอ่าน 4じ=よじ 7じ=しちじ 9じ=くじ ・ โน้ตเขียนมือในเอกสารตอบว่า "roku ji ni okimashita"' },
    { jp: 'なんようび|に|にほんご|を|べんきょうします|か。', romaji: "Nan'yōbi ni nihongo o benkyō shimasu ka.", th: 'เรียนภาษาญี่ปุ่นวันอะไร', src: 'doc',
      model: [{ jp: 'もくようび|に|べんきょうします。', romaji: 'Mokuyōbi ni benkyō shimasu.', th: 'เรียนวันพฤหัสบดี' }],
      check: [{ any: ['ようび'], tip: 'บอกวัน เช่น もくようび' }, { any: ['べんきょうします'], tip: 'ตอบด้วย べんきょうします (รูปเดียวกับคำถาม ～ますか)' }],
      explain: 'ตอบวันในสัปดาห์ + に + べんきょうします ・ โน้ตเขียนมือในเอกสารเขียนว่า もくようび べんきょうしました — แต่คำถามเป็น ～ますか จึงควรตอบ ～ます' }
  ].map(function (x, i) { x.id = 'p6-' + (i + 1); x.type = 'open'; return x; });

  var part6Extra = [
    { jp: 'にちようび|なに|を|します|か。', romaji: 'Nichiyōbi nani o shimasu ka.', th: 'วันอาทิตย์ทำอะไร',
      model: [{ jp: 'しゅくだい|を|します。', romaji: 'Shukudai o shimasu.', th: 'ทำการบ้าน' }],
      check: [{ any: ['を'], tip: 'ใช้ คำนาม + を + กริยา' }, { any: ['ます'], tip: 'ตอบด้วยรูป ～ます' }],
      explain: 'ตัวอย่างจากบทที่ 6 (なにをしますか — ระบุว่า "ออกสอบ")' },
    { jp: 'きのう|なに|を|しました|か。', romaji: 'Kinō nani o shimashita ka.', th: 'เมื่อวานทำอะไร',
      model: [{ jp: 'ともだち|と|サッカー|を|しました。', romaji: 'Tomodachi to sakkā o shimashita.', th: 'เล่นฟุตบอลกับเพื่อน' }],
      check: [{ any: ['ました'], tip: 'きのう เป็นอดีต → ～ました' }],
      explain: 'ตัวอย่างจากบทที่ 6 หน้า 39' },
    { jp: 'なんじ|に|おわります|か。', romaji: 'Nanji ni owarimasu ka.', th: 'เลิกกี่โมง',
      model: [{ jp: '4じ|に|おわります。', romaji: 'Yoji ni owarimasu.', th: 'เลิก 4 โมง' }],
      check: [{ any: ['じに'], tip: 'เวลา + に' }, { any: ['おわります'], tip: 'ตอบด้วย おわります' }],
      explain: 'คู่คำถาม–คำตอบจากเอกสารหน้า 1 และ 4' },
    { jp: 'だれ|と|いきます|か。', romaji: 'Dare to ikimasu ka.', th: 'ไปกับใคร',
      model: [{ jp: 'かぞく|と|いきます。', romaji: 'Kazoku to ikimasu.', th: 'ไปกับครอบครัว' }],
      check: [{ any: ['と'], tip: 'บุคคล + と' }, { any: ['いきます'], tip: 'ตอบด้วย いきます' }],
      explain: 'คู่คำถาม–คำตอบจากเอกสาร' },
    { jp: 'なんで|だいがく|へ|きます|か。', romaji: 'Nande daigaku e kimasu ka.', th: 'มามหาวิทยาลัยโดยอะไร',
      model: [{ jp: 'くるま|で|だいがく|へ|きます。', romaji: 'Kuruma de daigaku e kimasu.', th: 'มามหาวิทยาลัยโดยรถยนต์' }, { jp: 'バス|で|きます。', romaji: 'Basu de kimasu.', th: 'มาโดยรถบัส' }],
      check: [{ any: ['で'], tip: 'ยานพาหนะ + で' }, { any: ['きます'], tip: 'ตอบด้วย きます (มา)' }],
      explain: 'ถ้าเดินมา ใช้ あるいてきます (ไม่มี で)' },
    { jp: 'どこ|へ|いきます|か。', romaji: 'Doko e ikimasu ka.', th: 'จะไปที่ไหน',
      model: [{ jp: 'しょくどう|へ|いきます。', romaji: 'Shokudō e ikimasu.', th: 'ไปโรงอาหาร' }],
      check: [{ any: ['へ', 'に'], tip: 'สถานที่ + へ' }, { any: ['いきます'], tip: 'ตอบด้วย いきます' }],
      explain: 'สถานที่ + へ + いきます' }
  ].map(function (x, i) { x.id = 'p6x-' + (i + 1); x.type = 'open'; x.src = 'additional'; return x; });

  /* ======================================================================
     PART 7 — Sentence ordering
     ====================================================================== */
  function order(id, src, chips, answers, romaji, th, explain) {
    return { id: id, type: 'order', src: src, chips: chips, answers: answers, romaji: romaji, th: th, explain: explain };
  }
  var part7 = [
    order('p7-1', 'doc', ['だいがく', 'まいにち', 'いきます', 'へ'],
      [['まいにち', 'だいがく', 'へ', 'いきます'], ['だいがく', 'へ', 'まいにち', 'いきます']],
      'Mainichi daigaku e ikimasu.', 'ไปมหาวิทยาลัยทุกวัน',
      'คำบอกเวลา (まいにち) มักขึ้นต้นประโยค → สถานที่ + へ → กริยาไว้ท้ายสุด'),
    order('p7-2', 'doc', ['たべます', 'あさ', 'パン', 'を'],
      [['あさ', 'パン', 'を', 'たべます']],
      'Asa pan o tabemasu.', 'กินขนมปังตอนเช้า',
      'เวลา (あさ) → กรรม + を → กริยา たべます อยู่ท้ายประโยค'),
    order('p7-3', 'doc', ['と', 'えいが', 'ともだち', 'みました', 'きのう', 'を'],
      [['きのう', 'ともだち', 'と', 'えいが', 'を', 'みました'], ['ともだち', 'と', 'きのう', 'えいが', 'を', 'みました']],
      'Kinō tomodachi to eiga o mimashita.', 'เมื่อวานดูหนังกับเพื่อน',
      'เวลา → บุคคล + と → กรรม + を → กริยา (อดีต みました เพราะมี きのう)')
  ];
  var part7Extra = [
    order('p7x-1', 'additional', ['かいます', 'デパート', 'を', 'で', 'おみやげ'],
      [['デパート', 'で', 'おみやげ', 'を', 'かいます']],
      'Depāto de omiyage o kaimasu.', 'ซื้อของฝากที่ห้างสรรพสินค้า', 'สถานที่ทำกริยา + で → กรรม + を → กริยา (สไลด์บทที่ 6 หน้า 47)'),
    order('p7x-2', 'additional', ['へ', 'くるま', 'きます', 'だいがく', 'で'],
      [['くるま', 'で', 'だいがく', 'へ', 'きます']],
      'Kuruma de daigaku e kimasu.', 'มามหาวิทยาลัยโดยรถยนต์', 'ยานพาหนะ + で → สถานที่ + へ → กริยาการเคลื่อนที่'),
    order('p7x-3', 'additional', ['コーヒー', 'のみます', 'まいあさ', 'を'],
      [['まいあさ', 'コーヒー', 'を', 'のみます']],
      'Maiasa kōhī o nomimasu.', 'ดื่มกาแฟทุกๆ เช้า', 'สไลด์บทที่ 6 หน้า 28'),
    order('p7x-4', 'additional', ['しました', 'ともだち', 'しゅくだい', 'と', 'を'],
      [['ともだち', 'と', 'しゅくだい', 'を', 'しました']],
      'Tomodachi to shukudai o shimashita.', 'ทำการบ้านกับเพื่อน', 'สไลด์บทที่ 6 หน้า 29'),
    order('p7x-5', 'additional', ['かえります', 'と', 'うち', 'かぞく', 'へ'],
      [['かぞく', 'と', 'うち', 'へ', 'かえります'], ['うち', 'へ', 'かぞく', 'と', 'かえります']],
      'Kazoku to uchi e kaerimasu.', 'กลับบ้านกับครอบครัว', 'บุคคล + と และ สถานที่ + へ สลับตำแหน่งกันได้ แต่กริยาต้องอยู่ท้ายสุด')
  ];

  /* ======================================================================
     PRE-FINAL — Part 3 converted from the document's tables
     ====================================================================== */
  function readingItem(id, label, kana, romaji, explain) {
    return { id: id, type: 'text', src: 'derived', big: label,
      fields: [{ key: 'r', label: 'คำอ่าน (ฮิรางานะ หรือ โรมาจิ)', kind: 'reading', answers: [kana], romaji: [romaji], placeholder: 'ฮิรางานะ / romaji' }],
      answerText: kana + ' (' + romaji + ')', explain: explain };
  }
  function conjItem(id, label, kana, romaji, explain) {
    return { id: id, type: 'text', src: 'derived', big: 'たべます', bigSub: label,
      fields: [{ key: 'r', label: label, kind: 'kana', answers: [kana], romaji: [romaji], placeholder: 'ฮิรางานะ' }],
      answerText: kana + ' (' + romaji + ')', explain: explain };
  }
  function thMc(id, jp, options, answer, explain) {
    return { id: id, type: 'mc', src: 'derived', q: 'แปลว่าอะไร', jp: jp, options: options, optionsTh: true, answer: answer, explain: explain, noHint: true };
  }
  var prefinal3 = [
    readingItem('pf3-1', '4 โมง', 'よじ', 'yoji', '４โมง = よじ (ตารางในเอกสาร Part 3)'),
    readingItem('pf3-2', '7 โมง', 'しちじ', 'shichiji', '７โมง = しちじ'),
    readingItem('pf3-3', '9 โมง', 'くじ', 'kuji', '９โมง = くじ'),
    readingItem('pf3-4', 'เดือนเมษายน', 'しがつ', 'shigatsu', 'เมษายน = しがつ'),
    readingItem('pf3-5', 'เดือนกันยายน', 'くがつ', 'kugatsu', 'กันยายน = くがつ'),
    conjItem('pf3-6', 'ปัจจุบัน · ปฏิเสธ', 'たべません', 'tabemasen', '～ます → ～ません'),
    conjItem('pf3-7', 'อดีต · บอกเล่า', 'たべました', 'tabemashita', '～ます → ～ました'),
    conjItem('pf3-8', 'อดีต · ปฏิเสธ', 'たべませんでした', 'tabemasendeshita', '～ます → ～ませんでした'),
    thMc('pf3-9', 'きのう', ['เมื่อวาน', 'วันนี้', 'พรุ่งนี้', 'ทุกๆ วัน'], 0, 'きのう (kinō) = เมื่อวาน'),
    thMc('pf3-10', 'きょう', ['พรุ่งนี้', 'วันนี้', 'เมื่อวาน', 'ทุกๆ วัน'], 1, 'きょう (kyō) = วันนี้'),
    thMc('pf3-11', 'あした', ['ทุกๆ วัน', 'เมื่อวาน', 'พรุ่งนี้', 'วันนี้'], 2, 'あした (ashita) = พรุ่งนี้'),
    thMc('pf3-12', 'まいにち', ['วันนี้', 'พรุ่งนี้', 'เมื่อวาน', 'ทุกๆ วัน'], 3, 'まいにち (mainichi) = ทุกๆ วัน'),
    thMc('pf3-13', 'なに|も|しません。', ['ทำอะไรบ้าง', 'ไม่ได้ทำอะไรเลย', 'ทำทุกอย่าง', 'จะทำอะไร'], 1, 'คำแสดงคำถาม + も + ปฏิเสธ = ไม่…เลย → ไม่ได้ทำอะไรเลย')
  ];

  /* ======================================================================
     Shared lists & sets
     ====================================================================== */
  JF.lists = { p1th: P1_TH, p1q: P1_Q };
  JF.part1Expressions = P1;
  JF.part5Options = P5_OPTIONS;

  JF.sets = {
    'p1-match': { title: 'จับคู่สำนวนภาษาญี่ปุ่นกับความหมาย', src: 'doc', part: 1, items: part1Match,
      note: 'สำนวน 15 ข้อจากตาราง Part 1 ในเอกสาร' },
    'p1-answers': { title: 'ประโยคคำตอบ ↔ คำถาม', src: 'doc', part: 1, items: part1Answers,
      note: 'จากหน้า 1–3 ของเอกสาร (เอกสารไม่ได้พิมพ์คำสั่ง — ตีความว่าให้หาคำถามที่ตรงกับคำตอบ) · ข้อ 1 ต้นฉบับเขียน ９時 แสดงเป็น くじ ตามกฎ Part 1' },
    'p2-days': { title: 'เขียนคำอ่านและความหมาย', src: 'doc', part: 2, items: DAYS.map(function (d, i) { return dayItem(d, i, 'p2-'); }) },
    'p3-main': { title: 'แบบฝึกปรนัย 15 ข้อ', src: 'additional', part: 3, items: part3,
      note: 'เอกสารระบุหัวข้อ แต่ไม่ได้ให้ข้อสอบปรนัย — ทั้ง 15 ข้อจึงเขียนขึ้นใหม่จากหัวข้อที่ยืนยันแล้ว' },
    'p4-main': { title: 'ดูภาพแล้วตอบเป็นภาษาญี่ปุ่น', src: 'doc', part: 4, items: part4,
      note: 'คำศัพท์ 4 คำพิมพ์ในเอกสาร + バス くるま จากโน้ตเขียนมือ · ภาพจากสไลด์บทที่ 5 (くるま เป็นภาพวาดประกอบใหม่)' },
    'p4-extra': { title: 'ยานพาหนะเพิ่มเติมจากบทที่ 5', src: 'additional', part: 4, items: part4Extra },
    'p5-main': { title: 'จับคู่ภาพกับคำกริยา', src: 'doc', part: 5, type: 'bank', options: P5_OPTIONS, items: part5,
      note: 'คำกริยา 10 คำจากเอกสาร · ภาพที่มี ✎ เป็นภาพวาดประกอบใหม่ (เอกสารไม่มีภาพของคำนั้น) อาจไม่ตรงกับภาพในข้อสอบจริง' },
    'p6-main': { title: 'ตอบคำถามเป็นภาษาญี่ปุ่น', src: 'doc', part: 6, items: part6 },
    'p6-extra': { title: 'ฝึกตอบคำถามเพิ่มเติม', src: 'additional', part: 6, items: part6Extra },
    'p7-main': { title: 'เรียงประโยค (ตัวอย่างจากเอกสาร)', src: 'doc', part: 7, items: part7 },
    'p7-extra': { title: 'เรียงประโยคเพิ่มเติม', src: 'additional', part: 7, items: part7Extra,
      note: 'ข้อสอบจริงมี 5 ข้อ แต่เอกสารให้ตัวอย่าง 3 ข้อ — ข้อเหล่านี้แต่งจากประโยคในบทที่ 5–6' }
  };

  /* Pre-Final Practice: document order and groupings */
  function clone(items, prefix) {
    return items.map(function (it) {
      var c = {}; for (var k in it) c[k] = it[k];
      c.id = prefix + it.id; return c;
    });
  }
  JF.prefinal = [
    { id: 'pf-a', title: 'แบบฝึกหัดก่อนสอบปลายภาค ข้อ 1–15', part: 1, src: 'doc',
      note: 'หน้า 1–3 · หาคำถามที่ตรงกับประโยคคำตอบ (ตีความจากเอกสาร)', items: prefinalA },
    { id: 'pf-1', title: 'Part 1 · จับคู่ความหมาย', part: 1, src: 'doc', items: clone(part1Match, 'pf-') },
    { id: 'pf-2', title: 'Part 2 · คันจิเรื่องวัน', part: 2, src: 'doc', items: DAYS.map(function (d, i) { return dayItem(d, i, 'pf2-'); }) },
    { id: 'pf-3', title: 'Part 3 · เลือกข้อที่ถูกต้อง (ทบทวนจากตาราง)', part: 3, src: 'derived',
      note: 'เอกสารให้ตารางสรุป ไม่ได้ให้ข้อสอบ — ข้อเหล่านี้แปลงจากตารางในเอกสาร', items: prefinal3 },
    { id: 'pf-4', title: 'Part 4 · ยานพาหนะ', part: 4, src: 'doc', items: clone(part4, 'pf-') },
    { id: 'pf-5', title: 'Part 5 · คำกริยา', part: 5, src: 'doc', type: 'bank', options: P5_OPTIONS, items: clone(part5, 'pf-') },
    { id: 'pf-6', title: 'Part 6 · ตอบคำถามเป็นภาษาญี่ปุ่น', part: 6, src: 'doc', items: clone(part6, 'pf-') },
    { id: 'pf-7', title: 'Part 7 · เรียงประโยค', part: 7, src: 'doc', items: clone(part7, 'pf-') }
  ];
  JF.prefinal.forEach(function (s) { JF.sets[s.id] = s; });
})();
