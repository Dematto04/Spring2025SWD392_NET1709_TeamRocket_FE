import { apiSlice } from "./apiSlice";

const walletApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getWalletTransaction: build.query({
      query: ({ transactionType, pageIndex, pageSize, fullname, phonenumber, mail}) => {
        const params = {
          transactionType,
          pageIndex,
          pageSize,
        };

        // Only add fullname, phonenumber, and mail  if they are not null
        if (fullname !== null && phonenumber !== null && mail !== null) {
          params.fullname = fullname;
          params.phonenumber = phonenumber;
          params.mail = mail;
        }
        return {
          url: "/Wallet",
          method: "GET",
          params,
        };
      },
      providesTags: ["Wallet"],
    }),
    sendWithdrawRequest: build.mutation({
      query: ({ amount }) => ({
        url: `/Wallet/sendWithdrawRequest`,
        method: "POST",
        params: {
          amount
        },
      }),
      transformErrorResponse: (response) => {
        if (response.data) {
          return response;
        }
        return {
          data: {
            messages: {
              Error: [response.error]
            }
          }
        };
      },
      invalidatesTags: ["Wallet"],
    }),
    
    getBalance: build.query({
        query: () => ({
          url: "/Wallet/balance",
          method: "GET",
        }),
        providesTags: ["Wallet"],
      }),
      
      createDepositPayment: build.mutation({
      query: ({ amount, paymentMethod }) => ({
        url: `/Payment/CreateDepositPayment`,
        method: "POST",
        params: {
          amount,
          paymentMethod
        },
      }),
      invalidatesTags: ["Wallet"],
    }),

    processDeposit: build.mutation({
      query: ({ amount }) => ({
        url: `/Wallet/processDeposit`,
        method: "POST",
        params: {
          amount
        },
      }),
      invalidatesTags: ["Wallet"],
    }),

    processWithdraw: build.mutation({
      query: ({ transId, action }) => ({
        url: `/Wallet/processWithdraw`,
        method: "POST",
        params: {
          transId,
          action
        },
      }),
      invalidatesTags: ["Wallet"],
    }),

    getMoneyExchange: build.query({
      query: (amount) => ({
        url: '/Wallet/moneyExchange',
        params: { amount }
      }),
      providesTags: ['MoneyExchange']
    }),
    getRevenueHousekeeperChartData: build.query({
      query: ({ 
        dayRevenue = false,
        weekRevenue = false,
        yearRevenue = false,
        yearsRevenue = false,
        dayStart,
        monthStart,
        yearStart,
        dayEnd,
        monthEnd,
        yearEnd
      }) => ({
        url: '/Wallet/revenueHousekeeperData',
        params: {
          dayRevenue,
          weekRevenue,
          yearRevenue,
          yearsRevenue,
          dayStart,   
          monthStart,
          yearStart,
          dayEnd,
          monthEnd,
          yearEnd
        }
      }),
    }),
    getHousekeeperEarnings: build.query({
      query: ({ pageIndex, pageSize, day, month, year }) => ({
        url: '/Housekeeper/earnings',
        method: 'GET',
        params: {
          pageIndex,
          pageSize,
          day,
          month,
          year
        }
      }),
    }),
  }), 
});

export const { useGetWalletTransactionQuery,
   useSendWithdrawRequestMutation, 
   useGetBalanceQuery, 
   useCreateDepositPaymentMutation, 
   useProcessDepositMutation,
   useProcessWithdrawMutation,
   useGetMoneyExchangeQuery,
   useGetRevenueHousekeeperChartDataQuery,
  useGetHousekeeperEarningsQuery } = walletApi;