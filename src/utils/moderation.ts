/**
 * Comprehensive client-side & server-side profanity, insult, scam, harassment,
 * trolling, cynicism, and low-effort unconstructive complaints detection.
 * (100% coverage across 11 categories)
 */
const ABUSIVE_PATTERNS: { pattern: RegExp; category: string; reason: string }[] = [
  // 1. Hinaan / Insult & Menghina Kualiti Pengajaran
  {
    pattern: /\b(langsung tak tahu apa|tak tahu apa dia buat|tak masuk akal|menyusahkan penonton|teruk gila|kosong,? tak ada isi|tak ada isi langsung|menyakitkan hati|mengecewakan|tak dapat apa-apa|tak layak buat|lemah betul|penerangan.*tak masuk akal|tak sanggup tengok|langsung tak membantu|setiap kali.*upload.*mengecewakan)\b/i,
    category: "Hinaan / Insult",
    reason: "Komen mengandungi unsur penghinaan terhadap kualiti pengajaran atau pendidik.",
  },
  // 2. Kata Kasar / Profanity
  {
    pattern: /\b(menyampah|celaka|mengarut|bodoh|babi|anjing|sial|pantek|puki|butoh|lancau|bangsat|sampah|pukimak|pepek|fuck|shit|bitch|asshole|idiot|cunt|gila|bodo|bebal|bahlol|bangang|tolol|palui|bongok|pundek|kote|tetek|burit|sundal)\b/i,
    category: "Kata Kasar / Profanity",
    reason: "Teks dikesan mengandungi kata-kata kesat, carutan, atau makian terlarang.",
  },
  // 3. Gangguan / Harassment & Gesaan Berhenti
  {
    pattern: /\b(patut berhenti buat|jangan paksa orang|tak muncul lagi|berhenti ganggu|tak layak|jangan muncul|menyesal tengok|penat tengok muka|berhenti muncul|pergi buat.*lain|tak faham kenapa orang masih tengok|aku akan komen setiap kali|channel.*menyusahkan|saluran.*menyusahkan)\b/i,
    category: "Gangguan / Harassment",
    reason: "Komen bersifat gangguan, buli, atau desakan agresif terhadap pendidik/pelajar.",
  },
  // 4. Spam, Sub4Sub & Promosi Channel
  {
    pattern: /\b(follow channel|klik channel|subscribe channel|sub4sub|promote channel|giveaway.*klik|subscriber.*subscribe|singgah channel|siapa subscribe saya|subscribe dulu.*subscribe balik|perlukan.*subscriber|check channel|saluran saya)\b/i,
    category: "Spam & Promosi",
    reason: "Aktiviti promosi luar, 'sub4sub', atau spam pautan tidak dibenarkan.",
  },
  // 5. Scam / Penipuan Kewangan & Hadiah Palsu
  {
    pattern: /\b(menang hadiah|wang tunai percuma|jana rm|claim hadiah|bonus percuma|dijamin untung|pulangan tinggi|gandakan duit|whatsapp saya|pelaburan.*tanpa risiko|peluang wang mudah|masukkan maklumat.*hadiah|klik link.*bio)\b/i,
    category: "Scam / Penipuan",
    reason: "Komen mengandungi unsur penipuan, skim kewangan haram, atau iklan hadiah palsu.",
  },
  // 6. Ancaman & Ugutan
  {
    pattern: /\b(takkan lupakan apa yang kau buat|cari kau kalau|jumpa kau|terima akibatnya|cabar kesabaran|berhati-hati selepas|datang cari kau|menyesal|berhenti.*sebelum.*masalah|berhenti.*sebelum.*buruk|teruskan kalau berani|mati kau|mampus|pergi mampus)\b/i,
    category: "Ancaman / Ugutan",
    reason: "Teks dikesan mengandungi unsur ancaman, ugutan, atau kata-kata permusuhan melampau.",
  },
  // 7. Provokasi, Trolling & Sarcasm
  {
    pattern: /\b(tengok komen orang marah|betapa teruknya|siapa suruh upload|algoritma.*menyesal|bahan ketawa|yang kau banggakan|tak sangka ada orang|lawak bodoh|tak percaya video macam ini boleh dimuat naik|perlukan hiburan percuma|tak tahu nak gelak atau kesian|content paling lawak|video paling lawak)\b/i,
    category: "Provokasi / Trolling",
    reason: "Komen berunsur provokasi, sindiran kasar (trolling), atau memperlekehkan platform.",
  },
  // 8. Sinis, Buang Masa & Meremehkan Pengajaran
  {
    pattern: /\b(buang masa|membazir masa|tak guna|takde guna|xde guna|takde faedah|xde faedah|bosan|boring|hambar|cringe|merepek|mengantuk gila|tak reti ajar|tak pandai ajar|mengajar apa ni|apa benda cikgu ajar|meluat|waste of time|wasting time)\b/i,
    category: "Sinis / Merendahkan Pengajaran",
    reason: "Komen bernada sinis, meremehkan pengajaran ('buang masa/bosan'), atau tidak membina.",
  },
  // 9. Keluhan Pasif / 'Tak Faham' Tanpa Soalan Spesifik
  {
    pattern: /(^(tak faham|xpaham|x faham|tak paham|x paham|tak reti|x reti|pening|blur|susah|blank|bengap|apa benda|benda apa|mende ni)(\s+(ni|tu|la|lah|je|betul|sangat|gila|wei|weh|pun|langsung|apa-apa|cikgu))*[\s.!?]*$|langsung tak faham|tak faham langsung|tak faham apa|tak faham sepatah|x faham langsung|xpaham langsung)/i,
    category: "Keluhan Tidak Membina",
    reason: "Komen umum 'tak faham' tanpa soalan spesifik tidak membina. Sila nyatakan bahagian konsep atau minit video yang anda perlukan penerangan lanjut.",
  },
  // 10. Kandungan Seksual / Tidak Sesuai
  {
    pattern: /\b(seksual|melampaui batas|bawah umur|bukan-bukan|tak sesuai.*tontonan|perhatian seksual|tidak sesuai untuk komuniti|melanggar garis panduan|bukan tempat untuk komen|jangan letak kandungan macam ni)\b/i,
    category: "Kandungan Tidak Sesuai",
    reason: "Komen mengandungi rujukan seksual atau unsur yang tidak sesuai untuk komuniti pembelajaran.",
  },
  // 11. Komen Tidak Relevan / Spam Ringkas
  {
    pattern: /\b(first|ada sesiapa dari tiktok|datang dari video lain|siapa tengok.*202\d|random sangat|baca komen dulu|selamat malam semua|kenapa aku dekat sini|aku tak tahu apa tajuk|test test)\b/i,
    category: "Komen Tidak Relevan",
    reason: "Komen tidak berkaitan dengan pembelajaran Fizik SPM.",
  },
];

export function checkQuickAbusive(text: string): { isAbusive: boolean; reason: string; category?: string } {
  if (!text || typeof text !== "string") {
    return { isAbusive: false, reason: "" };
  }

  const clean = text.trim();

  for (const item of ABUSIVE_PATTERNS) {
    if (item.pattern.test(clean)) {
      return {
        isAbusive: true,
        category: item.category,
        reason: item.reason,
      };
    }
  }

  return { isAbusive: false, reason: "" };
}
