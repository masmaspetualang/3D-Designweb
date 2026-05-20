"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { HeartPulse, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import { MODULES } from "@/lib/mock-data";
import { useUISound } from "@/hooks/useUISound";
import useHeartStore from "@/store/heartStore";

interface NavigationSidebarProps {
  isVisible: boolean;
}

export default function NavigationSidebar({ isVisible }: NavigationSidebarProps) {
  const pathname = usePathname();
  const { playHover, playClick } = useUISound();
  const { theme, toggleTheme } = useHeartStore();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* ─── DESKTOP: Left Vertical Sidebar ─────────────────── */}
          <motion.nav
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-[100] flex-col items-center py-6 px-3 glass-ui-dark space-y-4 border border-[var(--border-light)]"
          >
            {/* Brand Logo */}
            <Link
              href="/"
              onMouseEnter={playHover}
              onClick={playClick}
              className="allow-radius w-10 h-10 flex items-center justify-center bg-[var(--color-accent-primary-light)] text-[#FFFFFF] shadow-lg shadow-[var(--color-accent-primary)]/30 mb-2 hover:scale-110 transition-transform"
            >
              <HeartPulse size={20} strokeWidth={1.5} />
            </Link>

            <div className="flex flex-col space-y-3">
              {MODULES.map((mod) => {
                const isActive = pathname === mod.href;
                return (
                  <Link
                    key={mod.id}
                    href={mod.href}
                    className={`relative group w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--color-accent-secondary)]/20 text-[var(--color-accent-secondary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--color-accent-secondary)]"
                    }`}
                    title={mod.title}
                    onMouseEnter={playHover}
                    onClick={playClick}
                  >
                    <div className="text-xl relative z-10">{mod.icon}</div>

                    {/* Tooltip on hover */}
                    <div className="absolute left-16 px-3 py-1.5 bg-[var(--bg-panel)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest rounded border border-[var(--border-light)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {mod.title}
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="nav-active-pill-desktop"
                        className="absolute inset-0 bg-[var(--color-accent-secondary)]/10 rounded-full border border-[var(--color-accent-secondary)]/30"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <div className="pt-4 mt-2 border-t border-[var(--border-light)] w-full flex justify-center">
              <button
                onClick={() => { playClick(); toggleTheme(); }}
                onMouseEnter={playHover}
                className="w-10 h-10 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)] rounded-none transition-all group relative"
                title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                <div className="absolute left-16 px-3 py-1.5 bg-[var(--bg-panel)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest rounded border border-[var(--border-light)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </div>
              </button>
            </div>
          </motion.nav>

          {/* ─── MOBILE: Bottom Center Fixed Bar ────────────────── */}
          <motion.nav
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-3 left-4 right-4 z-[100] flex flex-row items-center justify-center px-2 py-1.5 gap-0.5"
            style={{
              background: "rgba(12,12,12,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--border-light)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.06)",
            }}
          >
            {/* Brand Logo */}
            <Link
              href="/"
              onMouseEnter={playHover}
              onClick={playClick}
              className="w-7 h-7 flex items-center justify-center bg-[var(--color-accent-primary-light)] text-white hover:scale-110 transition-transform mr-1 flex-shrink-0"
            >
              <HeartPulse size={13} strokeWidth={1.5} />
            </Link>

            {/* Divider */}
            <div className="w-px h-5 bg-[var(--border-strong)] mx-1.5 flex-shrink-0" />

            {/* Module Links */}
            {MODULES.map((mod) => {
              const isActive = pathname === mod.href;
              return (
                <Link
                  key={mod.id}
                  href={mod.href}
                  onClick={playClick}
                  className={`relative flex-1 h-8 flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "text-[var(--color-accent-secondary)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill-mobile"
                      className="absolute inset-0 bg-[var(--color-accent-secondary)]/15 border border-[var(--color-accent-secondary)]/40"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="text-sm relative z-10 [&>svg]:w-4 [&>svg]:h-4">{mod.icon}</span>
                </Link>
              );
            })}

            {/* Divider */}
            <div className="w-px h-5 bg-[var(--border-strong)] mx-1.5 flex-shrink-0" />

            {/* Theme Toggle */}
            <button
              onClick={() => { playClick(); toggleTheme(); }}
              className="w-7 h-7 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex-shrink-0"
            >
              {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
