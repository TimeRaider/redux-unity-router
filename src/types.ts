export interface Route {
	path: string;
	id?: string | number;
	routes?: Route[];
	data?: {};
}

export interface RouteProcessed extends Route {
	routes?: never;
}

// export interface RouteRegistry {
// 	[x: string]: RouteProcessed;
// }
