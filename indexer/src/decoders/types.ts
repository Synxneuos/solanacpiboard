export interface DecodedInstruction {
  name: string;
  params?: Record<string, any>;
}

export interface ProgramDecoder {
  programId: string;
  name: string;
  decode(dataBase58OrBase64?: string, accounts?: string[]): DecodedInstruction | null;
}
