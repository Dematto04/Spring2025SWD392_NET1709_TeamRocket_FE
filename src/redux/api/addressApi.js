import { apiSlice } from "./apiSlice";

const url = import.meta.env.VITE_GOONG_URL;
const addressApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    autoCompleteAddress: build.query({
      query: (params) => ({
        url: `${url}/Place/AutoComplete`,
        params: {
          ...params,
          api_key: import.meta.env.VITE_GOONG_KEY,
        },
      }),
    }),
    getUserAddress: build.query({
      query: () => ({
        url: `/Address`,
      }),
    }),
    addUserAddress: build.mutation({
      query: (body) => ({
        url: `/Address`,
        method: "POST",
        body
      }),
    }),
  }),
});

export const { useLazyAutoCompleteAddressQuery, useGetUserAddressQuery, useAddUserAddressMutation } = addressApi
