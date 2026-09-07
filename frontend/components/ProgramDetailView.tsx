'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CheckCircle, ExternalLink, Globe, 
  ArrowDownLeft, ArrowUpRight, Layers, ShieldCheck, Copy, Check
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, CartesianGrid, Legend 
} from 'recharts';
import { fetchProgramDetail, ProgramDetail } from '../lib/api';
import { ProgramFlowGraph } from './ProgramFlowGraph';
import { ProtocolLogo } from './ProtocolLogo';

interface ProgramDetailViewProps {
  address: string;
}

export const ProgramDetailView: React.FC<ProgramDetailViewProps> = ({ address }) => {
  const [program, setProgram] = useState<ProgramDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!address) return;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchProgramDetail(address);
        setProgram(data);
      } catch (err) {
        console.error('Failed to load program details:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [address]);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num?.toLocaleString() || '0';
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-solana-purple border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-400">Loading CPI call hierarchy...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Program Not Found</h2>
        <p className="text-sm text-gray-400">No CPI activity recorded for {address}.</p>
        <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surfaceHover text-sm text-white">
          <ArrowLeft className="w-4 h-4" />
          Back to Leaderboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Link */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to CPI Leaderboard
      </Link>

      {/* Program Header Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ProtocolLogo name={program.name} category={program.category} iconUrl={program.icon_url} size="lg" />

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{program.name}</h1>
                {program.is_verified && (
                  <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-solana-green/10 text-solana-green border border-solana-green/30 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified IDL
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <span>{program.program_id}</span>
                <button onClick={handleCopy} className="p-1 hover:text-white transition-colors" title="Copy Address">
                  {copied ? <Check className="w-3.5 h-3.5 text-solana-green" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-background border border-border text-xs font-medium text-gray-300">
              {program.category}
            </span>
            <a
              href={`https://solscan.io/account/${program.program_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surfaceHover hover:bg-border text-xs font-medium text-gray-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Solscan
            </a>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/80">
          <div>
            <span className="text-xs text-gray-400 block mb-1">Incoming CPIs (Callee)</span>
            <span className="text-xl font-bold font-mono text-solana-green">{formatNumber(program.total_incoming)}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-1">Outgoing CPIs (Caller)</span>
            <span className="text-xl font-bold font-mono text-solana-purple">{formatNumber(program.total_outgoing)}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-1">Unique Callers</span>
            <span className="text-xl font-bold font-mono text-white">{program.unique_callers} protocols</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 block mb-1">Execution Success Rate</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{program.success_rate_pct}%</span>
          </div>
        </div>
      </div>

      {/* Visual CPI Bipartite Flow Map */}
      <ProgramFlowGraph
        programName={program.name}
        programAddress={program.program_id}
        category={program.category}
        topCallers={program.top_callers}
        topCallees={program.top_callees}
      />

      {/* 24-Hour Call Volume Timeline Chart */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">CPI Call Volume Timeline (24 Hours)</h3>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-solana-purple">
              <span className="w-2.5 h-2.5 rounded-full bg-solana-purple" />
              Outgoing Invocations
            </span>
            <span className="flex items-center gap-1.5 text-solana-green">
              <span className="w-2.5 h-2.5 rounded-full bg-solana-green" />
              Incoming Invocations
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={program.history_chart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9945FF" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#9945FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14F195" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14F195" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2430" />
              <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(val) => formatNumber(val)} />
              <Tooltip
                contentStyle={{ backgroundColor: '#12141a', borderColor: '#1f2430', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="outgoing" stroke="#9945FF" strokeWidth={2} fillOpacity={1} fill="url(#purpleGrad)" />
              <Area type="monotone" dataKey="incoming" stroke="#14F195" strokeWidth={2} fillOpacity={1} fill="url(#greenGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
