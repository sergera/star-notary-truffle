export interface PageProps {
	handleClickNext: Function;
	nextPage: Function;
	handleClickPrevious: Function;
	previousPage: Function;
	nextPageExists: boolean;
	previousPageExists: boolean;
	pageNumber: number;
	handleSelectSize: Function;
	selectedPageSize: number;
	choosePageSize: Function;
	children: React.ReactNode;
};

export type PageSizeSelectOption = {
	label: string;
	data: {value: number};
};
