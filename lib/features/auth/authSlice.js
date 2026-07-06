import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    profile: null,
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.loading = false
    },
    setProfile: (state, action) => {
      state.profile = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    logout: (state) => {
      state.user = null
      state.profile = null
    },
  }
})

export const { setUser, setProfile, setLoading, logout } = authSlice.actions
export default authSlice.reducer
