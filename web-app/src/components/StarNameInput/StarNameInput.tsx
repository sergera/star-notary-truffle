import { useState, useEffect } from 'react';

import { TextInputWithRules } from '../UI/TextInputWithRules';

import { isName, inLengthRange } from "../../validation/string";
import { toLowerTrim } from "../../format/string";

import { StarNameInputProps, StarName } from './StarNameInput.types';

export function emptyStarName() {
	return {
		value: "",
		isValid: false,
	};
};

export function StarNameInput({
	handleChange,
	isRequired,
	shouldResetField,
}: StarNameInputProps) {

	useEffect(() => {
		if(shouldResetField) {
			setValue("");
			setIsValid(true);
		}
	}, [shouldResetField])

	let [value, setValue] = useState("");
	let [isValid, setIsValid] = useState(true);

	const getNameObject = ():StarName => {
		return {
			value: value && toLowerTrim(value),
			isValid: isValid,
		};
	}

	const validateStarName = (value: string) => {
		setIsValid(isName(value) && inLengthRange(value,2,32));
	}

	const getStarName = (value: string) => {
		validateStarName(value);
		setValue(value);
	}

	const liftStarName = () => {
		handleChange(getNameObject());
	}

	return (
		<TextInputWithRules 
			handleChange={getStarName}
			name="Name"
			value={value}
			isValid={isValid}
			rules={[
				"between 2 and 32 letters",
				"non-consecutive spaces in between"
			]}
			isRequired={isRequired}
			styleClass="text-input-1of2"
			handleFocus={validateStarName}
			handleBlur={liftStarName}
		/>
	);
};
