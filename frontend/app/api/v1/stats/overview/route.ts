import { NextResponse } from 'next/server';
import { fetchNetworkStats } from '@/lib/api';

export async function GET() {
  const stats = await fetchNetworkStats();
  return NextResponse.json(stats);
}
