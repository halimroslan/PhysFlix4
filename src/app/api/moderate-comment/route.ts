import { NextRequest, NextResponse } from "next/server";
import { checkQuickAbusive } from "@/utils/moderation";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const trimmed = text.trim();

    // 1. Instant 0ms heuristic profanity, insult, scam & cynicism check (12 categories)
    const quickCheck = checkQuickAbusive(trimmed);
    if (quickCheck.isAbusive) {
      return NextResponse.json({
        isAbusive: true,
        category: quickCheck.category,
        reason: quickCheck.reason,
      });
    }

    // 2. AI Deep Contextual Moderation via Ox Alpha (OpenRouter)
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.warn("OPENROUTER_API_KEY is not configured in env, passing moderation by default");
      return NextResponse.json({ isAbusive: false, reason: "" });
    }

    const prompt = `You are a strict AI content moderation guardian for PhysFlix, a professional SPM Physics learning platform.
Your duty is to enforce a high standard of respect, constructive discourse, and academic decorum.

STRICTLY BLOCK (isAbusive: true) if the text matches ANY of these abusive/negative categories:
1. Meremehkan / Slanga Menghina: Dismissive slang, claiming nonsense or uselessness (e.g., 'ntah apa2', 'entah apa apa', 'ntah pape', 'merapu', 'mengarut', 'hauk', 'cringe', 'poyo', 'sembang kari', 'acah pandai').
2. Hinaan / Insult: Criticizing or insulting the teacher, voice, presentation, or calling the content useless or terrible (e.g., 'penerangan tak masuk akal', 'teruk gila', 'langsung tak tahu apa buat', 'kualiti mengecewakan').
3. Kata Kasar / Profanity: Any vulgarity, profanity, abusive terms, or rude swearing words (e.g., 'tavis', 'bodoh', 'babi', 'sial', 'pantek', 'puki', 'butoh', 'lancau', 'fuck', 'shit', 'bitch').
4. Gangguan / Harassment: Demanding the creator stop, telling them not to appear on feed, or repetitive harassment (e.g., 'patut berhenti buat video', 'tak layak', 'jangan muncul lagi').
5. Spam & Self-Promotion: Promoting external channels, asking for subscribers/sub4sub, or spamming (e.g., 'follow channel saya', 'sub4sub', 'klik channel saya').
6. Scam / Penipuan: Promises of free money, fake giveaways, WhatsApp links, or get-rich-quick schemes (e.g., 'jana RM1000', 'menang hadiah', 'pelaburan tanpa risiko').
7. Ancaman / Ugutan: Threats, hostility, or wishes of harm (e.g., 'aku cari kau', 'kau akan menyesal', 'jangan cabar kesabaran').
8. Provokasi / Trolling: Sarcastic mocking, saying the video is a laughing stock, or malicious trolling (e.g., 'tengok komen orang marah', 'bahan ketawa', 'algoritma menyesal').
9. Sinis & Buang Masa: Dismissive, cynical, or unconstructive complaints (e.g., 'buang masa', 'membazir masa', 'tak guna', 'bosan gila', 'hambar', 'merepek').
10. Keluhan Pasif Tanpa Soalan: Vague complaints with no specific question (e.g., 'tak faham', 'tak faham langsung', 'pening', 'blur gila', 'susah betul').
11. Kandungan Seksual / Tidak Sesuai: Any sexual innuendo, inappropriate comments, or violation of student-safe guidelines.
12. Komen Tidak Relevan: Random noise, 'first', or off-topic chat unrelated to physics learning.

ALLOW (isAbusive: false) ONLY IF:
- The text is a genuine, specific physics question, educational inquiry, polite request for clarification, constructive doubt, or polite greeting/thank you.

Return strictly valid JSON only:
{
  "isAbusive": true | false,
  "reason": "Penerangan ringkas dalam Bahasa Melayu jika disekat"
}

Teks untuk disemak:
"""${trimmed}"""`;

    // Primary AI: Ox Alpha (z-ai/glm-5.3-flash)
    const modelsToTry = [
      "z-ai/glm-5.3-flash",
      "meta-llama/llama-3.3-70b-instruct",
      "deepseek/deepseek-chat",
    ];

    for (const model of modelsToTry) {
      try {
        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://physflix.vercel.app",
            "X-Title": "PhysFlix SPM Physics AI Moderator (Ox Alpha)",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
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
            max_tokens: 300,
            temperature: 0.1,
          }),
        });

        if (openRouterResponse.ok) {
          const data = await openRouterResponse.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
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
          }
        }
      } catch (e) {
        console.warn(`Moderation model ${model} failed, falling back...`, e);
      }
    }

    return NextResponse.json({ isAbusive: false, reason: "" });
  } catch (error) {
    console.error("Error in moderate-comment API route:", error);
    return NextResponse.json({ isAbusive: false, reason: "" }, { status: 200 });
  }
}
