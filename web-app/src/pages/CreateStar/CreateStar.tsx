import { useState } from "react";

import { TextInputWithRules } from "../../components/UI/TextInputWithRules";
import { ConnectedButtonWithKillswitch as ButtonWithKillswitch } from "../../components/UI/ButtonWithKillswitch";

import { toCapitalizedName, toLowerTrim, stringToAsciiHex, toPaddedInteger, toPaddedFloat, toSignedInteger } from "../../format/string";
import { isName, inLengthRange, isHour, isMinute, isSecond, isDecDegree } from "../../validation/string";
import { txCall } from "../../blockchain/contracts";
import { getErrorMessage } from "../../error";

import { store } from "../../state";
import { openErrorNotification } from '../../state/notification';
import { openSuccessToast } from '../../state/toast';
import { openModal } from "../../state/modal";

import { MODAL_TYPES } from '../../constants';

export function CreateStar() {

	let [starName, setStarName] = useState("");
	let [isValidStarName, setIsValidStarName] = useState(true);

	let [RAHours, setRAHours] = useState("");
	let [isValidRAHours, setIsValidRAHours] = useState(true);
	let [RAMinutes, setRAMinutes] = useState("");
	let [isValidRAMinutes, setIsValidRAMinutes] = useState(true);
	let [RASeconds, setRASeconds] = useState("");
	let [isValidRASeconds, setIsValidRASeconds] = useState(true);

	let [decDegrees, setDecDegrees] = useState("");
	let [isValidDecDegrees, setIsValidDecDegrees] = useState(true);
	let [decArcMinutes, setDecArcMinutes] = useState("");
	let [isValidDecArcMinutes, setIsValidDecArcMinutes] = useState(true);
	let [decArcSeconds, setDecArcSeconds] = useState("");
	let [isValidDecArcSeconds, setIsValidDecArcSeconds] = useState(true);

	let getStarName = (value: string) => {
		const isValid = isName(value) && inLengthRange(value,4,32);
		setIsValidStarName(isValid);
		setStarName(value);
	}

	let formatStarName = (value: string) => {
		const formattedValue = toCapitalizedName(value);
		const isValid = isName(formattedValue) && inLengthRange(formattedValue,4,32);
		console.log(isValid)
		setIsValidStarName(isValid);
		setStarName(formattedValue);
	}

	let getRAHours = (value: string) => {
		const isValid = isHour(value);
		setIsValidRAHours(isValid);
		setRAHours(value);
	}

	let getRAMinutes = (value: string) => {
		const isValid = isMinute(value);
		setIsValidRAMinutes(isValid);
		setRAMinutes(value);
	}

	let getRASeconds = (value: string) => {
		const isValid = isSecond(value);
		setIsValidRASeconds(isValid);
		setRASeconds(value);
	}

	let formatRASeconds = (value: string) => {
		let formattedValue = value.replace(",",".");
		if(formattedValue.slice(-1) === ".") {
			formattedValue = formattedValue.slice(0,-1);
		}
		const isValid = isSecond(formattedValue);
		setIsValidRASeconds(isValid);
		setRASeconds(formattedValue);
	}

	let getDecDegrees = (value: string) => {
		const isValid = isDecDegree(value);
		setIsValidDecDegrees(isValid);
		setDecDegrees(value);
	}

	let getDecArcMinutes = (value: string) => {
		const isValid = isMinute(value);
		setIsValidDecArcMinutes(isValid);
		setDecArcMinutes(value);
	}

	let getDecArcSeconds = (value: string) => {
		const isValid = isSecond(value);
		setIsValidDecArcSeconds(isValid);
		setDecArcSeconds(value);
	}

	let formatDecArcSeconds = (value: string) => {
		let formattedValue = value.replace(",",".");
		if(formattedValue.slice(-1) === ".") {
			formattedValue = formattedValue.slice(0,-1);
		}
		const isValid = isSecond(formattedValue);
		setIsValidDecArcSeconds(isValid);
		setDecArcSeconds(formattedValue);
	}

	let resetFields = () => {
		setStarName("");
		setIsValidStarName(true);
		setRAHours("");
		setIsValidRAHours(true);
		setRAMinutes("");
		setIsValidRAMinutes(true);
		setRASeconds("");
		setIsValidRASeconds(true);
		setDecDegrees("");
		setIsValidDecDegrees(true);
		setDecArcMinutes("");
		setIsValidDecArcMinutes(true);
		setDecArcSeconds("");
		setIsValidDecArcSeconds(true);
	}

	let submitStar = async () => {
		const isValidForm = (
			isValidStarName && starName !== "" &&
			isValidRAHours && RAHours !== "" &&
			isValidRAMinutes && RAMinutes !== "" &&
			isValidRASeconds && RASeconds !== "" &&
			isValidDecDegrees && decDegrees !== "" &&
			isValidDecArcMinutes && decArcMinutes !== "" &&
			isValidDecArcSeconds && decArcSeconds !== ""
		);


		if(isValidForm) {

			const coordinates = (
				toPaddedInteger(RAHours, 2) + 
				toPaddedInteger(RAMinutes, 2) + 
				toPaddedFloat(RASeconds, 2, 2) +
				toSignedInteger(toPaddedInteger(decDegrees, 2)) +
				toPaddedInteger(decArcMinutes, 2) + 
				toPaddedFloat(decArcSeconds, 2, 2)
			);

			setCoordinates(stringToAsciiHex(coordinates));

			// const response = await txCall({
			// 	contract: "StarNotary",
			// 	method: "createStar",
			// 	args: [
			// 		stringToAsciiHex(starName), 
			// 		stringToAsciiHex(coordinates)
			// 	],
			// 	options: {
			// 		from: store.getState().account.address
			// 	},
			// 	onTransactionHash: (transactionHash: string) => {
			// 		store.dispatch(openSuccessToast());
			// 		resetFields();
			// 	},
			// 	onError: (error: Error) => {
			// 		store.dispatch(openErrorNotification(getErrorMessage(error)));
			// 	}
			// });
		} else {
			store.dispatch(openModal(MODAL_TYPES.incompleteForm));
		}
	}

	let [coordinates, setCoordinates] = useState("");

  return (
    <div className="create-star">
			<h1>Register a Star!</h1>

			<p>Here you can register a new star!</p>
			<p>Both the new star's coordinate and name must be unique</p>

			<p>NAME</p>
			<p>{stringToAsciiHex(toLowerTrim(starName))}</p>
			<p>COORDINATE</p>
			<p>{coordinates}</p>

			<div
				className="create-star__form-group"
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

			<div
				className="create-star__form-group"
			>
				<h3>Right Ascention (RA):</h3>
				<TextInputWithRules 
					handleChange={getRAHours}
					name="Hours"
					value={RAHours}
					isValid={isValidRAHours}
					rules={[
						"must be an integer min: 0, max: 24",
						"no leading zeros"
					]}
					isRequired={true}
					styleClass="text-input-1of16"
				/>
				<TextInputWithRules 
					handleChange={getRAMinutes}
					name="Minutes"
					value={RAMinutes}
					isValid={isValidRAMinutes}
					rules={[
						"must be an integer min: 0, max: 60",
						"no leading zeros"
					]}
					isRequired={true}
					styleClass="text-input-1of16"
				/>
				<TextInputWithRules 
					handleChange={getRASeconds}
					name="Seconds"
					value={RASeconds}
					isValid={isValidRASeconds}
					rules={[
						"must be a real number min: 0, max: 60",
						"fractional part with maximum 2 decimal places",
						"no leading zeros in the whole portion",
						"no trailing zeros in the decimal portion"
					]}
					isRequired={true}
					styleClass="text-input-1of16"
					handleBlur={formatRASeconds}
				/>
			</div>

			<div
				className="create-star__form-group"
			>
				<h3>Declination (DEC):</h3>
				<TextInputWithRules 
					handleChange={getDecDegrees}
					name="Degrees"
					value={decDegrees}
					isValid={isValidDecDegrees}
					rules={[
						"must be an integer min: -90, max: 90",
						"no leading zeros",
						"no negative zero (-0)"
					]}
					isRequired={true}
					styleClass="text-input-1of16"
				/>
				<TextInputWithRules 
					handleChange={getDecArcMinutes}
					name="Arcminutes"
					value={decArcMinutes}
					isValid={isValidDecArcMinutes}
					rules={[
						"must be an integer min: 0, max: 60",
						"no leading zeros"
					]}
					isRequired={true}
					styleClass="text-input-1of16"
				/>
				<TextInputWithRules 
					handleChange={getDecArcSeconds}
					name="Arcseconds"
					value={decArcSeconds}
					isValid={isValidDecArcSeconds}
					rules={[
						"must be a real number min: 0, max: 60",
						"fractional part with maximum 2 decimal places",
						"no leading zeros in the whole portion",
						"no trailing zeros in the decimal portion"
					]}
					isRequired={true}
					styleClass="text-input-1of16"
					handleBlur={formatDecArcSeconds}
				/>
			</div>

			<ButtonWithKillswitch
				name="submit"
				handleClick={submitStar}
			/>
    </div>
  );
};
