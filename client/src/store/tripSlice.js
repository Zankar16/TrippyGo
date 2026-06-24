import { createSlice } from '@reduxjs/toolkit';

const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    currentTrip: null, // { id, title, destination, budget, days: [ { items: [] } ] }
    isLoading: false,
  },
  reducers: {
    setCurrentTrip: (state, action) => {
      state.currentTrip = action.payload;
      state.isLoading = false;
    },
    clearCurrentTrip: (state) => {
      state.currentTrip = null;
    },
    setTripLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addActivity: (state, action) => {
      const { dayId, activity } = action.payload;
      if (state.currentTrip) {
        const day = state.currentTrip.days.find(d => d.id === dayId);
        if (day) day.items.push(activity);
      }
    },
    removeActivity: (state, action) => {
      const { dayId, activityId } = action.payload;
      if (state.currentTrip) {
        const day = state.currentTrip.days.find(d => d.id === dayId);
        if (day) day.items = day.items.filter(item => item.id !== activityId);
      }
    },
    updateActivity: (state, action) => {
      const { dayId, activity } = action.payload;
      if (state.currentTrip) {
        const day = state.currentTrip.days.find(d => d.id === dayId);
        if (day) {
          const index = day.items.findIndex(item => item.id === activity.id);
          if (index !== -1) day.items[index] = activity;
        }
      }
    },
    updateBudget: (state, action) => {
      if (state.currentTrip) {
        state.currentTrip.budget = action.payload;
      }
    },
    replaceTrip: (state, action) => {
      state.currentTrip = action.payload;
    }
  },
});

export const { 
  setCurrentTrip, clearCurrentTrip, setTripLoading, 
  addActivity, removeActivity, updateActivity, 
  updateBudget, replaceTrip 
} = tripSlice.actions;
export default tripSlice.reducer;
