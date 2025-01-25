import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'
const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.example.com' }),
    endpoints: () => ({})
})

export default apiSlice