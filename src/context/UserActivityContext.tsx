"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface VideoStat {
  totalTimeWatched: number;
  repeats: number;
  completionPercentage: number;
  lastWatchedSeconds?: number;
  lastUpdatedTimestamp?: number;
}

export interface VideoStatsMap {
  [driveId: string]: VideoStat;
}

interface UserActivityContextType {
  bookmarks: string[];
  watchHistory: string[];
  videoStats: VideoStatsMap;
  toggleBookmark: (driveId: string) => void;
  addToHistory: (driveId: string) => void;
  isBookmarked: (driveId: string) => boolean;
  updateVideoProgress: (driveId: string, timeSpentInSeconds: number, watchableDuration: number) => void;
  updateResumeTime: (driveId: string, timeInSeconds: number, minStartSecs: number, watchableDuration: number) => void;
  incrementRepeat: (driveId: string) => void;
}

const UserActivityContext = createContext<UserActivityContextType | undefined>(undefined);

export const UserActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [watchHistory, setWatchHistory] = useState<string[]>([]);
  const [videoStats, setVideoStats] = useState<VideoStatsMap>({});
  
  const isUpdatingSupabase = useRef(false);
  const dataLoadedFromRemote = useRef(false);

  // Helper to clean stats
  const sanitizeVideoStats = (stats: any): VideoStatsMap => {
    if (!stats || typeof stats !== "object") return {};
    const sanitized: VideoStatsMap = {};
    for (const [key, val] of Object.entries(stats)) {
      const stat = val as VideoStat;
      if (stat && typeof stat === "object") {
        if (stat.repeats > 50) {
          stat.repeats = 0;
          stat.totalTimeWatched = 0;
        }
        sanitized[key] = stat;
      }
    }
    return sanitized;
  };

  // Load from LocalStorage for instantaneous UI, then fetch from Supabase
  useEffect(() => {
    if (user) {
      dataLoadedFromRemote.current = false;
      const userKey = user.uid || user.id;

      // 1. Quick load from localStorage cache
      const storedBookmarks = localStorage.getItem(`bookmarks_${userKey}`);
      if (storedBookmarks) {
        try { setBookmarks(JSON.parse(storedBookmarks)); } catch (e) {}
      }

      const storedHistory = localStorage.getItem(`history_${userKey}`);
      if (storedHistory) {
        try { setWatchHistory(JSON.parse(storedHistory)); } catch (e) {}
      }

      const storedStats = localStorage.getItem(`videoStats_${userKey}`);
      if (storedStats) {
        try { setVideoStats(sanitizeVideoStats(JSON.parse(storedStats))); } catch (e) {}
      }

      // 2. Supabase Sync
      const fetchFromSupabase = async () => {
        if (!isSupabaseConfigured) {
          dataLoadedFromRemote.current = true;
          return;
        }

        try {
          const { data, error } = await supabase
            .from("user_activity")
            .select("bookmarks, watch_history, video_stats")
            .eq("user_id", userKey)
            .maybeSingle();

          if (error) {
            console.warn("Supabase fetch error, using local data:", error);
          } else if (data) {
            if (Array.isArray(data.bookmarks)) setBookmarks(data.bookmarks);
            if (Array.isArray(data.watch_history)) setWatchHistory(data.watch_history);
            if (data.video_stats) setVideoStats(sanitizeVideoStats(data.video_stats));
          }
        } catch (err) {
          console.warn("Error fetching Supabase activity:", err);
        } finally {
          dataLoadedFromRemote.current = true;
        }
      };

      fetchFromSupabase();
    } else {
      setBookmarks([]);
      setWatchHistory([]);
      setVideoStats({});
      dataLoadedFromRemote.current = false;
    }
  }, [user]);

  // Save to LocalStorage & Supabase whenever they change
  useEffect(() => {
    if (user && dataLoadedFromRemote.current) {
      const userKey = user.uid || user.id;

      localStorage.setItem(`bookmarks_${userKey}`, JSON.stringify(bookmarks));
      localStorage.setItem(`history_${userKey}`, JSON.stringify(watchHistory));
      localStorage.setItem(`videoStats_${userKey}`, JSON.stringify(videoStats));
      
      // Update Supabase
      const syncToSupabase = async () => {
        if (!isSupabaseConfigured || isUpdatingSupabase.current) return;
        
        isUpdatingSupabase.current = true;
        try {
          await supabase.from("user_activity").upsert({
            user_id: userKey,
            bookmarks,
            watch_history: watchHistory,
            video_stats: videoStats,
            updated_at: new Date().toISOString(),
          }, { onConflict: "user_id" });
        } catch (error) {
          console.error("Error syncing to Supabase:", error);
        } finally {
          setTimeout(() => {
            isUpdatingSupabase.current = false;
          }, 300);
        }
      };
      
      syncToSupabase();
    }
  }, [bookmarks, watchHistory, videoStats, user]);

  const toggleBookmark = (driveId: string) => {
    setBookmarks((prev) => {
      if (prev.includes(driveId)) {
        return prev.filter((id) => id !== driveId);
      } else {
        return [...prev, driveId];
      }
    });
  };

  const addToHistory = (driveId: string) => {
    setWatchHistory((prev) => {
      const filtered = prev.filter((id) => id !== driveId);
      return [driveId, ...filtered].slice(0, 50);
    });
  };

  const incrementRepeat = (driveId: string) => {
    setVideoStats((prev) => {
      const current = prev[driveId] || { totalTimeWatched: 0, repeats: 0, completionPercentage: 0 };
      return {
        ...prev,
        [driveId]: {
          ...current,
          repeats: current.repeats + 1,
        },
      };
    });
  };

  const updateVideoProgress = (driveId: string, timeSpentInSeconds: number, watchableDuration: number) => {
    if (timeSpentInSeconds < 5) return;

    setVideoStats((prev) => {
      const current = prev[driveId] || { totalTimeWatched: 0, repeats: 0, completionPercentage: 0 };
      let newTotalTime = current.totalTimeWatched + timeSpentInSeconds;
      
      if (newTotalTime > watchableDuration * 50) {
        newTotalTime = watchableDuration;
      }
      
      let newCompletion = Math.round((newTotalTime / watchableDuration) * 100);
      if (newCompletion > 100) newCompletion = 100;

      if (newCompletion < current.completionPercentage && current.completionPercentage !== 100) {
        newCompletion = current.completionPercentage;
      }
      
      const calculatedRepeats = Math.floor(newTotalTime / (watchableDuration * 0.95));
      const newRepeats = calculatedRepeats > current.repeats || current.repeats > 50 ? calculatedRepeats : current.repeats;

      return {
        ...prev,
        [driveId]: {
          ...current,
          totalTimeWatched: newTotalTime,
          completionPercentage: newCompletion,
          repeats: newRepeats,
          lastUpdatedTimestamp: Date.now(),
        },
      };
    });
  };

  const updateResumeTime = (driveId: string, timeInSeconds: number, minStartSecs: number, watchableDuration: number) => {
    setVideoStats((prev) => {
      const current = prev[driveId] || { totalTimeWatched: 0, repeats: 0, completionPercentage: 0 };
      
      const watchedAmount = Math.max(0, timeInSeconds - minStartSecs);
      let newCompletion = Math.round((watchedAmount / watchableDuration) * 100);
      if (newCompletion > 100) newCompletion = 100;

      if (newCompletion < current.completionPercentage && current.completionPercentage !== 100) {
        newCompletion = current.completionPercentage;
      }
      
      return {
        ...prev,
        [driveId]: {
          ...current,
          lastWatchedSeconds: timeInSeconds,
          completionPercentage: newCompletion,
          lastUpdatedTimestamp: Date.now(),
        },
      };
    });
  };

  const isBookmarked = (driveId: string) => {
    return bookmarks.includes(driveId);
  };

  return (
    <UserActivityContext.Provider
      value={{
        bookmarks,
        watchHistory,
        videoStats,
        toggleBookmark,
        addToHistory,
        isBookmarked,
        updateVideoProgress,
        updateResumeTime,
        incrementRepeat,
      }}
    >
      {children}
    </UserActivityContext.Provider>
  );
};

export const useUserActivity = () => {
  const context = useContext(UserActivityContext);
  if (context === undefined) {
    throw new Error("useUserActivity must be used within a UserActivityProvider");
  }
  return context;
};
