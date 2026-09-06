import time
import json
from typing import Any, Optional
import redis.asyncio as aioredis
from app.config import settings

class CacheManager:
    def __init__(self):
        self.redis_client: Optional[aioredis.Redis] = None
        self._memory_cache: dict[str, tuple[float, str]] = {}

    async def init_redis(self):
        try:
            self.redis_client = aioredis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_timeout=2
            )
            await self.redis_client.ping()
            print("[Cache] Connected to Redis.")
        except Exception as e:
            print(f"[Cache] Redis unavailable ({e}). Using in-memory cache.")
            self.redis_client = None

    async def get(self, key: str) -> Optional[Any]:
        if self.redis_client:
            try:
                data = await self.redis_client.get(key)
                return json.loads(data) if data else None
            except Exception:
                pass

        # In-memory fallback
        if key in self._memory_cache:
            exp, val = self._memory_cache[key]
            if time.time() < exp:
                return json.loads(val)
            del self._memory_cache[key]
        return None

    async def set(self, key: str, value: Any, ttl_seconds: int = 60):
        val_str = json.dumps(value)
        if self.redis_client:
            try:
                await self.redis_client.set(key, val_str, ex=ttl_seconds)
                return
            except Exception:
                pass

        # In-memory fallback
        self._memory_cache[key] = (time.time() + ttl_seconds, val_str)

cache = CacheManager()
