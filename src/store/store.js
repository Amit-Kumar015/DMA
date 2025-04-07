import { configureStore } from '@reduxjs/toolkit';
import appReducer from "../slices/appSlice"
import  userReducer  from '../slices/userSlice';
import authReducer from "../slices/authSlice"
import authSlice from "../slices/authSlice"
const store = configureStore({
  reducer: {
    app: appReducer, // Add your reducers here
    user: userReducer,
    auth: authReducer,

  },
  
});
console.log('Redux Store:', store.getState());
export default store;
