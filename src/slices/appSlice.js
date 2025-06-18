'use strict';

import { createSlice } from '@reduxjs/toolkit';
import { themes } from '../utils/theme';

/**
 * Get system theme
 * @param {string} mode - 'light' | 'dark' | 'no-preference'
 * @returns {object} Theme
 */
// const getSystemTheme = (mode) => {
//   return themes.light;
// };
const getSystemTheme = (mode) => {
  if (mode === 'dark') return themes.dark;
  return themes.light;
};

/**
 * Set initial state for theme
 */
const initialState = {
  theme: getSystemTheme('light'),
};

/**
 * Create slice reducer and action creators
 */
const app = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme(state, action) {
      const { theme } = action.payload;
      state.theme = theme;
    },
  },
});

/**
 * Export action creators
 */
export const { setTheme } = app.actions;
export default app.reducer;
