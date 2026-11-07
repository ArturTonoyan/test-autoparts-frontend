import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  number: '',
  brand: null,
  step: 'idle', // idle | brands | offers
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setNumber(state, action) {
      state.number = action.payload
      state.brand = null
      state.step = 'brands'
    },
    selectBrand(state, action) {
      state.brand = action.payload
      state.step = 'offers'
    },
    clearBrand(state) {
      state.brand = null
      state.step = state.number ? 'brands' : 'idle'
    },
    resetSearch() {
      return initialState
    },
  },
})

export const { setNumber, selectBrand, clearBrand, resetSearch } = searchSlice.actions
export default searchSlice.reducer
