import { apiSlice } from "./apiSlice";

export const requestApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
      getPendingRequest: build.query({
        query: () => ({
          url: "Request/pending-request",
          method: "GET",
        }),
        providesTags: ["Request"],
      }),
      getPendingRequestDetail: build.query({
        query: (id) => ({
          url: `Request/pending-request/${id}`,
          method: "GET",
        }),
        providesTags: ["Request"],
      }),
      aprroveNewRequest: build.mutation({
        query:(data) =>({
            url: "Request/approve-new-service",
            method: "PUT", 
            body: data,
        }),
        invalidatesTags: ["Request"],
    })
    }),
  });
  
  export const {
    useGetPendingRequestQuery,
    useGetPendingRequestDetailQuery,
    useAprroveNewRequestMutation
  } = requestApi;
  