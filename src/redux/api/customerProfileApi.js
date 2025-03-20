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
    updateProfileAvatar: build.mutation({
      query: (avatarUrl) => ({
        url: `/Customer/ProfileAvatar`,
        method: "PUT",
        params: { avatar: avatarUrl },
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {useCustomerProfileQuery, useUpdateCustomerProfileMutation, useUpdateProfileAvatarMutation} = customerProfileApi;