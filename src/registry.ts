import { compile, PathFunction, Key } from 'path-to-regexp';
import * as pathToRegexp from 'path-to-regexp';
import { parse as qsParse, stringify as qsStringify } from 'query-string';
import { createLocation, createPath, Location } from 'history';
import { Route, RouteProcessed, Params } from './types';
import RouterError from './error';
import { SLICE } from './constants';

import flattenRoutes from './utils/flatten-routes';
import createParamsFromKeys from './utils/create-params-from-keys';

export class Registry {
	slice: string;

	private paths: RouteProcessed['path'][] = [];
	private idToPath: { [id: string]: RouteProcessed['path'] } = {};
	private routes: {
		[path: string]: {
			regexp: RegExp;
			keys: Key[];
			fn: PathFunction;
			route: RouteProcessed;
		};
	} = {};

	public constructor(routes: Route[], slice?: string) {
		this.slice = slice || SLICE;
		flattenRoutes(routes).forEach((route, index) => {
			this.paths[index] = route.path;
			if (route.id) {
				this.idToPath[route.id] = route.path;
			}

			const keys: Key[] = [];
			const regexp = pathToRegexp(route.path, keys);
			this.routes[route.path] = {
				fn: compile(route.path),
				regexp,
				keys,
				route,
			};
		});
		return this;
	}

	public pathToState(path: string) {
		const location = createLocation(path);
		const query = qsParse(location.search);
		const state = location.state || {};
		const route = this.locationToRoute(location);

		return {
			...location,
			path,
			query,
			state,
			route,
		};
	}

	public routeToPath(
		id: string,
		params: {} = {},
		query: {} = {},
		hash: string = '',
	) {
		const path = this.getPathById(id);
		const pathFunction = this.routes[path].fn;
		let pathname;

		try {
			// path-to-regexp (1.6.0): encodeURI by default, disable it with decodeURI
			// 'pretty' flag disable all encoding, besides '/', '?', '#'
			pathname = decodeURIComponent(pathFunction(params));
		} catch (e) {
			throw new RouterError(e.toString());
		}

		const location = {
			search: qsStringify(query),
			pathname,
			hash,
		};

		return createPath(location);
	}

	private locationToRoute(
		location: Location,
	): RouteProcessed & {
		path: RouteProcessed['path'];
		params: Params;
	} {
		const path = this.getPathByLocation(location);
		const params = this.getParams(path, location);

		return {
			...this.routes[path].route,
			path,
			params,
		};
	}

	private getParams(path: Route['path'], location: Location): Params {
		const match = this.routes[path].regexp.exec(location.pathname);
		return createParamsFromKeys(match as string[], this.routes[path].keys);
	}

	private getPathById(id: string): string | never {
		const path = this.idToPath[id];
		if (path === undefined) {
			throw new RouterError(`Can't find route with id "${id}"`);
		}
		return path;
	}

	private getPathByLocation(location: Location): string | never {
		const path = this.paths.find(p =>
			this.routes[p].regexp.test(location.pathname),
		);
		if (!path) {
			throw new RouterError(
				`Can't find path for location 
				${JSON.stringify(location)}`,
			);
		}
		return path;
	}
}

const registry = new Registry([{ id: 'test', path: '/test/:foo?' }]);
const states = [
	registry.pathToState('/test/'),
	registry.pathToState('/test/hey'),
	registry.pathToState('/test/you?test=what'),
	registry.pathToState('/test/you?test=what#yo'),
];
const paths = [
	registry.routeToPath('test'),
	registry.routeToPath('test', { foo: 'bar' }),
	registry.routeToPath('test', { hey: 'test' }),
	registry.routeToPath('test', {}, { q: 'ya' }),
	registry.routeToPath('test', {}, { q: 'ya' }, 'hash'),
	registry.routeToPath(
		'test',
		{ foo: 'bar', hey: 'test' },
		{ q: 'ya' },
		'hash',
	),
];
debugger;
