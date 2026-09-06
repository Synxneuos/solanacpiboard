import { ProgramDecoder, DecodedInstruction } from './types';

export class JupiterDecoder implements ProgramDecoder {
  public programId = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';
  public name = 'Jupiter Routing v6';

  private discriminators: Record<string, string> = {
    'e445a52e51cb9a1d': 'route',
    'd02321e7d23d8c19': 'exactOutRoute',
    'c1209b3341d69c81': 'sharedAccountsRoute',
    'b0d5c808799ea4e5': 'sharedAccountsExactOutRoute',
    'f8c69e91e17587c8': 'swap',
  };

  decode(data?: string): DecodedInstruction | null {
    if (!data) return { name: 'route' };

    try {
      const buffer = Buffer.from(data, data.length > 20 && !data.includes('/') ? 'hex' : 'base64');
      if (buffer.length < 8) return { name: 'route' };

      const discHex = buffer.subarray(0, 8).toString('hex');
      const instructionName = this.discriminators[discHex] || 'route';
      return { name: instructionName };
    } catch {
      return { name: 'route' };
    }
  }
}
