import { NextRequest, NextResponse } from "next/server";
import { checkQuickAbusive } from "@/utils/moderation";

// Helper for direct Google Gemini API call if key is available
async function checkDirectGeminiModeration(apiKey: string, prompt: string): Promise<{ isAbusive: boolean; reason: string } | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
          maxOutputTokens: 300,
        },
      }),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    const parsed = JSON.parse(text);
    return {
      isAbusive: Boolean(parsed.isAbusive),
      reason: parsed.reason || "",
    };
  } catch (e) {
    console.warn("Direct Gemini moderation failed:", e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ isAbusive: false, reason: "", serviceDisabled: false });
    }

    const trimmed = text.trim();

    // 1. Instant 0ms heuristic profanity, insult, scam & cynicism check (12 categories, 1000+ bad patterns)
    const quickCheck = checkQuickAbusive(trimmed);
    if (quickCheck.isAbusive) {
      return NextResponse.json({
        isAbusive: true,
        category: quickCheck.category,
        reason: quickCheck.reason,
        serviceDisabled: false,
        engine: "instant_heuristic",
      });
    }

    // 2. Prepare API keys (Prioritize OPENROUTER_API_KEY3 and OPENROUTER_BACKUP_API_KEY3)
    const openRouterKeys = [
      process.env.OPENROUTER_API_KEY3,
      process.env.OPENROUTER_BACKUP_API_KEY3,
      process.env.OPENROUTER_API_KEY,
      process.env.OPENROUTER_BACKUP_API_KEY,
    ].filter(Boolean) as string[];
    const uniqueOpenRouterKeys = Array.from(new Set(openRouterKeys));

    const geminiDirectKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

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

    // 3. Multi-tier Cloud Fallback Chain:
    // Tier 1: Ox Alpha (z-ai/glm-5.3-flash)
    // Tier 2: Google Gemini 2.5 Flash on OpenRouter (ultra fast, high quota)
    // Tier 3: Google Gemini 2.5 Flash Lite on OpenRouter
    const models = ["z-ai/glm-5.3-flash", "google/gemini-2.5-flash", "google/gemini-2.5-flash-lite"];

    for (const model of models) {
      for (const key of uniqueOpenRouterKeys) {
        try {
          const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${key}`,
              "HTTP-Referer": "https://physflix.vercel.app",
              "X-Title": `PhysFlix SPM Physics AI Moderator (${model})`,
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
              ...(model.includes("glm") ? { reasoning: { max_tokens: 60 } } : {}),
            }),
            signal: AbortSignal.timeout(6500),
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
                  serviceDisabled: false,
                  engine: model,
                });
              } catch {
                const isAbusive = content.toLowerCase().includes('"isabusive": true') || content.toLowerCase().includes('"isabusive":true');
                return NextResponse.json({
                  isAbusive,
                  reason: isAbusive ? "Kandungan dikesan mengandungi perkataan atau unsur yang tidak sopan." : "",
                  serviceDisabled: false,
                  engine: model,
                });
              }
            }
          } else {
            console.warn(`Moderation with model ${model} and key failed (status ${openRouterResponse.status}), trying next fallback...`);
          }
        } catch (e) {
          console.warn(`Moderation request failed for model ${model}, trying next fallback...`, e);
        }
      }
    }

    // 4. Try Direct Gemini API if configured
    if (geminiDirectKey) {
      const geminiResult = await checkDirectGeminiModeration(geminiDirectKey, prompt);
      if (geminiResult) {
        return NextResponse.json({
          ...geminiResult,
          serviceDisabled: false,
          engine: "direct_gemini",
        });
      }
    }

    // 5. Ultimate Graceful Safety Pass:
    // If all cloud AI endpoints temporarily timeout, DO NOT disable commenting.
    // The comment has already PASSED the 1,000+ words instant heuristic safety filter!
    return NextResponse.json({
      isAbusive: false,
      reason: "",
      serviceDisabled: false,
      engine: "local_heuristic_pass",
    });
  } catch (error) {
    console.error("Error in moderate-comment API route:", error);
    return NextResponse.json({
      isAbusive: false,
      serviceDisabled: false,
      reason: "",
    });
  }
}
