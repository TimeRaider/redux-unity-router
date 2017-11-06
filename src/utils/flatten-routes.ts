import { join as pathJoin } from 'path';
import { Route, RouteProcessed } from '../types';
import RouterError from '../error';
import throwIfDuplicate from './throw-if-has-duplicate-routes';

type FlattenRoutes = (
	routes: Route[],
	parentRoutePath?: Route['path'],
	parentData?: Route['data'],
) => RouteProcessed[] | never;

const flattenRoutes: FlattenRoutes = (
	routes,
	parentRoutePath = '',
	parentData = {},
) => {
	const processedRoutes = routes.reduce((prev: RouteProcessed[], route) => {
		if (!route.path) {
			throw new RouterError(
				`No path defined for route ${JSON.stringify(route)}`,
			);
		}

		const path: Route['path'] = pathJoin(parentRoutePath, route.path);
		const data: Route['data'] = {
			...parentData,
			...(route.data || {}),
		};

		const processedRoute: RouteProcessed = {
			id: route.id,
			path: pathJoin(parentRoutePath, route.path),
			data,
		};

		const res = route.routes
			? [...prev, ...flattenRoutes(route.routes, path, data)]
			: prev;

		return [...res, processedRoute];
	}, []);

	throwIfDuplicate(processedRoutes);
	return processedRoutes;
};

export default flattenRoutes;
