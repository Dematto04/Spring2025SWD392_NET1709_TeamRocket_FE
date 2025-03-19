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
    getHousekeeperProfile: build.query({
      query: () => ({
        url: "/Housekeeper",
      }),
      providesTags: ["HousekeeperProfile"],
    }),
  }),
});

export const {
  useGetHousekeeperProfileQuery,
} = meApi;
