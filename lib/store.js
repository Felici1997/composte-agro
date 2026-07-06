import { configureStore } from '@reduxjs/toolkit'
import adsReducer from './features/ads/adsSlice'
import favoritesReducer from './features/favorites/favoritesSlice'
import authReducer from './features/auth/authSlice'
import cartReducer from './features/cart/cartSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      ads: adsReducer,
      favorites: favoritesReducer,
      auth: authReducer,
      cart: cartReducer,
    },
  })
}
