import { Location } from 'history';
import { ACTION_TYPES } from '../constants';

export const push = (payload: string | Location) => ({
	type: ACTION_TYPES.PUSH,
	payload,
});

export const replace = (payload: string | Location) => ({
	type: ACTION_TYPES.REPLACE,
	payload,
});

export const go = (payload: number) => ({
	type: ACTION_TYPES.GO,
	payload,
});

export const goBack = () => ({
	type: ACTION_TYPES.GO_BACK,
});

export const goForward = () => ({
	type: ACTION_TYPES.GO_FORWARD,
});

export const goToRoute = (payload: {
	id: string;
	params?: {};
	query?: {} | string;
	hash?: string;
}) => ({
	type: ACTION_TYPES.GO_TO_ROUTE,
	payload,
});

export const locationChange = payload => ({
	type: ACTION_TYPES.LOCATION_CHANGE,
	payload,
});
