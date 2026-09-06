import { ProgramDecoder, DecodedInstruction } from './types';
import { SystemProgramDecoder } from './system';
import { TokenProgramDecoder } from './token';
import { JupiterDecoder } from './jupiter';
import { RaydiumAmmDecoder } from './raydium';

export class DecoderRegistry {
  private decoders: Map<string, ProgramDecoder> = new Map();

  constructor() {
    this.registerDefaults();
  }

  private registerDefaults(): void {
    // 1. System Program
    this.register(new SystemProgramDecoder());

    // 2. SPL Token Program
    this.register(new TokenProgramDecoder('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', 'SPL Token Program'));

    // 3. Token Extensions (Token-2022)
    this.register(new TokenProgramDecoder('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb', 'Token Extensions (2022)'));

    // 4. Jupiter Routing v6
    this.register(new JupiterDecoder());

    // 5. Raydium AMM v4
    this.register(new RaydiumAmmDecoder('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', 'Raydium AMM v4'));

    // 6. Raydium CLMM
    this.register(new RaydiumAmmDecoder('CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaWNZDFZqq8V', 'Raydium CLMM'));
  }

  public register(decoder: ProgramDecoder): void {
    this.decoders.set(decoder.programId, decoder);
  }

  public getDecoder(programId: string): ProgramDecoder | undefined {
    return this.decoders.get(programId);
  }

  public decodeInstruction(programId: string, data?: string, accounts?: string[]): DecodedInstruction {
    const decoder = this.getDecoder(programId);
    if (!decoder) {
      return { name: 'invoke' };
    }
    const decoded = decoder.decode(data, accounts);
    return decoded || { name: 'invoke' };
  }

  public listRegisteredPrograms(): { programId: string; name: string }[] {
    return Array.from(this.decoders.values()).map(d => ({
      programId: d.programId,
      name: d.name,
    }));
  }
}

export const globalDecoderRegistry = new DecoderRegistry();
