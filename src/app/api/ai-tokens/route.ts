import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export interface KeyInfo {
  label: string;
  maskedKey: string;
  isConfigured: boolean;
  status: "active" | "exhausted" | "rate_limited" | "not_configured" | "error";
  isFreeTier: boolean;
  totalCredits: number | null;
  totalUsage: number | null;
  dailyUsage: number | null;
  weeklyUsage: number | null;
  monthlyUsage: number | null;
  limit: number | null;
  limitRemaining: number | null;
  error?: string;
}

async function fetchOpenRouterKeyDetails(key: string | undefined): Promise<KeyInfo> {
  if (!key) {
    return {
      label: "Tidak Dikonfigurasi",
      maskedKey: "Tiada Kunci",
      isConfigured: false,
      status: "not_configured",
      isFreeTier: true,
      totalCredits: 0,
      totalUsage: 0,
      dailyUsage: 0,
      weeklyUsage: 0,
      monthlyUsage: 0,
      limit: null,
      limitRemaining: null,
    };
  }

  const maskedKey = `${key.slice(0, 12)}...${key.slice(-4)}`;

  try {
    const [authRes, credRes] = await Promise.all([
      fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: { Authorization: `Bearer ${key}` },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      }),
      fetch("https://openrouter.ai/api/v1/credits", {
        headers: { Authorization: `Bearer ${key}` },
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      }),
    ]);

    let authData: any = null;
    let credData: any = null;

    if (authRes.ok) {
      const parsed = await authRes.json();
      authData = parsed?.data;
    }
    if (credRes.ok) {
      const parsed = await credRes.json();
      credData = parsed?.data;
    }

    const isFreeTier = authData?.is_free_tier ?? true;
    const totalCredits = credData?.total_credits ?? 0;
    const totalUsage = authData?.usage ?? credData?.total_usage ?? 0;
    const dailyUsage = authData?.usage_daily ?? 0;
    const weeklyUsage = authData?.usage_weekly ?? 0;
    const monthlyUsage = authData?.usage_monthly ?? 0;
    const limit = authData?.limit ?? null;
    const limitRemaining = authData?.limit_remaining ?? null;

    let status: KeyInfo["status"] = "active";
    if (authRes.status === 401) {
      status = "error";
    } else if (limitRemaining !== null && limitRemaining <= 0) {
      status = "exhausted";
    }

    return {
      label: authData?.label || maskedKey,
      maskedKey,
      isConfigured: true,
      status,
      isFreeTier,
      totalCredits,
      totalUsage,
      dailyUsage,
      weeklyUsage,
      monthlyUsage,
      limit,
      limitRemaining,
    };
  } catch (err: any) {
    return {
      label: "Ralat Sambungan",
      maskedKey,
      isConfigured: true,
      status: "error",
      isFreeTier: true,
      totalCredits: 0,
      totalUsage: 0,
      dailyUsage: 0,
      weeklyUsage: 0,
      monthlyUsage: 0,
      limit: null,
      limitRemaining: null,
      error: err.message,
    };
  }
}

export async function GET() {
  try {
    const primaryKey = process.env.OPENROUTER_API_KEY;
    const backupKey = process.env.OPENROUTER_BACKUP_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    const [primaryInfo, backupInfo] = await Promise.all([
      fetchOpenRouterKeyDetails(primaryKey),
      fetchOpenRouterKeyDetails(backupKey),
    ]);

    const geminiConfigured = Boolean(geminiKey);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      primary: primaryInfo,
      backup: backupInfo,
      gemini: {
        isConfigured: geminiConfigured,
        directAvailable: geminiConfigured,
        model: "google/gemini-2.5-flash",
        status: "ready",
        note: geminiConfigured
          ? "Kunci Google AI Studio dikesan (1,500 RPD percuma selamanya)"
          : "Sedia melalui failover OpenRouter Gemini (750ms latency)",
      },
      fallbackModels: [
        { name: "Ox Alpha (Utama)", id: "z-ai/glm-5.3-flash", role: "AI Utama Soal Jawab & Moderasi SPM", maxTokens: 1800, reasoningLimit: 120 },
        { name: "Google Gemini 2.5 Flash", id: "google/gemini-2.5-flash", role: "Fallback Kelajuan Tinggi (~750ms)", maxTokens: 1800, reasoningLimit: 0 },
        { name: "Google Gemini 2.5 Flash Lite", id: "google/gemini-2.5-flash-lite", role: "Fallback Ringan & Jimat Kuota", maxTokens: 1800, reasoningLimit: 0 },
      ],
      totalUsageUsd: Number((primaryInfo.totalUsage || 0) + (backupInfo.totalUsage || 0)).toFixed(6),
      totalDailyUsd: Number((primaryInfo.dailyUsage || 0) + (backupInfo.dailyUsage || 0)).toFixed(6),
    });
  } catch (err: any) {
    console.error("Error in ai-tokens route:", err);
    return NextResponse.json(
      { error: "Gagal mengambil maklumat status token AI: " + err.message },
      { status: 500 }
    );
  }
}
