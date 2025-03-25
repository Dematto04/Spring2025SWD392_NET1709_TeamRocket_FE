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
    getPendingRequestPaging: build.query({
      query: (params) => ({
        url: "Request/service-pending-request-paging",
        method: "GET",
        params: {
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
        },
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
    getStaffApprovedRequestPaging: build.query({
      query: ({pageIndex, pageSize, status, searchByName}) => ({
        url: "/Staff/staff-requests-approved-paging",
        method: "GET",
        params: {
          pageIndex,
          pageSize,
          status,
          searchByName,
        },  
      }),
    }),
    getPendingRequestDetail: build.query({
      query: (id) => ({
        url: `Request/service-pending-request/${id}`,
        method: "GET",
      }),
      providesTags: ["Request"],
    }),
    aprroveNewRequest: build.mutation({
      query: (data) => ({
        url: "Request/approve-new-service",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Request"],
    }),
    getRefundRequests: build.query({
      query: (params) => ({
        url: "Wallet/getRefundRequest",
        params: {
          search: params.search,
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
          status: params.status,
        },
      }),
      providesTags: ["RefundRequest"],
    }),
    getRefundRequestDetail: build.query({
      query: (refundRequestId) => ({
        url: "Wallet/getRefundRequestDetail",
        params: { refundRequestId },
      }),
      providesTags: ["RefundRequest"],
    }),
    // Process refund request (approve or reject)
    processRefund: build.mutation({
      query: ({ refundRequestId, action }) => ({
        url: "Wallet/processRefund",
        method: "POST",
        params: {
          refundRequestId,
          action,
        },
      }),
      invalidatesTags: ["RefundRequest"],
    }),
    getRegisterRequest: build.query({
      query: ({ pageIndex, pageSize }) => ({
        url: "/Request/registraton-requests",
        params: {
          pageIndex,
          pageSize,
        },
      }),
      providesTags: ["Request"],
    }),

    getRegisterRequestDetail: build.query({
      query: (housekeeperId) => ({
        url: `/Request/registraton-request-detail`,
        params: {
          housekeeperId,
        },
      }),
      providesTags: ["Request"],
    }),
    approveRegisterRequest: build.mutation({
      query: ({housekeeper_id, is_approve, reason}) => ({
        url: `/Request/approve-registration`,
        body: {
          housekeeper_id,
          is_approve,
          reason,
        },
        method: "PUT",
      }),
      invalidatesTags: ["Request"],
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
  useProcessRefundMutation,
  useGetRegisterRequestQuery,
  useGetRegisterRequestDetailQuery,
  useApproveRegisterRequestMutation,
  useGetPendingRequestPagingQuery,
  useGetStaffApprovedRequestPagingQuery
} = requestApi;
