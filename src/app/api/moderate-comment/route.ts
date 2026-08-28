import { NextRequest, NextResponse } from "next/server";
import { checkQuickAbusive } from "@/utils/moderation";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const trimmed = text.trim();

    // 1. Instant heuristic profanity & insult check
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

    const prompt = `You are an AI content moderator for an educational SPM physics learning platform (PhysFlix).
Analyze the following user-submitted question, comment, or reply for:
1. Abusive, profane, vulgar, insulting, or toxic language (in Malay, English, Manglish, or local slang).
2. Sarcastic, mocking, disrespectful, or derogatory attacks against teachers or students (e.g., 'gila ke cikgu ni', 'cikgu bodoh', 'lawak bodoh', 'buang masa').
3. Bullying, personal attacks, hate speech, or harassment.
4. Sexually explicit, obscene, or inappropriate content.
5. Malicious spam, scams, or non-educational advertising.

If the text contains ANY abusive, insulting, disrespectful, or prohibited content, return strictly valid JSON:
{
  "isAbusive": true,
  "reason": "Penerangan ringkas dalam Bahasa Melayu mengapa soalan/komen ini disekat (contoh: Komen mengandungi kata-kata menghina guru)"
}

If the text is polite, constructive, a genuine physics/study question, a greeting, or helpful discussion, return strictly valid JSON:
{
  "isAbusive": false,
  "reason": ""
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
