import { ActionTypes, Actions } from '../constants';

type Reducer = (state: Object, action: Actions.LocationChange) => Object;

const reducer: Reducer = (state: {}, { type, payload }) => {
	if (type === ActionTypes.LOCATION_CHANGE) {
		return payload;
	}
	return state;
};

export default reducer;
