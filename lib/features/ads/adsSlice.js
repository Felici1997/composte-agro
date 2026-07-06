import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchAllAds } from '@/lib/supabase/queries'

export const loadAds = createAsyncThunk('ads/loadAds', async () => {
  const ads = await fetchAllAds()
  return ads
})

const adsSlice = createSlice({
  name: 'ads',
  initialState: {
    list: [],
    currentAd: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentAd: (state, action) => {
      state.currentAd = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAds.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadAds.fulfilled, (state, action) => {
        state.list = action.payload
        state.loading = false
      })
      .addCase(loadAds.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setCurrentAd } = adsSlice.actions
export default adsSlice.reducer
