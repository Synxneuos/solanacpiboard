export interface CpiInvocation {
  signature: string;
  slot: number;
  blockTime: number; // Unix timestamp in seconds
  callerProgramId: string;
  calleeProgramId: string;
  depth: number;
  instructionName: string;
  success: boolean;
  feePayer?: string;
  computeUnits?: number;
}

export interface RawInnerInstruction {
  programId: string;
  accounts?: string[];
  data?: string;
  stackHeight?: number;
}

export interface RawInnerInstructionGroup {
  index: number; // Index of parent instruction
  instructions: RawInnerInstruction[];
}

export interface ParsedTxMessageInstruction {
  programId: string;
  accounts?: string[];
  data?: string;
}

export interface ProcessableTransaction {
  signature: string;
  slot: number;
  blockTime: number;
  feePayer?: string;
  err: any | null;
  computeUnitsConsumed?: number;
  instructions: ParsedTxMessageInstruction[];
  innerInstructions: RawInnerInstructionGroup[];
}

export interface HourlyRollupKey {
  hourTimestamp: string; // ISO string
  callerProgramId: string;
  calleeProgramId: string;
}

export interface HourlyRollupValue {
  totalCalls: number;
  successCalls: number;
  failedCalls: number;
  uniqueFeePayers: Set<string>;
}
