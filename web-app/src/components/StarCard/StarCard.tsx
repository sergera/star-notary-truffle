import { connect } from 'react-redux';

import { Button } from '../UI/Button';
import { ConnectedButtonWithKillswitch as ButtonWithKillswitch } from '../UI/ButtonWithKillswitch';

import { toCapitalizedName } from '../../format/string';

import { StarCardProps } from "./StarCard.types";
import { RootState } from "../../state";

export function StarCard({
	star,
	userWallet,
}: StarCardProps) {

	let forSale = star.isForSale;
	let owned = star.owner.address.toLowerCase() === userWallet.toLowerCase();

	const getHeaderGridColumns = () => {
		let columns = "1fr"
		if(owned) {
			columns = columns.concat(" 1fr")
		}
		if(forSale) {
			columns = columns.concat(" 1fr")
		}
		return columns;
	};

	return (
		<div className="star-card">
			<div style={{gridTemplateColumns:getHeaderGridColumns()}} className="star-card__header">
				{forSale &&
				<div className={"star-card__for-sale star-card__flag--left"}>
						<p>For Sale!</p>
				</div>
				}
				{owned &&
				<div className={"star-card__owned" + (forSale ? "" : " star-card__flag--left")}>
						<p>Owned</p>
				</div>
				}
				<Button
					name="Details"
					handleClick={() => {console.log("TODO: implement details page")}}
					styleClass={"btn-white-outline" + 
					(owned || forSale ? " star-card__details-button" : " star-card__details-button--lonely")}
				/>
			</div>
			<div className="star-card__body">
			<div className="star-card__id">
					{"#" + star.tokenId}
				</div>
				<div className="star-card__name">
					<div className="star-card__name-value">
						{toCapitalizedName(star.name)}
					</div>
					{owned &&
						<ButtonWithKillswitch
							name="Edit Name"
							handleClick={() => {console.log("TODO: implement edit name")}}
							styleClass={"btn-primary-outline"}
						/>
					}
				</div>
				<div className="star-card__coordinates">
					<div className="star-card__coordinates--RA">
						{
							"RA: " + 
							star.coordinates.rightAscension.hours + "h " +
							star.coordinates.rightAscension.minutes + "m " +
							star.coordinates.rightAscension.seconds + "s"
						}
					</div>
					<div className="star-card__coordinates--DEC">
						{
							"DEC: " + 
							star.coordinates.declination.degrees + "° " +
							star.coordinates.declination.arcMinutes + "′ " +
							star.coordinates.declination.arcSeconds + "“"
						}
					</div>
				</div>
				<div className="star-card__created">
					{"Created: " + star.date + " " + star.time}
				</div>
				{forSale &&
					<div className="star-card__price">
						<div className="star-card__price-value">
							{star.priceInEther + " ETH"}
						</div>
						{owned && 
							<ButtonWithKillswitch
								name="Edit Price"
								handleClick={() => {console.log("TODO: implement edit price")}}
								styleClass={"btn-primary-outline"}
							/>
						}
					</div>
				}
			</div>
			<div className="star-card__footer">
				{forSale && owned &&
					<ButtonWithKillswitch
						name="Remove From Sale"
						handleClick={() => {console.log("TODO: implement remove from sale")}}
						styleClass={"btn-warning-outline star-card__footer-button"}
					/>
				}
				{!forSale && owned &&
					<ButtonWithKillswitch
						name="Put For Sale"
						handleClick={() => {console.log("TODO: implement put for sale")}}
						styleClass={"btn-special-outline star-card__footer-button"}
					/>
				}
				{forSale && !owned &&
					<ButtonWithKillswitch
						name="Buy"
						handleClick={() => {console.log("TODO: implement buy")}}
						styleClass={"btn-secondary-outline star-card__footer-button"}
					/>
				}
			</div>	
		</div>
	);
};

const mapStateToProps = (state: RootState) => {
	return {
		userWallet: state.account.address,
	};
};

export const ConnectedStarCard = connect(
	mapStateToProps
)(StarCard);
