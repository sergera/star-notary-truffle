import { Star } from "../../state/star/starSlice.types";

export interface StarsProps {
	getStars: Function;
	displayList: Star[];
	showWelcome: boolean;
	closeWelcome: Function;
};
