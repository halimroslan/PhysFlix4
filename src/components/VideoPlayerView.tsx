"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Maximize,
  Brain,
  Video,
  Sparkles,
  CheckCircle2,
  Circle,
  FileText,
  Play,
  Lock
} from "lucide-react";
import QuizComponent from "./QuizComponent";
import { useLanguage } from "@/context/LanguageContext";
import { VideoLesson, allVideoLessons } from "@/data/physicsData";
import { conceptDefinitions } from "@/data/conceptDefinitions";
import { deobfuscateId } from "@/utils/security";
import { useUserActivity } from "@/context/UserActivityContext";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface VideoPlayerViewProps {
  currentLesson: VideoLesson;
  onBack: () => void;
  onSelectLesson: (lesson: VideoLesson) => void;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  currentLesson,
  onBack,
  onSelectLesson
}) => {
  const { lang, t } = useLanguage();
  const { isBookmarked, toggleBookmark, addToHistory, videoStats, updateResumeTime } = useUserActivity();
  const { user } = useAuth();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoOpenedAt = useRef<number>(Date.now());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState("");

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if ('requestFullscreen' in document.documentElement) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(err => {
          console.error("Native fullscreen failed, using CSS fallback:", err);
          setIsFullscreen(true);
        });
      } else {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    } else if ((containerRef.current as any).webkitRequestFullscreen) {
      if (!(document as any).webkitFullscreenElement) {
        (containerRef.current as any).webkitRequestFullscreen();
      } else {
        (document as any).webkitExitFullscreen();
      }
    } else {
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || (document as any).webkitFullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Parse duration into total seconds
  const totalSeconds = (() => {
    if (!currentLesson?.duration) return 0;
    const parts = currentLesson.duration.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    return 0;
  })();

  const watchableDuration = Math.max(1, totalSeconds > 0 ? totalSeconds : 600);
  const [currentStartSeconds, setCurrentStartSeconds] = useState(0);

  useEffect(() => {
    if (currentLesson && currentLesson.id) {
      addToHistory(currentLesson.id);
      videoOpenedAt.current = Date.now();
      
      const localSavedTime = localStorage.getItem(`physflix_resume_${currentLesson.id}`);
      const firebaseSavedTime = videoStats[currentLesson.id]?.lastWatchedSeconds;
      
      let startSecs = 0;
      const threshold = totalSeconds > 0 ? totalSeconds - 30 : Infinity;

      if (localSavedTime && parseInt(localSavedTime) > 0 && parseInt(localSavedTime) < threshold) {
        startSecs = parseInt(localSavedTime);
      } else if (firebaseSavedTime && firebaseSavedTime > 0 && firebaseSavedTime < threshold) {
        startSecs = firebaseSavedTime;
      }
      
      setCurrentStartSeconds(startSecs);
      
      if (currentLesson.youtubeId) {
        setIframeSrc(`https://www.youtube.com/embed/${currentLesson.youtubeId}?start=${startSecs}&rel=0&modestbranding=1&autoplay=1&controls=1`);
      } else if (currentLesson.driveId) {
        const driveUrl = `https://drive.google.com/file/d/${deobfuscateId(currentLesson.driveId)}/preview`;
        setIframeSrc(`${driveUrl}?t=${startSecs}s`);
      }
    }
    
    // Auto-scroll screen to video player
    const screenTimer = setTimeout(() => {
      if (window.innerWidth < 768 && containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
    
    return () => clearTimeout(screenTimer);
  }, [currentLesson]);

  // Track and save video progress continuously for Auto-Resume
  useEffect(() => {
    if (!currentLesson || !currentLesson.id || currentLesson.isPendingUpload) return;
    
    let ticks = 0;
    const interval = setInterval(() => {
      ticks++;
      const elapsedSecs = Math.floor((Date.now() - videoOpenedAt.current) / 1000);
      const currentProgress = currentStartSeconds + elapsedSecs;
      
      localStorage.setItem(`physflix_resume_${currentLesson.id}`, currentProgress.toString());
      
      if (ticks >= 12) {
        updateResumeTime(currentLesson.id, currentProgress, 0, watchableDuration);
        ticks = 0;
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
      if (currentLesson && currentLesson.id) {
        const timeSpent = Math.floor((Date.now() - videoOpenedAt.current) / 1000);
        const currentProgress = currentStartSeconds + timeSpent;
        updateResumeTime(currentLesson.id, currentProgress, 0, watchableDuration);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLesson, currentStartSeconds, watchableDuration]);

  const [activeTab, setActiveTab] = useState<"overview" | "notes" | "qa">("overview");
  const [sidebarTab, setSidebarTab] = useState<"playlist" | "tools" | "quiz">("playlist");
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareText, setShareText] = useState("Kongsi");
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  // Auto-scroll to currently playing video in playlist
  useEffect(() => {
    if (sidebarTab === "playlist") {
      const scrollTimer = setTimeout(() => {
        const el = document.getElementById("current-playing-video");
        const container = document.getElementById("playlist-container");
        if (el && container) {
          container.scrollTo({
            top: el.offsetTop - container.offsetTop - 20,
            behavior: 'smooth'
          });
        }
      }, 200);
      return () => clearTimeout(scrollTimer);
    }
  }, [sidebarTab, currentLesson.id]);

  const getBaseLikes = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
    return 1200 + (Math.abs(hash) % 4000);
  };

  useEffect(() => {
    if (!currentLesson?.id) return;
    
    const localLiked = localStorage.getItem(`liked_${currentLesson.id}`) === "true";
    setLiked(localLiked);

    const fetchLikes = async () => {
      const baseLikes = getBaseLikes(currentLesson.id);
      if (!isSupabaseConfigured) {
        setLikeCount(baseLikes + (localLiked ? 1 : 0));
        return;
      }

      try {
        const { data, error } = await supabase
          .from("video_stats")
          .select("likes")
          .eq("id", currentLesson.id)
          .maybeSingle();

        if (error) {
          setLikeCount(baseLikes + (localLiked ? 1 : 0));
        } else if (data && typeof data.likes === "number") {
          setLikeCount(data.likes);
        } else {
          await supabase.from("video_stats").upsert({
            id: currentLesson.id,
            likes: baseLikes,
            updated_at: new Date().toISOString(),
          });
          setLikeCount(baseLikes + (localLiked ? 1 : 0));
        }
      } catch (e) {
        setLikeCount(baseLikes + (localLiked ? 1 : 0));
      }
    };
    fetchLikes();
  }, [currentLesson]);

  const [comments, setComments] = useState([
    { name: "Ahmad Rizky", text: "Terbaik Cikgu! Sangat jelas dan mudah difahami.", time: "2 jam lepas" },
    { name: "Siti Sarah", text: "Penerangan padat dan contoh soalan SPM sangat membantu!", time: "5 jam lepas" },
    { name: "Cikgu Tan", text: "Sangat sesuai untuk ulangkaji murid SPM.", time: "1 hari lepas" }
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLike = async () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    const newCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);
    setLikeCount(newCount);
    localStorage.setItem(`liked_${currentLesson.id}`, newLikedState ? "true" : "false");
    
    if (isSupabaseConfigured) {
      try {
        await supabase.from("video_stats").upsert({
          id: currentLesson.id,
          likes: newCount,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("Error updating likes in Supabase", e);
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: currentLesson.titleBm,
      text: "Jom tonton video pengajaran Fizik ini di PhysFlix!",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareText("Tersalin!");
        setTimeout(() => setShareText("Kongsi"), 2000);
      }
    } catch (err) {
      console.error("Error sharing", err);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([{ name: "Pelajar Fizik", text: newComment, time: "Baru sahaja" }, ...comments]);
    setNewComment("");
  };

  return (
    <div className="w-full space-y-4 md:space-y-6 select-none">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#121622] hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-red-500" />
          <span className="font-bold text-slate-200">Kembali</span>
        </button>

        {user?.email && (
          <span className="text-[10px] text-slate-500 opacity-40 select-all hidden sm:inline">{user.email}</span>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
          <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
            <Lock className="w-3 h-3" />
            <span>HD Stream</span>
          </span>
          <span>•</span>
          <span className="text-red-400">
            {lang === "bm" ? currentLesson.chapterBm : currentLesson.chapterDlp}
          </span>
        </div>
      </div>

      {/* Main Grid: Player on Left, Playlist/Tools on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Video Player & Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Outer Wrapper */}
          <div
            ref={containerRef}
            className={`mx-auto bg-black flex items-center justify-center shadow-2xl ${
              isFullscreen ? "fixed inset-0 z-[100] h-[100dvh] w-screen rounded-none" : "relative w-full border border-slate-800 rounded-xl overflow-hidden aspect-[4/3] md:aspect-video"
            }`}
          >
            {/* Mobile Fullscreen Back Button */}
            {isFullscreen && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="absolute top-4 left-4 z-[110] bg-black/60 hover:bg-black/80 text-white p-3 rounded-full md:hidden flex items-center justify-center border border-white/20 shadow-xl cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}

            {/* Inner Container - 16:9 Aspect Ratio */}
            <div 
              className="relative overflow-hidden bg-black w-full h-full flex items-center justify-center"
              style={isFullscreen ? { 
                aspectRatio: '16/9',
                maxWidth: '177.778vh',
                maxHeight: '56.25vw'
              } : {
                aspectRatio: '16/9',
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            >
              {currentLesson.form === 5 || currentLesson.isPendingUpload || !currentLesson.youtubeId ? (
                <div className="absolute inset-0 z-30 bg-gradient-to-br from-[#0e1320] via-[#090c15] to-[#04060a] flex flex-col items-center justify-center p-6 text-center space-y-4 md:space-y-6">
                  {/* Subtle Grid / glow */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]"></div>

                  {/* Icon Card */}
                  <div className="relative z-10 w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-red-950/40 border border-red-500/40 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.25)]">
                    <Video className="w-8 h-8 md:w-10 md:h-10 text-red-400 animate-pulse" />
                  </div>

                  {/* Text Details */}
                  <div className="relative z-10 space-y-2 max-w-xl px-2">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] md:text-xs font-black uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === "bm" ? "Tingkatan 5 • Sedang Diproses" : "Form 5 • Processing"}</span>
                    </div>
                    
                    <h2 className="text-base sm:text-xl md:text-2xl font-black text-white tracking-tight">
                      {lang === "bm" 
                        ? "Video Pembelajaran Akan Dimuat Naik Dalam Masa Terdekat" 
                        : "Lesson Video Will Be Uploaded Soon"}
                    </h2>
                    
                    <p className="text-[11px] sm:text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
                      {lang === "bm"
                        ? `Rakaman video pengajaran bagi topik "${currentLesson.titleBm}" sedang disediakan. Anda boleh membaca nota ringkas, menyemak DSKP atau mencuba kuiz "Uji Minda" di panel sebelah!`
                        : `Video recording for "${currentLesson.titleDlp}" is being prepared. You can read summary notes, check DSKP or try the "Uji Minda" quiz on the side panel!`}
                    </p>
                  </div>

                  {/* Interactive Quick Links */}
                  <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 pt-1">
                    <button
                      onClick={() => setSidebarTab("quiz")}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-lg shadow-purple-950/80 flex items-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <Brain className="w-4 h-4" />
                      <span>{lang === "bm" ? "Mula Kuiz Uji Minda" : "Start Quiz"}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("notes")}
                      className="px-4 py-2.5 rounded-xl bg-[#151b2a] hover:bg-slate-800 text-slate-200 text-xs font-bold transition border border-slate-700/80 flex items-center space-x-2 cursor-pointer active:scale-95"
                    >
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <span>{lang === "bm" ? "Buka Nota Ringkas" : "Open Notes"}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <iframe
                  ref={iframeRef}
                  src={iframeSrc}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  title={currentLesson.titleBm}
                ></iframe>
              )}
            </div>
          </div>

          {/* Video Header & Actions */}
          <div className="space-y-4">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-2">
                {lang === "bm" ? currentLesson.titleBm : currentLesson.titleDlp}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {lang === "bm" ? `Tingkatan ${currentLesson.form} • ${currentLesson.chapterBm}` : `Form ${currentLesson.form} • ${currentLesson.chapterDlp}`}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-4 pt-2 border-t border-b border-slate-800/80 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex items-center bg-[#131826] rounded-full border border-slate-800 p-0.5">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                      liked ? "bg-red-600 text-white" : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{likeCount}</span>
                  </button>
                  <button className="px-2.5 py-1.5 text-slate-400 hover:text-white border-l border-slate-800 cursor-pointer">
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button 
                  onClick={handleShare}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-[#131826] hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{shareText === "Kongsi" ? t("btnShare") : shareText}</span>
                </button>

                <button
                  onClick={() => toggleBookmark(currentLesson.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                    isBookmarked(currentLesson.id)
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-[#131724] hover:bg-[#1a2133] text-slate-300 border border-slate-800"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked(currentLesson.id) ? "fill-current" : ""}`} />
                  <span>{isBookmarked(currentLesson.id) ? t("saved") : t("save")}</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20 text-sm font-semibold transition cursor-pointer"
                >
                  <Maximize className="w-4 h-4" />
                  <span className="hidden sm:inline">Skrin Penuh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detail Tabs Section */}
          <div className="space-y-4">
            <div className="flex overflow-x-auto hide-scrollbar border-b border-slate-800 gap-4 md:gap-6 text-sm font-bold">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 whitespace-nowrap transition cursor-pointer ${
                  activeTab === "overview"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t("tabOverview")}
              </button>
              <button
                onClick={() => setActiveTab("notes")}
                className={`pb-3 whitespace-nowrap transition cursor-pointer ${
                  activeTab === "notes"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t("tabNotes")}
              </button>
              <button
                onClick={() => setActiveTab("qa")}
                className={`pb-3 whitespace-nowrap transition cursor-pointer ${
                  activeTab === "qa"
                    ? "border-b-2 border-red-500 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t("tabQA")}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#111624] border border-slate-800 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {t("whatYoullLearn")}
                  </h3>
                  <ul className="space-y-2">
                    {(lang === "bm" ? currentLesson.learningPointsBm : currentLesson.learningPointsDlp).map(
                      (point, i) => (
                        <li key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[#111624] border border-slate-800 space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {t("keyConcepts")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(lang === "bm" ? currentLesson.keyConceptsBm : currentLesson.keyConceptsDlp).map(
                      (concept, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedConcept(selectedConcept === concept ? null : concept)}
                          className={`px-3 py-1 border rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                            selectedConcept === concept
                              ? "bg-red-600 border-red-500 text-white"
                              : "bg-[#1a2133] border-slate-700/60 text-slate-200 hover:bg-slate-800 hover:text-white"
                          }`}
                        >
                          {concept}
                        </button>
                      )
                    )}
                  </div>
                  {selectedConcept && (
                    <div className="mt-3 p-4 bg-slate-900/80 border border-slate-700 rounded-xl relative animate-in fade-in slide-in-from-top-2 duration-300">
                      <h4 className="text-sm font-bold text-red-400 mb-1">{selectedConcept}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {conceptDefinitions[selectedConcept] || 
                          (lang === "bm" 
                            ? "Definisi untuk konsep ini akan dikemas kini kelak mengikut silibus SPM." 
                            : "The definition for this concept will be updated soon according to the SPM syllabus.")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="p-5 rounded-2xl bg-[#111624] border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed">
                <h3 className="text-sm font-bold text-white">
                  Nota Ringkas & Formula SPM
                </h3>
                <p>
                  1. Perhatikan tanda positif dan negatif bagi pembolehubah dan rumus fizik.
                </p>
                <p>
                  2. Rujuk Standard Pembelajaran (DSKP) untuk memahami kata kunci pemarkahan SPM.
                </p>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="p-5 rounded-2xl bg-[#111624] border border-slate-800 space-y-4">
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tanya soalan tentang video ini..."
                    className="flex-1 px-4 py-2 bg-[#171e2e] border border-slate-700/60 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Hantar
                  </button>
                </form>

                <div className="space-y-3 pt-2">
                  {comments.map((c, i) => (
                    <div key={i} className="p-3 bg-[#161c2c] border border-slate-800 rounded-xl space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-slate-200">{c.name}</span>
                        <span>{c.time}</span>
                      </div>
                      <p className="text-xs text-slate-300">{c.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar (Playlist / Learning Tools) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-3xl bg-[#101420] border border-slate-800/80 shadow-2xl space-y-5">
            {/* Playlist vs Learning Tools Switch */}
            <div className="flex bg-[#161c2b] p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setSidebarTab("playlist")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  sidebarTab === "playlist"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t("tabPlaylist")}
              </button>
              <button
                onClick={() => setSidebarTab("tools")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  sidebarTab === "tools"
                    ? "bg-red-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {t("tabLearningTools")}
              </button>
            </div>

            {/* Uji Minda Quiz Section */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-950/40 to-slate-900 border border-purple-800/40 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Uji Minda</h4>
                  <p className="text-[10px] text-slate-400">Latihan Kuiz Interaktif Fizik</p>
                </div>
              </div>

              <button
                onClick={() => setSidebarTab(sidebarTab === "quiz" ? "playlist" : "quiz")}
                className={`w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-white font-bold text-xs transition shadow-lg cursor-pointer ${
                  sidebarTab === "quiz"
                    ? "bg-slate-700 hover:bg-slate-600 shadow-slate-900"
                    : "bg-purple-600 hover:bg-purple-500 shadow-purple-950"
                }`}
              >
                <span>{sidebarTab === "quiz" ? "Tutup Kuiz" : "Mula Kuiz"}</span>
              </button>
            </div>

            {sidebarTab === "quiz" && (
              <QuizComponent key={currentLesson.titleBm} currentLesson={currentLesson} />
            )}

            {/* Chapters / Videos Playlist */}
            {sidebarTab === "playlist" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {t("tabChapters")} ({allVideoLessons.length} Video)
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold">{t("hide")}</span>
                </div>

                <div id="playlist-container" className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {allVideoLessons.map((lesson, idx) => {
                    const isCurrent = lesson.id === currentLesson.id;
                    return (
                      <div
                        key={lesson.id}
                        id={isCurrent ? "current-playing-video" : undefined}
                        onClick={() => onSelectLesson(lesson)}
                        className={`group cursor-pointer p-3 rounded-2xl border transition flex items-center space-x-3 ${
                          isCurrent
                            ? "bg-red-950/40 border-red-600/80 ring-1 ring-red-500/40"
                            : "bg-[#141a28] hover:bg-[#1a2234] border-slate-800/80"
                        }`}
                      >
                        {/* Mini Thumbnail */}
                        <div className="relative w-20 h-12 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 border border-white/5">
                          {lesson.thumbnailUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={lesson.thumbnailUrl}
                              alt={lesson.titleBm}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">{idx + 1}</span>
                          )}
                          {isCurrent && (
                            <div className="absolute inset-0 bg-red-950/60 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 fill-white text-white" />
                            </div>
                          )}
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex-1 overflow-hidden">
                          <span className="text-[9px] font-bold text-red-400 block">
                            {lesson.week}
                          </span>
                          <h5
                            className={`text-xs font-bold truncate ${
                              isCurrent ? "text-red-400" : "text-slate-200 group-hover:text-white"
                            }`}
                          >
                            {lang === "bm" ? lesson.titleBm : lesson.titleDlp}
                          </h5>
                          <span className="text-[10px] text-slate-400">{lesson.duration}</span>
                        </div>

                        {/* Completion Icon */}
                        <div>
                          {idx < 3 ? (
                            <CheckCircle2 className="w-4 h-4 text-red-500" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
