import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

export const someApi = createApi({
  reducerPath: "someApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://192.168.0.102:3000/" }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userdata) => ({
        url: "signup",
        method: "POST",
        body: userdata,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = someApi;
