import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { connectionReducer } from './blockchain/connection';
import { contractReducer } from './blockchain/contract';
import { providerReducer } from './blockchain/wallet/provider';
import { chainReducer } from './blockchain/wallet/chain';
import { accountReducer } from './blockchain/wallet/account';
import { starReducer } from './star';
import { modalReducer } from './modal';
import { notificationReducer } from './notification';
import { toastReducer } from './toast';

export const combinedReducer = combineReducers({
	connection: connectionReducer,
	contract: contractReducer,
	provider: providerReducer,
	chain: chainReducer,
	account: accountReducer,
	star: starReducer,
	modal: modalReducer,
	notification: notificationReducer,
	toast: toastReducer,
});

export const store = configureStore({
	reducer: combinedReducer
});

export const useAppDispatch = () => useDispatch<Dispatch>();

export type Dispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type Store = typeof store;
