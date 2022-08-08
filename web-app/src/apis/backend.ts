import axios from "axios";

const backendURL = process.env.REACT_APP_BACKEND;

export const backend = axios.create({
	baseURL: backendURL,
	headers: {'Content-Type': 'application/json'}
});
