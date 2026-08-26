"use client";

import React, { useState } from "react";
import { 
  Compass, 
  Flame, 
  Waves, 
  Zap, 
  Atom, 
  Cpu, 
  Activity, 
  Play, 
  Clock, 
  Layers, 
  ChevronRight,
  Sparkles,
  BookOpen
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { VideoLesson, allVideoLessons } from "@/data/physicsData";
import { motion, AnimatePresence } from "framer-motion";

interface TopPicksProps {
  onPlay: (lesson: VideoLesson) => void;
}

export interface DSKPChapter {
  form: 4 | 5;
  chapterNum: number;
  nameBm: string;
  nameDlp: string;
}

export interface DSKPTheme {
  id: string;
  titleBm: string;
  titleDlp: string;
  subtitleBm: string;
  subtitleDlp: string;
  forms: (4 | 5)[];
  gradient: string;
  borderColor: string;
  glowColor: string;
  icon: React.ElementType;
  chapters: DSKPChapter[];
}

export const dskpThemes: DSKPTheme[] = [
  {
    id: "asas_fizik",
    titleBm: "Asas Fizik",
    titleDlp: "Fundamentals of Physics",
    subtitleBm: "Pengukuran & Kuantiti Fizik",
    subtitleDlp: "Measurement & Physical Quantities",
    forms: [4],
    gradient: "from-blue-900/60 via-indigo-950/70 to-[#0c101d]",
    borderColor: "border-blue-500/40 hover:border-blue-400",
    glowColor: "rgba(59, 130, 246, 0.3)",
    icon: Compass,
    chapters: [
      { form: 4, chapterNum: 1, nameBm: "1.0 Pengukuran", nameDlp: "1.0 Measurement" }
    ]
  },
  {
    id: "mekanik_newton",
    titleBm: "Mekanik Newton",
    titleDlp: "Newtonian Mechanics",
    subtitleBm: "Gerakan, Daya, Kegravitian & Tekanan",
    subtitleDlp: "Motion, Force, Gravitation & Pressure",
    forms: [4, 5],
    gradient: "from-indigo-900/60 via-purple-950/70 to-[#0c101d]",
    borderColor: "border-indigo-500/40 hover:border-indigo-400",
    glowColor: "rgba(99, 102, 241, 0.3)",
    icon: Activity,
    chapters: [
      { form: 4, chapterNum: 2, nameBm: "2.0 Daya dan Gerakan I", nameDlp: "2.0 Force and Motion I" },
      { form: 4, chapterNum: 3, nameBm: "3.0 Kegravitian", nameDlp: "3.0 Gravitation" },
      { form: 5, chapterNum: 1, nameBm: "1.0 Daya dan Gerakan II", nameDlp: "1.0 Force and Motion II" },
      { form: 5, chapterNum: 2, nameBm: "2.0 Tekanan", nameDlp: "2.0 Pressure" }
    ]
  },
  {
    id: "haba",
    titleBm: "Haba",
    titleDlp: "Heat",
    subtitleBm: "Keseimbangan Terma, Muatan & Hukum Gas",
    subtitleDlp: "Thermal Equilibrium, Heat Capacity & Gas Laws",
    forms: [4],
    gradient: "from-amber-900/60 via-orange-950/70 to-[#0c101d]",
    borderColor: "border-amber-500/40 hover:border-amber-400",
    glowColor: "rgba(245, 158, 11, 0.3)",
    icon: Flame,
    chapters: [
      { form: 4, chapterNum: 4, nameBm: "4.0 Haba", nameDlp: "4.0 Heat" }
    ]
  },
  {
    id: "gelombang_cahaya_optik",
    titleBm: "Gelombang, Cahaya & Optik",
    titleDlp: "Waves, Light & Optics",
    subtitleBm: "Pantulan, Pembiasan, Pembauan & Interferens",
    subtitleDlp: "Reflection, Refraction, Diffraction & Interference",
    forms: [4],
    gradient: "from-purple-900/60 via-fuchsia-950/70 to-[#0c101d]",
    borderColor: "border-purple-500/40 hover:border-purple-400",
    glowColor: "rgba(168, 85, 247, 0.3)",
    icon: Waves,
    chapters: [
      { form: 4, chapterNum: 5, nameBm: "5.0 Gelombang", nameDlp: "5.0 Waves" },
      { form: 4, chapterNum: 6, nameBm: "6.0 Cahaya dan Optik", nameDlp: "6.0 Light and Optics" }
    ]
  },
  {
    id: "elektrik_keelektromagnetan",
    titleBm: "Elektrik & Keelektromagnetan",
    titleDlp: "Electricity & Electromagnetism",
    subtitleBm: "Arus, Voltan, Rintangan, Transformer & Motor",
    subtitleDlp: "Current, Voltage, Resistance, Transformer & Motors",
    forms: [5],
    gradient: "from-red-900/60 via-rose-950/70 to-[#0c101d]",
    borderColor: "border-rose-500/40 hover:border-rose-400",
    glowColor: "rgba(244, 63, 94, 0.3)",
    icon: Zap,
    chapters: [
      { form: 5, chapterNum: 3, nameBm: "3.0 Elektrik", nameDlp: "3.0 Electricity" },
      { form: 5, chapterNum: 4, nameBm: "4.0 Keelektromagnetan", nameDlp: "4.0 Electromagnetism" }
    ]
  },
  {
    id: "fizik_gunaan",
    titleBm: "Fizik Gunaan",
    titleDlp: "Applied Physics",
    subtitleBm: "Diod, Transistor & Litar Elektronik",
    subtitleDlp: "Diodes, Transistors & Electronic Circuits",
    forms: [5],
    gradient: "from-teal-900/60 via-emerald-950/70 to-[#0c101d]",
    borderColor: "border-teal-500/40 hover:border-teal-400",
    glowColor: "rgba(20, 184, 166, 0.3)",
    icon: Cpu,
    chapters: [
      { form: 5, chapterNum: 5, nameBm: "5.0 Elektronik", nameDlp: "5.0 Electronics" }
    ]
  },
  {
    id: "fizik_moden",
    titleBm: "Fizik Moden",
    titleDlp: "Modern Physics",
    subtitleBm: "Reputan Radioaktif, Kuantum Cahaya & Foton",
    subtitleDlp: "Radioactive Decay, Light Quantum & Photons",
    forms: [5],
    gradient: "from-emerald-900/60 via-cyan-950/70 to-[#0c101d]",
    borderColor: "border-emerald-500/40 hover:border-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.3)",
    icon: Atom,
    chapters: [
      { form: 5, chapterNum: 6, nameBm: "6.0 Fizik Nuklear", nameDlp: "6.0 Nuclear Physics" },
      { form: 5, chapterNum: 7, nameBm: "7.0 Fizik Kuantum", nameDlp: "7.0 Quantum Physics" }
    ]
  }
];

export const TopPicks: React.FC<TopPicksProps> = ({ onPlay }) => {
  const { lang, t } = useLanguage();
  const [selectedThemeId, setSelectedThemeId] = useState<string>(dskpThemes[1].id); // Default to Mekanik Newton
  const [selectedChapterKey, setSelectedChapterKey] = useState<string>("4-2"); // Default to T4 Bab 2

  // Get active theme
  const activeTheme = dskpThemes.find((t) => t.id === selectedThemeId) || dskpThemes[0];

  // Helper to get total video count for a theme
  const getThemeVideoCount = (theme: DSKPTheme) => {
    return allVideoLessons.filter((v) =>
      theme.chapters.some((ch) => ch.form === v.form && ch.chapterNum === v.chapterNum)
    ).length;
  };

  // Helper to get videos for a chapter
  const getChapterVideos = (form: number, chapterNum: number) => {
    return allVideoLessons.filter((v) => v.form === form && v.chapterNum === chapterNum);
  };

  // Parse active chapter
  const [activeFormStr, activeChapterNumStr] = selectedChapterKey.split("-");
  const activeForm = parseInt(activeFormStr, 10);
  const activeChapterNum = parseInt(activeChapterNumStr, 10);

  const displayedVideos = getChapterVideos(activeForm, activeChapterNum);

  const handleSelectTheme = (theme: DSKPTheme) => {
    setSelectedThemeId(theme.id);
    if (theme.chapters.length > 0) {
      const firstCh = theme.chapters[0];
      setSelectedChapterKey(`${firstCh.form}-${firstCh.chapterNum}`);
    }
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Section Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-red-500" />
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight">
              {lang === "bm" ? "Tema & Bidang Pembelajaran DSKP Fizik" : "DSKP Physics Themes & Learning Areas"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {lang === "bm"
              ? "Pilih tema kurikulum KSSM di bawah untuk memaparkan tajuk utama dan video pembelajaran."
              : "Select a KSSM curriculum theme below to view main topics and lesson videos."}
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <span className="px-3 py-1 bg-red-950/50 border border-red-800/40 text-red-400 text-xs font-bold rounded-full">
            7 Tema DSKP • 65 Video
          </span>
        </div>
      </div>

      {/* LEVEL 1: DSKP Themes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {dskpThemes.map((theme) => {
          const Icon = theme.icon;
          const isSelected = theme.id === selectedThemeId;
          const videoCount = getThemeVideoCount(theme);

          return (
            <div
              key={theme.id}
              onClick={() => handleSelectTheme(theme)}
              className={`group cursor-pointer p-4 rounded-2xl bg-gradient-to-br ${theme.gradient} border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[140px] ${
                isSelected
                  ? "border-red-500 ring-2 ring-red-500/50 shadow-2xl scale-[1.03] z-10"
                  : `${theme.borderColor} hover:scale-[1.02] opacity-80 hover:opacity-100`
              }`}
            >
              {/* Background ambient glow */}
              <div 
                className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-xl transition-all duration-300 group-hover:scale-150"
                style={{ backgroundColor: theme.glowColor }}
              ></div>

              {/* Top Row: Icon + Form Badge */}
              <div className="flex items-center justify-between z-10">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition shadow-md ${
                  isSelected ? "bg-red-600 text-white" : "bg-white/10 text-white group-hover:bg-white/20"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex space-x-1">
                  {theme.forms.map((f) => (
                    <span
                      key={f}
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${
                        f === 4 
                          ? "bg-blue-950/80 text-blue-300 border-blue-800/60" 
                          : "bg-purple-950/80 text-purple-300 border-purple-800/60"
                      }`}
                    >
                      T{f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Middle Title */}
              <div className="z-10 my-2">
                <h4 className={`text-xs font-black tracking-tight leading-snug ${isSelected ? "text-white" : "text-slate-200 group-hover:text-white"}`}>
                  {lang === "bm" ? theme.titleBm : theme.titleDlp}
                </h4>
                <p className="text-[10px] text-slate-300/80 line-clamp-1 mt-0.5">
                  {lang === "bm" ? theme.subtitleBm : theme.subtitleDlp}
                </p>
              </div>

              {/* Bottom Video Count */}
              <div className="flex items-center justify-between z-10 pt-1 border-t border-white/10">
                <span className="text-[10px] font-bold text-slate-300">
                  {videoCount} {lang === "bm" ? "Video" : "Videos"}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "text-red-400 rotate-90" : "text-slate-400 group-hover:translate-x-0.5"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* LEVEL 2: Main Topics / Chapters (Bidang Pembelajaran) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#0e1320] border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs md:text-sm font-black text-slate-200 uppercase tracking-wider">
              {lang === "bm" 
                ? `Bidang Pembelajaran DSKP bagi: ${activeTheme.titleBm}` 
                : `Learning Areas for: ${activeTheme.titleDlp}`}
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold">
            {activeTheme.chapters.length} {lang === "bm" ? "Tajuk Utama / Bab" : "Main Topics / Chapters"}
          </span>
        </div>

        {/* Chapter Buttons */}
        <div className="flex flex-wrap gap-2.5">
          {activeTheme.chapters.map((ch) => {
            const chKey = `${ch.form}-${ch.chapterNum}`;
            const isChSelected = chKey === selectedChapterKey;
            const vids = getChapterVideos(ch.form, ch.chapterNum);

            return (
              <button
                key={chKey}
                onClick={() => setSelectedChapterKey(chKey)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isChSelected
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-lg shadow-red-950/80 scale-105"
                    : "bg-[#141a28] hover:bg-[#1c2438] text-slate-300 hover:text-white border-slate-700/60"
                }`}
              >
                <span className={`px-1.5 py-0.5 text-[9px] font-black rounded ${
                  ch.form === 4 ? "bg-blue-600 text-white" : "bg-purple-600 text-white"
                }`}>
                  T{ch.form}
                </span>
                <span>{lang === "bm" ? ch.nameBm : ch.nameDlp}</span>
                <span className="text-[10px] opacity-75 font-normal">({vids.length})</span>
              </button>
            );
          })}
        </div>

        {/* LEVEL 3: Video Cards Grid for Active Chapter */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              {lang === "bm" ? "Senarai Video Pembelajaran Sedia Ditonton:" : "Ready-to-Watch Video Lessons:"}
            </span>
            <span className="text-xs font-bold text-red-400">
              {displayedVideos.length} {lang === "bm" ? "Video" : "Videos"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedVideos.map((video) => {
              return (
                <div
                  key={video.id}
                  onClick={() => onPlay(video)}
                  className="group cursor-pointer rounded-2xl bg-[#121624] border border-slate-800/80 hover:border-red-500/60 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl hover:shadow-red-950/20 overflow-hidden flex flex-col"
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    {video.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={video.thumbnailUrl}
                        alt={video.titleBm}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-900 to-black">
                        <Play className="w-8 h-8 text-red-500/80 mb-1" />
                        <span className="text-[10px] text-slate-400 font-bold line-clamp-1">{video.titleBm}</span>
                      </div>
                    )}

                    {/* Play Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex items-center space-x-1">
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-md text-white shadow-md ${
                        video.form === 4 ? "bg-blue-600" : "bg-purple-600"
                      }`}>
                        T{video.form}
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-black/75 backdrop-blur-md text-slate-200 border border-white/10">
                        {video.week}
                      </span>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                      <Clock className="w-3 h-3 text-red-400" />
                      <span>{video.duration}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h5 className="text-xs sm:text-sm font-extrabold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                        {lang === "bm" ? video.titleBm : video.titleDlp}
                      </h5>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 font-medium">
                        {lang === "bm" ? `Bab ${video.chapterNum}: ${video.chapterBm}` : `Ch ${video.chapterNum}: ${video.chapterDlp}`}
                      </p>
                    </div>

                    {/* Key Concepts Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(lang === "bm" ? video.keyConceptsBm : video.keyConceptsDlp).slice(0, 2).map((concept, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#182030] text-[9px] font-semibold text-slate-300 border border-slate-700/50"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
