import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ILaudoAnnalistic } from "../../interface/ILaudoAnnalistic";

export const pdfApi = createApi({
  reducerPath: "pdfApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://api-ocq.biofy.tech" }),
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
