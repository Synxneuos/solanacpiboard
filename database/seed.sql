-- ==============================================================================
-- SolanaCPIBoard: Program Metadata & Seed Data
-- ==============================================================================

INSERT INTO programs (program_id, name, category, icon_url, website, twitter, is_verified) VALUES
-- System & Core Infrastructure
('11111111111111111111111111111111', 'System Program', 'System', 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png', 'https://solana.com', 'solana', TRUE),
('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'SPL Token Program', 'Token', 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', 'https://spl.solana.com/token', 'solana', TRUE),
('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb', 'Token Extensions (2022)', 'Token', 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png', 'https://spl.solana.com/token-2022', 'solana', TRUE),
('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL', 'Associated Token Account', 'Token', '', 'https://spl.solana.com/associated-token-account', 'solana', TRUE),
('ComputeBudget111111111111111111111111111111', 'Compute Budget', 'System', '', 'https://docs.solana.com', 'solana', TRUE),

-- DEX & Aggregators
('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', 'Jupiter Routing v6', 'DEX', 'https://jup.ag/svg/jupiter-logo.svg', 'https://jup.ag', 'JupiterExchange', TRUE),
('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', 'Raydium Liquidity Pool V4', 'DEX', 'https://raydium.io/logo.svg', 'https://raydium.io', 'RaydiumProtocol', TRUE),
('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaWNZDFZqq8V', 'Raydium Concentrated Liquidity', 'DEX', 'https://raydium.io/logo.svg', 'https://raydium.io', 'RaydiumProtocol', TRUE),
('CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C', 'Raydium CP-Swap', 'DEX', 'https://raydium.io/logo.svg', 'https://raydium.io', 'RaydiumProtocol', TRUE),
('whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', 'Orca Whirlpools', 'DEX', 'https://www.orca.so/static/media/orca.38a3d1d1.svg', 'https://www.orca.so', 'orca_so', TRUE),
('Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB', 'Meteora DLMM', 'DEX', 'https://app.meteora.ag/icons/meteora.svg', 'https://meteora.ag', 'MeteoraAG', TRUE),
('PhoeNiXZ8ByJGLkxNfZRnkUfjvmuYqLR89jjFHGqdXY', 'Phoenix DEX', 'DEX', 'https://phoenix.ellipse.fi/icon.png', 'https://phoenix.ellipse.fi', 'PhoenixTrade', TRUE),

-- Lending & Yield Protocols
('KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD', 'Kamino Lending', 'Lending', 'https://app.kamino.finance/favicon.ico', 'https://kamino.finance', 'KaminoFinance', TRUE),
('MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA', 'MarginFi v2', 'Lending', 'https://app.marginfi.com/favicon.ico', 'https://marginfi.com', 'marginfi', TRUE),
('dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH', 'Drift Protocol v2', 'Perps', 'https://app.drift.trade/assets/drift.svg', 'https://drift.trade', 'DriftProtocol', TRUE),
('MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD', 'Marinade Staking', 'Liquid Staking', 'https://marinade.finance/favicon.ico', 'https://marinade.finance', 'MarinadeFinance', TRUE),
('Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb', 'Jito Staking', 'Liquid Staking', 'https://jito.network/favicon.ico', 'https://jito.network', 'jito_sol', TRUE)
ON CONFLICT (program_id) DO NOTHING;

-- Seed Sample 24-Hour Rollup Activity (Realistic Solana CPI Composability Matrix)
DO $$
DECLARE
    now_hour TIMESTAMPTZ := date_trunc('hour', NOW());
    h INT;
BEGIN
    FOR h IN 0..24 LOOP
        -- Jupiter calling Raydium
        INSERT INTO cpi_hourly_rollups (hour_timestamp, caller_program_id, callee_program_id, total_calls, success_calls, failed_calls, unique_fee_payers)
        VALUES (now_hour - (h || ' hours')::INTERVAL, 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', 45000 + (h * 500), 44200 + (h * 480), 800 + (h * 20), 12500)
        ON CONFLICT DO NOTHING;

        -- Jupiter calling Orca Whirlpools
        INSERT INTO cpi_hourly_rollups (hour_timestamp, caller_program_id, callee_program_id, total_calls, success_calls, failed_calls, unique_fee_payers)
        VALUES (now_hour - (h || ' hours')::INTERVAL, 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', 32000 + (h * 300), 31600 + (h * 290), 400 + (h * 10), 9800)
        ON CONFLICT DO NOTHING;

        -- Jupiter calling Meteora
        INSERT INTO cpi_hourly_rollups (hour_timestamp, caller_program_id, callee_program_id, total_calls, success_calls, failed_calls, unique_fee_payers)
        VALUES (now_hour - (h || ' hours')::INTERVAL, 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', 'Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB', 28000 + (h * 200), 27500 + (h * 190), 500 + (h * 10), 8700)
        ON CONFLICT DO NOTHING;

        -- Raydium calling SPL Token Program
        INSERT INTO cpi_hourly_rollups (hour_timestamp, caller_program_id, callee_program_id, total_calls, success_calls, failed_calls, unique_fee_payers)
        VALUES (now_hour - (h || ' hours')::INTERVAL, '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 110000 + (h * 1200), 108500 + (h * 1150), 1500 + (h * 50), 34000)
        ON CONFLICT DO NOTHING;

        -- Orca calling SPL Token Program
        INSERT INTO cpi_hourly_rollups (hour_timestamp, caller_program_id, callee_program_id, total_calls, success_calls, failed_calls, unique_fee_payers)
        VALUES (now_hour - (h || ' hours')::INTERVAL, 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 78000 + (h * 800), 77200 + (h * 780), 800 + (h * 20), 22000)
        ON CONFLICT DO NOTHING;

        -- Kamino calling Raydium / Token
        INSERT INTO cpi_hourly_rollups (hour_timestamp, caller_program_id, callee_program_id, total_calls, success_calls, failed_calls, unique_fee_payers)
        VALUES (now_hour - (h || ' hours')::INTERVAL, 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD', 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 19000 + (h * 250), 18800 + (h * 240), 200 + (h * 10), 6500)
        ON CONFLICT DO NOTHING;

        -- Drift calling Token Program
        INSERT INTO cpi_hourly_rollups (hour_timestamp, caller_program_id, callee_program_id, total_calls, success_calls, failed_calls, unique_fee_payers)
        VALUES (now_hour - (h || ' hours')::INTERVAL, 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH', 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 24000 + (h * 300), 23700 + (h * 290), 300 + (h * 10), 8100)
        ON CONFLICT DO NOTHING;
    END LOOP;
END $$;

-- Seed Sample Community Queries
INSERT INTO community_queries (title, description, sql_query, suggested_by, upvotes, status) VALUES
('Top Orchestrators in DeFi', 'Which programs initiate the highest number of downstream CPIs to other protocols?', 'SELECT caller_program_id, COUNT(DISTINCT callee_program_id) as callees, SUM(total_calls) as calls FROM cpi_hourly_rollups GROUP BY caller_program_id ORDER BY calls DESC LIMIT 10;', '@solana_dev_99', 42, 'APPROVED'),
('Token Extensions Adoption', 'Tracking which DEXes and lending protocols make CPI calls to Token-2022', 'SELECT caller_program_id, SUM(total_calls) FROM cpi_hourly_rollups WHERE callee_program_id = ''TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'' GROUP BY caller_program_id;', '@defi_researcher', 28, 'APPROVED')
ON CONFLICT DO NOTHING;
