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