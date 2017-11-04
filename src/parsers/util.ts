import { join as pathJoin } from 'path';
import { ID_DELIM } from '../constants';
import { Route, RouteProcessed, PatternObj } from '../types';
import RouterError from '../error';

type FlattenRoutes = (
	routes: Route[],
	parentRoutePath?: string,
	parentIdPath?: string,
	parentData?: Route['data'],
) => RouteProcessed[];

export const flattenRoutes: FlattenRoutes = (
	routes,
	parentRoutePath = '',
	parentIdPath = '',
	parentData = {},
) =>
	routes.reduce((prev: RouteProcessed[], route) => {
		if (route.pattern === undefined) {
			throw new RouterError(
				`No pattern defined for route ${JSON.stringify(route)}`,
			);
		}

		const pattern: PatternObj =
			typeof route.pattern === 'string'
				? { path: route.pattern }
				: route.pattern;
		const path: string = pathJoin(parentRoutePath, pattern.path || '');
		const id = String(route.id) || path;
		const data = route.data || {};
		const idPath = [parentIdPath, id].filter(i => i !== '').join(ID_DELIM);
		const res = Array.isArray(route.routes)
			? [...prev, ...flattenRoutes(route.routes, path, idPath, data)]
			: prev;

		const item: RouteProcessed = {
			id,
			idPath,
			data: {
				...parentData,
				...data,
			},
			...{
				pattern: {
					...pattern,
					path,
				},
			},
		};

		return [...res, item];
	}, []);
