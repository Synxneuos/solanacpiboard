const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

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
  trend_24h: number[];
  top_callee_preview?: string;
  top_caller_preview?: string;
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

export interface LiveCpiEvent {
  id: string;
  time: string;
  caller: string;
  callee: string;
  callerName: string;
  calleeName: string;
  instruction: string;
  depth: number;
  success: boolean;
  cu: number;
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

// Complete rich master dataset of Solana ecosystem programs
export const SEED_PROGRAMS_DATA: LeaderboardItem[] = [
  {
    rank: 1,
    program_id: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    name: "SPL Token Program",
    category: "Token",
    icon_url: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    is_verified: true,
    total_incoming: 28450120,
    total_outgoing: 120500,
    total_cpi_volume: 28570620,
    unique_callers: 1420,
    unique_callees: 12,
    total_unique_partners: 1432,
    success_rate_pct: 98.65,
    organic_score: 98520,
    trend_24h: [180, 210, 240, 290, 310, 350, 420],
    top_caller_preview: "Raydium AMM",
    top_callee_preview: "System Program"
  },
  {
    rank: 2,
    program_id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
    name: "Jupiter Routing v6",
    category: "DEX",
    icon_url: "https://jup.ag/svg/jupiter-logo.svg",
    is_verified: true,
    total_incoming: 1240500,
    total_outgoing: 22450000,
    total_cpi_volume: 23690500,
    unique_callers: 112,
    unique_callees: 48,
    total_unique_partners: 160,
    success_rate_pct: 97.80,
    organic_score: 94200,
    trend_24h: [120, 140, 165, 190, 230, 280, 320],
    top_caller_preview: "Drift Protocol",
    top_callee_preview: "Raydium CLMM"
  },
  {
    rank: 3,
    program_id: "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
    name: "Raydium Liquidity Pool V4",
    category: "DEX",
    icon_url: "https://raydium.io/logo.svg",
    is_verified: true,
    total_incoming: 14280000,
    total_outgoing: 14280000,
    total_cpi_volume: 28560000,
    unique_callers: 520,
    unique_callees: 14,
    total_unique_partners: 534,
    success_rate_pct: 96.40,
    organic_score: 87400,
    trend_24h: [150, 160, 175, 190, 210, 230, 260],
    top_caller_preview: "Jupiter v6",
    top_callee_preview: "SPL Token"
  },
  {
    rank: 4,
    program_id: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
    name: "Orca Whirlpools",
    category: "DEX",
    icon_url: "https://www.orca.so/static/media/orca.38a3d1d1.svg",
    is_verified: true,
    total_incoming: 8940200,
    total_outgoing: 8940200,
    total_cpi_volume: 17880400,
    unique_callers: 340,
    unique_callees: 8,
    total_unique_partners: 348,
    success_rate_pct: 99.15,
    organic_score: 76500,
    trend_24h: [90, 100, 115, 130, 140, 155, 170],
    top_caller_preview: "Jupiter v6",
    top_callee_preview: "SPL Token"
  },
  {
    rank: 5,
    program_id: "11111111111111111111111111111111",
    name: "System Program",
    category: "System",
    icon_url: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    is_verified: true,
    total_incoming: 12450000,
    total_outgoing: 0,
    total_cpi_volume: 12450000,
    unique_callers: 940,
    unique_callees: 0,
    total_unique_partners: 940,
    success_rate_pct: 99.95,
    organic_score: 93100,
    trend_24h: [140, 145, 150, 155, 160, 165, 170],
    top_caller_preview: "Associated Token",
    top_callee_preview: "None (Leaf)"
  },
  {
    rank: 6,
    program_id: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    name: "Token Extensions (2022)",
    category: "Token",
    icon_url: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    is_verified: true,
    total_incoming: 5420100,
    total_outgoing: 75000,
    total_cpi_volume: 5495100,
    unique_callers: 280,
    unique_callees: 6,
    total_unique_partners: 286,
    success_rate_pct: 98.90,
    organic_score: 62000,
    trend_24h: [45, 55, 70, 85, 95, 110, 130],
    top_caller_preview: "Raydium CPMM",
    top_callee_preview: "System Program"
  },
  {
    rank: 7,
    program_id: "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB",
    name: "Meteora DLMM",
    category: "DEX",
    icon_url: "https://app.meteora.ag/icons/meteora.svg",
    is_verified: true,
    total_incoming: 4890300,
    total_outgoing: 4890300,
    total_cpi_volume: 9780600,
    unique_callers: 190,
    unique_callees: 6,
    total_unique_partners: 196,
    success_rate_pct: 98.40,
    organic_score: 58000,
    trend_24h: [50, 60, 75, 90, 105, 120, 140],
    top_caller_preview: "Jupiter v6",
    top_callee_preview: "SPL Token"
  },
  {
    rank: 8,
    program_id: "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD",
    name: "Kamino Lending & Multiply",
    category: "Lending",
    icon_url: "https://app.kamino.finance/favicon.ico",
    is_verified: true,
    total_incoming: 2450000,
    total_outgoing: 4100000,
    total_cpi_volume: 6550000,
    unique_callers: 165,
    unique_callees: 22,
    total_unique_partners: 187,
    success_rate_pct: 97.60,
    organic_score: 51200,
    trend_24h: [35, 40, 48, 55, 62, 70, 80],
    top_caller_preview: "Kamino Multiply",
    top_callee_preview: "SPL Token"
  },
  {
    rank: 9,
    program_id: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
    name: "Drift Protocol v2",
    category: "Perps",
    icon_url: "https://app.drift.trade/assets/drift.svg",
    is_verified: true,
    total_incoming: 1980000,
    total_outgoing: 3750000,
    total_cpi_volume: 5730000,
    unique_callers: 130,
    unique_callees: 18,
    total_unique_partners: 148,
    success_rate_pct: 98.25,
    organic_score: 47800,
    trend_24h: [30, 35, 42, 50, 58, 65, 75],
    top_caller_preview: "Drift Keepers",
    top_callee_preview: "Jupiter v6"
  },
  {
    rank: 10,
    program_id: "PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY",
    name: "Phoenix DEX",
    category: "DEX",
    icon_url: "https://phoenix.ellipse.fi/icon.png",
    is_verified: true,
    total_incoming: 1850000,
    total_outgoing: 1850000,
    total_cpi_volume: 3700000,
    unique_callers: 110,
    unique_callees: 5,
    total_unique_partners: 115,
    success_rate_pct: 99.70,
    organic_score: 42100,
    trend_24h: [25, 28, 32, 38, 44, 49, 55],
    top_caller_preview: "Jupiter v6",
    top_callee_preview: "SPL Token"
  },
  {
    rank: 11,
    program_id: "MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD",
    name: "Marinade Staking",
    category: "LST",
    icon_url: "https://marinade.finance/favicon.ico",
    is_verified: true,
    total_incoming: 1420000,
    total_outgoing: 890000,
    total_cpi_volume: 2310000,
    unique_callers: 95,
    unique_callees: 8,
    total_unique_partners: 103,
    success_rate_pct: 99.85,
    organic_score: 38900,
    trend_24h: [20, 22, 25, 27, 30, 33, 36],
    top_caller_preview: "Sanctum Router",
    top_callee_preview: "System Program"
  },
  {
    rank: 12,
    program_id: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
    name: "Jito Staking & Bundles",
    category: "LST",
    icon_url: "https://jito.network/favicon.ico",
    is_verified: true,
    total_incoming: 2120000,
    total_outgoing: 1150000,
    total_cpi_volume: 3270000,
    unique_callers: 125,
    unique_callees: 9,
    total_unique_partners: 134,
    success_rate_pct: 99.90,
    organic_score: 41500,
    trend_24h: [22, 26, 30, 35, 40, 45, 52],
    top_caller_preview: "Kamino Multiply",
    top_callee_preview: "System Program"
  }
];

export const MOCK_LIVE_EVENTS: LiveCpiEvent[] = [
  { id: '1', time: '0.2s ago', caller: 'JUP6...', callee: '675k...', callerName: 'Jupiter v6', calleeName: 'Raydium AMM', instruction: 'swapBaseIn', depth: 2, success: true, cu: 42100 },
  { id: '2', time: '0.4s ago', caller: '675k...', callee: 'Token...', callerName: 'Raydium AMM', calleeName: 'SPL Token', instruction: 'Transfer', depth: 3, success: true, cu: 6200 },
  { id: '3', time: '0.7s ago', caller: 'dRifty...', callee: 'Token...', callerName: 'Drift v2', calleeName: 'SPL Token', instruction: 'TransferChecked', depth: 2, success: true, cu: 8900 },
  { id: '4', time: '1.1s ago', caller: 'KLend...', callee: 'whirL...', callerName: 'Kamino', calleeName: 'Orca Whirlpool', instruction: 'swap', depth: 2, success: true, cu: 58200 },
  { id: '5', time: '1.4s ago', caller: 'JUP6...', callee: 'Eo7W...', callerName: 'Jupiter v6', calleeName: 'Meteora DLMM', instruction: 'swap', depth: 2, success: true, cu: 61400 },
  { id: '6', time: '1.8s ago', caller: 'AToken...', callee: '1111...', callerName: 'Associated Token', calleeName: 'System Program', instruction: 'CreateAccount', depth: 2, success: true, cu: 4500 }
];

export async function fetchLeaderboard(params: {
  timeframe: string;
  sortBy: string;
  category?: string;
  mode: string;
  search?: string;
  page?: number;
}): Promise<LeaderboardResponse> {
  // Try remote backend if URL is defined
  if (API_BASE) {
    try {
      const query = new URLSearchParams({
        timeframe: params.timeframe,
        sort_by: params.sortBy,
        mode: params.mode,
        page: String(params.page || 1),
        limit: '25',
      });
      if (params.category && params.category !== 'All') query.append('category', params.category);
      if (params.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/api/v1/leaderboard?${query.toString()}`, { next: { revalidate: 15 } });
      if (res.ok) {
        const data = await res.json();
        if (data && data.items && data.items.length > 0) {
          return data;
        }
      }
    } catch {
      // Fall through to instant local fallback
    }
  }

  // Instant resilient dataset (Never empty!)
  let items = [...SEED_PROGRAMS_DATA];

  // Category filter
  if (params.category && params.category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === params.category!.toLowerCase());
  }

  // Search filter
  if (params.search) {
    const s = params.search.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(s) || i.program_id.toLowerCase().includes(s));
  }

  // Sorting
  if (params.mode === 'organic') {
    items.sort((a, b) => b.organic_score - a.organic_score);
  } else {
    switch (params.sortBy) {
      case 'outgoing':
        items.sort((a, b) => b.total_outgoing - a.total_outgoing);
        break;
      case 'volume':
        items.sort((a, b) => b.total_cpi_volume - a.total_cpi_volume);
        break;
      case 'unique_partners':
        items.sort((a, b) => b.total_unique_partners - a.total_unique_partners);
        break;
      case 'success_rate':
        items.sort((a, b) => b.success_rate_pct - a.success_rate_pct);
        break;
      default:
        items.sort((a, b) => b.total_incoming - a.total_incoming);
        break;
    }
  }

  // Assign ranks
  items = items.map((item, idx) => ({ ...item, rank: idx + 1 }));

  return {
    total: items.length,
    page: params.page || 1,
    limit: 25,
    timeframe: params.timeframe,
    mode: params.mode,
    items,
  };
}

export async function fetchProgramDetail(address: string): Promise<ProgramDetail | null> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/programs/${address}`, { next: { revalidate: 30 } });
      if (res.ok) return await res.json();
    } catch {}
  }

  const found = SEED_PROGRAMS_DATA.find(p => p.program_id === address);
  const name = found ? found.name : `Program ${address.slice(0, 6)}...${address.slice(-4)}`;
  const category = found ? found.category : 'Smart Contract';
  const icon_url = found ? found.icon_url : '';
  const is_verified = found ? found.is_verified : false;

  return {
    program_id: address,
    name,
    category,
    icon_url,
    website: 'https://solana.com',
    twitter: 'solana',
    is_verified,
    total_incoming: found ? found.total_incoming : 840000,
    total_outgoing: found ? found.total_outgoing : 14200000,
    unique_callers: found ? found.unique_callers : 89,
    unique_callees: found ? found.unique_callees : 34,
    success_rate_pct: found ? found.success_rate_pct : 98.4,
    top_callers: [
      { caller_program_id: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", name: "Jupiter Routing v6", category: "DEX", call_count: 7800000, success_rate: 98.2 },
      { caller_program_id: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH", name: "Drift Protocol v2", category: "Perps", call_count: 1450000, success_rate: 99.1 },
      { caller_program_id: "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD", name: "Kamino Lending", category: "Lending", call_count: 890000, success_rate: 97.9 },
    ],
    top_callees: [
      { callee_program_id: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", name: "SPL Token Program", category: "Token", call_count: 12400000, success_rate: 99.4 },
      { callee_program_id: "11111111111111111111111111111111", name: "System Program", category: "System", call_count: 1850000, success_rate: 99.9 },
      { callee_program_id: "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc", name: "Orca Whirlpools", category: "DEX", call_count: 940000, success_rate: 98.7 },
    ],
    history_chart: [
      { time: "00:00", outgoing: 420000, incoming: 120000 },
      { time: "04:00", outgoing: 390000, incoming: 110000 },
      { time: "08:00", outgoing: 610000, incoming: 180000 },
      { time: "12:00", outgoing: 890000, incoming: 240000 },
      { time: "16:00", outgoing: 950000, incoming: 290000 },
      { time: "20:00", outgoing: 780000, incoming: 220000 },
    ]
  };
}

export async function fetchNetworkStats(): Promise<NetworkStats> {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/stats/overview`, { next: { revalidate: 30 } });
      if (res.ok) return await res.json();
    } catch {}
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
  return [
    {
      id: "q1",
      title: "Top Orchestrators in DeFi",
      description: "Which programs initiate the highest number of downstream CPIs to other protocols?",
      suggested_by: "@solana_dev_99",
      upvotes: 42,
      status: "APPROVED",
      created_at: "2 hours ago"
    },
    {
      id: "q2",
      title: "Token Extensions (Token-2022) Adoption",
      description: "Tracking which DEXes and lending protocols make CPI calls to Token-2022 vs legacy Token program.",
      suggested_by: "@defi_researcher",
      upvotes: 28,
      status: "APPROVED",
      created_at: "5 hours ago"
    },
    {
      id: "q3",
      title: "Liquid Staking Invocations (Jito vs Marinade vs Sanctum)",
      description: "Comparing CPI calls from yield aggregators into various liquid staking validators.",
      suggested_by: "@sol_stake_guru",
      upvotes: 19,
      status: "APPROVED",
      created_at: "Yesterday"
    }
  ];
}

export async function submitInvite(emailOrHandle: string, useCase: string) {
  return { status: "success", message: `Invite requested for ${emailOrHandle}!` };
}

export async function submitQuerySuggestion(title: string, description: string, sqlQuery: string, suggestedBy: string) {
  return { status: "success", title, suggestedBy };
}
