from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from app.database import db

router = APIRouter(prefix="/community", tags=["Community"])

class CommunityQuerySubmission(BaseModel):
    title: str = Field(..., min_length=5, max_length=120)
    description: str = Field(..., min_length=10, max_length=1000)
    sql_query: Optional[str] = None
    suggested_by: str = Field(..., min_length=2, max_length=64)

class InviteRequestSubmission(BaseModel):
    email_or_handle: str = Field(..., min_length=3, max_length=120)
    use_case: Optional[str] = None

# In-memory store fallback
LOCAL_QUERIES = [
    {
        "id": "q1",
        "title": "Top Orchestrators in DeFi",
        "description": "Which programs initiate the highest number of downstream CPIs to other protocols?",
        "suggested_by": "@solana_dev_99",
        "upvotes": 42,
        "status": "APPROVED",
        "created_at": "2026-09-01T12:00:00Z"
    },
    {
        "id": "q2",
        "title": "Token Extensions (Token-2022) Adoption",
        "description": "Tracking which DEXes and lending protocols make CPI calls to Token-2022 vs legacy Token program.",
        "suggested_by": "@defi_researcher",
        "upvotes": 28,
        "status": "APPROVED",
        "created_at": "2026-09-03T15:30:00Z"
    },
    {
        "id": "q3",
        "title": "Liquid Staking Invocations (Jito vs Marinade vs Sanctum)",
        "description": "Comparing CPI calls from yield aggregators into various liquid staking validators.",
        "suggested_by": "@sol_stake_guru",
        "upvotes": 19,
        "status": "APPROVED",
        "created_at": "2026-09-05T09:15:00Z"
    }
]

@router.get("/queries")
async def list_community_queries():
    try:
        rows = await db.fetch("""
            SELECT id, title, description, sql_query, suggested_by, upvotes, status, created_at
            FROM community_queries
            ORDER BY upvotes DESC, created_at DESC
        """)
        if rows:
            return [dict(r) for r in rows]
    except Exception as e:
        print(f"[Community] DB query error: {e}")
    return LOCAL_QUERIES

@router.post("/queries")
async def submit_community_query(payload: CommunityQuerySubmission):
    try:
        query = """
            INSERT INTO community_queries (title, description, sql_query, suggested_by, status)
            VALUES ($1, $2, $3, $4, 'APPROVED')
            RETURNING id, title, description, suggested_by, status, created_at
        """
        row = await db.fetchrow(query, payload.title, payload.description, payload.sql_query, payload.suggested_by)
        if row:
            return dict(row)
    except Exception as e:
        print(f"[Community] DB insert error: {e}")

    # Fallback to local memory append
    new_query = {
        "id": f"q{len(LOCAL_QUERIES) + 1}",
        "title": payload.title,
        "description": payload.description,
        "suggested_by": payload.suggested_by,
        "upvotes": 1,
        "status": "APPROVED",
        "created_at": "Just now"
    }
    LOCAL_QUERIES.append(new_query)
    return new_query

@router.post("/invite")
async def request_invite(payload: InviteRequestSubmission):
    try:
        await db.execute("""
            INSERT INTO invite_requests (email_or_handle, use_case)
            VALUES ($1, $2)
        """, payload.email_or_handle, payload.use_case or "")
    except Exception as e:
        print(f"[Invite] DB insert error: {e}")

    return {
        "status": "success",
        "message": f"Invite requested for {payload.email_or_handle}. You will be notified when the next batch is released!"
    }
