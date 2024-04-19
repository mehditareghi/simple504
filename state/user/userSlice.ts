import { createSlice } from '@reduxjs/toolkit';

interface User {
  token: string;
  pk: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

type UserState = User | null;

const initialState: UserState = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => action.payload,
    clearUser: () => null,
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;