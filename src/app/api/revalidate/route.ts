import { NextRequest } from 'next/server';

import { revalidateHandler } from '@/lib/centra/webhook';

export async function POST(req: NextRequest) {
  return revalidateHandler(req);
}
