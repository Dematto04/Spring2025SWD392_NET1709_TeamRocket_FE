import { apiSlice } from "./apiSlice";

const uploadFileApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    uploadFiles: build.mutation({
      query: (body) => ({
        url: "/Service/uploadMultiple",
        method: "POST",
        body,
        headers: {},
      }),
    }),
  }),
});

export const { useUploadFilesMutation } = uploadFileApi;
