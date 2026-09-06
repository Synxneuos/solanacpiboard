'use client';

import './globals.css';
import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { InviteModal } from '../components/InviteModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>SolanaCPIBoard | Solana Cross-Program Invocation Analytics</title>
        <meta
          name="description"
          content="Open-source real-time and historical leaderboard ranking Solana programs by Cross-Program Invocation (CPI) activity."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-background text-gray-100 antialiased flex flex-col min-h-screen">
        <Navbar onOpenInviteModal={() => setIsInviteOpen(true)} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border/60 bg-surface/50 py-8 text-center text-xs text-gray-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>
              SolanaCPIBoard is an open-source public good. Data parsed from Solana RPC & Helius.
            </p>
            <div className="flex items-center gap-6">
              <a href="https://github.com/solanacpiboard/solanacpiboard" className="hover:text-white transition-colors">
                GitHub
              </a>
              <a href="https://twitter.com/solana" className="hover:text-white transition-colors">
                X / Twitter
              </a>
              <button onClick={() => setIsInviteOpen(true)} className="hover:text-solana-green transition-colors">
                Suggest Query
              </button>
            </div>
          </div>
        </footer>

        <InviteModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      </body>
    </html>
  );
}
