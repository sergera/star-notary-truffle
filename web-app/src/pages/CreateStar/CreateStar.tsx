import { useState } from "react";

import { StarCoordinatesInput, emptyStarCoordinates } from "../../components/StarCoordinatesInput";
import { StarNameInput, emptyStarName } from "../../components/StarNameInput";
import { ConnectedButtonWithKillswitch as ButtonWithKillswitch } from "../../components/UI/ButtonWithKillswitch";

import { Log } from "../../logger";
import { createStar } from "../../blockchain/tokenTransaction";
import { coordinatesInUse, nameInUse } from "../../blockchain/tokenSimpleCall";

import { store } from "../../state";
import { openInfoToast, openSuccessToast, openErrorToast } from '../../state/toast';
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

			let couldCallContract = true;

			const areCoordinatesInUse = await coordinatesInUse({
				coordinates: coordinates,
			}).catch(() => {
				couldCallContract = false;
			});

			if(!couldCallContract) {
				store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
				return;
			}

			if(areCoordinatesInUse) {
				store.dispatch(openModal(MODAL_TYPES.unavailableCoordinates));
				return;
			}

			const isNameInUse = await nameInUse({
				name: starName.value,
			}).catch(() => {
				couldCallContract = false;
			})

			if(!couldCallContract) {
				store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
				return;
			}

			if(isNameInUse) {
				store.dispatch(openModal(MODAL_TYPES.unavailableName));
				return;
			}

			resetFields();

			await createStar({
				name: starName.value,
				coordinates: coordinates,
				owner: store.getState().account.address,
				onTxHash: () => {
					store.dispatch(openInfoToast("transaction sent: awaiting confirmations..."));
				},
				onFirstConfirmation: (currentConfirmation, maxConfirmations) => {
					store.dispatch(openInfoToast("transaction mined!"));
					store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
				},
				onIntermediateConfirmation: (currentConfirmation, maxConfirmations) => {
					store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
				},
				onFinalConfirmation: () => {
					store.dispatch(openSuccessToast("star created!"));
					store.dispatch(getStars());
				},
				onTxError: (msg: string) => {
					Log.error({msg: msg, description: "transaction rejected creating star"});
					store.dispatch(openErrorToast("error processing create transaction"));
				},
				onError: (msg: string) => {
					Log.error({msg: msg, description: "error creating star"});
					store.dispatch(openErrorToast("contract call failed"));
				},
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
