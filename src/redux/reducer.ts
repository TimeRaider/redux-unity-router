import { ActionTypes, Actions } from '../constants';

type Reducer = (state: {}, action: Actions.LocationChange) => {};

const reducer: Reducer = (state = {}, { type, payload }) => {
	if (type === ActionTypes.LOCATION_CHANGE) {
		return payload;
	}
	return state;
};

export default reducer;
