import { txCall } from "../contracts";
import { stringToAsciiHex } from "../../format/string";
import { getErrorMessage } from "../../error";

import { getConfirmationBlocks, getConfirmationDelaySeconds } from "../../env";

import { CONTRACTS, CONTRACT_FUNCTIONS } from "../../constants";

import { CreateStarArgs, BuyStarArgs, ChangeNameArgs, PutForSaleArgs, RemoveFromSaleArgs } from "./starTransactions.types";

const maxConfirmations = getConfirmationBlocks();
const confirmationDelaySeconds = getConfirmationDelaySeconds();

export const createStar = async ({
	name,
	coordinates,
	owner,
	onSending=()=>{},
	onSent=()=>{},
	onTxHash=()=>{},
	onReceipt=()=>{},
	onFirstConfirmation=()=>{},
	onIntermediateConfirmation=()=>{},
	onFinalConfirmation=()=>{},
	onTxError=()=>{},
	onError=()=>{},
}:CreateStarArgs) => {
	await txCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].tx.create,
		args: [
			stringToAsciiHex(name),
			stringToAsciiHex(coordinates),
		],
		options: {
			from: owner,
		},
		onSending: () => {
			onSending();
		},
		onSent: () => {
			onSent();
		},
		onReceipt: (receipt) => {
			onReceipt(receipt);
		},
		onTransactionHash: (transactionHash) => {
			onTxHash(transactionHash);
		},
		onConfirmation: (confirmation) => {
			if(confirmation < maxConfirmations) {
				if(confirmation === 0) {
					onFirstConfirmation(confirmation, maxConfirmations);
				} else {
					onIntermediateConfirmation(confirmation, maxConfirmations);
				}
			} else if(confirmation === maxConfirmations) {
				setTimeout(() => {
					onFinalConfirmation(confirmation, maxConfirmations);
				}, confirmationDelaySeconds*1000);
			}
		},
		onTxError: (error, receipt) => {
			onTxError(getErrorMessage(error), receipt);
		},
		onError: (error) => {
			onError(getErrorMessage(error));
		}
	});
};

export const buyStar = async ({
	tokenId,
	owner,
	onSending=()=>{},
	onSent=()=>{},
	onTxHash=()=>{},
	onReceipt=()=>{},
	onFirstConfirmation=()=>{},
	onIntermediateConfirmation=()=>{},
	onFinalConfirmation=()=>{},
	onTxError=()=>{},
	onError=()=>{},
}:BuyStarArgs) => {
	await txCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].tx.buy,
		args: [
			tokenId,
		],
		options: {
			from: owner,
		},
		onSending: () => {
			onSending();
		},
		onSent: () => {
			onSent();
		},
		onReceipt: (receipt) => {
			onReceipt(receipt);
		},
		onTransactionHash: (transactionHash) => {
			onTxHash(transactionHash);
		},
		onConfirmation: (confirmation) => {
			if(confirmation < maxConfirmations) {
				if(confirmation === 0) {
					onFirstConfirmation(confirmation, maxConfirmations);
				} else {
					onIntermediateConfirmation(confirmation, maxConfirmations);
				}
			} else if(confirmation === maxConfirmations) {
				setTimeout(() => {
					onFinalConfirmation(confirmation, maxConfirmations);
				}, confirmationDelaySeconds*1000);
			}
		},
		onTxError: (error, receipt) => {
			onTxError(getErrorMessage(error), receipt);
		},
		onError: (error) => {
			onError(getErrorMessage(error));
		}
	});
};

export const changeName = async ({
	tokenId,
	newName,
	owner,
	onSending=()=>{},
	onSent=()=>{},
	onTxHash=()=>{},
	onReceipt=()=>{},
	onFirstConfirmation=()=>{},
	onIntermediateConfirmation=()=>{},
	onFinalConfirmation=()=>{},
	onTxError=()=>{},
	onError=()=>{},
}:ChangeNameArgs) => {
	await txCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].tx.changeName,
		args: [
			tokenId,
			stringToAsciiHex(newName),
		],
		options: {
			from: owner,
		},
		onSending: () => {
			onSending();
		},
		onSent: () => {
			onSent();
		},
		onReceipt: (receipt) => {
			onReceipt(receipt);
		},
		onTransactionHash: (transactionHash) => {
			onTxHash(transactionHash);
		},
		onConfirmation: (confirmation) => {
			if(confirmation < maxConfirmations) {
				if(confirmation === 0) {
					onFirstConfirmation(confirmation, maxConfirmations);
				} else {
					onIntermediateConfirmation(confirmation, maxConfirmations);
				}
			} else if(confirmation === maxConfirmations) {
				setTimeout(() => {
					onFinalConfirmation(confirmation, maxConfirmations);
				}, confirmationDelaySeconds*1000);
			}
		},
		onTxError: (error, receipt) => {
			onTxError(getErrorMessage(error), receipt);
		},
		onError: (error) => {
			onError(getErrorMessage(error));
		}
	});
};

export const putForSale = async ({
	tokenId,
	price,
	owner,
	onSending=()=>{},
	onSent=()=>{},
	onTxHash=()=>{},
	onReceipt=()=>{},
	onFirstConfirmation=()=>{},
	onIntermediateConfirmation=()=>{},
	onFinalConfirmation=()=>{},
	onTxError=()=>{},
	onError=()=>{},
}:PutForSaleArgs) => {
	await txCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].tx.putForSale,
		args: [
			tokenId,
			price,
		],
		options: {
			from: owner,
		},
		onSending: () => {
			onSending();
		},
		onSent: () => {
			onSent();
		},
		onReceipt: (receipt) => {
			onReceipt(receipt);
		},
		onTransactionHash: (transactionHash) => {
			onTxHash(transactionHash);
		},
		onConfirmation: (confirmation) => {
			if(confirmation < maxConfirmations) {
				if(confirmation === 0) {
					onFirstConfirmation(confirmation, maxConfirmations);
				} else {
					onIntermediateConfirmation(confirmation, maxConfirmations);
				}
			} else if(confirmation === maxConfirmations) {
				setTimeout(() => {
					onFinalConfirmation(confirmation, maxConfirmations);
				}, confirmationDelaySeconds*1000);
			}
		},
		onTxError: (error, receipt) => {
			onTxError(getErrorMessage(error), receipt);
		},
		onError: (error) => {
			onError(getErrorMessage(error));
		}
	});
};

export const removeFromSale = async ({
	tokenId,
	owner,
	onSending=()=>{},
	onSent=()=>{},
	onTxHash=()=>{},
	onReceipt=()=>{},
	onFirstConfirmation=()=>{},
	onIntermediateConfirmation=()=>{},
	onFinalConfirmation=()=>{},
	onTxError=()=>{},
	onError=()=>{},
}:RemoveFromSaleArgs) => {
	await txCall({
		contract: CONTRACTS.starNotary,
		method: CONTRACT_FUNCTIONS[CONTRACTS.starNotary].tx.removeFromSale,
		args: [
			tokenId,
		],
		options: {
			from: owner,
		},
		onSending: () => {
			onSending();
		},
		onSent: () => {
			onSent();
		},
		onReceipt: (receipt) => {
			onReceipt(receipt);
		},
		onTransactionHash: (transactionHash) => {
			onTxHash(transactionHash);
		},
		onConfirmation: (confirmation) => {
			if(confirmation < maxConfirmations) {
				if(confirmation === 0) {
					onFirstConfirmation(confirmation, maxConfirmations);
				} else {
					onIntermediateConfirmation(confirmation, maxConfirmations);
				}
			} else if(confirmation === maxConfirmations) {
				setTimeout(() => {
					onFinalConfirmation(confirmation, maxConfirmations);
				}, confirmationDelaySeconds*1000);
			}
		},
		onTxError: (error, receipt) => {
			onTxError(getErrorMessage(error), receipt);
		},
		onError: (error) => {
			onError(getErrorMessage(error));
		}
	});
};
