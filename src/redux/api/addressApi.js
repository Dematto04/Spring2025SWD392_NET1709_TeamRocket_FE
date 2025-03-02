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
import { apiSlice } from "./apiSlice";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // GET: Fetch paginated list of addresses
    getAddresses: build.query({
      query: ({ pageIndex, pageSize}) => ({
        url: `Address?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        method: "GET",
      }),
      providesTags: ["Addresses"],
    }),

    // POST: Create a new address
    addAddress: build.mutation({
      query: (addressData) => ({
        url: "Address",
        method: "POST",
        body: addressData,
      }),
      invalidatesTags: ["Addresses"],
    }),

    // PUT: Update an existing address
    updateAddress: build.mutation({
      query: (addressData) => ({
        url: "Address",
        method: "PUT",
        body: addressData,
      }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
} = addressApi;