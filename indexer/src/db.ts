import { Pool } from 'pg';
import { CpiInvocation, HourlyRollupKey, HourlyRollupValue } from './types';

export class DatabaseService {
  private pool: Pool;

  constructor(connectionString?: string) {
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL || 'postgresql://cpi_admin:cpi_secure_password_123@localhost:5432/solanacpiboard',
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      client.release();
      return true;
    } catch (err) {
      console.warn('[DB] Database connection warning:', (err as Error).message);
      return false;
    }
  }

  /**
   * Automatically ensures both caller and callee exist in the programs directory
   */
  async ensureProgramsExist(programIds: string[]): Promise<void> {
    if (programIds.length === 0) return;
    const uniqueIds = Array.from(new Set(programIds));

    const query = `
      INSERT INTO programs (program_id, name, category, is_verified)
      SELECT p_id, 
             SUBSTRING(p_id, 1, 4) || '...' || SUBSTRING(p_id, 41, 4),
             'Uncategorized',
             FALSE
      FROM UNNEST($1::text[]) AS p_id
      ON CONFLICT (program_id) DO NOTHING;
    `;

    try {
      await this.pool.query(query, [uniqueIds]);
    } catch (err) {
      console.error('[DB] Error ensuring programs exist:', err);
    }
  }

  /**
   * Persists raw CPI invocations in batches
   */
  async insertCpiEvents(events: CpiInvocation[]): Promise<void> {
    if (events.length === 0) return;

    // Collect all unique program IDs first
    const programIds = new Set<string>();
    for (const e of events) {
      programIds.add(e.callerProgramId);
      programIds.add(e.calleeProgramId);
    }
    await this.ensureProgramsExist(Array.from(programIds));

    // Batch insert up to 500 rows per query
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const insertQuery = `
        INSERT INTO cpi_events (
          signature, slot, block_time, caller_program_id, callee_program_id, 
          depth, instruction_name, success, fee_payer, compute_units_consumed
        ) VALUES ($1, $2, to_timestamp($3), $4, $5, $6, $7, $8, $9, $10)
      `;

      for (const ev of events) {
        await client.query(insertQuery, [
          ev.signature,
          ev.slot,
          ev.blockTime,
          ev.callerProgramId,
          ev.calleeProgramId,
          ev.depth,
          ev.instructionName,
          ev.success,
          ev.feePayer || null,
          ev.computeUnits || 0,
        ]);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[DB] Batch insert error:', err);
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Updates pre-aggregated hourly rollups for instant leaderboard queries
   */
  async updateHourlyRollups(events: CpiInvocation[]): Promise<void> {
    if (events.length === 0) return;

    // Map: "hourIso_caller_callee" -> HourlyRollupValue
    const aggregations = new Map<string, {
      hourTimestamp: string;
      caller: string;
      callee: string;
      total: number;
      success: number;
      failed: number;
      feePayers: Set<string>;
    }>();

    for (const ev of events) {
      const date = new Date(ev.blockTime * 1000);
      date.setMinutes(0, 0, 0);
      const hourIso = date.toISOString();
      const key = `${hourIso}_${ev.callerProgramId}_${ev.calleeProgramId}`;

      let record = aggregations.get(key);
      if (!record) {
        record = {
          hourTimestamp: hourIso,
          caller: ev.callerProgramId,
          callee: ev.calleeProgramId,
          total: 0,
          success: 0,
          failed: 0,
          feePayers: new Set<string>(),
        };
        aggregations.set(key, record);
      }

      record.total += 1;
      if (ev.success) {
        record.success += 1;
      } else {
        record.failed += 1;
      }
      if (ev.feePayer) {
        record.feePayers.add(ev.feePayer);
      }
    }

    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const upsertQuery = `
        SELECT increment_cpi_rollup(
          $1::timestamptz, $2::varchar, $3::varchar, $4::bigint, $5::bigint, $6::bigint, $7::bigint
        );
      `;

      for (const agg of aggregations.values()) {
        await client.query(upsertQuery, [
          agg.hourTimestamp,
          agg.caller,
          agg.callee,
          agg.total,
          agg.success,
          agg.failed,
          agg.feePayers.size,
        ]);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[DB] Hourly rollup aggregation error:', err);
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
