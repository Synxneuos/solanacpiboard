'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Share2, Github, Sparkles, ExternalLink } from 'lucide-react';

interface NavbarProps {
  onOpenInviteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInviteModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center transition-all group-hover:border-solana-purple/50">
            <Activity className="w-4 h-4 text-solana-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                Solana<span className="text-gradient">CPI</span>Board
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-slate-400 font-mono font-medium">
                Mainnet
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Cross-Program Invocation Composability Analytics</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">
            Leaderboard
          </Link>
          <Link href="/community" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-solana-green" />
            Community Queries
          </Link>
          <a
            href="https://github.com/Synxneuos/solanacpiboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenInviteModal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-solana-purple" />
            <span>Suggest Query / Access</span>
          </button>
        </div>
      </div>
    </header>
  );
};
