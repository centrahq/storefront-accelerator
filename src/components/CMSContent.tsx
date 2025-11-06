import { Field, Input, Label } from '@headlessui/react';
import { PercentBadgeIcon, StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import Link from 'next/link';

import { Carousel } from '@/components/Carousel';
import { ShopLink } from '@/features/i18n/routing/ShopLink';

/*
  This file is a placeholder for the home page content. You would typically fetch all the content from a CMS or a product discovery platform.
*/

const NewArrivals = () => {
  return (
    <div className="flex size-full flex-col items-start justify-end">
      <Image className="-z-10 object-cover" src="/images/hero-1.avif" fill alt="" priority unoptimized />
      <div className="flex flex-col gap-3">
        <span className="text-4xl font-medium text-white">New arrivals</span>
        <span className="text-mono-200 text-xl font-normal">Lorem ipsum dolor sit amet enim.</span>
      </div>
      <ShopLink href="/products" className="text-mono-900 mt-8 bg-white px-6 py-4 text-xs font-bold uppercase">
        Go to products
      </ShopLink>
    </div>
  );
};

const Bestsellers = () => {
  return (
    <div className="flex size-full flex-col items-start justify-end">
      <Image className="-z-10 object-cover" src="/images/hero-2.avif" fill alt="" priority unoptimized />
      <div className="flex flex-col gap-3">
        <span className="text-4xl font-medium text-white">Bestsellers</span>
        <span className="text-mono-200 text-xl font-normal">Lorem ipsum dolor sit amet enim.</span>
      </div>
      <ShopLink href="/products" className="text-mono-900 mt-8 bg-white px-6 py-4 text-xs font-bold uppercase">
        Go to products
      </ShopLink>
    </div>
  );
};

export const SocialProof = () => {
  const children = [
    <div className="flex flex-col items-center gap-3" key={0}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-mono-900"
        aria-hidden="true"
      >
        <path
          d="M13 1.63501L4 6.81501V10.5H5.5V8.53501L12.25 12.43V20.285L10.335 19.33L9.665 20.67L13.025 22.35L22 17.185V6.81501L13 1.63501ZM19.735 7.24501L17.12 8.75501L10.375 4.87501L12.995 3.36501L19.73 7.24501H19.735ZM13 11.135L6.265 7.24501L8.875 5.74001L15.62 9.62001L13 11.135ZM13.75 20.205V12.435L16.5 10.845V13.5H18V9.98001L20.5 8.53501V16.315L13.75 20.2V20.205Z"
          fill="currentColor"
        />
        <path d="M8.5 12H1V13.5H8.5V12Z" fill="currentColor" />
        <path d="M10 15H4V16.5H10V15Z" fill="currentColor" />
        <path d="M8 18H3V19.5H8V18Z" fill="currentColor" />
      </svg>
      <div className="flex flex-col items-center">
        <div className="text-mono-900 text-xl font-medium">Free shipping</div>
        <div className="text-mono-500">From $100</div>
      </div>
    </div>,
    <div className="flex flex-col items-center gap-3" key={1}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-mono-900"
        aria-hidden="true"
      >
        <path
          d="M22.0002 13V11.5H18.5002V12.5H17.0002V3H3.00023V13.29C2.45523 13.33 1.94023 13.615 1.62023 14.095C1.13523 14.82 1.23523 15.79 1.85023 16.405L6.87523 21.43C7.20523 21.76 7.65523 21.945 8.11523 21.945C8.19023 21.945 8.26523 21.94 8.34523 21.93L15.3052 21H18.5052V22H22.0052V20.5H20.0052V13H22.0052H22.0002ZM9.00023 4.5H11.0002V7.615L10.0002 7.185L9.00023 7.615V4.5ZM7.50023 4.5V9.885L10.0002 8.815L12.5002 9.885V4.5H15.5002V12.5H15.1302L13.6302 13H9.75023C8.57023 13 7.61023 13.915 7.52023 15.07L4.50023 13.715V4.5H7.50023ZM15.2502 19.5L8.14023 20.44C8.06523 20.45 7.98523 20.425 7.93023 20.37L2.90523 15.345C2.79523 15.235 2.77523 15.06 2.86523 14.925C2.95523 14.79 3.13023 14.74 3.27523 14.805L8.80523 17.29C9.09023 17.42 9.40523 17.495 9.74523 17.495H13.4352L14.2152 18.275L15.2752 17.215L14.0552 15.995H9.74523C9.33023 15.995 8.99523 15.66 8.99523 15.245C8.99523 14.83 9.33023 14.495 9.74523 14.495H13.8652L15.3652 13.995H18.4952V19.495H15.2452L15.2502 19.5Z"
          fill="currentColor"
        />
      </svg>

      <div className="flex flex-col items-center">
        <div className="text-mono-900 text-xl font-medium">Easy returns</div>
        <div className="text-mono-500">for your perfect fit</div>
      </div>
    </div>,
    <div className="flex flex-col items-center gap-3" key={2}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-mono-900"
        aria-hidden="true"
      >
        <path
          d="M16.5 3.51501C14.675 3.51501 13.01 4.41501 12 5.85501C10.99 4.41501 9.325 3.51501 7.5 3.51501C4.465 3.51501 2 5.98001 2 9.01501C2 10.485 2.57 11.865 3.61 12.905L12 21.295L20.39 12.905C21.43 11.865 22 10.485 22 9.01501C22 5.98001 19.535 3.51501 16.5 3.51501ZM19.33 11.845L12 19.175L4.67 11.845C3.915 11.09 3.5 10.085 3.5 9.01501C3.5 6.81001 5.295 5.01501 7.5 5.01501C9.22 5.01501 10.74 6.11001 11.29 7.74001C11.395 8.04501 11.68 8.25001 12 8.25001C12.32 8.25001 12.61 8.04501 12.71 7.74001C13.26 6.11001 14.78 5.01501 16.5 5.01501C18.705 5.01501 20.5 6.81001 20.5 9.01501C20.5 10.085 20.085 11.09 19.33 11.845Z"
          fill="currentColor"
        />
      </svg>

      <div className="flex flex-col items-center">
        <div className="text-mono-900 text-xl font-medium">Loved by thousands</div>
        <div className="text-mono-500">who come back for more</div>
      </div>
    </div>,
    <div className="flex flex-col items-center gap-3" key={3}>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-mono-900"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.25 4H4.75C3.235 4 2 5.235 2 6.75V17.25C2 18.765 3.235 20 4.75 20H11.5V18.5H4.75C4.06 18.5 3.5 17.94 3.5 17.25V10.5H20.5V13H22V6.75C22 5.235 20.765 4 19.25 4ZM20.5 8.5H3.5V6.75C3.5 6.06 4.06 5.5 4.75 5.5H19.25C19.94 5.5 20.5 6.06 20.5 6.75V8.5ZM11.5 15H5.5V16.5H11.5V15ZM14.2802 17.72L16.2502 19.69L20.7202 15.22L21.7802 16.28L17.1352 20.925C16.8902 21.17 16.5702 21.29 16.2502 21.29C15.9302 21.29 15.6102 21.17 15.3652 20.925L13.2202 18.78L14.2802 17.72Z"
          fill="currentColor"
        />
      </svg>

      <div className="flex flex-col items-center">
        <div className="text-mono-900 text-xl font-medium">Secured payments</div>
        <div className="text-mono-500">by Klarna</div>
      </div>
    </div>,
  ];

  return (
    <>
      <div className="hidden grid-cols-4 gap-2 bg-white p-10 xl:grid">{children}</div>
      <div className="xl:hidden">
        <Carousel>
          {children.map((child, index) => (
            <div key={index} className="flex h-29 flex-col items-center justify-center bg-white">
              {child}
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export const Hero = () => {
  return (
    <>
      <h1 className="text-mono-900 text-6xl">
        <span className="font-medium">Find perfect socks</span>
        <br />
        <span className="font-light">for your next adventure</span>
      </h1>
      <div className="hidden h-144 gap-10 overflow-x-auto xl:flex">
        <div className="relative min-w-136 grow p-10">
          <NewArrivals />
        </div>

        <div className="relative min-w-136 shrink-0 p-10">
          <Bestsellers />
        </div>
      </div>
      <div className="xl:hidden">
        <Carousel>
          <div className="relative h-96 p-6">
            <NewArrivals />
          </div>

          <div className="relative h-96 p-6">
            <Bestsellers />
          </div>
        </Carousel>
      </div>
    </>
  );
};

export const Newsletter = () => {
  return (
    <section className="grid h-104 grid-cols-1 grid-rows-2 bg-white lg:grid-cols-2 lg:grid-rows-1">
      <div className="text-mono-900 flex flex-col justify-center gap-3 px-6 lg:gap-6 lg:px-20">
        <PercentBadgeIcon className="size-6 lg:size-10" aria-hidden="true" />
        <div className="text-2xl leading-none lg:text-4xl lg:leading-tight">
          <span className="font-medium">
            Enjoy 10% off <br />
          </span>
          <span className="font-light">your first purchase</span>
        </div>
        <div className="text-mono-500 text-sm lg:text-xl">Stay in the know about our newest collections.</div>
        <form className="flex items-center gap-3">
          <Field className="max-w-md grow">
            <Label className="sr-only">Email address</Label>
            <Input
              type="email"
              className="border-mono-300 w-full border px-6 py-3 text-sm"
              name="newsletter.email"
              placeholder="Email address"
              required
            />
          </Field>
          <button
            type="submit"
            className="bg-mono-900 text-mono-0 flex shrink-0 items-center justify-center px-6 py-3.5 text-xs font-bold uppercase"
          >
            Sign up
          </button>
        </form>
      </div>
      <div className="relative max-lg:row-start-1">
        <Image className="object-cover" fill src="/images/newsletter.avif" alt="" unoptimized />
      </div>
    </section>
  );
};

export const MoreSection = () => {
  return (
    <>
      <h2 className="text-3xl font-medium">More</h2>
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2 xl:gap-12">
        <div className="relative flex min-h-80 flex-col items-start justify-end p-10">
          <Image className="-z-10 object-cover" src="/images/hero-1.avif" fill alt="" unoptimized />
          <div className="flex flex-col gap-3">
            <span className="text-4xl font-medium text-white">Frequently Asked Questions</span>
            <span className="text-mono-200 text-xl font-normal">
              If you can&apos;t find the information you&apos;re looking for, please see our support centre.
            </span>
          </div>
          <Link
            href="https://support.centra.com"
            target="_blank"
            className="text-mono-900 mt-8 bg-white px-6 py-4 text-xs font-bold uppercase"
          >
            Read more
          </Link>
        </div>

        <div className="relative flex min-h-80 flex-col items-start justify-end p-10">
          <Image className="-z-10 object-cover" src="/images/shipping-returns.avif" fill alt="" unoptimized />
          <div className="flex flex-col gap-3">
            <span className="text-4xl font-medium text-white">Shipping & Returns</span>
            <span className="text-mono-200 text-xl font-normal">Learn more about our policies.</span>
          </div>
          <ShopLink href="/shipping" className="text-mono-900 mt-8 bg-white px-6 py-4 text-xs font-bold uppercase">
            Read more
          </ShopLink>
        </div>
      </div>
    </>
  );
};

export const ProductReviews = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        <StarSolidIcon className="size-4" aria-hidden="true" />
        <StarSolidIcon className="size-4" aria-hidden="true" />
        <StarSolidIcon className="size-4" aria-hidden="true" />
        <StarSolidIcon className="size-4" aria-hidden="true" />
        <StarOutlineIcon className="size-4" aria-hidden="true" />
      </div>
      <span className="text-sm font-medium underline underline-offset-2">142 reviews</span>
    </div>
  );
};
