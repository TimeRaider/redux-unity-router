export interface Route {
	path: string;
	id?: string;
	routes?: Route[];
	data?: {};
}

export interface RouteProcessed extends Route {
	routes?: never;
}

export interface Params {
	[x: string]: string;
}
