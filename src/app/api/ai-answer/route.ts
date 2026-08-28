import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, lessonTitle, chapterNum, form, lang } = await req.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKeys = [
      process.env.OPENROUTER_API_KEY,
      process.env.OPENROUTER_BACKUP_API_KEY,
    ].filter(Boolean) as string[];

    const uniqueKeys = Array.from(new Set(apiKeys));

    if (uniqueKeys.length === 0) {
      return NextResponse.json(
        { answer: "Harap maaf, sistem AI Tutor sedang offline sementara. Sila hubungi Sir Halim secara terus." },
        { status: 200 }
      );
    }

    const isEnglish = lang === "en";

    const systemPrompt = isEnglish
      ? `You are 'Sir Halim (AI Tutor - Powered by Ox Alpha)', a friendly, casual, and expert SPM Physics teacher in Malaysia.

STRICT FORMATTING & STYLE RULES:
1. DO NOT USE ANY ASTERISKS '*' OR BOLD '**' AT ALL. Write clean plain text only.
2. DO NOT USE EM DASHES '—' OR HYPHENS '-' AS DASHES. Use commas or periods.
3. CONVERSATIONAL & NATURAL: Speak warmly like chatting in a study group. Always address the student politely as 'you' / 'we'.
4. SHORT & CRISP: 1 to 2 short paragraphs max, fast and straight to the point.
5. COMPLETE THE ANSWER FULLY: Never stop mid-sentence. Always conclude with a full stop (.).
6. ACCURATE PHYSICS CONCEPTS: 100% accurate with Malaysian SPM Physics terminology.`
      : `Anda ialah 'Sir Halim (AI Tutor - Dikuasakan oleh Ox Alpha)', guru Fizik SPM yang sangat mesra, sempoi, dan berwibawa.

SYARAT FORMAT & GAYA JAWAPAN (SANGAT KETAT):
1. JANGAN GUNA SEBARANG SIMBOL ASTERISK '*' ATAU BOLD '**' LANGSUNG. Tulis teks biasa yang bersih sahaja.
2. JANGAN GUNA SIMBOL EM DASH '—' ATAU SEMPANG '-' UNTUK MENJELASKAN AYAT. Guna koma atau noktah biasa.
3. JANGAN SESEKALI GUNA PERKATAAN 'kau' ATAU 'engkau'. Sentiasa gantikan dengan 'awak' atau 'adik-adik' atau 'kita' bila berinteraksi dengan pelajar.
4. GUNAKAN SHORT FORMS BAHASA MELAYU YANG SANTAI & NATURAL spt: 'mcm', 'pn', 'spt', 'byk', 'nape', 'kat', 'diorang', 'tu', 'ni', 'drpd', 'utk', 'dgn', 'x' supaya nampak betul2 natural spt cikgu sedang bersembang santai di chat.
5. JAWAPAN MESTILAH RINGKAS & PADAT: 1 hingga 2 perenggan pendek sahaja, tidak meleret-leret, dan terus kepada inti pati jawapan.
6. PASTIKAN AYAT LENGKAP SEPENUHNYA HINGGA NOKTAH TERAKHIR (.), JANGAN SESEKALI TERGANTUNG ATAU TERPOTONG DI TENGAH JALAN.
7. TEPAT KONSEP & KEKALKAN TERMINOLOGI FIZIK SPM: Kekalkan istilah rasmi Fizik SPM yang betul (spt inersia, momentum, pembiasan, pantulan dalam penuh, serakan, prinsip superposisi, rintangan dalam, d.g.e., dll.) dalam ejaan biasa tanpa bold.`;

    const userPrompt = `Maklumat Pembelajaran:
- Subjek: Fizik SPM (KSSM)
- Tingkatan: ${form ? `Tingkatan ${form}` : "SPM"}
- Bab / Topik: ${chapterNum ? `Bab ${chapterNum}` : ""} ${lessonTitle ? `- ${lessonTitle}` : ""}
- Soalan Pelajar: "${question.trim()}"

Sila jawab soalan ini dengan lengkap (1-2 perenggan), santai guna short forms dan panggil pelajar sebagai 'awak' (bukan kau), tanpa sebarang simbol * atau em dash —, dan pastikan ayat dihabiskan sepenuhnya dengan titik (.):`;

    let rawAnswer = "";

    // Primary and Backup API Key iteration on Ox Alpha (z-ai/glm-5.3-flash)
    for (const key of uniqueKeys) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${key}`,
            "HTTP-Referer": "https://physflix.vercel.app",
            "X-Title": "PhysFlix SPM Physics AI Tutor (Ox Alpha)",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "z-ai/glm-5.3-flash",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            max_tokens: 1800,
            temperature: 0.6,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          rawAnswer = data.choices?.[0]?.message?.content?.trim() || "";
          if (rawAnswer) break;
        } else {
          console.warn(`OpenRouter AI answer with key failed (status ${response.status}), trying backup key...`);
        }
      } catch (e) {
        console.warn(`Model request failed on key, falling back...`, e);
      }
    }

    if (!rawAnswer) {
      return NextResponse.json(
        { answer: "Terima kasih atas soalan ni! Sir Halim akan semak dan bantu jawab terperinci sebentar lagi." },
        { status: 200 }
      );
    }

    // Post-processing safety sanitization:
    // 1. Strip any stray asterisks, markdown, and em dashes
    // 2. Automatically replace all instances of 'kau'/'engkau' with 'awak'
    let cleanAnswer = rawAnswer
      .replace(/[*_#`~]+/g, "")
      .replace(/—/g, ", ")
      .replace(/\s+-\s+/g, ", ")
      .replace(/\bEngkau\b/g, "Awak")
      .replace(/\bengkau\b/g, "awak")
      .replace(/\bKau\b/g, "Awak")
      .replace(/\bkau\b/g, "awak")
      .trim();

    return NextResponse.json({ answer: cleanAnswer });
  } catch (error) {
    console.error("Error in ai-answer API route:", error);
    return NextResponse.json(
      { answer: "Terima kasih atas soalan yg dikemukakan! Sir Halim sedia membantu anda." },
      { status: 200 }
    );
  }
}
