import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (data) => ({
        url: "/Authentication/login",
        method: "POST",
        body: data,
      }),
      transformResponse: (res) => {
        console.log(res);
        return res.data;
      },
      invalidateTags: ["Auth"],
    }),
    customerRegister: build.mutation({
      query: (data) => ({
        url: "/Authentication/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (res) => res,
      invalidateTags: ["Auth"],
    }),
    confirmEmail: build.query({
      query: (params) => ({
        url: "/Authentication/confirm-email",
        method: "GET",
        params,
      }),
    }),
    refreshToken: build.mutation({
      query: (body) => ({
        url: "/Authentication/refresh-token",
        method: "POST",
        body,
      }),
    }),
    resendEmail: build.mutation({
      query: (body) => ({
        url: "/Authentication/resend-confirmation",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: build.mutation({
      query: (body) => ({
        url: "/Authentication/forgot-password",
        method: "POST",
        body,
      }),
    }),
    resetPassword: build.mutation({
      query: (body) => ({
        url: "/Authentication/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useCustomerRegisterMutation,
  useConfirmEmailQuery,
  useRefreshTokenMutation,
  useResendEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi;
