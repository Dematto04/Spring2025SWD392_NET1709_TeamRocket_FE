import { apiSlice } from "./apiSlice";

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
    }),
  });
  
  export const {
    useGetBookingHistoryQuery,
    useGetBookingDetailQuery,
  } = bookingApi;
  