import type { CheckoutData } from '../../../service';

/**
 * The part of a selection a wallet sheet shows: the selection Centra answers a wallet's own calls with
 * (`@centra/storefront-operations`' projection), or this store's `checkout` fragment through `toWalletSelection`. The
 * charged shipping method is `selected` in one and `checkout.shippingMethod` in the other.
 */
export interface WalletSelection {
  grandTotal: { value: number; currency: { code: string; denominator: number } };
  lines: readonly ({
    name: string;
    item?: { id: string } | null;
    lineValue: { value: number };
  } | null)[];
  checkout?: {
    shippingMethod?: { id: number } | null;
    shippingMethods?: readonly { id: number; name: string; selected?: boolean | null; price: { value: number } }[] | null;
  } | null;
}

/** The store's fragment names a line by its `displayItem`. */
export function toWalletSelection(data: CheckoutData | null): WalletSelection | null {
  return data
    ? {
        ...data,
        lines: data.lines.map(
          (line) => line && { name: line.displayItem.name, item: line.item, lineValue: line.lineValue },
        ),
      }
    : null;
}

/** The product a product-page wallet adds, priced into the sheet until it is in the bag. */
export interface PendingProduct {
  itemId: string;
  name: string;
  price: number;
}

export interface WalletLines {
  currency: { code: string; denominator: number };
  lines: { name: string; value: number }[];
  /** Charged method first: both wallets preselect the first one, and the sheet must show what Centra charges. */
  shippingMethods: { id: string; name: string; value: number }[];
  total: number;
}

/** Major-unit lines, total and shipping methods; each wallet converts them to its own units. */
export function toWalletLines(selection: WalletSelection | null, pending?: PendingProduct): WalletLines {
  const currency = selection?.grandTotal.currency ?? { code: '', denominator: 100 };
  const lines = (selection?.lines ?? [])
    .filter((line) => line !== null)
    .map((line) => ({ name: line.name, value: line.lineValue.value }));
  const added = pending && !selection?.lines.some((line) => line?.item?.id === pending.itemId) ? pending : undefined;
  const chargedId = selection?.checkout?.shippingMethod?.id;
  const shippingMethods = [...(selection?.checkout?.shippingMethods ?? [])]
    .sort((a, b) => Number(b.selected ?? b.id === chargedId) - Number(a.selected ?? a.id === chargedId))
    .map((method) => ({ id: String(method.id), name: method.name, value: method.price.value }));

  return {
    currency,
    lines: added ? [...lines, { name: added.name, value: added.price }] : lines,
    shippingMethods,
    total: (selection?.grandTotal.value ?? 0) + (added?.price ?? 0),
  };
}
