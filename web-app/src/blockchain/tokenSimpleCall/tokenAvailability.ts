import { simpleCall } from "../contracts";
import { stringToAsciiHex } from "../../format/string";

import { CONTRACTS, CONTRACT_FUNCTIONS } from "../../constants";

import { NameInUseArgs, CoordinatesInUseArgs } from "./tokenAvailability.types";

export const nameInUse = async ({
	name,
}:NameInUseArgs) => {
	const existingStarNameId = await simpleCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].simple.nameToTokenId,
		args: [stringToAsciiHex(name)],
	})

	if(existingStarNameId !== "0") {
		return true;
	}

	return false;
};

export const coordinatesInUse = async ({
	coordinates,
}:CoordinatesInUseArgs) => {
	const existingStarCoordinatesId = await simpleCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].simple.coordinatesToTokenId,
		args: [stringToAsciiHex(coordinates)],
	});

	if(existingStarCoordinatesId !== "0") {
		return true;
	}

	return false;
};
