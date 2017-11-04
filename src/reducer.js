import { ACTION_TYPES } from './constants';

export default ({ locationParser, immutable }) => (
	state = immutable ? require('immutable').fromJS({}) : {},
	{ type, payload },
) => {
	if (type === ACTION_TYPES.LOCATION_CHANGED) {
		const result = locationParser(payload);

		return immutable ? require('immutable').fromJS(result) : result;
	}

	return state;
};
