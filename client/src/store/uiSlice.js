import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    modals: {
      customiseTrip: false,
      addActivity: false,
      addExpense: false,
      inviteTripmates: false,
      documentPreview: null, // Stores document object when open
      publishGuide: false,
      travelDna: false,
      spotDetail: null, // Stores spot object when open
      confirmDelete: null // Stores deletion context { type, id, onConfirm }
    },
    toasts: []
  },
  reducers: {
    openModal: (state, action) => {
      const { name, data = true } = action.payload;
      if (state.modals.hasOwnProperty(name)) {
        state.modals[name] = data;
      }
    },
    closeModal: (state, action) => {
      const name = action.payload;
      if (state.modals.hasOwnProperty(name)) {
        state.modals[name] = false;
      }
    },
    addToast: (state, action) => {
      state.toasts.push({
        id: Date.now(),
        type: action.payload.type || 'info', // success, error, info, warning
        message: action.payload.message,
        action: action.payload.action || null
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    }
  },
});

export const { openModal, closeModal, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
