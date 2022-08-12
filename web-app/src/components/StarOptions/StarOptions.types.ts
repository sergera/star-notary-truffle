export interface StarOptionsProps {
	handleSelect: Function;
	selectedSort: string;
	chooseSort: Function;
};

export type StarSelectOption = {
	label: string;
	data: {value: string};
};
