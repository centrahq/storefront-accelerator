import { Fragment } from 'react';

interface PlainAddressProps {
  address: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    companyName?: string | null;
    vatNumber?: string | null;
    address1?: string | null;
    address2?: string | null;
    zipCode?: string | null;
    city?: string | null;
    state?: {
      name: string;
    } | null;
    country?: {
      name: string;
    } | null;
  };
}

export const PlainAddress = ({ address }: PlainAddressProps) => {
  const lines = [
    [address.firstName, address.lastName].filter(Boolean).join(' '),
    address.email,
    address.phoneNumber,
    [address.companyName, address.vatNumber].filter(Boolean).join(' - '),
    [address.address1, address.address2].filter(Boolean).join(' '),
    [address.zipCode, address.city].filter(Boolean).join(', '),
    [address.state?.name, address.country?.name].filter(Boolean).join(', '),
  ].filter(Boolean);

  return (
    <p>
      {lines.map((line, index) => (
        <Fragment key={index}>
          <span>{line}</span>
          <br />
        </Fragment>
      ))}
    </p>
  );
};
