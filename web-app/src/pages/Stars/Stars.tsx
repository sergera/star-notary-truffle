import { useEffect } from 'react';
import { connect } from 'react-redux';

import { ConnectedStarOptions as StarOptions } from '../../components/StarOptions';
import { ConnectedPage as Page } from '../../components/Page';
import { ConnectedStarCard as StarCard } from '../../components/StarCard';

import { getStars} from '../../state/star';

import { StarsProps } from './Stars.types';
import { RootState, Dispatch } from '../../state';

export function Stars({
	getStars,
	displayList,
}: StarsProps) {

	useEffect(() => {
		getStars();
	}, [getStars]);

  return (
    <div className="stars">
			<div className="stars__content">
				<StarOptions
					handleSelect={getStars}
				/>
				<Page
					handleClickNext={getStars}
					handleClickPrevious={getStars}
					handleSelectSize={getStars}
				>
					{displayList.map((star) => {
						return (
							<StarCard star={star} key={star.tokenId} />
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
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
    getStars: () => dispatch(getStars()),
  };
};

export const ConnectedStars = connect(
	mapStateToProps,
	mapDispatchToProps
)(Stars);
