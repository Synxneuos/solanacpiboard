'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Share2, Github, Terminal, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenInviteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInviteModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solana-purple to-solana-green p-0.5 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-solana-green transition-colors group-hover:text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">Solana<span className="text-gradient">CPIBoard</span></span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-solana-purple/20 text-solana-purple font-mono font-semibold border border-solana-purple/30">
                BETA
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Cross-Program Invocation Analytics</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-solana-green transition-colors">
            Leaderboard
          </Link>
          <Link href="/community" className="hover:text-solana-green transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-solana-green" />
            Community Queries
          </Link>
          <a
            href="https://github.com/Synxneuos/solanacpiboard"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5 text-gray-400"
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenInviteModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface hover:bg-surfaceHover border border-border text-sm font-medium text-gray-200 hover:text-white transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4 text-solana-purple" />
            <span>Share Query / Invite</span>
          </button>
        </div>
      </div>
    </header>
  );
};
