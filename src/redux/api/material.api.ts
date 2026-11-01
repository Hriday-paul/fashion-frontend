import { IMaterial } from "@/types";
import { baseApi } from "./baseApi";

const materialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMaterials: builder.query<{ message: string; data: IMaterial[] }, { categoryId?: string }>({
            query: (query) => ({
                url: "/materials",
                method: "GET",
                params: query,
            }),
        }),
    }),
});

export const { useGetMaterialsQuery } = materialApi;

