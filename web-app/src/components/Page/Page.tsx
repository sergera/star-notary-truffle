import { PageSelector } from "../UI/PageSelector";

import { PageProps } from "./Page.types";

export const Page: React.FC<PageProps> = ({
	handleClickNext,
	handleClickPrevious,
	shouldDisplayNext,
	shouldDisplayPrevious,
	pageNumber,
	children,
}) => (
	<div className="page">
		<PageSelector 
			handleClickNext={handleClickNext}
			handleClickPrevious={handleClickPrevious}
			shouldDisplayNext={shouldDisplayNext}
			shouldDisplayPrevious={shouldDisplayPrevious}
			pageNumber={pageNumber}
		/>
		<div className="page__list">
			{children}
		</div>
		<PageSelector 
			handleClickNext={handleClickNext}
			handleClickPrevious={handleClickPrevious}
			shouldDisplayNext={shouldDisplayNext}
			shouldDisplayPrevious={shouldDisplayPrevious}
			pageNumber={pageNumber}
		/>
	</div>
);
