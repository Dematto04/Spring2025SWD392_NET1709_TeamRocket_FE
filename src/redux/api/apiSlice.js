import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'
const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '' }),
    endpoints: () => ({})
})

export default apiSlice