import { ACTION_PREFIX, ACTION_TYPES, HISTORY_METHODS } from '../constants';
import { parsePath } from 'history';

export default Registry => ({ dispatch, getState }) => next => action => {
	if (
		action.type.startsWith(ACTION_PREFIX) &&
		action.type !== ACTION_TYPES.LOCATION_CHANGED
	) {
		if (action.type === ACTION_TYPES.GO_TO_ROUTE) {
			action.type = ACTION_TYPES.PUSH;
			action.payload = routeParser(action.payload);
		}

		if ([ACTION_TYPES.PUSH, ACTION_TYPES.REPLACE].includes(action.type)) {
			action.payload =
				typeof action.payload === 'string'
					? parsePath(action.payload)
					: action.payload;

			const isSameLocation =
				history.location.pathname === action.payload.pathname &&
				history.location.search === action.payload.search &&
				history.location.hash === action.payload.hash;

			action.type = isSameLocation ? ACTION_TYPES.REPLACE : action.type;
		}

		if (HISTORY_METHODS[action.type]) {
			history[HISTORY_METHODS[action.type]](action.payload);
		}

		return;
	}

	return next(action); // eslint-disable-line consistent-return
};
