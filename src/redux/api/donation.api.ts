import {
  ICourierServiceRates,
  IDirectDonation,
  IDonationThanksMsg,
  IMeta,
  ISelldonation,
  IShipment,
  TThanksMessageType,
} from "@/types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

export interface IContributionStats {
  totalSellDonationAmount: number;
  totalDirectDonationAmount: number;
}

export type TDonationType = "SINGLE" | "MULTIPLE";
export type TWashedType = "RECENT_WASHED" | "WASHED" | "UNWASHED";
export type TClothDonationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "COMPLETED";

export interface IClothDonationPhoto {
  id: string;
  donationId: string;
  url: string;
  key: string;
  createdAt: string;
  updatedAt: string;
}

export interface IClothDonationUser {
  id: string;
  userName: string;
  email: string;
  fname?: string;
  lname?: string | null;
  picture: { url: string; key: string } | null;
  charityThumbnail?: { url: string; key: string } | null;
}

export interface IClothDonation {
  id: string;
  photos: IClothDonationPhoto[];
  donorId: string;
  donor: IClothDonationUser;
  charityId: string;
  charity: IClothDonationUser;
  donationType: TDonationType;
  itemsCount?: string | null;
  itemTypes: string[];
  personTypes: string[];
  brands: string[];
  condition: string;
  washedType: TWashedType;
  description?: string | null;
  status: TClothDonationStatus;
  shipment?: IShipment | null;
  thanksMsg?: IDonationThanksMsg | null;
  thanksMessage?: IDonationThanksMsg | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRaisedDonationQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface ICharityRaisedStats {
  directDonationraised: number;
  extraDonationRaised: number;
  sellDonationRaised: number;
  totalRaised: number;
}

export interface IClothDonationQueryParams {
  page?: number;
  limit?: number;
  donationType?: string;
  status?: string;
  searchTerm?: string;
}

const donationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sellerSellCharitySupportStats: builder.query<
      {
        message: string;
        data: {
          sellDonatedAmount: number;
          avgSellDonationPercentage: number;
          totalCharitiesToSupport: number;
          donationsByCharity: {
            charityId: string;
            charityBio: string | null;
            charityName: string;
            lname: string;
            fname: string;
            userName: string;
            charityImage: string;
            totalDonation: number;
            productsSupported: number;
          }[];
        };
      },
      { userName: string }
    >({
      query: ({ userName }) => ({
        url: `/donations/seller-charity-support/${userName}`,
      }),
    }),

    getContributionStats: builder.query<
      {
        message: string;
        data: IContributionStats;
      },
      void
    >({
      query: () => ({
        url: "/donations/contribution-stats",
        method: "GET",
      }),
    }),

    getSellDonationContributed: builder.query<
      {
        message: string;
        data: ISelldonation[] | { data: ISelldonation[]; meta?: IMeta };
      },
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: "/donations/sell-contributed",
        method: "GET",
        params: params || undefined,
      }),
    }),

    getDirectDonationContributed: builder.query<
      {
        message: string;
        data: IDirectDonation[] | { data: IDirectDonation[]; meta?: IMeta };
      },
      Record<string, unknown> | void
    >({
      query: (params) => ({
        url: "/donations/direct-contributed",
        method: "GET",
        params: params || undefined,
      }),
    }),

    getMyClothDonations: builder.query<
      {
        message: string;
        data: { data: IClothDonation[]; meta: IMeta }
      },
      IClothDonationQueryParams | void
    >({
      query: (params) => ({
        url: "/cloth-donations/my-donations",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: [tagTypes.cloth_donation],
    }),

    getCharityClothDonations: builder.query<
      {
        message: string;
        data: { data: IClothDonation[]; meta: IMeta };
      },
      IClothDonationQueryParams | void
    >({
      query: (params) => ({
        url: "/cloth-donations/charity",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: [tagTypes.cloth_donation],
    }),

    updateClothDonationStatus: builder.mutation<
      {
        message: string;
        data: IClothDonation;
      },
      { id: string; status: "ACCEPTED" | "REJECTED" }
    >({
      query: ({ id, status }) => ({
        url: `/cloth-donations/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [tagTypes.cloth_donation],
    }),

    getSellDonationsRaisedList: builder.query<
      {
        message: string;
        data: { data: ISelldonation[]; meta: IMeta } | ISelldonation[];
        meta?: IMeta;
      },
      IRaisedDonationQueryParams | void
    >({
      query: (params) => ({
        url: "/donations/sell-raised-list",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: [tagTypes.cloth_donation],
    }),

    getDirectDonationsRaisedList: builder.query<
      {
        message: string;
        data: { data: IDirectDonation[]; meta: IMeta } | IDirectDonation[];
        meta?: IMeta;
      },
      IRaisedDonationQueryParams | void
    >({
      query: (params) => ({
        url: "/donations/direct-raised-list",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: [tagTypes.cloth_donation],
    }),

    getExtraDonationsRaisedList: builder.query<
      {
        message: string;
        data: { data: ISelldonation[]; meta: IMeta } | ISelldonation[];
        meta?: IMeta;
      },
      IRaisedDonationQueryParams | void
    >({
      query: (params) => ({
        url: "/donations/extra-raised-list",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: [tagTypes.cloth_donation],
    }),

    sendThanksMessage: builder.mutation<
      {
        message: string;
        data: IDonationThanksMsg;
      },
      {
        referenceId: string;
        msgType: TThanksMessageType;
        message: string;
      }
    >({
      query: (body) => ({
        url: "/donations/thanks-message",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.cloth_donation],
    }),

    getClothDonationShippingRates: builder.query<
      {
        message: string;
        data: { rates: ICourierServiceRates[] };
      },
      { donationReqId: string }
    >({
      query: ({ donationReqId }) => ({
        url: `/cloth-donations/shipment/rates/${donationReqId}`,
        method: "GET",
      }),
    }),

    payClothDonationShippingCost: builder.mutation<
      {
        message: string;
        data: string;
      },
      { donationReqId: string; shipmentServiceId: string }
    >({
      query: (body) => ({
        url: "/cloth-donations/shipment/checkout",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.cloth_donation],
    }),

    getClothDonationShippingLabel: builder.mutation<
      {
        message: string;
        data: string | { labelUrl?: string; url?: string };
      },
      { donationReqId: string }
    >({
      query: (body) => ({
        url: "/cloth-donations/label",
        method: "POST",
        body,
      }),
      invalidatesTags: [tagTypes.cloth_donation],
    }),

    getMemberSellDonationsRaised: builder.query<
      {
        message: string;
        data: { data: ISelldonation[]; meta: IMeta };
      },
      { userName: string; page?: number; limit?: number }
    >({
      query: ({ userName, ...params }) => ({
        url: `/donations/sell-raised/${userName}`,
        method: "GET",
        params: params || undefined,
      }),
    }),

    getMemberDirectDonationsRaised: builder.query<
      {
        message: string;
        data: { data: IDirectDonation[]; meta: IMeta };
      },
      { userName: string; page?: number; limit?: number }
    >({
      query: ({ userName, ...params }) => ({
        url: `/donations/direct-raised/${userName}`,
        method: "GET",
        params: params || undefined,
      }),
    }),

    getMemberExtraDonationsRaised: builder.query<
      {
        message: string;
        data: { data: ISelldonation[]; meta: IMeta };
      },
      { userName: string; page?: number; limit?: number }
    >({
      query: ({ userName, ...params }) => ({
        url: `/donations/extra-raised/${userName}`,
        method: "GET",
        params: params || undefined,
      }),
    }),

    getCharityRaisedStats: builder.query<
      {
        message: string;
        data: ICharityRaisedStats;
      },
      string
    >({
      query: (userName) => ({
        url: `/donations/charity-stats/${userName}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSellerSellCharitySupportStatsQuery,
  useGetContributionStatsQuery,
  useGetSellDonationContributedQuery,
  useGetDirectDonationContributedQuery,
  useGetMyClothDonationsQuery,
  useGetCharityClothDonationsQuery,
  useUpdateClothDonationStatusMutation,
  useGetSellDonationsRaisedListQuery,
  useGetDirectDonationsRaisedListQuery,
  useGetExtraDonationsRaisedListQuery,
  useSendThanksMessageMutation,
  useGetClothDonationShippingRatesQuery,
  usePayClothDonationShippingCostMutation,
  useGetClothDonationShippingLabelMutation,
  useGetMemberSellDonationsRaisedQuery,
  useLazyGetMemberSellDonationsRaisedQuery,
  useGetMemberDirectDonationsRaisedQuery,
  useLazyGetMemberDirectDonationsRaisedQuery,
  useGetMemberExtraDonationsRaisedQuery,
  useLazyGetMemberExtraDonationsRaisedQuery,
  useGetCharityRaisedStatsQuery,
  useLazyGetCharityRaisedStatsQuery,
} = donationApi;
