'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowDownLeft, ArrowUpRight, Zap, ExternalLink } from 'lucide-react';
import { CallerCalleeEntry } from '../lib/api';

interface ProgramFlowGraphProps {
  programName: string;
  programAddress: string;
  category: string;
  topCallers: CallerCalleeEntry[];
  topCallees: CallerCalleeEntry[];
}

export const ProgramFlowGraph: React.FC<ProgramFlowGraphProps> = ({
  programName,
  programAddress,
  category,
  topCallers,
  topCallees,
}) => {
  const formatCompact = (val: number) => {
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
    if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K';
    return String(val);
  };

  return (
    <div className="bg-surface rounded-2xl border border-border p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border/80 gap-2">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-solana-green" />
            CPI Invocation Flow Map (Composability Graph)
          </h3>
          <p className="text-xs text-gray-400">
            Directed cross-program dependencies: who depends on this program vs who it invokes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
        {/* Left Column: Top Callers (Upstream Dependency) */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-solana-purple">
            <ArrowDownLeft className="w-4 h-4" />
            <span>Top Invocators (Callers)</span>
          </div>

          <div className="space-y-2">
            {topCallers.length === 0 ? (
              <div className="p-4 rounded-xl bg-background border border-border text-center text-xs text-gray-500">
                No upstream callers recorded.
              </div>
            ) : (
              topCallers.map((c, i) => (
                <Link
                  key={i}
                  href={`/program/${c.caller_program_id}`}
                  className="block p-3 rounded-xl bg-background hover:bg-surfaceHover border border-border hover:border-solana-purple/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white group-hover:text-solana-purple transition-colors truncate max-w-[140px]">
                      {c.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-gray-400">
                      {c.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400 font-mono">
                    <span>{formatCompact(c.call_count)} calls</span>
                    <span className="text-solana-green">{c.success_rate}% ok</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Center Column: Focus Program */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-surfaceHover to-background border-2 border-solana-purple/40 shadow-lg text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-solana-purple/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-solana-purple to-solana-green p-0.5 mb-3 shadow-md">
            <div className="w-full h-full bg-surface rounded-[10px] flex items-center justify-center font-bold text-white text-base">
              {programName[0]}
            </div>
          </div>

          <h4 className="text-base font-bold text-white mb-1">{programName}</h4>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-solana-purple/20 text-solana-purple border border-solana-purple/30 mb-3">
            {category}
          </span>
          <span className="text-[10px] font-mono text-gray-400 break-all max-w-[200px] mb-4">
            {programAddress}
          </span>

          <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-border/80 text-xs font-mono">
            <div className="bg-background/80 p-2 rounded-lg border border-border">
              <span className="text-gray-500 block text-[10px]">INCOMING</span>
              <span className="text-solana-green font-bold">
                {formatCompact(topCallers.reduce((acc, x) => acc + x.call_count, 0))}
              </span>
            </div>
            <div className="bg-background/80 p-2 rounded-lg border border-border">
              <span className="text-gray-500 block text-[10px]">OUTGOING</span>
              <span className="text-solana-purple font-bold">
                {formatCompact(topCallees.reduce((acc, x) => acc + x.call_count, 0))}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Top Callees (Downstream Invocations) */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-solana-green">
            <ArrowUpRight className="w-4 h-4" />
            <span>Downstream Targets (Callees)</span>
          </div>

          <div className="space-y-2">
            {topCallees.length === 0 ? (
              <div className="p-4 rounded-xl bg-background border border-border text-center text-xs text-gray-500">
                No downstream callees recorded (Leaf Node).
              </div>
            ) : (
              topCallees.map((c, i) => (
                <Link
                  key={i}
                  href={`/program/${c.callee_program_id}`}
                  className="block p-3 rounded-xl bg-background hover:bg-surfaceHover border border-border hover:border-solana-green/50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white group-hover:text-solana-green transition-colors truncate max-w-[140px]">
                      {c.name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-gray-400">
                      {c.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400 font-mono">
                    <span>{formatCompact(c.call_count)} calls</span>
                    <span className="text-solana-green">{c.success_rate}% ok</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
