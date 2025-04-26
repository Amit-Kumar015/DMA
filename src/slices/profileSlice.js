// redux/slices/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  Profile: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.Profile = action.payload;
    },
    clearProfile(state) {
      state.Profile = null;
    },
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
