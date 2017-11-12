import { compile, PathFunction, Key } from 'path-to-regexp';
import * as pathToRegexp from 'path-to-regexp';
import {
	parse as qsParse,
	stringify as qsStringify,
	StringifyOptions,
} from 'query-string';
import { createLocation, createPath, Location, History } from 'history';

import flattenRoutes from './utils/flatten-routes';
import createParamsFromKeys from './utils/create-params-from-keys';
import ensureQuestionMark from './utils/ensure-question-mark';
import { SLICE, Route, RouteProcessed, Query, Actions } from './constants';
import RouterError from './error';

export default class Registry {
	public slice: string;
	public history: History;
	private qsOptions: StringifyOptions;
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

	public constructor(params: {
		routes: Route[];
		history: History;
		slice?: string;
		queryStringOptions?: StringifyOptions;
	}) {
		this.history = params.history;
		this.slice = params.slice || SLICE;
		this.qsOptions = params.queryStringOptions || {};

		flattenRoutes(params.routes).forEach((route, index) => {
			this.paths[index] = route.path;
			if (route.id) {
				this.idToPath[route.id] = route.path;
			}

			const keys: Key[] = [];
			// keys is mutable and modified by pathToRegexp
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

	public pathToPayload(path: string): Actions.LocationChange['payload'] {
		const location = createLocation(path);
		const route = this.locationToRoute(location);
		const query: Query = qsParse(location.search, this.qsOptions);
		const state: {} = {
			...route.state,
			...(location.state || {}),
		};

		return {
			...location,
			...route,
			path,
			query,
			state,
		};
	}

	public routeToPath({
		id,
		params = {},
		query = {},
		hash = '',
	}: Actions.GoToRoute['payload']) {
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
			search:
				typeof query === 'string'
					? ensureQuestionMark(query)
					: qsStringify(query, this.qsOptions),
			hash: hash.replace('#', ''),
			pathname,
		};

		return createPath(location);
	}

	private locationToRoute(
		location: Location,
	): RouteProcessed & {
		params: {};
	} {
		const path = this.getPathByLocation(location);
		const params = this.getParams(path, location);

		return {
			...this.routes[path].route,
			path,
			params,
		};
	}

	private getParams(path: Route['path'], location: Location): {} {
		const match = this.routes[path].regexp.exec(location.pathname);
		return createParamsFromKeys(match as string[], this.routes[path].keys);
	}

	private getPathById(id: string): string {
		const path = this.idToPath[id];
		if (path === undefined) {
			throw new RouterError(`Can't find route with id "${id}"`);
		}
		return path;
	}

	private getPathByLocation(location: Location): string {
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
