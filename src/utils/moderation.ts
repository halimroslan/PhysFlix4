/**
 * Fast client-side and server-side heuristic profanity & abuse detection
 * (Malay, English, Manglish & Common Slang)
 */
const ABUSIVE_PATTERNS = [
  /\b(gila|gile|gilerr|mental|otak udang|gila babi)\b/i,
  /\b(bodoh|bodo|bodoh gila|bebal|bahlol|bengap|bangang|tolol|palui|bongok|pundek)\b/i,
  /\b(babi|anjing|anjir|babi hutan|anjing betina|sial|celaka|kepala bapak|pukimak|pantek|pepek|puki|butoh|lancau|buto|kote|tetek|burit|sundal|pelacur|pelacoran)\b/i,
  /\b(fuck|fucking|fucker|shit|bullshit|bitch|asshole|bastard|dick|cunt|pussy|slut|whore|retard|idiot|moron|stupid)\b/i,
  /\b(sampah|tak guna|penipu|scammer|bodoh tahap gaban|mati kau|mampus|pergi mampus)\b/i,
  /\b(gila ke cikgu|cikgu gila|cikgu bodoh|cikgu sampah|cikgu sial)\b/i
];

export function checkQuickAbusive(text: string): { isAbusive: boolean; reason: string } {
  if (!text || typeof text !== "string") {
    return { isAbusive: false, reason: "" };
  }

  const clean = text.trim();

  for (const pattern of ABUSIVE_PATTERNS) {
    if (pattern.test(clean)) {
      return {
        isAbusive: true,
        reason: "Teks dikesan mengandungi perkataan yang tidak sopan, kasar, atau menghina. Sila gunakan bahasa yang berhemah dalam ruang pembelajaran Fizik.",
      };
    }
  }

  return { isAbusive: false, reason: "" };
}
