import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://invoi-cyborg.vercel.app/api/invo",
  }),
  endpoints: (builder) => ({
    createInvoice: builder.mutation({
      query: (data) => ({
        url: "/invoice",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://exam-server-7c41747804bf.herokuapp.com",
  }),
  endpoints: (builder) => ({
    getCarsList: builder.query({
      query: () => ({
        url: "/carsList",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCarsListQuery } = carApi;
export const { useCreateInvoiceMutation } = baseApi;
