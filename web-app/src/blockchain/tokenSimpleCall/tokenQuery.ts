import { simpleCall } from "../contracts";

import { CONTRACTS, CONTRACT_FUNCTIONS } from "../../constants";

import { TokenPriceArgs } from "./tokenQuery.types";

export const tokenPrice = async ({
	tokenId,
}:TokenPriceArgs) => {
	const salePrice = await simpleCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].simple.tokenIdToSalePrice,
		args: [tokenId],
	})

	return salePrice;
};
