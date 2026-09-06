'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, ShieldCheck, ArrowUpRight, ArrowDownLeft, 
  ExternalLink, Layers, CheckCircle, Flame, Filter, Zap,
  ChevronDown, ChevronUp, Copy, Check, TrendingUp, Cpu, Coins, Landmark
} from 'lucide-react';
import { LeaderboardItem } from '../lib/api';

interface LeaderboardTableProps {
  initialItems: LeaderboardItem[];
  timeframe: string;
  onTimeframeChange: (tf: string) => void;
  mode: string;
  onModeChange: (m: string) => void;
  sortBy: string;
  onSortChange: (s: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
}

const CATEGORIES = [
  { id: 'All', label: 'All Protocols', icon: Layers },
  { id: 'DEX', label: 'DEX & Swaps', icon: Zap },
  { id: 'Lending', label: 'Lending & Yield', icon: Landmark },
  { id: 'Perps', label: 'Perps & Derivs', icon: TrendingUp },
  { id: 'Token', label: 'Tokens & SPL', icon: Coins },
  { id: 'System', label: 'Core Infra', icon: Cpu },
];

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  initialItems,
  timeframe,
  onTimeframeChange,
  mode,
  onModeChange,
  sortBy,
  onSortChange,
  category,
  onCategoryChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchCat = category === 'All' || item.category.toLowerCase() === category.toLowerCase();
      const matchSearch =
        searchTerm === '' ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.program_id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [initialItems, category, searchTerm]);

  // Max volume for relative bar
  const maxVolume = useMemo(() => {
    return Math.max(...initialItems.map(i => i.total_cpi_volume), 1);
  }, [initialItems]);

  const handleCopy = (address: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const renderSparkline = (points: number[] = [10, 20, 15, 30, 25, 40]) => {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const width = 70;
    const height = 24;

    const pathData = points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height - 6) - 3;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke="#14F195"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Filtering Control Bar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-surface/90 backdrop-blur-md p-4 rounded-2xl border border-border shadow-lg">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs by name or address (e.g. Jupiter, Token...)"
            className="w-full pl-10 pr-4 py-2.5 bg-background rounded-xl border border-border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-solana-green transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-solana-purple/30 to-solana-green/20 text-white border border-solana-purple/50 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-surfaceHover border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-solana-green' : 'text-gray-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Timeframe & Anti-Sybil Controls */}
        <div className="flex items-center gap-3 self-end xl:self-auto">
          {/* Anti-Sybil Organic Toggle */}
          <button
            onClick={() => onModeChange(mode === 'organic' ? 'raw' : 'organic')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              mode === 'organic'
                ? 'bg-emerald-950/50 text-solana-green border-solana-green/40 shadow-sm'
                : 'bg-background text-gray-400 border-border hover:text-gray-200'
            }`}
          >
            <ShieldCheck className={`w-4 h-4 ${mode === 'organic' ? 'text-solana-green' : 'text-gray-500'}`} />
            <span>{mode === 'organic' ? '🛡️ Organic Filter ON' : '⚡ Raw Volume'}</span>
          </button>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-background rounded-xl p-1 border border-border text-xs">
            {['24h', '7d', '30d'].map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-solana-purple to-purple-700 text-white shadow-md'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modern High-End Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-background/90 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-border">
              <tr>
                <th className="py-4 px-4 w-14 text-center">Rank</th>
                <th className="py-4 px-4">Program</th>
                <th className="py-4 px-4">Category</th>
                <th 
                  className="py-4 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSortChange('incoming')}
                >
                  <div className="flex items-center gap-1.5">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-solana-green" />
                    <span>Incoming (Callee)</span>
                  </div>
                </th>
                <th 
                  className="py-4 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSortChange('outgoing')}
                >
                  <div className="flex items-center gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-solana-purple" />
                    <span>Outgoing (Caller)</span>
                  </div>
                </th>
                <th 
                  className="py-4 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSortChange('unique_partners')}
                >
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Partners (Callers/Callees)</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center">24h Trend</th>
                <th 
                  className="py-4 px-4 cursor-pointer hover:text-white transition-colors text-right"
                  onClick={() => onSortChange('success_rate')}
                >
                  <span>Success Rate</span>
                </th>
                <th className="py-4 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-gray-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <p className="text-base font-semibold text-white">No programs found</p>
                      <p className="text-xs text-gray-500">Try clearing your search query or selecting "All Protocols".</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const rankNumber = idx + 1;
                  const isExpanded = expandedRow === item.program_id;
                  const volumePct = Math.round((item.total_cpi_volume / maxVolume) * 100);

                  return (
                    <React.Fragment key={item.program_id}>
                      <tr
                        onClick={() => setExpandedRow(isExpanded ? null : item.program_id)}
                        className={`hover:bg-surfaceHover/90 transition-all cursor-pointer group ${
                          isExpanded ? 'bg-surfaceHover/60 border-l-4 border-l-solana-purple' : ''
                        }`}
                      >
                        {/* Rank with Medal Badges */}
                        <td className="py-4 px-4 text-center font-mono font-bold">
                          {rankNumber === 1 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black text-xs font-black shadow-lg shadow-amber-500/30">
                              🥇
                            </span>
                          ) : rankNumber === 2 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-gray-200 to-gray-400 text-black text-xs font-black shadow-lg shadow-gray-400/20">
                              🥈
                            </span>
                          ) : rankNumber === 3 ? (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-gradient-to-br from-amber-600 to-orange-800 text-white text-xs font-black shadow-lg shadow-amber-800/20">
                              🥉
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs font-semibold">{rankNumber}</span>
                          )}
                        </td>

                        {/* Program Info */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner p-1.5">
                              {item.icon_url ? (
                                <img src={item.icon_url} alt={item.name} className="w-full h-full object-contain" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-solana-purple to-solana-green rounded-lg flex items-center justify-center text-xs font-bold text-white">
                                  {item.name[0]}
                                </div>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold text-white group-hover:text-solana-green transition-colors">
                                <Link 
                                  href={`/program/${item.program_id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:underline flex items-center gap-1"
                                >
                                  {item.name}
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-solana-green" />
                                </Link>
                                {item.is_verified && (
                                  <CheckCircle className="w-3.5 h-3.5 text-solana-green flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] font-mono text-gray-500">
                                <span>{item.program_id.slice(0, 5)}...{item.program_id.slice(-4)}</span>
                                <button
                                  onClick={(e) => handleCopy(item.program_id, e)}
                                  className="hover:text-white transition-colors"
                                  title="Copy address"
                                >
                                  {copiedAddress === item.program_id ? (
                                    <Check className="w-3 h-3 text-solana-green" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="py-4 px-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                            item.category === 'DEX' ? 'bg-purple-950/40 text-purple-300 border-purple-800/40' :
                            item.category === 'Lending' ? 'bg-blue-950/40 text-blue-300 border-blue-800/40' :
                            item.category === 'Perps' ? 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40' :
                            item.category === 'Token' ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40' :
                            'bg-amber-950/40 text-amber-300 border-amber-800/40'
                          }`}>
                            {item.category}
                          </span>
                        </td>

                        {/* Incoming CPIs */}
                        <td className="py-4 px-4 font-mono font-semibold text-white">
                          <div className="space-y-1">
                            <span className="text-solana-green font-bold">{formatNumber(item.total_incoming)}</span>
                            <div className="w-24 h-1 bg-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-solana-green rounded-full" 
                                style={{ width: `${Math.min(volumePct, 100)}%` }} 
                              />
                            </div>
                          </div>
                        </td>

                        {/* Outgoing CPIs */}
                        <td className="py-4 px-4 font-mono font-semibold text-gray-300">
                          <div className="space-y-1">
                            <span className="text-solana-purple font-bold">{formatNumber(item.total_outgoing)}</span>
                            <span className="block text-[10px] text-gray-500">invocations</span>
                          </div>
                        </td>

                        {/* Unique Partners */}
                        <td className="py-4 px-4 font-mono text-gray-300">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{item.total_unique_partners}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-background border border-border text-gray-400">
                              {item.unique_callers} in / {item.unique_callees} out
                            </span>
                          </div>
                        </td>

                        {/* 24h Mini Sparkline */}
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex justify-center">
                            {renderSparkline(item.trend_24h)}
                          </div>
                        </td>

                        {/* Success Rate */}
                        <td className="py-4 px-4 text-right font-mono">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              item.success_rate_pct >= 98
                                ? 'bg-emerald-950/40 text-solana-green border border-solana-green/30'
                                : item.success_rate_pct >= 95
                                ? 'bg-yellow-950/40 text-yellow-400 border border-yellow-400/30'
                                : 'bg-red-950/40 text-red-400 border border-red-400/30'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {item.success_rate_pct.toFixed(1)}%
                          </span>
                        </td>

                        {/* Expand Icon */}
                        <td className="py-4 px-3 text-center text-gray-500">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-solana-green" />
                          ) : (
                            <ChevronDown className="w-4 h-4 group-hover:text-white transition-colors" />
                          )}
                        </td>
                      </tr>

                      {/* Expandable Quick Drawer Row */}
                      {isExpanded && (
                        <tr className="bg-background/90 border-y border-border">
                          <td colSpan={9} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                                <div className="flex items-center gap-1.5 font-bold text-solana-purple uppercase tracking-wider">
                                  <ArrowDownLeft className="w-4 h-4" />
                                  <span>Top Upstream Caller</span>
                                </div>
                                <p className="text-sm font-semibold text-white">
                                  {item.top_caller_preview || 'Solana Client Direct'}
                                </p>
                                <p className="text-gray-400 text-[11px]">
                                  Most active protocol routing user transactions into {item.name}.
                                </p>
                              </div>

                              <div className="p-4 rounded-xl bg-surface border border-border space-y-2">
                                <div className="flex items-center gap-1.5 font-bold text-solana-green uppercase tracking-wider">
                                  <ArrowUpRight className="w-4 h-4" />
                                  <span>Top Downstream Target</span>
                                </div>
                                <p className="text-sm font-semibold text-white">
                                  {item.top_callee_preview || 'SPL Token'}
                                </p>
                                <p className="text-gray-400 text-[11px]">
                                  Core dependency program invoked by {item.name} to settle state.
                                </p>
                              </div>

                              <div className="p-4 rounded-xl bg-surface border border-border flex flex-col justify-between space-y-3">
                                <div>
                                  <span className="text-gray-400 block text-[11px]">Organic Composability Score</span>
                                  <span className="text-lg font-bold font-mono text-white">
                                    {item.organic_score?.toLocaleString()} pts
                                  </span>
                                </div>
                                <Link
                                  href={`/program/${item.program_id}`}
                                  className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-lg bg-gradient-to-r from-solana-purple to-solana-green text-white font-semibold hover:opacity-90 transition-opacity"
                                >
                                  <span>View Directed Call Graph</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
