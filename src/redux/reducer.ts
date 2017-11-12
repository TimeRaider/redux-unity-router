import { ActionTypes, Actions } from '../constants';

type Reducer = (
	state: Actions.LocationChange['payload'],
	action: Actions.LocationChange,
) => Actions.LocationChange['payload'];

const reducer: Reducer = (state, { type, payload }) => {
	if (type === ActionTypes.LOCATION_CHANGE) {
		return payload;
	}
	return state;
};

export default reducer;
