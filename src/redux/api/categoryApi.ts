import { IBrand, ICategory, IParcelSuggestion, ISizeItem } from "@/types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategory: builder.query<{ data: ICategory[] }, void>({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),
    getCategoryparentChain: builder.query<{ data: ICategory[] }, {}>({
      query: (query) => ({
        url: `/category/parent`,
        method: "GET",
        params: query,
      }),
    }),
    getCategorySize: builder.query({
      query: (id) => ({
        url: `/category/sizes/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),
    getCategoryBrands: builder.query({
      query: (id) => ({
        url: `/category/brands/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),
    filteredAttributes: builder.query<{
      data: {
        category: ICategory | null,
        sizeList: ISizeItem[],
        brandList: IBrand[]
      }
    }, {}>({
      query: (query) => ({
        url: `/category/filtered-attributes`,
        method: "GET",
        params: query,
      }),
    }),
    getParcelSuggestion: builder.query<{ data: IParcelSuggestion }, string>({
      query: (categoryId) => ({
        url: `/parcel-suggestions/${categoryId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCategoryQuery,
  useGetCategorySizeQuery,
  useGetCategoryBrandsQuery,
  useFilteredAttributesQuery,
  useGetCategoryparentChainQuery,
  useGetParcelSuggestionQuery,
} = categoryApi;
