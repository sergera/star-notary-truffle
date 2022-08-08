export interface Star {
	tokenId: string;
	name: string;
	coordinates: string;
	owner: string;
	isForSale: boolean;
	priceInEther: string;
	date: string;
};

export interface BackendStar {
	token_id: string;
	name: string;
	coordinates: string;
	owner: string;
	is_for_sale: boolean;
	price: string;
	date: string;
}

export interface StarSlice {
	displayList: Star[];
};
