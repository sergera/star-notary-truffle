export const CONTRACTS = {
	starNotary: "StarNotary",
};

export const CONTRACT_FUNCTIONS = {
	[CONTRACTS.starNotary]: {
		tx: {
			create: "createStar",
			putForSale: "putStarUpForSale",
			removeFromSale: "removeStarFromSale",
			purchase: "purchaseStar",
			changeName: "changeStarName",
		},
		simple: {
			totalSupply: "totalSupply",
			ownerOf: "ownerOf",
			balanceOf: "balanceOf",
			tokenIdToSalePrice: "tokenIdToSalePrice",
			coordinatesToTokenId: "coordinatesToTokenId",
			nameToTokenId: "starNameToTokenId",
		},
	},
};
