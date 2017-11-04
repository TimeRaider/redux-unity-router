export interface PatternObj {
	path?: string;
	query?: {
		[x: string]: string | number;
	};
}

export interface Route {
	pattern: string | PatternObj;
	id?: string | number;
	routes?: Route[];
	data?: {};
}

export interface RouteProcessed extends Route {
	id: string;
	idPath: string;
	pattern: PatternObj;
}

export interface RouteRegistry {
	[x: string]: RouteProcessed;
}
