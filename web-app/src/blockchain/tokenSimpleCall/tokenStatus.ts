import { simpleCall } from "../contracts";

import { CONTRACTS, CONTRACT_FUNCTIONS } from "../../constants";

import { TokenForSaleArgs } from "./tokenStatus.types";

export const tokenForSale = async ({
	tokenId,
}:TokenForSaleArgs) => {
	const salePrice = await simpleCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].simple.tokenIdToSalePrice,
		args: [tokenId],
	})

	if(salePrice !== "0") {
		return true;
	}

	return false;
};
