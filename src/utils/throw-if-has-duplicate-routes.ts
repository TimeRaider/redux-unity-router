import { RouteProcessed } from '../types';
import RouterError from '../error';
import findDuplicateRoutes from './find-duplicate-routes';

type ThrowIfhasDuplicateRoutes = (routes: RouteProcessed[]) => void;

const throwIfhasDuplicateRoutes: ThrowIfhasDuplicateRoutes = routes => {
	const duplicateRoutes = findDuplicateRoutes(routes);

	if (duplicateRoutes) {
		throw new RouterError(
			`Routes 
				${JSON.stringify(duplicateRoutes[0])} 
				and 
				${JSON.stringify(duplicateRoutes[1])}
				have idential paths
			`,
		);
	}
};

export default throwIfhasDuplicateRoutes;
