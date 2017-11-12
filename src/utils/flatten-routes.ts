import { join as pathJoin } from 'path';
import { Route, RouteProcessed } from '../constants';
import RouterError from '../error';
import throwIfDuplicate from './throw-if-has-duplicate-routes';

type FlattenRoutes = (
	routes: Route[],
	parentRoutePath?: Route['path'],
	parentState?: Route['state'],
) => RouteProcessed[];

const flattenRoutes: FlattenRoutes = (
	routes,
	parentRoutePath = '',
	parentState = {},
) => {
	const processedRoutes = routes.reduce((prev: RouteProcessed[], route) => {
		if (!route.path) {
			throw new RouterError(
				`No path defined for route ${JSON.stringify(route)}`,
			);
		}

		const path: Route['path'] = pathJoin(parentRoutePath, route.path);
		const state: Route['state'] = {
			...parentState,
			...(route.state || {}),
		};

		const processedRoute: RouteProcessed = {
			id: route.id,
			path: pathJoin(parentRoutePath, route.path),
			state,
		};

		const res = route.routes
			? [...prev, ...flattenRoutes(route.routes, path, state)]
			: prev;

		return [...res, processedRoute];
	}, []);

	throwIfDuplicate(processedRoutes);
	return processedRoutes;
};

export default flattenRoutes;
