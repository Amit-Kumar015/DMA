// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   user: null,
//   authtoken: null,
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUserData: (state, action) => {
//       state.user = action.payload.user;
//       // state.authtoken = action.payload.authtoken;
//     },
//     clearUserData: (state) => {
//       state.user = null;
//       state.authtoken = null;
//     },
//   },
// });

// export const { setUserData, clearUserData } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  businessProfile: null,
  personalProfile: null, // ✅ Add this
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setData: (state, action) => {
      state.user = action.payload;
    },
    setBusinessProfile: (state, action) => {
      state.businessProfile = action.payload;
    },
    setPersonalProfile: (state, action) => {
      state.personalProfile = action.payload; 
    },
  },
});

export const { setData, setBusinessProfile, setPersonalProfile } = authSlice.actions;
export default authSlice.reducer;
