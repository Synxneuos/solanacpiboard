-- ==============================================================================
-- SolanaCPIBoard: Production PostgreSQL Schema with Partitioning & Rollups
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Verified & Registered Programs Table
CREATE TABLE IF NOT EXISTS programs (
    program_id VARCHAR(44) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) DEFAULT 'Uncategorized', -- System, Token, DEX, Lending, Yield, Infra, Game, NFT
    icon_url TEXT,
    website TEXT,
    twitter TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    first_seen_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_category ON programs(category);
CREATE INDEX IF NOT EXISTS idx_programs_verified ON programs(is_verified);

-- 2. Raw CPI Events (Partitioned by block_time range for high-throughput append)
CREATE TABLE IF NOT EXISTS cpi_events (
    id BIGSERIAL,
    signature VARCHAR(88) NOT NULL,
    slot BIGINT NOT NULL,
    block_time TIMESTAMPTZ NOT NULL,
    caller_program_id VARCHAR(44) NOT NULL,
    callee_program_id VARCHAR(44) NOT NULL,
    depth SMALLINT NOT NULL DEFAULT 2,
    instruction_name VARCHAR(64) DEFAULT 'unknown',
    success BOOLEAN NOT NULL DEFAULT TRUE,
    fee_payer VARCHAR(44),
    compute_units_consumed INT DEFAULT 0,
    PRIMARY KEY (id, block_time)
) PARTITION BY RANGE (block_time);

-- Initial default partition to catch events
CREATE TABLE IF NOT EXISTS cpi_events_default PARTITION OF cpi_events DEFAULT;

CREATE INDEX IF NOT EXISTS idx_cpi_events_caller ON cpi_events (caller_program_id, block_time DESC);
CREATE INDEX IF NOT EXISTS idx_cpi_events_callee ON cpi_events (callee_program_id, block_time DESC);
CREATE INDEX IF NOT EXISTS idx_cpi_events_pair ON cpi_events (caller_program_id, callee_program_id);
CREATE INDEX IF NOT EXISTS idx_cpi_events_sig ON cpi_events (signature);

-- 3. Hourly Pre-aggregated Rollups (Used for instant sub-50ms leaderboard queries)
CREATE TABLE IF NOT EXISTS cpi_hourly_rollups (
    hour_timestamp TIMESTAMPTZ NOT NULL,
    caller_program_id VARCHAR(44) NOT NULL,
    callee_program_id VARCHAR(44) NOT NULL,
    total_calls BIGINT NOT NULL DEFAULT 0,
    success_calls BIGINT NOT NULL DEFAULT 0,
    failed_calls BIGINT NOT NULL DEFAULT 0,
    unique_fee_payers BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_timestamp, caller_program_id, callee_program_id)
);

CREATE INDEX IF NOT EXISTS idx_rollups_caller_hour ON cpi_hourly_rollups (caller_program_id, hour_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_rollups_callee_hour ON cpi_hourly_rollups (callee_program_id, hour_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_rollups_hour ON cpi_hourly_rollups (hour_timestamp DESC);

-- 4. Community Queries & Custom Leaderboard Suggestions
CREATE TABLE IF NOT EXISTS community_queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(120) NOT NULL,
    description TEXT,
    sql_query TEXT,
    suggested_by VARCHAR(64),
    upvotes INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Invite / Beta Access Requests
CREATE TABLE IF NOT EXISTS invite_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_or_handle VARCHAR(120) NOT NULL,
    use_case TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Upsert Helper Function for Hourly Rollups
CREATE OR REPLACE FUNCTION increment_cpi_rollup(
    p_hour TIMESTAMPTZ,
    p_caller VARCHAR(44),
    p_callee VARCHAR(44),
    p_total BIGINT,
    p_success BIGINT,
    p_failed BIGINT,
    p_unique_payers BIGINT
) RETURNS VOID AS $$
BEGIN
    INSERT INTO cpi_hourly_rollups (
        hour_timestamp, caller_program_id, callee_program_id, total_calls, success_calls, failed_calls, unique_fee_payers
    )
    VALUES (
        p_hour, p_caller, p_callee, p_total, p_success, p_failed, p_unique_payers
    )
    ON CONFLICT (hour_timestamp, caller_program_id, callee_program_id)
    DO UPDATE SET
        total_calls = cpi_hourly_rollups.total_calls + EXCLUDED.total_calls,
        success_calls = cpi_hourly_rollups.success_calls + EXCLUDED.success_calls,
        failed_calls = cpi_hourly_rollups.failed_calls + EXCLUDED.failed_calls,
        unique_fee_payers = cpi_hourly_rollups.unique_fee_payers + EXCLUDED.unique_fee_payers;
END;
$$ LANGUAGE plpgsql;
