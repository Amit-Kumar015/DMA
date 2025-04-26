import { combineReducers } from '@reduxjs/toolkit';
import appReducer from '../slices/appSlice';
import authReducer from '../slices/authSlice';
import userReducer from '../slices/userSlice';
import profileReducer from '../slices/profileSlice';

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  user: userReducer,
  profile: profileReducer,
});

export default rootReducer;
