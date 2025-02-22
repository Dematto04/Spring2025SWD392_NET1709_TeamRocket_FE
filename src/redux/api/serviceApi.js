import { apiSlice } from "./apiSlice";



const serviceApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getServices: build.query({
            query: ()=> ({
                url: "/HomeService"
            }),
            providesTags: ["Services"]
        }),
        getServicesDetail: build.query({
            query: (id)=> ({
                url: `/HomeService/${id}/details`,
            }),
            providesTags: ["ServiceDetail"]
        }),
        getServicesPrice: build.query({
            query: (id)=> ({
                url: `/HomeService/${id}/prices`,
            }),
            providesTags: ["ServiceDetail"]
        }),
    })
})

export const { useGetServicesQuery, useGetServicesDetailQuery, useGetServicesPriceQuery } = serviceApi