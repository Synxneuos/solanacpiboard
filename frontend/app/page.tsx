'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Layers, GitFork, ShieldCheck, Zap, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { fetchLeaderboard, fetchNetworkStats, LeaderboardItem, NetworkStats } from '../lib/api';

export default function HomePage() {
  const [timeframe, setTimeframe] = useState('24h');
  const [mode, setMode] = useState('organic');
  const [sortBy, setSortBy] = useState('incoming');
  const [category, setCategory] = useState('All');
  
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [lbData, netStats] = await Promise.all([
          fetchLeaderboard({ timeframe, sortBy, category, mode }),
          fetchNetworkStats(),
        ]);
        setItems(lbData.items);
        setStats(netStats);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [timeframe, mode, sortBy, category]);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-96 h-96 bg-solana-purple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-solana-green/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solana-purple/10 border border-solana-purple/30 text-solana-purple text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            <span>Solana Composability Index</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Mapping Solana's <span className="text-gradient">CPI Composability Graph</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Raw transaction counts are easily gamed by bots. <strong>SolanaCPIBoard</strong> ranks programs by true Cross-Program Invocation activity: who is calling who, which protocols act as the foundational base layer, and which orchestrate multi-hop DeFi routes.
          </p>
        </div>

        {/* Live Network Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/80">
          <div className="p-4 rounded-xl bg-background/60 border border-border">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>24H Total CPIs</span>
              <span className="w-2 h-2 rounded-full bg-solana-green animate-ping" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {stats ? formatNumber(stats.total_cpi_24h) : '142.8M'}
            </div>
            <span className="text-[11px] text-solana-green font-medium">+14.2% vs yesterday</span>
          </div>

          <div className="p-4 rounded-xl bg-background/60 border border-border">
            <div className="text-xs text-gray-400 mb-1">Active Programs</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white">
              {stats ? formatNumber(stats.active_programs_24h) : '2,841'}
            </div>
            <span className="text-[11px] text-gray-400">Interacting via CPI</span>
          </div>

          <div className="p-4 rounded-xl bg-background/60 border border-border">
            <div className="text-xs text-gray-400 mb-1">Avg Call Depth</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-solana-purple">
              {stats ? stats.average_cpi_depth + 'x' : '2.45x'}
            </div>
            <span className="text-[11px] text-gray-400">Max observed: 5 levels</span>
          </div>

          <div className="p-4 rounded-xl bg-background/60 border border-border">
            <div className="text-xs text-gray-400 mb-1">Network Success Rate</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-solana-green">
              {stats ? stats.network_success_rate + '%' : '97.64%'}
            </div>
            <span className="text-[11px] text-gray-400">Non-reverted CPIs</span>
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">CPI Leaderboard</h2>
            <p className="text-xs text-gray-400">
              Ranked by {mode === 'organic' ? 'Sybil-resistant organic activity score' : 'raw invocation volume'}.
            </p>
          </div>
          {loading && (
            <div className="flex items-center gap-2 text-xs text-solana-purple animate-pulse">
              <Activity className="w-4 h-4" />
              <span>Updating rollups...</span>
            </div>
          )}
        </div>

        <LeaderboardTable
          initialItems={items}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          mode={mode}
          onModeChange={setMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          category={category}
          onCategoryChange={setCategory}
        />
      </div>
    </div>
  );
}
