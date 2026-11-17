import { ISizeGroupItem } from "@/types";
import { tagTypes } from "../tagTypes";
import { baseApi } from "./baseApi";

const sizeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // same endpoint, new grouped shape (letter group first); used by the listing forms
        getSizeGroups: builder.query<{ data: ISizeGroupItem[] }, { categoryId?: string }>({
            query: (query) => ({
                url: "/sizes",
                method: "GET",
                params: query
            }),
            providesTags: [tagTypes.size],
        }),
    }),
});

export const { useGetSizeGroupsQuery } = sizeApi;
