import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import tripReducer from './tripSlice';
import conversationsReducer from './conversationsSlice';
import notificationReducer from './notificationSlice';
import uiReducer from './uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    trip: tripReducer,
    conversations: conversationsReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
});

export default store;
