import { LooseObject } from "../../types";

export interface CreateStarArgs {
	name: string;
	coordinates: string;
	owner: string;
	onSending?: Function;
	onSent?: Function;
	onTxHash?(txHash: string): void;
	onReceipt?(receipt: LooseObject): void;
	onFirstConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onIntermediateConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onFinalConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onTxError?(msg: string, receipt: LooseObject): void;
	onError?(msg: string): void;
};

export interface BuyStarArgs {
	tokenId: string;
	owner: string;
	onSending?: Function;
	onSent?: Function;
	onTxHash?(txHash: string): void;
	onReceipt?(receipt: LooseObject): void;
	onFirstConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onIntermediateConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onFinalConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onTxError?(msg: string, receipt: LooseObject): void;
	onError?(msg: string): void;
};

export interface ChangeNameArgs {
	tokenId: string;
	newName: string;
	owner: string;
	onSending?: Function;
	onSent?: Function;
	onTxHash?(txHash: string): void;
	onReceipt?(receipt: LooseObject): void;
	onFirstConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onIntermediateConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onFinalConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onTxError?(msg: string, receipt: LooseObject): void;
	onError?(msg: string): void;
};

export interface PutForSaleArgs {
	tokenId: string;
	price: string;
	owner: string;
	onSending?: Function;
	onSent?: Function;
	onTxHash?(txHash: string): void;
	onReceipt?(receipt: LooseObject): void;
	onFirstConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onIntermediateConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onFinalConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onTxError?(msg: string, receipt: LooseObject): void;
	onError?(msg: string): void;
};

export interface RemoveFromSaleArgs {
	tokenId: string;
	owner: string;
	onSending?: Function;
	onSent?: Function;
	onTxHash?(txHash: string): void;
	onReceipt?(receipt: LooseObject): void;
	onFirstConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onIntermediateConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onFinalConfirmation?(currentConfirmation: number, maxConfirmations: number): void;
	onTxError?(msg: string, receipt: LooseObject): void;
	onError?(msg: string): void;
};
