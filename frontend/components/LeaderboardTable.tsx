'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, ShieldCheck, ArrowUpRight, ArrowDownLeft, 
  ExternalLink, Layers, CheckCircle, Flame, Filter, Zap
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

const CATEGORIES = ['All', 'DEX', 'Lending', 'Perps', 'Token', 'System'];

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

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-surface p-4 rounded-2xl border border-border">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by program name or address..."
            className="w-full pl-10 pr-4 py-2 bg-background rounded-xl border border-border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-solana-green transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-solana-purple/20 text-solana-purple border border-solana-purple/40 font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-surfaceHover border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timeframe & Anti-Sybil Toggles */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          {/* Organic vs Raw Toggle */}
          <button
            onClick={() => onModeChange(mode === 'organic' ? 'raw' : 'organic')}
            title="Organic Mode weights rankings by unique fee-payers to neutralize spam loops"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              mode === 'organic'
                ? 'bg-emerald-950/40 text-solana-green border-solana-green/40 shadow-sm'
                : 'bg-surface text-gray-400 border-border hover:text-gray-200'
            }`}
          >
            {mode === 'organic' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-solana-green" />
                <span>Organic Filter</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Raw Volume</span>
              </>
            )}
          </button>

          {/* Timeframe Buttons */}
          <div className="flex items-center bg-background rounded-lg p-1 border border-border text-xs">
            {['24h', '7d', '30d'].map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-surface text-white shadow'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-background/80 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-border">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                <th className="py-3.5 px-4">Program</th>
                <th className="py-3.5 px-4">Category</th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSortChange('incoming')}
                >
                  <div className="flex items-center gap-1">
                    <ArrowDownLeft className="w-3.5 h-3.5 text-solana-green" />
                    <span>Incoming CPIs</span>
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSortChange('outgoing')}
                >
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-solana-purple" />
                    <span>Outgoing CPIs</span>
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSortChange('unique_partners')}
                >
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Unique Partners</span>
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors text-right"
                  onClick={() => onSortChange('success_rate')}
                >
                  <span>Success Rate</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    No programs matched the query or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const rankNumber = idx + 1;
                  return (
                    <tr
                      key={item.program_id}
                      className="hover:bg-surfaceHover/80 transition-colors group cursor-pointer"
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center font-mono font-bold">
                        {rankNumber === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs border border-amber-500/30">
                            1
                          </span>
                        ) : rankNumber === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-300/20 text-gray-300 text-xs border border-gray-300/30">
                            2
                          </span>
                        ) : rankNumber === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-600 text-xs border border-amber-700/30">
                            3
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">{rankNumber}</span>
                        )}
                      </td>

                      {/* Program Info */}
                      <td className="py-4 px-4">
                        <Link href={`/program/${item.program_id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.icon_url ? (
                              <img src={item.icon_url} alt={item.name} className="w-6 h-6 object-contain" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-solana-purple/30 to-solana-green/30 flex items-center justify-center text-xs font-bold text-white">
                                {item.name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-semibold text-white group-hover:text-solana-green transition-colors">
                              <span>{item.name}</span>
                              {item.is_verified && (
                                <CheckCircle className="w-3.5 h-3.5 text-solana-green flex-shrink-0" />
                              )}
                            </div>
                            <span className="text-xs font-mono text-gray-500">
                              {item.program_id.slice(0, 4)}...{item.program_id.slice(-4)}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-background border border-border text-gray-300">
                          {item.category}
                        </span>
                      </td>

                      {/* Incoming CPIs */}
                      <td className="py-4 px-4 font-mono font-medium text-white">
                        <div className="flex items-baseline gap-1.5">
                          <span>{formatNumber(item.total_incoming)}</span>
                          <span className="text-[10px] text-gray-500">calls</span>
                        </div>
                      </td>

                      {/* Outgoing CPIs */}
                      <td className="py-4 px-4 font-mono font-medium text-gray-300">
                        <div className="flex items-baseline gap-1.5">
                          <span>{formatNumber(item.total_outgoing)}</span>
                          <span className="text-[10px] text-gray-500">calls</span>
                        </div>
                      </td>

                      {/* Unique Partners */}
                      <td className="py-4 px-4 font-mono text-gray-300">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">{item.total_unique_partners}</span>
                          <span className="text-[10px] text-gray-500">
                            ({item.unique_callers} callers / {item.unique_callees} callees)
                          </span>
                        </div>
                      </td>

                      {/* Success Rate */}
                      <td className="py-4 px-4 text-right font-mono">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                item.success_rate_pct >= 98
                                  ? 'bg-solana-green'
                                  : item.success_rate_pct >= 95
                                  ? 'bg-yellow-400'
                                  : 'bg-red-400'
                              }`}
                              style={{ width: `${Math.min(item.success_rate_pct, 100)}%` }}
                            />
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              item.success_rate_pct >= 98
                                ? 'text-solana-green'
                                : item.success_rate_pct >= 95
                                ? 'text-yellow-400'
                                : 'text-red-400'
                            }`}
                          >
                            {item.success_rate_pct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
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
