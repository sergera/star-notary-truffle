import { connect } from 'react-redux';

import { Select } from '../UI/Select';
import { PageSelector } from "../UI/PageSelector";

import { nextPage, previousPage, choosePageSize } from '../../state/star';

import { PAGE_SIZE_TYPES } from '../../constants';

import { PageProps, PageSizeSelectOption } from "./Page.types";
import { RootState, Dispatch } from '../../state';

const SIZE_OPTIONS = {
	twelve: {label: "12", data: {value: PAGE_SIZE_TYPES.twelve}},
	twentyFour: {label: "24", data: {value: PAGE_SIZE_TYPES.twentyFour}},
	thirtySix: {label: "36", data: {value: PAGE_SIZE_TYPES.thirtySix}},
	fourtyEight: {label: "48", data: {value: PAGE_SIZE_TYPES.fourtyEight}},
};

const SIZE_TYPE_TO_OPTION = {
	[PAGE_SIZE_TYPES.twelve]: SIZE_OPTIONS.twelve,
	[PAGE_SIZE_TYPES.twentyFour]: SIZE_OPTIONS.twentyFour,
	[PAGE_SIZE_TYPES.thirtySix]: SIZE_OPTIONS.thirtySix,
	[PAGE_SIZE_TYPES.fourtyEight]: SIZE_OPTIONS.fourtyEight,
};

export const Page: React.FC<PageProps> = ({
	handleClickNext,
	handleClickPrevious,
	nextPage,
	nextPageExists,
	previousPage,
	previousPageExists,
	pageNumber,
	handleSelectSize,
	choosePageSize,
	selectedPageSize,
	children,
}) => {

	let handleSelectOption = (option: PageSizeSelectOption) => {
		choosePageSize(option.data.value);
		handleSelectSize();
	};

	let handleNextPage = () => {
		nextPage();
		handleClickNext();
	}

	let handlePreviousPage = () => {
		previousPage();
		handleClickPrevious();
	}

	return (
		<div className="page">
			<div className="page__size">
				<Select 
					label=""
					selected={SIZE_TYPE_TO_OPTION[selectedPageSize]}
					handleChange={handleSelectOption}
					options={[
						SIZE_OPTIONS.twelve,
						SIZE_OPTIONS.twentyFour,
						SIZE_OPTIONS.thirtySix,
						SIZE_OPTIONS.fourtyEight,
					]}
				/>
			</div>
			<PageSelector 
				handleClickNext={handleNextPage}
				handleClickPrevious={handlePreviousPage}
				shouldDisplayNext={nextPageExists}
				shouldDisplayPrevious={previousPageExists}
				pageNumber={pageNumber}
			/>
			<div className="page__list">
				{children}
			</div>
			<PageSelector 
				handleClickNext={handleNextPage}
				handleClickPrevious={handlePreviousPage}
				shouldDisplayNext={nextPageExists}
				shouldDisplayPrevious={previousPageExists}
				pageNumber={pageNumber}
			/>
		</div>
	);
};

const mapStateToProps = (state: RootState) => {
	return {
		pageNumber: state.star.page,
		selectedPageSize: state.star.pageSize,
		nextPageExists: state.star.nextPageExists,
		previousPageExists: state.star.previousPageExists,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		nextPage: () => dispatch(nextPage()),
		previousPage: () => dispatch(previousPage()),
		choosePageSize: (pageSize: number) => dispatch(choosePageSize(pageSize)),
  };
};

export const ConnectedPage = connect(
	mapStateToProps,
	mapDispatchToProps
)(Page);
