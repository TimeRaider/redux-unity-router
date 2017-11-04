import { ID_DELIM } from '../../src/constants';

import { Route, RouteProcessed } from '../types';

export const initialRoutes: Route[] = [
	{
		id: 'index',
		pattern: '/',
		routes: [
			{
				id: 'main',
				pattern: '/main/',
				data: {
					pageTitle: 'test',
				},
				routes: [
					{
						id: 'main+param+query',
						pattern: {
							path: '/:param',
							query: {
								param: 'val',
							},
						},
					},
					{
						id: 'main+param',
						pattern: '/:param',
						data: {
							token: 'e287f992d8af8fa21c08',
						},
					},
					{
						id: 'main+query',
						pattern: {
							query: {
								param: 'val',
							},
						},
					},
				],
			},
			{
				id: 'test',
				pattern: '/test/',
			},
			{
				pattern: '/empty/',
			},
			{
				pattern: {
					query: {
						param: 'val',
					},
				},
			},
		],
	},
];

export const expectedRoutes: RouteProcessed[] = [
	{
		id: 'main+param+query',
		idPath: ['index', 'main', 'main+param+query'].join(ID_DELIM),
		pattern: {
			path: '/main/:param',
			query: {
				param: 'val',
			},
		},
		data: {
			pageTitle: 'test',
		},
	},
	{
		// id: 'main+query',
		// idPath: ['index', 'main', 'main+param+query'].join(ID_DELIM),
		// pattern: {
		// 	path: '/main/:param',
		// 	query: {
		// 		param: 'val',
		// 	},
		// },
		// data: {
		// 	pageTitle: 'test',
		// },
	},
	{
		id: 'main+param',
		idPath: ['index', 'main', 'main+param'].join(ID_DELIM),
		pattern: {
			path: '/main/:param',
		},
		data: {
			pageTitle: 'test',
			token: 'e287f992d8af8fa21c08',
		},
	},
	{
		id: 'main',
		idPath: ['index', 'main'].join(ID_DELIM),
		pattern: {
			path: '/main/',
		},
		data: {
			pageTitle: 'test',
		},
	},
	{
		id: 'test',
		idPath: ['index', 'test'].join(ID_DELIM),
		pattern: {
			path: '/test/',
		},
		data: {},
	},
	{
		id: '/empty/',
		idPath: ['index', '/empty/'].join(ID_DELIM),
		pattern: {
			path: '/empty/',
		},
		data: {},
	},
	{
		id: 'index',
		idPath: 'index',
		pattern: {
			path: '/',
		},
		data: {},
	},
	{
		// id: 'index',
		// idPath: 'index',
		// pattern: {
		// 	path: '/',
		// },
		// data: {},
	},
];
