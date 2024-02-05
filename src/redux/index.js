 /* eslint-disable */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AuthReducer from './slices/authSlice';


const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const CombinedReducers = combineReducers({
  
  auth: AuthReducer,

});

const PersistedReducer = persistReducer(persistConfig, CombinedReducers);

export const DataStore = configureStore({
  reducer: PersistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const PersistDataStore = persistStore(DataStore);