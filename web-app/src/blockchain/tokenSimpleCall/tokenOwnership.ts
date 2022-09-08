import { simpleCall } from "../contracts";

import { CONTRACTS, CONTRACT_FUNCTIONS } from "../../constants";

import { TokenOwnedArgs } from "./tokenOwnership.types";

export const tokenOwned = async ({
	address,
	tokenId,
}:TokenOwnedArgs) => {
	const ownerAddress = await simpleCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].simple.ownerOf,
		args: [tokenId],
	})

	if(ownerAddress.toLowerCase() === address.toLowerCase()) {
		return true;
	}

	return false;
};
