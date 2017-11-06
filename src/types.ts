export interface Route {
	path: string;
	id?: string;
	routes?: Route[];
	data?: {};
}

export interface RouteProcessed extends Route {
	routes?: never;
}

export interface RouteNew extends Route {
	path: never;
	pattern: {
		path?: string;
		query?: string;
	};
}
