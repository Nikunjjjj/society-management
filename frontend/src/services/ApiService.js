import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const someApi = createApi({
  reducerPath: 'someApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:6000/'
  }),

  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: 'signup',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = someApi;