import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pdfApi = createApi({
  reducerPath: "pdfApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  endpoints: (builder) => ({
    uploadPdf: builder.mutation<Blob, FormData>({
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
