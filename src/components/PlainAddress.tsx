import { Fragment } from 'react';

import { AddressFragment } from '@gql/graphql';

export const PlainAddress = ({ address }: { address: AddressFragment }) => {
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
