import { apiSlice } from "./apiSlice";

const serviceApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getServices: build.query({
      query: (params) => ({
        url: "/Service",
        params,
      }),
      providesTags: ["Services"],
    }),
    getServicesDetail: build.query({
      query: (id) => ({
        url: `/Service/${id}`,
      }),
      providesTags: ["ServiceDetail"],
    }),
    getServicesPrice: build.query({
      query: (id) => ({
        url: `/HomeService/${id}/prices`,
      }),
      providesTags: ["ServiceDetail"],
    }),
    getCategories: build.query({
      query: () => ({
        url: `/Service/Categories`,
      }),
      providesTags: ["Categories"],
    }),
    createService: build.mutation({
      query: (body) => ({
        url: `/Service`,
        method: 'POST',
        body
      }),
      invalidatesTags: ["Services"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServicesDetailQuery,
  useGetServicesPriceQuery,
  useGetCategoriesQuery,
  useCreateServiceMutation
} = serviceApi;
