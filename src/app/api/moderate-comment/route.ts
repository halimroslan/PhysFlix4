import { NextRequest, NextResponse } from "next/server";
import { checkQuickAbusive } from "@/utils/moderation";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const trimmed = text.trim();

    // 1. Instant 0ms heuristic profanity, insult, scam & cynicism check (11 categories)
    const quickCheck = checkQuickAbusive(trimmed);
    if (quickCheck.isAbusive) {
      return NextResponse.json({
        isAbusive: true,
        category: quickCheck.category,
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

STRICTLY BLOCK (isAbusive: true) if the text matches ANY of these abusive/negative categories:
1. Hinaan / Insult: Criticizing or insulting the teacher, voice, presentation, or calling the content useless, terrible, or senseless (e.g., 'penerangan tak masuk akal', 'teruk gila', 'langsung tak tahu apa buat', 'kualiti mengecewakan').
2. Kata Kasar / Profanity: Any vulgarity, profanity, or rude swearing words (e.g., 'bodoh', 'babi', 'sial', 'pantek', 'puki', 'butoh', 'lancau', 'fuck', 'shit', 'bitch').
3. Gangguan / Harassment: Demanding the creator stop, telling them not to appear on feed, or repetitive harassment (e.g., 'patut berhenti buat video', 'tak layak', 'jangan muncul lagi').
4. Spam & Self-Promotion: Promoting external channels, asking for subscribers/sub4sub, or spamming (e.g., 'follow channel saya', 'sub4sub', 'klik channel saya').
5. Scam / Penipuan: Promises of free money, fake giveaways, WhatsApp links, or get-rich-quick schemes (e.g., 'jana RM1000', 'menang hadiah', 'pelaburan tanpa risiko').
6. Ancaman / Ugutan: Threats, hostility, or wishes of harm (e.g., 'aku cari kau', 'kau akan menyesal', 'jangan cabar kesabaran').
7. Provokasi / Trolling: Sarcastic mocking, saying the video is a laughing stock, or malicious trolling (e.g., 'tengok komen orang marah', 'bahan ketawa', 'algoritma menyesal').
8. Sinis & Buang Masa: Dismissive, cynical, or unconstructive complaints (e.g., 'buang masa', 'membazir masa', 'tak guna', 'bosan gila', 'hambar', 'merepek', 'cringe').
9. Keluhan Pasif Tanpa Soalan: Vague complaints with no specific question (e.g., 'tak faham', 'tak faham langsung', 'pening', 'blur gila', 'susah betul').
10. Kandungan Seksual / Tidak Sesuai: Any sexual innuendo, inappropriate comments, or violation of student-safe guidelines.
11. Komen Tidak Relevan: Random noise, 'first', or off-topic chat unrelated to physics learning.

ALLOW (isAbusive: false) ONLY IF:
- The text is a genuine, specific physics question, educational inquiry, polite request for clarification, constructive doubt, or polite greeting/thank you.

Return strictly valid JSON only:
{
  "isAbusive": true | false,
  "reason": "Penerangan ringkas dalam Bahasa Melayu jika disekat"
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
