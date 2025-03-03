import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const someApi = createApi({
  reducerPath: 'someApi',
<<<<<<< Updated upstream
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/' 
=======
<<<<<<< Updated upstream
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/' 
=======
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:6000"
>>>>>>> Stashed changes
>>>>>>> Stashed changes
  }),

  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (userData) => ({
        url: '/signup',
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