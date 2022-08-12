import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getStarRange } from './thunks';

import { StarSlice, Star } from './starSlice.types';

import { STAR_SORT_TYPES, PAGE_SIZE } from '../../constants';

export const initialState: StarSlice = {
	displayList: [],
	filter: "",
	sort: STAR_SORT_TYPES.newest,
	page: 1,
	nextPageExists: false,
	previousPageExists: false,
};

const starSlice = createSlice({
	name: "star",
	initialState,
	reducers: {
		nextPage(state:StarSlice) {
			state.page = state.page + 1;
		},
		previousPage(state:StarSlice) {
			if(state.page > 1) {
				state.page = state.page - 1;
			}
		},
		resetPagination(state:StarSlice) {
			state.page = 1;
		},
		chooseSort(state:StarSlice, action:PayloadAction<string>) {
			state.page = 1;
			state.sort = action.payload;
		},
		chooseFilter(state:StarSlice, action:PayloadAction<string>) {
			state.page = 1;
			state.filter = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getStarRange.fulfilled, (state:StarSlice, action:PayloadAction<Star[]>) => {
			const stars = action.payload;
			const starsNumber = stars.length;
			if(starsNumber === PAGE_SIZE + 1) {
				state.nextPageExists = true;
				state.displayList = stars.slice(0,-1);
			} else {
				state.nextPageExists = false;
				state.displayList = stars;
			}

			if(state.page > 1) {
				state.previousPageExists = true;
			} else {
				state.previousPageExists = false;
			}
    });
  }
});

export const {
	nextPage,
	previousPage,
	resetPagination,
	chooseSort,
	chooseFilter,  
} = starSlice.actions;


export const starReducer = starSlice.reducer;
