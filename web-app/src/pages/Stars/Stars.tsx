import { useEffect } from 'react';
import { connect } from 'react-redux';

import { getStarRange } from '../../state/star';

import { StarsProps } from './Stars.types';
import { RootState, Dispatch } from '../../state';

export function Stars({
	getStarRange,
	displayList,
}: StarsProps) {

	useEffect(() => {
		getStarRange({start: 1, end: 4})
	}, [getStarRange]);

  return (
    <div className="stars">
			<div className="stars__content">
				<h1>{"Stars:"}</h1>
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
			</div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
	return {
		displayList: state.star.displayList,
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
    getStarRange: (range: {start: number, end: number}) => dispatch(getStarRange(range)),
  };
};

export const ConnectedStars = connect(
	mapStateToProps,
	mapDispatchToProps
)(Stars);
