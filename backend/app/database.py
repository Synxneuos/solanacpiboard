import asyncpg
from typing import Optional
from app.config import settings

class Database:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        try:
            self.pool = await asyncpg.create_pool(
                dsn=settings.DATABASE_URL,
                min_size=2,
                max_size=20,
                timeout=10,
                command_timeout=30
            )
            print("[DB] AsyncPG connection pool established.")
        except Exception as e:
            print(f"[DB] Could not connect to PostgreSQL: {e}. Running in memory fallback mode.")
            self.pool = None

    async def disconnect(self):
        if self.pool:
            await self.pool.close()
            print("[DB] AsyncPG pool closed.")

    async def fetch(self, query: str, *args):
        if not self.pool:
            return []
        async with self.pool.acquire() as conn:
            return await conn.fetch(query, *args)

    async def fetchrow(self, query: str, *args):
        if not self.pool:
            return None
        async with self.pool.acquire() as conn:
            return await conn.fetchrow(query, *args)

    async def execute(self, query: str, *args):
        if not self.pool:
            return "NO_DB_POOL"
        async with self.pool.acquire() as conn:
            return await conn.execute(query, *args)

db = Database()
