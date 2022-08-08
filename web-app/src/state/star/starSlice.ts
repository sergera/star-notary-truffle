import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getStarRange } from './thunks';

import { StarSlice, Star } from './starSlice.types';

export const initialState: StarSlice = {
	displayList: [],
};

const starSlice = createSlice({
	name: "star",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getStarRange.fulfilled, (state, action: PayloadAction<Star[]>) => {
			let newStars = action.payload;
      state.displayList = newStars;
    });
  }
});

export const starReducer = starSlice.reducer;
