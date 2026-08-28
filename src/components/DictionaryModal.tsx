"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Book, ArrowRightLeft, Sparkles, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { allKamusTerms, DictTerm } from "@/data/kamusData";

export const DictionaryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedForm, setSelectedForm] = useState<number | "all">("all");
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");

  // Get available chapters for the selected form
  const availableChapters = useMemo(() => {
    const subset = selectedForm === "all" 
      ? allKamusTerms 
      : allKamusTerms.filter((t) => t.form === selectedForm);
    
    const map = new Map<number, { num: number; form: number; bm: string; dlp: string }>();
    subset.forEach((t) => {
      if (!map.has(t.chapterNum)) {
        map.set(t.chapterNum, {
          num: t.chapterNum,
          form: t.form,
          bm: t.chapterBm,
          dlp: t.chapterDlp
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.num - b.num);
  }, [selectedForm]);

  // Filter terms based on search, form, and chapter
  const filteredTerms = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allKamusTerms.filter((item) => {
      // Form filter
      if (selectedForm !== "all" && item.form !== selectedForm) return false;
      // Chapter filter
      if (selectedChapter !== "all" && item.chapterNum !== selectedChapter) return false;
      // Search query
      if (!q) return true;
      return (
        item.bm.toLowerCase().includes(q) ||
        item.dlp.toLowerCase().includes(q) ||
        item.defBm.toLowerCase().includes(q) ||
        item.defDlp.toLowerCase().includes(q) ||
        (item.symbol && item.symbol.toLowerCase().includes(q)) ||
        (item.sk && item.sk.toLowerCase().includes(q))
      );
    });
  }, [search, selectedForm, selectedChapter]);

  if (!isOpen) return null;

  const t4Count = allKamusTerms.filter((t) => t.form === 4).length;
  const t5Count = allKamusTerms.filter((t) => t.form === 5).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0b0f19] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080c14]">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
              <Book className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                  {lang === "bm" ? "Kamus Fizik SPM (BM ↔ DLP)" : "SPM Physics Dictionary (BM ↔ DLP)"}
                </h2>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  Modul TasFiz
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {lang === "bm"
                  ? "Glosari 100% Rasmi KSSM Tingkatan 4 & Tingkatan 5 daripada Modul TasFiz (Sir Halim)"
                  : "Official 100% KSSM Form 4 & Form 5 Glossary from Modul TasFiz (Sir Halim)"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-[#0d121f] space-y-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "bm"
                  ? "Cari istilah, hukum, prinsip atau definisi (cth: Inersia, Resonans, Total Internal Reflection)..."
                  : "Search terms, laws, principles or definitions..."
              }
              className="w-full pl-10 pr-10 py-2.5 bg-[#141b2d] border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Form & Chapter Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            {/* Form Toggle */}
            <div className="flex items-center space-x-1.5 bg-[#141b2d] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => { setSelectedForm("all"); setSelectedChapter("all"); }}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedForm === "all"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Semua ({allKamusTerms.length})
              </button>
              <button
                onClick={() => { setSelectedForm(4); setSelectedChapter("all"); }}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedForm === 4
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Tingkatan 4 ({t4Count})
              </button>
              <button
                onClick={() => { setSelectedForm(5); setSelectedChapter("all"); }}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedForm === 5
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Tingkatan 5 ({t5Count})
              </button>
            </div>

            {/* Chapter Dropdown if form selected */}
            {selectedForm !== "all" && (
              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="bg-[#141b2d] text-slate-200 border border-slate-700/70 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Semua Bab Tingkatan {selectedForm}</option>
                  {availableChapters.map((ch) => (
                    <option key={ch.num} value={ch.num}>
                      Bab {ch.num}: {lang === "bm" ? ch.bm : ch.dlp}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Count indicator */}
            <div className="text-slate-400 text-[11px] font-medium ml-auto">
              {filteredTerms.length} istilah dijumpai
            </div>
          </div>
        </div>

        {/* Term Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="py-20 text-center text-slate-500 space-y-3">
              <Book className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-sm font-semibold text-slate-400">Tiada istilah fizik yang sepadan dengan carian anda.</p>
              <p className="text-xs text-slate-500">Cuba cari dengan kata kunci lain seperti &quot;Hukum&quot;, &quot;Prinsip&quot;, atau &quot;Tenaga&quot;.</p>
            </div>
          ) : (
            filteredTerms.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#111726] border border-slate-800/80 hover:border-blue-500/40 hover:bg-[#131b2e] transition-all duration-200 shadow-lg space-y-3 group"
              >
                {/* Header row with badges & terms */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    {/* Chapter & SK Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                        T{item.form} Bab {item.chapterNum}: {item.chapterBm}
                      </span>
                      {item.sk && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold">
                          SK {item.sk}
                        </span>
                      )}
                      {item.symbol && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                          Simbol: {item.symbol}
                        </span>
                      )}
                    </div>

                    {/* Term Titles */}
                    <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-bold">
                      <span className="text-rose-400 group-hover:text-rose-300 transition">{item.bm}</span>
                      <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span className="text-cyan-400 group-hover:text-cyan-300 transition">{item.dlp}</span>
                    </div>
                  </div>
                </div>

                {/* Definitions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80">
                  <div className="bg-[#0a0e1a]/90 p-3.5 rounded-xl border border-slate-800/80 group-hover:border-slate-700/80 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 text-rose-400 font-bold mb-1.5 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                        <span>Definisi Bahasa Melayu (TasFiz):</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-normal">{item.defBm}</p>
                    </div>
                  </div>

                  <div className="bg-[#0a0e1a]/90 p-3.5 rounded-xl border border-slate-800/80 group-hover:border-slate-700/80 transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5 text-cyan-400 font-bold mb-1.5 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span>DLP English Definition:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-normal">{item.defDlp}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080c14] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sumber: <strong>Modul TasFiz (Tasmik Fizik - Formula & Definisi)</strong> oleh Sir Halim</span>
          </div>
          <span>Jumlah Keseluruhan: <strong>{allKamusTerms.length} Istilah</strong></span>
        </div>

      </div>
    </div>
  );
};
