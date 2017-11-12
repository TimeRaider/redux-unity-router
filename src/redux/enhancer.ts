import { StoreEnhancer } from 'redux';
import Registry from '../registry';
import scrollToHash from '../utils/scroll-to-hash';
import { Actions } from '../constants';

const createEnchancer = (registry: Registry): StoreEnhancer<{}> => next => (
	reducer,
	initialState,
) => {
	const initialLocation = registry.pathToPayload(registry.history.location);
	scrollToHash(initialLocation.hash);

	const newInitialState = {
		[registry.slice]: initialLocation,
	};

	const store = next(reducer, newInitialState);

	registry.history.listen(location => {
		store.dispatch(Actions.locationChange(initialLocation));
		scrollToHash(location.hash);
	});

	return store;
};

export default createEnchancer;
