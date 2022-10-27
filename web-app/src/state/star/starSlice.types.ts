export interface Star {
	tokenId: string;
	name: string;
	coordinates: {
		rightAscension: {
			hours: string;
			minutes: string;
			seconds: string;
		};
		declination: {
			degrees: string;
			arcMinutes: string;
			arcSeconds: string;
		};
	};
	owner: {
		address: string;
		id: string;
	};
	isForSale: boolean;
	priceInEther: string;
	date: string;
	time: string;
};

export interface BackendStar {
	token_id: string;
	name: string;
	coordinates: string;
	wallet: {
		address: string;
		id: string;
	};
	is_for_sale: boolean;
	price: string;
	date: string;
	action: EventAction;
};

export enum EventAction {
	Unknown = 0,
	Create,
	SetPrice,
	SetName,
	RemoveFromSale,
	Purchase,
};

export interface StarSlice {
	displayList: Star[];
	sort: string;
	filter: string;
	page: number;
	pageSize: number;
	nextPageExists: boolean;
	previousPageExists: boolean;
};

export interface StarRange {
	start: number;
	end: number;
};
