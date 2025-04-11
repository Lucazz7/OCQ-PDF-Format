import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LaudoAnaliseProps } from "../../components/LaudoAnalise";

export const pdfApi = createApi({
  reducerPath: "pdfApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:30032/api" }),
  endpoints: (builder) => ({
    uploadPdf: builder.mutation<LaudoAnaliseProps, FormData>({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const { useUploadPdfMutation } = pdfApi;
