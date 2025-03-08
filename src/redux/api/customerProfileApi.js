import { apiSlice } from "./apiSlice";

export const customerProfileApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    updateCustomerProfile: build.mutation({
      query: (data) => ({
        url: "/Customer/Profile",
        method: "PUT",
        body:data,
      }),
      invalidatesTags: ["Customer"],
    }),
    customerProfile: build.query({
      query: () => ({
        url: "/Customer/Profile",
        method: "GET",
      }),
      providesTags: ["Customer"]
    }),
  }),
});

export const {useCustomerProfileQuery, useUpdateCustomerProfileMutation} = customerProfileApi;