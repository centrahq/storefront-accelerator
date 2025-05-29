import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default function Image() {
  return new ImageResponse(
    (
      <div tw="w-full h-full flex flex-col items-center justify-center bg-black">
        <div tw="flex flex-col w-full py-12 px-4 items-center justify-between">
          <h1 tw="flex text-6xl text-white">Centra Swag</h1>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
