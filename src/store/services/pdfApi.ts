import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ILaudoAnnalistic } from "../../interface/ILaudoAnnalistic";

export const pdfApi = createApi({
  reducerPath: "pdfApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.50.220:8000" }),
  endpoints: (builder) => ({
    uploadPdf: builder.mutation<ILaudoAnnalistic, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useUploadPdfMutation } = pdfApi;
