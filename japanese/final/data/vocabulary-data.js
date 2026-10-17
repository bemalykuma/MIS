/* Vocabulary dictionary — Japanese Final.
 * Sources: r  = เอกสารติวก่อนสอบปลายภาค (exam review sheet)
 *          c5 = บทที่5_6.pdf, 第5課     c6 = บทที่5_6.pdf, 第6課
 *          sup = supplemental (not in the documents; labeled in the UI)
 * Fields: id, kana (hiragana/katakana reading), jp (spelling shown in the documents, may contain kanji),
 *         romaji (Hepburn), th, cat, src[], parts[] (related exam Parts), type, dict (dictionary form),
 *         surf[] (extra exact surfaces used for annotation), tts (pronunciation override), note.
 */
window.JF = window.JF || {};

(function () {
  var list = [];
  function V(id, kana, jp, romaji, th, cat, src, parts, extra) {
    var e = { id: id, kana: kana, jp: jp || kana, romaji: romaji, th: th, cat: cat, src: src, parts: parts || [] };
    if (extra) for (var k in extra) e[k] = extra[k];
    list.push(e);
  }

  /* ---------- Question words (คำแสดงคำถาม) ---------- */
  V('nangatsu', 'なんがつ', null, 'nangatsu', 'เดือนอะไร', 'question', ['r'], [1]);
  V('nannichi', 'なんにち', null, 'nannichi', 'วันที่เท่าไหร่', 'question', ['r'], [1]);
  V('nanyoubi', 'なんようび', null, "nan'yōbi", 'วันอะไร', 'question', ['r', 'c6'], [1]);
  V('nanji', 'なんじ', null, 'nanji', 'กี่โมง', 'question', ['r'], [1, 6]);
  V('doko', 'どこ', null, 'doko', 'ที่ไหน', 'question', ['r', 'c5'], [1]);
  V('nande', 'なんで', null, 'nande', 'โดยอะไร / ด้วยอะไร', 'question', ['r', 'c6'], [1]);
  V('dare', 'だれ', null, 'dare', 'ใคร', 'question', ['r', 'c5'], [1]);
  V('ikura', 'いくら', null, 'ikura', 'เท่าไหร่ (ราคา)', 'question', ['r'], [1]);
  V('nani', 'なに', '何', 'nani', 'อะไร', 'question', ['r', 'c6'], [1, 6]);
  V('nan', 'なん', '何', 'nan', 'อะไร (อ่าน なん เมื่อตามด้วย た・だ・な หรือลักษณะนาม)', 'question', ['c6'], [], { surf: [] , note: 'เอกสารระบุว่าเรื่อง なん/なに ไม่ออกสอบ' });
  V('donna', 'どんな', null, 'donna', 'แบบไหน / อย่างไร', 'question', ['r'], [1]);

  /* ---------- Particles (คำช่วย) ---------- */
  V('p_e', 'へ', null, 'e', 'ไปยัง… (บอกทิศทาง/จุดหมาย) — เขียน へ แต่อ่านว่า "เอะ"', 'particle', ['c5', 'r'], [1, 3, 7], { type: 'particle', tts: 'え' });
  V('p_de', 'で', null, 'de', 'โดย (ยานพาหนะ) / ที่ (สถานที่ทำกริยา) / ひとりで = คนเดียว', 'particle', ['c5', 'c6', 'r'], [1, 3, 7], { type: 'particle' });
  V('p_to', 'と', null, 'to', 'กับ (บุคคล)', 'particle', ['c5', 'r'], [1, 3, 7], { type: 'particle' });
  V('p_o', 'を', null, 'o', 'คำช่วยบอกกรรม — เขียน を แต่อ่านว่า "โอะ"', 'particle', ['c6', 'r'], [3, 7], { type: 'particle', tts: 'お' });
  V('p_mo', 'も', null, 'mo', 'ก็ / คำแสดงคำถาม + も + ปฏิเสธ = ไม่…เลย', 'particle', ['r', 'c5'], [3], { type: 'particle' });
  V('p_ni', 'に', null, 'ni', 'ตอน… (ชี้เวลา) / あいます: พบ…', 'particle', ['r', 'c6'], [1, 6], { type: 'particle' });
  V('p_ga', 'が', null, 'ga', 'คำช่วยชี้ประธาน', 'particle', ['r'], [1], { type: 'particle' });
  V('p_wa', 'は', null, 'wa', 'คำช่วยบอกหัวเรื่อง — เขียน は แต่อ่านว่า "วะ"', 'particle', ['c6'], [], { type: 'particle', tts: 'わ' });
  V('p_no', 'の', null, 'no', 'ของ (เชื่อมคำนาม)', 'particle', ['r', 'c6'], [], { type: 'particle' });
  V('p_ka', 'か', null, 'ka', 'คำช่วยท้ายประโยคคำถาม', 'particle', ['r'], [1], { type: 'particle' });
  V('p_kara', 'から', null, 'kara', 'ตั้งแต่', 'particle', ['r'], [1], { type: 'particle' });
  V('p_made', 'まで', null, 'made', 'ถึง / จนถึง', 'particle', ['r'], [1], { type: 'particle' });

  /* ---------- Time (เวลา) ---------- */
  V('gozen', 'ごぜん', null, 'gozen', 'ช่วงเช้า (a.m.)', 'time', ['r'], [1]);
  V('gogo', 'ごご', null, 'gogo', 'ช่วงบ่าย (p.m.)', 'time', ['r'], [1]);
  V('ji', '～じ', '～時', '-ji', '…โมง / …นาฬิกา', 'time', ['r'], [3]);
  V('sanji', 'さんじ', '3時', 'sanji', '3 โมง (บ่าย 3 โมง เมื่อใช้กับ ごご)', 'time', ['r'], [1], { surf: ['3じ', '３じ'] });
  V('yoji', 'よじ', '4時', 'yoji', '4 โมง — อ่าน よじ (ไม่ใช่ よんじ)', 'time', ['r'], [3, 1], { surf: ['4じ', '４じ'] });
  V('shichiji', 'しちじ', '7時', 'shichiji', '7 โมง — อ่าน しちじ', 'time', ['r'], [3], { surf: ['7じ', '７じ'] });
  V('rokuji', 'ろくじ', '6時', 'rokuji', '6 โมง', 'time', ['sup'], [6], { surf: ['6じ', '６じ'], note: 'คำเสริมสำหรับตัวอย่างคำตอบ Part 6 (โน้ตเขียนมือ "roku ji ni okimashita")' });
  V('kuji', 'くじ', '9時', 'kuji', '9 โมง — อ่าน くじ (ไม่ใช่ きゅうじ)', 'time', ['r'], [3, 1], { surf: ['9じ', '９じ'] });

  /* ---------- Months & dates (เดือน/วันที่) ---------- */
  V('gatsu', '～がつ', '～月', '-gatsu', 'เดือน…', 'month', ['r'], [3]);
  V('sangatsu', 'さんがつ', '3月', 'sangatsu', 'เดือนมีนาคม', 'month', ['r'], [1], { surf: ['3がつ', '３がつ'] });
  V('shigatsu', 'しがつ', '4月', 'shigatsu', 'เดือนเมษายน — อ่าน しがつ (ไม่ใช่ よんがつ)', 'month', ['r'], [3], { surf: ['4がつ', '４がつ'] });
  V('kugatsu', 'くがつ', '9月', 'kugatsu', 'เดือนกันยายน — อ่าน くがつ (ไม่ใช่ きゅうがつ)', 'month', ['r'], [3], { surf: ['9がつ', '９がつ'] });
  V('nichi', '～にち', '～日', '-nichi', 'วันที่…', 'month', ['r'], [1]);
  V('juugonichi', 'じゅうごにち', '15日', 'jūgonichi', 'วันที่ 15', 'month', ['r'], [1], { surf: ['15にち', '１５にち'] });

  /* ---------- Days of the week (วันในสัปดาห์) — documents write 月ようび ---------- */
  V('youbi', '～ようび', '～曜日', '-yōbi', 'วัน… (คำต่อท้ายชื่อวันในสัปดาห์)', 'days', ['r'], [2]);
  V('getsuyoubi', 'げつようび', '月曜日', 'getsuyōbi', 'วันจันทร์', 'days', ['r'], [2, 1], { surf: ['月ようび'], docForm: '月ようび' });
  V('kayoubi', 'かようび', '火曜日', 'kayōbi', 'วันอังคาร', 'days', ['r'], [2], { surf: ['火ようび'], docForm: '火ようび' });
  V('suiyoubi', 'すいようび', '水曜日', 'suiyōbi', 'วันพุธ', 'days', ['r'], [2], { surf: ['水ようび'], docForm: '水ようび' });
  V('mokuyoubi', 'もくようび', '木曜日', 'mokuyōbi', 'วันพฤหัสบดี', 'days', ['r'], [2], { surf: ['木ようび'], docForm: '木ようび' });
  V('kinyoubi', 'きんようび', '金曜日', "kin'yōbi", 'วันศุกร์', 'days', ['r'], [2, 1], { surf: ['金ようび'], docForm: '金ようび' });
  V('doyoubi', 'どようび', '土曜日', 'doyōbi', 'วันเสาร์', 'days', ['r'], [2], { surf: ['土ようび'], docForm: '土ようび' });
  V('nichiyoubi', 'にちようび', '日曜日', 'nichiyōbi', 'วันอาทิตย์', 'days', ['r', 'c6'], [2], { surf: ['日ようび'], docForm: '日ようび' });

  /* ---------- Time words (คำบอกเวลา) ---------- */
  V('kinou', 'きのう', null, 'kinō', 'เมื่อวาน', 'timewords', ['r', 'c6'], [3, 7]);
  V('kyou', 'きょう', '今日', 'kyō', 'วันนี้', 'timewords', ['r', 'c6'], [3]);
  V('ashita', 'あした', '明日', 'ashita', 'พรุ่งนี้', 'timewords', ['r', 'c6'], [3]);
  V('mainichi', 'まいにち', null, 'mainichi', 'ทุกๆ วัน', 'timewords', ['r'], [3, 7]);
  V('maiasa', 'まいあさ', '毎朝', 'maiasa', 'ทุกๆ เช้า', 'timewords', ['c6'], [7]);
  V('kesa', 'けさ', null, 'kesa', 'เช้านี้', 'timewords', ['c5', 'r'], [6]);
  V('asa', 'あさ', null, 'asa', 'ตอนเช้า', 'timewords', ['r'], [7]);
  V('sakki', 'さっき', null, 'sakki', 'เมื่อสักครู่', 'timewords', ['c6'], []);

  /* ---------- Numbers & money ---------- */
  V('happyaku', 'はっぴゃく', '800', 'happyaku', 'แปดร้อย (800)', 'numbers', ['r'], [1], { surf: ['800', '８００'] });
  V('baatsu', 'バーツ', null, 'bātsu', 'บาท (สกุลเงินไทย)', 'numbers', ['r'], [1]);

  /* ---------- Expressions (สำนวน) ---------- */
  V('desu', 'です', null, 'desu', 'เป็น / คือ (คำลงท้ายสุภาพ)', 'expr', ['r'], [1]);
  V('isshoni', 'いっしょに', null, 'issho ni', 'ด้วยกัน', 'expr', ['r', 'c6'], [1]);
  V('ee', 'ええ', null, 'ē', 'ครับ / ค่ะ (คำตอบรับ)', 'expr', ['r', 'c6'], [1]);
  V('iidesune', 'いいですね', null, 'ii desu ne', 'ดีจังเลยนะ', 'expr', ['r', 'c6'], [1], { note: 'ในสไลด์มีโน้ตเขียนมือว่า "ออกสอบ"' });
  V('iidesuyo', 'いいですよ', null, 'ii desu yo', 'ก็ดีนะ / ได้สิ', 'expr', ['c6'], []);
  V('wakarimashita', 'わかりました', null, 'wakarimashita', 'รับทราบ / เข้าใจแล้ว', 'expr', ['c6'], []);
  V('jamata', 'じゃ、また', null, 'ja, mata', 'แล้วพบกันใหม่', 'expr', ['c6'], []);
  V('ja', 'じゃ', null, 'ja', 'ถ้าอย่างนั้น / งั้น', 'expr', ['c6'], []);
  V('chotto', 'ちょっと', null, 'chotto', 'นิดหน่อย / สักครู่', 'expr', ['c6'], []);
  V('itsumo', 'いつも', null, 'itsumo', 'เสมอๆ / เป็นประจำ', 'expr', ['c6'], []);
  V('tokidoki', 'ときどき', '時々', 'tokidoki', 'บางที / บางครั้ง', 'expr', ['c6'], []);
  V('sorekara', 'それから', null, 'sorekara', 'หลังจากนั้น', 'expr', ['c6'], []);

  /* ---------- Places (สถานที่) ---------- */
  V('suupaa', 'スーパー', null, 'sūpā', 'ซูเปอร์มาร์เก็ต', 'places', ['c5'], []);
  V('yuubinkyoku', 'ゆうびんきょく', null, 'yūbinkyoku', 'ไปรษณีย์', 'places', ['c5'], []);
  V('bijutsukan', 'びじゅつかん', null, 'bijutsukan', 'หอศิลป์', 'places', ['c5'], [], { note: 'สไลด์เขียนโรมาจิว่า "bi juu tsu kan" — ที่ถูกต้องคือ bijutsukan (つ ไม่ใช่เสียงยาว)' });
  V('shokudou', 'しょくどう', null, 'shokudō', 'โรงอาหาร', 'places', ['c5', 'r'], [1]);
  V('gakkou', 'がっこう', '学校', 'gakkō', 'โรงเรียน', 'places', ['c5', 'c6'], []);
  V('daigaku', 'だいがく', null, 'daigaku', 'มหาวิทยาลัย', 'places', ['r'], [1, 7]);
  V('uchi', 'うち', null, 'uchi', 'บ้าน', 'places', ['c6'], [7]);
  V('depaato', 'デパート', null, 'depāto', 'ห้างสรรพสินค้า', 'places', ['c6', 'r'], [3]);
  V('eki', 'えき', '駅', 'eki', 'สถานี', 'places', ['c6'], []);
  V('mise', 'みせ', '店', 'mise', 'ร้านค้า', 'places', ['c6'], []);
  V('niwa', 'にわ', '庭', 'niwa', 'สวน', 'places', ['c6'], []);
  V('umi', 'うみ', '海', 'umi', 'ทะเล', 'places', ['c6'], []);
  V('nihon', 'にほん', null, 'Nihon', 'ประเทศญี่ปุ่น', 'places', ['c5'], []);
  V('bankoku', 'バンコク', null, 'Bankoku', 'กรุงเทพฯ', 'places', ['c6'], []);
  V('kyouto', 'きょうと', '京都', 'Kyōto', 'เกียวโต', 'places', ['c6'], []);
  V('tokoro', 'ところ', null, 'tokoro', 'สถานที่', 'places', ['r'], [1]);

  /* ---------- Adjectives ---------- */
  V('shizuka', 'しずか(な)', null, 'shizuka (na)', 'เงียบสงบ', 'other', ['r'], [1], { surf: ['しずかな', 'しずか'], type: 'na-adj' });
  V('suki', 'すき(な)', null, 'suki (na)', 'ชอบ', 'other', ['r'], [1], { surf: ['すき', 'すきな'], type: 'na-adj' });

  /* ---------- Transportation (ยานพาหนะ) ---------- */
  V('densha', 'でんしゃ', null, 'densha', 'รถไฟ / รถไฟฟ้า', 'transport', ['c5', 'r'], [4], { img: 'densha.png' });
  V('hikouki', 'ひこうき', null, 'hikōki', 'เครื่องบิน', 'transport', ['c5', 'r'], [4], { img: 'hikouki.png' });
  V('jitensha', 'じてんしゃ', null, 'jitensha', 'จักรยาน', 'transport', ['c5', 'r'], [4], { img: 'jitensha.png' });
  V('fune', 'ふね', null, 'fune', 'เรือ', 'transport', ['c5', 'r'], [4], { img: 'fune.png' });
  V('basu', 'バス', null, 'basu', 'รถบัส', 'transport', ['c5', 'r'], [4], { img: 'basu.png' });
  V('kuruma', 'くるま', null, 'kuruma', 'รถยนต์', 'transport', ['r'], [4], { img: 'kuruma.svg' });
  V('chikatetsu', 'ちかてつ', null, 'chikatetsu', 'รถไฟใต้ดิน', 'transport', ['c5'], [], { img: 'chikatetsu.png' });
  V('tukutuku', 'トゥクトゥク', null, 'tukutuku', 'รถตุ๊กตุ๊ก', 'transport', ['c5'], [], { img: 'tukutuku.png' });
  V('takushii', 'タクシー', null, 'takushī', 'แท็กซี่', 'transport', ['c5'], [], { img: 'takushii.png' });
  V('aruite', 'あるいて', null, 'aruite', 'เดิน (ไป / มา / กลับ) — ไม่ต้องใช้ で', 'transport', ['c5'], [], { img: 'aruite.png' });

  /* ---------- People ---------- */
  V('kazoku', 'かぞく', null, 'kazoku', 'ครอบครัว', 'people', ['r', 'c5'], [1]);
  V('tomodachi', 'ともだち', '友達', 'tomodachi', 'เพื่อน', 'people', ['r', 'c6'], [1, 7]);
  V('watashi', 'わたし', null, 'watashi', 'ฉัน / ผม', 'people', ['r'], [1]);
  V('hitoride', 'ひとりで', '一人で', 'hitori de', 'คนเดียว', 'people', ['c5', 'r'], [3]);

  /* ---------- Movement verbs (กริยาการเคลื่อนที่) ---------- */
  V('ikimasu', 'いきます', '行きます', 'ikimasu', 'ไป', 'movement', ['c5', 'r'], [1, 3, 7], { dict: 'いく', type: 'verb' });
  V('kimasu', 'きます', '来ます', 'kimasu', 'มา', 'movement', ['c5', 'r'], [1], { dict: 'くる', type: 'verb' });
  V('kaerimasu', 'かえります', '帰ります', 'kaerimasu', 'กลับ', 'movement', ['c5', 'r'], [5, 3], { dict: 'かえる', type: 'verb', img: 'kaerimasu.svg' });

  /* ---------- Everyday verbs (กริยาในชีวิตประจำวัน) ---------- */
  V('tabemasu', 'たべます', '食べます', 'tabemasu', 'กิน', 'verbs', ['c6', 'r'], [5, 3, 7], { dict: 'たべる', type: 'verb', img: 'tabemasu.png' });
  V('nomimasu', 'のみます', '飲みます', 'nomimasu', 'ดื่ม', 'verbs', ['c6', 'r'], [5], { dict: 'のむ', type: 'verb', img: 'nomimasu.svg' });
  V('suimasu', 'すいます', '吸います', 'suimasu', 'สูบ (たばこをすいます = สูบบุหรี่)', 'verbs', ['c6'], [], { dict: 'すう', type: 'verb' });
  V('mimasu', 'みます', '見ます', 'mimasu', 'ดู', 'verbs', ['c6'], [7], { dict: 'みる', type: 'verb' });
  V('kikimasu', 'ききます', '聞きます', 'kikimasu', 'ฟัง', 'verbs', ['c6'], [], { dict: 'きく', type: 'verb' });
  V('yomimasu', 'よみます', '読みます', 'yomimasu', 'อ่าน', 'verbs', ['c6', 'r'], [5, 1], { dict: 'よむ', type: 'verb', img: 'yomimasu.png' });
  V('kakimasu', 'かきます', '書きます', 'kakimasu', 'เขียน', 'verbs', ['c6'], [], { dict: 'かく', type: 'verb' });
  V('kaimasu', 'かいます', '買います', 'kaimasu', 'ซื้อ', 'verbs', ['c6', 'r'], [5, 3], { dict: 'かう', type: 'verb', img: 'kaimasu.png' });
  V('torimasu', 'とります', null, 'torimasu', 'ถ่าย (しゃしんをとります = ถ่ายรูป)', 'verbs', ['c6'], [], { dict: 'とる', type: 'verb' });
  V('shimasu', 'します', null, 'shimasu', 'ทำ', 'verbs', ['c6', 'r'], [1, 6], { dict: 'する', type: 'verb' });
  V('aimasu', 'あいます', '会います', 'aimasu', 'พบ / เจอ (ใช้คู่กับ に: ともだちにあいます)', 'verbs', ['c6', 'r'], [5], { dict: 'あう', type: 'verb', img: 'aimasu.svg' });
  V('benkyoushimasu', 'べんきょうします', null, 'benkyō shimasu', 'เรียน', 'verbs', ['r'], [5, 6], { dict: 'べんきょうする', type: 'verb', img: 'benkyou.svg' });
  V('nemasu', 'ねます', null, 'nemasu', 'นอน', 'verbs', ['r'], [5], { dict: 'ねる', type: 'verb', img: 'nemasu.svg' });
  V('okimasu', 'おきます', null, 'okimasu', 'ตื่น', 'verbs', ['r'], [5, 6], { dict: 'おきる', type: 'verb', img: 'okimasu.svg' });
  V('owarimasu', 'おわります', null, 'owarimasu', 'เลิก / จบ / สิ้นสุด', 'verbs', ['r'], [1], { dict: 'おわる', type: 'verb' });
  V('iimasu', 'いいます', '言います', 'iimasu', 'พูด', 'verbs', ['c6'], [], { dict: 'いう', type: 'verb' });
  V('yasumimasu', 'やすみます', '休みます', 'yasumimasu', 'หยุด / พัก', 'verbs', ['c6'], [], { dict: 'やすむ', type: 'verb' });

  /* ---------- Noun + をします ---------- */
  V('shukudaiwoshimasu', 'しゅくだいをします', '宿題をします', 'shukudai o shimasu', 'ทำการบ้าน', 'verbs', ['c6', 'r'], [5], { dict: 'しゅくだいをする', type: 'verb', img: 'shukudai.png' });
  V('tenisuwoshimasu', 'テニスをします', null, 'tenisu o shimasu', 'เล่นเทนนิส', 'verbs', ['c6'], [], { type: 'verb' });
  V('sakkaawoshimasu', 'サッカーをします', null, 'sakkā o shimasu', 'เล่นฟุตบอล', 'verbs', ['c6'], [], { type: 'verb' });
  V('kaigiwoshimasu', 'かいぎをします', '会議をします', 'kaigi o shimasu', 'จัดประชุม', 'verbs', ['c6'], [], { type: 'verb' });
  V('denwawoshimasu', 'でんわをします', '電話をします', 'denwa o shimasu', 'โทรศัพท์ (กริยา)', 'verbs', ['c6'], [], { type: 'verb' });
  V('hanamiwoshimasu', '(お)はなみをします', 'お花見をします', '(o)hanami o shimasu', 'ชมดอกไม้', 'verbs', ['c6'], [], { type: 'verb', surf: ['おはなみをします'] });

  /* ---------- Food & drink (อาหารและเครื่องดื่ม) ---------- */
  V('gohan', 'ごはん', null, 'gohan', 'ข้าว', 'food', ['c6'], []);
  V('asagohan', 'あさごはん', '朝ごはん', 'asagohan', 'อาหารเช้า', 'food', ['c6'], [], { note: 'สไลด์หน้า 50 เขียนคำแปลผิดเป็น "หนังสือพิมพ์" — ความหมายที่ถูกคือ อาหารเช้า' });
  V('hirugohan', 'ひるごはん', '昼ごはん', 'hirugohan', 'อาหารกลางวัน', 'food', ['c6'], []);
  V('bangohan', 'ばんごはん', '晩ごはん', 'bangohan', 'อาหารเย็น', 'food', ['c6'], []);
  V('pan', 'パン', null, 'pan', 'ขนมปัง', 'food', ['c6', 'r'], [7]);
  V('tamago', 'たまご', '卵', 'tamago', 'ไข่', 'food', ['c6'], []);
  V('niku', 'にく', '肉', 'niku', 'เนื้อ', 'food', ['c6'], []);
  V('sakana', 'さかな', '魚', 'sakana', 'ปลา', 'food', ['c6'], []);
  V('yasai', 'やさい', '野菜', 'yasai', 'ผัก', 'food', ['c6'], []);
  V('kudamono', 'くだもの', '果物', 'kudamono', 'ผลไม้', 'food', ['c6'], []);
  V('mizu', 'みず', '水', 'mizu', 'น้ำ', 'food', ['c6'], []);
  V('ocha', 'おちゃ', 'お茶', 'ocha', 'ชา', 'food', ['c6'], []);
  V('koucha', 'こうちゃ', '紅茶', 'kōcha', 'ชาฝรั่ง', 'food', ['c6'], []);
  V('gyuunyuu', 'ぎゅうにゅう', '牛乳', 'gyūnyū', 'นม', 'food', ['c6'], [], { note: 'สไลด์เขียนโรมาจิว่า "kyuunyuu" — ที่ถูกต้องคือ gyūnyū (ぎ เสียง g)' });
  V('juusu', 'ジュース', null, 'jūsu', 'น้ำผลไม้', 'food', ['c6'], []);
  V('biiru', 'ビール', null, 'bīru', 'เบียร์', 'food', ['c6'], []);
  V('osake', '(お)さけ', 'お酒', '(o)sake', 'เหล้า', 'food', ['c6'], [], { surf: ['おさけ', 'さけ'] });
  V('koohii', 'コーヒー', null, 'kōhī', 'กาแฟ', 'food', ['c6'], [7]);

  /* ---------- Things & activities (สิ่งของ/กิจกรรม) ---------- */
  V('tegami', 'てがみ', '手紙', 'tegami', 'จดหมาย', 'things', ['c6'], []);
  V('repooto', 'レポート', null, 'repōto', 'รายงาน', 'things', ['c6'], []);
  V('shukudai', 'しゅくだい', '宿題', 'shukudai', 'การบ้าน', 'things', ['c6', 'r'], [5, 7]);
  V('hon', 'ほん', '本', 'hon', 'หนังสือ', 'things', ['c6', 'r'], [1]);
  V('nihongo', 'にほんご', '日本語', 'nihongo', 'ภาษาญี่ปุ่น', 'things', ['c6', 'r'], [6]);
  V('omiyage', 'おみやげ', null, 'omiyage', 'ของฝาก', 'things', ['c6'], [7]);
  V('eiga', 'えいが', '映画', 'eiga', 'ภาพยนตร์', 'things', ['c6', 'r'], [7]);
  V('bideo', 'ビデオ', null, 'bideo', 'วิดีโอ', 'things', ['c6'], []);
  V('tenisu', 'テニス', null, 'tenisu', 'เทนนิส', 'things', ['c6'], []);
  V('sakkaa', 'サッカー', null, 'sakkā', 'ฟุตบอล', 'things', ['c6'], []);
  V('kaigi', 'かいぎ', '会議', 'kaigi', 'การประชุม', 'things', ['c6'], []);
  V('denwa', 'でんわ', '電話', 'denwa', 'โทรศัพท์', 'things', ['c6'], []);
  V('shashin', 'しゃしん', '写真', 'shashin', 'รูปถ่าย', 'things', ['c6'], []);
  V('tabako', 'たばこ', null, 'tabako', 'บุหรี่', 'things', ['c6'], []);
  V('hanami', '(お)はなみ', 'お花見', '(o)hanami', 'การชมดอกไม้ (เทศกาลชมดอกไม้)', 'things', ['c6'], [], { surf: ['おはなみ', 'はなみ'] });
  V('kore', 'これ', null, 'kore', 'อันนี้', 'things', ['c6'], []);
  V('sore', 'それ', null, 'sore', 'อันนั้น', 'things', ['c6'], []);

  /* ---------- Derived: ます-form conjugations used for annotation ---------- */
  var FORMS = [
    ['ます', 'ปัจจุบัน/อนาคต บอกเล่า'],
    ['ません', 'ปัจจุบัน/อนาคต ปฏิเสธ'],
    ['ました', 'อดีต บอกเล่า'],
    ['ませんでした', 'อดีต ปฏิเสธ'],
    ['ませんか', 'ชักชวน (…ไหม)'],
    ['ましょう', 'ชักชวน (…กันเถอะ)']
  ];

  var byId = {};
  var surface = {};
  function addSurface(s, id, form) {
    if (!s || surface[s]) return;
    surface[s] = { id: id, form: form || null };
  }
  list.forEach(function (e, i) {
    e.order = i;
    byId[e.id] = e;
    addSurface(e.kana, e.id);
    addSurface(e.jp, e.id);
    (e.surf || []).forEach(function (s) { addSurface(s, e.id); });
    if (e.type === 'verb' && /ます$/.test(e.kana)) {
      var stems = [e.kana.slice(0, -2)];
      if (e.jp !== e.kana && /ます$/.test(e.jp)) stems.push(e.jp.slice(0, -2));
      stems.forEach(function (stem) {
        FORMS.forEach(function (f) { addSurface(stem + f[0], e.id, f[0] === 'ます' ? null : { ending: '～' + f[0], label: f[1] }); });
      });
    }
  });

  JF.vocab = list;
  JF.vocabById = byId;
  JF.vocabSurface = surface;
  JF.verbForms = FORMS;

  JF.vocabCategories = {
    question: 'คำแสดงคำถาม',
    particle: 'คำช่วย',
    time: 'เวลา',
    month: 'เดือน / วันที่',
    days: 'วันในสัปดาห์',
    timewords: 'คำบอกเวลา',
    numbers: 'ตัวเลข / ราคา',
    expr: 'สำนวน',
    places: 'สถานที่',
    transport: 'ยานพาหนะ',
    people: 'บุคคล',
    movement: 'กริยาการเคลื่อนที่',
    verbs: 'กริยาในชีวิตประจำวัน',
    food: 'อาหารและเครื่องดื่ม',
    things: 'สิ่งของ / กิจกรรม',
    other: 'คำอื่นๆ'
  };
  JF.sourceLabels = {
    r: 'เอกสารติวก่อนสอบ',
    c5: 'บทที่ 5',
    c6: 'บทที่ 6',
    sup: 'คำศัพท์เสริม'
  };
})();
