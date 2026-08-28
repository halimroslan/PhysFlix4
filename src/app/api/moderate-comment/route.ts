import { NextRequest, NextResponse } from "next/server";
import { checkQuickAbusive } from "@/utils/moderation";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const trimmed = text.trim();

    // 1. Instant heuristic profanity, insult & cynicism check
    const quickCheck = checkQuickAbusive(trimmed);
    if (quickCheck.isAbusive) {
      return NextResponse.json({
        isAbusive: true,
        reason: quickCheck.reason,
      });
    }

    // 2. Ox Alpha AI Deep Contextual Moderation via OpenRouter
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY is not configured in env, passing moderation by default");
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const prompt = `You are a strict AI content moderation guardian for PhysFlix, a professional SPM Physics learning platform.
Your duty is to enforce a high standard of respect, constructive discourse, and academic decorum.

STRICTLY BLOCK (isAbusive: true) if the text contains:
1. Vulgarity, profanity, insults, abusive language, or harassment (in Malay, English, slang, or Manglish).
2. Cynical, derogatory, dismissive, or mocking remarks aimed at disparaging the teacher, lesson, or platform (e.g., "buang masa", "membazir masa", "tak guna", "bosan gila", "merepek", "hambar", "menyampah", "mengajar apa ni", "cringe").
3. Non-educational trolling, personal attacks, or spam.

ALLOW (isAbusive: false) ONLY IF:
- The text is a genuine physics question, educational inquiry, polite request for clarification, constructive doubt, or polite greeting/thank you.

Return strictly valid JSON only:
{
  "isAbusive": true | false,
  "reason": "Penerangan ringkas dalam Bahasa Melayu jika disekat (contoh: Komen berunsur memperlekehkan pengajaran/buang masa tidak dibenarkan)"
}

Teks untuk disemak:
"""${trimmed}"""`;

    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://physflix.vercel.app",
        "X-Title": "PhysFlix SPM Physics AI Moderator",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "z-ai/glm-5.3-flash",
        messages: [
          {
            role: "system",
            content: "You are a strict, helpful AI content moderator for an educational SPM physics platform. Always respond in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.1,
      }),
    });

    if (!openRouterResponse.ok) {
      console.warn("OpenRouter API error:", await openRouterResponse.text());
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const data = await openRouterResponse.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    try {
      const parsed = JSON.parse(content);
      return NextResponse.json({
        isAbusive: Boolean(parsed.isAbusive),
        reason: parsed.reason || "",
      });
    } catch {
      const isAbusive = content.toLowerCase().includes('"isabusive": true') || content.toLowerCase().includes('"isabusive":true');
      return NextResponse.json({
        isAbusive,
        reason: isAbusive ? "Kandungan dikesan mengandungi perkataan atau unsur yang tidak sopan." : "",
      });
    }
  } catch (error) {
    console.error("Error in moderate-comment API route:", error);
    return NextResponse.json({ isAbusive: false, reason: "" }, { status: 200 });
  }
}
