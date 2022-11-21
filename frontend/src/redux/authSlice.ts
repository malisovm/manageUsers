import { createSlice } from '@reduxjs/toolkit'

const initialState = {status: false, user: ''}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticated(state, action) {
      return (state = action.payload)
    },
  },
})

export const { authenticated } = authSlice.actions

export default authSlice.reducer
