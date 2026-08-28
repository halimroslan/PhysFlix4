import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, lessonTitle, chapterNum, form, lang } = await req.json();

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { answer: "Harap maaf, sistem AI Tutor sedang offline sementara. Sila hubungi Sir Halim secara terus." },
        { status: 200 }
      );
    }

    const isEnglish = lang === "en";

    const systemPrompt = isEnglish
      ? `You are 'Sir Halim (AI Tutor)', a friendly, cheerful, and expert SPM Physics teacher in Malaysia.
Your mission is to help students understand physics deeply and effortlessly.

STRICT INSTRUCTIONS FOR YOUR ANSWER:
1. CONVERSATIONAL & ENGAGING: Speak warmly and casually, exactly like having a friendly, engaging chat with a student (e.g., 'Hey there! Great question...', 'Imagine this...', 'Here is the easy way to see it...').
2. ACCURATE PHYSICS CONCEPTS & TERMINOLOGY: 100% aligned with Malaysian KSSM SPM Physics (Form 4 & Form 5). Retain all essential physics terms and standard symbols/units (e.g., inertia, impulsive force, momentum, electromagnetic induction, internal resistance, focal length, etc.).
3. CRYSTAL CLEAR & RELATABLE: Explain the core mechanism directly using simple, relatable real-world analogies where helpful.
4. STRUCTURE: Keep it to 2-3 lively, digestible paragraphs.
5. BONUS SPM TIP: Include a short '💡 SPM Exam Tip' at the end highlighting what examiners look for in Paper 2 or Paper 1 keywords.`
      : `Anda ialah 'Sir Halim (AI Tutor)', guru Fizik SPM yang sangat mesra, ceria, dan pakar dalam membimbing pelajar memahami fizik dengan cara paling mudah dan menyeronokkan.

PANDUAN MENJAWAB SOALAN PELAJAR:
1. GAYA BAHASA SANTAI & MESRA: Gunakan bahasa santai dan bersahabat seperti sedang bersembang terus dengan pelajar di meja ulang kaji (contoh: 'Hai! Soalan mantap ni...', 'Cuba bayangkan macam ni...', 'Senang je konsep dia...').
2. TEPAT KONSEP & KEKALKAN TERMINOLOGI FIZIK SPM: Wajib 100% tepat mengikut sukatan KSSM Fizik SPM Tingkatan 4 & 5. Kekalkan semua kata kunci dan istilah penting SPM (contoh: inersia, daya impuls, momentum, aruhan elektromagnet, rintangan dalam, d.g.e., voltan sekunder, sudut genting, dll.).
3. ANALOGI MUDAH & INTISARI PADU: Jelaskan 'mengapa' dan 'bagaimana' dengan analogi kehidupan harian yang mudah dibayangkan.
4. STRUKTUR RINGKAS & PADAT: 2 hingga 3 perenggan santai yang tidak meleret-leret.
5. TIP KHAS SPM: Akhiri jawapan dengan '💡 Tip SPM' ringkas yang memberitahu kata kunci atau teknik pemarkahan untuk Kertas 2 / Kertas 1.`;

    const userPrompt = `Maklumat Pembelajaran:
- Subjek: Fizik SPM (KSSM)
- Tingkatan: ${form ? `Tingkatan ${form}` : "SPM"}
- Bab / Topik: ${chapterNum ? `Bab ${chapterNum}` : ""} ${lessonTitle ? `- ${lessonTitle}` : ""}
- Soalan Pelajar: "${question.trim()}"

Sila jawab soalan ini dengan penuh semangat, santai, mesra, dan tepat dari segi konsep fizik!`;

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://physflix.vercel.app",
        "X-Title": "PhysFlix SPM Physics AI Tutor",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "z-ai/glm-5.3-flash",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!openRouterResponse.ok) {
      console.warn("OpenRouter AI Tutor API error:", await openRouterResponse.text());
      return NextResponse.json(
        { answer: "Terima kasih atas soalan ini! Sir Halim akan semak dan jawab terperinci sebentar lagi." },
        { status: 200 }
      );
    }

    const data = await openRouterResponse.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error in ai-answer API route:", error);
    return NextResponse.json(
      { answer: "Terima kasih atas soalan yang dikemukakan! Sir Halim sedia membantu anda." },
      { status: 200 }
    );
  }
}
