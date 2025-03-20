import { apiSlice } from "./apiSlice";
import { format } from "date-fns";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getBookingHistory: build.query({
      query: ({ pageIndex, pageSize, status, day, month, year }) => {
        const params = {
          pageIndex,
          pageSize,
          status,
        };

        // Only add day, month, and year if they are not null
        if (day !== null && month !== null && year !== null) {
          params.day = day;
          params.month = month;
          params.year = year;
        }

        return {
          url: "/Booking/bookingHistory",
          method: "GET",
          params,
        };
      },
      providesTags: ["Booking"],
    }),

    getBookingDetail: build.query({
      query: (id) => ({
        url: `Booking/bookingDetail?id=${id}`,
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    getBookingCountHouseKeeper: build.query({
      query: () => ({
        url: "/Booking/bookingCountHouseKeeper",
        method: "GET",
      }),
      providesTags: ["Booking"],
    }),
    getBookingCountHousekeeper: build.query({
      query: () => ({
        url: "Booking/bookingCountHousekeeper",
      }),
      providesTags: ["Booking"],
    }),
    cancelBooking: build.mutation({
      query: (bookingId) => ({
        url: `Booking/cancelBooking`,
        method: "DELETE",
        params: { bookingId },
      }),
      invalidatesTags: ["Booking"],
    }),
    sendRefundRequest: build.mutation({
      query: ({ bookingId, proofOfPayment, reason }) => ({
        url: `Wallet/sendRefundRequest`,
        method: "POST",
        params: {
          bookingId,
          ProofOfPayment: proofOfPayment,
          Reason: reason,
        },
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookingCalendar: build.query({
      query: ({ referenceDate, viewMode }) => ({
        url: "/Booking/BookingListCalendar",
        method: "GET",
        params: {
          referenceDate: format(
            new Date(referenceDate),
            "yyyy-MM-dd'T'HH:mm:ss"
          ),
          viewMode,
        },
      }),
      providesTags: ["Booking"],
      transformResponse: (response) => {
        if (!response.isSucceed) {
          throw new Error(response.messages || "Failed to fetch calendar data");
        }
        return response.data;
      },
    }),
    getHousekeeperBookings: build.query({
      query: (params) => {
        const { page = 1, pageSize = 10, status } = params || {};
        let url = `/Booking/GetHousekeeperBookings?page=${page}&pageSize=${pageSize}`;

        // Add status filter if provided
        if (status) {
          url += `&status=${status}`;
        }

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Booking"],
    }),
    submitProof: build.mutation({
      query: (payload) => ({
        url: "/Booking/submit-proof",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Booking"],
    }),
    getHousekeeperBookings: build.query({
      query: (params) => {
        const { page = 1, pageSize = 10, status } = params || {};
        let url = `/Booking/GetHousekeeperBookings?page=${page}&pageSize=${pageSize}`;

        // Add status filter if provided
        if (status) {
          url += `&status=${status}`;
        }

        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Booking"],
    }),
    submitProof: build.mutation({
      query: (payload) => ({
        url: "/Booking/submit-proof",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetBookingHistoryQuery,
  useGetBookingDetailQuery,
  useGetBookingCountHouseKeeperQuery,
  useGetBookingCountHousekeeperQuery,
  useCancelBookingMutation,
  useSendRefundRequestMutation,
  useGetBookingCalendarQuery,
  useGetHousekeeperBookingsQuery,
  useSubmitProofMutation,
} = bookingApi;
