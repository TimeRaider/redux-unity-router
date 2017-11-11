import { ACTION_TYPES } from '../constants';
import { Payload } from '../types';

type Reducer = (
	state: Object,
	action: {
		type: string;
		payload: Payload;
	},
) => Object;

const reducer: Reducer = (state: {}, { type, payload }) => {
	if (type === ACTION_TYPES.LOCATION_CHANGE) {
		return payload;
	}
	return state;
};

export default reducer;
