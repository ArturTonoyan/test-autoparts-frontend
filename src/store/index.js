import { configureStore } from '@reduxjs/toolkit'
import searchReducer from './searchSlice'
import { readSearchState, writeSearchState } from './persistSearch'

const saved = readSearchState()

export const store = configureStore({
  reducer: {
    search: searchReducer,
  },
  preloadedState: saved ? { search: saved } : undefined,
})

store.subscribe(() => {
  writeSearchState(store.getState().search)
})
