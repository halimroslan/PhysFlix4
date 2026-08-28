/**
 * Comprehensive client-side & server-side profanity, insult, and cynicism detection
 * (Malay, English, Manglish & Common Slang)
 */
const ABUSIVE_PATTERNS: { pattern: RegExp; reason: string }[] = [
  {
    pattern: /\b(buang masa|membazir masa|buang masa je|buang masa betul|membazir masa je|waste of time|wasting time|waste time)\b/i,
    reason: "Komen berunsur memperlekehkan pengajaran ('buang masa') tidak dibenarkan dalam ruang pembelajaran.",
  },
  {
    pattern: /\b(tak guna|x guna|takde guna|xde guna|takde faedah|xde faedah|useless|pointless)\b/i,
    reason: "Komen bernada sinis dan tidak membina ('tak guna') tidak dibenarkan.",
  },
  {
    pattern: /\b(bosan|bosan gila|boring|boring gila|mengantuk gila|hambar|cringe|merepek|mengarut|sampah)\b/i,
    reason: "Komen bersifat memperlekeh atau menghina kualiti pengajaran tidak dibenarkan.",
  },
  {
    pattern: /\b(mengajar apa ni|ajar apa ni|apa benda cikgu ajar|tak reti ajar|tak pandai ajar|tak faham langsung apa benda)\b/i,
    reason: "Komen bernada tidak menghormati guru dikesan. Sila kemukakan soalan bahagian yang anda ingin pencerahan dengan sopan.",
  },
  {
    pattern: /\b(menyampah|meluat|benci cikgu|menyampah gila)\b/i,
    reason: "Komen mengandungi unsur kebencian atau permusuhan peribadi.",
  },
  {
    pattern: /\b(gila|gile|gilerr|mental|otak udang|gila babi|gila ke cikgu|cikgu gila)\b/i,
    reason: "Teks dikesan mengandungi perkataan kasar/menghina ('gila').",
  },
  {
    pattern: /\b(bodoh|bodo|bodoh gila|bebal|bahlol|bengap|bangang|tolol|palui|bongok|pundek|cikgu bodoh)\b/i,
    reason: "Teks dikesan mengandungi kata-kata makian atau penghinaan ('bodoh').",
  },
  {
    pattern: /\b(babi|anjing|anjir|babi hutan|anjing betina|sial|celaka|kepala bapak|pukimak|pantek|pepek|puki|butoh|lancau|buto|kote|tetek|burit|sundal|pelacur|pelacoran|cikgu sial|cikgu sampah)\b/i,
    reason: "Teks dikesan mengandungi kata-kata kesat, lucah, atau carutan terlarang.",
  },
  {
    pattern: /\b(fuck|fucking|fucker|shit|bullshit|bitch|asshole|bastard|dick|cunt|pussy|slut|whore|retard|idiot|moron|stupid)\b/i,
    reason: "Text contains vulgar or abusive English profanity.",
  },
  {
    pattern: /\b(mati kau|mampus|pergi mampus|mati la kau)\b/i,
    reason: "Teks dikesan mengandungi unsur ancaman atau doa keburukan.",
  },
];

export function checkQuickAbusive(text: string): { isAbusive: boolean; reason: string } {
  if (!text || typeof text !== "string") {
    return { isAbusive: false, reason: "" };
  }

  const clean = text.trim();

  for (const item of ABUSIVE_PATTERNS) {
    if (item.pattern.test(clean)) {
      return {
        isAbusive: true,
        reason: item.reason,
      };
    }
  }

  return { isAbusive: false, reason: "" };
}
