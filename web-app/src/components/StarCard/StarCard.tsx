import { useState } from 'react';
import { connect } from 'react-redux';

import { Button } from '../UI/Button';
import { ConnectedButtonWithKillswitch as ButtonWithKillswitch } from '../UI/ButtonWithKillswitch';
import { TextInputWithRules } from '../UI/TextInputWithRules';

import { tokenOwned, tokenForSale, nameInUse, tokenPrice } from '../../blockchain/tokenSimpleCall';
import { buyStar, removeFromSale, putForSale, changeName } from '../../blockchain/tokenTransaction';
import { toCapitalizedName } from '../../format/string';
import { Log } from '../../logger';
import { isName, inLengthRange, isEther } from '../../validation/string';
import { ethToWei, weiToEth } from '../../format/eth/unit';
import { toLowerTrim } from '../../format/string';

import { store } from '../../state';
import { getStars } from '../../state/star';
import { openModal } from '../../state/modal';
import { openInfoToast, openSuccessToast, openErrorToast } from '../../state/toast';

import { MODAL_TYPES } from '../../constants';

import { StarCardProps } from "./StarCard.types";
import { RootState } from "../../state";

export function StarCard({
	star,
	userWallet,
}: StarCardProps) {

	let forSale = star.isForSale;
	let owned = star.owner.address.toLowerCase() === userWallet;

	let [openEditPrice, setOpenEditPrice] = useState(false);
	let [price, setPrice] = useState("");
	let [isValidPrice, setIsValidPrice] = useState(true);
	let [openEditName, setOpenEditName] = useState(false);
	let [name, setName] = useState("");
	let [isValidName, setIsValidName] = useState(true);

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

	const submitBuy = async () => {
		let couldCallContract = true;

		const isTokenOwned = await tokenOwned({
			address: userWallet,
			tokenId: star.tokenId,
		}).catch(() => {
			couldCallContract = false;
		});

		if(!couldCallContract) {
			store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
			return;
		}

		if(isTokenOwned) {
			store.dispatch(openModal(MODAL_TYPES.tokenAlreadyOwned));
			return;
		}

		const isTokenForSale = await tokenForSale({
			tokenId: star.tokenId,
		}).catch(() => {
			couldCallContract = false;
		});

		if(!couldCallContract) {
			store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
			return;
		}

		if(!isTokenForSale) {
			store.dispatch(openModal(MODAL_TYPES.tokenNotForSale));
			return;
		}

		const contractPrice = await tokenPrice({
			tokenId: star.tokenId,
		}).catch(() => {
			couldCallContract = false;
		});

		if(!couldCallContract) {
			store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
			return;
		}

		if(weiToEth(contractPrice).toString() !== star.priceInEther) {
			store.dispatch(openModal(MODAL_TYPES.tokenDifferentPrice));
			return;
		}

		await buyStar({
			tokenId: star.tokenId,
			owner: userWallet,
			value: ethToWei(star.priceInEther),
			onTxHash: () => {
				store.dispatch(openInfoToast("transaction sent: awaiting confirmations..."));
			},
			onFirstConfirmation: (currentConfirmation, maxConfirmations) => {
				store.dispatch(openInfoToast("transaction mined!"));
				store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
			},
			onIntermediateConfirmation: (currentConfirmation, maxConfirmations) => {
				store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
			},
			onFinalConfirmation: () => {
				store.dispatch(openSuccessToast("star bought!"));
				store.dispatch(getStars());
			},
			onTxError: (msg: string) => {
				Log.error({msg: msg, description: "transaction rejected buying star"});
				store.dispatch(openErrorToast("error processing purchase transaction"));
			},
			onError: (msg: string) => {
				Log.error({msg: msg, description: "error buying star"});
				store.dispatch(openErrorToast("contract call failed"));
			},
		});
	}

	const submitRemoveFromSale = async () => {
		let couldCallContract = true;

		const isTokenOwned = await tokenOwned({
			address: userWallet,
			tokenId: star.tokenId,
		}).catch(() => {
			couldCallContract = false;
		});

		if(!couldCallContract) {
			store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
			return;
		}

		if(!isTokenOwned) {
			store.dispatch(openModal(MODAL_TYPES.tokenNotOwned));
			return;
		}

		const isTokenForSale = await tokenForSale({
			tokenId: star.tokenId,
		}).catch(() => {
			couldCallContract = false;
		});

		if(!couldCallContract) {
			store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
			return;
		}

		if(!isTokenForSale) {
			store.dispatch(openModal(MODAL_TYPES.tokenNotForSale));
			return;
		}

		await removeFromSale({
			tokenId: star.tokenId,
			owner: userWallet,
			onTxHash: () => {
				store.dispatch(openInfoToast("transaction sent: awaiting confirmations..."));
			},
			onFirstConfirmation: (currentConfirmation, maxConfirmations) => {
				store.dispatch(openInfoToast("transaction mined!"));
				store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
			},
			onIntermediateConfirmation: (currentConfirmation, maxConfirmations) => {
				store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
			},
			onFinalConfirmation: () => {
				store.dispatch(openSuccessToast("star removed from sale!"));
				store.dispatch(getStars());
			},
			onTxError: (msg: string) => {
				Log.error({msg: msg, description: "transaction rejected removing star from sale"});
				store.dispatch(openErrorToast("error processing remove from sale transaction"));
			},
			onError: (msg: string) => {
				Log.error({msg: msg, description: "error removing star from sale"});
				store.dispatch(openErrorToast("contract call failed"));
			},
		});
	}

	const attemptPutForSale = async () => {
		let couldCallContract = true;

		const isTokenForSale = await tokenForSale({
			tokenId: star.tokenId,
		}).catch(() => {
			couldCallContract = false;
		});

		if(!couldCallContract) {
			store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
			return;
		}

		if(isTokenForSale) {
			store.dispatch(openModal(MODAL_TYPES.tokenAlreadyForSale));
			return;
		}

		editPrice();
	}

	const attemptChangePrice = async () => {
		let couldCallContract = true;

		const contractPrice = await tokenPrice({
			tokenId: star.tokenId,
		}).catch(() => {
			couldCallContract = false;
		});

		if(!couldCallContract) {
			store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
			return;
		}

		if(weiToEth(contractPrice).toString() === price) {
			store.dispatch(openModal(MODAL_TYPES.tokenIdenticalPrice));
			return;
		}

		submitPrice();
	}

	const editPrice = () => {
		setOpenEditPrice(true);
	}

	const resetPrice = () => {
		setPrice("");
		setIsValidPrice(true);
	}

	const getPrice = (price: string) => {
		setIsValidPrice(isEther(price) && price !== "0" && price !== "0.0");
		setPrice(price.replace(",","."));
	}

	const submitPrice = async () => {
		if(price && isValidPrice) {
			let couldCallContract = true;

			const isTokenOwned = await tokenOwned({
				address: userWallet,
				tokenId: star.tokenId,
			}).catch(() => {
				couldCallContract = false;
			});
	
			if(!couldCallContract) {
				store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
				return;
			}
	
			if(!isTokenOwned) {
				store.dispatch(openModal(MODAL_TYPES.tokenNotOwned));
				return;
			}

			setOpenEditPrice(false);
			resetPrice();

			await putForSale({
				tokenId: star.tokenId,
				price: ethToWei(price),
				owner: userWallet,
				onTxHash: () => {
					store.dispatch(openInfoToast("transaction sent: awaiting confirmations..."));
				},
				onFirstConfirmation: (currentConfirmation, maxConfirmations) => {
					store.dispatch(openInfoToast("transaction mined!"));
					store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
				},
				onIntermediateConfirmation: (currentConfirmation, maxConfirmations) => {
					store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
				},
				onFinalConfirmation: () => {
					store.dispatch(openSuccessToast("star price set!"));
					store.dispatch(getStars());
				},
				onTxError: (msg: string) => {
					Log.error({msg: msg, description: "transaction rejected setting star price"});
					store.dispatch(openErrorToast("error processing set price transaction"));
				},
				onError: (msg: string) => {
					Log.error({msg: msg, description: "error setting star price"});
					store.dispatch(openErrorToast("contract call failed"));
				},
			});
		} else {
			store.dispatch(openModal(MODAL_TYPES.incompleteForm));
		}
	}

	const editName = () => {
		setOpenEditName(true);
	}

	const resetName = () => {
		setName("");
		setIsValidName(true);
	}

	const getName = (name: string) => {
		setIsValidName(isName(name) && inLengthRange(name,2,32));
		setName(name);

	}

	const submitName = async () => {
		if(name && isValidName) {
			let couldCallContract = true;

			const isTokenOwned = await tokenOwned({
				address: userWallet,
				tokenId: star.tokenId,
			}).catch(() => {
				couldCallContract = false;
			});
	
			if(!couldCallContract) {
				store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
				return;
			}
	
			if(!isTokenOwned) {
				store.dispatch(openModal(MODAL_TYPES.tokenNotOwned));
				return;
			}

			const isNameInUse = await nameInUse({
				name: toLowerTrim(name),
			}).catch(() => {
				couldCallContract = false;
			});
	
			if(!couldCallContract) {
				store.dispatch(openModal(MODAL_TYPES.contractCallFailed));
				return;
			}
	
			if(isNameInUse) {
				store.dispatch(openModal(MODAL_TYPES.unavailableName));
				return;
			}

			setOpenEditName(false);
			resetName();

			await changeName({
				tokenId: star.tokenId,
				newName: toLowerTrim(name),
				owner: userWallet,
				onTxHash: () => {
					store.dispatch(openInfoToast("transaction sent: awaiting confirmations..."));
				},
				onFirstConfirmation: (currentConfirmation, maxConfirmations) => {
					store.dispatch(openInfoToast("transaction mined!"));
					store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
				},
				onIntermediateConfirmation: (currentConfirmation, maxConfirmations) => {
					store.dispatch(openInfoToast(`confirmations: ${currentConfirmation}/${maxConfirmations}`));
				},
				onFinalConfirmation: () => {
					store.dispatch(openSuccessToast("star name set!"));
					store.dispatch(getStars());
				},
				onTxError: (msg: string) => {
					Log.error({msg: msg, description: "transaction rejected setting star name"});
					store.dispatch(openErrorToast("error processing set name transaction"));
				},
				onError: (msg: string) => {
					Log.error({msg: msg, description: "error setting star name"});
					store.dispatch(openErrorToast("contract call failed"));
				},
			});
		} else {
			store.dispatch(openModal(MODAL_TYPES.incompleteForm));
		}
	}

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
					{owned && !openEditName &&
						<ButtonWithKillswitch
							name="Edit Name"
							handleClick={editName}
							styleClass={"btn-primary-outline"}
						/>
					}
				</div>
				{openEditName &&
					<div className="star-card__edit">
						<TextInputWithRules 
							handleChange={getName}
							value={name}
							isValid={isValidName}
							isRequired={true}
							placeholder={"enter new name"}
							rules={[
								"between 2 and 32 letters",
								"non-consecutive spaces in between",
							]}
						/>
						<div className="star-card__edit-buttons">
							<ButtonWithKillswitch
								styleClass="btn-secondary-outline" 
								name={"Set Name"} 
								handleClick={submitName}
							/>
							<Button
								styleClass="btn-warning-outline" 
								name={"Cancel"} 
								handleClick={() => setOpenEditName(false)}
							/>
						</div>
					</div>
				}
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
						{owned && !openEditPrice &&
							<ButtonWithKillswitch
								name="Edit Price"
								handleClick={editPrice}
								styleClass={"btn-primary-outline"}
							/>
						}
					</div>
				}
				{openEditPrice && 
					<div className="star-card__edit">
						<TextInputWithRules 
							handleChange={getPrice}
							value={price}
							isValid={isValidPrice}
							isRequired={true}
							placeholder={"enter ether amount"}
							rules={[
								"non-zero amount",
								"no insignificant zeroes",
								"max 18 decimal digits",
								"max 59 whole digits",
							]}
						/>
						<div className="star-card__edit-buttons">
							<ButtonWithKillswitch
								styleClass="btn-secondary-outline" 
								name={"Set Price"} 
								handleClick={attemptChangePrice}
							/>
							<Button
								styleClass="btn-warning-outline"
								name={"Cancel"} 
								handleClick={() => setOpenEditPrice(false)}
							/>
						</div>
					</div>
				}
			</div>
			<div className="star-card__footer">
				{forSale && owned &&
					<ButtonWithKillswitch
						name="Remove From Sale"
						handleClick={submitRemoveFromSale}
						styleClass={"btn-warning-outline star-card__footer-button"}
					/>
				}
				{!forSale && owned && !openEditPrice &&
					<ButtonWithKillswitch
						name="Put For Sale"
						handleClick={attemptPutForSale}
						styleClass={"btn-special-outline star-card__footer-button"}
					/>
				}
				{userWallet && forSale && !owned &&
					<ButtonWithKillswitch
						name="Buy"
						handleClick={submitBuy}
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
