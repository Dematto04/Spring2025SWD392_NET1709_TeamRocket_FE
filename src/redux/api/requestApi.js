import { apiSlice } from "./apiSlice";

export const requestApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
      getPendingRequest: build.query({
        query: () => ({
          url: "Request/service-pending-request",
          method: "GET",
        }),
        providesTags: ["Request"],
      }),
      getStaffApprovedRequest: build.query({
        query: () => ({
          url: "Staff/staff-requests-approved",
          method: "GET",
        }),
        providesTags: ["Request"],
      }),
      getPendingRequestDetail: build.query({
        query: (id) => ({
          url: `Request/service-pending-request/${id}`,
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
    }),
    getRefundRequests: build.query({
      query: (params) => ({
        url: 'Wallet/getRefundRequest',
        params: {
          search: params.search,
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
          status: params.status,
        },
      }),
      providesTags: ['RefundRequest'],
    }),
    getRefundRequestDetail: build.query({
      query: (refundRequestId) => ({
        url: 'Wallet/getRefundRequestDetail',
        params: { refundRequestId },
      }),
      providesTags: ['RefundRequest'],
    }),
    }),
  });
  
  export const {
    useGetPendingRequestQuery,
    useGetPendingRequestDetailQuery,
    useAprroveNewRequestMutation,
    useGetStaffApprovedRequestQuery,
    useGetRefundRequestsQuery,
    useGetRefundRequestDetailQuery,
  } = requestApi;
  