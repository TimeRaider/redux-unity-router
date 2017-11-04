import { join as pathJoin } from 'path';
import { Route, RouteProcessed } from '../types';
import RouterError from '../error';

type FlattenRoutes = (
	routes: Route[],
	parentRoutePath?: Route['path'],
	parentData?: Route['data'],
) => RouteProcessed[];

export const flattenRoutes: FlattenRoutes = (
	routes,
	parentRoutePath = '',
	parentData = {},
) =>
	routes.reduce((prev: RouteProcessed[], route) => {
		if (route.path === undefined) {
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

		const res = Array.isArray(route.routes)
			? [...prev, ...flattenRoutes(route.routes, path, data)]
			: prev;

		return [...res, processedRoute];
	}, []);

type FindDuplicateRoutes = (
	routes: RouteProcessed[],
) => [RouteProcessed, RouteProcessed] | false;

export const findDuplicateRoutes: FindDuplicateRoutes = routes => {
	const paths = routes.map(({ path }) => path);
	for (let path of paths) {
		const firstIndex = paths.indexOf(path);
		const lastIndex = paths.lastIndexOf(path);
		if (firstIndex !== lastIndex) {
			return [routes[firstIndex], routes[lastIndex]];
		}
	}
	return false;
};

type ThrowIfhasDuplicateRoutes = (routes: RouteProcessed[]) => void | never;

export const throwIfhasDuplicateRoutes: ThrowIfhasDuplicateRoutes = routes => {
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
