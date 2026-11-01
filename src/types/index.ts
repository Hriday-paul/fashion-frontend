import { IUserWithExtra } from "@/app/(public)/shop/[productId]/_components/ProductDetails/ProductDetails";

export type TUser = {
  _id: string;
  name: string;
  bio: string;
  type: string;
  image: string;
  coverImage: string;
  bestOn?: string;
};

// ======================================== integration --> real data ========================================================
export interface IProductImage {
  id: string;
  url: string;
  key: string;
  productId: string;
}

export interface IBrand {
  id: string;
  name: string;
  order: number;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISize {
  id: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  "UK": string
  "US": string
  "EU": string
  "parentId": string | null
  "children": ISize[]
}

export interface ICategory {
  id: string;
  name: string;
  parentId: string | null;
  sizeGuide: string | null;
  createdAt: string;
  updatedAt: string;
  children: ICategory[];
}

export interface IParcelSuggestion {
  id: string;
  weight_kg: number;
  height_cm: number;
  width_cm: number;
  length_cm: number;
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type ICondition = string;

export type ICareInstruction = string;

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPct: number;
  finalPrice: number;
  currency: string;
  brandId: string;
  sizeId: string;
  categoryId: string;
  catagory_hierarchy: ICategory[];
  condition: ICondition;
  tags: string[];
  meterials: string[];
  materials: {
    id: string;
    material: IMaterial;
  }[];
  color: string;
  care_instructions: ICareInstruction[];
  allow_offer: boolean;
  return_window: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  images: IProductImage[];
  brand: IBrand;
  size: ISize;
  category: ICategory;
  _count: {
    favourites: number;
  };
  favourites: {
    id: string;
  }[];
  cartItems: {
    id: string;
  }[];
  donation_percent: number,
  donationAnonymous: boolean,

  user: IUser;
  userId: string;
  charities: ICharity[],
  stock: number,

  assistentSellId: string | null,

  weight_kg: number
  hight_cm: number // in cm, for shipping cost calculation
  width_cm: number // in cm, for shipping cost calculation
  length_cm: number
}

export interface IMaterial {
    id: string;
    name: string;
}

export interface ICartGroup {
  id: string,
  userId: string,
  sellerId: string,
  seller: IUserWithExtra,
  items: {
    id: string,
    productId: string,
    product: IProduct,
    extraDonation: number,
    extraDonationAnonymous: boolean,
    charities: {
      id: string,
      charityId: string,
      charity: IUser,
    }[]
  }[],
  createdAt: Date
  updatedAt: Date
}

export interface ICharity {
  "id": string,
  "isAnonymous": boolean,
  "productId": string,
  "charityId": string,
  "charity": IUser
  "createdAt": Date
}

export enum UserRole {
  ADMIN = "ADMIN",
  INDIVIDUAL_USER = "INDIVIDUAL_USER",
  CHARITABLE_ORGANIZATION = "CHARITABLE_ORGANIZATION",
  CHARITY_SHOP = "CHARITY_SHOP",
  ECO_FRIENDLY_STORE = "ECO_FRIENDLY_STORE",
  CELEBRITY = "CELEBRITY",
  AMBASSADOR = "AMBASSADOR",
  PROFESSIONAL_SELLER = "PROFESSIONAL_SELLER"
}

export interface IUserAuth {
  role: UserRole;
  isPhoneVerified: boolean;
  isverified: boolean;
}

export interface IUser {
  id: string;
  fname: string;
  lname: string | null;
  email: string;
  userName: string;
  phone: string;
  description: string | null;
  bio: string | null;
  country: string;
  state: string;
  city: string;
  address: string;
  zip_code: string;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
  tiktok: string | null;
  website: string | null;
  support_email: string | null;
  notification: boolean;
  fcmToken: string | null;
  mission: string | null;
  business_tags: string[];
  isOnline: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  auth: IUserAuth;
  avgRating: number;
  picture: { key: string, url: string } | null;
  charityThumbnail: { key: string, url: string } | null;
  _count: {
    following: number,
    followers: number,
  }
  charityGalleries: { id: string, url: string, caption: string }[]
  vacationMode: boolean,
  lastOnlineAt: Date | null,
  countryAvaialblity: { name: string, code: string } | null

  charitableOrganization: CharitableOrganization | null;
  charityShop: CharityShop | null;
  ecoFriendlyStore: EcoFriendlyStore | null;
  celebrity: Celebrity | null;
  ambassador: Ambassador | null;
  professionalSeller: ProfessionalSeller | null;
}


// =================Roles specifiq fields======================

export interface IndividualVerification {
  id: string;
  userId: string;
  dateOfBirth?: Date | null;
  identityType?: string | null;
  identityCountry?: string | null;
  identityNumber?: string | null;
  identityDocumentKey?: string | null;
  identityBackKey?: string | null;
}

export interface CharitableOrganization {
  id: string;
  userId: string;
  legalName: string;
  registrationNumber?: string | null;
  registrationCountry: string;
  registeredAddress?: string | null;
  authorizedPersonName: string;
  authorizedPersonRole: string;
  registrationDocumentKey?: string | null;
  authorizationDocumentKey?: string | null;
}

export interface CharityShop {
  id: string;
  userId: string;
  shopName: string;
  operatorType: string;
  legalBusinessName?: string | null;
  businessRegistrationNumber?: string | null;
  registrationCountry?: string | null;
  charityRegistrationNumber?: string | null;
  charityRelationship?: string | null;
  authorizationDocumentKey?: string | null;
  registrationDocumentKey?: string | null;
}

export interface EcoFriendlyStore {
  id: string;
  userId: string;
  storeName: string;
  legalBusinessName?: string | null;
  businessRegistrationNumber?: string | null;
  registrationCountry?: string | null;
  sustainabilityDescription: string;
  certificationName?: string | null;
  certificationIssuer?: string | null;
  certificationNumber?: string | null;
  certificationDocumentKey?: string | null;
}

export interface Celebrity {
  id: string;
  userId: string;
  legalName: string;
  publicName: string;
  profession?: string | null;
  officialWebsite?: string | null;
  officialProfileUrls: string[];
  identityDocumentKey?: string | null;
  publicIdentityEvidenceKey?: string | null;
}

export interface Ambassador {
  id: string;
  userId: string;
  ambassadorType: string;
  representedBrand?: string | null;
  representedOrganization?: string | null;
  authorizationDocumentKey?: string | null;
  agreementVersion?: string | null;
  agreementAcceptedAt?: Date | null;
}

export interface ProfessionalSeller {
  id: string;
  userId: string;
  legalBusinessName: string;
  tradingName?: string | null;
  businessType: string;
  businessRegistrationNumber?: string | null;
  registrationCountry: string;
  registeredAddress?: string | null;
  registrationDocumentKey?: string | null;
  taxIdentificationNumber?: string | null;
}

// =================Roles specifiq fields ends======================




export interface INotification {
  id: string
  title: string,
  message: string,
  actorId: string | null,
  actor: IUser | null,
  receiverId: string,
  receiver: IUser,
  entityId: string | null,
  entityType: NotificationEntityType,
  type: NotificationType,
  entityImgs: string[],
  groupKeyId: string | null,
  "fcmToken": string | null,
  "isRead": boolean,
  "createdAt": string,
  "updatedAt": string,
}

export enum NotificationEntityType {
  PRODUCT = "PRODUCT",
  OFFER = "OFFER",
  ORDER = "ORDER",
  MESSAGE = "MESSAGE",
  USER = "USER",
  DONATION = "DONATION",
  RETURN = "RETURN",
  BADGE = "BADGE"
}

export enum NotificationType {
  //for product
  PRODUCT_LIKE = "PRODUCT_LIKE",
  PRICE_DROP = "PRICE_DROP",
  SOLD_OUT = "SOLD_OUT",

  //for offer
  OFFER_RECEIVED = "OFFER_RECEIVED",
  OFFER_ACCEPTED = "OFFER_ACCEPTED",
  OFFER_REJECTED = "OFFER_REJECTED",
  OFFER_CANCELED = "OFFER_CANCELED",

  //for order
  ORDER_PLACED = "ORDER_PLACED",
  ORDER_STATUS_CHANGED = "ORDER_STATUS_CHANGED",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  ORDER_ITEM_CANCELED = "ORDER_ITEM_CANCELED",

  //for message
  MESSAGE_RECEIVED = "MESSAGE_RECEIVED",

  //for user
  FOLLOWED = "FOLLOWED",
  REVIEW_RECEIVED = "REVIEW_RECEIVED",

  //for donation
  DONATION_RECEIVED = "DONATION_RECEIVED",

  //for return
  RETURN_REQUESTED = "RETURN_REQUESTED",
  RETURN_APPROVED = "RETURN_APPROVED",
  RETURN_REJECTED = "RETURN_REJECTED",
  RETURN_COMPLETED = "RETURN_COMPLETED",
  RETURN_STATUS_CHANGED = "RETURN_STATUS_CHANGED",
  RETURN_ITEM_CANCELED = "RETURN_ITEM_CANCELED",

  //for badge
  BADGE_EARNED = "BADGE_EARNED"
}

export interface IQuesAns {
  id: string
  questioner: IUser
  question: string
  answer: string | null
  createdAt: Date
  answeredAt: Date | null
}

export interface IFolow {
  id: string,
  followerId: string,
  followingId: string
  follower: IUser
  following: IUser
}

export interface Addresses {
  buyingAddress: IBillingDetails | null,
  sellingAddress: IBillingDetails | null
}

export interface IBillingDetails {
  country: string,
  countryCode: string,
  full_name: string,
  address1: string,
  address2?: string,
  zip_code: string,
  state: string,
  city: string,

  email: string | null

  contact: string
}

export interface ILoggedInUser {
  exp: string;
  iat: string;
  role: UserRole;
  userId: string;
}

export interface IWishListData {
  id: string;
  userId: string;
  productId: string;
  createdAt: string;
  product: IProduct;
}

export interface IMeta {
  total: number,
  totalPage: number,
  page: number,
  limit: number,
}

export type TThanksMessageType = "SELL" | "DIRECT" | "CLOTH";

export interface IDonationThanksMsg {
  id: string;
  donorId: string;
  sellDonationId?: string | null;
  directDonationId?: string | null;
  clothDonationId?: string | null;
  message: string;
  msgType: TThanksMessageType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ISelldonation {
  id: string,
  amount: number,
  percent: number,
  extra_money: number,
  isAnonymous: boolean,
  total_amount: number,
  status: SellDonationStatus,
  createdAt: Date,
  orderItemId: string,
  charityId: string,
  charity: IUser,
  orderItem: IOrderItem,
  donatedAt: Date | null,
  thanksMessage?: IDonationThanksMsg | null,
  thanksMsg?: IDonationThanksMsg | null,
}

enum SellDonationStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED"
}

export interface IDirectDonation {
  id: string

  donorId: string | null
  donor: IUser | null

  charityId: string
  charity: IUser

  amount: number
  currency: string

  // anonymous donation
  isAnonymous: boolean

  // donor message
  message: string | null

  donatedAt: Date | null
  createdAt: Date
  thanksMsg?: IDonationThanksMsg | null
  thanksMessage?: IDonationThanksMsg | null
}

export interface ITreeDonation {
  id: string

  treeCredit: number,
  createdAt: Date,
}

export interface ICourierServiceRates {
  total_charge: number,
  min_delivery_time: number,
  max_delivery_time: number,
  courier_service: { name: string, logo: string, id: string }
}[]

export type OrderSummeryType = {
  itemTotal: number,
  subTotal: number,
  serviceFeeCost: number,
  bundleDiscountPercent: number,
  bundleDiscountAmount: number,
  totalExtraDonation: number,
  itemsCount: number,
  haveAnyUnavailableItems: boolean,
}

export interface IOrder {
  id: string,
  orderNumber: string,
  buyerId: string,
  buyer: IUser,

  itemsTotal: number,
  totalPrice: number,
  totalDelivery: number,
  authenticationFee: number,
  serviceFee: number,
  treeCredit: number,

  sellerTotal: number,
  sellerItemsTotal: number,

  items: IOrderItem[]

  status: OrderStatus
  currentShipTo: CurrentShipTo
  authStatus: OrderAuthStatus

  pricingSource: OrderPricingSource

  sellerId: string,
  seller: IUser,

  originDetailsId: string,
  originDetails: IBillingDetails, //origin address

  billingDetails: IBillingDetails, //destination address
  createdAt: Date,

  extraDonation: number,
  allowedAuthentication: boolean,

  bundleDiscountPercent: number,

  shipmentId: string,
  shipment: IShipment

  authShipmentId: string | null,
  authShipment: IShipment | null,

  payment: IPayment | null,
}

enum OrderPricingSource {
  OFFER = "OFFER",
  BUNDLE = "BUNDLE",
}

export enum CurrentShipTo {
  AUTHENTICATION_CENTER = "AUTHENTICATION_CENTER",
  BUYER = "BUYER"
}

export enum OrderStatus {
  PENDING = "PENDING",
  SHIPPING = "SHIPPING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum OrderAuthStatus {
  NOT_STARTED = "NOT_STARTED",
  ITEM_RECEIVED = "ITEM_RECEIVED",
  IN_PROGRESS = "IN_PROGRESS",
  RESPONDED = "RESPONDED",
}

export enum OrderAuthResult {
  NOT_PROCESSED = "NOT_PROCESSED",
  PASSED = "PASSED",
  FAILED = "FAILED"
}

enum BuyerRequestCancelStatus {
  NOT_REQUESTED = "NOT_REQUESTED",
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface IOrderItem {
  id: string,
  productId: string,
  product: IProduct,
  quantity: number,
  unitPrice: number,
  unitAllocatedPrice: number,
  sellerFinalUnitPrice: number,
  totalPrice: number,
  buyerRequestCancel: BuyerRequestCancelStatus,
  authResult: OrderAuthResult,
  isCancelled: boolean,

  extra_donation: number,

  sell_donation: number,

  cancelledBy: CancelledBy
  cancelReason: CancelReason
  cancelReasonDetails: string | null
  // for attach photo or videos as reason
  cancelEvidences: { url: string, key: string, id: string }[]

}

export enum CancelledBy {
  SELLER = "SELLER",
  BUYER = "BUYER",
  SYSTEM = "SYSTEM"
}

// types.ts (or wherever OrderStatus is defined)

export enum CancelReason {
  CHANGED_MIND = "CHANGED_MIND",
  FOUND_BETTER_PRICE = "FOUND_BETTER_PRICE",
  ORDERED_BY_MISTAKE = "ORDERED_BY_MISTAKE",
  ITEM_NO_LONGER_NEEDED = "ITEM_NO_LONGER_NEEDED",
  DELIVERY_TOO_LONG = "DELIVERY_TOO_LONG",
  FOUND_BETTER_PRODUCT = "FOUND_BETTER_PRODUCT",
  WRONG_ITEM_SELECTED = "WRONG_ITEM_SELECTED",
  DUPLICATE_ORDER = "DUPLICATE_ORDER",
  SHIPPING_COST_TOO_HIGH = "SHIPPING_COST_TOO_HIGH",
  PAYMENT_ISSUE = "PAYMENT_ISSUE",
  SELLER_UNRESPONSIVE = "SELLER_UNRESPONSIVE",

  OUT_OF_STOCK = "OUT_OF_STOCK",
  UNABLE_TO_FULFILL_IN_TIME = "UNABLE_TO_FULFILL_IN_TIME",
  PRICING_ERROR = "PRICING_ERROR",
  BUYER_UNREACHABLE = "BUYER_UNREACHABLE",
  SUSPECTED_FRAUD = "SUSPECTED_FRAUD",
  SHIPPING_ADDRESS_ISSUE = "SHIPPING_ADDRESS_ISSUE",
  LISTING_ERROR = "LISTING_ERROR",
  BUYER_REQUESTED = "BUYER_REQUESTED",
  DAMAGED_INVENTORY = "DAMAGED_INVENTORY",
  PAYMENT_NOT_VERIFIED = "PAYMENT_NOT_VERIFIED",

  OTHER = "OTHER"
}

export enum SellerCancelReason {
  OUT_OF_STOCK = "OUT_OF_STOCK",
  UNABLE_TO_FULFILL_IN_TIME = "UNABLE_TO_FULFILL_IN_TIME",
  PRICING_ERROR = "PRICING_ERROR",
  BUYER_UNREACHABLE = "BUYER_UNREACHABLE",
  SUSPECTED_FRAUD = "SUSPECTED_FRAUD",
  SHIPPING_ADDRESS_ISSUE = "SHIPPING_ADDRESS_ISSUE",
  LISTING_ERROR = "LISTING_ERROR",
  BUYER_REQUESTED = "BUYER_REQUESTED",
  DAMAGED_INVENTORY = "DAMAGED_INVENTORY",
  PAYMENT_NOT_VERIFIED = "PAYMENT_NOT_VERIFIED",
  OTHER = "OTHER",
}

export interface IReview {
  id: string
  orderId: string
  fromUserId: string | null
  toUserId: string
  rating: number
  comment: string | null       // optional manual comment

  createdAt: Date

  order: IOrder
  fromUser: IUser
  toUser: IUser
}

export interface IBandleTier {
  id: string;
  itemCount: number;
  discountPercent: number;
}

export interface IChatUser {
  id: string,
  user1: IUser,
  user1Id: string,
  user2: IUser,
  user2Id: string,
  items: { product: IProduct, productId: string }[],
  messages: IMessage[],
  _count: { messages: number }
}

export interface IMessage {
  id: string;
  text?: string;
  files: {
    title: string | null,
    id: string
    key: string;
    url: string;
    type: "IMAGE" | "DOCUMENT"
  }[];
  type: "text" | "file"
  isSeen: boolean;
  chatId: string;
  senderId: string;
  sender: IUser;
  receiverId: string;
  receiver: IUser;
  createdAt: Date,
  offer: IOffer | null
}

export interface IOffer {
  id: string,
  buyerId: string,
  buyer: IUser,
  sellerId: string,
  seller: IUser,
  status: OfferStatus,
  createdAt: Date,
  updatedAt: Date,
  offerItems: IOfferItem[],

  offeredPrice: number,
  actualPrice: number,
  actionAt: Date | null,
  expiredAt: Date | null,
}

export interface IOfferItem {
  id: string,
  offerId: string,
  offer: IOffer,
  productId: string,
  product: IProduct,
  createdAt: Date,
  updatedAt: Date
}

export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED"
}

export interface IAssitedSellRequest {
  id: string,
  itemsTitle: string,
  itemsCount: number,
  contactNumber: string | null,
  itemsDetails: string | null,
  priceType: PriceType,
  targetPrice: number | null,
  additionalNotes: string | null,
  pictures: { id: string, url: string, key: string }[],
  charities: { id: string, charityId: string, charity: IUser }[],
  donationPct: number,
  donationAnonymous: boolean,
  deliveryCharge: number | null,
  status: AssistentSellStatus,
  listings: IProduct[],
  shipment: IShipment | null,
  sellerId: string,
  seller: IUser,
  createdAt: Date,
  updatedAt: Date
}

export enum AssistentSellStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  LISTED = "LISTED"
}

export enum PriceType {
  TARGET_AMOUNT = "TARGET_AMOUNT",
  DISCUSSION = "DISCUSSION",
  MARKET_PRICE = "MARKET_PRICE"
}

export interface IBadge {
  id: string,
  name: string,
  description: string,
  icon: string,
  type: IBadgeType,
  target: number,
  progress: number,
  isCompleted: true,
}

export enum IBadgeType {
  FASHION_PHILANTHROPIST = "FASHION_PHILANTHROPIST",
  STYLE_STARTER = "STYLE_STARTER",
  FIRST_PURCHASE = "FIRST_PURCHASE",
  MONEY_DONOR = "MONEY_DONOR",
  ECO_HERO = "ECO_HERO",
  FIRST_SALE = "FIRST_SALE",
  TREE_PLANTER = "TREE_PLANTER",
  CLOTHING_DONOR = "CLOTHING_DONOR",
  FREQUENT_SELLER = "FREQUENT_SELLER",
  TOP_BUYER = "TOP_BUYER",
  SPEEDY_SHIPPER = "SPEEDY_SHIPPER",
  FASHION_ACTIVIST = "FASHION_ACTIVIST",
  TRUSTED_SELLER = "TRUSTED_SELLER",
  CHARITY_SUPPORTER = "CHARITY_SUPPORTER",
  SUSTAINABLE_MATERIALS = "SUSTAINABLE_MATERIALS",
  FAST_SHIPPER = "FAST_SHIPPER",
  TOP_ECO_SELLER = "TOP_ECO_SELLER",
  BUYERS_FAVOURITE = "BUYERS_FAVOURITE",
  CHARITY_CHAMPION = "CHARITY_CHAMPION",
  TOP_CHARITY_FUNDRAISER = "TOP_CHARITY_FUNDRAISER",
  VINTAGE_COLLECTION = "VINTAGE_COLLECTION",
}

export interface IPayment {
  id: string,

  orderId: string,
  order: IOrder,

  status: PaymentStatus

  stripe_status: StripePaymentStatus

  createdAt: Date,
  updatedAt: Date
}

export enum PaymentStatus {
  PENDING = "PROCESSING",
  SUCCESSED = "SUCCESSED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export enum StripePaymentStatus {
  PENDING = "PENDING",
  ESCROWED = "ESCROWED",
  RELEASED = "RELEASED",
  REFUNDED = "REFUNDED"
}

export interface IWalletPayout {
  id: string,
  walletId: string,
  amount: number,
  stripePayoutId: string | null,
  status: PayoutStatus,
  paidAt: Date | null,
  connectAccountId: string,
  stripeBalanceTransactionId: string | null,
  payoutData: any | null,
  userId: string,
  createdAt: Date,
  updatedAt: Date
}

export enum PayoutStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED"
}

export interface IShipment {
  id: string,
  order: IOrder | null,
  authOrder: IOrder | null,
  assitentSellId: string | null,
  assitentSell: IAssitedSellRequest | null,
  returnId: string | null,
  // return: IReturn | null,
  courier_service_id: string,
  shippingId: string,
  isLebelGenerated: boolean,
  lebelUrl: string | null,
  parcelId: string | null,
  trackingNumber: string | null,
  trackingUrl: string | null,
  deliveryCharge: number,
  originId: string,
  origin: IBillingDetails,
  destinationId: string,
  destination: IBillingDetails,
  status: ShipmentStatus,
  events: IShipmentEvent[],
  createdAt: Date,
  updatedAt: Date
}

export enum ShipmentStatus {
  PENDING = "PENDING",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface IShipmentEvent {
  id: string,
  shipmentId: string,
  shipment: IShipment,
  shipmentStatus: ShipmentStatus,
  eventType: string,
  eventDescription: string | null,
  eventLocation: string | null,
  eventTime: Date,
  createdAt: Date,
  updatedAt: Date
}