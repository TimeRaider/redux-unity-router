import * as pathToRegexp from 'path-to-regexp';
import { stringify as qsStringify } from 'query-string';
import { createPath } from 'history';
import { flattenRoutes } from './util';
import RouterError from '../error';
import { RouteRegistry, RouteProcessed } from '../types';

const ERRORS = {
	noId: () => "Can't match route with no id",
	notFound: (id: string) => `Route with id ${id} not found`,
};

const createMatchRouteToPath = (registry: RouteRegistry) => ({
	id,
	params = {},
	query = {},
	hash = '',
}) => {
	if (id === undefined) {
		throw new RouterError(ERRORS.noId());
	}

	const matcher = registry[id];

	if (matcher === undefined) {
		throw new RouterError(ERRORS.notFound(id));
	}

	let pathname;

	try {
		// path-to-regexp (1.6.0): encodeURI by default, disable it with decodeURI
		// 'pretty' flag disable all encoding, besides '/', '?', '#'
		pathname = decodeURIComponent(matcher(params));
	} catch (e) {
		throw new RouterError(e.toString());
	}

	const location = {
		search: qsStringify(query),
		pathname,
		hash,
	};

	return createPath(location);
};

const createRouteToLocationParser = (routes: RouteProcessed[]) => {
	const registry: RouteRegistry = flattenRoutes(
		routes,
	).reduce((result: RouteRegistry, item) => {
		result[item.id] = pathToRegexp.compile(item.pattern.path);
		return result;
	}, {});

	return createMatchRouteToPath(registry);
};

export default createRouteToLocationParser;
