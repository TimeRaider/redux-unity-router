import * as actions from './actions';

const createInitialState = ({ state, slice, val, immutable }) => {
	if (immutable) {
		state = state.set(slice, require('immutable').fromJS(val));
	} else {
		state[slice] = val;
	}
	return state;
};

const scrollToHash = hash => {
	if (hash && window && typeof window.requestAnimationFrame === 'function') {
		window.requestAnimationFrame(() => {
			const node = document.getElementById(location.hash.substr(1));
			if (node) {
				node.scrollIntoView();
			}
		});
	}
};

export default ({ history, slice, locationParser, immutable }) => next => (
	reducer,
	initialState,
	enhancer,
) => {
	// boilerplate
	if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
		enhancer = initialState;
		initialState = undefined;
	}
	let newInitialState = initialState || enhancer;

	const initialLocation = locationParser(history.location);

	scrollToHash(initialLocation.hash);

	newInitialState = createInitialState({
		state: newInitialState,
		val: initialLocation,
		slice,
		immutable,
	});

	const store = next(reducer, newInitialState, enhancer);

	history.listen(location => {
		if (location.silent) return;

		store.dispatch(actions.locationChange(location));

		scrollToHash(location.hash);
	});

	return store;
};
