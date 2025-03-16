import { apiSlice } from "./apiSlice";

const adminApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query({
      query: ({ 
        search,
        includeStaff,
        includeCustomers,
        includeHousekeepers,
        pageIndex,
        pageSize
      }) => ({
        url: '/Admin/user',
        params: {
          search,
          includeStaff,
          includeCustomers,
          includeHousekeepers,
          pageIndex,
          pageSize
        }
      }),
      providesTags: ['Users']
    }),

    getCleaningServices: build.query({
      query: ({ 
        search ,
        pageIndex,
        pageSize,
        day,
        month,
        year
      }) => ({
        url: '/Admin/cleaningService',
        params: {
          search,
          pageIndex,
          pageSize,
          day,
          month,
          year
        }
      }),
      providesTags: ['CleaningServices']
    }),

    getServiceCategories: build.query({
      query: ({ 
        search ,
        pageIndex ,
        pageSize ,
        day,
        month,
        year
      }) => ({
        url: '/Admin/serviceCategory',
        params: {
          search,
          pageIndex,
          pageSize,
          day,
          month,
          year
        }
      }),
      providesTags: ['ServiceCategories']
    }),

    getRevenueChartData: build.query({
      query: ({ 
        dayChart = false,
        weekChart = false,
        yearChart = false,
        yearsChart = false,
        dayStart,
        monthStart,
        yearStart,
        dayEnd,
        monthEnd,
        yearEnd
      }) => ({
        url: '/Admin/revenueChartData',
        params: {
          dayChart,
          weekChart,
          yearChart,
          yearsChart,
          dayStart,
          monthStart,
          yearStart,
          dayEnd,
          monthEnd,
          yearEnd
        }
      }),
    }),
    getBookingsAdminView: build.query({
      query: (params) => ({
        url: 'Admin/bookingsAdminView',
        params: {
          isService: params.isService,
          isCategory: params.isCategory ,
          Id: params.Id,
          pageIndex: params.pageIndex,
          pageSize: params.pageSize,
          status: params.status,
          day: params.day,
          month: params.month,
          year: params.year
        }
      }),
    }),
    getServiceCategoryChart: build.query({
      query: (params) => ({
        url: 'Admin/serviceCategoryChart',
        params: {
          dayChart: params.dayChart,
          yearChart: params.yearChart,
          yearsChart: params.yearsChart,
          dayStart: params.dayStart,
          monthStart: params.monthStart,
          yearStart: params.yearStart,
          dayEnd: params.dayEnd,
          monthEnd: params.monthEnd,
          yearEnd: params.yearEnd
        }
      })
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetCleaningServicesQuery,
  useGetServiceCategoriesQuery,
  useGetRevenueChartDataQuery,
  useGetBookingsAdminViewQuery,
  useGetTopServicesQuery,
  useGetServiceCategoryChartQuery,
} = adminApi;
