import { apiSlice } from "./apiSlice";

const meApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getServices: build.query({
      query: (params) => ({
        url: "/Address",
        params,
      }),
      providesTags: ["Services"],
    }),
  }),
});

export const {
 
} = serviceApi;
