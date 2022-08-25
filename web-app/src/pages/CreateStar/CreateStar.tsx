import { useState } from "react";

import { StarCoordinatesInput, emptyStarCoordinates } from "../../components/StarCoordinatesInput";

import { TextInputWithRules } from "../../components/UI/TextInputWithRules";
import { ConnectedButtonWithKillswitch as ButtonWithKillswitch } from "../../components/UI/ButtonWithKillswitch";

import { Log } from "../../logger";
import { toCapitalizedName, toLowerTrim, stringToAsciiHex } from "../../format/string";
import { isName, inLengthRange } from "../../validation/string";
import { txCall } from "../../blockchain/contracts";
import { getErrorMessage } from "../../error";
import { getConfirmationBlocks, getConfirmationDelaySeconds } from "../../env";

import { store } from "../../state";
import { openInfoToast, openSuccessToast } from '../../state/toast';
import { getStars } from "../../state/star";
import { openModal } from "../../state/modal";

import { StarCoordinates } from "../../components/StarCoordinatesInput/StarCoordinatesInput.types";

import { MODAL_TYPES } from '../../constants';

export function CreateStar() {
	let [starCoordinates, setStarCoordinates] = useState<StarCoordinates>(emptyStarCoordinates());
	let [shouldResetInputFields, setShouldResetInputFields] = useState(false);
	let [starName, setStarName] = useState("");
	let [isValidStarName, setIsValidStarName] = useState(true);

	let getCoordinates = (coordinates: StarCoordinates) => {
		setStarCoordinates(coordinates);
	}

	let getStarName = (value: string) => {
		const isValid = isName(value) && inLengthRange(value,4,32);
		setIsValidStarName(isValid);
		setStarName(value);
	}

	let formatStarName = (value: string) => {
		const formattedValue = toCapitalizedName(value);
		const isValid = isName(formattedValue) && inLengthRange(formattedValue,4,32);
		setIsValidStarName(isValid);
		setStarName(formattedValue);
	}

	let resetFields = () => {
		setShouldResetInputFields(true);
		setShouldResetInputFields(false);
		setStarName("");
		setIsValidStarName(true);
	}

	let submitStar = async () => {
		if(starCoordinates.areAllValid) {
			const coordinates = (
				starCoordinates.RAHours +
				starCoordinates.RAMinutes +
				starCoordinates.RASeconds +
				starCoordinates.decDegrees +
				starCoordinates.decArcMinutes +
				starCoordinates.decArcSeconds
			);

			const response = await txCall({
				contract: "StarNotary",
				method: "createStar",
				args: [
					stringToAsciiHex(toLowerTrim(starName)), 
					stringToAsciiHex(coordinates)
				],
				options: {
					from: store.getState().account.address
				},
				onTransactionHash: (transactionHash: string) => {
					store.dispatch(openInfoToast("transaction sent: awaiting confirmations..."));
					resetFields();
				},
				onConfirmation: (confirmation: number) => {
					let confirmationBlocks = getConfirmationBlocks();
					if(confirmation < confirmationBlocks) {
						store.dispatch(openInfoToast(`confirmations: ${confirmation}/${confirmationBlocks}`));
					} else if(confirmation === confirmationBlocks) {
						setTimeout(() => {
							store.dispatch(openSuccessToast("star created!"));
							store.dispatch(getStars());
						}, getConfirmationDelaySeconds()*1000);
					}
				},
				onError: (error: Error) => {
					Log.error({msg: getErrorMessage(error), description: "error creating star"})
				}
			});
		} else {
			store.dispatch(openModal(MODAL_TYPES.incompleteForm));
		}
	}

  return (
    <div className="create-star">
			<div className="create-star__content">
				<h1>Register a Star!</h1>

				<p>Here you can register a new star!</p>
				<p>Both the new star's coordinate and name must be unique</p>

				<div
					className="create-star__input-group"
				>
					<h3>Star Name</h3>
					<TextInputWithRules 
						handleChange={getStarName}
						name="Name"
						value={starName}
						isValid={isValidStarName}
						rules={[
							"between 4 and 32 letters",
							"non-consecutive spaces in between"
						]}
						isRequired={true}
						styleClass="text-input-1of4"
						handleBlur={formatStarName}
					/>
				</div>
				
				<StarCoordinatesInput
					handleChange={getCoordinates}
					shouldResetFields={shouldResetInputFields}
					areAllRequired={true}
				/>

				<ButtonWithKillswitch
					name="submit"
					handleClick={submitStar}
				/>
			</div>
    </div>
  );
};
