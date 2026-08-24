import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  photo: '',

  // Add authLoading - When navigating to MemberExclusive, signed-in user check can take some time,
  //  so wait for it.
  authLoading: true,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLoginDetails: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.photo = action.payload.photo;
      state.authLoading = false; // Auth check complete
    },

    setSignOutState: (state) => {
      state.name = null;
      state.email = null;
      state.photo = null;
      state.authLoading = false; // Auth check complete
    },
  },
});

// Actions
export const { setUserLoginDetails, setSignOutState } = userSlice.actions;

// Selects
export const selectUserName = (state) => state.user.name;
export const selectEmail = (state) => state.user.email;
export const selectPhoto = (state) => state.user.photo;
export const selectAuthLoading = (state) => state.user.authLoading;

// Default Export
export default userSlice.reducer;
