from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import db
from app.cache import cache
from app.routers import leaderboard, programs, community, stats, decoders

# Rate limiter based on client IP
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.RATE_LIMIT_PUBLIC])

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    await db.connect()
    await cache.init_redis()
    yield
    # Shutdown
    print(f"Shutting down {settings.PROJECT_NAME}...")
    await db.disconnect()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="High-performance analytics API for Solana Cross-Program Invocation (CPI) activity.",
    lifespan=lifespan
)

# Set rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers under /api/v1
app.include_router(leaderboard.router, prefix=settings.API_V1_PREFIX)
app.include_router(programs.router, prefix=settings.API_V1_PREFIX)
app.include_router(community.router, prefix=settings.API_V1_PREFIX)
app.include_router(stats.router, prefix=settings.API_V1_PREFIX)
app.include_router(decoders.router, prefix=settings.API_V1_PREFIX)

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "description": "Open-source Solana Cross-Program Invocation (CPI) Leaderboard & Call Graph API",
        "status": "operational"
    }

@app.get("/health")
async def health():
    return {"status": "ok", "db": db.pool is not None}
