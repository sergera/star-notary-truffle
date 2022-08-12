export interface PageSelectorProps {
	handleClickNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
	handleClickPrevious: (event: React.MouseEvent<HTMLButtonElement>) => void;
	shouldDisplayNext: boolean;
	shouldDisplayPrevious: boolean;
	pageNumber: number;
	id?: string;
	styleClass?: string;
};
