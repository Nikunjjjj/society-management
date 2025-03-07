import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const someApi = createApi({
  reducerPath: 'someApi',
<<<<<<< HEAD
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/'
=======
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000' 
>>>>>>> c025f1e317e2784ba3f44d171f1bec59fb8893f2
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
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = someApi;