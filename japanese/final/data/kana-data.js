/* Kana reference data (modern standard chart, Hepburn romaji). */
window.JF = window.JF || {};

(function () {
  // Each row: [rowLabel, [[hira, kata, romaji] | null, ...5 columns a-i-u-e-o]]
  var basic = [
    ['あ', [['あ', 'ア', 'a'], ['い', 'イ', 'i'], ['う', 'ウ', 'u'], ['え', 'エ', 'e'], ['お', 'オ', 'o']]],
    ['か', [['か', 'カ', 'ka'], ['き', 'キ', 'ki'], ['く', 'ク', 'ku'], ['け', 'ケ', 'ke'], ['こ', 'コ', 'ko']]],
    ['さ', [['さ', 'サ', 'sa'], ['し', 'シ', 'shi'], ['す', 'ス', 'su'], ['せ', 'セ', 'se'], ['そ', 'ソ', 'so']]],
    ['た', [['た', 'タ', 'ta'], ['ち', 'チ', 'chi'], ['つ', 'ツ', 'tsu'], ['て', 'テ', 'te'], ['と', 'ト', 'to']]],
    ['な', [['な', 'ナ', 'na'], ['に', 'ニ', 'ni'], ['ぬ', 'ヌ', 'nu'], ['ね', 'ネ', 'ne'], ['の', 'ノ', 'no']]],
    ['は', [['は', 'ハ', 'ha'], ['ひ', 'ヒ', 'hi'], ['ふ', 'フ', 'fu'], ['へ', 'ヘ', 'he'], ['ほ', 'ホ', 'ho']]],
    ['ま', [['ま', 'マ', 'ma'], ['み', 'ミ', 'mi'], ['む', 'ム', 'mu'], ['め', 'メ', 'me'], ['も', 'モ', 'mo']]],
    ['や', [['や', 'ヤ', 'ya'], null, ['ゆ', 'ユ', 'yu'], null, ['よ', 'ヨ', 'yo']]],
    ['ら', [['ら', 'ラ', 'ra'], ['り', 'リ', 'ri'], ['る', 'ル', 'ru'], ['れ', 'レ', 're'], ['ろ', 'ロ', 'ro']]],
    ['わ', [['わ', 'ワ', 'wa'], null, null, null, ['を', 'ヲ', 'o']]],
    ['ん', [['ん', 'ン', 'n'], null, null, null, null]]
  ];
  var dakuten = [
    ['が', [['が', 'ガ', 'ga'], ['ぎ', 'ギ', 'gi'], ['ぐ', 'グ', 'gu'], ['げ', 'ゲ', 'ge'], ['ご', 'ゴ', 'go']]],
    ['ざ', [['ざ', 'ザ', 'za'], ['じ', 'ジ', 'ji'], ['ず', 'ズ', 'zu'], ['ぜ', 'ゼ', 'ze'], ['ぞ', 'ゾ', 'zo']]],
    ['だ', [['だ', 'ダ', 'da'], ['ぢ', 'ヂ', 'ji'], ['づ', 'ヅ', 'zu'], ['で', 'デ', 'de'], ['ど', 'ド', 'do']]],
    ['ば', [['ば', 'バ', 'ba'], ['び', 'ビ', 'bi'], ['ぶ', 'ブ', 'bu'], ['べ', 'ベ', 'be'], ['ぼ', 'ボ', 'bo']]]
  ];
  var handakuten = [
    ['ぱ', [['ぱ', 'パ', 'pa'], ['ぴ', 'ピ', 'pi'], ['ぷ', 'プ', 'pu'], ['ぺ', 'ペ', 'pe'], ['ぽ', 'ポ', 'po']]]
  ];
  // Yōon: base i-column kana + small ya/yu/yo
  var yoonBases = [
    ['き', 'キ', 'ky'], ['し', 'シ', 'sh'], ['ち', 'チ', 'ch'], ['に', 'ニ', 'ny'], ['ひ', 'ヒ', 'hy'],
    ['み', 'ミ', 'my'], ['り', 'リ', 'ry'], ['ぎ', 'ギ', 'gy'], ['じ', 'ジ', 'j'], ['び', 'ビ', 'by'], ['ぴ', 'ピ', 'py']
  ];
  var yoon = yoonBases.map(function (b) {
    return [b[0] + 'ゃ', [
      [b[0] + 'ゃ', b[1] + 'ャ', b[2] + 'a'],
      [b[0] + 'ゅ', b[1] + 'ュ', b[2] + 'u'],
      [b[0] + 'ょ', b[1] + 'ョ', b[2] + 'o']
    ]];
  });
  // Optional / rare (kept out of the standard chart)
  var rare = [
    ['ゐ', [['ゐ', 'ヰ', 'wi']]],
    ['ゑ', [['ゑ', 'ヱ', 'we']]]
  ];

  JF.kana = {
    sections: [
      { id: 'basic', title: 'เสียงพื้นฐาน (Gojūon)', cols: ['a', 'i', 'u', 'e', 'o'], rows: basic },
      { id: 'dakuten', title: 'เสียงขุ่น (Dakuten ゛)', cols: ['a', 'i', 'u', 'e', 'o'], rows: dakuten },
      { id: 'handakuten', title: 'เสียงกึ่งขุ่น (Handakuten ゜)', cols: ['a', 'i', 'u', 'e', 'o'], rows: handakuten },
      { id: 'yoon', title: 'เสียงควบ (Yōon ゃ ゅ ょ)', cols: ['ya', 'yu', 'yo'], rows: yoon }
    ],
    rare: { id: 'rare', title: 'ตัวอักษรโบราณ / ไม่ใช้แล้ว (อ้างอิงเท่านั้น)', rows: rare },
    notes: {
      'を': 'を ในคำช่วยอ่านว่า "โอะ" (o) — บางตำราเขียน wo',
      'ぢ': 'ぢ อ่านเหมือน じ (ji) — พบน้อย',
      'づ': 'づ อ่านเหมือน ず (zu) — พบน้อย',
      'は': 'เมื่อเป็นคำช่วยหัวเรื่อง は อ่านว่า "วะ" (wa)',
      'へ': 'เมื่อเป็นคำช่วยบอกทิศทาง へ อ่านว่า "เอะ" (e)',
      'ん': 'ん เป็นเสียงตัวสะกด n / ng / m ตามเสียงที่ตามมา',
      'つ': 'っ (つ ตัวเล็ก) ทำให้พยัญชนะถัดไปซ้ำ เช่น がっこう gakkō'
    }
  };

  // Flat list for flashcards & quizzes
  function flatten(sections) {
    var out = [];
    sections.forEach(function (s) {
      s.rows.forEach(function (r) {
        r[1].forEach(function (c) { if (c) out.push({ h: c[0], k: c[1], r: c[2], group: s.id }); });
      });
    });
    return out;
  }
  JF.kana.all = flatten(JF.kana.sections);
  JF.kana.basicList = JF.kana.all.filter(function (c) { return c.group === 'basic'; });
})();
