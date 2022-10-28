import { getBackendURL } from "../env";

import { store } from "../state";
import { updateDisplay } from "../state/star";

const backendURL = getBackendURL();
var ws: WebSocket;

export const listenForStars = () => {
	ws = new WebSocket(`ws://${backendURL}/notify-stars`)
	ws.onmessage = function (event) {
		const backendStar = JSON.parse(event.data);
		store.dispatch(updateDisplay(backendStar));
	}
};
