import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { connectAccount, setAccountListeners } from './thunks';
import { providerDisconnected } from '../provider';

import { AccountSlice } from './accountSlice.types';

export const initialState: AccountSlice = {
	address: "",
	listenersAreSet: false,
}

const accountSlice = createSlice({
	name: "blockchain/wallet/account",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(connectAccount.fulfilled, (state, action: PayloadAction<string>) => {
			let address = action.payload;
      state.address = address;
    });
		builder.addCase(connectAccount.rejected, (state) => {
      state.address = "";
    });
		builder.addCase(setAccountListeners.fulfilled, (state) => {
			state.listenersAreSet = true;
    });
		builder.addCase(providerDisconnected.fulfilled, (state) => {
			state.address = "";
			state.listenersAreSet = false;
    });
  }
});

export const accountReducer = accountSlice.reducer;
