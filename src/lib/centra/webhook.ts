import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';

import { TAGS } from '@/lib/centra/constants';

const MAX_AGE = 5 * 60;

const getCurrentTime = () => Date.now() / 1000;
const uniq = <T>(arr: T[]) => [...new Set(arr)];

const timingSafeEqual = (a: string, b: string) => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  return bufferA.byteLength === bufferB.byteLength && crypto.timingSafeEqual(bufferA, bufferB);
};

type Payload = Partial<
  Record<
    | 'DisplayItems'
    | 'Categories'
    | 'Pricelists'
    | 'Markets'
    | 'Collections'
    | 'Brands'
    | 'Languages'
    | 'CampaignSites'
    | 'Affiliates'
    | 'BrickAndMortars',
    string[]
  >
>;

export const revalidateHandler = async (req: NextRequest): Promise<NextResponse> => {
  const signatureHeader = req.headers.get('X-Centra-Signature') ?? '';
  const signature: { t?: string; v1?: string } = signatureHeader
    .split(',')
    .reduce<Record<string, string>>((acc, pair) => {
      const [key, value] = pair.split('=');

      if (key && value) {
        acc[key] = value;
      }

      return acc;
    }, {});

  if (!signature.t || getCurrentTime() - Number(signature.t) > MAX_AGE) {
    console.error('Revalidate request is too old.');
    return NextResponse.json({}, { status: 401 });
  }

  const body = await req.text();
  const hash = crypto
    .createHmac('sha256', process.env.CENTRA_WEBHOOK_SECRET)
    .update(`${signature.t}.${body}`)
    .digest('hex');

  if (!signature.v1 || !timingSafeEqual(hash, signature.v1)) {
    console.error('Invalid signature.');
    return NextResponse.json({}, { status: 401 });
  }

  const payload = JSON.parse(decodeURIComponent(body.split('=')[1] ?? '{}')) as Payload;

  if (payload.DisplayItems) {
    console.info('Revalidated products.', payload.DisplayItems);
    revalidateTag(TAGS.products);
    uniq(payload.DisplayItems).forEach((id) => {
      revalidateTag(TAGS.product(id));
    });
  }

  if (payload.Markets) {
    console.info('Revalidated markets.');
    revalidateTag(TAGS.markets);
  }

  if (payload.Languages) {
    console.info('Revalidated languages.');
    revalidateTag(TAGS.languages);
  }

  if (payload.Categories) {
    console.info('Revalidated categories.', payload.Categories);
    revalidateTag(TAGS.categories);
    uniq(payload.Categories).forEach((id) => revalidateTag(TAGS.category(id)));
  }

  return NextResponse.json({}, { status: 200 });
};
