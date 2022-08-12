import { Star } from "../../state/star/starSlice.types";

export interface StarsProps {
	getStars: Function;
	displayList: Star[];
	page: number;
	nextPage: Function;
	previousPage: Function;
	nextPageExists: boolean;
	previousPageExists: boolean;
};
