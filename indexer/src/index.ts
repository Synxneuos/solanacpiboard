import dotenv from 'dotenv';
dotenv.config();

import { SolanaRpcClient } from './rpc';
import { extractCpiInvocations } from './cpiParser';
import { DatabaseService } from './db';
import { globalDecoderRegistry } from './decoders/registry';

async function main() {
  console.log('====================================================');
  console.log('🚀 SolanaCPIBoard Ingestion Engine Starting...');
  console.log('====================================================');

  const mode = process.env.INDEXER_MODE || 'mock';
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
  const db = new DatabaseService();
  const rpc = new SolanaRpcClient(rpcUrl);

  const registeredDecoders = globalDecoderRegistry.listRegisteredPrograms();
  console.log(`[Registry] Loaded ${registeredDecoders.length} program decoders:`);
  registeredDecoders.forEach(d => console.log(`  - ${d.name} (${d.programId.substring(0, 8)}...)`));

  const isDbConnected = await db.testConnection();
  if (isDbConnected) {
    console.log('[DB] Successfully connected to PostgreSQL.');
  } else {
    console.log('[DB] Running in dry-run mode (PostgreSQL offline or unreachable).');
  }

  let currentSlot = 285000000;

  if (mode === 'mock') {
    console.log('[Indexer] Mode: MOCK STREAM (Generating synthetic Solana CPI calls)');
    
    setInterval(async () => {
      currentSlot += 1;
      const batchSize = Math.floor(Math.random() * 5) + 3;
      const mockTxs = Array.from({ length: batchSize }, () => rpc.generateMockTransaction(currentSlot));

      const allInvocations = mockTxs.flatMap(tx => extractCpiInvocations(tx));

      console.log(`[Slot ${currentSlot}] Ingested ${mockTxs.length} txs -> Extracted ${allInvocations.length} CPI invocations.`);

      if (isDbConnected) {
        try {
          await db.insertCpiEvents(allInvocations);
          await db.updateHourlyRollups(allInvocations);
        } catch (err) {
          console.error('[DB] Ingestion write error:', (err as Error).message);
        }
      }
    }, Number(process.env.POLL_INTERVAL_MS) || 3000);
  } else {
    console.log(`[Indexer] Mode: LIVE RPC POLL (${rpcUrl})`);
    // Live block polling loop
    const pollLoop = async () => {
      try {
        const txs = await rpc.getBlock(currentSlot);
        if (txs.length > 0) {
          const invocations = txs.flatMap(tx => extractCpiInvocations(tx));
          console.log(`[Slot ${currentSlot}] Extracted ${invocations.length} CPIs.`);
          if (isDbConnected) {
            await db.insertCpiEvents(invocations);
            await db.updateHourlyRollups(invocations);
          }
        }
        currentSlot += 1;
      } catch (err) {
        console.error('[Indexer] Error polling block:', err);
      }
      setTimeout(pollLoop, Number(process.env.POLL_INTERVAL_MS) || 1000);
    };

    pollLoop();
  }
}

main().catch(err => {
  console.error('Fatal error in indexer:', err);
  process.exit(1);
});
