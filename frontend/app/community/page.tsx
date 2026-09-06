'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, ThumbsUp, Terminal, Plus, ShieldCheck } from 'lucide-react';
import { fetchCommunityQueries, CommunityQuery } from '../../lib/api';
import { InviteModal } from '../../components/InviteModal';

export default function CommunityPage() {
  const [queries, setQueries] = useState<CommunityQuery[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchCommunityQueries();
        setQueries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to CPI Leaderboard
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-6 sm:p-8 rounded-3xl border border-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solana-green/10 border border-solana-green/30 text-solana-green text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Curated Views</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Community CPI Leaderboards</h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl">
            Anyone in the Solana community can propose custom analytics queries. Top voted queries are materialized into permanent pre-aggregated rollups on the main dashboard.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-solana-purple to-solana-green text-white font-medium text-sm hover:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Suggest Leaderboard
        </button>
      </div>

      {/* Queries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {queries.map((q) => (
          <div
            key={q.id}
            className="p-6 rounded-2xl bg-surface border border-border hover:border-solana-purple/50 transition-all shadow-lg flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-solana-purple font-mono">
                  {q.suggested_by}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/40 text-solana-green border border-solana-green/30">
                  {q.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white">{q.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">{q.description}</p>
            </div>

            <div className="pt-4 border-t border-border/80 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setQueries((prev) =>
                    prev.map((item) => (item.id === q.id ? { ...item, upvotes: item.upvotes + 1 } : item))
                  );
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background hover:bg-surfaceHover border border-border text-gray-300 hover:text-white transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-solana-green" />
                <span>{q.upvotes} Upvotes</span>
              </button>
              <span className="text-gray-500 font-mono text-[11px]">{q.created_at}</span>
            </div>
          </div>
        ))}
      </div>

      <InviteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
