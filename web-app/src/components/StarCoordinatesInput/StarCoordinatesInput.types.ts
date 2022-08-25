export interface StarCoordinatesInputProps {
	handleChange: Function;
	areAllRequired: boolean;
	shouldResetFields: boolean;
};

export interface StarCoordinates {
	RAHours: string;
	RAMinutes: string;
	RASeconds: string;
	decDegrees: string;
	decArcMinutes: string;
	decArcSeconds: string;
	areAllValid: boolean;
	areAnyFilled: boolean;
	areFilledValid: boolean;
};
