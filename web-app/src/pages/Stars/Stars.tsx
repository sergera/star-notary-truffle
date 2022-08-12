import { useEffect } from 'react';
import { connect } from 'react-redux';

import { ConnectedStarOptions as StarOptions } from '../../components/StarOptions';
import { Page } from '../../components/Page';

import { getStars, nextPage, previousPage } from '../../state/star';

import { StarsProps } from './Stars.types';
import { RootState, Dispatch } from '../../state';

export function Stars({
	getStars,
	displayList,
	page,
	nextPage,
	previousPage,
	nextPageExists,
	previousPageExists,
}: StarsProps) {

	useEffect(() => {
		getStars();
	}, [getStars]);

	const handleNextPage = () => {
		nextPage();
		getStars();
	};

	const handlePreviousPage = () => {
		previousPage();
		getStars();
	};

	const handleOptions = () => {
		getStars();
	};

  return (
    <div className="stars">
			<div className="stars__content">
				<StarOptions
					handleSelect={handleOptions}
				/>
				<Page
					handleClickNext={handleNextPage}
					handleClickPrevious={handlePreviousPage}
					shouldDisplayNext={nextPageExists}
					shouldDisplayPrevious={previousPageExists}
					pageNumber={page}
				>
					{displayList.map((star, index) => {
						return (
							<div key={star.tokenId}>
								<p>{star.tokenId}</p>
								<p>{star.name}</p>
								<p>{star.coordinates}</p>
								<p>{star.owner}</p>
								<p>{star.isForSale}</p>
								<p>{star.priceInEther}</p>
								<p>{star.date}</p>
							</div>
						);
					})}
				</Page>
			</div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
	return {
		displayList: state.star.displayList,
		page: state.star.page,
		nextPageExists: state.star.nextPageExists,
		previousPageExists: state.star.previousPageExists,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
    getStars: () => dispatch(getStars()),
		nextPage: () => dispatch(nextPage()),
		previousPage: () => dispatch(previousPage()),
  };
};

export const ConnectedStars = connect(
	mapStateToProps,
	mapDispatchToProps
)(Stars);
