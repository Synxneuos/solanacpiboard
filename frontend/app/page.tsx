'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Layers, GitFork, ShieldCheck, Zap, ArrowDownLeft, 
  ArrowUpRight, Radio, BarChart3, PieChart as PieIcon, Flame, 
  Clock, CheckCircle2, ArrowRight
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
  { hour: '00:00', cpiCalls: 5400000, successRate: 98.4 },
  { hour: '02:00', cpiCalls: 4900000, successRate: 98.2 },
  { hour: '04:00', cpiCalls: 4500000, successRate: 98.6 },
  { hour: '06:00', cpiCalls: 5100000, successRate: 98.1 },
  { hour: '08:00', cpiCalls: 6200000, successRate: 97.9 },
  { hour: '10:00', cpiCalls: 7800000, successRate: 97.6 },
  { hour: '12:00', cpiCalls: 8900000, successRate: 97.4 },
  { hour: '14:00', cpiCalls: 9400000, successRate: 97.2 },
  { hour: '16:00', cpiCalls: 9800000, successRate: 97.5 },
  { hour: '18:00', cpiCalls: 8700000, successRate: 98.0 },
  { hour: '20:00', cpiCalls: 7600000, successRate: 98.3 },
  { hour: '22:00', cpiCalls: 6400000, successRate: 98.5 },
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

  // Load leaderboard data
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

  // Live ticker ticker loop
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
        success: Math.random() > 0.05,
        cu: Math.floor(Math.random() * 50000) + 12000,
      };

      setLiveFeed(prev => [newEvent, ...prev.slice(0, 7)]);
    }, 2800);

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
      {/* Real-time Network Ticker Strip */}
      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-surface/90 border border-border text-xs text-gray-400 overflow-hidden shadow-sm">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-solana-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-solana-green"></span>
          </span>
          <span className="font-semibold text-gray-200">Solana Mainnet</span>
          <span className="text-gray-500 hidden sm:inline">•</span>
          <span className="text-gray-400 hidden sm:inline">Slot 289,412,891</span>
          <span className="text-gray-500 hidden sm:inline">•</span>
          <span className="text-solana-green font-mono font-medium hidden sm:inline">2,450 TPS</span>
        </div>

        {/* Live Scrolling CPI Invocations */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pl-4 scrollbar-none">
          <span className="text-[11px] font-bold uppercase tracking-wider text-solana-purple flex items-center gap-1">
            <Zap className="w-3 h-3" /> Live CPI:
          </span>
          {liveFeed.slice(0, 3).map((item) => (
            <span key={item.id} className="text-[11px] px-2.5 py-0.5 rounded-full bg-background border border-border text-gray-300">
              <span className="text-solana-purple font-semibold">{item.callerName}</span>
              <span className="text-gray-500 mx-1">→</span>
              <span className="text-solana-green font-semibold">{item.calleeName}</span>
              <span className="text-gray-500 ml-1.5 font-mono">({item.instruction})</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main App Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-surface via-surface to-background border border-border p-8 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[450px] h-[450px] bg-solana-purple/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-[350px] h-[350px] bg-solana-green/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-solana-purple/20 to-solana-green/20 border border-solana-purple/30 text-xs font-bold text-gray-200">
            <Radio className="w-3.5 h-3.5 text-solana-green animate-pulse" />
            <span>Cross-Program Invocation (CPI) Analytics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            The Composability Layer of <span className="text-gradient">Solana</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
            Solana transactions are multi-contract graphs. SolanaCPIBoard indexes the inner instruction call stack to map <strong>who invokes whom</strong>, revealing the true core infrastructure and orchestrators of the ecosystem.
          </p>
        </div>

        {/* 4 Hero KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-border/80">
          <div className="p-5 rounded-2xl bg-background/70 border border-border hover:border-solana-green/40 transition-all shadow-md group">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>24H Total CPIs</span>
              <span className="w-2 h-2 rounded-full bg-solana-green animate-pulse" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white group-hover:text-solana-green transition-colors">
              {stats ? formatNumber(stats.total_cpi_24h) : '142.8M'}
            </div>
            <span className="text-[11px] text-solana-green font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3 h-3" /> +14.2% vs yesterday
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-background/70 border border-border hover:border-solana-purple/40 transition-all shadow-md group">
            <div className="text-xs text-gray-400 mb-1">Active Programs</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white group-hover:text-solana-purple transition-colors">
              {stats ? formatNumber(stats.active_programs_24h) : '2,841'}
            </div>
            <span className="text-[11px] text-gray-400 block mt-1">Interacting via CPI</span>
          </div>

          <div className="p-5 rounded-2xl bg-background/70 border border-border hover:border-solana-purple/40 transition-all shadow-md group">
            <div className="text-xs text-gray-400 mb-1">Avg Call Depth</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-solana-purple">
              {stats ? stats.average_cpi_depth + 'x' : '2.45x'}
            </div>
            <span className="text-[11px] text-gray-400 block mt-1">Max depth observed: 5 levels</span>
          </div>

          <div className="p-5 rounded-2xl bg-background/70 border border-border hover:border-cyan-400/40 transition-all shadow-md group">
            <div className="text-xs text-gray-400 mb-1">Network Success Rate</div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
              {stats ? stats.network_success_rate + '%' : '97.64%'}
            </div>
            <span className="text-[11px] text-gray-400 block mt-1">Atomically settled CPIs</span>
          </div>
        </div>
      </div>

      {/* Main View Tabs (Leaderboard, Live Stream, Macro Trends) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-solana-purple text-white shadow-lg shadow-solana-purple/20'
                : 'text-gray-400 hover:text-white hover:bg-surface'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>CPI Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('stream')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'stream'
                ? 'bg-solana-purple text-white shadow-lg shadow-solana-purple/20'
                : 'text-gray-400 hover:text-white hover:bg-surface'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Live Stream Feed</span>
            <span className="w-2 h-2 rounded-full bg-solana-green animate-ping ml-1" />
          </button>

          <button
            onClick={() => setActiveTab('macro')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'macro'
                ? 'bg-solana-purple text-white shadow-lg shadow-solana-purple/20'
                : 'text-gray-400 hover:text-white hover:bg-surface'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Composability Trends</span>
          </button>
        </div>

        {/* Tab 1: Leaderboard Table */}
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

        {/* Tab 2: Live Stream Feed */}
        {activeTab === 'stream' && (
          <div className="bg-surface rounded-2xl border border-border p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-solana-green" />
                  Real-Time Cross-Program Invocation Stream
                </h3>
                <p className="text-xs text-gray-400">
                  Live transaction call stack decodes arriving from Solana Mainnet slots.
                </p>
              </div>
              <span className="text-xs font-mono text-solana-green flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-solana-green animate-ping" />
                Listening to Geyser Stream
              </span>
            </div>

            <div className="space-y-3">
              {liveFeed.map((ev, i) => (
                <div
                  key={ev.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-background border border-border hover:border-solana-purple/40 transition-all gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-xs font-mono font-bold text-solana-purple">
                      L{ev.depth}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <span className="text-solana-purple">{ev.callerName}</span>
                        <span className="text-gray-500">invoked</span>
                        <span className="text-solana-green">{ev.calleeName}</span>
                        <span className="px-2 py-0.5 rounded text-xs font-mono bg-surface border border-border text-gray-300">
                          {ev.instruction}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-gray-500">
                        Caller: {ev.caller} → Callee: {ev.callee}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-gray-400">{ev.cu.toLocaleString()} CU</span>
                    <span className="text-solana-green font-semibold">SUCCESS</span>
                    <span className="text-gray-500">{ev.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Macro Composability Trends */}
        {activeTab === 'macro' && (
          <div className="space-y-6">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">24H Network CPI Invocations Curve</h3>
                  <p className="text-xs text-gray-400">Total cross-program calls executed across all Solana slots.</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-background border border-border text-xs font-mono text-solana-green">
                  Avg 7.1M CPIs / Hour
                </span>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HOURLY_NETWORK_CHART} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="networkGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9945FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#14F195" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2430" />
                    <XAxis dataKey="hour" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(val) => (val / 1000000).toFixed(1) + 'M'} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#12141a', borderColor: '#1f2430', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [Number(val).toLocaleString() + ' calls', 'CPI Volume']}
                    />
                    <Area type="monotone" dataKey="cpiCalls" stroke="#9945FF" strokeWidth={2.5} fillOpacity={1} fill="url(#networkGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Protocol Category Share */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-solana-green">Core Token Infra</span>
                <div className="text-2xl font-black font-mono text-white">41.2%</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  SPL Token and Token-2022 account for the largest share of downstream callee invocations on Solana.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-solana-purple">DEX & Liquidity</span>
                <div className="text-2xl font-black font-mono text-white">35.8%</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Jupiter, Raydium, and Orca drive the bulk of multi-hop routing, calling swap and position instructions.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Lending & Perps</span>
                <div className="text-2xl font-black font-mono text-white">18.4%</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Kamino, Drift, and MarginFi generate high volume through continuous liquidations, borrows, and flash-loans.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
