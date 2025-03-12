import { apiSlice } from "./apiSlice";

const ratingApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    // Create a new rating
    createRating: build.mutation({
      query: (body) => ({
        url: '/Rating',
        method: 'POST',
        body: {
          rating: body.rating,
          review: body.review,
          "cleaning-service-id": body["cleaning-service-id"],
          "booking-id": body["booking-id"]
        }
      }),
      invalidatesTags: ['Ratings', 'Booking']
    }),

    // Get customer's ratings
    getCustomerRatings: build.query({
      query: ({ pageIndex , pageSize }) => ({
        url: `/Rating/customer`,
        params: {
          pageIndex,
          pageSize
        }
      }),
      providesTags: ['Ratings']
    }),

    // Get service ratings
    getServiceRatings: build.query({
      query: ({ serviceId, pageIndex , pageSize }) => ({
        url: `/Rating/service/${serviceId}`,
        params: {
          pageIndex,
          pageSize
        }
      }),
      providesTags: ['Ratings']
    }),

    // Get filtered service ratings
    getFilteredServiceRatings: build.query({
      query: ({ serviceId, rate, pageIndex , pageSize}) => ({
        url: `/Rating/service/${serviceId}/filter`,
        params: {
          rate,
          pageIndex,
          pageSize
        }
      }),
      providesTags: ['Ratings']
    }),
  }),
});

export const {
  useCreateRatingMutation,
  useGetCustomerRatingsQuery,
  useGetServiceRatingsQuery,
  useGetFilteredServiceRatingsQuery
} = ratingApi;