'use client';

import React, { useState } from 'react';

interface ProtocolLogoProps {
  name: string;
  category?: string;
  size?: 'sm' | 'md' | 'lg';
  iconUrl?: string;
  className?: string;
}

export const ProtocolLogo: React.FC<ProtocolLogoProps> = ({
  name,
  category = 'Token',
  size = 'md',
  iconUrl,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-xl',
  }[size];

  // Branded Vector Icons for major Solana protocols
  const renderBrandedSvg = () => {
    const lower = name.toLowerCase();

    // 1. Jupiter (Orbital Crescent / Planet)
    if (lower.includes('jupiter')) {
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <circle cx="16" cy="16" r="14" fill="url(#jupGrad)" />
          <path d="M7 21C11 25 21 25 25 15C21 21 13 21 7 21Z" fill="#FFF" fillOpacity="0.8" />
          <circle cx="12" cy="11" r="3" fill="#FFF" />
          <defs>
            <linearGradient id="jupGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9A825" />
              <stop offset="1" stopColor="#E65100" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // 2. Raydium (Aqua / Cyan Crystal)
    if (lower.includes('raydium')) {
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <circle cx="16" cy="16" r="14" fill="url(#rayGrad)" />
          <polygon points="16,6 25,12 25,22 16,26 7,22 7,12" fill="#0A1128" />
          <polygon points="16,9 22,13 22,20 16,23 10,20 10,13" fill="#00FFE0" fillOpacity="0.9" />
          <defs>
            <linearGradient id="rayGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2266FF" />
              <stop offset="1" stopColor="#00E5FF" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // 3. Orca (Blue / Cyan Wave)
    if (lower.includes('orca')) {
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <circle cx="16" cy="16" r="14" fill="url(#orcaGrad)" />
          <path d="M10 18C12 12 18 10 23 13C20 15 19 19 14 20C12 20.5 10 19.5 10 18Z" fill="#FFF" />
          <circle cx="20" cy="14" r="1.5" fill="#FFE57F" />
          <defs>
            <linearGradient id="orcaGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFC837" />
              <stop offset="1" stopColor="#FF8008" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // 4. SPL Token & System Program (Solana Official Tri-Bar Gradient)
    if (lower.includes('system') || lower.includes('spl token') || lower.includes('token extensions')) {
      const isExt = lower.includes('extensions') || lower.includes('2022');
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <rect width="32" height="32" rx="8" fill={isExt ? '#1f1338' : '#0B0E14'} />
          <path d="M8 21.5L12 25.5H24L20 21.5H8Z" fill="url(#solGrad)" />
          <path d="M8 14L12 18H24L20 14H8Z" fill="url(#solGrad)" />
          <path d="M8 6.5L12 10.5H24L20 6.5H8Z" fill="url(#solGrad)" />
          <defs>
            <linearGradient id="solGrad" x1="8" y1="6" x2="24" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // 5. Meteora (Fiery Comet Star)
    if (lower.includes('meteora')) {
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <circle cx="16" cy="16" r="14" fill="#0E121B" stroke="#E11D48" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="7" fill="url(#metGrad)" />
          <path d="M16 4V8M16 24V28M4 16H8M24 16H28" stroke="#FB7185" strokeWidth="2" strokeLinecap="round" />
          <defs>
            <linearGradient id="metGrad" x1="9" y1="9" x2="23" y2="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="1" stopColor="#FB923C" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // 6. Kamino (Cyan / Emerald Shield)
    if (lower.includes('kamino')) {
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <circle cx="16" cy="16" r="14" fill="url(#kamGrad)" />
          <path d="M16 8L23 12V18L16 23L9 18V12L16 8Z" fill="#0A0E1A" />
          <circle cx="16" cy="15.5" r="3" fill="#00F5D4" />
          <defs>
            <linearGradient id="kamGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00F5D4" />
              <stop offset="1" stopColor="#00BBF9" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // 7. Drift (Neon Green Cyber Hexagon)
    if (lower.includes('drift')) {
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <circle cx="16" cy="16" r="14" fill="#081014" stroke="#10B981" strokeWidth="1.5" />
          <path d="M11 9H17C20.5 9 22.5 11.5 22.5 15.5C22.5 19.5 20.5 22 17 22H11V9Z" fill="none" stroke="#10B981" strokeWidth="2.5" />
          <path d="M14 13H17C18.5 13 19.5 14 19.5 15.5C19.5 17 18.5 18 17 18H14V13Z" fill="#10B981" />
        </svg>
      );
    }

    // 8. Phoenix (Rising Gold Flame)
    if (lower.includes('phoenix')) {
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <circle cx="16" cy="16" r="14" fill="url(#phxGrad)" />
          <path d="M16 6C16 12 21 14 21 19C21 22 18.5 24 16 24C13.5 24 11 22 11 19C11 15 14 12 16 6Z" fill="#FFF" />
          <defs>
            <linearGradient id="phxGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="1" stopColor="#DC2626" />
            </linearGradient>
          </defs>
        </svg>
      );
    }

    // 9. Jito & Marinade (Liquid Staking / Validator Emblems)
    if (lower.includes('jito') || lower.includes('marinade')) {
      const isJito = lower.includes('jito');
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full p-1.5">
          <circle cx="16" cy="16" r="14" fill={isJito ? '#2A104E' : '#0F2D24'} stroke={isJito ? '#A855F7' : '#14F195'} strokeWidth="1.5" />
          <circle cx="16" cy="16" r="5" fill={isJito ? '#C084FC' : '#14F195'} />
          <path d="M16 6V9M16 23V26M6 16H9M23 16H26" stroke={isJito ? '#C084FC' : '#14F195'} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }

    return null;
  };

  const brandedSvg = renderBrandedSvg();

  // If branded SVG exists, display it directly (100% reliable, zero network failures)
  if (brandedSvg) {
    return (
      <div className={`rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-background border border-border shadow-inner ${sizeClasses} ${className}`}>
        {brandedSvg}
      </div>
    );
  }

  // If external icon provided and no error occurred yet
  if (iconUrl && !imgError) {
    return (
      <div className={`rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-background border border-border shadow-inner p-1 ${sizeClasses} ${className}`}>
        <img
          src={iconUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  // Graceful Fallback: Protocol Initials with Category-Specific Gradients
  const bgGradient =
    category === 'DEX' ? 'from-purple-600 to-indigo-700' :
    category === 'Lending' ? 'from-blue-600 to-cyan-700' :
    category === 'Perps' ? 'from-cyan-600 to-teal-700' :
    category === 'Token' ? 'from-emerald-600 to-green-700' :
    'from-amber-600 to-orange-700';

  return (
    <div className={`rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${bgGradient} text-white font-black shadow-inner border border-white/20 ${sizeClasses} ${className}`}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
};
