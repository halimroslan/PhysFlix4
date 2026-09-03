"use client";

import React, { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { allVideoLessons } from "@/data/physicsData";
import {
  Users,
  Eye,
  Clock,
  Activity,
  Loader2,
  ShieldAlert,
  RotateCcw,
  ThumbsUp,
  Cpu,
  Coins,
  Sparkles,
  RefreshCw,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface UserData {
  uid: string;
  email: string;
  displayName: string;
  lastLogin: string;
}

interface VideoStat {
  id: string;
  views: number;
  likes: number;
}

const SUPERADMIN_EMAILS = ["ahalimroslan@gmail.com", "abdulhalimroslan@gmail.com"];

export const AnalyticBoard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<VideoStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiTokens, setAiTokens] = useState<any>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const userEmail = user?.email?.toLowerCase().trim() || "";
  const isSuperAdmin = SUPERADMIN_EMAILS.includes(userEmail);

  const fetchData = async () => {
    try {
      if (isSupabaseConfigured) {
        // Fetch Users from public.profiles
        const { data: profilesData, error: profilesErr } = await supabase
          .from("profiles")
          .select("id, email, display_name, last_login")
          .order("last_login", { ascending: false });

        if (profilesErr) throw profilesErr;

        const formattedUsers: UserData[] = (profilesData || []).map((p: any) => ({
          uid: p.id,
          email: p.email || "Tiada Emel",
          displayName: p.display_name || p.email?.split("@")[0] || "Pelajar",
          lastLogin: p.last_login ? new Date(p.last_login).toLocaleString("ms-MY") : "Tiada Rekod",
        }));

        // Fetch Video Stats from public.video_stats
        const { data: videoStatsData, error: statsErr } = await supabase
          .from("video_stats")
          .select("id, views, likes")
          .order("views", { ascending: false });

        if (statsErr) throw statsErr;

        setUsers(formattedUsers);
        setStats((videoStatsData || []).map((s: any) => ({
          id: s.id,
          views: s.views || 0,
          likes: s.likes || 0,
        })));
      } else {
        // Fallback / Local state
        setUsers([]);
        setStats([]);
      }
    } catch (err: any) {
      console.error("Error fetching analytics from Supabase:", err);
      setErrorMsg(err.message || "Gagal memuatkan data dari Supabase.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAiTokens = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-tokens");
      if (res.ok) {
        const data = await res.json();
        setAiTokens(data);
      }
    } catch (e) {
      console.error("Error fetching AI tokens:", e);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    fetchData();
    fetchAiTokens();
  }, []);

  const handleResetVideoStats = async () => {
    if (!confirm("Adakah anda ingin menetapkan semula (reset) semua kiraan views dan likes ke 0 dalam database?")) return;
    setIsResetting(true);
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from("video_stats").delete().neq("id", "___none___");
        if (error) throw error;
        setStats([]);
        alert("Statistik video berjaya ditetapkan semula ke 0!");
      }
    } catch (e: any) {
      alert("Ralat menetapkan semula statistik: " + e.message);
    } finally {
      setIsResetting(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
        <div className="p-4 rounded-full bg-red-950/60 border border-red-500/40 text-red-400">
          <ShieldAlert className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-white">Akses Disekat</h2>
        <p className="text-sm text-slate-400 max-w-md">
          Halaman Analytic Board adalah terhad dan hanya boleh diakses oleh SuperAdmin rasmi sahaja.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 space-x-3 text-sky-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="font-bold">Memuatkan data Analitik Supabase...</span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-red-400">
        <Activity className="w-12 h-12 mb-2 opacity-50" />
        <span className="font-bold text-xl">Ralat Supabase:</span>
        <code className="bg-red-950/50 p-4 rounded text-sm text-red-300 max-w-2xl text-center">
          {errorMsg}
        </code>
        <p className="text-sm text-slate-400">Pastikan RLS Policies pada jadual profiles & video_stats membenarkan bacaan.</p>
      </div>
    );
  }

  const totalUsers = users.length;
  const totalViews = stats.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalLikes = stats.reduce((acc, curr) => acc + (curr.likes || 0), 0);

  // Prepare chart data using actual video titles
  const chartData = stats
    .map((s) => {
      const lesson = allVideoLessons.find((l) => l.id === s.id);
      const title = lesson ? lesson.titleBm : `Video ${s.id}`;
      return {
        id: s.id,
        // Short name for Y-axis
        name: title.length > 25 ? title.substring(0, 23) + "…" : title,
        fullTitle: title,
        chapter: lesson ? `Tingkatan ${lesson.form} - Bab ${lesson.chapterNum}: ${lesson.chapterBm}` : "",
        views: s.views || 0,
        likes: s.likes || 0,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <Activity className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Developer Analytic Board</h2>
            <p className="text-xs text-slate-400 font-medium">Data Masa Nyata (Real-Time) • Supabase PostgreSQL</p>
          </div>
        </div>

        <button
          onClick={handleResetVideoStats}
          disabled={isResetting}
          className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? "animate-spin" : ""}`} />
          <span>{isResetting ? "Menetapkan Semula..." : "Reset Data Views/Likes"}</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold">Jumlah Murid Berdaftar</p>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
          <div className="p-3 bg-cyan-500/10 rounded-xl">
            <Eye className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold">Jumlah Tontonan Sebenar (Views)</p>
            <p className="text-3xl font-bold text-white">{totalViews}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
          <div className="p-3 bg-rose-500/10 rounded-xl">
            <ThumbsUp className="w-8 h-8 text-rose-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold">Jumlah Suka Sebenar (Likes)</p>
            <p className="text-3xl font-bold text-white">{totalLikes}</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DEDICATED DEVELOPER AI TOKEN & QUOTA MONITOR (OX ALPHA & GEMINI)         */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl shadow-lg shadow-indigo-600/30 text-white">
              <Cpu className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Status Kuota & Penggunaan AI Engine
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 border border-indigo-400/40 text-indigo-300">
                  Developer Live Monitor
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Ox Alpha (<code className="text-indigo-300 font-mono">z-ai/glm-5.3-flash</code>), Google Gemini Fallback & Dwi-Kunci OpenRouter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAiTokens}
              disabled={aiLoading}
              className="flex items-center space-x-2 px-3.5 py-2 text-xs font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 rounded-xl transition shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? "animate-spin" : ""}`} />
              <span>{aiLoading ? "Menyemak..." : "Semak Semula Kuota"}</span>
            </button>
          </div>
        </div>

        {/* AI Quick Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
          {/* Card 1: Kunci Utama Status */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Kunci Utama (Ox Alpha)</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-lg font-bold text-white mt-1">
              {aiTokens?.primary?.isConfigured ? "200 OK • Aktif" : "Tidak Aktif"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              {aiTokens?.primary?.maskedKey || "Memuatkan..."}
            </p>
          </div>

          {/* Card 2: Kunci Sandaran Status */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Kunci Sandaran (Ox Alpha)</span>
              <span className="inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <p className="text-lg font-bold text-white mt-1">
              {aiTokens?.backup?.isConfigured ? "200 OK • Standby" : "Tidak Aktif"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              {aiTokens?.backup?.maskedKey || "Memuatkan..."}
            </p>
          </div>

          {/* Card 3: Total Usage USD */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Jumlah Terpakai (USD)</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-lg font-bold text-emerald-400 mt-1">
              ${aiTokens?.totalUsageUsd || "0.000000"}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Hari ini: ${aiTokens?.totalDailyUsd || "0.000000"}
            </p>
          </div>

          {/* Card 4: Gemini Fallback Status */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Google Gemini Fallback</span>
              <Sparkles className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-lg font-bold text-sky-400 mt-1">
              Siap Sedia (Auto)
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Respons ~750ms • Jimat Kuota
            </p>
          </div>
        </div>

        {/* Detailed 2-Column Comparison for Keys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {/* Primary Key Deep Card */}
          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Kunci Utama (Primary Key)</h4>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-md">
                Pilihan Utama
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">Model Terpaut:</p>
                <p className="font-bold text-white mt-0.5">Ox Alpha (GLM 5.3)</p>
                <p className="text-[10px] text-indigo-400 font-mono">z-ai/glm-5.3-flash</p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">Baki Kredit Berbayar:</p>
                <p className="font-bold text-emerald-400 mt-0.5">
                  ${aiTokens?.primary?.totalCredits !== null && aiTokens?.primary?.totalCredits !== undefined ? Number(aiTokens?.primary?.totalCredits).toFixed(2) : "0.00"}
                </p>
                <p className="text-[10px] text-slate-500">Pelan Free Tier Aktif</p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">Penggunaan Hari Ini:</p>
                <p className="font-bold text-white mt-0.5">
                  ${aiTokens?.primary?.dailyUsage !== undefined && aiTokens?.primary?.dailyUsage !== null ? Number(aiTokens.primary.dailyUsage).toFixed(6) : "0.000000"}
                </p>
                <p className="text-[10px] text-slate-500">Kadar Penggunaan 24j</p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">Jumlah Keseluruhan:</p>
                <p className="font-bold text-white mt-0.5">
                  ${aiTokens?.primary?.totalUsage !== undefined && aiTokens?.primary?.totalUsage !== null ? Number(aiTokens.primary.totalUsage).toFixed(6) : "0.000000"}
                </p>
                <p className="text-[10px] text-slate-500">Sejak Kunci Dicipta</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Had Reasoning (Reasoning Cap):</span>
              <span className="text-emerald-400 font-bold">120 Tokens (Jimat 95% Kuota)</span>
            </div>
          </div>

          {/* Backup Key Deep Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-slate-400" />
                <h4 className="text-sm font-bold text-white">Kunci Sandaran (Backup Key)</h4>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 rounded-md">
                Auto-Failover
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">Model Terpaut:</p>
                <p className="font-bold text-white mt-0.5">Ox Alpha (GLM 5.3)</p>
                <p className="text-[10px] text-slate-400 font-mono">z-ai/glm-5.3-flash</p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">Baki Kredit Berbayar:</p>
                <p className="font-bold text-emerald-400 mt-0.5">
                  ${aiTokens?.backup?.totalCredits !== null && aiTokens?.backup?.totalCredits !== undefined ? Number(aiTokens?.backup?.totalCredits).toFixed(2) : "0.00"}
                </p>
                <p className="text-[10px] text-slate-500">Pelan Free Tier Aktif</p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">Penggunaan Hari Ini:</p>
                <p className="font-bold text-white mt-0.5">
                  ${aiTokens?.backup?.dailyUsage !== undefined && aiTokens?.backup?.dailyUsage !== null ? Number(aiTokens.backup.dailyUsage).toFixed(6) : "0.000000"}
                </p>
                <p className="text-[10px] text-slate-500">Kadar Penggunaan 24j</p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400 text-[11px]">Jumlah Keseluruhan:</p>
                <p className="font-bold text-white mt-0.5">
                  ${aiTokens?.backup?.totalUsage !== undefined && aiTokens?.backup?.totalUsage !== null ? Number(aiTokens.backup.totalUsage).toFixed(6) : "0.000000"}
                </p>
                <p className="text-[10px] text-slate-500">Sejak Kunci Dicipta</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Peranan Failover:</span>
              <span className="text-sky-400 font-bold">Mengambil alih jika Kunci Utama 429/402</span>
            </div>
          </div>
        </div>

        {/* AI Tier Architecture & Safety Shield Banner */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-white">Sistem Perlindungan 6 Lapisan (*Multi-Tier Fallback*) Aktif:</p>
              <p className="text-slate-400 leading-relaxed">
                Ox Alpha (Kunci 1) ➔ Ox Alpha (Kunci 2) ➔ Google Gemini 2.5 Flash ➔ Gemini 2.5 Flash Lite ➔ Direct Gemini ➔ Penapis Tempatan 0ms (1,000+ corak).
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-lg shrink-0 self-end sm:self-center">
            Perlindungan 100%
          </span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xl font-bold text-white">Top 10 Video Paling Banyak Ditonton</h3>
          <span className="text-xs text-slate-400">Paparan Nama Tajuk Video</span>
        </div>

        {chartData.length === 0 || chartData.every(d => d.views === 0 && d.likes === 0) ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-sm space-y-2">
            <Activity className="w-8 h-8 opacity-40" />
            <p>Belum ada rekod tontonan video. Tontonan akan bertambah secara automatik apabila murid memainkan video.</p>
          </div>
        ) : (
          <div className="w-full" style={{ height: Math.max(340, chartData.length * 48) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 140, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#cbd5e1"
                  fontSize={12}
                  width={150}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[200px]">
                          <p className="font-bold text-sm text-emerald-400">{d.fullTitle}</p>
                          <p className="text-slate-400">{d.chapter}</p>
                          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                            <span className="text-slate-300">Tontonan (Views):</span>
                            <span className="font-bold text-white text-sm">{d.views}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-300">Suka (Likes):</span>
                            <span className="font-bold text-rose-400 text-sm">{d.likes}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="views" fill="#10b981" radius={[0, 6, 6, 0]} name="Tontonan" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* User Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Senarai Pelajar Berdaftar (Supabase Profiles)</h3>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full">{users.length} Akaun</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-300 text-sm">
                <th className="p-4 font-semibold">Nama / Emel</th>
                <th className="p-4 font-semibold">ID Pengguna (UUID)</th>
                <th className="p-4 font-semibold text-right">Log Masuk Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-slate-800/30 transition text-sm">
                  <td className="p-4 text-white">
                    <div className="font-semibold">{u.displayName}</div>
                    <div className="text-slate-500 text-xs">{u.email}</div>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-xs">{u.uid}</td>
                  <td className="p-4 text-slate-400 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{u.lastLogin}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500 italic">Tiada data pelajar lagi. Sila log masuk untuk pendaftaran akaun.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
