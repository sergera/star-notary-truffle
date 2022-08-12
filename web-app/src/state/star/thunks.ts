import { createAsyncThunk } from '@reduxjs/toolkit';

import { backend } from '../../apis';

import { STAR_SORT_TYPES, PAGE_SIZE } from '../../constants';

import { Star, BackendStar, StarRange } from './starSlice.types';
import { RootState } from '..';

export const getStars = createAsyncThunk<
	void, // return type
	void, // first argument type
	{ state: RootState }
>(
	"star/getStars",
	async(_,thunkAPI) => {
		let { getState, dispatch } = thunkAPI;
		const starState = getState().star;
		const range = getRange(starState.page);
		switch (starState.sort) {
			case STAR_SORT_TYPES.newest:
				dispatch(getStarRange({start: range.start, end: range.end, oldestFirst: false}));
				break;
			case STAR_SORT_TYPES.oldest:
				dispatch(getStarRange({start: range.start, end: range.end, oldestFirst: true}));
				break;
			default:
				dispatch(getStarRange({start: range.start, end: range.end, oldestFirst: false}));
		}
	}
);

export const getStarRange = createAsyncThunk<
	Star[], // return type
	{ start: number, end: number, oldestFirst: boolean }, // first argument type
	{ state: RootState }
>(
	"star/getRange",
	async(range,_) => {
		let res = await backend.get('/star-range', {
			params: {
				start: range.start,
				end: range.end,
				"oldest-first": range.oldestFirst,
			}
		});

		return convertStarList(res.data);
	}
);

const getRange = (page: number): StarRange => {
	if(page === 1) {
		return {start: 1, end: PAGE_SIZE + 1};
	} else {
		return {start: (PAGE_SIZE * (page - 1)) + 1, end: ((PAGE_SIZE * (page - 1)) + 1) + PAGE_SIZE};
	}
};

const convertStarList = (backendStars: BackendStar[]): Star[] => {
	return backendStars.map((star: BackendStar): Star => {
		return {
			tokenId: star.token_id,
			name: star.name,
			coordinates: star.coordinates,
			owner: star.owner,
			priceInEther: star.price,
			isForSale: star.is_for_sale,
			date: star.date
		}
	});
};
