import { NextResponse } from 'next/server';
import { fetchLeaderboard } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeframe = searchParams.get('timeframe') || '24h';
  const sortBy = searchParams.get('sort_by') || 'incoming';
  const category = searchParams.get('category') || undefined;
  const mode = searchParams.get('mode') || 'organic';
  const search = searchParams.get('search') || undefined;
  const page = parseInt(searchParams.get('page') || '1', 10);

  const data = await fetchLeaderboard({
    timeframe,
    sortBy,
    category,
    mode,
    search,
    page,
  });

  return NextResponse.json(data);
}
