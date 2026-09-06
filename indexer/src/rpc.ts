import { Connection, VersionedBlockResponse } from '@solana/web3.js';
import axios from 'axios';
import { ProcessableTransaction } from './types';

export class SolanaRpcClient {
  private connection: Connection;
  private heliusApiKey?: string;

  constructor(rpcUrl = 'https://api.mainnet-beta.solana.com', heliusApiKey?: string) {
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.heliusApiKey = heliusApiKey || process.env.HELIUS_API_KEY;
  }

  /**
   * Fetches full block with parsed transactions and inner instructions
   */
  async getBlock(slot: number): Promise<ProcessableTransaction[]> {
    try {
      const block = await this.connection.getBlock(slot, {
        maxSupportedTransactionVersion: 0,
        transactionDetails: 'full',
        rewards: false,
      });

      if (!block || !block.transactions) return [];

      return this.transformBlockTransactions(block, slot);
    } catch (err) {
      console.error(`[RPC] Failed to fetch block at slot ${slot}:`, (err as Error).message);
      return [];
    }
  }

  /**
   * Transforms raw Solana Web3.js block transactions into ProcessableTransaction format
   */
  private transformBlockTransactions(
    block: VersionedBlockResponse,
    slot: number
  ): ProcessableTransaction[] {
    const results: ProcessableTransaction[] = [];
    const blockTime = block.blockTime ?? Math.floor(Date.now() / 1000);

    for (const tx of block.transactions) {
      if (!tx.meta || !tx.transaction) continue;

      const accountKeys = tx.transaction.message.getAccountKeys({
        addressLookupTableAccounts: [],
      });

      const instructions = tx.transaction.message.compiledInstructions.map(ix => ({
        programId: accountKeys.get(ix.programIdIndex)?.toBase58() || 'unknown',
        data: Buffer.from(ix.data).toString('base64'),
      }));

      const innerInstructions = (tx.meta.innerInstructions || []).map(group => ({
        index: group.index,
        instructions: group.instructions.map(inner => {
          // If compiled
          let programId = 'unknown';
          if ('programIdIndex' in inner) {
            programId = accountKeys.get((inner as any).programIdIndex)?.toBase58() || 'unknown';
          } else if ('programId' in inner) {
            programId = (inner as any).programId.toString();
          }

          return {
            programId,
            stackHeight: (inner as any).stackHeight,
            data: (inner as any).data ? (inner as any).data.toString() : undefined,
          };
        }),
      }));

      const signature = tx.transaction.signatures[0] || 'mock_sig_' + Math.random();
      const feePayer = accountKeys.get(0)?.toBase58();

      results.push({
        signature,
        slot,
        blockTime,
        feePayer,
        err: tx.meta.err,
        computeUnitsConsumed: tx.meta.computeUnitsConsumed ?? 0,
        instructions,
        innerInstructions,
      });
    }

    return results;
  }

  /**
   * Generates realistic mock Solana transactions for local testing & demos without RPC limits
   */
  generateMockTransaction(slot: number): ProcessableTransaction {
    const programs = [
      { id: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', name: 'Jupiter v6' },
      { id: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', name: 'Raydium AMM' },
      { id: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', name: 'Orca Whirlpools' },
      { id: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', name: 'SPL Token' },
      { id: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb', name: 'Token-2022' },
      { id: 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD', name: 'Kamino Lending' },
      { id: '11111111111111111111111111111111', name: 'System Program' },
    ];

    const randomPayer = 'Payer' + Math.random().toString(36).substring(2, 8) + '111111111111111111111111111111';
    const sig = '5' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12) + 'SolanaCpiBoardTest';

    // Scenario: Jupiter -> Raydium -> SPL Token
    return {
      signature: sig,
      slot,
      blockTime: Math.floor(Date.now() / 1000),
      feePayer: randomPayer,
      err: Math.random() > 0.95 ? { InstructionError: [0, 'Custom'] } : null,
      computeUnitsConsumed: Math.floor(Math.random() * 80000) + 20000,
      instructions: [
        {
          programId: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', // Jupiter root
          data: '5EUJ3P5k...',
        },
      ],
      innerInstructions: [
        {
          index: 0,
          instructions: [
            {
              programId: '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium
              stackHeight: 2,
              data: 'AQ==',
            },
            {
              programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // SPL Token Transfer
              stackHeight: 3,
              data: 'AwAAAAAAAAA=',
            },
            {
              programId: 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', // Orca
              stackHeight: 2,
              data: 'BQ==',
            },
            {
              programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', // SPL Token Transfer
              stackHeight: 3,
              data: 'AwAAAAAAAAA=',
            },
          ],
        },
      ],
    };
  }
}
