import { createSlice } from '@reduxjs/toolkit';

import { UserSlice } from './userSlice.types';

export const initialState: UserSlice = {
	showWelcome: true,
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		closeWelcome(state:UserSlice) {
			state.showWelcome = false;
		},
	},
});

export const { 
	closeWelcome,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
