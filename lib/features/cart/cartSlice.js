import { createSlice } from '@reduxjs/toolkit'

const loadCart = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('agrishop_cart')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addItem(state, action) {
      const item = action.payload
      const existing = state.items.find(i => i.id === item.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...item, quantity: 1 })
      }
      localStorage.setItem('agrishop_cart', JSON.stringify(state.items))
    },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload)
      localStorage.setItem('agrishop_cart', JSON.stringify(state.items))
    },
    incrementQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload)
      if (item) item.quantity += 1
      localStorage.setItem('agrishop_cart', JSON.stringify(state.items))
    },
    decrementQuantity(state, action) {
      const item = state.items.find(i => i.id === action.payload)
      if (item) {
        item.quantity -= 1
        if (item.quantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload)
        }
      }
      localStorage.setItem('agrishop_cart', JSON.stringify(state.items))
    },
    clearCart(state) {
      state.items = []
      localStorage.setItem('agrishop_cart', JSON.stringify(state.items))
    },
  },
})

export const { addItem, removeItem, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions
export const selectCartCount = state => state.cart.items.reduce((sum, i) => sum + i.quantity, 0)
export const selectCartTotal = state => state.cart.items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0)
export default cartSlice.reducer
