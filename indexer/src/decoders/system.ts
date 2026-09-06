import { ProgramDecoder, DecodedInstruction } from './types';

export class SystemProgramDecoder implements ProgramDecoder {
  public programId = '11111111111111111111111111111111';
  public name = 'System Program';

  decode(data?: string): DecodedInstruction | null {
    if (!data) return { name: 'unknown' };

    try {
      // Decode 4-byte little-endian instruction index
      const buffer = Buffer.from(data, data.length > 20 && !data.includes('/') ? 'hex' : 'base64');
      if (buffer.length < 4) return { name: 'unknown' };

      const instructionType = buffer.readUInt32LE(0);
      const types: Record<number, string> = {
        0: 'CreateAccount',
        1: 'Assign',
        2: 'Transfer',
        3: 'CreateAccountWithSeed',
        4: 'AdvanceNonceAccount',
        5: 'WithdrawNonceAccount',
        6: 'InitializeNonceAccount',
        7: 'AuthorizeNonceAccount',
        8: 'Allocate',
        9: 'AllocateWithSeed',
        10: 'AssignWithSeed',
        11: 'TransferWithSeed',
        12: 'UpgradeNonceAccount',
      };

      const name = types[instructionType] || `Instruction_${instructionType}`;
      return { name };
    } catch {
      return { name: 'system_instruction' };
    }
  }
}
