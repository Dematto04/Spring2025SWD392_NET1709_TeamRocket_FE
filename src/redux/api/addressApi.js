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
  }),
});

export const { useLazyAutoCompleteAddressQuery } = addressApi
