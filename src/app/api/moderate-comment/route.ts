import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY is not configured, passing moderation by default");
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const prompt = `You are an AI content moderator for an educational physics platform (PhysFlix SPM).
Analyze the following user-submitted question/comment/reply for:
1. Abusive, profane, vulgar, insulting, or toxic language (in Malay, English, Manglish, or local slang).
2. Bullying, personal attacks, hate speech, or harassment.
3. Sexually explicit, obscene, or inappropriate content.
4. Malicious spam, scams, or non-educational advertising.

If the text contains abusive or prohibited content, return strictly valid JSON:
{
  "isAbusive": true,
  "reason": "Penerangan ringkas dalam Bahasa Melayu mengapa soalan/komen ini disekat"
}

If the text is polite, constructive, a genuine physics/study question, a greeting, or helpful discussion, return strictly valid JSON:
{
  "isAbusive": false,
  "reason": ""
}

Teks untuk disemak:
"""${text.trim()}"""`;

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
      console.warn("OpenRouter API error, falling back to clean text assumption", await openRouterResponse.text());
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
      // If parsing fails but words like isAbusive: true appear
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
