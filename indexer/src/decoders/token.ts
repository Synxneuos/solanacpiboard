import { ProgramDecoder, DecodedInstruction } from './types';

export class TokenProgramDecoder implements ProgramDecoder {
  public programId: string;
  public name: string;

  constructor(
    programId = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    name = 'SPL Token'
  ) {
    this.programId = programId;
    this.name = name;
  }

  decode(data?: string): DecodedInstruction | null {
    if (!data) return { name: 'unknown' };

    try {
      const buffer = Buffer.from(data, data.length > 20 && !data.includes('/') ? 'hex' : 'base64');
      if (buffer.length < 1) return { name: 'unknown' };

      const typeByte = buffer[0];
      const instructions: Record<number, string> = {
        0: 'InitializeMint',
        1: 'InitializeAccount',
        2: 'InitializeMultisig',
        3: 'Transfer',
        4: 'Approve',
        5: 'Revoke',
        6: 'SetAuthority',
        7: 'MintTo',
        8: 'Burn',
        9: 'CloseAccount',
        10: 'FreezeAccount',
        11: 'ThawAccount',
        12: 'TransferChecked',
        13: 'ApproveChecked',
        14: 'MintToChecked',
        15: 'BurnChecked',
        16: 'InitializeAccount2',
        17: 'SyncNative',
        18: 'InitializeAccount3',
        19: 'InitializeMultisig2',
        20: 'InitializeMint2',
        21: 'GetAccountDataSize',
        22: 'InitializeImmutableOwner',
        23: 'AmountToUiAmount',
        24: 'UiAmountToAmount',
      };

      return {
        name: instructions[typeByte] || `TokenInstruction_${typeByte}`,
      };
    } catch {
      return { name: 'token_instruction' };
    }
  }
}
