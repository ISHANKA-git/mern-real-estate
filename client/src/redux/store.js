import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const rootReducer = combineReducers({ user: userReducer })  // Combine all reducers here

const persistConfig = {
  key: 'root', // The key to store the persisted state under
  storage, // The storage to use  
  version: 1, // This is used to preserve the persisted state
}

const persistedReducer = persistReducer(persistConfig, rootReducer) // Create a new reducer with our existing reducer

export const store = configureStore({
  reducer: persistedReducer, 
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export const persistor = persistStore(store) // Create a persistor object