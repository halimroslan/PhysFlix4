"use client";

import React, { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { allVideoLessons } from "@/data/physicsData";
import { Users, Eye, Clock, Activity, Loader2, ShieldAlert, RotateCcw, ThumbsUp } from "lucide-react";

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

  useEffect(() => {
    if (!isSuperAdmin) {
      setLoading(false);
      return;
    }
    fetchData();
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
