import { ProcessableTransaction, CpiInvocation } from './types';
import { globalDecoderRegistry } from './decoders/registry';

interface StackFrame {
  depth: number;
  programId: string;
}

/**
 * Extracts directed Cross-Program Invocations (CPIs) from a parsed Solana transaction.
 * Accurately tracks nested call depths using stackHeight.
 */
export function extractCpiInvocations(tx: ProcessableTransaction): CpiInvocation[] {
  const cpiCalls: CpiInvocation[] = [];
  const isSuccess = tx.err === null;

  if (!tx.innerInstructions || tx.innerInstructions.length === 0) {
    return cpiCalls;
  }

  for (const group of tx.innerInstructions) {
    const parentTopLevelIdx = group.index;
    const parentTopLevel = tx.instructions[parentTopLevelIdx];

    if (!parentTopLevel) {
      continue;
    }

    const rootProgramId = parentTopLevel.programId;

    // Stack initialized with the root top-level instruction at depth 1
    const callStack: StackFrame[] = [{ depth: 1, programId: rootProgramId }];

    for (const inner of group.instructions) {
      const depth = inner.stackHeight ?? 2;
      const callee = inner.programId;

      // Pop frames that are at or deeper than current depth
      while (callStack.length > 0 && callStack[callStack.length - 1].depth >= depth) {
        callStack.pop();
      }

      // The immediate caller is the top of the stack
      const caller = callStack.length > 0
        ? callStack[callStack.length - 1].programId
        : rootProgramId;

      // Decode instruction if possible
      const decoded = globalDecoderRegistry.decodeInstruction(callee, inner.data, inner.accounts);

      cpiCalls.push({
        signature: tx.signature,
        slot: tx.slot,
        blockTime: tx.blockTime,
        callerProgramId: caller,
        calleeProgramId: callee,
        depth: depth,
        instructionName: decoded.name,
        success: isSuccess,
        feePayer: tx.feePayer,
        computeUnits: tx.computeUnitsConsumed,
      });

      // Push current call onto the stack
      callStack.push({ depth, programId: callee });
    }
  }

  return cpiCalls;
}
