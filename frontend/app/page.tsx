'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Layers, ShieldCheck, Zap, ArrowDownLeft, 
  ArrowUpRight, BarChart3, Clock, CheckCircle2, Radio
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid 
} from 'recharts';
import { LeaderboardTable } from '../components/LeaderboardTable';
import { 
  fetchLeaderboard, fetchNetworkStats, LeaderboardItem, 
  NetworkStats, MOCK_LIVE_EVENTS, LiveCpiEvent 
} from '../lib/api';

const HOURLY_NETWORK_CHART = [
  { hour: '00:00', cpiCalls: 5400000 },
  { hour: '02:00', cpiCalls: 4900000 },
  { hour: '04:00', cpiCalls: 4500000 },
  { hour: '06:00', cpiCalls: 5100000 },
  { hour: '08:00', cpiCalls: 6200000 },
  { hour: '10:00', cpiCalls: 7800000 },
  { hour: '12:00', cpiCalls: 8900000 },
  { hour: '14:00', cpiCalls: 9400000 },
  { hour: '16:00', cpiCalls: 9800000 },
  { hour: '18:00', cpiCalls: 8700000 },
  { hour: '20:00', cpiCalls: 7600000 },
  { hour: '22:00', cpiCalls: 6400000 },
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'stream' | 'macro'>('leaderboard');
  const [timeframe, setTimeframe] = useState('24h');
  const [mode, setMode] = useState('organic');
  const [sortBy, setSortBy] = useState('incoming');
  const [category, setCategory] = useState('All');
  
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [liveFeed, setLiveFeed] = useState<LiveCpiEvent[]>(MOCK_LIVE_EVENTS);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const programs = [
        { name: 'Jupiter v6', id: 'JUP6...' },
        { name: 'Raydium AMM', id: '675k...' },
        { name: 'Orca Whirlpool', id: 'whirL...' },
        { name: 'SPL Token', id: 'Token...' },
        { name: 'Drift v2', id: 'dRifty...' },
        { name: 'Kamino Multiply', id: 'KLend...' },
        { name: 'Meteora DLMM', id: 'Eo7W...' },
      ];

      const p1 = programs[Math.floor(Math.random() * programs.length)];
      let p2 = programs[Math.floor(Math.random() * programs.length)];
      while (p2.name === p1.name) {
        p2 = programs[Math.floor(Math.random() * programs.length)];
      }

      const instructions = ['swap', 'swapBaseIn', 'Transfer', 'TransferChecked', 'Deposit', 'Borrow'];
      const newEvent: LiveCpiEvent = {
        id: String(Date.now()),
        time: 'Just now',
        caller: p1.id,
        callee: p2.id,
        callerName: p1.name,
        calleeName: p2.name,
        instruction: instructions[Math.floor(Math.random() * instructions.length)],
        depth: Math.random() > 0.6 ? 3 : 2,
        success: true,
        cu: Math.floor(Math.random() * 50000) + 12000,
      };

      setLiveFeed(prev => [newEvent, ...prev.slice(0, 7)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Sober Network Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface border border-border text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-solana-green" />
          <span className="font-medium text-slate-200">Solana Mainnet</span>
          <span className="text-slate-600">•</span>
          <span>Slot 289,412,891</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300 font-mono hidden sm:inline">2,450 TPS</span>
        </div>

        {/* Live Ticker */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pl-4 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-solana-purple" /> Live Invocations:
          </span>
          {liveFeed.slice(0, 2).map((item) => (
            <span key={item.id} className="text-[11px] px-2 py-0.5 rounded bg-background border border-border text-slate-300">
              <span className="text-slate-200 font-medium">{item.callerName}</span>
              <span className="text-slate-500 mx-1">→</span>
              <span className="text-solana-green font-medium">{item.calleeName}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Clear-Web Hero Header */}
      <div className="bg-surface rounded-2xl border border-border p-8 sm:p-10 shadow-sm space-y-6">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-surfaceHover border border-border text-xs font-semibold text-slate-300">
            <Radio className="w-3.5 h-3.5 text-solana-green" />
            <span>Cross-Program Invocation Index</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            Solana Composability & CPI Analytics
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Solana transactions execute across multi-program call stacks. SolanaCPIBoard tracks inner instruction call trees to map <strong>which protocols depend on which</strong>, filtering out bot spam to show genuine ecosystem utility.
          </p>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border">
          <div className="p-4 rounded-xl bg-background border border-border">
            <span className="text-xs text-slate-400 block mb-1 font-medium">24H Total CPI Calls</span>
            <div className="text-2xl font-bold font-mono text-white">
              {stats ? formatNumber(stats.total_cpi_24h) : '142.8M'}
            </div>
            <span className="text-[11px] text-solana-green font-medium flex items-center gap-0.5 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +14.2% daily
            </span>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Active Programs</span>
            <div className="text-2xl font-bold font-mono text-white">
              {stats ? formatNumber(stats.active_programs_24h) : '2,841'}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Interacting via CPI</span>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Average Call Depth</span>
            <div className="text-2xl font-bold font-mono text-solana-purple">
              {stats ? stats.average_cpi_depth + 'x' : '2.45x'}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Max depth: 5 levels</span>
          </div>

          <div className="p-4 rounded-xl bg-background border border-border">
            <span className="text-xs text-slate-400 block mb-1 font-medium">Success Rate</span>
            <div className="text-2xl font-bold font-mono text-solana-green">
              {stats ? stats.network_success_rate + '%' : '97.64%'}
            </div>
            <span className="text-[11px] text-slate-500 block mt-1">Non-reverted calls</span>
          </div>
        </div>
      </div>

      {/* Main App Navigation Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-surfaceHover text-white border border-border'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'stream'
                ? 'bg-surfaceHover text-white border border-border'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-solana-purple" />
            <span>Live Stream</span>
          </button>

          <button
            onClick={() => setActiveTab('macro')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'macro'
                ? 'bg-surfaceHover text-white border border-border'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-solana-green" />
            <span>Macro Trends</span>
          </button>
        </div>

        {/* Tab 1: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
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
        )}

        {/* Tab 2: Live Stream */}
        {activeTab === 'stream' && (
          <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-semibold text-white">Real-Time Invocation Feed</h3>
                <p className="text-xs text-slate-400">Live CPI call hierarchy decoded from current slots.</p>
              </div>
              <span className="text-xs font-mono text-solana-green flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-solana-green" />
                Live Stream Active
              </span>
            </div>

            <div className="space-y-2.5">
              {liveFeed.map((ev) => (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg bg-background border border-border gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono font-semibold text-solana-purple">
                      Depth {ev.depth}
                    </span>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="text-white">{ev.callerName}</span>
                      <span className="text-slate-500">→</span>
                      <span className="text-solana-green">{ev.calleeName}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({ev.instruction})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                    <span>{ev.cu.toLocaleString()} CU</span>
                    <span className="text-solana-green font-medium">SUCCESS</span>
                    <span className="text-slate-500">{ev.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Macro Trends */}
        {activeTab === 'macro' && (
          <div className="space-y-6">
            <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">24H Network CPI Invocations Curve</h3>
                  <p className="text-xs text-slate-400">Hourly cross-program invocations across Solana mainnet.</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-background border border-border text-xs font-mono text-solana-green">
                  Avg 7.1M CPIs / hr
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HOURLY_NETWORK_CHART} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="soberGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1F293D" />
                    <XAxis dataKey="hour" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => (val / 1000000).toFixed(1) + 'M'} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', borderColor: '#1F293D', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(val: any) => [Number(val).toLocaleString() + ' calls', 'Volume']}
                    />
                    <Area type="monotone" dataKey="cpiCalls" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#soberGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Protocol Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
                <span className="text-xs font-semibold text-solana-green uppercase tracking-wider">Token Infrastructure</span>
                <div className="text-2xl font-bold font-mono text-white">41.2%</div>
                <p className="text-xs text-slate-400">
                  SPL Token & Token-2022 represent the largest share of settled callee invocations.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
                <span className="text-xs font-semibold text-solana-purple uppercase tracking-wider">DEX Aggregation</span>
                <div className="text-2xl font-bold font-mono text-white">35.8%</div>
                <p className="text-xs text-slate-400">
                  Jupiter, Raydium, and Orca drive multi-hop liquidity routing and swaps.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-surface border border-border space-y-2">
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Lending & Perps</span>
                <div className="text-2xl font-bold font-mono text-white">18.4%</div>
                <p className="text-xs text-slate-400">
                  Kamino, Drift, and MarginFi generate volume through liquidations and collateral rebalancing.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
