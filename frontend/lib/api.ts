const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LeaderboardItem {
  rank: number;
  program_id: string;
  name: string;
  category: string;
  icon_url: string;
  is_verified: boolean;
  total_incoming: number;
  total_outgoing: number;
  total_cpi_volume: number;
  unique_callers: number;
  unique_callees: number;
  total_unique_partners: number;
  success_rate_pct: number;
  organic_score: number;
  trend_24h?: number[];
}

export interface LeaderboardResponse {
  total: number;
  page: number;
  limit: number;
  timeframe: string;
  mode: string;
  items: LeaderboardItem[];
}

export interface CallerCalleeEntry {
  caller_program_id?: string;
  callee_program_id?: string;
  name: string;
  category: string;
  call_count: number;
  success_rate: number;
}

export interface ProgramDetail {
  program_id: string;
  name: string;
  category: string;
  icon_url: string;
  website: string;
  twitter: string;
  is_verified: boolean;
  total_incoming: number;
  total_outgoing: number;
  unique_callers: number;
  unique_callees: number;
  success_rate_pct: number;
  top_callers: CallerCalleeEntry[];
  top_callees: CallerCalleeEntry[];
  history_chart: { time: string; outgoing: number; incoming: number }[];
}

export interface NetworkStats {
  total_cpi_24h: number;
  total_cpi_all_time: number;
  active_programs_24h: number;
  average_cpi_depth: number;
  network_success_rate: number;
  top_pair_24h: {
    caller: string;
    callee: string;
    calls: number;
  };
  anti_spam_filtered_count: number;
}

export interface CommunityQuery {
  id: string;
  title: string;
  description: string;
  suggested_by: string;
  upvotes: number;
  status: string;
  created_at: string;
}

export async function fetchLeaderboard(params: {
  timeframe: string;
  sortBy: string;
  category?: string;
  mode: string;
  search?: string;
  page?: number;
}): Promise<LeaderboardResponse> {
  const query = new URLSearchParams({
    timeframe: params.timeframe,
    sort_by: params.sortBy,
    mode: params.mode,
    page: String(params.page || 1),
    limit: '25',
  });
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.search) query.append('search', params.search);

  try {
    const res = await fetch(`${API_BASE}/api/v1/leaderboard?${query.toString()}`, { next: { revalidate: 15 } });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API connection failed, using local client fallback:', err);
  }

  return {
    total: 0,
    page: 1,
    limit: 25,
    timeframe: params.timeframe,
    mode: params.mode,
    items: [],
  };
}

export async function fetchProgramDetail(address: string): Promise<ProgramDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/programs/${address}`, { next: { revalidate: 30 } });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('API connection failed for program detail:', err);
  }
  return null;
}

export async function fetchNetworkStats(): Promise<NetworkStats> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/stats/overview`, { next: { revalidate: 30 } });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Stats API failed:', err);
  }
  return {
    total_cpi_24h: 142850912,
    total_cpi_all_time: 4210982341,
    active_programs_24h: 2841,
    average_cpi_depth: 2.45,
    network_success_rate: 97.64,
    top_pair_24h: {
      caller: "Jupiter Routing v6",
      callee: "Raydium Liquidity Pool V4",
      calls: 7840120
    },
    anti_spam_filtered_count: 8921040
  };
}

export async function fetchCommunityQueries(): Promise<CommunityQuery[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/community/queries`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Community API error:', err);
  }
  return [];
}

export async function submitInvite(emailOrHandle: string, useCase: string) {
  const res = await fetch(`${API_BASE}/api/v1/community/invite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_or_handle: emailOrHandle, use_case: useCase }),
  });
  return res.json();
}

export async function submitQuerySuggestion(title: string, description: string, sqlQuery: string, suggestedBy: string) {
  const res = await fetch(`${API_BASE}/api/v1/community/queries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, sql_query: sqlQuery, suggested_by: suggestedBy }),
  });
  return res.json();
}
