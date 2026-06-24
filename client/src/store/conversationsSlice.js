import { createSlice } from '@reduxjs/toolkit';

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState: {
    conversations: [],
    activeId: null,
    isLoading: false
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
      state.isLoading = false;
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload);
    },
    setActiveConversation: (state, action) => {
      state.activeId = action.payload;
    },
    updateConversationTitle: (state, action) => {
      const { id, title } = action.payload;
      const conv = state.conversations.find(c => c.id === id);
      if (conv) conv.title = title;
    },
    setConvLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  },
});

export const { 
  setConversations, addConversation, setActiveConversation, 
  updateConversationTitle, setConvLoading 
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
