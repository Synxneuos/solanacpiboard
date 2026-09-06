import { ProgramDecoder, DecodedInstruction } from './types';

export class RaydiumAmmDecoder implements ProgramDecoder {
  public programId: string;
  public name: string;

  constructor(
    programId = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
    name = 'Raydium Liquidity Pool V4'
  ) {
    this.programId = programId;
    this.name = name;
  }

  decode(data?: string): DecodedInstruction | null {
    if (!data) return { name: 'swap' };

    try {
      const buffer = Buffer.from(data, data.length > 20 && !data.includes('/') ? 'hex' : 'base64');
      if (buffer.length < 1) return { name: 'swap' };

      const typeByte = buffer[0];
      const ammInstructions: Record<number, string> = {
        0: 'initialize',
        1: 'initialize2',
        2: 'monitorStep',
        3: 'deposit',
        4: 'withdraw',
        5: 'migrate',
        9: 'swapBaseIn',
        10: 'swapBaseOut',
        11: 'simulateInfo',
      };

      return {
        name: ammInstructions[typeByte] || 'swap',
      };
    } catch {
      return { name: 'swap' };
    }
  }
}
