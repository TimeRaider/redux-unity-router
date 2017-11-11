import { LocationState, Location } from 'history';

export interface Route {
	path: string;
	id?: string;
	routes?: Route[];
	state?: Object;
}

export interface RouteProcessed extends Route {
	state: LocationState;
	routes?: never;
}

export interface Query {
	[x: string]: string | string[];
}

export interface Payload extends Location, RouteProcessed {
	path: string;
	params: {};
	query: Query;
}
