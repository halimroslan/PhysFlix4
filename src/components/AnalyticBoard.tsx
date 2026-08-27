"use client";

import React, { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { allVideoLessons } from "@/data/physicsData";
import { Users, Eye, Clock, Activity, Loader2 } from "lucide-react";

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

export const AnalyticBoard: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<VideoStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
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
            views: s.views || s.likes || 0,
            likes: s.likes || 0,
          })));
        } else {
          // Fallback / Demo data
          setUsers([
            {
              uid: "demo-user-1",
              email: "pelajar.spm@moe-dl.edu.my",
              displayName: "Ahmad Rizky (Demo)",
              lastLogin: new Date().toLocaleString("ms-MY"),
            },
            {
              uid: "demo-user-2",
              email: "siti.sarah@moe-dl.edu.my",
              displayName: "Siti Sarah (Demo)",
              lastLogin: new Date(Date.now() - 3600000).toLocaleString("ms-MY"),
            },
          ]);
          setStats([
            { id: "1.1", views: 2450, likes: 320 },
            { id: "2.1", views: 1890, likes: 210 },
            { id: "3.1", views: 1650, likes: 180 },
            { id: "5.1", views: 1420, likes: 150 },
          ]);
        }
      } catch (err: any) {
        console.error("Error fetching analytics from Supabase:", err);
        setErrorMsg(err.message || "Gagal memuatkan data dari Supabase.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Prepare chart data for videos
  const chartData = stats.map((s) => {
    const lesson = allVideoLessons.find((l) => l.id === s.id);
    return {
      name: lesson ? `B${lesson.chapterNum} M${lesson.week.replace("Minggu ", "").replace("T4 ", "")}` : s.id,
      views: s.views,
      fullTitle: lesson?.titleBm || s.id,
    };
  }).sort((a, b) => b.views - a.views).slice(0, 10);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <Activity className="w-8 h-8 text-emerald-400" />
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Developer Analytic Board</h2>
          <p className="text-xs text-slate-400 font-medium">Dikuasakan oleh Supabase PostgreSQL Database</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl">
            <Users className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold">Jumlah Pelajar</p>
            <p className="text-3xl font-bold text-white">{totalUsers}</p>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <Eye className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-semibold">Jumlah Interaksi / Views</p>
            <p className="text-3xl font-bold text-white">{totalViews}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">Top 10 Video Paling Banyak Ditonton</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickMargin={10} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip 
                cursor={{ fill: '#1e293b' }}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
              />
              <Bar dataKey="views" fill="#10b981" radius={[4, 4, 0, 0]} name="Tontonan" />
            </BarChart>
          </ResponsiveContainer>
        </div>
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
