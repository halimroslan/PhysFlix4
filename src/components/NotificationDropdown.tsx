"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Book, 
  Sigma, 
  FileText, 
  Sparkles, 
  CheckCheck, 
  X, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { initialNotifications, SystemNotification } from "@/data/notificationsData";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDict?: () => void;
  onOpenFormula?: () => void;
  onOpenCheatNote?: () => void;
  onUnreadCountChange?: (count: number) => void;
}

const STORAGE_KEY = "physflix_read_notifications_v2";

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onOpenDict,
  onOpenFormula,
  onOpenCheatNote,
  onUnreadCountChange
}) => {
  const { lang } = useLanguage();
  const [readIds, setReadIds] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load read status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setReadIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Compute unread count
  const unreadCount = initialNotifications.filter(n => !readIds.includes(n.id)).length;

  useEffect(() => {
    if (onUnreadCountChange) {
      onUnreadCountChange(unreadCount);
    }
  }, [unreadCount, onUnreadCountChange]);

  // Handle outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  };

  const markAllAsRead = () => {
    const allIds = initialNotifications.map(n => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allIds));
    } catch {
      // ignore
    }
  };

  const handleActionClick = (notif: SystemNotification) => {
    markAsRead(notif.id);
    onClose();
    if (notif.actionType === "openDict" && onOpenDict) {
      onOpenDict();
    } else if (notif.actionType === "openFormula" && onOpenFormula) {
      onOpenFormula();
    } else if (notif.actionType === "openCheatNote" && onOpenCheatNote) {
      onOpenCheatNote();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-[92vw] sm:w-[420px] max-w-[440px] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-[#0b101b]/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Top Indicator Arrow */}
        <div className="absolute -top-1.5 right-6 w-3 h-3 bg-[#0b101b] border-t border-l border-slate-700 transform rotate-45 z-10" />

        {/* Header */}
        <div className="p-4 border-b border-slate-800/90 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {lang === "bm" ? "Pemberitahuan Sistem" : "System Notifications"}
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded-full">
                    {unreadCount} {lang === "bm" ? "Baharu" : "New"}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === "bm" ? "Kemas kini & ciri terkini PhysFlix" : "Latest PhysFlix features & updates"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-slate-300 hover:text-white px-2 py-1 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700/60 transition flex items-center gap-1 cursor-pointer"
                title={lang === "bm" ? "Tanda semua telah dibaca" : "Mark all as read"}
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{lang === "bm" ? "Baca Semua" : "Read All"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-3 overflow-y-auto space-y-2.5 custom-scrollbar divide-y divide-slate-800/50">
          {initialNotifications.map((notif) => {
            const isRead = readIds.includes(notif.id);
            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`p-3.5 rounded-xl transition-all duration-200 relative group pt-3.5 ${
                  isRead 
                    ? "bg-slate-900/30 border border-slate-800/60 opacity-80 hover:opacity-100 hover:bg-slate-900/60" 
                    : "bg-[#121929] border border-slate-700/80 shadow-md ring-1 ring-white/5"
                }`}
              >
                {/* Unread dot */}
                {!isRead && (
                  <span className="absolute top-3.5 right-3.5 w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-500/20" />
                )}

                {/* Badge & Timestamp */}
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                      notif.badgeColor === "emerald"
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
                        : notif.badgeColor === "cyan"
                        ? "bg-cyan-950/80 text-cyan-300 border border-cyan-800/80"
                        : notif.badgeColor === "amber"
                        ? "bg-amber-950/80 text-amber-300 border border-amber-800/80"
                        : "bg-red-950/80 text-red-300 border border-red-800/80"
                    }`}
                  >
                    {lang === "bm" ? notif.badgeBm : notif.badgeDlp}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {lang === "bm" ? notif.timestampBm : notif.timestampDlp}
                  </span>
                </div>

                {/* Title */}
                <div className="flex items-start gap-2.5 mb-1.5">
                  <div className="mt-0.5 text-red-400 shrink-0">
                    {notif.icon === "Book" && <Book className="w-4 h-4 text-emerald-400" />}
                    {notif.icon === "Sigma" && <Sigma className="w-4 h-4 text-cyan-400" />}
                    {notif.icon === "FileText" && <FileText className="w-4 h-4 text-amber-400" />}
                    {notif.icon === "Sparkles" && <Sparkles className="w-4 h-4 text-purple-400" />}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {lang === "bm" ? notif.titleBm : notif.titleDlp}
                  </h4>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed pl-6 mb-3">
                  {lang === "bm" ? notif.descriptionBm : notif.descriptionDlp}
                </p>

                {/* Action CTA Button */}
                {notif.actionType !== "none" && (
                  <div className="pl-6">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActionClick(notif);
                      }}
                      className={`w-full sm:w-auto px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                        notif.badgeColor === "emerald"
                          ? "bg-emerald-600/90 hover:bg-emerald-500 text-white"
                          : notif.badgeColor === "cyan"
                          ? "bg-cyan-600/90 hover:bg-cyan-500 text-white"
                          : notif.badgeColor === "amber"
                          ? "bg-amber-600/90 hover:bg-amber-500 text-white"
                          : "bg-red-600/90 hover:bg-red-500 text-white"
                      }`}
                    >
                      <span>{lang === "bm" ? notif.actionLabelBm : notif.actionLabelDlp}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 text-center shrink-0">
          <p className="text-[11px] text-slate-400 font-medium">
            PhysicsSPMFlix • {lang === "bm" ? "Modul Rasmi TasFiz & CheatNote Fizik SPM" : "Official Modul TasFiz & SPM CheatNote"}
          </p>
        </div>
      </div>
    </div>
  );
};
