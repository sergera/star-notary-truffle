import { connect } from 'react-redux';

import { Select } from '../UI/Select';

import { chooseSort } from '../../state/star';

import { STAR_SORT_TYPES } from '../../constants';

import { StarOptionsProps, StarSelectOption } from './StarOptions.types';
import { RootState, Dispatch } from '../../state';

const SORT_OPTIONS = {
	newest: {label: "newest", data: {value: STAR_SORT_TYPES.newest}},
	oldest: {label: "oldest", data: {value: STAR_SORT_TYPES.oldest}},
	highPrice: {label: "highest price", data: {value: STAR_SORT_TYPES.highPrice}},
	lowPrice: {label: "lowest price", data: {value: STAR_SORT_TYPES.lowPrice}}
}

const SORT_TYPE_TO_OPTION = {
	[STAR_SORT_TYPES.newest]:	SORT_OPTIONS.newest,
	[STAR_SORT_TYPES.oldest]: SORT_OPTIONS.oldest,
	[STAR_SORT_TYPES.highPrice]: SORT_OPTIONS.highPrice,
	[STAR_SORT_TYPES.lowPrice]: SORT_OPTIONS.lowPrice,
}

export function StarOptions({
	handleSelect,
	selectedSort,
	chooseSort,
}: StarOptionsProps) {

	let getSelectOption = (option: StarSelectOption) => {
		chooseSort(option.data.value);
		handleSelect();
	};

  return (
    <div className="star-options">
			<div className="star-options__option">
				<Select 
					label="sort by:"
					selected={SORT_TYPE_TO_OPTION[selectedSort]}
					handleChange={getSelectOption}
					options={[
						SORT_OPTIONS.newest,
						SORT_OPTIONS.oldest
					]}
				/>
			</div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
	return {
		selectedSort: state.star.sort,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
    chooseSort: (sortType: string) => dispatch(chooseSort(sortType)),
  };
};

export const ConnectedStarOptions = connect(
	mapStateToProps,
	mapDispatchToProps
)(StarOptions);
