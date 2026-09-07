# CPIana ⚡

> **The Open-Source Solana Cross-Program Invocation (CPI) Composability Engine & Leaderboard.**
> *SQLana for CPIs — mapping the synchronous execution graph of Solana.*

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Solana](https://img.shields.io/badge/Solana-Mainnet-14F195?logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)

---

## 🎯 Overview

Solana’s superpower is **synchronous composability**—programs interacting with other programs atomically in the same slot via **Cross-Program Invocations (CPI)**.

Yet almost every existing explorer and analytics tool ranks programs by raw transaction count or fee spend—metrics that are trivially gamed by spam bots with wash-loops.

**CPIana** builds and visualizes the true composability dependency graph of Solana:
- 📊 **Incoming CPIs (Callee)**: Measures which programs are the core infrastructure pillars depended on by the entire ecosystem.
- ⚡ **Outgoing CPIs (Caller)**: Measures active orchestrators (aggregators, routers, liquidators) driving multi-hop execution.
- 🕸️ **Directed Call Graphs**: Interactive bipartite visualizer showing who invokes a given contract and who it calls downstream.
- 🛡️ **Anti-Sybil Organic Filter**: Log-weighted unique fee-payer filtering to neutralize wash-invocations and bot spam.
- ⏱️ **Real-Time + Historical Windows**: Filter by 24h, 7d, 30d, and all-time.

---

## 🏛️ Architecture

```
                                  ┌────────────────────────┐
                                  │   Solana RPC Providers │
                                  │ (Helius / QuickNode)   │
                                  └───────────┬────────────┘
                                              │
                     WebSocket / Webhooks /   │  RPC Poll (getBlock / getTransaction)
                     Enhanced Streams         │
                                              ▼
                              ┌──────────────────────────────┐
                              │     CPI Ingestion Worker     │
                              │       (TypeScript/Node)      │
                              │                              │
                              │  - Call Stack Reconstruction │
                              │  - Program IDL Decoders      │
                              │  - Anti-Spam / Sybil Filter  │
                              └──────────────┬───────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │  PostgreSQL / ClickHouse DB  │
                              │                              │
                              │  - raw_cpi_events            │
                              │  - program_metadata          │
                              │  - cpi_hourly_rollups        │
                              │  - community_queries         │
                              └──────────────┬───────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │     FastAPI Backend API      │
                              │      (Python / asyncpg)      │
                              │                              │
                              │  - In-memory / Redis Cache   │
                              │  - Rate-limiting (SlowAPI)   │
                              │  - Leaderboard REST APIs     │
                              │  - Community Query Registry  │
                              └──────────────┬───────────────┘
                                             │ JSON REST API
                                             ▼
                              ┌──────────────────────────────┐
                              │  Next.js 14 Web Dashboard    │
                              │ (Tailwind CSS, Recharts, UI) │
                              │                              │
                              │  - Realtime Leaderboard      │
                              │  - Program Detail & CPI Flow │
                              │  - Sankey / Directed Graphs  │
                              │  - Community Query Modal     │
                              └──────────────────────────────┘
```

---

## 🚀 Quickstart (Self-Hosting with Docker Compose)

The entire stack runs with a single command:

```bash
# 1. Clone the repository
git clone https://github.com/Synxneuos/solanacpiboard.git
cd solanacpiboard

# 2. Start all services (PostgreSQL, Redis, Indexer, FastAPI backend, Next.js dashboard)
docker compose up -d
```

Once started:
- **Frontend Dashboard**: `http://localhost:3000`
- **FastAPI Documentation**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432` (`cpi_admin` / `cpi_secure_password_123`)
- **Redis Cache**: `localhost:6379`

---

## 🛠️ Manual Development Setup

### 1. Database
```bash
# Start PostgreSQL (or use Supabase / Neon)
# Run schema and seed scripts:
psql -h localhost -U cpi_admin -d solanacpiboard -f database/schema.sql
psql -h localhost -U cpi_admin -d solanacpiboard -f database/seed.sql
```

### 2. Backend (FastAPI)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. CPI Indexer (Node.js)
```bash
cd indexer
npm install
# Run unit test on nested call stack reconstructor:
npm test
# Run indexer in mock or live RPC mode:
INDEXER_MODE=mock npm run dev
```

### 4. Frontend (Next.js 14)
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🧩 How to Add New Program Decoders

SolanaCPIBoard has a modular decoder registry. You can add instruction parsing for any Solana program in three simple steps:

### Step 1: Create a Decoder in `indexer/src/decoders/<name>.ts`
Implement the `ProgramDecoder` interface:

```typescript
import { ProgramDecoder, DecodedInstruction } from './types';

export class OrcaWhirlpoolDecoder implements ProgramDecoder {
  public programId = 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc';
  public name = 'Orca Whirlpools';

  decode(data?: string, accounts?: string[]): DecodedInstruction | null {
    if (!data) return { name: 'swap' };

    // Anchor 8-byte discriminator map or custom byte parser
    const buffer = Buffer.from(data, 'base64');
    const discHex = buffer.subarray(0, 8).toString('hex');

    const methodMap: Record<string, string> = {
      'f8c69e91e17587c8': 'swap',
      '2a4c107f9c2d1b01': 'openPosition',
      '38f7d9c6e5a4b3c2': 'increaseLiquidity',
      '4d8e7a6b5c4d3e2f': 'decreaseLiquidity',
    };

    return {
      name: methodMap[discHex] || 'whirlpool_instruction',
    };
  }
}
```

### Step 2: Register it in `indexer/src/decoders/registry.ts`
```typescript
import { OrcaWhirlpoolDecoder } from './orca';

// Inside registerDefaults():
this.register(new OrcaWhirlpoolDecoder());
```

### Step 3: Open a PR!
Open a Pull Request on GitHub. Once merged, the decoder will parse that program's instructions across all live and backfilled CPI calls.

---

## 🗄️ Database Schema & SQL Queries

### PostgreSQL Schema
The database uses partitioned tables for high-throughput append of raw CPI calls, and pre-aggregated rollups for sub-50ms query speeds:

```sql
-- Programs Directory
CREATE TABLE programs (
    program_id VARCHAR(44) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) DEFAULT 'Uncategorized',
    icon_url TEXT,
    website TEXT,
    twitter TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-aggregated Hourly Rollup Table
CREATE TABLE cpi_hourly_rollups (
    hour_timestamp TIMESTAMPTZ NOT NULL,
    caller_program_id VARCHAR(44) NOT NULL,
    callee_program_id VARCHAR(44) NOT NULL,
    total_calls BIGINT NOT NULL DEFAULT 0,
    success_calls BIGINT NOT NULL DEFAULT 0,
    failed_calls BIGINT NOT NULL DEFAULT 0,
    unique_fee_payers BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_timestamp, caller_program_id, callee_program_id)
);
```

### Master 24-Hour Leaderboard Query
```sql
WITH time_window AS (
    SELECT NOW() - INTERVAL '24 HOURS' AS window_start
),
outgoing_stats AS (
    SELECT 
        caller_program_id AS program_id,
        SUM(total_calls) AS total_outgoing,
        SUM(success_calls) AS outgoing_success,
        COUNT(DISTINCT callee_program_id) AS unique_callees,
        SUM(unique_fee_payers) AS total_unique_payers
    FROM cpi_hourly_rollups, time_window
    WHERE hour_timestamp >= window_start
    GROUP BY caller_program_id
),
incoming_stats AS (
    SELECT 
        callee_program_id AS program_id,
        SUM(total_calls) AS total_incoming,
        SUM(success_calls) AS incoming_success,
        COUNT(DISTINCT caller_program_id) AS unique_callers
    FROM cpi_hourly_rollups, time_window
    WHERE hour_timestamp >= window_start
    GROUP BY callee_program_id
),
combined AS (
    SELECT 
        COALESCE(o.program_id, i.program_id) AS program_id,
        COALESCE(o.total_outgoing, 0) AS total_outgoing,
        COALESCE(i.total_incoming, 0) AS total_incoming,
        (COALESCE(o.total_outgoing, 0) + COALESCE(i.total_incoming, 0)) AS total_cpi_volume,
        COALESCE(o.unique_callees, 0) AS unique_callees,
        COALESCE(i.unique_callers, 0) AS unique_callers,
        (COALESCE(o.unique_callees, 0) + COALESCE(i.unique_callers, 0)) AS total_unique_partners,
        CASE 
            WHEN (COALESCE(o.total_outgoing, 0) + COALESCE(i.total_incoming, 0)) = 0 THEN 100.0
            ELSE ROUND(
                ((COALESCE(o.outgoing_success, 0) + COALESCE(i.incoming_success, 0))::DECIMAL / 
                (COALESCE(o.total_outgoing, 0) + COALESCE(i.total_incoming, 0))::DECIMAL) * 100.0, 2
            )
        END AS success_rate_pct
    FROM outgoing_stats o
    FULL OUTER JOIN incoming_stats i ON o.program_id = i.program_id
)
SELECT 
    c.program_id,
    COALESCE(p.name, SUBSTRING(c.program_id, 1, 6) || '...' || SUBSTRING(c.program_id, 39, 6)) AS name,
    COALESCE(p.category, 'Uncategorized') AS category,
    COALESCE(p.icon_url, '') AS icon_url,
    COALESCE(p.is_verified, FALSE) AS is_verified,
    c.total_incoming,
    c.total_outgoing,
    c.total_cpi_volume,
    c.unique_callers,
    c.unique_callees,
    c.total_unique_partners,
    c.success_rate_pct
FROM combined c
LEFT JOIN programs p ON c.program_id = p.program_id
ORDER BY c.total_incoming DESC
LIMIT 50;
```

---

## 🛡️ Anti-Sybil & Anti-Spam Ranking Heuristics

Pure raw call counts can be manipulated if a malicious actor deploys contracts $A$ and $B$ and has $A$ invoke $B$ 1,000 times in loops with low priority fees.

SolanaCPIBoard applies a multi-layered defense to ensure ranking integrity:

1. **Unique Fee-Payer Weighting (Organic Score)**:
   - Rank is weighted by the number of distinct fee payers initiating transactions:
   $$\text{OrganicScore} = \log(1 + \text{UniquePayers}) \times \sqrt{\text{TotalCPI}}$$
2. **Economic Floor & Priority Fee Filtering**:
   - Invocations paying zero priority fees or consuming micro-compute units with no state mutation are flagged as wash-loops.
3. **Graph Centrality (Solana PageRank)**:
   - Calls to/from verified anchor programs (System, SPL Token, Token-2022, Whirlpool, Raydium) carry a trust weight of $1.0$.
   - Self-referential closed-loop subgraphs between unverified programs receive a decaying weight of $0.05$.
4. **Organic vs Raw Toggle**:
   - Users can switch between **Organic Mode** (default, spam-resistant) and **Raw Mode** (unfiltered volume).

---

## 📅 Step-by-Step Implementation Order (MVP in 7 Days)

- **Day 1: Data Models & Environment Setup**
  - Set up PostgreSQL schema, rollup functions, and seed directory of known Solana programs. Configure Docker Compose.
- **Day 2: CPI Call Stack Parser & Decoders**
  - Build `cpiParser.ts` to reconstruct caller $\rightarrow$ callee edges from `innerInstructions` using `stackHeight`. Implement Token, System, Jupiter, and Raydium decoders.
- **Day 3: Ingestion Worker & Rollups Pipeline**
  - Build ingestion poller with batch commit and hourly rollup aggregations. Add synthetic replay mode for development.
- **Day 4: Backend API & Caching**
  - Develop FastAPI backend endpoints for `/leaderboard`, `/programs/{address}`, `/stats/overview`, and `/community/queries`. Add SlowAPI rate-limiting.
- **Day 5: Next.js Dashboard & Leaderboard Table**
  - Scaffold Next.js 14 with Tailwind dark cyber theme. Build searchable, filterable leaderboard table with verification badges.
- **Day 6: Program Deep Dive & CPI Flow Visualizer**
  - Implement `/program/[address]` with top caller/callee breakdown, Recharts volume timeline, and the directed flow bipartite graph. Add "Share Query / Request Invite" modal.
- **Day 7: Anti-Sybil Filter & Open-Source Launch**
  - Implement organic log-weighting formula. Write self-hosting manual. Deploy to public hosting (Vercel + Railway).

---

## 📣 Launch Tweet Thread (Toly / Solana Foundation Notice)

```markdown
1/ Solana's superpower has always been synchronous composability—contracts talking to contracts in a single slot.

Yet every explorer still ranks programs by raw TX count or bot-friendly fee volume.

Introducing SolanaCPIBoard: The open-source Cross-Program Invocation analytics engine. 🧵👇

2/ Why CPIs matter:
When Jupiter aggregates an order, it routes CPIs to Raydium, Orca, and Phoenix.
When a lending protocol liquidates, it invokes the Token Program.

CPIs reveal the TRUE dependency graph of Solana—who is building on whom, and which protocols are the true foundational pillars.

3/ What SolanaCPIBoard measures:
📊 Top Incoming CPIs (Most depended-on programs)
⚡ Top Outgoing CPIs (Most active orchestrators)
🕸️ Directed Caller/Callee dependency graphs
📈 Real-time success vs failed invocation rates
🛡️ Organic vs Raw activity filter (Sybil-resistant)

4/ Built for developers:
- Full support for inner instruction stack depth parsing
- Modular IDL decoders (Jupiter, Raydium, SPL Token, custom IDLs)
- 100% open-source & self-hostable (FastAPI + Next.js + PostgreSQL/ClickHouse)

5/ Want to add your program or suggest a custom leaderboard?
Submit custom queries directly on the board or open a PR with your program's decoder!

Live demo: solanacpiboard.xyz
GitHub: github.com/Synxneuos/solanacpiboard

Tagging @aeyakovenko @0xMert_ @SolanaFndn — let's celebrate Solana's composability! 🚀
```

---

## 🤝 Contributing & License

Contributions are welcome! Please submit a PR for:
- New program decoders (`indexer/src/decoders/`)
- Enhanced anti-spam heuristics
- New community leaderboard views

Licensed under the [MIT License](LICENSE).
