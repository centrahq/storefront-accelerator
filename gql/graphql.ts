/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTimeTz: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Map: { input: any; output: any; }
};

export type AddItemPayload = Payload & SelectionMutationPayload & {
  line?: Maybe<Line>;
  selection?: Maybe<Selection>;
  userErrors: Array<UserError>;
};


export type AddItemPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type Address = {
  address1?: Maybe<Scalars['String']['output']>;
  address2?: Maybe<Scalars['String']['output']>;
  attention?: Maybe<Scalars['String']['output']>;
  cellPhoneNumber?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Country>;
  email?: Maybe<Scalars['String']['output']>;
  faxNumber?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  state?: Maybe<CountryState>;
  stateOrProvince?: Maybe<Scalars['String']['output']>;
  vatNumber?: Maybe<Scalars['String']['output']>;
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type AddressField = {
  key: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  visible: Scalars['Boolean']['output'];
};

export type AddressFieldList = {
  newsletter: CheckboxAddressField;
  separateBillingAddress: Array<AddressField>;
  shippingAddress: Array<AddressField>;
  termsAndConditions: CheckboxAddressField;
};


export type AddressFieldListSeparateBillingAddressArgs = {
  sort?: InputMaybe<Array<AddressSortKey>>;
};


export type AddressFieldListShippingAddressArgs = {
  sort?: InputMaybe<Array<AddressSortKey>>;
};

export type AddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  attention?: InputMaybe<Scalars['String']['input']>;
  cellPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['String']['input'];
  email?: InputMaybe<Scalars['String']['input']>;
  faxNumber?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  stateOrProvince?: InputMaybe<Scalars['String']['input']>;
  vatNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export enum AddressSortKey {
  Address1 = 'ADDRESS1',
  Address2 = 'ADDRESS2',
  City = 'CITY',
  Company = 'COMPANY',
  Country = 'COUNTRY',
  Email = 'EMAIL',
  Firstname = 'FIRSTNAME',
  HouseExtension = 'HOUSE_EXTENSION',
  HouseNumber = 'HOUSE_NUMBER',
  IdentityNumber = 'IDENTITY_NUMBER',
  Lastname = 'LASTNAME',
  PhoneNumber = 'PHONE_NUMBER',
  State = 'STATE',
  VatNumber = 'VAT_NUMBER',
  Zipcode = 'ZIPCODE'
}

export type Affiliate = {
  name: Scalars['String']['output'];
  sendToPage: Scalars['String']['output'];
  uri: Scalars['String']['output'];
};

export type AffiliateList = Payload & {
  list: Array<Affiliate>;
  pagination: PaginationInfo;
  userErrors: Array<UserError>;
};

export enum AffiliateSort {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export type AffiliateUriLookupPayload = Payload & UriLookupPayload & {
  affiliate: Affiliate;
  found: UriLookupType;
  /** Required [operating mode](#operating-mode): `SESSION` */
  selection?: Maybe<Selection>;
  userErrors: Array<UserError>;
};


export type AffiliateUriLookupPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export enum AppliedActionType {
  FreeProductAdded = 'FREE_PRODUCT_ADDED',
  FreeShipping = 'FREE_SHIPPING'
}

export type AppliedCampaignPercent = AppliedPromotion & {
  percent?: Maybe<Scalars['Float']['output']>;
  type: AppliedPromotionType;
  value: MonetaryValue;
};

export type AppliedLineItemVoucher = AppliedPromotion & {
  name: Scalars['String']['output'];
  percent?: Maybe<Scalars['Float']['output']>;
  type: AppliedPromotionType;
  value: MonetaryValue;
};

export type AppliedPromotion = {
  percent?: Maybe<Scalars['Float']['output']>;
  type: AppliedPromotionType;
  value: MonetaryValue;
};

export enum AppliedPromotionType {
  Campaign = 'CAMPAIGN',
  Voucher = 'VOUCHER'
}

export type ApplyGiftCardInput = {
  cardNumber: Scalars['String']['input'];
  pin?: InputMaybe<Scalars['String']['input']>;
};

export enum AttentionReason {
  /** Selected variant is no longer purchasable. */
  NotPurchasable = 'NOT_PURCHASABLE',
  /** Selected market is not available or not suitable for delivery country. */
  NoMarket = 'NO_MARKET',
  /** Selected shipping is not available. */
  NoShipping = 'NO_SHIPPING',
  /** Selected item is out of stock. */
  OutOfStock = 'OUT_OF_STOCK',
  /**
   * Payment has failed but future attempts might succeed.
   *
   * This might happen when card has insufficient funds.
   */
  PaymentDeclined = 'PAYMENT_DECLINED',
  /** The payment method associated with this subscription is no longer valid and will not become valid without on-session customer interaction (eg. providing a new card details). */
  PaymentRevoked = 'PAYMENT_REVOKED',
  /** Reasons for this subscriptions failing are unknown and should undergo investigation. */
  Unknown = 'UNKNOWN'
}

export type Attribute = {
  elements: Array<AttributeElement>;
  type: AttributeType;
};

export type AttributeChoiceElement = AttributeElement & {
  key: Scalars['String']['output'];
  kind: AttributeElementKind;
  value: ChoiceValue;
  values: Array<ChoiceValue>;
};

export type AttributeElement = {
  key: Scalars['String']['output'];
  kind: AttributeElementKind;
};

export enum AttributeElementKind {
  Boolean = 'BOOLEAN',
  File = 'FILE',
  Image = 'IMAGE',
  Input = 'INPUT',
  Readonly = 'READONLY',
  Select = 'SELECT',
  Textarea = 'TEXTAREA'
}

export type AttributeFileElement = AttributeElement & {
  key: Scalars['String']['output'];
  kind: AttributeElementKind;
  url?: Maybe<Scalars['String']['output']>;
};

export type AttributeImageElement = AttributeElement & {
  height?: Maybe<Scalars['Int']['output']>;
  key: Scalars['String']['output'];
  kind: AttributeElementKind;
  mimeType?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

export type AttributeStringElement = AttributeElement & {
  key: Scalars['String']['output'];
  kind: AttributeElementKind;
  translations?: Maybe<Array<AttributeStringElementTranslation>>;
  value: Scalars['String']['output'];
};

export type AttributeStringElementInput = {
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type AttributeStringElementTranslation = {
  language: Language;
  value?: Maybe<Scalars['String']['output']>;
};

export type AttributeType = {
  isMulti: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type AutoVoucher = Voucher & {
  actions: Array<VoucherAction>;
  appliedOn: Array<VoucherAppliedOn>;
  attributes: Array<Attribute>;
  expiryDate: Scalars['String']['output'];
  giftCard?: Maybe<GiftCard>;
  id: Scalars['Int']['output'];
  isExternal: Scalars['Boolean']['output'];
  lineIds: Array<Scalars['String']['output']>;
  method: VoucherMethod;
  name: Scalars['String']['output'];
  orderReduction: MonetaryValue;
  totalItemReduction: MonetaryValue;
  totalShippingReduction: MonetaryValue;
  type: VoucherType;
  value: MonetaryValue;
};

export type BackInStockSubscribeInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  item: Scalars['String']['input'];
  languageCode?: InputMaybe<Scalars['String']['input']>;
  shipTo: CountryStateInput;
};

export type Brand = {
  id: Scalars['Int']['output'];
  markets: Array<Market>;
  metaDescription: Scalars['String']['output'];
  metaKeywords: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  pricelists: Array<Pricelist>;
  uri: Scalars['String']['output'];
};

export type BrandFilterValue = FilterValue & {
  active: Scalars['Boolean']['output'];
  brand?: Maybe<Brand>;
  /** Number of matches with the current filtering. */
  count: Scalars['Int']['output'];
  /** Number of matches with the current filtering when you discount the other selected values in this group. */
  filterCount: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** The number of items in total available, independent of filtering. */
  totalCount: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type BrandList = Payload & {
  list: Array<Brand>;
  pagination: PaginationInfo;
  userErrors: Array<UserError>;
};

export enum BrandSort {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export type BrickAndMortar = {
  address: Scalars['String']['output'];
  country?: Maybe<Country>;
  distance?: Maybe<Distance>;
  id: Scalars['Int']['output'];
  latitude: Scalars['String']['output'];
  longitude: Scalars['String']['output'];
  name: Scalars['String']['output'];
  openingDays: Array<OpeningDay>;
  state?: Maybe<CountryState>;
  type: BrickAndMortarType;
  website?: Maybe<Scalars['String']['output']>;
};


export type BrickAndMortarDistanceArgs = {
  unit?: DistanceUnit;
};

export type BrickAndMortarList = {
  list: Array<BrickAndMortar>;
  pagination?: Maybe<PaginationInfo>;
  userErrors: Array<UserError>;
};

export type BrickAndMortarListFilter = {
  countryCode?: InputMaybe<Scalars['String']['input']>;
  /** The user's location in latitude / longitude. */
  location?: InputMaybe<GeoPositionInput>;
  maxDistance?: InputMaybe<MaxDistance>;
  stateCode?: InputMaybe<Scalars['String']['input']>;
};

export enum BrickAndMortarSort {
  DistanceAsc = 'distance_ASC',
  DistanceDesc = 'distance_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export enum BrickAndMortarType {
  FranchiseOrPartner = 'FRANCHISE_OR_PARTNER',
  MultiBrandRetailer = 'MULTI_BRAND_RETAILER',
  OwnStore = 'OWN_STORE'
}

export type Bundle = {
  id: Scalars['Int']['output'];
  /**
   * The maximum possible price available for a flexible bundle with dynamic price
   * Will be null if the bundle is fixed or has a static price.
   */
  maxPrice?: Maybe<MonetaryValue>;
  /**
   * The maximum possible prices available for a flexible bundle with dynamic price.
   * Will be null if the bundle is fixed or has a static price.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  maxPriceByPricelist: Array<PricelistPrice>;
  /**
   * The minimum possible price available for a flexible bundle with dynamic price
   * Will be null if the bundle is fixed or has a static price.
   */
  minPrice?: Maybe<MonetaryValue>;
  /**
   * The minimum possible prices available for a flexible bundle with dynamic price
   * Will be null if the bundle is fixed or has a static price.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  minPriceByPricelist: Array<PricelistPrice>;
  priceType: BundlePriceType;
  sections: Array<BundleSection>;
  type: BundleType;
};


export type BundleMaxPriceByPricelistArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type BundleMinPriceByPricelistArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type BundleLine = Line & {
  addedFromCategory?: Maybe<Category>;
  appliedPromotions: Array<AppliedPromotion>;
  brand?: Maybe<Brand>;
  bundle?: Maybe<SelectionBundle>;
  comment: Scalars['String']['output'];
  discountPercent: Scalars['Float']['output'];
  displayItem: DisplayItem;
  hasDiscount: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  item: Item;
  lineValue: MonetaryValue;
  localizedSize?: Maybe<LocalizedProdSize>;
  name: Scalars['String']['output'];
  originalLineValue: MonetaryValue;
  productExternalUrl?: Maybe<Scalars['String']['output']>;
  productNumber: Scalars['String']['output'];
  productVariantName: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  size: Scalars['String']['output'];
  subscriptionId?: Maybe<Scalars['Int']['output']>;
  taxPercent: Scalars['Float']['output'];
  unitOriginalPrice: MonetaryValue;
  unitPrice: MonetaryValue;
  unitPriceReduction: MonetaryValue;
};


export type BundleLineLineValueArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type BundleLineOriginalLineValueArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type BundleLineUnitOriginalPriceArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type BundleLineUnitPriceArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type BundleLineUnitPriceReductionArgs = {
  includingTax?: Scalars['Boolean']['input'];
};

export enum BundlePriceType {
  Dynamic = 'DYNAMIC',
  Static = 'STATIC'
}

export type BundleSection = {
  id: Scalars['Int']['output'];
  items: Array<DisplayItem>;
  quantity: Scalars['Int']['output'];
};

export type BundleSectionInput = {
  item: Scalars['String']['input'];
  sectionId: Scalars['Int']['input'];
};

export enum BundleType {
  Fixed = 'FIXED',
  Flexible = 'FLEXIBLE'
}

export enum Captcha_Call_Type {
  CustomerLogin = 'CUSTOMER_LOGIN',
  CustomerRegistration = 'CUSTOMER_REGISTRATION',
  GiftCert = 'GIFT_CERT',
  Newsletter = 'NEWSLETTER',
  Payment = 'PAYMENT',
  Voucher = 'VOUCHER'
}

export type CampaignInfo = {
  attributes: Array<Attribute>;
  endDateDateTime: Scalars['String']['output'];
  showNew: Scalars['Boolean']['output'];
  showSale: Scalars['Boolean']['output'];
  startDateTime: Scalars['String']['output'];
};


export type CampaignInfoAttributesArgs = {
  keys?: Array<Scalars['String']['input']>;
};

export type CampaignSite = {
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  market: Market;
  name?: Maybe<Scalars['String']['output']>;
  sendToPage?: Maybe<Scalars['String']['output']>;
  uri: Scalars['String']['output'];
};

export type CampaignSiteList = Payload & {
  list: Array<CampaignSite>;
  pagination: PaginationInfo;
  userErrors: Array<UserError>;
};

export enum CampaignSiteSort {
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export type CampaignSiteUriLookupPayload = Payload & UriLookupPayload & {
  campaignSite: CampaignSite;
  found: UriLookupType;
  /** Required [operating mode](#operating-mode): `SESSION` */
  selection?: Maybe<Selection>;
  userErrors: Array<UserError>;
};


export type CampaignSiteUriLookupPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type CaptchaVerifyPayload = Payload & {
  userErrors: Array<UserError>;
  verified: Scalars['Boolean']['output'];
};

export type Category = {
  attributes: Array<Attribute>;
  childCategories: Array<Category>;
  id: Scalars['Int']['output'];
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  markets: Array<Market>;
  metaDescription: Scalars['String']['output'];
  metaKeywords: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  name?: Maybe<Array<Scalars['String']['output']>>;
  parentCategory?: Maybe<Category>;
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  pricelists: Array<Pricelist>;
  sortOrder: Scalars['Int']['output'];
  translations: Array<TranslatedCategory>;
  uri: Scalars['String']['output'];
};


export type CategoryAttributesArgs = {
  keys?: Array<Scalars['String']['input']>;
};


export type CategoryChildCategoriesArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  sort?: Array<CategorySort>;
};

export type CategoryFilterValue = FilterValue & {
  active: Scalars['Boolean']['output'];
  category: Category;
  /** Number of matches with the current filtering. */
  count: Scalars['Int']['output'];
  /** Number of matches with the current filtering when you discount the other selected values in this group. */
  filterCount: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** The number of items in total available, independent of filtering. */
  totalCount: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type CategoryItemList = {
  displayItems?: Maybe<Array<DisplayItem>>;
  filters?: Maybe<Array<FilterOption>>;
  pagination: PaginationInfo;
};

export type CategoryList = {
  list: Array<Category>;
  pagination: PaginationInfo;
  userErrors: Array<UserError>;
};

export enum CategorySort {
  CustomOrderAsc = 'customOrder_ASC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export type CategoryUriLookupPayload = Payload & UriLookupPayload & {
  category: Category;
  displayItemList: CategoryItemList;
  found: UriLookupType;
  userErrors: Array<UserError>;
};

export type CheckboxAddressField = AddressField & {
  key: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  visible: Scalars['Boolean']['output'];
};

export type CheckoutSelection = {
  addressFields: AddressFieldList;
  checkoutScript?: Maybe<Scalars['String']['output']>;
  deliveryGroups: Array<SelectionDeliveryGroup>;
  hasSeparateBillingAddress: Scalars['Boolean']['output'];
  paymentMethod?: Maybe<PaymentMethod>;
  paymentMethods: Array<PaymentMethod>;
  separateBillingAddress?: Maybe<Address>;
  shippingAddress: Address;
  shippingMethod?: Maybe<ShippingMethod>;
  shippingMethods?: Maybe<Array<ShippingMethod>>;
  totals: Array<SelectionTotalRow>;
  widgets?: Maybe<Array<Widget>>;
};


export type CheckoutSelectionPaymentMethodsArgs = {
  sort?: InputMaybe<Array<PaymentMethodKind>>;
};

export type ChoiceValue = {
  name: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ClientDetails = {
  browserLanguage?: InputMaybe<Scalars['String']['input']>;
  ip?: InputMaybe<Scalars['String']['input']>;
  userAgent?: InputMaybe<Scalars['String']['input']>;
};

export type CodeVoucher = Voucher & {
  actions: Array<VoucherAction>;
  appliedOn: Array<VoucherAppliedOn>;
  attributes: Array<Attribute>;
  code: Scalars['String']['output'];
  expiryDate: Scalars['String']['output'];
  giftCard?: Maybe<GiftCard>;
  isExternal: Scalars['Boolean']['output'];
  lineIds: Array<Scalars['String']['output']>;
  method: VoucherMethod;
  name: Scalars['String']['output'];
  orderReduction: MonetaryValue;
  totalItemReduction: MonetaryValue;
  totalShippingReduction: MonetaryValue;
  type: VoucherType;
  value: MonetaryValue;
};

export type Collection = {
  id: Scalars['Int']['output'];
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  markets: Array<Market>;
  name: Scalars['String']['output'];
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  pricelists: Array<Pricelist>;
  uri: Scalars['String']['output'];
};

export type CollectionFilterValue = FilterValue & {
  active: Scalars['Boolean']['output'];
  collection?: Maybe<Collection>;
  /** Number of matches with the current filtering. */
  count: Scalars['Int']['output'];
  /** Number of matches with the current filtering when you discount the other selected values in this group. */
  filterCount: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** The number of items in total available, independent of filtering. */
  totalCount: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type CollectionList = Payload & {
  list: Array<Collection>;
  pagination: PaginationInfo;
  userErrors: Array<UserError>;
};

export enum CollectionSort {
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  NameAsc = 'name_ASC',
  NameDesc = 'name_DESC'
}

export type ConsentInput = {
  consented: Scalars['Boolean']['input'];
  data: Scalars['String']['input'];
  key: Scalars['String']['input'];
  languageCode?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  version: Scalars['String']['input'];
};

export type Country = {
  code: Scalars['String']['output'];
  defaultLanguage?: Maybe<Language>;
  isEU: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  shipTo: Scalars['Boolean']['output'];
  states?: Maybe<Array<CountryState>>;
  translations: Array<TranslatedCountry>;
};

export type CountryAddressField = AddressField & {
  choices: Array<Country>;
  key: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  selected?: Maybe<Country>;
  visible: Scalars['Boolean']['output'];
};

export type CountryInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
};

export type CountryState = {
  code: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type CountryStateInput = {
  countryCode: Scalars['String']['input'];
  stateCode?: InputMaybe<Scalars['String']['input']>;
};

export type Currency = {
  code: Scalars['String']['output'];
  currentBaseRate: Scalars['Float']['output'];
  decimalDigits: Scalars['Int']['output'];
  decimalPoint: Scalars['String']['output'];
  denominator: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  isoNumber: Scalars['String']['output'];
  name: Scalars['String']['output'];
  prefix?: Maybe<Scalars['String']['output']>;
  suffix?: Maybe<Scalars['String']['output']>;
  thousandsSeparator: Scalars['String']['output'];
};

export type CustomAttributeInput = {
  dynamicAttributes?: InputMaybe<Array<DynamicAttributeInput>>;
  mappedAttributes?: InputMaybe<Array<MappedAttributeInput>>;
};

export type CustomSortInput = {
  key: SortKey;
  order: SortOrder;
};

export type Customer = {
  attributes: Array<Attribute>;
  billingAddress?: Maybe<Address>;
  /** Required permission: `customer.birthdate` */
  birthdate?: Maybe<Scalars['Date']['output']>;
  cellPhoneNumber?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  /** Required permission: `customer.gender` */
  gender?: Maybe<Gender>;
  id: Scalars['Int']['output'];
  language?: Maybe<Language>;
  lastName?: Maybe<Scalars['String']['output']>;
  newsletterSubscriptions: Array<NewsletterSubscription>;
  orders: Array<Order>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  subscriptionContracts: Array<SubscriptionContract>;
  totalOrders: Scalars['Int']['output'];
  websiteUrl?: Maybe<Scalars['String']['output']>;
  wishlists: Array<Wishlist>;
};


export type CustomerBirthdateArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};


export type CustomerOrdersArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};


export type CustomerWishlistsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type CustomerClubSpecificFields = {
  voyadoCustomerId?: InputMaybe<Scalars['String']['input']>;
  voyadoPromotionId?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerRegisterAddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  cellPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  faxNumber?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  stateOrProvince?: InputMaybe<Scalars['String']['input']>;
  vatNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerRegisterInput = {
  billingAddress: CustomerRegisterAddressInput;
  consents?: InputMaybe<Array<ConsentInput>>;
  customAttributes?: InputMaybe<CustomAttributeInput>;
  gender?: InputMaybe<Gender>;
  loginOnSuccess: Scalars['Boolean']['input'];
  password: Scalars['String']['input'];
};

export type CustomerRegisterPayload = Payload & {
  loggedIn?: Maybe<Customer>;
  userErrors: Array<UserError>;
};

export type CustomerUpdateAddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  cellPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  faxNumber?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  stateOrProvince?: InputMaybe<Scalars['String']['input']>;
  vatNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerUpdateInput = {
  billingAddress?: InputMaybe<CustomerUpdateAddressInput>;
  consents?: InputMaybe<Array<ConsentInput>>;
  customAttributes?: InputMaybe<CustomAttributeInput>;
  gender?: InputMaybe<Gender>;
  password?: InputMaybe<PasswordUpdateInput>;
};

export type CustomerUpdatePayload = Payload & {
  customer: Customer;
  userErrors: Array<UserError>;
};

export type DateInterval = {
  type: DateIntervalType;
  value: Scalars['Int']['output'];
};

export enum DateIntervalType {
  Day = 'DAY',
  Month = 'MONTH',
  Week = 'WEEK',
  Year = 'YEAR'
}

export type DeliveryGroup = {
  attributes: Array<Attribute>;
  externalDeliveryGroupId?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  lines: Array<DeliveryGroupLine>;
  name?: Maybe<Scalars['String']['output']>;
  shippingMethod: ShippingMethod;
  shippingPrice: MonetaryValue;
};

export type DeliveryGroupLine = {
  line: Line;
  quantity: Scalars['Int']['output'];
};

export type DisplayItem = {
  attributes: Array<Attribute>;
  available: Scalars['Boolean']['output'];
  brand?: Maybe<Brand>;
  bundle?: Maybe<Bundle>;
  campaignInfo?: Maybe<CampaignInfo>;
  canonicalCategory?: Maybe<Category>;
  canonicalUri: Scalars['String']['output'];
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  categories?: Maybe<Array<Category>>;
  category?: Maybe<Category>;
  collection?: Maybe<Collection>;
  /** Required permission: `displayItem.countryOfOrigin` */
  countryOfOrigin?: Maybe<Country>;
  createdAt: Scalars['String']['output'];
  description: FormattedString;
  hasStock: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  isPrimaryVariant: Scalars['Boolean']['output'];
  items: Array<Item>;
  /** Required [operating mode](#operating-mode): `SESSION` */
  language?: Maybe<Language>;
  languages: Array<Language>;
  lowestPrice?: Maybe<LowestPrice>;
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  lowestPriceByPricelist: Array<PricelistLowestPrice>;
  /** Required [operating mode](#operating-mode): `SESSION` */
  market: Market;
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  markets: Array<Market>;
  measurementTable?: Maybe<MeasurementTable>;
  media: Array<ProductMedia>;
  metaDescription: Scalars['String']['output'];
  metaKeywords: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  minimumOrderQuantity: Scalars['Int']['output'];
  modifiedAt: Scalars['String']['output'];
  name: Scalars['String']['output'];
  orderQuantityDenominator: Scalars['Int']['output'];
  originalPrice?: Maybe<MonetaryValue>;
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  preview: Scalars['Boolean']['output'];
  /**
   * Price with current market and pricelist, either from session or if _one_ market and pricelist is provided in no session.
   *
   * For dynamically priced flexible bundles, price will be null since there is a range of possible prices depending on the sections when added to cart.
   *
   * minPrice and maxPrice can be found under `bundle`.
   */
  price?: Maybe<MonetaryValue>;
  /**
   * For dynamically priced flexible bundles priceByPricelist will be empty, since there is a range of possible prices depending on the sections when added to cart. minPriceByPricelist and maxPriceByPricelist can be found under `bundle`.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  priceByPricelist: Array<PricelistPrice>;
  /** Required [operating mode](#operating-mode): `SESSION` */
  pricelist: Pricelist;
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  pricelists: Array<Pricelist>;
  primaryVariant?: Maybe<DisplayItem>;
  productNumber: Scalars['String']['output'];
  productVariant: ProductVariant;
  relatedDisplayItems: Array<RelatedDisplayItems>;
  shortDescription: FormattedString;
  showAsNew: Scalars['Boolean']['output'];
  showAsSale: Scalars['Boolean']['output'];
  sizeChart: SizeChart;
  subscriptionPlans: Array<SubscriptionPlan>;
  translations: Array<TranslatedDisplayItem>;
  uri: Scalars['String']['output'];
  weight: Scalars['Float']['output'];
  weightUnit: Scalars['String']['output'];
};


export type DisplayItemAttributesArgs = {
  keys?: Array<Scalars['String']['input']>;
};


export type DisplayItemRelatedDisplayItemsArgs = {
  relationType?: Array<Scalars['String']['input']>;
};

export type DisplayItemFilter = {
  filters?: InputMaybe<Array<FilterInput>>;
  id?: InputMaybe<Array<Scalars['Int']['input']>>;
  onlyAvailable?: Scalars['Boolean']['input'];
  /**
   * When true, limits results to only the primary variant of each display.
   * Primary variant is defined as the first display variant.
   *
   * When false (default), all product variants are included in results.
   */
  onlyPrimaryVariant?: Scalars['Boolean']['input'];
  /** Input for full-text search query. */
  search?: InputMaybe<Scalars['String']['input']>;
  /** Fields to include in full-text search. */
  searchInFields?: Array<SearchField>;
};

export type DisplayItemList = Payload & {
  filters?: Maybe<Array<FilterOption>>;
  list?: Maybe<Array<DisplayItem>>;
  pagination: PaginationInfo;
  userErrors: Array<UserError>;
};


export type DisplayItemListFiltersArgs = {
  keys?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DisplayItemUriLookupPayload = Payload & UriLookupPayload & {
  displayItem: DisplayItem;
  found: UriLookupType;
  userErrors: Array<UserError>;
};

export type Distance = {
  unit: DistanceUnit;
  value: Scalars['Float']['output'];
};

export enum DistanceUnit {
  Kilometer = 'KILOMETER',
  Meter = 'METER',
  Mile = 'MILE'
}

export type DynamicAttribute = Attribute & {
  elements: Array<AttributeElement>;
  type: AttributeType;
};

export type DynamicAttributeInput = {
  attributeElementKey: Scalars['String']['input'];
  attributeElementValue: Scalars['String']['input'];
  attributeTypeName: Scalars['String']['input'];
};

export type DynamicSelectionAttributeSetInput = {
  attributeElementKey: Scalars['String']['input'];
  attributeElementValue: Scalars['String']['input'];
  attributeTypeName: Scalars['String']['input'];
};

export type DynamicSelectionAttributeUnsetInput = {
  attributeElementKey: Scalars['String']['input'];
  attributeTypeName: Scalars['String']['input'];
};

export type ExpressCheckoutWidget = {
  contents: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type ExpressCheckoutWidgetsAdditionalData = {
  amount: Scalars['Int']['input'];
  lineItems: Array<ExpressCheckoutWidgetsLineItem>;
  returnUrl: Scalars['String']['input'];
};

export type ExpressCheckoutWidgetsLineItem = {
  name: Scalars['String']['input'];
  price: Scalars['String']['input'];
};

export type ExpressCheckoutWidgetsPayload = Payload & {
  list?: Maybe<Array<ExpressCheckoutWidgetsPluginWidgets>>;
  userErrors: Array<UserError>;
};

export type ExpressCheckoutWidgetsPluginItem = {
  additionalData: ExpressCheckoutWidgetsAdditionalData;
  uri: Scalars['String']['input'];
};

export type ExpressCheckoutWidgetsPluginWidgets = {
  name: Scalars['String']['output'];
  widgets: Array<ExpressCheckoutWidget>;
};

export type FilterInput = {
  /** Filter key from `FilterOption.key` */
  key: Scalars['String']['input'];
  /** Filter values from `FilterOption.values` */
  values: Array<Scalars['String']['input']>;
};

export type FilterOption = {
  anyAvailable: Scalars['Boolean']['output'];
  key: Scalars['String']['output'];
  selectedValues: Array<Scalars['String']['output']>;
  values: Array<FilterValue>;
};

export type FilterValue = {
  active: Scalars['Boolean']['output'];
  /** Number of matches with the current filtering. */
  count: Scalars['Int']['output'];
  /** Number of matches with the current filtering when you discount the other selected values in this group. */
  filterCount: Scalars['Int']['output'];
  /** The number of items in total available, independent of filtering. */
  totalCount: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type FormPaymentAction = PaymentAction & {
  action: PaymentActionType;
  expressHtml?: Maybe<Array<ExpressCheckoutWidget>>;
  formFields?: Maybe<Scalars['Map']['output']>;
  formType: Scalars['String']['output'];
  html: Scalars['String']['output'];
};

export type FormattedString = {
  formatted: Scalars['String']['output'];
  raw: Scalars['String']['output'];
};

export type FreeProductAddedAction = VoucherAction & {
  allowAddMore: Scalars['Boolean']['output'];
  allowRemove: Scalars['Boolean']['output'];
  lineId: Scalars['String']['output'];
  type: AppliedActionType;
};

export type FreeShippingAction = VoucherAction & {
  shippingMethods: Array<Scalars['Int']['output']>;
  type: AppliedActionType;
};

export type FulfillmentCheckPayload = Payload & {
  availableInBrickAndMortars: Array<Scalars['Int']['output']>;
  userErrors: Array<UserError>;
};

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Unknown = 'UNKNOWN'
}

export type GenericSelectionMutationPayload = Payload & SelectionMutationPayload & {
  selection?: Maybe<Selection>;
  userErrors: Array<UserError>;
};


export type GenericSelectionMutationPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type GeoPositionInput = {
  latitude: Scalars['String']['input'];
  longitude: Scalars['String']['input'];
};

export type GiftCard = {
  lastFourDigits: Scalars['String']['output'];
};

export type IngridWidget = Widget & {
  deliveryOptionsAvailable: Scalars['Boolean']['output'];
  ingridAttributes?: Maybe<Array<Scalars['String']['output']>>;
  kind: WidgetKind;
  reload: Scalars['Boolean']['output'];
  sessionId: Scalars['String']['output'];
  snippet: Scalars['String']['output'];
};

export type Item = {
  GTIN: Scalars['String']['output'];
  horizontalLabelIndex: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  preorder: Scalars['Boolean']['output'];
  productSizeId: Scalars['Int']['output'];
  sizeLocalization: Array<LocalizedSize>;
  sku: Scalars['String']['output'];
  stock: Stock;
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  stockByWarehouse: Array<WarehouseStock>;
  verticalLabelIndex: Scalars['Int']['output'];
};

export type JavascriptPaymentAction = PaymentAction & {
  action: PaymentActionType;
  formFields?: Maybe<Scalars['Map']['output']>;
  formType: Scalars['String']['output'];
  script: Scalars['String']['output'];
};

export type KlarnaCheckoutWidget = Widget & {
  kind: WidgetKind;
  replaceSnippet: Scalars['Boolean']['output'];
};

export type KlarnaPaymentWidget = Widget & {
  authorizePayload?: Maybe<Scalars['Map']['output']>;
  client_token: Scalars['String']['output'];
  kind: WidgetKind;
  replace_snippet: Scalars['Boolean']['output'];
};

export type Language = {
  code: Scalars['String']['output'];
  /** [ISO-3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) */
  countryCode?: Maybe<Scalars['String']['output']>;
  default: Scalars['Boolean']['output'];
  /** [ISO-639-1](https://en.wikipedia.org/wiki/ISO_639-1) code */
  languageCode?: Maybe<Scalars['String']['output']>;
  /** [ISO-639](https://en.wikipedia.org/wiki/ISO_639-1) name */
  languageName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};


export type LanguageNameArgs = {
  locale?: InputMaybe<Scalars['String']['input']>;
};

export type Line = {
  addedFromCategory?: Maybe<Category>;
  appliedPromotions: Array<AppliedPromotion>;
  brand?: Maybe<Brand>;
  comment: Scalars['String']['output'];
  discountPercent: Scalars['Float']['output'];
  displayItem: DisplayItem;
  hasDiscount: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  item: Item;
  lineValue: MonetaryValue;
  localizedSize?: Maybe<LocalizedProdSize>;
  name: Scalars['String']['output'];
  originalLineValue: MonetaryValue;
  productExternalUrl?: Maybe<Scalars['String']['output']>;
  productNumber: Scalars['String']['output'];
  productVariantName: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  size: Scalars['String']['output'];
  subscriptionId?: Maybe<Scalars['Int']['output']>;
  taxPercent: Scalars['Float']['output'];
  unitOriginalPrice: MonetaryValue;
  unitPrice: MonetaryValue;
  unitPriceReduction: MonetaryValue;
};


export type LineLineValueArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type LineOriginalLineValueArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type LineUnitOriginalPriceArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type LineUnitPriceArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type LineUnitPriceReductionArgs = {
  includingTax?: Scalars['Boolean']['input'];
};

export type LocalizedProdSize = {
  localizationDefinitionName: Scalars['String']['output'];
  localizedSize: Scalars['String']['output'];
};

export type LocalizedProdSizeInput = {
  localizationDefinitionName: Scalars['String']['input'];
  localizedSize: Scalars['String']['input'];
};

export type LocalizedSize = {
  countries: Array<Country>;
  displayName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type LocalizedSizeChart = {
  countries: Array<Country>;
  displayName: Scalars['String']['output'];
  horizontalLabels: Array<Scalars['String']['output']>;
  verticalLabels: Array<Scalars['String']['output']>;
};

export type LoginOptions = {
  /**
   * If set to `true`, `applyCustomerMarket` will change the current `Selection` and `Session` to use the market specified on the customer.
   * The market will only be changed if the customer has a non-geolocated market assigned.
   */
  applyCustomerMarket?: Scalars['Boolean']['input'];
};

export type LoginPayload = Payload & {
  loggedIn?: Maybe<Customer>;
  selection: Selection;
  session: Session;
  userErrors: Array<UserError>;
};


export type LoginPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type LogoutPayload = {
  selection: Selection;
  session: Session;
};


export type LogoutPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type LowestPrice = {
  originalPrice: MonetaryValue;
  periodDays: Scalars['Int']['output'];
  price: MonetaryValue;
};

export type LowestPriceBase = LowestPrice & {
  originalPrice: MonetaryValue;
  periodDays: Scalars['Int']['output'];
  price: MonetaryValue;
};

export type MappedAttribute = Attribute & {
  elements: Array<AttributeElement>;
  id: Scalars['Int']['output'];
  type: AttributeType;
};

export type MappedAttributeFilterValue = FilterValue & {
  active: Scalars['Boolean']['output'];
  attribute: MappedAttribute;
  /** Number of matches with the current filtering. */
  count: Scalars['Int']['output'];
  /** Number of matches with the current filtering when you discount the other selected values in this group. */
  filterCount: Scalars['Int']['output'];
  /** The number of items in total available, independent of filtering. */
  totalCount: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type MappedAttributeInput = {
  attributeId: Scalars['Int']['input'];
  attributeTypeName: Scalars['String']['input'];
};

export type MappedSelectionAttributeSetInput = {
  attributeId: Scalars['Int']['input'];
};

export type MappedSelectionAttributeUnsetInput = {
  attributeId: Scalars['Int']['input'];
};

export type Market = {
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  countries?: Maybe<Array<Country>>;
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  hasCampaignSite: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type MarketLowestPrice = LowestPrice & {
  markets: Array<Scalars['Int']['output']>;
  originalPrice: MonetaryValue;
  periodDays: Scalars['Int']['output'];
  price: MonetaryValue;
};

export type MarketPrice = {
  campaignInfo?: Maybe<CampaignInfo>;
  hasDiscount: Scalars['Boolean']['output'];
  markets: Array<Scalars['Int']['output']>;
  originalPrice: MonetaryValue;
  price: MonetaryValue;
};

export type MaxDistance = {
  maxDistance: Scalars['Float']['input'];
  maxDistanceUnit: DistanceUnit;
};

export type MeasurementTable = {
  displayUnit: Scalars['String']['output'];
  horizontalLabels: Array<Scalars['String']['output']>;
  values: Array<Maybe<Array<Scalars['String']['output']>>>;
  verticalLabels: Array<Scalars['String']['output']>;
};

export type MediaSize = {
  maxHeight?: Maybe<Scalars['Int']['output']>;
  maxWidth?: Maybe<Scalars['Int']['output']>;
  mimeType?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  quality?: Maybe<Scalars['Int']['output']>;
};

export type MediaSource = {
  mediaSize: MediaSize;
  mimeType?: Maybe<Scalars['String']['output']>;
  type: MediaType;
  url: Scalars['String']['output'];
};

export enum MediaType {
  Image = 'IMAGE'
}

export type MonetaryValue = {
  currency: Currency;
  formattedValue: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type Mutation = {
  /**
   * Add flexible bundle to the current selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  addFlexibleBundle: AddItemPayload;
  /**
   * Add display item or fixed bundle to the current selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  addItem: AddItemPayload;
  /**
   * Add a subscription to an existing subscription contract.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  addSubscription: SubscriptionContractPayload;
  /**
   * Add a code voucher to the current selection.
   *
   * Can be protected by captcha.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  addVoucher: SelectionMutationPayload;
  /**
   * Apply a gift card on the current selection.
   *
   * Possible Error Codes:
   *
   * * `internal_error`- An internal issue not directly related to the shopper.
   * * `invalid_input`- A validation error, such as the gift card not existing or an incorrect PIN being provided.
   * * `inactive_card`- The gift card being used is either inactive or expired.
   * * `insufficient_funds`- The gift card does not have sufficient funds.
   * * `invalid_gift_card_currency`- The gift card’s currency does not match the current currency of the selection.
   * * `empty_card_balance`- The gift card balance is zero.
   *
   * Can be protected by captcha.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  applyGiftCard: SelectionMutationPayload;
  /**
   * Change the subscription contract address.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  changeSubscriptionContractAddress: SubscriptionContractPayload;
  /**
   * Claim a selection from a purchase link.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  claimSelection: SelectionMutationPayload;
  /**
   * Delete selection line by its id.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  deleteLine: SelectionMutationPayload;
  /**
   * Finalize the recurring payment process by send all variables received to paymentReturnPage.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  handleStoredPaymentResult: StoredPaymentResultPayload;
  /**
   * Handle event triggered by widget.
   *
   * Provided values are passed to the plugins that supports them.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  handleWidgetEvent: SelectionMutationPayload;
  /**
   * Initiate the recurring payment process for the provided subscription contracts.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  initializeStoredPaymentInstructions: StoredPaymentInstructionsPayload;
  /**
   * Login as the customer in the current session.
   *
   * The current selection is merged with the selection associated with the customer.
   *
   * Can be protected by captcha.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   *
   * Rate limit: 10 requests per minute.
   */
  login: LoginPayload;
  /**
   * Log out customer from the current session.
   *
   * Customer selection can be kept after logout if `Retain session after logout` plugin fields is set to `Yes`. Otherwise, selection is detached from the session.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  logout?: Maybe<LogoutPayload>;
  /**
   * Use Centra as a routing mechanism based on request path/URI
   *
   * * `DISPLAY_ITEM` - looks for display item
   * * `CATEGORY` - looks for category
   * * `AFFILIATE` - looks for affiliate and sets it on the current selection in SESSION mode
   * * `CAMPAIGN_SITE` - looks for campaign site and sets it on the current selection in SESSION mode
   * * `URL_VOUCHER` - looks for URL voucher and sets it on the current selection in SESSION mode
   */
  lookupUri?: Maybe<UriLookupPayload>;
  /**
   * Initiate the payment process for the current selection.
   *
   * Can be protected by captcha.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  paymentInstructions: PaymentInstructionsPayload;
  /**
   * Verify payment to create order.
   *
   * Send all POST/GET variables received to paymentReturnPage to verify if payment was successfully processed.
   *
   * Selection is converted into order on successful payment and is detached from the current session.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  paymentResult: PaymentResultPayload;
  /**
   * Register customer.
   *
   * Can be protected by captcha.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  registerCustomer: CustomerRegisterPayload;
  /**
   * Remove subscription plan from the selection line by line id.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  removeSubscriptionPlanFromLine: SelectionMutationPayload;
  /**
   * Remove applied voucher from the current selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  removeVoucher: SelectionMutationPayload;
  /**
   * Request reset password email to be sent to the provided email.
   *
   * The password reset link will be the domain from a Centra setting, resetPasswordExternalUrl is added as a path.
   * Example:
   *   domain - https://example.com
   *   resetPasswordExternalUrl - hello/world
   *   link customer receives - https://example.com/hello/world?i=123&id=567
   *
   * Can be protected by captcha.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  requestPasswordResetEmail: RequestPasswordResetEmailPayload;
  /**
   * Finalize reset password flow providing new password.
   *
   * Provide `i` and `id` GET request variables received on reset password page.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  resetPassword: ResetPasswordPayload;
  /**
   * Set shipping and billing addresses on the current selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setAddress: SelectionMutationPayload;
  /**
   * Set an affiliate on the current session by its uri.
   *
   * Any selection created for the current session during affiliate `Cookie expiration in days` will have an affiliate set on it.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setAffiliate: SelectionMutationPayload;
  /**
   * Set allocation rule to request for fulfillment of order.
   *
   * Required [operating mode](#operating-mode): `SHARED_SECRET`
   */
  setAllocationRule: SelectionMutationPayload;
  /**
   * Set a brick and mortar store on the current selection, to request for fulfillment of order.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setBrickAndMortar: SelectionMutationPayload;
  /**
   * Set campaign site market on the current selection by its uri.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setCampaignSite: SelectionMutationPayload;
  /**
   * Set the current session and selection country and state.
   *
   * Can trigger pricelist/market change along with unavailable products removal froom the current selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setCountryState: SelectionMutationPayload;
  /**
   * Set the language on the current session and selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setLanguage: SessionPayload;
  /**
   * Set the market on the current selection.
   *
   * Required [operating mode](#operating-mode): `SHARED_SECRET`
   */
  setMarket: SessionPayload;
  /**
   * Set the paymentMethod on the current selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setPaymentMethod: SelectionMutationPayload;
  /**
   * Attach open selection to the token, it now becomes the current selection for the session.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setSelection: SelectionMutationPayload;
  /**
   * Set dynamic and mapped attributes on the current selection.
   *
   * Required [operating mode](#operating-mode): `SHARED_SECRET`
   */
  setSelectionAttributes: SelectionMutationPayload;
  /**
   * Set the shipping method on the current selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  setShippingMethod: SelectionMutationPayload;
  /**
   * Subscribe to back in stock notification.
   *
   * Can be protected by captcha.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  subscribeToBackInStock: StockSubscribePayload;
  /**
   * Subscribe to newsletter for the provided email address.
   *
   * Can be protected by captcha.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  subscribeToNewsletter: NewsletterSubscribePayload;
  /**
   * Trigger selection action such as external allocation process.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  triggerSelectionAction: TriggerSelectionActionPayload;
  /**
   * Unset dynamic and mapped attributes from the current selection.
   *
   * Required [operating mode](#operating-mode): `SHARED_SECRET`
   */
  unsetSelectionAttributes: SelectionMutationPayload;
  /**
   * Update currently logged in customer.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  updateCustomer: CustomerUpdatePayload;
  /**
   * Update a selection line by its id.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  updateLine: SelectionMutationPayload;
  /**
   * Update the interval for a subscription owned by the logged in customer.
   *
   * Interval is taken from the provided subscription plan.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  updateSubscriptionInterval: SubscriptionContractPayload;
  /**
   * Update the quantity for a subscription owned by the logged in customer.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  updateSubscriptionQuantity: SubscriptionContractPayload;
  /**
   * Update the status for a subscription owned by the logged in customer.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  updateSubscriptionStatus: SubscriptionContractPayload;
  /**
   * Validate captcha response.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  verifyCaptcha: CaptchaVerifyPayload;
  /**
   * Verify if password hashes received on reset password page are correct.
   *
   * Provide `i` and `id` GET request variables received on reset password page.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  verifyResetPasswordHashes: VerifyResetPasswordHashesPayload;
};


export type MutationAddFlexibleBundleArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  comment?: Scalars['String']['input'];
  item: Scalars['String']['input'];
  localizedProdSize?: InputMaybe<LocalizedProdSizeInput>;
  productExternalUrl?: Scalars['String']['input'];
  quantity?: Scalars['Int']['input'];
  sections: Array<BundleSectionInput>;
  subscriptionPlan?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationAddItemArgs = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  comment?: Scalars['String']['input'];
  item: Scalars['String']['input'];
  localizedProdSize?: InputMaybe<LocalizedProdSizeInput>;
  productExternalUrl?: Scalars['String']['input'];
  quantity?: Scalars['Int']['input'];
  subscriptionPlan?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationAddSubscriptionArgs = {
  contractId: Scalars['Int']['input'];
  item: Scalars['String']['input'];
  nextOrderDate: Scalars['Date']['input'];
  quantity: Scalars['Int']['input'];
  subscriptionPlanId: Scalars['Int']['input'];
};


export type MutationAddVoucherArgs = {
  code: Scalars['String']['input'];
};


export type MutationApplyGiftCardArgs = {
  input: ApplyGiftCardInput;
};


export type MutationChangeSubscriptionContractAddressArgs = {
  address: SubscriptionContractAddressInput;
  contractId: Scalars['Int']['input'];
};


export type MutationClaimSelectionArgs = {
  hash: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationDeleteLineArgs = {
  lineId: Scalars['String']['input'];
};


export type MutationHandleStoredPaymentResultArgs = {
  paymentMethodFields: Scalars['Map']['input'];
};


export type MutationHandleWidgetEventArgs = {
  payload: Scalars['Map']['input'];
};


export type MutationInitializeStoredPaymentInstructionsArgs = {
  input: StoredPaymentInstructionsInput;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  loginOptions?: LoginOptions;
  password: Scalars['String']['input'];
};


export type MutationLookupUriArgs = {
  for: Array<UriLookupType>;
  languageCode?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: Scalars['Int']['input'];
  market?: InputMaybe<Array<Scalars['Int']['input']>>;
  page?: Scalars['Int']['input'];
  pricelist?: InputMaybe<Array<Scalars['Int']['input']>>;
  uri: Scalars['String']['input'];
};


export type MutationPaymentInstructionsArgs = {
  input: PaymentInstructionsInput;
};


export type MutationPaymentResultArgs = {
  paymentMethodFields: Scalars['Map']['input'];
};


export type MutationRegisterCustomerArgs = {
  input: CustomerRegisterInput;
};


export type MutationRemoveSubscriptionPlanFromLineArgs = {
  lineId: Scalars['String']['input'];
};


export type MutationRemoveVoucherArgs = {
  code: Scalars['String']['input'];
};


export type MutationRequestPasswordResetEmailArgs = {
  email: Scalars['String']['input'];
  resetPasswordExternalUrl: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  confirmPassword?: InputMaybe<Scalars['String']['input']>;
  i: Scalars['String']['input'];
  id: Scalars['String']['input'];
  loginOnSuccess?: Scalars['Boolean']['input'];
  password: Scalars['String']['input'];
};


export type MutationSetAddressArgs = {
  sendCartAbandonmentEmail?: InputMaybe<Scalars['Boolean']['input']>;
  separateBillingAddress?: InputMaybe<AddressInput>;
  shippingAddress: AddressInput;
};


export type MutationSetAffiliateArgs = {
  uri: Scalars['String']['input'];
};


export type MutationSetAllocationRuleArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSetBrickAndMortarArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSetCampaignSiteArgs = {
  uri: Scalars['String']['input'];
};


export type MutationSetCountryStateArgs = {
  countryCode: Scalars['String']['input'];
  stateCode?: InputMaybe<Scalars['String']['input']>;
};


export type MutationSetLanguageArgs = {
  code: Scalars['String']['input'];
};


export type MutationSetMarketArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSetPaymentMethodArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSetSelectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationSetSelectionAttributesArgs = {
  dynamicAttributes?: InputMaybe<Array<DynamicSelectionAttributeSetInput>>;
  mappedAttributes?: InputMaybe<Array<MappedSelectionAttributeSetInput>>;
};


export type MutationSetShippingMethodArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSubscribeToBackInStockArgs = {
  input: BackInStockSubscribeInput;
};


export type MutationSubscribeToNewsletterArgs = {
  additionalInfo?: InputMaybe<NewsletterSubscribeInput>;
  email: Scalars['String']['input'];
};


export type MutationTriggerSelectionActionArgs = {
  actionType: SelectionActionType;
};


export type MutationUnsetSelectionAttributesArgs = {
  dynamicAttributes?: InputMaybe<Array<DynamicSelectionAttributeUnsetInput>>;
  mappedAttributes?: InputMaybe<Array<MappedSelectionAttributeUnsetInput>>;
};


export type MutationUpdateCustomerArgs = {
  input: CustomerUpdateInput;
};


export type MutationUpdateLineArgs = {
  comment?: InputMaybe<Scalars['String']['input']>;
  lineId: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
  subscriptionPlanId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationUpdateSubscriptionIntervalArgs = {
  subscriptionId: Scalars['Int']['input'];
  subscriptionPlanId: Scalars['Int']['input'];
};


export type MutationUpdateSubscriptionQuantityArgs = {
  quantity: Scalars['Int']['input'];
  subscriptionId: Scalars['Int']['input'];
};


export type MutationUpdateSubscriptionStatusArgs = {
  status: SubscriptionStatus;
  subscriptionId: Scalars['Int']['input'];
};


export type MutationVerifyCaptchaArgs = {
  captchaData: Scalars['String']['input'];
};


export type MutationVerifyResetPasswordHashesArgs = {
  i: Scalars['String']['input'];
  id: Scalars['String']['input'];
};

export type NewsletterSubscribeInput = {
  countryCode?: InputMaybe<Scalars['String']['input']>;
  emailField?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Gender>;
  languageCode?: InputMaybe<Scalars['String']['input']>;
};

export type NewsletterSubscribePayload = Payload & {
  subscribed: Scalars['Boolean']['output'];
  userErrors: Array<UserError>;
};

export type NewsletterSubscription = {
  country?: Maybe<Country>;
  createdAt: Scalars['DateTimeTz']['output'];
  isActive: Scalars['Boolean']['output'];
};


export type NewsletterSubscriptionCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export type NotFoundUriLookupPayload = Payload & UriLookupPayload & {
  found: UriLookupType;
  userErrors: Array<UserError>;
};

export enum Operation_Category {
  Cart = 'CART',
  Catalog = 'CATALOG',
  Checkout = 'CHECKOUT',
  SearchFilter = 'SEARCH_FILTER'
}

export type OpeningDay = {
  date?: Maybe<Scalars['Date']['output']>;
  day: OpeningDayType;
  isClosed: Scalars['Boolean']['output'];
  openingHoursList: Array<OpeningHours>;
};

export enum OpeningDayType {
  CustomDate = 'CUSTOM_DATE',
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY'
}

export type OpeningHours = {
  end: Scalars['String']['output'];
  start: Scalars['String']['output'];
};

export type Order = {
  affiliateHtml: Scalars['String']['output'];
  attributes: Array<Attribute>;
  billingAddress?: Maybe<Address>;
  comment?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Country>;
  currencyBaseRate: Scalars['Float']['output'];
  deliveryGroups: Array<DeliveryGroup>;
  discountsApplied: Array<Voucher>;
  id: Scalars['String']['output'];
  language?: Maybe<Language>;
  lines: Array<Maybe<Line>>;
  market?: Maybe<Market>;
  number: Scalars['Int']['output'];
  orderDate: Scalars['String']['output'];
  otherComment: Scalars['String']['output'];
  /** Some paymentMethods return a html snippet to be rendered on the thank you page. */
  paymentHtml: Scalars['String']['output'];
  paymentMethod: PaymentMethod;
  shippingAddress?: Maybe<Address>;
  shippingMethod: ShippingMethod;
  state?: Maybe<CountryState>;
  status: OrderStatus;
  totals: Array<SelectionTotalRow>;
  usedFallbackTax: Scalars['Boolean']['output'];
  userIP?: Maybe<Scalars['String']['output']>;
};


export type OrderOrderDateArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export type OrderBillingAddressCreateInput = {
  address1: Scalars['String']['input'];
  address2?: InputMaybe<Scalars['String']['input']>;
  attention?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  companyName?: InputMaybe<Scalars['String']['input']>;
  country: CountryInput;
  email?: InputMaybe<Scalars['String']['input']>;
  faxNumber?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  stateOrProvince?: InputMaybe<Scalars['String']['input']>;
  vatNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode: Scalars['String']['input'];
};

export type OrderShippingAddressCreateInput = {
  address1: Scalars['String']['input'];
  address2?: InputMaybe<Scalars['String']['input']>;
  attention?: InputMaybe<Scalars['String']['input']>;
  cellPhoneNumber?: InputMaybe<Scalars['String']['input']>;
  city: Scalars['String']['input'];
  companyName?: InputMaybe<Scalars['String']['input']>;
  country: CountryInput;
  email: Scalars['String']['input'];
  faxNumber?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  registerCustomer?: InputMaybe<Scalars['Boolean']['input']>;
  stateOrProvince?: InputMaybe<Scalars['String']['input']>;
  zipCode: Scalars['String']['input'];
};

export enum OrderStatus {
  Archived = 'ARCHIVED',
  Confirmed = 'CONFIRMED',
  Deleted = 'DELETED',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED'
}

export type PaginationInfo = {
  /** The page can be different from the requested page if an invalid page was requested. */
  currentPage: Scalars['Int']['output'];
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  lastPage: Scalars['Int']['output'];
  limit: Scalars['Int']['output'];
  nextPage?: Maybe<Scalars['Int']['output']>;
  previousPage?: Maybe<Scalars['Int']['output']>;
  total: Scalars['Int']['output'];
};

export type PasswordUpdateInput = {
  confirmNewPassword?: InputMaybe<Scalars['String']['input']>;
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type Payload = {
  userErrors: Array<UserError>;
};

export type PaymentAction = {
  action: PaymentActionType;
};

export enum PaymentActionType {
  Form = 'FORM',
  Javascript = 'JAVASCRIPT',
  Redirect = 'REDIRECT',
  Success = 'SUCCESS'
}

export type PaymentInstructionsInput = {
  affiliate?: InputMaybe<Scalars['Int']['input']>;
  checkoutPageOrigin?: InputMaybe<Scalars['String']['input']>;
  clientDetails?: InputMaybe<ClientDetails>;
  comment?: InputMaybe<Scalars['String']['input']>;
  consents?: InputMaybe<Array<ConsentInput>>;
  customerClubSpecificFields?: InputMaybe<CustomerClubSpecificFields>;
  express?: Scalars['Boolean']['input'];
  integrationSpecificFields?: InputMaybe<Scalars['Map']['input']>;
  internal?: Scalars['Boolean']['input'];
  ipAddress?: InputMaybe<Scalars['String']['input']>;
  languageCode?: Scalars['String']['input'];
  paymentFailedPage: Scalars['String']['input'];
  paymentInitiateOnly?: Scalars['Boolean']['input'];
  paymentMethod?: Scalars['Int']['input'];
  paymentMethodSpecificFields?: InputMaybe<Scalars['Map']['input']>;
  paymentReturnPage: Scalars['String']['input'];
  separateBillingAddress?: InputMaybe<AddressInput>;
  shippingAddress: AddressInput;
  shippingMethod?: Scalars['Int']['input'];
  termsAndConditions: Scalars['Boolean']['input'];
};

export type PaymentInstructionsPayload = {
  action?: Maybe<PaymentAction>;
  selection: Selection;
  userErrors: Array<UserError>;
};


export type PaymentInstructionsPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type PaymentMethod = {
  active: Scalars['Boolean']['output'];
  addressAfterPayment: Scalars['Boolean']['output'];
  handlingCost: MonetaryValue;
  id: Scalars['Int']['output'];
  initiateOnlySupported: Scalars['Boolean']['output'];
  kind: PaymentMethodKind;
  name: Scalars['String']['output'];
  recurringSupported: Scalars['Boolean']['output'];
  uri: Scalars['String']['output'];
};

export enum PaymentMethodKind {
  AdyenDropin = 'ADYEN_DROPIN',
  Dummy = 'DUMMY',
  ExternalPayment = 'EXTERNAL_PAYMENT',
  KlarnaCheckoutV3 = 'KLARNA_CHECKOUT_V3',
  KlarnaPayments = 'KLARNA_PAYMENTS',
  PaypalCommerce = 'PAYPAL_COMMERCE',
  QliroOne = 'QLIRO_ONE',
  StripeCheckout = 'STRIPE_CHECKOUT',
  StripePaymentIntents = 'STRIPE_PAYMENT_INTENTS',
  Unknown = 'UNKNOWN'
}

export type PaymentResultFailedPayload = PaymentResultPayload & {
  selection: Selection;
  type: PaymentResultType;
  userErrors: Array<UserError>;
};


export type PaymentResultFailedPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type PaymentResultPayload = {
  selection: Selection;
  type: PaymentResultType;
  userErrors: Array<UserError>;
};


export type PaymentResultPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type PaymentResultSuccessPayload = PaymentResultPayload & {
  order: Order;
  selection: Selection;
  type: PaymentResultType;
  userErrors: Array<UserError>;
};


export type PaymentResultSuccessPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export enum PaymentResultType {
  Failed = 'FAILED',
  Success = 'SUCCESS'
}

export type Pricelist = {
  comment?: Maybe<Scalars['String']['output']>;
  /** Required [operating mode](#operating-mode): `NO_SESSION` */
  countries?: Maybe<Array<Country>>;
  currency: Currency;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type PricelistLowestPrice = {
  lowestPriceByMarket: Array<MarketLowestPrice>;
  pricelist: Pricelist;
};

export type PricelistPrice = {
  priceByMarket: Array<MarketPrice>;
  pricelist: Pricelist;
};

export type ProductLine = Line & {
  addedFromCategory?: Maybe<Category>;
  appliedPromotions: Array<AppliedPromotion>;
  brand?: Maybe<Brand>;
  comment: Scalars['String']['output'];
  discountPercent: Scalars['Float']['output'];
  displayItem: DisplayItem;
  hasDiscount: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  item: Item;
  lineValue: MonetaryValue;
  localizedSize?: Maybe<LocalizedProdSize>;
  name: Scalars['String']['output'];
  originalLineValue: MonetaryValue;
  productExternalUrl?: Maybe<Scalars['String']['output']>;
  productNumber: Scalars['String']['output'];
  productVariantName: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  size: Scalars['String']['output'];
  subscriptionId?: Maybe<Scalars['Int']['output']>;
  taxPercent: Scalars['Float']['output'];
  unitOriginalPrice: MonetaryValue;
  unitPrice: MonetaryValue;
  unitPriceReduction: MonetaryValue;
};


export type ProductLineLineValueArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type ProductLineOriginalLineValueArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type ProductLineUnitOriginalPriceArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type ProductLineUnitPriceArgs = {
  includingTax?: Scalars['Boolean']['input'];
};


export type ProductLineUnitPriceReductionArgs = {
  includingTax?: Scalars['Boolean']['input'];
};

export type ProductMedia = {
  altText?: Maybe<Scalars['String']['output']>;
  attributes: Array<Attribute>;
  id: Scalars['Int']['output'];
  metaDataJSON?: Maybe<Scalars['String']['output']>;
  source: MediaSource;
  translations: Array<TranslatedMedia>;
};


export type ProductMediaAttributesArgs = {
  keys?: Array<Scalars['String']['input']>;
};


export type ProductMediaSourceArgs = {
  sizeName?: InputMaybe<Scalars['String']['input']>;
};

export type ProductVariant = {
  id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  number?: Maybe<Scalars['String']['output']>;
  translations?: Maybe<Array<TranslatedProductVariant>>;
};

/**
 * A promotion is information about how you can trigger certain deals by adding an item to cart.
 *
 * E.g. add to cart and get 50% off on your cheapest product, save 20% when bought with X.
 *
 * It interacts with auto vouchers.
 */
export type Promotion = {
  action: PromotionAction;
  result: PromotionResult;
};

export enum PromotionAction {
  AddMeToCart = 'ADD_ME_TO_CART',
  AddRelatedItemToCart = 'ADD_RELATED_ITEM_TO_CART'
}

export enum PromotionResult {
  FreeShipping = 'FREE_SHIPPING'
}

export type Query = {
  /**
   * Get an affiliate by its uri.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  affiliate?: Maybe<Affiliate>;
  /**
   * Get a paginated list of affiliates.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  affiliates: AffiliateList;
  /**
   * Get a list of brands.
   *
   * Filtered by session's market and pricelist in session mode.
   */
  brands?: Maybe<BrandList>;
  /** Get a brick and mortar by its id. */
  brickAndMortar?: Maybe<BrickAndMortar>;
  /** Get a paginated list of brick and mortars. */
  brickAndMortars?: Maybe<BrickAndMortarList>;
  /**
   * Get a campaign site by its uri.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  campaignSite?: Maybe<CampaignSite>;
  /**
   * Get a paginated list of campaign sites.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  campaignSites: CampaignSiteList;
  /**
   * Get a paginated list of categories.
   *
   * Filtered by session's market and pricelist in session mode.
   *
   * Filter by parent: 0 to get only top level categories.
   */
  categories?: Maybe<CategoryList>;
  /**
   * Get a paginated list of collections.
   *
   * Filtered by session's market and pricelist in session mode.
   */
  collections?: Maybe<CollectionList>;
  /** Get a list of countries. */
  countries: Array<Country>;
  /**
   * Get the currently logged in customer.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  customer?: Maybe<Customer>;
  /**
   * Get a display item by its id.
   *
   * In session mode, results are filtered by the session's market and pricelist. Translated values are returned if available for either session or input language.
   */
  displayItem?: Maybe<DisplayItem>;
  /**
   * Get a paginated list of display items.
   *
   * In session mode, results are filtered by the session's market and pricelist. Translated values are returned if available for either session or input language.
   */
  displayItems: DisplayItemList;
  expressCheckoutWidgets: ExpressCheckoutWidgetsPayload;
  /** Check which brick and mortars can fulfill the current selection. */
  fulfillmentCheck: FulfillmentCheckPayload;
  /** Get a list of languages. */
  languages: Array<Language>;
  /**
   * Get a list of markets.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  markets: Array<Market>;
  /**
   * Get the latest order, null if none.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  order?: Maybe<Order>;
  /**
   * Get a list of pricelists.
   *
   * Required [operating mode](#operating-mode): `NO_SESSION`
   */
  pricelists: Array<Pricelist>;
  /**
   * Get the current selection.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  selection: Selection;
  /**
   * Get the current session.
   *
   * Required [operating mode](#operating-mode): `SESSION`
   */
  session: Session;
  /**
   * Get payment methods supporting recurring payment.
   *
   * Filters by session market, pricelist and country code by default.
   *
   * Filters by contract market, pricelist and country code if provided.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  storedPaymentMethods: StoredPaymentMethodPayload;
  /**
   * Get customer's subscription contract list.
   *
   * Required [operating mode](#operating-mode): `LOGGED_IN`
   */
  subscriptionContracts: Array<SubscriptionContract>;
};


export type QueryAffiliateArgs = {
  uri: Scalars['String']['input'];
};


export type QueryAffiliatesArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  sort?: Array<AffiliateSort>;
};


export type QueryBrandsArgs = {
  limit?: Scalars['Int']['input'];
  market?: InputMaybe<Array<Scalars['Int']['input']>>;
  page?: Scalars['Int']['input'];
  pricelist?: InputMaybe<Array<Scalars['Int']['input']>>;
  sort?: Array<BrandSort>;
};


export type QueryBrickAndMortarArgs = {
  id: Scalars['Int']['input'];
};


export type QueryBrickAndMortarsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Array<BrickAndMortarSort>>;
  where?: InputMaybe<BrickAndMortarListFilter>;
};


export type QueryCampaignSiteArgs = {
  uri: Scalars['String']['input'];
};


export type QueryCampaignSitesArgs = {
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  sort?: Array<CampaignSiteSort>;
};


export type QueryCategoriesArgs = {
  id?: InputMaybe<Array<Scalars['Int']['input']>>;
  languageCode?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: Scalars['Int']['input'];
  market?: InputMaybe<Array<Scalars['Int']['input']>>;
  page?: Scalars['Int']['input'];
  parent?: InputMaybe<Scalars['Int']['input']>;
  pricelist?: InputMaybe<Array<Scalars['Int']['input']>>;
  sort?: Array<CategorySort>;
};


export type QueryCollectionsArgs = {
  ids?: InputMaybe<Array<Scalars['Int']['input']>>;
  limit?: Scalars['Int']['input'];
  market?: InputMaybe<Array<Scalars['Int']['input']>>;
  page?: Scalars['Int']['input'];
  pricelist?: InputMaybe<Array<Scalars['Int']['input']>>;
  sort?: Array<CollectionSort>;
};


export type QueryCountriesArgs = {
  onlyShipTo: Scalars['Boolean']['input'];
};


export type QueryDisplayItemArgs = {
  id: Scalars['Int']['input'];
  languageCode?: InputMaybe<Array<Scalars['String']['input']>>;
  market?: InputMaybe<Array<Scalars['Int']['input']>>;
  pricelist?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QueryDisplayItemsArgs = {
  languageCode?: InputMaybe<Array<Scalars['String']['input']>>;
  limit?: Scalars['Int']['input'];
  market?: InputMaybe<Array<Scalars['Int']['input']>>;
  page?: Scalars['Int']['input'];
  pricelist?: InputMaybe<Array<Scalars['Int']['input']>>;
  sort?: Array<CustomSortInput>;
  where?: InputMaybe<DisplayItemFilter>;
};


export type QueryExpressCheckoutWidgetsArgs = {
  configurationOnly?: InputMaybe<Scalars['Boolean']['input']>;
  plugins: Array<ExpressCheckoutWidgetsPluginItem>;
};


export type QueryFulfillmentCheckArgs = {
  brickAndMortarIds: Array<Scalars['Int']['input']>;
};


export type QueryMarketsArgs = {
  countryCode?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QueryPricelistsArgs = {
  countryCodes?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QuerySelectionArgs = {
  voucherMode?: Voucher_Mode;
};


export type QueryStoredPaymentMethodsArgs = {
  contract?: InputMaybe<Scalars['Int']['input']>;
};

export type RedirectPaymentAction = PaymentAction & {
  action: PaymentActionType;
  url: Scalars['String']['output'];
};

export type RelatedDisplayItems = {
  displayItems?: Maybe<Array<DisplayItem>>;
  relation: Scalars['String']['output'];
};

export type RequestPasswordResetEmailPayload = Payload & {
  userErrors: Array<UserError>;
};

export type ResetPasswordPayload = Payload & {
  changed: Scalars['Boolean']['output'];
  session: Session;
  userErrors: Array<UserError>;
};

export enum Scope {
  LoggedIn = 'LOGGED_IN',
  NoSession = 'NO_SESSION',
  Session = 'SESSION',
  SharedSecret = 'SHARED_SECRET'
}

export enum SearchField {
  BrandName = 'BRAND_NAME',
  CategoryName = 'CATEGORY_NAME',
  CollectionName = 'COLLECTION_NAME',
  Description = 'DESCRIPTION',
  FuzzyName = 'FUZZY_NAME',
  FuzzyProductVariantName = 'FUZZY_PRODUCT_VARIANT_NAME',
  Gtin = 'GTIN',
  Name = 'NAME',
  ProductNumber = 'PRODUCT_NUMBER',
  ProductVariantName = 'PRODUCT_VARIANT_NAME',
  ShortDescription = 'SHORT_DESCRIPTION',
  SizeNumber = 'SIZE_NUMBER'
}

export type Selection = {
  attributes: Array<Attribute>;
  availableAttributes: Array<Attribute>;
  brickAndMortar?: Maybe<BrickAndMortar>;
  /** Slow fields for checkout. */
  checkout?: Maybe<CheckoutSelection>;
  comment?: Maybe<Scalars['String']['output']>;
  discounts: Array<Voucher>;
  externalGiftCardAvailable: Scalars['Boolean']['output'];
  /** Does not contain added tax. */
  grandTotal: MonetaryValue;
  id?: Maybe<Scalars['String']['output']>;
  language?: Maybe<Language>;
  lines: Array<Maybe<Line>>;
  taxExempt?: Maybe<Scalars['Boolean']['output']>;
  usedFallbackTax: Scalars['Boolean']['output'];
};

export enum SelectionActionType {
  Allocate = 'ALLOCATE'
}

export type SelectionBundle = {
  id: Scalars['Int']['output'];
  priceType: BundlePriceType;
  sections: Array<SelectionBundleSection>;
  type: BundleType;
};

export type SelectionBundleSection = {
  id: Scalars['Int']['output'];
  lines: Array<ProductLine>;
  quantity: Scalars['Int']['output'];
};

export type SelectionDeliveryGroup = {
  lines: Array<DeliveryGroupLine>;
  name?: Maybe<Scalars['String']['output']>;
  shippingMethod: ShippingMethod;
  shippingPrice: MonetaryValue;
};

export type SelectionMutationPayload = {
  selection?: Maybe<Selection>;
  userErrors: Array<UserError>;
};


export type SelectionMutationPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type SelectionTotalRow = {
  price: MonetaryValue;
  type: SelectionTotalRowType;
};

export type SelectionTotalRowBase = SelectionTotalRow & {
  price: MonetaryValue;
  type: SelectionTotalRowType;
};

export enum SelectionTotalRowType {
  Credit = 'CREDIT',
  Discount = 'DISCOUNT',
  GrandTotal = 'GRAND_TOTAL',
  Handling = 'HANDLING',
  IncludingTax = 'INCLUDING_TAX',
  IncludingTaxTotal = 'INCLUDING_TAX_TOTAL',
  ItemsSubtotal = 'ITEMS_SUBTOTAL',
  Shipping = 'SHIPPING',
  TaxAdded = 'TAX_ADDED',
  TaxAddedTotal = 'TAX_ADDED_TOTAL',
  TaxDeduct = 'TAX_DEDUCT',
  TaxDeductTotal = 'TAX_DEDUCT_TOTAL'
}

export type SelectionTotalTaxRow = SelectionTotalRow & {
  price: MonetaryValue;
  taxPercent: Scalars['Float']['output'];
  type: SelectionTotalRowType;
};

export type Session = {
  country: Country;
  countryState?: Maybe<CountryState>;
  language?: Maybe<Language>;
  loggedIn?: Maybe<Customer>;
  market: Market;
  pricelist: Pricelist;
};

export type SessionPayload = Payload & SelectionMutationPayload & {
  selection?: Maybe<Selection>;
  session: Session;
  userErrors: Array<UserError>;
};


export type SessionPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type ShippingMethod = {
  comment?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  price: MonetaryValue;
  selected: Scalars['Boolean']['output'];
};

export type SizeChart = {
  displayUnit: Scalars['String']['output'];
  dividerSymbol: Scalars['String']['output'];
  horizontalLabels: Array<Scalars['String']['output']>;
  localization: Array<LocalizedSizeChart>;
  name: Scalars['String']['output'];
  verticalLabels: Array<Scalars['String']['output']>;
};

export type SizeNameFilterValue = FilterValue & {
  active: Scalars['Boolean']['output'];
  /** Number of matches with the current filtering. */
  count: Scalars['Int']['output'];
  /** Number of matches with the current filtering when you discount the other selected values in this group. */
  filterCount: Scalars['Int']['output'];
  sizeLocalization: Array<LocalizedSize>;
  /** The number of items in total available, independent of filtering. */
  totalCount: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export enum SortKey {
  Category = 'CATEGORY',
  Collection = 'COLLECTION',
  CreatedAt = 'CREATED_AT',
  ModifiedAt = 'MODIFIED_AT',
  Price = 'PRICE',
  ProductNumber = 'PRODUCT_NUMBER',
  ProductVariantNumber = 'PRODUCT_VARIANT_NUMBER',
  Sku = 'SKU',
  Uri = 'URI'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StateAddressField = AddressField & {
  choices: Array<CountryState>;
  key: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  selected?: Maybe<CountryState>;
  visible: Scalars['Boolean']['output'];
};

export type Stock = {
  available: Scalars['Boolean']['output'];
  /** Required permission: `stock.quantity` */
  quantity: Scalars['Int']['output'];
};

export type StockSubscribePayload = Payload & {
  subscribed: Scalars['Boolean']['output'];
  userErrors: Array<UserError>;
};

export type StoredPaymentInstructionsInput = {
  checkoutOrigin?: InputMaybe<Scalars['String']['input']>;
  contracts: Array<Scalars['Int']['input']>;
  paymentFailedPage: Scalars['String']['input'];
  paymentMethod: Scalars['Int']['input'];
  paymentMethodSpecificFields?: InputMaybe<Scalars['Map']['input']>;
  paymentReturnPage: Scalars['String']['input'];
};

export type StoredPaymentInstructionsPayload = Payload & {
  action?: Maybe<PaymentAction>;
  userErrors: Array<UserError>;
};

export type StoredPaymentMethodPayload = Payload & {
  paymentMethods: Array<PaymentMethod>;
  userErrors: Array<UserError>;
};


export type StoredPaymentMethodPayloadPaymentMethodsArgs = {
  sort?: InputMaybe<Array<PaymentMethodKind>>;
};

export type StoredPaymentResultPayload = Payload & {
  contracts: Array<SubscriptionContract>;
  paymentHtml?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  userErrors: Array<UserError>;
};

export type SubscriptionContract = {
  createdAt: Scalars['DateTimeTz']['output'];
  id: Scalars['Int']['output'];
  market?: Maybe<Market>;
  originatingOrder?: Maybe<Order>;
  pricelist: Pricelist;
  shippingAddress: Address;
  shippingOption?: Maybe<ShippingMethod>;
  subscriptionPayment: Array<SubscriptionPayment>;
  subscriptions: Array<SubscriptionInfo>;
  updatedAt: Scalars['DateTimeTz']['output'];
};


export type SubscriptionContractCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionContractUpdatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionContractAddressInput = {
  address1?: InputMaybe<Scalars['String']['input']>;
  address2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionContractPayload = Payload & {
  contract?: Maybe<SubscriptionContract>;
  userErrors: Array<UserError>;
};

export type SubscriptionInfo = {
  attentionReasons: Array<AttentionReason>;
  createdAt: Scalars['DateTimeTz']['output'];
  discount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  interval: DateInterval;
  lines: Array<Line>;
  needsAttention: Scalars['Boolean']['output'];
  /** Next day when the order should be created according to schedule and selected interval. */
  nextOrderDate?: Maybe<Scalars['Date']['output']>;
  /** Next day when the order creation will be attempted. Takes last failures and retrial mechanics into account. */
  nextRetryDate?: Maybe<Scalars['Date']['output']>;
  plan?: Maybe<SubscriptionPlan>;
  status: SubscriptionStatus;
  updatedAt: Scalars['DateTimeTz']['output'];
};


export type SubscriptionInfoCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionInfoNextOrderDateArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionInfoNextRetryDateArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionInfoUpdatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionPayment = {
  createdAt: Scalars['DateTimeTz']['output'];
  id: Scalars['Int']['output'];
  paymentMethod: Scalars['String']['output'];
  status: SubscriptionPaymentStatus;
  updatedAt: Scalars['DateTimeTz']['output'];
};


export type SubscriptionPaymentCreatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionPaymentUpdatedAtArgs = {
  format?: InputMaybe<Scalars['String']['input']>;
};

export enum SubscriptionPaymentStatus {
  Active = 'ACTIVE',
  Revoked = 'REVOKED',
  Suspended = 'SUSPENDED'
}

export type SubscriptionPlan = {
  discount?: Maybe<Scalars['Float']['output']>;
  id: Scalars['Int']['output'];
  interval: DateInterval;
  name: Scalars['String']['output'];
};

export enum SubscriptionStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Paused = 'PAUSED'
}

export type SuccessPaymentAction = PaymentAction & {
  action: PaymentActionType;
  formFields?: Maybe<Scalars['Map']['output']>;
  order: Order;
};

export type SuccessStoredPaymentAction = PaymentAction & {
  action: PaymentActionType;
  contracts: Array<SubscriptionContract>;
  paymentHtml?: Maybe<Scalars['String']['output']>;
};

export type TextAddressField = AddressField & {
  key: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  visible: Scalars['Boolean']['output'];
};

export type TextFilterValue = FilterValue & {
  active: Scalars['Boolean']['output'];
  /** Number of matches with the current filtering. */
  count: Scalars['Int']['output'];
  /** Number of matches with the current filtering when you discount the other selected values in this group. */
  filterCount: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
  /** The number of items in total available, independent of filtering. */
  totalCount: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type TranslatedCategory = {
  language: Language;
  metaDescription: Scalars['String']['output'];
  metaKeywords: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  name?: Maybe<Array<Scalars['String']['output']>>;
  uri: Scalars['String']['output'];
};

export type TranslatedCountry = {
  language: Language;
  name: Scalars['String']['output'];
};

export type TranslatedDisplayItem = {
  description: FormattedString;
  language: Language;
  metaDescription: Scalars['String']['output'];
  metaKeywords: Scalars['String']['output'];
  metaTitle: Scalars['String']['output'];
  name: Scalars['String']['output'];
  shortDescription: FormattedString;
  uri: Scalars['String']['output'];
};

export type TranslatedMedia = {
  altText?: Maybe<Scalars['String']['output']>;
  language: Language;
};

export type TranslatedProductVariant = {
  language: Language;
  name: Scalars['String']['output'];
};

export type TriggerSelectionActionPayload = Payload & SelectionMutationPayload & {
  selection?: Maybe<Selection>;
  userErrors: Array<UserError>;
};


export type TriggerSelectionActionPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type UriLookupPayload = {
  found: UriLookupType;
  userErrors: Array<UserError>;
};

export type UnavailableItem = UserError & {
  availableQuantity: Scalars['Int']['output'];
  displayItem?: Maybe<DisplayItem>;
  item?: Maybe<Item>;
  message: Scalars['String']['output'];
  originalQuantity: Scalars['Int']['output'];
  path?: Maybe<Array<Scalars['String']['output']>>;
  unavailableQuantity: Scalars['Int']['output'];
};

export enum UriLookupType {
  Affiliate = 'AFFILIATE',
  CampaignSite = 'CAMPAIGN_SITE',
  Category = 'CATEGORY',
  DisplayItem = 'DISPLAY_ITEM',
  NotFound = 'NOT_FOUND',
  UrlVoucher = 'URL_VOUCHER'
}

export type UrlVoucher = Voucher & {
  actions: Array<VoucherAction>;
  /** Required [operating mode](#operating-mode): `SESSION` */
  appliedOn: Array<VoucherAppliedOn>;
  attributes: Array<Attribute>;
  expiryDate: Scalars['String']['output'];
  giftCard?: Maybe<GiftCard>;
  isExternal: Scalars['Boolean']['output'];
  lineIds: Array<Scalars['String']['output']>;
  method: VoucherMethod;
  name: Scalars['String']['output'];
  /** Required [operating mode](#operating-mode): `SESSION` */
  orderReduction: MonetaryValue;
  /** Required [operating mode](#operating-mode): `SESSION` */
  totalItemReduction: MonetaryValue;
  /** Required [operating mode](#operating-mode): `SESSION` */
  totalShippingReduction: MonetaryValue;
  type: VoucherType;
  url: Scalars['String']['output'];
  /** Required [operating mode](#operating-mode): `SESSION` */
  value: MonetaryValue;
};

export type UrlVoucherUriLookupPayload = Payload & UriLookupPayload & {
  found: UriLookupType;
  /** Required [operating mode](#operating-mode): `SESSION` */
  selection?: Maybe<Selection>;
  userErrors: Array<UserError>;
  voucherApplied: UrlVoucher;
};


export type UrlVoucherUriLookupPayloadSelectionArgs = {
  voucherMode?: Voucher_Mode;
};

export type UserError = {
  message: Scalars['String']['output'];
  path?: Maybe<Array<Scalars['String']['output']>>;
};

export type UserErrorBase = UserError & {
  message: Scalars['String']['output'];
  path?: Maybe<Array<Scalars['String']['output']>>;
};

export enum Voucher_Mode {
  Lines = 'LINES',
  Total = 'TOTAL'
}

export type VerifyResetPasswordHashesPayload = Payload & {
  userErrors: Array<UserError>;
  valid: Scalars['Boolean']['output'];
};

export type Voucher = {
  actions: Array<VoucherAction>;
  appliedOn: Array<VoucherAppliedOn>;
  attributes: Array<Attribute>;
  expiryDate: Scalars['String']['output'];
  giftCard?: Maybe<GiftCard>;
  isExternal: Scalars['Boolean']['output'];
  lineIds: Array<Scalars['String']['output']>;
  method: VoucherMethod;
  name: Scalars['String']['output'];
  orderReduction: MonetaryValue;
  totalItemReduction: MonetaryValue;
  totalShippingReduction: MonetaryValue;
  type: VoucherType;
  value: MonetaryValue;
};

export type VoucherAction = {
  type: AppliedActionType;
};

export enum VoucherActionType {
  Credit = 'CREDIT',
  Discount = 'DISCOUNT'
}

export enum VoucherAppliedOn {
  AddedLine = 'ADDED_LINE',
  Lines = 'LINES',
  Order = 'ORDER',
  Shipping = 'SHIPPING'
}

export enum VoucherMethod {
  Auto = 'AUTO',
  Code = 'CODE',
  Url = 'URL'
}

export enum VoucherType {
  Credit = 'CREDIT',
  Discount = 'DISCOUNT'
}

export type WarehouseStock = {
  stock: Stock;
  warehouseId: Scalars['Int']['output'];
};

export type Widget = {
  kind: WidgetKind;
};

export enum WidgetKind {
  Payment = 'PAYMENT',
  Shipping = 'SHIPPING'
}

export type Wishlist = {
  id: Scalars['Int']['output'];
  isDefault: Scalars['Boolean']['output'];
  items: Array<DisplayItem>;
  name: Scalars['String']['output'];
};


export type WishlistItemsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type ReceiptQueryVariables = Exact<{ [key: string]: never; }>;


export type ReceiptQuery = { order?: { id: string, number: number, orderDate: string, status: OrderStatus, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, shippingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, billingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingMethod: { id: number, name: string, comment?: string | null, selected: boolean, price: { value: number, formattedValue: string } }, lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null> } | null };

export type PaymentResultMutationVariables = Exact<{
  paymentMethodFields: Scalars['Map']['input'];
}>;


export type PaymentResultMutation = { paymentResult: { type: PaymentResultType, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { type: PaymentResultType, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type ChangeLocaleMutationVariables = Exact<{
  country: Scalars['String']['input'];
  language: Scalars['String']['input'];
}>;


export type ChangeLocaleMutation = { setCountryState: { userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> }, setLanguage: { session: { country: { code: string }, countryState?: { code: string } | null, language?: { code: string } | null, market: { id: number }, pricelist: { id: number }, loggedIn?: { id: number } | null } } };

export type AddFlexibleBundleToCartMutationVariables = Exact<{
  item: Scalars['String']['input'];
  sections: Array<BundleSectionInput> | BundleSectionInput;
  quantity?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddFlexibleBundleToCartMutation = { addFlexibleBundle: { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { currency: { prefix?: string | null, suffix?: string | null } } } | null } };

export type AddItemMutationVariables = Exact<{
  item: Scalars['String']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
}>;


export type AddItemMutation = { addItem: { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { currency: { prefix?: string | null, suffix?: string | null } } } | null } };

export type UpdateLineMutationVariables = Exact<{
  id: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
}>;


export type UpdateLineMutation = { updateLine: { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { currency: { prefix?: string | null, suffix?: string | null } } } | null } | { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { currency: { prefix?: string | null, suffix?: string | null } } } | null } | { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { currency: { prefix?: string | null, suffix?: string | null } } } | null } | { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { currency: { prefix?: string | null, suffix?: string | null } } } | null } };

export type CartQueryVariables = Exact<{ [key: string]: never; }>;


export type CartQuery = { selection: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { currency: { prefix?: string | null, suffix?: string | null } } } };

export type SetAddressMutationVariables = Exact<{
  billingAddress: AddressInput;
  shippingAddress: AddressInput;
}>;


export type SetAddressMutation = { setAddress: { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } };

export type SetShippingMethodMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type SetShippingMethodMutation = { setShippingMethod: { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type SetPaymentMethodMutationVariables = Exact<{
  paymentMethod: Scalars['Int']['input'];
}>;


export type SetPaymentMethodMutation = { setPaymentMethod: { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type PaymentInstructionsMutationVariables = Exact<{
  input: PaymentInstructionsInput;
}>;


export type PaymentInstructionsMutation = { paymentInstructions: { action?: { __typename: 'FormPaymentAction', html: string, formFields?: any | null, formType: string } | { __typename: 'JavascriptPaymentAction', script: string, formFields?: any | null } | { __typename: 'RedirectPaymentAction', url: string } | { __typename: 'SuccessPaymentAction', order: { id: string } } | { __typename: 'SuccessStoredPaymentAction' } | null, selection: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null }, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } };

export type WidgetEventMutationVariables = Exact<{
  payload: Scalars['Map']['input'];
}>;


export type WidgetEventMutation = { handleWidgetEvent: { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type AddVoucherMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type AddVoucherMutation = { addVoucher: { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type RemoveVoucherMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type RemoveVoucherMutation = { removeVoucher: { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type SetCountryStateMutationVariables = Exact<{
  countryCode: Scalars['String']['input'];
  stateCode: Scalars['String']['input'];
}>;


export type SetCountryStateMutation = { setCountryState: { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null, userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } };

export type UpdateLineCheckoutMutationVariables = Exact<{
  id: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
}>;


export type UpdateLineCheckoutMutation = { updateLine: { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null } | { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null } | { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null } | { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }>, selection?: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } | null } };

export type CheckoutQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckoutQuery = { selection: { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null } };

export type SessionQueryVariables = Exact<{ [key: string]: never; }>;


export type SessionQuery = { session: { country: { code: string }, countryState?: { code: string } | null, language?: { code: string } | null, market: { id: number }, pricelist: { id: number }, loggedIn?: { id: number } | null } };

export type SetCountryAndLanguageMutationVariables = Exact<{
  country: Scalars['String']['input'];
  state?: InputMaybe<Scalars['String']['input']>;
  language: Scalars['String']['input'];
}>;


export type SetCountryAndLanguageMutation = { setCountryState: { userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> } | { userErrors: Array<{ __typename: 'UnavailableItem', message: string, path?: Array<string> | null } | { __typename: 'UserErrorBase', message: string, path?: Array<string> | null }> }, setLanguage: { session: { country: { code: string }, countryState?: { code: string } | null, language?: { code: string } | null, market: { id: number }, pricelist: { id: number }, loggedIn?: { id: number } | null } } };

export type OrdersQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type OrdersQuery = { customer?: { totalOrders: number, orders: Array<{ id: string, number: number, orderDate: string, status: OrderStatus, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, shippingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, billingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingMethod: { id: number, name: string, comment?: string | null, selected: boolean, price: { value: number, formattedValue: string } }, lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null> }> } | null };

export type RelatedProductsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
  language: Scalars['String']['input'];
  market: Scalars['Int']['input'];
  pricelist: Scalars['Int']['input'];
}>;


export type RelatedProductsQuery = { displayItem?: { relatedDisplayItems: Array<{ relation: string, displayItems?: Array<{ id: number, uri: string, name: string, media: Array<{ altText?: string | null, source: { url: string } }>, productVariant: { name?: string | null }, relatedDisplayItems: Array<{ relation: string, displayItems?: Array<{ uri: string, productVariant: { name?: string | null }, swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> }> | null }>, price?: { formattedValue: string } | null, bundle?: { type: BundleType, priceType: BundlePriceType, minPrice?: { formattedValue: string } | null } | null, swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> }> | null }> } | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { login: { session: { country: { code: string }, countryState?: { code: string } | null, language?: { code: string } | null, market: { id: number }, pricelist: { id: number }, loggedIn?: { id: number } | null }, userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type RegisterMutationVariables = Exact<{
  input: CustomerRegisterInput;
}>;


export type RegisterMutation = { registerCustomer: { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout?: { session: { country: { code: string }, countryState?: { code: string } | null, language?: { code: string } | null, market: { id: number }, pricelist: { id: number }, loggedIn?: { id: number } | null } } | null };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
  uri: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { requestPasswordResetEmail: { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type ResetPasswordMutationVariables = Exact<{
  password: Scalars['String']['input'];
  confirmPassword: Scalars['String']['input'];
  i: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { resetPassword: { userErrors: Array<{ message: string, path?: Array<string> | null } | { message: string, path?: Array<string> | null }> } };

export type LookupProductMutationVariables = Exact<{
  uri: Scalars['String']['input'];
  language: Scalars['String']['input'];
  market: Scalars['Int']['input'];
  pricelist: Scalars['Int']['input'];
}>;


export type LookupProductMutation = { lookupUri?: { __typename: 'AffiliateUriLookupPayload' } | { __typename: 'CampaignSiteUriLookupPayload' } | { __typename: 'CategoryUriLookupPayload' } | { __typename: 'DisplayItemUriLookupPayload', displayItem: { id: number, available: boolean, uri: string, name: string, metaTitle: string, metaDescription: string, description: { formatted: string }, media: Array<{ id: number, altText?: string | null, source: { url: string } }>, price?: { formattedValue: string, value: number, currency: { code: string } } | null, items: Array<{ id: string, name: string, stock: { available: boolean }, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }>, relatedDisplayItems: Array<{ relation: string, displayItems?: Array<{ uri: string, productVariant: { name?: string | null }, swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> }> | null }>, productVariant: { name?: string | null }, translations: Array<{ uri: string, language: { code: string } }>, bundle?: { type: BundleType, priceType: BundlePriceType, minPrice?: { formattedValue: string } | null, maxPrice?: { formattedValue: string } | null, sections: Array<{ id: number, quantity: number, items: Array<{ id: number, name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }>, price?: { formattedValue: string, value: number, currency: { code: string } } | null, items: Array<{ id: string, name: string, stock: { available: boolean }, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }> }> }> } | null, swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> } } | { __typename: 'NotFoundUriLookupPayload' } | { __typename: 'UrlVoucherUriLookupPayload' } | null };

export type ProductsQueryVariables = Exact<{
  page: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<Array<CustomSortInput> | CustomSortInput>;
  filters?: InputMaybe<Array<FilterInput> | FilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  market: Scalars['Int']['input'];
  pricelist: Scalars['Int']['input'];
  language: Scalars['String']['input'];
  withFilters?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ProductsQuery = { displayItems: { list?: Array<{ id: number, uri: string, name: string, media: Array<{ altText?: string | null, source: { url: string } }>, productVariant: { name?: string | null }, relatedDisplayItems: Array<{ relation: string, displayItems?: Array<{ uri: string, productVariant: { name?: string | null }, swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> }> | null }>, price?: { formattedValue: string } | null, bundle?: { type: BundleType, priceType: BundlePriceType, minPrice?: { formattedValue: string } | null } | null, swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> }> | null, pagination: { currentPage: number, lastPage: number }, filters?: Array<{ key: string, anyAvailable: boolean, selectedValues: Array<string>, values: Array<{ __typename: 'BrandFilterValue', name?: string | null, value: string, filterCount: number } | { __typename: 'CategoryFilterValue', value: string, filterCount: number } | { __typename: 'CollectionFilterValue', value: string, filterCount: number } | { __typename: 'MappedAttributeFilterValue', value: string, filterCount: number } | { __typename: 'SizeNameFilterValue', value: string, filterCount: number } | { __typename: 'TextFilterValue', value: string, filterCount: number }> }> | null } };

export type CountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CountriesQuery = { countries: Array<{ name: string, code: string, states?: Array<{ name: string, code: string }> | null, defaultLanguage?: { code: string, languageCode?: string | null } | null, translations: Array<{ name: string, language: { code: string } }> }> };

export type LanguagesQueryVariables = Exact<{ [key: string]: never; }>;


export type LanguagesQuery = { languages: Array<{ languageCode?: string | null, name: string, code: string, countryCode?: string | null }> };

export type CategoriesQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  language: Scalars['String']['input'];
  market: Scalars['Int']['input'];
}>;


export type CategoriesQuery = { categories?: { list: Array<{ name?: Array<string> | null, uri: string }> } | null };

export type LookupCategoryMutationVariables = Exact<{
  uri: Scalars['String']['input'];
  language: Scalars['String']['input'];
  market: Scalars['Int']['input'];
}>;


export type LookupCategoryMutation = { lookupUri?: { __typename: 'AffiliateUriLookupPayload' } | { __typename: 'CampaignSiteUriLookupPayload' } | { __typename: 'CategoryUriLookupPayload', category: { id: number, uri: string, name?: Array<string> | null, metaTitle: string, metaDescription: string, childCategories: Array<{ name?: Array<string> | null, uri: string }>, translations: Array<{ uri: string, language: { code: string } }> } } | { __typename: 'DisplayItemUriLookupPayload' } | { __typename: 'NotFoundUriLookupPayload' } | { __typename: 'UrlVoucherUriLookupPayload' } | null };

export type CheckoutFragment = { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { value: number, currency: { denominator: number, code: string } }, discounts: Array<{ name: string, value: { value: number, formattedValue: string } } | { code: string, name: string, value: { value: number, formattedValue: string } } | { name: string, value: { value: number, formattedValue: string } }>, checkout?: { checkoutScript?: string | null, separateBillingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingAddress: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null }, paymentMethods: Array<{ id: number, uri: string, name: string, kind: PaymentMethodKind, initiateOnlySupported: boolean, handlingCost: { formattedValue: string, value: number } }>, paymentMethod?: { id: number } | null, shippingMethods?: Array<{ id: number, name: string, comment?: string | null, price: { formattedValue: string, value: number } }> | null, shippingMethod?: { id: number, name: string, comment?: string | null, price: { value: number, formattedValue: string } } | null, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, widgets?: Array<{ __typename: 'IngridWidget', snippet: string, deliveryOptionsAvailable: boolean } | { __typename: 'KlarnaCheckoutWidget' } | { __typename: 'KlarnaPaymentWidget', client_token: string, authorizePayload?: any | null }> | null } | null };

export type AddressFragment = { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null };

export type OrderFragment = { id: string, number: number, orderDate: string, status: OrderStatus, totals: Array<{ type: SelectionTotalRowType, price: { value: number, formattedValue: string } } | { type: SelectionTotalRowType, price: { value: number, formattedValue: string } }>, shippingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, billingAddress?: { address1?: string | null, address2?: string | null, city?: string | null, zipCode?: string | null, email?: string | null, firstName?: string | null, lastName?: string | null, phoneNumber?: string | null, companyName?: string | null, vatNumber?: string | null, country?: { code: string, name: string } | null, state?: { code: string, name: string } | null } | null, shippingMethod: { id: number, name: string, comment?: string | null, selected: boolean, price: { value: number, formattedValue: string } }, lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null> };

type Voucher_AutoVoucher_Fragment = { name: string, value: { value: number, formattedValue: string } };

type Voucher_CodeVoucher_Fragment = { code: string, name: string, value: { value: number, formattedValue: string } };

type Voucher_UrlVoucher_Fragment = { name: string, value: { value: number, formattedValue: string } };

export type VoucherFragment = Voucher_AutoVoucher_Fragment | Voucher_CodeVoucher_Fragment | Voucher_UrlVoucher_Fragment;

type PaymentAction_FormPaymentAction_Fragment = { __typename: 'FormPaymentAction', html: string, formFields?: any | null, formType: string };

type PaymentAction_JavascriptPaymentAction_Fragment = { __typename: 'JavascriptPaymentAction', script: string, formFields?: any | null };

type PaymentAction_RedirectPaymentAction_Fragment = { __typename: 'RedirectPaymentAction', url: string };

type PaymentAction_SuccessPaymentAction_Fragment = { __typename: 'SuccessPaymentAction', order: { id: string } };

type PaymentAction_SuccessStoredPaymentAction_Fragment = { __typename: 'SuccessStoredPaymentAction' };

export type PaymentActionFragment = PaymentAction_FormPaymentAction_Fragment | PaymentAction_JavascriptPaymentAction_Fragment | PaymentAction_RedirectPaymentAction_Fragment | PaymentAction_SuccessPaymentAction_Fragment | PaymentAction_SuccessStoredPaymentAction_Fragment;

export type ItemFragment = { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> };

export type BundleFragment = { type: BundleType, priceType: BundlePriceType, minPrice?: { formattedValue: string } | null, maxPrice?: { formattedValue: string } | null, sections: Array<{ id: number, quantity: number, items: Array<{ id: number, name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }>, price?: { formattedValue: string, value: number, currency: { code: string } } | null, items: Array<{ id: string, name: string, stock: { available: boolean }, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }> }> }> };

export type VariantSwatchFragment = { swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> };

export type ListProductFragment = { id: number, uri: string, name: string, media: Array<{ altText?: string | null, source: { url: string } }>, productVariant: { name?: string | null }, relatedDisplayItems: Array<{ relation: string, displayItems?: Array<{ uri: string, productVariant: { name?: string | null }, swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> }> | null }>, price?: { formattedValue: string } | null, bundle?: { type: BundleType, priceType: BundlePriceType, minPrice?: { formattedValue: string } | null } | null, swatch: Array<{ __typename: 'DynamicAttribute', elements: Array<{ __typename: 'AttributeChoiceElement', key: string } | { __typename: 'AttributeFileElement', key: string } | { __typename: 'AttributeImageElement', key: string } | { __typename: 'AttributeStringElement', value: string, key: string }> } | { __typename: 'MappedAttribute' }> };

export type CartFragment = { lines: Array<{ __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } } | null>, grandTotal: { currency: { prefix?: string | null, suffix?: string | null } } };

type Line_BundleLine_Fragment = { __typename: 'BundleLine', id: string, quantity: number, bundle?: { type: BundleType, sections: Array<{ quantity: number, lines: Array<{ id: string, name: string, quantity: number, lineValue: { formattedValue: string }, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> } }> }> } | null, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } };

type Line_ProductLine_Fragment = { __typename: 'ProductLine', id: string, quantity: number, item: { id: string, name: string, sizeLocalization: Array<{ name?: string | null, countries: Array<{ code: string }> }> }, lineValue: { formattedValue: string, value: number }, displayItem: { name: string, uri: string, media: Array<{ altText?: string | null, source: { url: string } }> } };

export type LineFragment = Line_BundleLine_Fragment | Line_ProductLine_Fragment;

export type SessionFragment = { country: { code: string }, countryState?: { code: string } | null, language?: { code: string } | null, market: { id: number }, pricelist: { id: number }, loggedIn?: { id: number } | null };

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const ItemFragmentDoc = new TypedDocumentString(`
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
    `, {"fragmentName":"item"}) as unknown as TypedDocumentString<ItemFragment, unknown>;
export const LineFragmentDoc = new TypedDocumentString(`
    fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}`, {"fragmentName":"line"}) as unknown as TypedDocumentString<LineFragment, unknown>;
export const VoucherFragmentDoc = new TypedDocumentString(`
    fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
    `, {"fragmentName":"voucher"}) as unknown as TypedDocumentString<VoucherFragment, unknown>;
export const AddressFragmentDoc = new TypedDocumentString(`
    fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
    `, {"fragmentName":"address"}) as unknown as TypedDocumentString<AddressFragment, unknown>;
export const CheckoutFragmentDoc = new TypedDocumentString(`
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
    fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`, {"fragmentName":"checkout"}) as unknown as TypedDocumentString<CheckoutFragment, unknown>;
export const OrderFragmentDoc = new TypedDocumentString(`
    fragment order on Order {
  id
  number
  orderDate
  status
  totals {
    type
    price {
      value
      formattedValue
    }
  }
  shippingAddress {
    ...address
  }
  billingAddress {
    ...address
  }
  shippingMethod {
    id
    name
    comment
    selected
    price {
      value
      formattedValue
    }
  }
  lines {
    ...line
  }
}
    fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`, {"fragmentName":"order"}) as unknown as TypedDocumentString<OrderFragment, unknown>;
export const PaymentActionFragmentDoc = new TypedDocumentString(`
    fragment paymentAction on PaymentAction {
  __typename
  ... on FormPaymentAction {
    html
    formFields
    formType
  }
  ... on RedirectPaymentAction {
    url
  }
  ... on JavascriptPaymentAction {
    script
    formFields
  }
  ... on SuccessPaymentAction {
    order {
      id
    }
  }
}
    `, {"fragmentName":"paymentAction"}) as unknown as TypedDocumentString<PaymentActionFragment, unknown>;
export const BundleFragmentDoc = new TypedDocumentString(`
    fragment bundle on Bundle {
  type
  priceType
  minPrice {
    formattedValue
  }
  maxPrice {
    formattedValue
  }
  sections {
    id
    quantity
    items {
      id
      name
      uri
      media {
        altText
        source {
          url
        }
      }
      price {
        formattedValue
        value
        currency {
          code
        }
      }
      items {
        ...item
        stock {
          available
        }
      }
    }
  }
}
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}`, {"fragmentName":"bundle"}) as unknown as TypedDocumentString<BundleFragment, unknown>;
export const VariantSwatchFragmentDoc = new TypedDocumentString(`
    fragment variantSwatch on DisplayItem {
  swatch: attributes(keys: ["variant_swatch"]) {
    __typename
    ... on DynamicAttribute {
      elements {
        __typename
        key
        ... on AttributeStringElement {
          value
        }
      }
    }
  }
}
    `, {"fragmentName":"variantSwatch"}) as unknown as TypedDocumentString<VariantSwatchFragment, unknown>;
export const ListProductFragmentDoc = new TypedDocumentString(`
    fragment listProduct on DisplayItem {
  id
  uri
  name
  media {
    altText
    source(sizeName: "1350x0") {
      url
    }
  }
  productVariant {
    name
  }
  ...variantSwatch
  relatedDisplayItems(relationType: "variant") {
    relation
    displayItems {
      uri
      productVariant {
        name
      }
      ...variantSwatch
    }
  }
  price {
    formattedValue
  }
  bundle {
    type
    priceType
    minPrice {
      formattedValue
    }
  }
}
    fragment variantSwatch on DisplayItem {
  swatch: attributes(keys: ["variant_swatch"]) {
    __typename
    ... on DynamicAttribute {
      elements {
        __typename
        key
        ... on AttributeStringElement {
          value
        }
      }
    }
  }
}`, {"fragmentName":"listProduct"}) as unknown as TypedDocumentString<ListProductFragment, unknown>;
export const CartFragmentDoc = new TypedDocumentString(`
    fragment cart on Selection {
  lines {
    ...line
  }
  grandTotal {
    currency {
      prefix
      suffix
    }
  }
}
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`, {"fragmentName":"cart"}) as unknown as TypedDocumentString<CartFragment, unknown>;
export const SessionFragmentDoc = new TypedDocumentString(`
    fragment session on Session {
  country {
    code
  }
  countryState {
    code
  }
  language {
    code
  }
  market {
    id
  }
  pricelist {
    id
  }
  loggedIn {
    id
  }
}
    `, {"fragmentName":"session"}) as unknown as TypedDocumentString<SessionFragment, unknown>;
export const ReceiptDocument = new TypedDocumentString(`
    query receipt {
  order {
    ...order
  }
}
    fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment order on Order {
  id
  number
  orderDate
  status
  totals {
    type
    price {
      value
      formattedValue
    }
  }
  shippingAddress {
    ...address
  }
  billingAddress {
    ...address
  }
  shippingMethod {
    id
    name
    comment
    selected
    price {
      value
      formattedValue
    }
  }
  lines {
    ...line
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<ReceiptQuery, ReceiptQueryVariables>;
export const PaymentResultDocument = new TypedDocumentString(`
    mutation paymentResult($paymentMethodFields: Map!) {
  paymentResult(paymentMethodFields: $paymentMethodFields) {
    type
    userErrors {
      message
      path
    }
  }
}
    `) as unknown as TypedDocumentString<PaymentResultMutation, PaymentResultMutationVariables>;
export const ChangeLocaleDocument = new TypedDocumentString(`
    mutation changeLocale($country: String!, $language: String!) {
  setCountryState(countryCode: $country) {
    userErrors {
      __typename
      message
      path
    }
  }
  setLanguage(code: $language) {
    session {
      ...session
    }
  }
}
    fragment session on Session {
  country {
    code
  }
  countryState {
    code
  }
  language {
    code
  }
  market {
    id
  }
  pricelist {
    id
  }
  loggedIn {
    id
  }
}`) as unknown as TypedDocumentString<ChangeLocaleMutation, ChangeLocaleMutationVariables>;
export const AddFlexibleBundleToCartDocument = new TypedDocumentString(`
    mutation addFlexibleBundleToCart($item: String!, $sections: [BundleSectionInput!]!, $quantity: Int = 1) {
  addFlexibleBundle(item: $item, quantity: $quantity, sections: $sections) {
    userErrors {
      message
      path
    }
    selection {
      ...cart
    }
  }
}
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment cart on Selection {
  lines {
    ...line
  }
  grandTotal {
    currency {
      prefix
      suffix
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<AddFlexibleBundleToCartMutation, AddFlexibleBundleToCartMutationVariables>;
export const AddItemDocument = new TypedDocumentString(`
    mutation addItem($item: String!, $quantity: Int = 1) {
  addItem(item: $item, quantity: $quantity) {
    userErrors {
      message
      path
    }
    selection {
      ...cart
    }
  }
}
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment cart on Selection {
  lines {
    ...line
  }
  grandTotal {
    currency {
      prefix
      suffix
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<AddItemMutation, AddItemMutationVariables>;
export const UpdateLineDocument = new TypedDocumentString(`
    mutation updateLine($id: String!, $quantity: Int!) {
  updateLine(lineId: $id, quantity: $quantity) {
    userErrors {
      message
      path
    }
    selection {
      ...cart
    }
  }
}
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment cart on Selection {
  lines {
    ...line
  }
  grandTotal {
    currency {
      prefix
      suffix
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<UpdateLineMutation, UpdateLineMutationVariables>;
export const CartDocument = new TypedDocumentString(`
    query cart {
  selection {
    ...cart
  }
}
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment cart on Selection {
  lines {
    ...line
  }
  grandTotal {
    currency {
      prefix
      suffix
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<CartQuery, CartQueryVariables>;
export const SetAddressDocument = new TypedDocumentString(`
    mutation setAddress($billingAddress: AddressInput!, $shippingAddress: AddressInput!) {
  setAddress(
    separateBillingAddress: $billingAddress
    shippingAddress: $shippingAddress
  ) {
    selection {
      ...checkout
    }
    userErrors {
      __typename
      message
      path
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<SetAddressMutation, SetAddressMutationVariables>;
export const SetShippingMethodDocument = new TypedDocumentString(`
    mutation setShippingMethod($id: Int!) {
  setShippingMethod(id: $id) {
    selection {
      ...checkout
    }
    userErrors {
      message
      path
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<SetShippingMethodMutation, SetShippingMethodMutationVariables>;
export const SetPaymentMethodDocument = new TypedDocumentString(`
    mutation setPaymentMethod($paymentMethod: Int!) {
  setPaymentMethod(id: $paymentMethod) {
    selection {
      ...checkout
    }
    userErrors {
      message
      path
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<SetPaymentMethodMutation, SetPaymentMethodMutationVariables>;
export const PaymentInstructionsDocument = new TypedDocumentString(`
    mutation paymentInstructions($input: PaymentInstructionsInput!) {
  paymentInstructions(input: $input) {
    action {
      ...paymentAction
    }
    selection {
      ...checkout
    }
    userErrors {
      __typename
      message
      path
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment paymentAction on PaymentAction {
  __typename
  ... on FormPaymentAction {
    html
    formFields
    formType
  }
  ... on RedirectPaymentAction {
    url
  }
  ... on JavascriptPaymentAction {
    script
    formFields
  }
  ... on SuccessPaymentAction {
    order {
      id
    }
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<PaymentInstructionsMutation, PaymentInstructionsMutationVariables>;
export const WidgetEventDocument = new TypedDocumentString(`
    mutation widgetEvent($payload: Map!) {
  handleWidgetEvent(payload: $payload) {
    selection {
      ...checkout
    }
    userErrors {
      message
      path
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<WidgetEventMutation, WidgetEventMutationVariables>;
export const AddVoucherDocument = new TypedDocumentString(`
    mutation addVoucher($code: String!) {
  addVoucher(code: $code) {
    selection {
      ...checkout
    }
    userErrors {
      message
      path
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<AddVoucherMutation, AddVoucherMutationVariables>;
export const RemoveVoucherDocument = new TypedDocumentString(`
    mutation removeVoucher($code: String!) {
  removeVoucher(code: $code) {
    selection {
      ...checkout
    }
    userErrors {
      message
      path
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<RemoveVoucherMutation, RemoveVoucherMutationVariables>;
export const SetCountryStateDocument = new TypedDocumentString(`
    mutation setCountryState($countryCode: String!, $stateCode: String!) {
  setCountryState(countryCode: $countryCode, stateCode: $stateCode) {
    selection {
      ...checkout
    }
    userErrors {
      __typename
      message
      path
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<SetCountryStateMutation, SetCountryStateMutationVariables>;
export const UpdateLineCheckoutDocument = new TypedDocumentString(`
    mutation updateLineCheckout($id: String!, $quantity: Int!) {
  updateLine(lineId: $id, quantity: $quantity) {
    userErrors {
      message
      path
    }
    selection {
      ...checkout
    }
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<UpdateLineCheckoutMutation, UpdateLineCheckoutMutationVariables>;
export const CheckoutDocument = new TypedDocumentString(`
    query checkout {
  selection {
    ...checkout
  }
}
    fragment checkout on Selection {
  lines {
    ...line
  }
  grandTotal {
    value
    currency {
      denominator
      code
    }
  }
  discounts {
    ...voucher
  }
  checkout {
    checkoutScript
    separateBillingAddress {
      ...address
    }
    shippingAddress {
      ...address
    }
    paymentMethods {
      id
      uri
      name
      kind
      initiateOnlySupported
      handlingCost {
        formattedValue
        value
      }
    }
    paymentMethod {
      id
    }
    shippingMethods {
      id
      name
      comment
      price {
        formattedValue
        value
      }
    }
    shippingMethod {
      id
      name
      comment
      price {
        value
        formattedValue
      }
    }
    totals {
      type
      price {
        value
        formattedValue
      }
    }
    widgets {
      __typename
      ... on IngridWidget {
        snippet
        deliveryOptionsAvailable
      }
      ... on KlarnaPaymentWidget {
        client_token
        authorizePayload
      }
    }
  }
}
fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment voucher on Voucher {
  name
  value {
    value
    formattedValue
  }
  ... on CodeVoucher {
    code
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<CheckoutQuery, CheckoutQueryVariables>;
export const SessionDocument = new TypedDocumentString(`
    query session {
  session {
    ...session
  }
}
    fragment session on Session {
  country {
    code
  }
  countryState {
    code
  }
  language {
    code
  }
  market {
    id
  }
  pricelist {
    id
  }
  loggedIn {
    id
  }
}`) as unknown as TypedDocumentString<SessionQuery, SessionQueryVariables>;
export const SetCountryAndLanguageDocument = new TypedDocumentString(`
    mutation setCountryAndLanguage($country: String!, $state: String, $language: String!) {
  setCountryState(countryCode: $country, stateCode: $state) {
    userErrors {
      __typename
      message
      path
    }
  }
  setLanguage(code: $language) {
    session {
      ...session
    }
  }
}
    fragment session on Session {
  country {
    code
  }
  countryState {
    code
  }
  language {
    code
  }
  market {
    id
  }
  pricelist {
    id
  }
  loggedIn {
    id
  }
}`) as unknown as TypedDocumentString<SetCountryAndLanguageMutation, SetCountryAndLanguageMutationVariables>;
export const OrdersDocument = new TypedDocumentString(`
    query orders($limit: Int!, $page: Int!) {
  customer {
    orders(limit: $limit, page: $page) {
      ...order
    }
    totalOrders
  }
}
    fragment address on Address {
  country {
    code
    name
  }
  state {
    code
    name
  }
  address1
  address2
  city
  zipCode
  email
  firstName
  lastName
  phoneNumber
  companyName
  vatNumber
}
fragment order on Order {
  id
  number
  orderDate
  status
  totals {
    type
    price {
      value
      formattedValue
    }
  }
  shippingAddress {
    ...address
  }
  billingAddress {
    ...address
  }
  shippingMethod {
    id
    name
    comment
    selected
    price {
      value
      formattedValue
    }
  }
  lines {
    ...line
  }
}
fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment line on Line {
  __typename
  id
  item {
    ...item
  }
  quantity
  lineValue {
    formattedValue
    value
  }
  displayItem {
    name
    uri
    media {
      altText
      source(sizeName: "mini") {
        url
      }
    }
  }
  ... on BundleLine {
    bundle {
      type
      sections {
        quantity
        lines {
          id
          lineValue {
            formattedValue
          }
          name
          quantity
          item {
            ...item
          }
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<OrdersQuery, OrdersQueryVariables>;
export const RelatedProductsDocument = new TypedDocumentString(`
    query relatedProducts($id: Int!, $language: String!, $market: Int!, $pricelist: Int!) {
  displayItem(
    id: $id
    languageCode: [$language]
    market: [$market]
    pricelist: [$pricelist]
  ) {
    relatedDisplayItems(relationType: "standard") {
      relation
      displayItems {
        ...listProduct
      }
    }
  }
}
    fragment variantSwatch on DisplayItem {
  swatch: attributes(keys: ["variant_swatch"]) {
    __typename
    ... on DynamicAttribute {
      elements {
        __typename
        key
        ... on AttributeStringElement {
          value
        }
      }
    }
  }
}
fragment listProduct on DisplayItem {
  id
  uri
  name
  media {
    altText
    source(sizeName: "1350x0") {
      url
    }
  }
  productVariant {
    name
  }
  ...variantSwatch
  relatedDisplayItems(relationType: "variant") {
    relation
    displayItems {
      uri
      productVariant {
        name
      }
      ...variantSwatch
    }
  }
  price {
    formattedValue
  }
  bundle {
    type
    priceType
    minPrice {
      formattedValue
    }
  }
}`) as unknown as TypedDocumentString<RelatedProductsQuery, RelatedProductsQueryVariables>;
export const LoginDocument = new TypedDocumentString(`
    mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    session {
      ...session
    }
    userErrors {
      message
      path
    }
  }
}
    fragment session on Session {
  country {
    code
  }
  countryState {
    code
  }
  language {
    code
  }
  market {
    id
  }
  pricelist {
    id
  }
  loggedIn {
    id
  }
}`) as unknown as TypedDocumentString<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = new TypedDocumentString(`
    mutation register($input: CustomerRegisterInput!) {
  registerCustomer(input: $input) {
    userErrors {
      message
      path
    }
  }
}
    `) as unknown as TypedDocumentString<RegisterMutation, RegisterMutationVariables>;
export const LogoutDocument = new TypedDocumentString(`
    mutation logout {
  logout {
    session {
      ...session
    }
  }
}
    fragment session on Session {
  country {
    code
  }
  countryState {
    code
  }
  language {
    code
  }
  market {
    id
  }
  pricelist {
    id
  }
  loggedIn {
    id
  }
}`) as unknown as TypedDocumentString<LogoutMutation, LogoutMutationVariables>;
export const ForgotPasswordDocument = new TypedDocumentString(`
    mutation forgotPassword($email: String!, $uri: String!) {
  requestPasswordResetEmail(email: $email, resetPasswordExternalUrl: $uri) {
    userErrors {
      message
      path
    }
  }
}
    `) as unknown as TypedDocumentString<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ResetPasswordDocument = new TypedDocumentString(`
    mutation resetPassword($password: String!, $confirmPassword: String!, $i: String!, $id: String!) {
  resetPassword(
    password: $password
    confirmPassword: $confirmPassword
    i: $i
    id: $id
  ) {
    userErrors {
      message
      path
    }
  }
}
    `) as unknown as TypedDocumentString<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const LookupProductDocument = new TypedDocumentString(`
    mutation lookupProduct($uri: String!, $language: String!, $market: Int!, $pricelist: Int!) {
  lookupUri(
    uri: $uri
    for: [DISPLAY_ITEM]
    languageCode: [$language]
    market: [$market]
    pricelist: [$pricelist]
  ) {
    __typename
    ... on DisplayItemUriLookupPayload {
      displayItem {
        id
        available
        uri
        name
        metaTitle
        metaDescription
        description {
          formatted
        }
        media {
          id
          altText
          source(sizeName: "1350x0") {
            url
          }
        }
        price {
          formattedValue
          value
          currency {
            code
          }
        }
        items {
          ...item
          stock {
            available
          }
        }
        relatedDisplayItems(relationType: "variant") {
          relation
          displayItems {
            uri
            productVariant {
              name
            }
            ...variantSwatch
          }
        }
        productVariant {
          name
        }
        ...variantSwatch
        translations {
          language {
            code
          }
          uri
        }
        bundle {
          ...bundle
        }
      }
    }
  }
}
    fragment item on Item {
  id
  name
  sizeLocalization {
    name
    countries {
      code
    }
  }
}
fragment bundle on Bundle {
  type
  priceType
  minPrice {
    formattedValue
  }
  maxPrice {
    formattedValue
  }
  sections {
    id
    quantity
    items {
      id
      name
      uri
      media {
        altText
        source {
          url
        }
      }
      price {
        formattedValue
        value
        currency {
          code
        }
      }
      items {
        ...item
        stock {
          available
        }
      }
    }
  }
}
fragment variantSwatch on DisplayItem {
  swatch: attributes(keys: ["variant_swatch"]) {
    __typename
    ... on DynamicAttribute {
      elements {
        __typename
        key
        ... on AttributeStringElement {
          value
        }
      }
    }
  }
}`) as unknown as TypedDocumentString<LookupProductMutation, LookupProductMutationVariables>;
export const ProductsDocument = new TypedDocumentString(`
    query products($page: Int!, $search: String, $sort: [CustomSortInput!] = [], $filters: [FilterInput!] = [], $limit: Int = 40, $market: Int!, $pricelist: Int!, $language: String!, $withFilters: Boolean = true) {
  displayItems(
    limit: $limit
    page: $page
    where: {search: $search, filters: $filters}
    sort: $sort
    market: [$market]
    pricelist: [$pricelist]
    languageCode: [$language]
  ) {
    list {
      ...listProduct
    }
    pagination {
      currentPage
      lastPage
    }
    filters @include(if: $withFilters) {
      key
      anyAvailable
      selectedValues
      values {
        __typename
        value
        filterCount
        ... on BrandFilterValue {
          name
        }
      }
    }
  }
}
    fragment variantSwatch on DisplayItem {
  swatch: attributes(keys: ["variant_swatch"]) {
    __typename
    ... on DynamicAttribute {
      elements {
        __typename
        key
        ... on AttributeStringElement {
          value
        }
      }
    }
  }
}
fragment listProduct on DisplayItem {
  id
  uri
  name
  media {
    altText
    source(sizeName: "1350x0") {
      url
    }
  }
  productVariant {
    name
  }
  ...variantSwatch
  relatedDisplayItems(relationType: "variant") {
    relation
    displayItems {
      uri
      productVariant {
        name
      }
      ...variantSwatch
    }
  }
  price {
    formattedValue
  }
  bundle {
    type
    priceType
    minPrice {
      formattedValue
    }
  }
}`) as unknown as TypedDocumentString<ProductsQuery, ProductsQueryVariables>;
export const CountriesDocument = new TypedDocumentString(`
    query countries {
  countries(onlyShipTo: true) {
    name
    code
    states {
      name
      code
    }
    defaultLanguage {
      code
      languageCode
    }
    translations {
      language {
        code
      }
      name
    }
  }
}
    `) as unknown as TypedDocumentString<CountriesQuery, CountriesQueryVariables>;
export const LanguagesDocument = new TypedDocumentString(`
    query languages {
  languages {
    languageCode
    name
    code
    countryCode
  }
}
    `) as unknown as TypedDocumentString<LanguagesQuery, LanguagesQueryVariables>;
export const CategoriesDocument = new TypedDocumentString(`
    query categories($limit: Int!, $language: String!, $market: Int!) {
  categories(
    limit: $limit
    parent: 0
    languageCode: [$language]
    market: [$market]
  ) {
    list {
      name
      uri
    }
  }
}
    `) as unknown as TypedDocumentString<CategoriesQuery, CategoriesQueryVariables>;
export const LookupCategoryDocument = new TypedDocumentString(`
    mutation lookupCategory($uri: String!, $language: String!, $market: Int!) {
  lookupUri(
    uri: $uri
    for: [CATEGORY]
    languageCode: [$language]
    market: [$market]
  ) {
    __typename
    ... on CategoryUriLookupPayload {
      category {
        id
        uri
        name
        metaTitle
        metaDescription
        childCategories {
          name
          uri
        }
        translations {
          uri
          language {
            code
          }
        }
      }
    }
  }
}
    `) as unknown as TypedDocumentString<LookupCategoryMutation, LookupCategoryMutationVariables>;