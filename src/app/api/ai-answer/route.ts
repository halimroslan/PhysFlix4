import { NextRequest, NextResponse } from "next/server";

// Helper to detect if a student's query is in English / DLP or asks for English
function isEnglishQuery(question: string, langSetting?: string): boolean {
  if (langSetting === "en") return true;
  if (!question) return false;
  const q = question.toLowerCase();

  // Explicit request for English or DLP
  if (/\b(in english|dlp|answer in english|english please|speak english)\b/i.test(q)) {
    return true;
  }

  // English indicator words
  const enMatches = q.match(
    /\b(the|is|are|was|were|what|why|how|when|where|which|who|if|i|you|u|can|could|would|should|do|does|did|in|on|at|of|to|for|with|from|by|about|because|bcoz|so|and|but|or|mirror|image|concave|convex|focal|focus|distance|speed|velocity|acceleration|force|energy|work|power|pressure|density|temperature|heat|current|voltage|resistance|wave|light|refraction|reflection|lens|magnet|ray|diagram|formula|calculate|explain|difference)\b/gi
  );
  const enWords = enMatches ? enMatches.length : 0;

  // Malay indicator words
  const bmMatches = q.match(
    /\b(dan|yang|di|ke|dari|daripada|untuk|dengan|pada|adalah|iaitu|ini|itu|kenapa|mengapa|bagaimana|macam|mcm|apa|bila|kat|tak|x|tidak|boleh|ke|pn|pun|dah|sudah|akan|saya|awak|kau|kite|kita|cikgu|sir|soalan|jawapan|cermin|cekung|cembung|pantulan|pembiasan|imej|maya|nyata|songsang|tegak|daya|haba|arus|voltan|rintangan|halaju|pecutan|fokus|ketumpatan|tekanan|terangkan|beza|faham|terima|kasih)\b/gi
  );
  const bmWords = bmMatches ? bmMatches.length : 0;

  return enWords > bmWords && enWords >= 3;
}

// Helper for direct Google Gemini API call if key is configured
async function callDirectGeminiAnswer(
  apiKey: string,
  systemPrompt: string,
  userPrompt: string
): Promise<string | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 1800,
        },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (e) {
    console.warn("Direct Gemini answer generation failed:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { question, lessonTitle, lessonTitleBm, lessonTitleDlp, chapterNum, form, lang } = await req.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    // Prioritize OPENROUTER_API_KEY3 and OPENROUTER_BACKUP_API_KEY3
    const openRouterKeys = [
      process.env.OPENROUTER_API_KEY3,
      process.env.OPENROUTER_BACKUP_API_KEY3,
      process.env.OPENROUTER_API_KEY,
      process.env.OPENROUTER_BACKUP_API_KEY,
    ].filter(Boolean) as string[];

    const uniqueOpenRouterKeys = Array.from(new Set(openRouterKeys));
    const geminiDirectKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    const isEnglish = isEnglishQuery(question, lang);

    const systemPrompt = isEnglish
      ? `You are 'Sir Halim (AI Tutor - Powered by Ox Alpha & Gemini)', a friendly, casual, and expert SPM Physics teacher in Malaysia.

MALAYSIAN STYLE ENGLISH & FORMATTING RULES (STRICT):
1. LANGUAGE STYLE: Use natural Malaysian style English (casual, warm, Malaysian DLP teacher style).
2. NATURAL OPENINGS: Start naturally and warmly (e.g. "Wah, great observation! This is...", "Good question! When u...", "Interesting question lah! As u...", "Haha, this is classic..."). NEVER awkwardly attach 'u' to compliments or praise (DO NOT say "great observation u" or "good question u").
3. ADDRESSING THE STUDENT: Use 'u' naturally in sentences as subject/object (e.g. "When u stand beyond F...", "As u walk closer...", "That is why u see...", "Let me explain to u..."). NEVER use 'awak' and avoid stiff/formal 'you'.
4. MALAYSIAN SLANG PARTICLES: Naturally sprinkle colloquial particles like 'lah', 'kan', 'lor', 'right?' so the explanation sounds less formal, friendly, and relatable (e.g. "This is classic concave mirror behaviour lah!", "It flips to virtual and upright, kan?", "So it is not magic lah, u simply crossed the focal point!"). Keep it natural, readable, and encouraging.
5. ACCURATE SPM PHYSICS CONCEPTS & TERMINOLOGY: 100% scientifically accurate with Malaysian SPM Physics (KSSM / DLP) terminology (e.g. principal focus, focal length, center of curvature, real image, virtual image, inverted, upright, magnified, diminished, converging, diverging, refraction, total internal reflection, inertia, etc.).
6. NO ASTERISKS OR BOLD: DO NOT USE ANY ASTERISKS '*' OR BOLD '**' AT ALL. Write clean plain text only.
7. NO EM DASHES: DO NOT USE EM DASHES '—' OR HYPHENS '-' AS DASHES. Use commas or periods.
8. SHORT & CRISP: 1 to 2 short paragraphs max, fast and straight to the point.
9. COMPLETE THE ANSWER FULLY: Never stop mid-sentence. Always finish the thought completely with a full stop (.).`
      : `Anda ialah 'Sir Halim (AI Tutor - Dikuasakan oleh Ox Alpha & Gemini)', guru Fizik SPM yang sangat mesra, sempoi, dan berwibawa.

SYARAT FORMAT & GAYA JAWAPAN (SANGAT KETAT):
1. JANGAN GUNA SEBARANG SIMBOL ASTERISK '*' ATAU BOLD '**' LANGSUNG. Tulis teks biasa yang bersih sahaja.
2. JANGAN GUNA SIMBOL EM DASH '—' ATAU SEMPANG '-' UNTUK MENJELASKAN AYAT. Guna koma atau noktah biasa.
3. JANGAN SESEKALI GUNA PERKATAAN 'kau' ATAU 'engkau'. Sentiasa gantikan dengan 'awak' atau 'adik-adik' atau 'kita' bila berinteraksi dengan pelajar.
4. GUNAKAN SHORT FORMS BAHASA MELAYU YANG SANTAI & NATURAL spt: 'mcm', 'pn', 'spt', 'byk', 'nape', 'kat', 'diorang', 'tu', 'ni', 'drpd', 'utk', 'dgn', 'x' supaya nampak betul2 natural spt cikgu sedang bersembang santai di chat.
5. JAWAPAN MESTILAH RINGKAS & PADAT: 1 hingga 2 perenggan pendek sahaja, tidak meleret-leret, dan terus kepada inti pati jawapan.
6. PASTIKAN AYAT LENGKAP SEPENUHNYA HINGGA NOKTAH TERAKHIR (.), JANGAN SESEKALI TERGANTUNG ATAU TERPOTONG DI TENGAH JALAN.
7. TEPAT KONSEP & KEKALKAN TERMINOLOGI FIZIK SPM: Kekalkan istilah rasmi Fizik SPM yang betul (spt inersia, momentum, pembiasan, pantulan dalam penuh, serakan, prinsip superposisi, rintangan dalam, d.g.e., dll.) dalam ejaan biasa tanpa bold.`;

    const effectiveLessonTitle = isEnglish
      ? (lessonTitleDlp || lessonTitle || "")
      : (lessonTitleBm || lessonTitle || "");

    const userPrompt = isEnglish
      ? `Learning Context:
- Subject: SPM Physics (KSSM / DLP)
- Form: ${form ? `Form ${form}` : "SPM"}
- Chapter / Topic: ${chapterNum ? `Chapter ${chapterNum}` : ""} ${effectiveLessonTitle ? `- ${effectiveLessonTitle}` : ""}
- Student Question: "${question.trim()}"

Please answer this question completely in 1-2 short paragraphs using natural Malaysian style English (casual & friendly, natural opening, use 'u' naturally in sentences, subtle Malaysian particles like 'lah' and 'kan', NEVER say 'great observation u' or 'good question u', NEVER use 'awak'). Ensure 100% accurate SPM Physics DLP terminology. Clean plain text without asterisks * or em dashes —, ending completely with a full stop (.):`
      : `Maklumat Pembelajaran:
- Subjek: Fizik SPM (KSSM)
- Tingkatan: ${form ? `Tingkatan ${form}` : "SPM"}
- Bab / Topik: ${chapterNum ? `Bab ${chapterNum}` : ""} ${effectiveLessonTitle ? `- ${effectiveLessonTitle}` : ""}
- Soalan Pelajar: "${question.trim()}"

Sila jawab soalan ini dengan lengkap (1-2 perenggan), santai guna short forms dan panggil pelajar sebagai 'awak' (bukan kau), tanpa sebarang simbol * atau em dash —, dan pastikan ayat dihabiskan sepenuhnya dengan titik (.):`;

    let rawAnswer = "";

    // Multi-tier Fallback Models:
    // Tier 1: Ox Alpha (z-ai/glm-5.3-flash)
    // Tier 2: Google Gemini 2.5 Flash on OpenRouter (ultra fast 700ms)
    // Tier 3: Google Gemini 2.5 Flash Lite on OpenRouter
    const fallbackModels = [
      "z-ai/glm-5.3-flash",
      "google/gemini-2.5-flash",
      "google/gemini-2.5-flash-lite",
    ];

    for (const model of fallbackModels) {
      for (const key of uniqueOpenRouterKeys) {
        try {
          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${key}`,
              "HTTP-Referer": "https://physflix.vercel.app",
              "X-Title": `PhysFlix SPM Physics AI Tutor (${model})`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              max_tokens: 1800,
              temperature: 0.6,
              ...(model.includes("glm") ? { reasoning: { max_tokens: 120 } } : {}),
            }),
            signal: AbortSignal.timeout(9000),
          });

          if (response.ok) {
            const data = await response.json();
            rawAnswer = data.choices?.[0]?.message?.content?.trim() || "";
            if (rawAnswer) break;
          } else {
            console.warn(`Model ${model} with key failed (status ${response.status}), trying next fallback...`);
          }
        } catch (e) {
          console.warn(`Request failed for model ${model}, trying next fallback...`, e);
        }
      }
      if (rawAnswer) break;
    }

    // Tier 4: Direct Google Gemini API (if key configured)
    if (!rawAnswer && geminiDirectKey) {
      rawAnswer = (await callDirectGeminiAnswer(geminiDirectKey, systemPrompt, userPrompt)) || "";
    }

    if (!rawAnswer) {
      return NextResponse.json(
        {
          answer: isEnglish
            ? "Thanks for asking u! Sir Halim will review and help explain this in detail shortly."
            : "Terima kasih atas soalan ni! Sir Halim akan semak dan bantu jawab terperinci sebentar lagi.",
        },
        { status: 200 }
      );
    }

    // Post-processing safety sanitization:
    // 1. Strip any stray asterisks, markdown, and em dashes
    let cleanAnswer = rawAnswer
      .replace(/[*_#`~]+/g, "")
      .replace(/—/g, ", ")
      .replace(/\s+-\s+/g, ", ");

    if (isEnglish) {
      // In English replies:
      // Clean awkward appended 'u' to praise/compliments
      cleanAnswer = cleanAnswer
        .replace(/\b(great observation|good question|nice question|interesting question)\s+u([,\s!])/gi, "$1! ")
        .replace(/\bAwak\b/g, "U")
        .replace(/\bawak\b/g, "u")
        .replace(/\bEngkau\b/g, "U")
        .replace(/\bengkau\b/g, "u")
        .replace(/\bKau\b/g, "U")
        .replace(/\bkau\b/g, "u")
        .replace(/\bYou\b/g, "U")
        .replace(/\byou\b/g, "u");
    } else {
      // In Malay replies:
      // Automatically replace all instances of 'kau'/'engkau' with 'awak'
      cleanAnswer = cleanAnswer
        .replace(/\bEngkau\b/g, "Awak")
        .replace(/\bengkau\b/g, "awak")
        .replace(/\bKau\b/g, "Awak")
        .replace(/\bkau\b/g, "awak");
    }

    cleanAnswer = cleanAnswer.trim();

    return NextResponse.json({ answer: cleanAnswer });
  } catch (error) {
    console.error("Error in ai-answer API route:", error);
    return NextResponse.json(
      { answer: "Terima kasih atas soalan yg dikemukakan! Sir Halim sedia membantu anda." },
      { status: 200 }
    );
  }
}
