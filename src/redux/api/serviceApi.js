import { apiSlice } from "./apiSlice";



const serviceApi = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getServices: build.query({
            query: ()=> ({
                url: "/HomeService"
            }),
            providesTags: ["Services"]
        })
    })
})

export const { useGetServicesQuery } = serviceApi