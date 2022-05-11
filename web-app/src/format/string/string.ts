/********
 * Format strings for submission
 * 
 */

import { utils } from "../../blockchain/web3";

export function toCapitalizedName(name: string) {
	const lowerTrimmed = toLowerTrim(name);
	const nameArray = lowerTrimmed.split(" ");
	let capitalizedArray = [];
	for(let word in nameArray) {
		capitalizedArray.push(
			nameArray[word].charAt(0).toUpperCase() + nameArray[word].slice(1)
		);
	}
	return capitalizedArray.join(" ");
};

export function toLowerTrim(str: string) {
	return str.trim().toLowerCase();
};

export function stringToAsciiHex(str: string) {
	return utils.asciiToHex(str);
};

export function asciiHexToString(hex: string) {
	return utils.hexToAscii(hex);
};

export function toPaddedInteger(intString: string, length: number) {
	return intString.padStart(length, "0");
};

export function toPaddedFloat(floatString: string, leftLength: number, rightLength: number) {
	let divisor = "";
	if(floatString.includes(",")) {
		divisor = ",";
	} else {
		divisor = ".";
	}

	let [integer, decimal] = floatString.split(divisor);
	decimal = decimal || "";
	return integer.padStart(leftLength, "0") + divisor + decimal.padEnd(rightLength, "0");
};

export function toSignedInteger(intString: string) {
	if(intString[0] !== "-" && intString[0] !== "+") {
		return "+" + intString;
	}
	return intString;
};
