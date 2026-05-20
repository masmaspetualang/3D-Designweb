"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import useHeartStore from "@/store/heartStore";
import { MODULES } from "@/lib/mock-data";
import SceneLoader from "@/components/ui/SceneLoader";

// Komponen Internal untuk Loading Model GLB agar lebih eksplisit
function HeartModelDirect({ scale = 5 }) {
  const { scene } = useGLTF("/models/heart.glb");
  return (
    <primitive
      object={scene}
      scale={scale}
      position={[-0.1, -4.9, 0]}
    />
  );
}

useGLTF.preload("/models/heart.glb");

// ─── Hero Page: Theme-Aware Lighting ─────────────────────────────────
function HeroThemeLights() {
  const theme = useHeartStore((s) => s.theme);
  const isDark = theme === "dark";
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const keyRef = useRef<THREE.SpotLight>(null!);
  const rimGoldRef = useRef<THREE.SpotLight>(null!);
  const rimRedRef = useRef<THREE.SpotLight>(null!);
  const fillRef = useRef<THREE.PointLight>(null!);

  const t = isDark
    ? {
      ambient: 0.1, key: 4, gold: 5, red: 4, fill: 0.3,
      keyColor: new THREE.Color("#ffffff"),
      goldColor: new THREE.Color("#D4AF37"),
      redColor: new THREE.Color("#9B111E")
    }
    : {
      ambient: 2.0, key: 6, gold: 1.5, red: 1.0, fill: 2.0,
      keyColor: new THREE.Color("#f0f4ff"),
      goldColor: new THREE.Color("#e8c87a"),
      redColor: new THREE.Color("#c0392b")
    };

  useFrame(() => {
    const l = THREE.MathUtils.lerp;
    if (ambientRef.current) ambientRef.current.intensity = l(ambientRef.current.intensity, t.ambient, 0.08);
    if (keyRef.current) { keyRef.current.intensity = l(keyRef.current.intensity, t.key, 0.08); keyRef.current.color.lerp(t.keyColor, 0.08); }
    if (rimGoldRef.current) { rimGoldRef.current.intensity = l(rimGoldRef.current.intensity, t.gold, 0.08); rimGoldRef.current.color.lerp(t.goldColor, 0.08); }
    if (rimRedRef.current) { rimRedRef.current.intensity = l(rimRedRef.current.intensity, t.red, 0.08); rimRedRef.current.color.lerp(t.redColor, 0.08); }
    if (fillRef.current) fillRef.current.intensity = l(fillRef.current.intensity, t.fill, 0.08);
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={t.ambient} />
      <spotLight ref={keyRef} position={[-10, 10, 10]} angle={0.4} penumbra={1} intensity={t.key} color={t.keyColor} castShadow />
      <spotLight ref={rimGoldRef} position={[12, 5, -10]} angle={0.3} penumbra={0.5} intensity={t.gold} color={t.goldColor} />
      <spotLight ref={rimRedRef} position={[-10, -8, -5]} angle={0.5} penumbra={1} intensity={t.red} color={t.redColor} />
      <pointLight ref={fillRef} position={[0, -2, 5]} intensity={t.fill} color="#ffffff" />
    </>
  );
}

export default function PulseSyncDashboard() {
  const router = useRouter();
  const { isSidebarVisible, toggleSidebar } = useHeartStore();
  const [isNavigating, setIsNavigating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 50 && !isNavigating) {
        setIsNavigating(true);
        router.push("/anatomy");
      }
    };
    window.addEventListener("wheel", handleScroll);
    return () => window.removeEventListener("wheel", handleScroll);
  }, [router, isNavigating]);

  return (
    <div className="relative h-screen w-screen font-sans text-[var(--text-primary)] overflow-hidden bg-[var(--bg-main)]">
      <SceneLoader />

      {/* ─── TOP NAV BAR ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-3 md:py-5 pointer-events-none">
        {/* Desktop: Module Links Left */}
        <div className="hidden md:flex items-center space-x-4 pointer-events-auto">
          {MODULES.slice(0, 2).map((mod, i) => (
            <Link
              key={mod.id}
              href={mod.href}
              className="px-4 py-1.5 border border-[var(--border-light)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--color-accent-secondary)] transition-all duration-300 flex items-center space-x-2"
            >
              <span>{mod.title}</span>
              {i === 0 && <span className="text-[10px] opacity-50">+</span>}
            </Link>
          ))}
        </div>

        {/* Mobile: Brand name top-left */}
        <div className="md:hidden flex items-center space-x-2 pointer-events-auto">
          <div className="w-1.5 h-1.5 bg-[var(--color-accent-secondary)] animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[var(--color-accent-secondary)] uppercase">CardioLearn</span>
        </div>

        {/* Right: Toggle + Status */}
        <div className="flex items-center space-x-3 md:space-x-6 pointer-events-auto">
          <button
            onClick={toggleSidebar}
            className="flex items-center space-x-2 bg-[var(--bg-panel)] px-3 md:px-4 py-1.5 border border-[var(--border-light)] hover:bg-[var(--bg-hover)] transition-all pointer-events-auto"
          >
            <span className="text-xs md:text-sm font-medium text-[var(--text-primary)] hidden sm:block">
              {isSidebarVisible ? "Hide Menu" : "Menu"}
            </span>
            <div className="w-5 h-5 bg-[var(--text-primary)] flex flex-col items-center justify-center space-y-0.5">
              <div className={`w-3 h-0.5 bg-[var(--bg-main)] transition-transform ${isSidebarVisible ? "rotate-45 translate-y-[3px]" : ""}`} />
              {!isSidebarVisible && <div className="w-3 h-0.5 bg-[var(--bg-main)]" />}
              <div className={`w-3 h-0.5 bg-[var(--bg-main)] transition-transform ${isSidebarVisible ? "-rotate-45 -translate-y-[3px]" : ""}`} />
            </div>
          </button>
          <div className="hidden sm:block h-6 w-[1px] bg-[var(--border-strong)]" />
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] md:text-[10px] font-bold text-[var(--color-accent-secondary)] uppercase tracking-widest leading-none mb-1">Status</span>
            <span className="text-[10px] md:text-xs font-bold text-[var(--text-primary)]">Interactive Cardiology Platform</span>
          </div>
        </div>
      </nav>

      {/* ─── GIANT BG TEXT (desktop only) ─────────────────────────── */}
      <div className="hidden md:flex absolute inset-0 items-start justify-center pt-32 lg:pt-36 pointer-events-none select-none z-0">
        <h1 className="text-[17vw] xl:text-[10vw] font-bold text-[var(--text-primary)]/10 tracking-tighter leading-none uppercase text-center px-4">
          <span>Anatomi</span>
          <span>Jantung</span>
        </h1>
      </div>

      {/* ─── 3D HEART MODEL ──────────────────────────────────────── */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full max-w-7xl pointer-events-auto">
          <Canvas
            camera={{ position: [0, 0, 1.4], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
          >
            <HeroThemeLights />
            <Suspense fallback={<Html center className="text-[var(--text-secondary)] animate-pulse font-bold tracking-widest">LOADING...</Html>}>
              <HeartModelDirect scale={3.5} />
            </Suspense>
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minPolarAngle={Math.PI / 2.2}
              maxPolarAngle={Math.PI / 1.8}
            />
          </Canvas>
        </div>
      </div>

      {/* ─── MOBILE HERO OVERLAY ─────────────────────────────────── */}
      <div className="md:hidden absolute inset-0 z-20 flex flex-col justify-between pointer-events-none px-4">
        {/* Top: Title block — sits below nav */}
        <div className="pt-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--color-accent-secondary)]/30 mb-3"
          >
            <div className="w-1 h-1 bg-[var(--color-accent-secondary)] animate-pulse" />
            <span className="text-[9px] font-bold tracking-[0.3em] text-[var(--color-accent-secondary)] uppercase">Modul Interaktif</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-4xl font-black tracking-tight text-[var(--text-primary)] leading-none drop-shadow-2xl"
          >
            ANATOMI
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-2xl font-bold tracking-widest text-[var(--color-accent-secondary)] mt-1 drop-shadow-md"
          >
            JANTUNG MANUSIA
          </motion.h2>
        </div>

        {/* Bottom info — sits above the bottom nav bar */}
        <div className="pb-24 flex flex-col gap-3 pointer-events-auto">
          {/* Description card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full border border-[var(--border-light)] p-4"
            style={{ background: "rgba(17,17,17,0.75)", backdropFilter: "blur(16px)" }}
          >
            <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
              Eksplorasi anatomi jantung dengan visual 3D untuk membantu memahami
              struktur serta cara kerja jantung secara mendalam dan interaktif.
            </p>
          </motion.div>

          {/* 2-col stats row */}
          <div className="flex gap-3">
            {/* Visualisasi card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex-1 border border-[var(--border-light)] p-3"
              style={{ background: "rgba(17,17,17,0.75)", backdropFilter: "blur(16px)" }}
            >
              <div className="text-[var(--color-accent-secondary)] text-[9px] font-bold tracking-widest uppercase mb-1">Feature</div>
              <div className="text-[var(--text-primary)] font-bold text-sm">Visualisasi 3D</div>
              <p className="text-[var(--text-secondary)] text-[9px] mt-1 leading-snug">
                Kenali anatomi & kelainan klinis dengan lebih mudah.
              </p>
            </motion.div>

            {/* Doctor card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex-1 border border-[var(--border-light)] p-3 flex items-center gap-2 overflow-hidden"
              style={{ background: "rgba(17,17,17,0.75)", backdropFilter: "blur(16px)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-2xl font-black text-[var(--text-primary)] leading-none">92%</div>
                <div className="text-[var(--text-secondary)] text-[8px] mt-0.5 leading-snug">Pengalaman Belajar Lebih Menyeluruh</div>
                <div className="text-[var(--color-accent-secondary)] text-[8px] font-bold mt-1 truncate">Dr. Nafisa Tasnim, Sp.JP</div>
              </div>
              <div className="w-12 h-16 flex-shrink-0 overflow-hidden">
                <img src="/models/DOKTER.jpg" alt="Doctor" className="w-full h-full object-cover opacity-70 mix-blend-luminosity" />
              </div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              href="/anatomy"
              className="w-full flex items-center justify-between px-4 py-3 bg-[var(--color-accent-secondary)] text-[var(--bg-main)] font-bold text-sm tracking-widest uppercase hover:opacity-90 transition-opacity pointer-events-auto"
            >
              <span>Mulai Eksplorasi</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ─── DESKTOP HERO OVERLAY ────────────────────────────────── */}
      <div className="hidden md:flex relative z-20 container mx-auto px-12 pt-32 h-screen flex-col justify-between pb-12 pointer-events-none overflow-hidden">
        <div className="flex flex-row justify-between items-start pt-20 w-full">
          <div className="w-48" />
          <div className="max-w-[300px] text-right pointer-events-auto z-10 flex flex-col items-end">
            <motion.p
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[var(--text-secondary)] text-sm leading-relaxed"
            >
              Eksplorasi anatomi jantung menampilkan jantung dengan visual 3D untuk membantu
              orang umum memahami struktur serta cara kerja jantung secara lebih mendalam dan interaktif.
            </motion.p>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="flex flex-row justify-between items-end pb-8 gap-0 mt-auto z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-ui-dark p-6 border border-[var(--border-light)] w-72 pointer-events-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-base">Visualisasi 3D</h3>
                <p className="text-[var(--text-secondary)] text-xs mt-1">
                  Pelajari setiap detail jantung dengan 3D model. Membantu Anda mengenali anatomi dan potensi kelainan klinis dengan jauh lebih mudah.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-ui-dark p-5 w-80 pointer-events-auto flex items-center space-x-4"
          >
            <div className="flex-1">
              <div className="text-2xl font-bold text-[var(--text-primary)]">92%</div>
              <p className="text-[var(--text-secondary)] text-[10px] mt-1 mb-4">Pengalaman Belajar yang Lebih Menyeluruh</p>
              <div className="space-y-0.5">
                <h4 className="text-[var(--text-primary)] font-bold text-sm">Dr. Nafisa Tasnim, Sp.JP</h4>
                <p className="text-[var(--text-secondary)] text-[9px]">
                  "Visualisasi yang tepat adalah kunci untuk memahami cara kerja jantung yang kompleks secara lebih sederhana."
                </p>
              </div>
            </div>
            <div className="w-24 h-32 overflow-hidden bg-[var(--bg-panel)] relative flex-shrink-0">
              <img src="/models/DOKTER.jpg" alt="Doctor" className="w-full h-full object-cover opacity-80 mix-blend-luminosity" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── SCROLL HINT (desktop only) ──────────────────────────── */}
      <div className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 pointer-events-none z-30">
        <div className="w-5 h-8 border-2 border-[var(--border-strong)] rounded-full flex justify-center p-1">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-2 bg-[var(--color-accent-secondary)] rounded-full"
          />
        </div>
        <span className="text-[9px] font-bold tracking-[0.2em] text-[var(--text-secondary)] uppercase">
          Scroll down to explore
        </span>
      </div>
    </div>
  );
}
