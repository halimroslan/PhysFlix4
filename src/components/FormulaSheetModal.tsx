"use client";

import React, { useState, useMemo } from "react";
import { X, Search, Copy, Check, Filter, Sparkles, Sigma } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { allFormulas, FormulaItem } from "@/data/formulaData";

export const FormulaSheetModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedForm, setSelectedForm] = useState<number | "all">("all");
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Available chapters based on form selection
  const availableChapters = useMemo(() => {
    const subset = selectedForm === "all"
      ? allFormulas
      : allFormulas.filter((f) => f.form === selectedForm);

    const map = new Map<number, { num: number; form: number; bm: string; dlp: string }>();
    subset.forEach((f) => {
      if (!map.has(f.chapterNum)) {
        map.set(f.chapterNum, {
          num: f.chapterNum,
          form: f.form,
          bm: f.chapterBm,
          dlp: f.chapterDlp
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.num - b.num);
  }, [selectedForm]);

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allFormulas.filter((item) => {
      if (selectedForm !== "all" && item.form !== selectedForm) return false;
      if (selectedChapter !== "all" && item.chapterNum !== selectedChapter) return false;
      if (!q) return true;
      return (
        item.formula.toLowerCase().includes(q) ||
        item.topicBm.toLowerCase().includes(q) ||
        item.topicDlp.toLowerCase().includes(q) ||
        item.variablesBm.toLowerCase().includes(q) ||
        item.variablesDlp.toLowerCase().includes(q) ||
        item.symbol.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    });
  }, [search, selectedForm, selectedChapter]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const t4Count = allFormulas.filter((f) => f.form === 4).length;
  const t5Count = allFormulas.filter((f) => f.form === 5).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0b0f19] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#080c14]">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
              <Sigma className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                {lang === "bm" ? "Helaian Formula Fizik SPM" : "SPM Physics Formula Sheet"}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {lang === "bm"
                  ? "Rujukan lengkap formula, unit S.I, simbol & kuantiti KSSM Tingkatan 4 & 5"
                  : "Complete reference for KSSM Form 4 & 5 formulas, S.I units, symbols & quantities"}
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
                  ? "Cari formula (cth: F=ma, v=u+at, E=mc2, n=sini/sinr, Boyle)..."
                  : "Search formula (e.g. F=ma, v=u+at, E=mc2, Snell)..."
              }
              className="w-full pl-10 pr-10 py-2.5 bg-[#141b2d] border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition shadow-inner"
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
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Semua ({allFormulas.length})
              </button>
              <button
                onClick={() => { setSelectedForm(4); setSelectedChapter("all"); }}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedForm === 4
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Tingkatan 4 ({t4Count})
              </button>
              <button
                onClick={() => { setSelectedForm(5); setSelectedChapter("all"); }}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  selectedForm === 5
                    ? "bg-rose-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Tingkatan 5 ({t5Count})
              </button>
            </div>

            {/* Chapter Dropdown */}
            {selectedForm !== "all" && (
              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="bg-[#141b2d] text-slate-200 border border-slate-700/70 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-rose-500"
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

            {/* Result count */}
            <div className="text-slate-400 text-[11px] font-medium ml-auto">
              {filteredFormulas.length} formula dijumpai
            </div>
          </div>
        </div>

        {/* Formula Cards List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredFormulas.length === 0 ? (
            <div className="py-20 text-center text-slate-500 space-y-3">
              <Sigma className="w-12 h-12 mx-auto opacity-30" />
              <p className="text-sm font-semibold text-slate-400">Tiada formula yang sepadan dengan carian anda.</p>
              <p className="text-xs text-slate-500">Cuba cari dengan kata kunci lain seperti &quot;Daya&quot;, &quot;Tenaga&quot;, atau &quot;v=u+at&quot;.</p>
            </div>
          ) : (
            filteredFormulas.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#111726] border border-slate-800/80 hover:border-rose-500/40 hover:bg-[#131b2e] transition-all duration-200 shadow-lg space-y-3.5 group"
              >
                {/* Header: Badges & Topic Title */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-[240px]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-bold">
                        T{item.form} Bab {item.chapterNum}: {lang === "bm" ? item.chapterBm : item.chapterDlp}
                      </span>
                      {item.unit && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
                          Unit: {item.unit}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-300 transition">
                      {lang === "bm" ? item.topicBm : item.topicDlp}
                      {lang === "bm" && item.topicDlp !== item.topicBm && (
                        <span className="ml-2 text-xs font-normal text-slate-400 italic">({item.topicDlp})</span>
                      )}
                    </h3>
                  </div>

                  {/* Formula Display Box + Copy Button */}
                  <div className="flex items-center space-x-2 bg-[#090d17] px-4 py-2.5 rounded-xl border border-slate-800/90 shadow-inner min-w-[200px] justify-between group-hover:border-rose-500/30 transition">
                    <code className="text-sm sm:text-base font-mono font-extrabold text-rose-400 tracking-wide select-all">
                      {item.formula}
                    </code>
                    <button
                      onClick={() => handleCopy(item.id, item.formula)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition flex-shrink-0"
                      title="Salin formula"
                      aria-label="Salin formula"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Variables Definition */}
                <div className="bg-[#0a0e1a]/90 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">
                    {lang === "bm" ? "Keterangan Pembolehubah / Simbol:" : "Variables & Symbols Breakdown:"}
                  </span>
                  <p className="leading-relaxed font-mono text-[11px] text-slate-300">
                    {lang === "bm" ? item.variablesBm : item.variablesDlp}
                  </p>
                </div>

                {/* Notes if available */}
                {item.notes && (
                  <div className="flex items-start space-x-2 text-[11px] text-slate-400 bg-blue-950/20 border border-blue-900/30 p-2.5 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed"><strong className="text-slate-300">Catatan Konsep:</strong> {item.notes}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#080c14] flex items-center justify-between text-xs text-slate-400">
          <span>Helaian Formula Fizik SPM (KSSM)</span>
          <span>Jumlah Keseluruhan: <strong className="text-white">{allFormulas.length} Formula</strong></span>
        </div>

      </div>
    </div>
  );
};
