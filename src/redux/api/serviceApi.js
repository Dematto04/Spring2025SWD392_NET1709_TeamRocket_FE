import { apiSlice } from "./apiSlice";

const serviceApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getServices: build.query({
      query: (body) => ({
        url: "/Service/get-all-services",
        method: "POST",
        body,
      }),
      providesTags: ["Services"],
    }),
    getServicesDetail: build.query({
      query: (id) => ({
        url: `/Service/${id}`,
      }),
      providesTags: ["ServiceDetail"],
    }),
    getServicesPrice: build.query({
      query: (id) => ({
        url: `/HomeService/${id}/prices`,
      }),
      providesTags: ["ServiceDetail"],
    }),
    getCategories: build.query({
      query: () => ({
        url: `/Service/Categories`,
      }),
      providesTags: ["Categories"],
    }),
    createService: build.mutation({
      query: (body) => ({
        url: `/Service`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Services"],
    }),
    getAdditionalServices: build.query({
      query: (params) => ({
        url: `/Service/GetAllAdditionals`,
        params,
      }),
      providesTags: ["AdditionalServices"],
    }),
    getTimeSlots: build.mutation({
      query: (body) => ({
        url: `/Service/GetTimeSlots`,
        method: "POST",
        body,
      }),
    }),
    getServiceCheckoutDetail: build.mutation({
      query: (body) => ({
        url: `/Checkout`,
        method: "POST",
        body,
      }),
    }),
    placeOrderService: build.mutation({
      query: (body) => ({
        url: `/Payment/CreatePayment`,
        method: "POST",
        body,
      }),
    }),
    updateService: build.mutation({
      query: ({id, body}) => ({
        url: `/Service/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Services"],
    }),
    getMyServices: build.query({
      query: ({status, pageIndex, pageSize}) => ({
        url: "/Service/user/filter",
        params: {
          status,
          pageIndex,
          pageSize,
        },
      }),
    }),
    getMyServicesDetail: build.query({
      query: (id) => ({
        url: `/Service/detail/${id}`,
      }),
    }),
    getFilterOptions: build.query({
      query: () => ({
        url: "/Service/filter-options",
      }),
    }),
    getTopServices: build.query({
      query: (params) => ({
        url: 'Service/gettopservices',
        params: {
          dayTop: params.dayTop,
          weekTop: params.weekTop,
          yearTop: params.yearTop,
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
          dayStart: params.dayStart,
          monthStart: params.monthStart,
          yearStart: params.yearStart,
          dayEnd: params.dayEnd,
          monthEnd: params.monthEnd,
          yearEnd: params.yearEnd,
          search: params.search,
          topservice: params.topservice,
        }
      }),
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServicesDetailQuery,
  useGetServicesPriceQuery,
  useGetCategoriesQuery,
  useCreateServiceMutation,
  useGetAdditionalServicesQuery,
  useGetTimeSlotsMutation,
  useGetServiceCheckoutDetailMutation,
  usePlaceOrderServiceMutation,
  useUpdateServiceMutation,
  useGetMyServicesQuery,
  useGetMyServicesDetailQuery,
  useGetFilterOptionsQuery,
  useGetTopServicesQuery,
  
} = serviceApi;
