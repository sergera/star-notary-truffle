import { useState, useEffect } from 'react';

import { TextInputWithRules } from '../UI/TextInputWithRules';

import { isHour, isMinute, isSecond, isDecDegree } from "../../validation/string";
import { toPaddedInteger, toPaddedFloat, toSignedInteger } from "../../format/string";

import { StarCoordinatesInputProps, StarCoordinates } from './StarCoordinatesInput.types';

export function emptyStarCoordinates() {
	return {
		RAHours: "",
		RAMinutes: "",
		RASeconds: "",
		decDegrees: "",
		decArcMinutes: "",
		decArcSeconds: "",
		areAllValid: false,
		areAnyFilled: false,
		areFilledValid: false,
	};
};

export function StarCoordinatesInput({
	handleChange,
	areAllRequired,
	shouldResetFields,
}: StarCoordinatesInputProps) {

	useEffect(() => {
		if(shouldResetFields) {
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
	}, [shouldResetFields])

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

	const getCoordinateObject = ():StarCoordinates => {
		const areAllValid = (
			(RAHours ? isValidRAHours : false) && 
			(RAMinutes ? isValidRAMinutes : false) &&
			(RASeconds ? isValidRASeconds : false) &&
			(decDegrees ? isValidDecDegrees : false) &&
			(decArcMinutes ? isValidDecArcMinutes : false) &&
			(decArcSeconds ? isValidDecArcSeconds : false)
		);
		
		const areFilledValid = (
			(RAHours ? isValidRAHours : true) && 
			(RAMinutes ? isValidRAMinutes : true) &&
			(RASeconds ? isValidRASeconds : true) &&
			(decDegrees ? isValidDecDegrees : true) &&
			(decArcMinutes ? isValidDecArcMinutes : true) &&
			(decArcSeconds ? isValidDecArcSeconds : true)			
		);

		const areAnyFilled = !!(
			RAHours || RAMinutes || RASeconds ||
			decDegrees || decArcMinutes || decArcSeconds
		);

		return {
			RAHours: RAHours && toPaddedInteger(RAHours, 2),
			RAMinutes: RAMinutes && toPaddedInteger(RAMinutes, 2),
			RASeconds: RASeconds && toPaddedFloat(formatSeconds(RASeconds), 2, 2),
			decDegrees: decDegrees && toSignedInteger(toPaddedInteger(decDegrees, 2)),
			decArcMinutes: decArcMinutes && toPaddedInteger(decArcMinutes, 2),
			decArcSeconds: decArcSeconds && toPaddedFloat(formatSeconds(decArcSeconds), 2, 2),
			areAllValid: areAllValid,
			areAnyFilled: areAnyFilled,
			areFilledValid: areFilledValid,
		};
	}

	const formatSeconds = (value: string): string => {
		let formattedValue = value.replace(",",".");
		if(formattedValue.slice(-1) === ".") {
			formattedValue = formattedValue.slice(0,-1);
		}
		return formattedValue;
	}

	const validateRAHours = (value: string) => {
		setIsValidRAHours(isHour(value));
	}

	const getRAHours = (value: string) => {
		validateRAHours(value);
		setRAHours(value);
	}

	const validateRAMinutes = (value: string) => {
		setIsValidRAMinutes(isMinute(value));
	}

	const getRAMinutes = (value: string) => {
		validateRAMinutes(value);
		setRAMinutes(value);
	}

	const validateRASeconds = (value: string) => {
		setIsValidRASeconds(isSecond(formatSeconds(value)));
	}

	const getRASeconds = (value: string) => {
		validateRASeconds(value);
		setRASeconds(value);
	}

	const validateDecDegrees = (value: string) => {
		setIsValidDecDegrees(isDecDegree(value));
	}

	const getDecDegrees = (value: string) => {
		validateDecDegrees(value);
		setDecDegrees(value);
	}

	const validateDecArcMinutes = (value: string) => {
		setIsValidDecArcMinutes(isMinute(value));
	}

	const getDecArcMinutes = (value: string) => {
		validateDecArcMinutes(value);
		setDecArcMinutes(value);
	}

	const validateDecArcSeconds = (value: string) => {
		setIsValidDecArcSeconds(isSecond(formatSeconds(value)));
	}

	const getDecArcSeconds = (value: string) => {
		validateDecArcSeconds(value);
		setDecArcSeconds(value);
	}

	const liftCoordinates = () => {
		handleChange(getCoordinateObject());
	}

	return (
		<div className="star-coordinate-input">
			<div
				className="star-coordinate-input__column"
			>
				<h3>Right Ascension (RA):</h3>
				<TextInputWithRules 
					handleChange={getRAHours}
					name="Hours"
					value={RAHours}
					isValid={isValidRAHours}
					rules={[
						"must be an integer min: 0, max: 24",
						"no leading zeros"
					]}
					isRequired={areAllRequired}
					styleClass="text-input-1of16"
					handleFocus={validateRAHours}
					handleBlur={liftCoordinates}
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
					isRequired={areAllRequired}
					styleClass="text-input-1of16"
					handleFocus={validateRAMinutes}
					handleBlur={liftCoordinates}
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
					isRequired={areAllRequired}
					styleClass="text-input-1of16"
					handleFocus={validateRASeconds}
					handleBlur={liftCoordinates}
				/>
			</div>

			<div
				className="create-star__input-group"
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
					isRequired={areAllRequired}
					styleClass="text-input-1of16"
					handleFocus={validateDecDegrees}
					handleBlur={liftCoordinates}
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
					isRequired={areAllRequired}
					styleClass="text-input-1of16"
					handleFocus={validateDecArcMinutes}
					handleBlur={liftCoordinates}
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
					isRequired={areAllRequired}
					styleClass="text-input-1of16"
					handleFocus={validateDecArcSeconds}
					handleBlur={liftCoordinates}
				/>
			</div>
		</div>
	);
};
