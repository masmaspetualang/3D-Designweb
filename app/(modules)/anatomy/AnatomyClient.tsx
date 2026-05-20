"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Heart } from "lucide-react";
import { AnatomyPart } from "@/core/types";
import useHeartStore from "@/store/heartStore";
import { useUISound } from "@/hooks/useUISound";
import { useGLTF } from "@react-three/drei";

// Trigger GLB preload IMMEDIATELY when this module loads
useGLTF.preload("/models/heart.glb");

const AnatomyCanvas = dynamic(
  () => import("@/components/3d/AnatomyCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-[var(--bg-main)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--color-accent-secondary)] border-t-transparent animate-spin" />
          <p className="text-[10px] text-[var(--text-secondary)] font-bold tracking-widest uppercase">Memuat Model 3D...</p>
        </div>
      </div>
    ),
  }
);

const HEART_POSITION: [number, number, number] = [0, 0, 0];
const HEART_SCALE = 5;

export default function AnatomyClient({ anatomyParts }: { anatomyParts: AnatomyPart[] }) {
  const [selectedPart, setSelectedPart] = useState<AnatomyPart | null>(null);
  const [canvasKey, setCanvasKey] = useState(0);
  const { layerVisibility, setLayerVisibility, isSidebarVisible, toggleSidebar } = useHeartStore();
  const { playHover, playClick } = useUISound();
  const [mobileTab, setMobileTab] = useState<"3d" | "list">("3d");

  return (
    <div className="flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)]"
      style={{ minHeight: "100vh" }}
    >
      {/* ─── HEADER ───────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-[var(--bg-main)] border-b border-[var(--border-light)] flex-shrink-0 z-50">
        <div className="flex items-center gap-3 md:gap-4">
          <div>
            <p className="text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest">Modul 01</p>
            <h1 className="text-base md:text-xl font-bold text-[var(--text-primary)] mt-0.5">Anatomi Struktural</h1>
          </div>
          <div className="h-8 w-px bg-[var(--border-light)] mx-1 md:mx-2" />
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-2 bg-[var(--bg-panel)] px-3 py-1.5 border border-[var(--border-light)] hover:bg-[var(--bg-hover)] transition-all"
          >
            <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-tight">
              {isSidebarVisible ? "Hide Menu" : "Show Menu"}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline px-3 py-1.5 bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] text-[10px] font-bold uppercase border border-[var(--color-accent-secondary)]/30">
            Eksplorasi 3D Interaktif
          </span>
        </div>
      </header>

      {/* ─── MOBILE TAB SWITCHER ──────────────────────────────── */}
      <div className="md:hidden flex border-b border-[var(--border-light)] flex-shrink-0">
        <button
          onClick={() => setMobileTab("3d")}
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
            mobileTab === "3d"
              ? "text-[var(--color-accent-secondary)] border-b-2 border-[var(--color-accent-secondary)] bg-[var(--bg-panel)]"
              : "text-[var(--text-secondary)]"
          }`}
        >
          Model 3D
        </button>
        <button
          onClick={() => setMobileTab("list")}
          className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
            mobileTab === "list"
              ? "text-[var(--color-accent-secondary)] border-b-2 border-[var(--color-accent-secondary)] bg-[var(--bg-panel)]"
              : "text-[var(--text-secondary)]"
          }`}
        >
          Daftar Istilah
        </button>
      </div>

      {/* ─── MOBILE: 3D TAB ──────────────────────────────────── */}
      {mobileTab === "3d" && (
        <div className="md:hidden flex flex-col pb-24" style={{ height: "calc(100vh - 100px)" }}>
          <div className="flex-1 relative border border-[var(--border-light)] mx-4 my-3 min-h-[30vh]">
            <AnatomyCanvas
              key={canvasKey}
              anatomyParts={anatomyParts}
              selectedPart={selectedPart}
              onSelectPart={(part) => setSelectedPart(part)}
              heartPosition={HEART_POSITION}
              heartScale={HEART_SCALE}
            />
            {/* Layer controls */}
            <div className="absolute bottom-3 left-3 flex gap-2 z-10">
              <button
                onClick={() => setLayerVisibility(layerVisibility === "all" ? "vessels" : "all")}
                className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold transition-all border ${
                  layerVisibility === "all"
                    ? "bg-[var(--color-accent-primary-light)] text-white border-[var(--color-accent-primary-light)]"
                    : "bg-[var(--bg-panel)] text-[var(--text-secondary)] border-[var(--border-strong)]"
                }`}
              >
                {layerVisibility === "all" ? "Lengkap" : "X-Ray"}
              </button>
              <button
                onClick={() => setSelectedPart(null)}
                className="px-3 py-1.5 bg-[var(--bg-panel)] text-[var(--text-secondary)] border border-[var(--border-strong)] text-[9px] uppercase tracking-widest font-bold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Clean, readable and beautiful description overlay inside mobile 3D tab */}
          <AnimatePresence>
            {selectedPart && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="mx-4 mb-4 p-4 border border-[var(--border-light)] bg-[var(--bg-panel)]/95 backdrop-blur-md space-y-2 flex-shrink-0"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold text-[var(--color-accent-primary-light)] uppercase tracking-widest">Detail Bagian</span>
                  <button 
                    onClick={() => setSelectedPart(null)}
                    className="text-[9px] font-bold text-[var(--text-secondary)] uppercase hover:text-[var(--text-primary)]"
                  >
                    Tutup
                  </button>
                </div>
                <h3 className="text-sm font-bold text-[var(--color-accent-secondary)] leading-none">{selectedPart.label}</h3>
                <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed max-h-24 overflow-y-auto">
                  {selectedPart.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ─── MOBILE: LIST TAB ─────────────────────────────────── */}
      {mobileTab === "list" && (
        <div className="md:hidden overflow-y-auto pb-24 px-4 pt-3">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-3">Daftar Istilah</p>
          <ul className="space-y-1 mb-6">
            {anatomyParts.map((part) => (
              <li key={part.id}>
                <button
                  onClick={() => { playClick(); setSelectedPart(part); }}
                  onMouseEnter={playHover}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left text-sm border ${
                    selectedPart?.id === part.id
                      ? "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] font-semibold border-[var(--color-accent-secondary)]/30"
                      : "border-transparent hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 flex-shrink-0"
                    style={{ backgroundColor: selectedPart?.id === part.id ? "var(--color-accent-secondary)" : part.color }}
                  />
                  {part.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Detail Panel */}
          <AnimatePresence mode="wait">
            {selectedPart ? (
              <motion.div
                key={selectedPart.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 border border-[var(--border-light)] bg-[var(--bg-panel)] space-y-3"
              >
                <div>
                  <span className="text-[9px] font-bold text-[var(--color-accent-primary-light)] uppercase tracking-widest">Detail Bagian</span>
                  <h2 className="text-lg font-bold text-[var(--color-accent-secondary)] mt-1">{selectedPart.label}</h2>
                </div>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{selectedPart.description}</p>
                <button
                  onClick={() => setMobileTab("3d")}
                  className="w-full py-2 text-[10px] font-bold uppercase tracking-widest border border-[var(--color-accent-secondary)]/30 text-[var(--color-accent-secondary)] hover:bg-[var(--color-accent-secondary)]/10 transition-all"
                >
                  Lihat di Model 3D →
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 opacity-30">
                <Heart size={40} strokeWidth={1} className="text-[var(--text-secondary)] mb-3" />
                <p className="text-xs text-[var(--text-secondary)] text-center">Pilih bagian dari daftar di atas</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ─── DESKTOP LAYOUT: Canvas kiri, List kanan ─────────── */}
      <main className="hidden md:grid grid-cols-12 gap-6 p-6 flex-1" style={{ height: "calc(100vh - 73px)" }}>

        {/* KIRI (9 KOLOM): KANVAS 3D */}
        <div className="col-span-9 relative overflow-hidden border border-[var(--border-light)] bg-[var(--bg-panel)]">
          <AnatomyCanvas
            key={canvasKey}
            anatomyParts={anatomyParts}
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            heartPosition={HEART_POSITION}
            heartScale={HEART_SCALE}
          />
          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-6 flex gap-3 z-10">
            <button
              onClick={() => setLayerVisibility(layerVisibility === "all" ? "vessels" : "all")}
              className={`px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all border ${
                layerVisibility === "all"
                  ? "bg-[var(--color-accent-primary-light)] text-white border-[var(--color-accent-primary-light)]"
                  : "bg-[var(--bg-panel)] text-[var(--text-secondary)] border-[var(--border-strong)] hover:text-[var(--text-primary)]"
              }`}
            >
              {layerVisibility === "all" ? "Layer: Lengkap" : "Layer: Pembuluh"}
            </button>
            <button
              onClick={() => setSelectedPart(null)}
              className="px-4 py-2 bg-[var(--bg-panel)] text-[var(--text-secondary)] border border-[var(--border-strong)] text-[10px] uppercase tracking-widest font-bold hover:text-[var(--text-primary)] transition-all"
            >
              Reset View
            </button>
          </div>
        </div>

        {/* KANAN (3 KOLOM): DAFTAR ANATOMI */}
        <div className="col-span-3 flex flex-col border border-[var(--border-light)] bg-[var(--bg-panel)] overflow-hidden">
          {/* Daftar Istilah */}
          <div className="p-5 border-b border-[var(--border-light)] overflow-y-auto flex-shrink-0" style={{ maxHeight: "55%" }}>
            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Daftar Istilah</h3>
            <ul className="space-y-1">
              {anatomyParts.map((part) => (
                <li key={part.id}>
                  <button
                    onClick={() => { playClick(); setSelectedPart(part); }}
                    onMouseEnter={playHover}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left text-sm ${
                      selectedPart?.id === part.id
                        ? "bg-[var(--color-accent-secondary)]/10 text-[var(--color-accent-secondary)] font-semibold"
                        : "hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <div
                      className="w-2 h-2 flex-shrink-0"
                      style={{ backgroundColor: selectedPart?.id === part.id ? "var(--color-accent-secondary)" : part.color }}
                    />
                    {part.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 p-5 overflow-y-auto">
            <AnimatePresence mode="wait">
              {selectedPart ? (
                <motion.div
                  key={selectedPart.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <span className="text-[9px] font-bold text-[var(--color-accent-primary-light)] uppercase tracking-widest">Detail Bagian</span>
                    <h2 className="text-xl font-bold mt-1" style={{ color: selectedPart.color }}>{selectedPart.label}</h2>
                  </div>
                  <p className="text-[var(--text-secondary)] text-xs leading-relaxed">{selectedPart.description}</p>
                  <div className="pt-2 border-t border-[var(--border-light)]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2" style={{ backgroundColor: selectedPart.color }} />
                      <span className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Lokasi pada Model 3D</span>
                    </div>
                    <p className="text-[9px] text-[var(--text-secondary)]/60 mt-1">
                      Klik titik kuning pada model untuk menjelajahi lebih lanjut.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-10">
                  <Heart size={48} strokeWidth={1} className="text-[var(--text-secondary)] mb-4" />
                  <p className="text-xs text-[var(--text-secondary)]">Pilih anatomi dari daftar<br />atau klik langsung pada model 3D.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
