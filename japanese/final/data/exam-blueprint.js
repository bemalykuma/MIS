/* Exam Blueprint — derived from เอกสารติวก่อนสอบปลายภาค.pdf (7 Parts).
 * questionCount: null where the document does not state a number.
 * confirmed: statements printed or handwritten in the review document (or confirmed by the student).
 */
window.JF = window.JF || {};

JF.examBlueprint = {
  source: 'เอกสารติวก่อนสอบปลายภาค.pdf',
  parts: [
    {
      id: 'part-1', num: 1,
      title: 'จับคู่ความหมาย ภาษาญี่ปุ่น ↔ ภาษาไทย',
      titleEn: 'Matching Expressions',
      format: 'จับคู่ (Matching)',
      questionCount: null,
      countNote: 'เอกสารมีสำนวนให้ทบทวน 15 สำนวน',
      instructions: 'จับคู่ความหมาย ภาษาญี่ปุ่นและภาษาไทยให้ถูกต้อง',
      displayRule: 'แสดงโจทย์ด้วยฮิรางานะเท่านั้น (ไม่มีคันจิ) พร้อมโรมาจิ',
      confirmed: [
        'สำนวนคำถาม 15 สำนวน: なんがつ / なんにち / なんようび / なんじ / なんじに おわりますか / ～から～まで / どこへ / なんで / だれと / だれが / いっしょに～ませんか / いくら / なにを / どんな',
        'หน้า 1–3 ของเอกสาร: ประโยคคำตอบ 15 ข้อ ที่จับคู่กับคำถามทั้ง 15 ข้อ'
      ],
      topics: ['question-words', 'time-expressions'],
      grammar: ['g-time', 'g-he', 'g-de-vehicle', 'g-to', 'g-masenka']
    },
    {
      id: 'part-2', num: 2,
      title: 'คันจิเรื่องวัน',
      titleEn: 'Days of the Week (Kanji)',
      format: 'เขียนคำอ่าน (ฮิรางานะหรือโรมาจิ) + ความหมาย',
      questionCount: 7,
      countNote: 'เอกสารแสดงครบ 7 วัน',
      instructions: 'เขียนคำอ่านเป็น Hiragana หรือ Romanji และบอกความหมายให้ถูกต้อง',
      displayRule: 'เอกสารเขียนแบบ 月ようび (คันจิ + ようび)',
      confirmed: ['月ようび 火ようび 水ようび 木ようび 金ようび 土ようび 日ようび — คำอ่านและความหมายภาษาไทย'],
      topics: ['days'],
      grammar: []
    },
    {
      id: 'part-3', num: 3,
      title: 'เลือกข้อที่ถูกต้อง',
      titleEn: 'Multiple Choice',
      format: 'ปรนัย 4 ตัวเลือก',
      questionCount: 15,
      countNote: '15 ข้อ (ยืนยันโดยผู้เรียน — เอกสารไม่ได้ระบุจำนวนข้อ)',
      instructions: 'เลือกข้อที่ถูกต้อง',
      confirmed: [
        'การอ่านพิเศษ: 4 โมง = よじ, 7 โมง = しちじ, 9 โมง = くじ, เมษายน = しがつ, กันยายน = くがつ',
        'ไวยากรณ์: ～ます / ～ません / ～ました / ～ませんでした (ตัวอย่าง たべます)',
        'คำศัพท์: きのう, きょう, あした, まいにち',
        'คำแสดงคำถาม + も + ปฏิเสธ = ไม่…เลย (なにもしません)',
        'โน้ตเขียนมือ "เพิ่มเติมที่จะออกเพิ่ม": คำช่วยในประโยคแบบ 一人で行きます。/ かぞくとかえります。/ デパートでかいます。 (คำอาจไม่ตรงนี้)'
      ],
      topics: ['special-readings', 'masu-forms', 'time-words', 'mo-negative', 'particles'],
      grammar: ['g-masu', 'g-mo', 'g-de-vehicle', 'g-to', 'g-de-place', 'g-o']
    },
    {
      id: 'part-4', num: 4,
      title: 'คำศัพท์ยานพาหนะ (เขียนตามภาพ)',
      titleEn: 'Vehicles — Picture Vocabulary',
      format: 'ดูภาพแล้วตอบเป็นภาษาญี่ปุ่น',
      questionCount: 6,
      countNote: '6 ข้อ (โน้ตเขียนมือ: "6 ข้อ เพิ่มมาอีก 2 คือ バス くるま")',
      instructions: 'คำศัพท์ เขียนคำศัพท์ให้ถูกต้องตามภาพ — ให้รูปมาแล้วให้ตอบเป็นภาษาญี่ปุ่น',
      confirmed: ['でんしゃ ひこうき じてんしゃ ふね (พิมพ์ในเอกสาร)', 'バス くるま (โน้ตเขียนมือ)'],
      topics: ['transport'],
      grammar: ['g-de-vehicle']
    },
    {
      id: 'part-5', num: 5,
      title: 'คำศัพท์คำกริยา (จับคู่ภาพ)',
      titleEn: 'Verbs — Picture & Vocabulary Matching',
      format: 'ดูภาพ แล้วเลือกคำจากตัวเลือก (ฮิรางานะ + โรมาจิ)',
      questionCount: 10,
      countNote: 'เอกสารมีคำกริยา 10 คำ',
      instructions: 'คำศัพท์ เขียนคำศัพท์ให้ถูกต้องตามภาพ — "มีภาพกับช้อย ช้อยจะเป็น hira+romanji ให้เอาคำมาเติม" (โน้ตเขียนมือ)',
      confirmed: ['たべます べんきょうします よみます かいます しゅくだいをします あいます のみます かえります ねます おきます'],
      topics: ['verbs'],
      grammar: ['g-o', 'g-o-shimasu']
    },
    {
      id: 'part-6', num: 6,
      title: 'ตอบคำถามเป็นภาษาญี่ปุ่น',
      titleEn: 'Answer in Japanese',
      format: 'เขียนตอบ (ตรวจด้วยตนเอง)',
      questionCount: null,
      countNote: 'เอกสารมีตัวอย่าง 2 ข้อ',
      instructions: 'ตอบคำถามเป็นภาษาญี่ปุ่น',
      confirmed: ['けさなんじにおきましたか。', 'なんようび にほんごをべんきょうしますか。'],
      topics: ['answer-questions'],
      grammar: ['g-time', 'g-nani', 'g-masu']
    },
    {
      id: 'part-7', num: 7,
      title: 'เรียงประโยค',
      titleEn: 'Sentence Ordering',
      format: 'เรียงคำให้เป็นประโยค',
      questionCount: 5,
      countNote: '5 ข้อ 10 คะแนน (เอกสารให้ตัวอย่าง 3 ข้อ)',
      instructions: 'เรียงประโยค 5 ข้อ 10 คะแนน',
      confirmed: ['だいがく / まいにち / いきます / へ', 'たべます / あさ / パン / を', 'と / えいが / ともだち / みました / きのう / を', 'สไลด์บทที่ 6 (คำนาม を): "ออกข้อสอบพาร์ทเรียงประโยค"'],
      topics: ['ordering'],
      grammar: ['g-he', 'g-o', 'g-to']
    }
  ],

  /* Study checklist — topics that map to the parts above */
  checklist: [
    { id: 'question-words', label: 'สำนวนคำถาม 15 สำนวน (Part 1)', part: 1 },
    { id: 'time-expressions', label: '～じ、～じに、～から～まで、ごぜん・ごご', part: 1 },
    { id: 'days', label: 'คันจิวันทั้ง 7 วัน + คำอ่าน + ความหมาย (Part 2)', part: 2 },
    { id: 'special-readings', label: 'よじ・しちじ・くじ・しがつ・くがつ (Part 3)', part: 3 },
    { id: 'masu-forms', label: '～ます／～ません／～ました／～ませんでした', part: 3 },
    { id: 'time-words', label: 'きのう・きょう・あした・まいにち', part: 3 },
    { id: 'mo-negative', label: 'คำแสดงคำถาม + も + ปฏิเสธ', part: 3 },
    { id: 'particles', label: 'คำช่วย へ・で・と・を', part: 3 },
    { id: 'transport', label: 'ยานพาหนะ 6 คำ (Part 4)', part: 4 },
    { id: 'verbs', label: 'คำกริยา 10 คำ (Part 5)', part: 5 },
    { id: 'answer-questions', label: 'ตอบคำถามเป็นภาษาญี่ปุ่น (Part 6)', part: 6 },
    { id: 'ordering', label: 'เรียงประโยค (Part 7)', part: 7 },
    { id: 'kana', label: 'ทบทวนฮิรางานะ / คาตาคานะ', part: null }
  ],

  /* Items in the source that need review (shown on the overview page) */
  sourceFlags: [
    'บทที่ 6 หน้า 26: คำแปลใต้ภาพ よみます เขียนว่า "กินผัก" (คัดลอกมาจากสไลด์ก่อนหน้า) — ประโยค にほんごのほんをよみます แปลว่า อ่านหนังสือภาษาญี่ปุ่น',
    'บทที่ 6 หน้า 48: โรมาจิเขียนว่า "shinbun" แต่ประโยคคือ えきで本を買います (มีแก้มือเป็น hon) — ใช้ ほん = หนังสือ',
    'บทที่ 6 หน้า 50: 朝ごはん แปลผิดเป็น "หนังสือพิมพ์" — ที่ถูกคือ อาหารเช้า',
    'บทที่ 6 หน้า 19: ぎゅうにゅう เขียนโรมาจิว่า "kyuunyuu" — ที่ถูกคือ gyūnyū',
    'Part 6 ข้อ 2: โน้ตเขียนมือในเอกสารตอบเป็น "～べんきょうしました" แต่คำถามใช้ ～ますか จึงควรตอบด้วย ～ます (ตัวอย่างในเว็บใช้ もくようびに べんきょうします)',
    'หน้า 1–3 ของเอกสารไม่มีคำสั่ง — เว็บตีความว่าให้เลือก/เขียนคำถามที่ตรงกับประโยคคำตอบ (ตรงกับคำถาม 15 ข้อใน Part 1)'
  ]
};
