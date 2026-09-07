'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, ShieldCheck, ArrowUpRight, ArrowDownLeft, 
  ExternalLink, Layers, CheckCircle, Zap,
  ChevronDown, ChevronUp, Copy, Check, TrendingUp, Cpu, Coins, Landmark
} from 'lucide-react';
import { LeaderboardItem } from '../lib/api';
import { ProtocolLogo } from './ProtocolLogo';

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
    const width = 64;
    const height = 20;

    const pathData = points
      .map((p, i) => {
        const x = (i / (points.length - 1)) * width;
        const y = height - ((p - min) / range) * (height - 4) - 2;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathData}
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="space-y-4">
      {/* Sober Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center bg-surface p-4 rounded-xl border border-border">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search programs by name or address..."
            className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border border-border text-white placeholder-slate-500 text-sm focus:outline-none focus:border-solana-green/60 transition-colors"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-surfaceHover text-white border border-border font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-surfaceHover border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-solana-green' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Timeframe & Mode Controls */}
        <div className="flex items-center gap-3 self-end xl:self-auto">
          {/* Organic Mode Toggle */}
          <button
            onClick={() => onModeChange(mode === 'organic' ? 'raw' : 'organic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              mode === 'organic'
                ? 'bg-emerald-950/40 text-solana-green border-emerald-800/40'
                : 'bg-background text-slate-400 border-border hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{mode === 'organic' ? 'Organic Filter' : 'Raw Volume'}</span>
          </button>

          {/* Timeframe */}
          <div className="flex items-center bg-background rounded-lg p-1 border border-border text-xs">
            {['24h', '7d', '30d'].map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-surfaceHover text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-background/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-border">
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
                    <span>Incoming (Callee)</span>
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSortChange('outgoing')}
                >
                  <div className="flex items-center gap-1">
                    <ArrowUpRight className="w-3.5 h-3.5 text-solana-purple" />
                    <span>Outgoing (Caller)</span>
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
                  onClick={() => onSortChange('unique_partners')}
                >
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Partners</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 text-center">24h Trend</th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors text-right"
                  onClick={() => onSortChange('success_rate')}
                >
                  <span>Success Rate</span>
                </th>
                <th className="py-3.5 px-3 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-16 text-slate-400">
                    No programs match your search criteria.
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
                        className={`hover:bg-surfaceHover transition-colors cursor-pointer group ${
                          isExpanded ? 'bg-surfaceHover/80' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center font-mono font-medium">
                          {rankNumber === 1 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
                              1
                            </span>
                          ) : rankNumber === 2 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-400/10 text-slate-300 text-xs font-bold border border-slate-400/30">
                              2
                            </span>
                          ) : rankNumber === 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
                              3
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">{rankNumber}</span>
                          )}
                        </td>

                        {/* Program */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <ProtocolLogo name={item.name} category={item.category} iconUrl={item.icon_url} size="md" />
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5 font-medium text-white group-hover:text-solana-green transition-colors">
                                <Link 
                                  href={`/program/${item.program_id}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:underline flex items-center gap-1"
                                >
                                  {item.name}
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                                </Link>
                                {item.is_verified && (
                                  <CheckCircle className="w-3.5 h-3.5 text-solana-green flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
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

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-background border border-border text-slate-300">
                            {item.category}
                          </span>
                        </td>

                        {/* Incoming */}
                        <td className="py-3.5 px-4 font-mono font-medium text-white">
                          <div className="space-y-1">
                            <span className="text-solana-green font-semibold">{formatNumber(item.total_incoming)}</span>
                            <div className="w-20 h-1 bg-background rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-solana-green rounded-full opacity-80" 
                                style={{ width: `${Math.min(volumePct, 100)}%` }} 
                              />
                            </div>
                          </div>
                        </td>

                        {/* Outgoing */}
                        <td className="py-3.5 px-4 font-mono font-medium text-slate-300">
                          <div className="space-y-0.5">
                            <span className="text-solana-purple font-semibold">{formatNumber(item.total_outgoing)}</span>
                            <span className="block text-[10px] text-slate-500">calls</span>
                          </div>
                        </td>

                        {/* Unique Partners */}
                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{item.total_unique_partners}</span>
                            <span className="text-[10px] text-slate-500">
                              ({item.unique_callers} in / {item.unique_callees} out)
                            </span>
                          </div>
                        </td>

                        {/* Sparkline */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex justify-center">
                            {renderSparkline(item.trend_24h)}
                          </div>
                        </td>

                        {/* Success Rate */}
                        <td className="py-3.5 px-4 text-right font-mono">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${
                              item.success_rate_pct >= 98
                                ? 'text-solana-green bg-emerald-950/30 border border-emerald-800/30'
                                : 'text-slate-300 bg-background border border-border'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {item.success_rate_pct.toFixed(1)}%
                          </span>
                        </td>

                        {/* Expand Icon */}
                        <td className="py-3.5 px-3 text-center text-slate-500">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-white" />
                          ) : (
                            <ChevronDown className="w-4 h-4 group-hover:text-white transition-colors" />
                          )}
                        </td>
                      </tr>

                      {/* Expandable Drawer */}
                      {isExpanded && (
                        <tr className="bg-background/90 border-y border-border">
                          <td colSpan={9} className="p-5">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                              <div className="p-3.5 rounded-lg bg-surface border border-border space-y-1.5">
                                <div className="flex items-center gap-1.5 font-semibold text-solana-purple">
                                  <ArrowDownLeft className="w-3.5 h-3.5" />
                                  <span>Primary Upstream Invocator</span>
                                </div>
                                <p className="text-sm font-medium text-white">
                                  {item.top_caller_preview || 'Solana Client Direct'}
                                </p>
                                <p className="text-slate-400 text-[11px]">
                                  Protocol routing the highest volume of downstream CPI calls into {item.name}.
                                </p>
                              </div>

                              <div className="p-3.5 rounded-lg bg-surface border border-border space-y-1.5">
                                <div className="flex items-center gap-1.5 font-semibold text-solana-green">
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                  <span>Primary Downstream Dependency</span>
                                </div>
                                <p className="text-sm font-medium text-white">
                                  {item.top_callee_preview || 'SPL Token'}
                                </p>
                                <p className="text-slate-400 text-[11px]">
                                  Core smart contract invoked by {item.name} for final state settlement.
                                </p>
                              </div>

                              <div className="p-3.5 rounded-lg bg-surface border border-border flex flex-col justify-between space-y-2">
                                <div>
                                  <span className="text-slate-400 block text-[11px]">Organic Composability Score</span>
                                  <span className="text-base font-bold font-mono text-white">
                                    {item.organic_score?.toLocaleString()} pts
                                  </span>
                                </div>
                                <Link
                                  href={`/program/${item.program_id}`}
                                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-surfaceHover hover:bg-border text-slate-200 hover:text-white font-medium transition-colors border border-border"
                                >
                                  <span>Inspect Call Hierarchy</span>
                                  <ExternalLink className="w-3 h-3" />
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
