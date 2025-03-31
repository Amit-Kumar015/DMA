import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userData:null,
  isAuthenticated:false
};

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: { // Fix here
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
    },
  },
  // logoutUser: (state) => {
  //   state.userData = null;
  //   state.isAuthenticated = false;
  // }
});


// Export actions
export const { setUserData,logoutUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;
