// redux/slices/personalProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const ProfileSlice = createSlice({
  name: 'personalProfile',
  initialState: null,
  reducers: {
    setProfile: (state, action) => action.payload,
    clearPersonalProfile: () => null,
  },
});

export const { setProfile, clearPersonalProfile } = ProfileSlice.actions;
export default personalProfileSlice.reducer;
