import { createAsyncThunk } from '@reduxjs/toolkit';

import { backend } from '../../apis';

import { Star, BackendStar } from './starSlice.types';
import { RootState } from '..';

export const getStarRange = createAsyncThunk<
	Star[], // return type
	{ start: number, end: number }, // first argument type
	{ state: RootState }
>(
	"star/getRange",
	async(range,_) => {
		let stars: Star[];

		let res = await backend.get('/star-range', {
			params: {
				start: range.start,
				end: range.end
			}
		})

		stars = res.data.map((star: BackendStar, idx: number): Star => {
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

		return stars;
	}
);
