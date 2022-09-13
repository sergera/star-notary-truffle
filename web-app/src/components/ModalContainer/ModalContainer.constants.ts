import { ModalDisabled } from './provider/ModalDisabled';
import { ModalNotConnected } from './provider/ModalNotConnected';
import { ModalDisconnected } from './provider/ModalDisconnected';
import { ModalSelectChain } from './provider/ModalSelectChain';
import { ModalChainNotAdded } from './provider/ModalChainNotAdded';
import { ModalPleaseConnect } from './provider/ModalPleaseConnect/ModalPleaseConnect';
import { ModalIncompleteForm } from './form/ModalIncompleteForm';
import { ModalUnavailableCoordinates } from './form/ModalUnavailableCoordinates';
import { ModalUnavailableName } from './form/ModalUnavailableName';
import { ModalContractCallFailed } from './contract/ModalContractCallFailed';
import { ModalTxRejected } from './contract/ModalTxRejected';
import { ModalTokenNotOwned } from './contract/ModalTokenNotOwned';
import { ModalTokenAlreadyOwned } from './contract/ModalTokenAlreadyOwned';
import { ModalTokenNotForSale } from './contract/ModalTokenNotForSale';
import { ModalTokenAlreadyForSale } from './contract/ModalTokenAlreadyForSale';
import { ModalTokenIdenticalPrice } from './contract/ModalTokenIdenticalPrice';

import { MODAL_TYPES } from '../../constants';

import { ModalComponentsMap } from './ModalContainer.types';

export const MODAL_COMPONENTS: ModalComponentsMap = {
	[MODAL_TYPES.disabled]: ModalDisabled,
	[MODAL_TYPES.notConnected]: ModalNotConnected,
	[MODAL_TYPES.disconnected]: ModalDisconnected,
	[MODAL_TYPES.selectChain]: ModalSelectChain,
	[MODAL_TYPES.chainNotAdded]: ModalChainNotAdded,
	[MODAL_TYPES.pleaseConnect]: ModalPleaseConnect,
	[MODAL_TYPES.incompleteForm]: ModalIncompleteForm,
	[MODAL_TYPES.unavailableCoordinates]: ModalUnavailableCoordinates,
	[MODAL_TYPES.unavailableName]: ModalUnavailableName,
	[MODAL_TYPES.contractCallFailed]: ModalContractCallFailed,
	[MODAL_TYPES.txRejected]: ModalTxRejected,
	[MODAL_TYPES.tokenNotOwned]: ModalTokenNotOwned,
	[MODAL_TYPES.tokenAlreadyOwned]: ModalTokenAlreadyOwned,
	[MODAL_TYPES.tokenNotForSale]: ModalTokenNotForSale,
	[MODAL_TYPES.tokenAlreadyForSale]: ModalTokenAlreadyForSale,
	[MODAL_TYPES.tokenIdenticalPrice]: ModalTokenIdenticalPrice,
};
