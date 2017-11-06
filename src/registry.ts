import { compile, PathFunction, Key } from 'path-to-regexp';
import * as pathToRegexp from 'path-to-regexp';
import { parse as qsParse, stringify as qsStringify } from 'query-string';
import { createLocation, createPath, Location } from 'history';
import { Route, RouteProcessed } from './types';
import RouterError from './error';

import flattenRoutes from './utils/flatten-routes';
import createParamsFromKeys from './utils/create-params-from-keys';

export class Registry {
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

	public constructor(routes: Route[]) {
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

	public locationToState(location: string) {
		const locationObject = createLocation(location);
		const query = qsParse(locationObject.search);
		const state = locationObject.state || {};
		const route = this.locationToRoute(locationObject);

		return {
			...locationObject,
			location,
			query,
			state,
			route,
		};
	}

	public routeToLocation(
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

	private getPathById(id: string): string | never {
		const path = this.idToPath[id];
		if (path === undefined) {
			throw new RouterError(`Can't find route with id "${id}"`);
		}
		return path;
	}

	private locationToRoute(location: Location) {
		const path = this.findPathByLocation(location);
		const params = this.getPathParams(path, location);

		return {
			...this.routes[path].route,
			path,
			params,
		};
	}

	private getPathParams(
		path: Route['path'],
		location: Location,
	): { [x: string]: {} } {
		const match = this.routes[path].regexp.exec(location.pathname);
		return createParamsFromKeys(match as string[], this.routes[path].keys);
	}

	private findPathByLocation(location: Location): string | never {
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
	registry.locationToState('/test/'),
	registry.locationToState('/test/hey'),
	registry.locationToState('/test/you?test=what'),
	registry.locationToState('/test/you?test=what#yo'),
];
const paths = [
	registry.routeToLocation('test'),
	registry.routeToLocation('test', { foo: 'bar' }),
	registry.routeToLocation('test', { hey: 'test' }),
	registry.routeToLocation('test', {}, { q: 'ya' }),
	registry.routeToLocation('test', {}, { q: 'ya' }, 'hash'),
	registry.routeToLocation(
		'test',
		{ foo: 'bar', hey: 'test' },
		{ q: 'ya' },
		'hash',
	),
];
// debugger;
