from fastapi import APIRouter, Query
from typing import Optional
import math
from app.database import db
from app.cache import cache

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

# Fallback mock dataset for local instant demo when DB is empty
MOCK_LEADERBOARD = [
    {
        "rank": 1,
        "program_id": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        "name": "SPL Token Program",
        "category": "Token",
        "icon_url": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        "is_verified": True,
        "total_incoming": 24892011,
        "total_outgoing": 120500,
        "total_cpi_volume": 25012511,
        "unique_callers": 1420,
        "unique_callees": 12,
        "total_unique_partners": 1432,
        "success_rate_pct": 98.45,
        "organic_score": 98520,
        "trend_24h": [120, 140, 180, 210, 190, 250, 310]
    },
    {
        "rank": 2,
        "program_id": "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
        "name": "Jupiter Routing v6",
        "category": "DEX",
        "icon_url": "https://jup.ag/svg/jupiter-logo.svg",
        "is_verified": True,
        "total_incoming": 842100,
        "total_outgoing": 19420000,
        "total_cpi_volume": 20262100,
        "unique_callers": 89,
        "unique_callees": 45,
        "total_unique_partners": 134,
        "success_rate_pct": 97.80,
        "organic_score": 89400,
        "trend_24h": [90, 95, 110, 130, 150, 170, 200]
    },
    {
        "rank": 3,
        "program_id": "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8",
        "name": "Raydium Liquidity Pool V4",
        "category": "DEX",
        "icon_url": "https://raydium.io/logo.svg",
        "is_verified": True,
        "total_incoming": 11420500,
        "total_outgoing": 11420500,
        "total_cpi_volume": 22841000,
        "unique_callers": 420,
        "unique_callees": 8,
        "total_unique_partners": 428,
        "success_rate_pct": 96.12,
        "organic_score": 78200,
        "trend_24h": [80, 85, 90, 95, 100, 110, 115]
    },
    {
        "rank": 4,
        "program_id": "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc",
        "name": "Orca Whirlpools",
        "category": "DEX",
        "icon_url": "https://www.orca.so/static/media/orca.38a3d1d1.svg",
        "is_verified": True,
        "total_incoming": 6890200,
        "total_outgoing": 6890200,
        "total_cpi_volume": 13780400,
        "unique_callers": 310,
        "unique_callees": 6,
        "total_unique_partners": 316,
        "success_rate_pct": 99.10,
        "organic_score": 64500,
        "trend_24h": [60, 65, 70, 75, 70, 80, 85]
    },
    {
        "rank": 5,
        "program_id": "11111111111111111111111111111111",
        "name": "System Program",
        "category": "System",
        "icon_url": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
        "is_verified": True,
        "total_incoming": 9450000,
        "total_outgoing": 0,
        "total_cpi_volume": 9450000,
        "unique_callers": 890,
        "unique_callees": 0,
        "total_unique_partners": 890,
        "success_rate_pct": 99.94,
        "organic_score": 92100,
        "trend_24h": [70, 72, 74, 76, 78, 80, 82]
    },
    {
        "rank": 6,
        "program_id": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
        "name": "Token Extensions (2022)",
        "category": "Token",
        "icon_url": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
        "is_verified": True,
        "total_incoming": 4120300,
        "total_outgoing": 45000,
        "total_cpi_volume": 4165300,
        "unique_callers": 210,
        "unique_callees": 4,
        "total_unique_partners": 214,
        "success_rate_pct": 98.70,
        "organic_score": 45000,
        "trend_24h": [30, 35, 42, 50, 58, 62, 70]
    },
    {
        "rank": 7,
        "program_id": "KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD",
        "name": "Kamino Lending",
        "category": "Lending",
        "icon_url": "https://app.kamino.finance/favicon.ico",
        "is_verified": True,
        "total_incoming": 1950000,
        "total_outgoing": 3200000,
        "total_cpi_volume": 5150000,
        "unique_callers": 140,
        "unique_callees": 18,
        "total_unique_partners": 158,
        "success_rate_pct": 97.40,
        "organic_score": 38200,
        "trend_24h": [25, 28, 30, 34, 38, 40, 45]
    },
    {
        "rank": 8,
        "program_id": "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
        "name": "Drift Protocol v2",
        "category": "Perps",
        "icon_url": "https://app.drift.trade/assets/drift.svg",
        "is_verified": True,
        "total_incoming": 1450000,
        "total_outgoing": 2850000,
        "total_cpi_volume": 4300000,
        "unique_callers": 95,
        "unique_callees": 12,
        "total_unique_partners": 107,
        "success_rate_pct": 98.15,
        "organic_score": 31000,
        "trend_24h": [20, 22, 25, 27, 30, 32, 35]
    },
]

@router.get("")
async def get_leaderboard(
    timeframe: str = Query("24h", regex="^(24h|7d|30d)$"),
    sort_by: str = Query("incoming", regex="^(incoming|outgoing|volume|unique_partners|success_rate|organic_score)$"),
    category: Optional[str] = Query(None),
    mode: str = Query("organic", regex="^(organic|raw)$"),
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=100)
):
    cache_key = f"lb_{timeframe}_{sort_by}_{category}_{mode}_{search}_{page}_{limit}"
    cached = await cache.get(cache_key)
    if cached:
        return cached

    interval_map = {
        "24h": "INTERVAL '24 HOURS'",
        "7d": "INTERVAL '7 DAYS'",
        "30d": "INTERVAL '30 DAYS'"
    }
    interval_sql = interval_map[timeframe]

    # Query from DB rollups if available
    db_query = f"""
    WITH time_window AS (
        SELECT NOW() - {interval_sql} AS window_start
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
            COALESCE(o.total_unique_payers, 0) AS total_unique_payers,
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
        c.success_rate_pct,
        -- Anti-Sybil Log-Weighted Organic Score
        ROUND(LOG(GREATEST(c.total_unique_payers, 1) + 1) * SQRT(GREATEST(c.total_cpi_volume, 1))) AS organic_score
    FROM combined c
    LEFT JOIN programs p ON c.program_id = p.program_id
    WHERE ($1::text IS NULL OR p.category ILIKE $1)
      AND ($2::text IS NULL OR p.name ILIKE $2 OR c.program_id ILIKE $2)
    """

    try:
        category_param = f"%{category}%" if category and category.lower() != "all" else None
        search_param = f"%{search}%" if search else None
        rows = await db.fetch(db_query, category_param, search_param)

        if rows and len(rows) > 0:
            data = [dict(r) for r in rows]
            # Sort data
            if mode == "organic":
                data.sort(key=lambda x: x.get("organic_score", 0), reverse=True)
            else:
                sort_keys = {
                    "incoming": "total_incoming",
                    "outgoing": "total_outgoing",
                    "volume": "total_cpi_volume",
                    "unique_partners": "total_unique_partners",
                    "success_rate": "success_rate_pct",
                    "organic_score": "organic_score"
                }
                k = sort_keys.get(sort_by, "total_incoming")
                data.sort(key=lambda x: x.get(k, 0), reverse=True)

            # Assign ranks
            for idx, item in enumerate(data):
                item["rank"] = idx + 1

            # Paginate
            start = (page - 1) * limit
            paginated = data[start:start + limit]
            response = {
                "total": len(data),
                "page": page,
                "limit": limit,
                "timeframe": timeframe,
                "mode": mode,
                "items": paginated
            }
            await cache.set(cache_key, response, ttl_seconds=30)
            return response
    except Exception as e:
        print(f"[Leaderboard] DB query error: {e}. Falling back to default data.")

    # Fallback to rich mock data
    items = list(MOCK_LEADERBOARD)
    if category and category.lower() != "all":
        items = [i for i in items if i["category"].lower() == category.lower()]
    if search:
        s = search.lower()
        items = [i for i in items if s in i["name"].lower() or s in i["program_id"].lower()]

    if mode == "organic":
        items.sort(key=lambda x: x["organic_score"], reverse=True)
    elif sort_by == "outgoing":
        items.sort(key=lambda x: x["total_outgoing"], reverse=True)
    elif sort_by == "volume":
        items.sort(key=lambda x: x["total_cpi_volume"], reverse=True)
    elif sort_by == "unique_partners":
        items.sort(key=lambda x: x["total_unique_partners"], reverse=True)
    elif sort_by == "success_rate":
        items.sort(key=lambda x: x["success_rate_pct"], reverse=True)
    else:
        items.sort(key=lambda x: x["total_incoming"], reverse=True)

    for idx, item in enumerate(items):
        item["rank"] = idx + 1

    start = (page - 1) * limit
    paginated = items[start:start + limit]

    response = {
        "total": len(items),
        "page": page,
        "limit": limit,
        "timeframe": timeframe,
        "mode": mode,
        "items": paginated
    }
    await cache.set(cache_key, response, ttl_seconds=30)
    return response
