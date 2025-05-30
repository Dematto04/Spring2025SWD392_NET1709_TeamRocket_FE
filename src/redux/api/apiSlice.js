import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const customBaseQuery = () => {
  return fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("accessToken");
      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
};
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery(),
  tagTypes: [
    "Auth",
    "Customer",
    "Services",
    "ServiceDetail",
    "Booking",
    "Addresses",
    "Categories",
    "Request",
    "AdditionalServices",
    "Wallet",
    "RefundRequest",
    "HousekeeperProfile",
    "HousekeeperSkills",
    "HousekeeperService",
  ],
  endpoints: () => ({}),
});
