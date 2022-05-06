import { checkConnection,	initialState } from '.';
import { connectWallet } from '../wallet';
import { providerDisconnected } from '../wallet/provider';

import { getNewStore } from '../../../test';
import { metamask } from '../../../blockchain/metamask';
import { isChainSupported, getChainName } from '../../../blockchain/chains';
import { checkAllContractsAcquired } from '../../../blockchain/contracts';

/* silence logger */
jest.mock("../../../logger");

/* mock functions to be mocked */
/* mock functions that use window.ethereum so that error isn't thrown on access */
/* mock all used functions in mocked modules so that error isn't thrown on access */
jest.mock("../../../blockchain/chains", () => ({
	__esModule: true,
	isChainSupported: jest.fn(),
	getChainName: jest.fn(),
}));

const mockIsChainSupported = isChainSupported as jest.Mock;
const mockGetChainName = getChainName as jest.Mock;

jest.mock("../../../blockchain/contracts", () => ({
	__esModule: true,
	setContracts: jest.fn(),
	deleteContracts: jest.fn(),
	checkAllContractsAcquired: jest.fn(),
}));

const mockCheckAllContractsAcquired = checkAllContractsAcquired as jest.Mock;

/* declare mock return variables */
const fakeProviderDetection = {
	fakeProvider: true
};
const fakeChainIdHex = "0x0";
const fakeChainName = "fake chain name";
const fakeAddress = "fake address";
const fakeAccounts = [fakeAddress];

/* test */
let store = getNewStore();

afterEach(() => {
	store = getNewStore();
});

test("should set initial state", () => {
	const state = store.getState().connection;
	expect(state).toEqual(initialState);
});

describe("checkConnection", () => {
	test("should set killswitch false if all blockchain related state is ok", async () => {
		mockIsChainSupported.mockImplementation(() => true);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => fakeProviderDetection;
		metamask.isConnected = () => true;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => fakeAccounts;
		metamask.setConnectCallback = () => {return null};
		metamask.setDisconnectCallback = () => {return null};
		metamask.setChainSwitchCallback = () => {return null};
		metamask.setAccountSwitchCallback = () => {return null};
	
		mockCheckAllContractsAcquired.mockImplementation(() => true);
	
		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(false);
	});

	test("should set killswitch true if metamask not enabled", async () => {
		mockIsChainSupported.mockImplementation(() => true);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => null;
		metamask.isConnected = () => true;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => fakeAccounts;
		metamask.setConnectCallback = () => {return null};
		metamask.setDisconnectCallback = () => {return null};
		metamask.setChainSwitchCallback = () => {return null};
		metamask.setAccountSwitchCallback = () => {return null};
	
		mockCheckAllContractsAcquired.mockImplementation(() => true);
	
		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(true);
	});

	test("should set killswitch true if provider listeners not set", async () => {
		mockIsChainSupported.mockImplementation(() => true);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => fakeProviderDetection;
		metamask.isConnected = () => true;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => fakeAccounts;
		metamask.setChainSwitchCallback = () => {return null};
		metamask.setAccountSwitchCallback = () => {return null};
	
		mockCheckAllContractsAcquired.mockImplementation(() => true);
	
		metamask.setConnectCallback = () => {throw new Error("")};
		metamask.setDisconnectCallback = () => () => {throw new Error("")};

		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(true);
	});

	test("should set killswitch true if chain not connected", async () => {
		mockIsChainSupported.mockImplementation(() => true);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => fakeProviderDetection;
		metamask.isConnected = () => false;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => fakeAccounts;
		metamask.setConnectCallback = () => {return null};
		metamask.setDisconnectCallback = () => {return null};
		metamask.setChainSwitchCallback = () => {return null};
		metamask.setAccountSwitchCallback = () => {return null};
	
	
		mockCheckAllContractsAcquired.mockImplementation(() => true);
	
		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(true);
	});

	test("should set killswitch true if chain not permitted", async () => {
		mockIsChainSupported.mockImplementation(() => false);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => fakeProviderDetection;
		metamask.isConnected = () => true;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => fakeAccounts;
		metamask.setConnectCallback = () => {return null};
		metamask.setDisconnectCallback = () => {return null};
		metamask.setChainSwitchCallback = () => {return null};
		metamask.setAccountSwitchCallback = () => {return null};	
	
		mockCheckAllContractsAcquired.mockImplementation(() => true);
	
		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(true);
	});

	test("should set killswitch true if chain listeners not set", async () => {
		mockIsChainSupported.mockImplementation(() => true);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => fakeProviderDetection;
		metamask.isConnected = () => true;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => fakeAccounts;
		metamask.setConnectCallback = () => {return null};
		metamask.setDisconnectCallback = () => {return null};
		metamask.setAccountSwitchCallback = () => {return null};
	
		mockCheckAllContractsAcquired.mockImplementation(() => true);
	
		metamask.setChainSwitchCallback = () => {throw new Error("")};

		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(true);
	});

	test("should set killswitch true if account not retrieved", async () => {
		mockIsChainSupported.mockImplementation(() => true);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => fakeProviderDetection;
		metamask.isConnected = () => true;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => [""];
		metamask.setConnectCallback = () => {return null};
		metamask.setDisconnectCallback = () => {return null};
		metamask.setChainSwitchCallback = () => {return null};
		metamask.setAccountSwitchCallback = () => {return null};
	
		mockCheckAllContractsAcquired.mockImplementation(() => true);

		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(true);
	});

	test("should set killswitch true if account listeners not set", async () => {
		mockIsChainSupported.mockImplementation(() => true);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => fakeProviderDetection;
		metamask.isConnected = () => true;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => fakeAccounts;
		metamask.setConnectCallback = () => {return null};
		metamask.setDisconnectCallback = () => {return null};
		metamask.setChainSwitchCallback = () => {return null};
	
		mockCheckAllContractsAcquired.mockImplementation(() => true);

		metamask.setAccountSwitchCallback = () => {throw new Error("")};

		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(true);
	});

	test("should set killswitch true if contracts not acquired", async () => {
		mockIsChainSupported.mockImplementation(() => true);
		mockGetChainName.mockImplementation(() => fakeChainName);
	
		metamask.acquireProvider = () => fakeProviderDetection;
		metamask.isConnected = () => true;
		metamask.requestChainId = async () => fakeChainIdHex;
		metamask.requestAccounts = async () => fakeAccounts;
		metamask.setConnectCallback = () => {return null};
		metamask.setDisconnectCallback = () => {return null};
		metamask.setChainSwitchCallback = () => {return null};
		metamask.setAccountSwitchCallback = () => {return null};
	
		mockCheckAllContractsAcquired.mockImplementation(() => false);
	
		await store.dispatch(connectWallet());
		await store.dispatch(checkConnection());
		expect(store.getState().connection.killswitch).toEqual(true);
	});
});

test("should reset state if provider disconnected", async () => {
	mockIsChainSupported.mockImplementation(() => true);
	mockGetChainName.mockImplementation(() => fakeChainName);

	metamask.acquireProvider = () => fakeProviderDetection;
	metamask.isConnected = () => true;
	metamask.requestChainId = async () => fakeChainIdHex;
	metamask.requestAccounts = async () => fakeAccounts;
	metamask.setConnectCallback = () => {return null};
	metamask.setDisconnectCallback = () => {return null};
	metamask.setChainSwitchCallback = () => {return null};
	metamask.setAccountSwitchCallback = () => {return null};

	mockCheckAllContractsAcquired.mockImplementation(() => true);

	await store.dispatch(connectWallet());
	await store.dispatch(checkConnection());

	expect(store.getState().connection.killswitch).toEqual(false);

	await store.dispatch(providerDisconnected());
	expect(store.getState().connection).toEqual(initialState);
});
