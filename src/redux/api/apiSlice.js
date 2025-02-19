import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const customBaseQuery = () => {
    return fetchBaseQuery({baseUrl: import.meta.env.VITE_API_URL })
}
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: customBaseQuery(),
    tagTypes: ['Auth'],
    endpoints: () => ({}),
})