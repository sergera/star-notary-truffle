import { getBackendURL } from "../env";

import { store } from "../state";
import { updateDisplay } from "../state/star";

const backendURL = getBackendURL();
var ws: WebSocket;

export const listenForStars = () => {
	ws = new WebSocket(`ws://${backendURL}/notify-stars`)
	ws.onmessage = function (event) {
		console.log("RECEIVED WEBSOCKET MESSAGE: ", event.data)
		const backendStars = JSON.parse(event.data);
		store.dispatch(updateDisplay(backendStars));
	}
};
