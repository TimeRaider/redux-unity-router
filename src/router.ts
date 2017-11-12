import { StoreEnhancer, Middleware } from 'redux';
import reducer from './redux/reducer';
import createEnhancer from './redux/enhancer';
import createMiddleware from './redux//middleware';

import Registry, { RegistryParams } from './registry';

type CreateRouter = (
	params: RegistryParams,
) => {
	reducer: typeof reducer;
	enhancer: StoreEnhancer<{}>;
	middleware: Middleware;
};

const createRouter: CreateRouter = params => {
	const registry = new Registry({
		...params,
	});

	return {
		reducer,
		enhancer: createEnhancer(registry),
		middleware: createMiddleware(registry),
	};
};

export default createRouter;
