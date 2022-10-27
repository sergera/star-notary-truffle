import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getStarRange, formatPriceString } from './thunks';

import { StarSlice, Star, EventAction, BackendStar } from './starSlice.types';

import { STAR_SORT_TYPES, PAGE_SIZE_TYPES } from '../../constants';

export const initialState: StarSlice = {
	displayList: [],
	filter: "",
	sort: STAR_SORT_TYPES.newest,
	page: 1,
	pageSize: PAGE_SIZE_TYPES.twelve,
	nextPageExists: false,
	previousPageExists: false,
};

const starSlice = createSlice({
	name: "star",
	initialState,
	reducers: {
		nextPage(state: StarSlice) {
			state.page = state.page + 1;
		},
		previousPage(state: StarSlice) {
			if (state.page > 1) {
				state.page = state.page - 1;
			}
		},
		resetPagination(state: StarSlice) {
			state.page = 1;
		},
		choosePageSize(state: StarSlice, action: PayloadAction<number>) {
			const newPageSize = action.payload;
			if (state.page !== 1) {
				const firstStarNumber = ((state.page - 1) * state.pageSize) + 1;
				state.page = Math.floor(firstStarNumber / newPageSize) + 1;
			}
			state.pageSize = newPageSize;
		},
		chooseSort(state: StarSlice, action: PayloadAction<string>) {
			state.page = 1;
			state.sort = action.payload;
		},
		chooseFilter(state: StarSlice, action: PayloadAction<string>) {
			state.page = 1;
			state.filter = action.payload;
		},
		updateDisplay(state: StarSlice, action: PayloadAction<BackendStar[]>) {
			const backendStars = action.payload.filter((star) => star.action > EventAction.Create);
			for (let i = 0; i < backendStars.length; i++) {
				let idx = state.displayList.findIndex((star) => star.tokenId === backendStars[i].token_id);
				if (idx !== -1) {
					let updatedStar = backendStars[i];
					/* if star is in dispĺay list, update it */
					switch (updatedStar.action) {
						case EventAction.Purchase: {
							state.displayList[idx].owner.address = updatedStar.wallet.address;
							state.displayList[idx].owner.id = updatedStar.wallet.id;
							state.displayList[idx].isForSale = updatedStar.is_for_sale;
							break;
						}
						case EventAction.RemoveFromSale: {
							state.displayList[idx].isForSale = updatedStar.is_for_sale;
							break;
						}
						case EventAction.SetName: {
							state.displayList[idx].name = updatedStar.name;
							break;
						}
						case EventAction.SetPrice: {
							state.displayList[idx].isForSale = updatedStar.is_for_sale;
							state.displayList[idx].priceInEther = formatPriceString(updatedStar.price);
							break;
						}
						default: {
							continue;
						}
					}
				}
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getStarRange.fulfilled, (state: StarSlice, action: PayloadAction<Star[]>) => {
			const stars = action.payload;
			const starsNumber = stars.length;
			if (starsNumber === state.pageSize + 1) {
				state.nextPageExists = true;
				state.displayList = stars.slice(0, -1);
			} else {
				state.nextPageExists = false;
				state.displayList = stars;
			}

			if (state.page > 1) {
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
	choosePageSize,
	chooseSort,
	chooseFilter,
	updateDisplay,
} = starSlice.actions;


export const starReducer = starSlice.reducer;
