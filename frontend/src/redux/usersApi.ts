import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { User } from '../interfaces'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  tagTypes: ['Users'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (arg: void) => '/Users',
      providesTags: ['Users'],
    }),

    addUser: builder.mutation({
      query: (payload: User) => ({
        url: '/users',
        method: 'POST',
        body: payload,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: ['Users'],
    }),

    blockUser: builder.mutation({
      query: (payload) => ({
        url: '/users/block',
        method: 'PUT',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          ids: JSON.stringify(payload.ids),
          active: payload.active,
        },
      }),
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation({
      query: (payload: string[]) => ({
        url: '/users',
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          ids: JSON.stringify(payload),
        },
      }),
      invalidatesTags: ['Users'],
    }),

    verifyUser: builder.mutation({
      query: (payload) => ({
        url: '/users/auth',
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          name: payload.name,
          password: payload.password,
        },
      }),
      invalidatesTags: ['Users'],
    }),

    isUserActive: builder.query({
      query: (payload) => ({
        url: '/users/status',
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          _id: payload
        },
      }),
    }),
  }),
})
export const {
  useGetUsersQuery,
  useVerifyUserMutation,
  useAddUserMutation,
  useBlockUserMutation,
  useDeleteUserMutation,
  useLazyIsUserActiveQuery
} = usersApi
