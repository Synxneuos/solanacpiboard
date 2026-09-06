'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { submitInvite, submitQuerySuggestion } from '../lib/api';

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'share' | 'invite'>('share');
  
  // Share Query state
  const [queryTitle, setQueryTitle] = useState('');
  const [queryDesc, setQueryDesc] = useState('');
  const [querySql, setQuerySql] = useState('');
  const [authorHandle, setAuthorHandle] = useState('');
  
  // Invite state
  const [emailOrHandle, setEmailOrHandle] = useState('');
  const [useCase, setUseCase] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'share') {
        await submitQuerySuggestion(queryTitle, queryDesc, querySql, authorHandle);
      } else {
        await submitInvite(emailOrHandle, useCase);
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setQueryTitle('');
    setQueryDesc('');
    setQuerySql('');
    setEmailOrHandle('');
    setUseCase('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-solana-green" />
            <h3 className="text-base font-semibold text-white">Community & Access</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-surfaceHover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-border/80 bg-background/50">
          <button
            onClick={() => { setActiveTab('share'); setIsSubmitted(false); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'share'
                ? 'text-solana-green border-b-2 border-solana-green bg-surface'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Suggest Leaderboard / Query
          </button>
          <button
            onClick={() => { setActiveTab('invite'); setIsSubmitted(false); }}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'invite'
                ? 'text-solana-purple border-b-2 border-solana-purple bg-surface'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Request API Key / Invite
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-solana-green mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-white">
                {activeTab === 'share' ? 'Query Proposal Received!' : 'Invite Request Logged!'}
              </h4>
              <p className="text-sm text-gray-400 max-w-sm mx-auto">
                {activeTab === 'share'
                  ? 'Your query suggestion has been submitted to the community registry for review and indexer rollup scheduling.'
                  : 'We review requests continuously and dispatch early access keys via X DM or email.'}
              </p>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 rounded-lg bg-surfaceHover hover:bg-border text-sm font-medium text-white transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'share' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Dashboard / Leaderboard Title
                    </label>
                    <input
                      type="text"
                      required
                      value={queryTitle}
                      onChange={(e) => setQueryTitle(e.target.value)}
                      placeholder="e.g. Top Oracle Callers in Solana Lending"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-solana-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Description & Hypothesis
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={queryDesc}
                      onChange={(e) => setQueryDesc(e.target.value)}
                      placeholder="What does this leaderboard track and why is it important for the Solana ecosystem?"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-solana-green"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      SQL Query (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={querySql}
                      onChange={(e) => setQuerySql(e.target.value)}
                      placeholder="SELECT caller_program_id, SUM(total_calls)..."
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-mono text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-solana-green font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Your X (Twitter) Handle or Address
                    </label>
                    <input
                      type="text"
                      required
                      value={authorHandle}
                      onChange={(e) => setAuthorHandle(e.target.value)}
                      placeholder="@yourhandle or Solana address"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-solana-green"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-lg bg-solana-purple/10 border border-solana-purple/20 text-xs text-purple-200">
                    <div className="flex items-center gap-1.5 font-semibold text-solana-purple mb-1">
                      <ShieldCheck className="w-4 h-4" />
                      Self-Hosting & API Access
                    </div>
                    SolanaCPIBoard is 100% open source. Request an invite for our hosted ClickHouse/PostgreSQL high-speed analytics cluster.
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Email or X (Twitter) Handle
                    </label>
                    <input
                      type="text"
                      required
                      value={emailOrHandle}
                      onChange={(e) => setEmailOrHandle(e.target.value)}
                      placeholder="dev@solanacpiboard.xyz or @handle"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-solana-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Intended Use Case
                    </label>
                    <textarea
                      rows={3}
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                      placeholder="e.g. Building an automated DEX arbitrage bot, protocol security audit, or institutional analytics"
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-white placeholder-gray-500 text-sm focus:outline-none focus:border-solana-purple"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-solana-purple to-solana-green text-white font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Submitting...' : activeTab === 'share' ? 'Submit Query Suggestion' : 'Request Early Access'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
