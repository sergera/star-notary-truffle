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
			coordinates: {
				rightAscension: {
					hours: star.coordinates.substring(0,2),
					minutes: star.coordinates.substring(2,4),
					seconds: star.coordinates.substring(4,9),
				},
				declination: {
					degrees: star.coordinates.substring(9,12),
					arcMinutes: star.coordinates.substring(12,14),
					arcSeconds: star.coordinates.substring(14),
				},
			},
			owner: star.owner,
			priceInEther: formatPriceString(star.price),
			isForSale: star.is_for_sale,
			date: star.date.substring(0,10),
			time: star.date.substring(11,19),
		}
	});
};

const formatPriceString = (price: string): string => {
	for (var i = price.length - 1; i >= 0; i--) {
		if(price[i] === "0") {
			price = price.slice(0, -1);
		} else if(price[i] === ".") {
			price = price.slice(0, -1);
			break;
		} else {
			break;
		}
	}
	return price;
};
