import { extractCpiInvocations } from '../src/cpiParser';
import { ProcessableTransaction } from '../src/types';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

console.log('🧪 Running CPI Call Stack Parser Tests...');

const mockTx: ProcessableTransaction = {
  signature: '5testSig1234567890',
  slot: 1000,
  blockTime: 1725600000,
  feePayer: 'FeePayerAddress',
  err: null,
  computeUnitsConsumed: 50000,
  instructions: [
    {
      programId: 'JupiterProgramId',
      data: 'route',
    },
  ],
  innerInstructions: [
    {
      index: 0,
      instructions: [
        // Level 2: Jupiter calls Raydium
        {
          programId: 'RaydiumProgramId',
          stackHeight: 2,
        },
        // Level 3: Raydium calls SPL Token
        {
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          stackHeight: 3,
        },
        // Level 2: Jupiter calls Orca
        {
          programId: 'OrcaProgramId',
          stackHeight: 2,
        },
        // Level 3: Orca calls SPL Token
        {
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          stackHeight: 3,
        },
      ],
    },
  ],
};

const invocations = extractCpiInvocations(mockTx);

console.log(`Extracted ${invocations.length} invocations:`);
invocations.forEach((inv, i) => {
  console.log(`  [${i + 1}] ${inv.callerProgramId} -> ${inv.calleeProgramId} (depth ${inv.depth})`);
});

assert(invocations.length === 4, 'Should have extracted exactly 4 CPI calls');

// Test 1: Jupiter -> Raydium
assert(invocations[0].callerProgramId === 'JupiterProgramId', 'Call 1 caller must be Jupiter');
assert(invocations[0].calleeProgramId === 'RaydiumProgramId', 'Call 1 callee must be Raydium');
assert(invocations[0].depth === 2, 'Call 1 depth must be 2');

// Test 2: Raydium -> SPL Token
assert(invocations[1].callerProgramId === 'RaydiumProgramId', 'Call 2 caller must be Raydium');
assert(invocations[1].calleeProgramId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'Call 2 callee must be Token');
assert(invocations[1].depth === 3, 'Call 2 depth must be 3');

// Test 3: Jupiter -> Orca (Stack pop back to depth 1 parent)
assert(invocations[2].callerProgramId === 'JupiterProgramId', 'Call 3 caller must be Jupiter');
assert(invocations[2].calleeProgramId === 'OrcaProgramId', 'Call 3 callee must be Orca');
assert(invocations[2].depth === 2, 'Call 3 depth must be 2');

// Test 4: Orca -> SPL Token
assert(invocations[3].callerProgramId === 'OrcaProgramId', 'Call 4 caller must be Orca');
assert(invocations[3].calleeProgramId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'Call 4 callee must be Token');
assert(invocations[3].depth === 3, 'Call 4 depth must be 3');

console.log('✅ All CPI Call Stack Parser tests passed successfully!');
