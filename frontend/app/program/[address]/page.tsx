import React from 'react';
import { SEED_PROGRAMS_DATA } from '../../../lib/api';
import { ProgramDetailView } from '../../../components/ProgramDetailView';

export function generateStaticParams() {
  return SEED_PROGRAMS_DATA.map((p) => ({
    address: p.program_id,
  }));
}

export default function ProgramPage({ params }: { params: { address: string } }) {
  return <ProgramDetailView address={params.address} />;
}
