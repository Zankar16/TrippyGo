import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripReducer from './tripSlice';
import conversationsReducer from './conversationsSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    trip: tripReducer,
    conversations: conversationsReducer,
    ui: uiReducer,
  },
});

export default store;
