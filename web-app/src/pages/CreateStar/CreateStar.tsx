import { useState } from "react";

import { StarCoordinatesInput, emptyStarCoordinates } from "../../components/StarCoordinatesInput";
import { StarNameInput, emptyStarName } from "../../components/StarNameInput";
import { ConnectedButtonWithKillswitch as ButtonWithKillswitch } from "../../components/UI/ButtonWithKillswitch";

import { Log } from "../../logger";
import { stringToAsciiHex } from "../../format/string";
import { txCall } from "../../blockchain/contracts";
import { getErrorMessage } from "../../error";
import { getConfirmationBlocks, getConfirmationDelaySeconds } from "../../env";

import { store } from "../../state";
import { openInfoToast, openSuccessToast } from '../../state/toast';
import { getStars } from "../../state/star";
import { openModal } from "../../state/modal";

import { StarCoordinates } from "../../components/StarCoordinatesInput/StarCoordinatesInput.types";
import { StarName } from "../../components/StarNameInput/StarNameInput.types";

import { MODAL_TYPES } from '../../constants';

export function CreateStar() {
	let [starCoordinates, setStarCoordinates] = useState<StarCoordinates>(emptyStarCoordinates());
	let [starName, setStarName] = useState<StarName>(emptyStarName());
	let [shouldResetInputFields, setShouldResetInputFields] = useState(false);

	let getCoordinates = (coordinates: StarCoordinates) => {
		setStarCoordinates(coordinates);
	}

	let getName = (name: StarName) => {
		setStarName(name);
	}

	let resetFields = () => {
		setShouldResetInputFields(true);
		setShouldResetInputFields(false);
	}

	let submitStar = async () => {
		if(starCoordinates.areAllValid && starName.isValid) {
			const coordinates = (
				starCoordinates.RAHours +
				starCoordinates.RAMinutes +
				starCoordinates.RASeconds +
				starCoordinates.decDegrees +
				starCoordinates.decArcMinutes +
				starCoordinates.decArcSeconds
			);

			await txCall({
				contract: "StarNotary",
				method: "createStar",
				args: [
					stringToAsciiHex(starName.value),
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

				<StarNameInput
					handleChange={getName}
					shouldResetField={shouldResetInputFields}
					isRequired={true}
				/>
				
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
