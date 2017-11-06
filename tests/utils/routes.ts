import { ID_DELIM } from '../../src/constants';

import { Route, RouteProcessed } from '../types';

export const initialRoutes: Route[] = [
	{
		id: 'index',
		path: '/',
		routes: [
			{
				id: 'main',
				path: '/main/',
				data: {
					pageTitle: 'test',
				},
				routes: [
					{
						id: 'main+param',
						path: '/:param',
						data: {
							pageTitle: 'title',
						},
					},
					{
						path: '/:param2',
						data: {
							token: 'my token',
						},
					},
				],
			},
			{
				id: 'test',
				path: '/test/',
			},
			{
				path: '/empty/',
			},
		],
	},
	{
		id: 'second',
		path: '/sec/',
	},
];

export const expectedRoutes: RouteProcessed[] = [
	{
		id: 'main+param',
		path: '/main/:param',
		data: {
			pageTitle: 'title',
		},
	},
	{
		path: '/main/:param2',
		data: {
			pageTitle: 'test',
			token: 'my token',
		},
	},
	{
		id: 'main',
		path: '/main/',
		data: {
			pageTitle: 'test',
		},
	},
	{
		id: 'test',
		path: '/test/',
		data: {},
	},
	{
		path: '/empty/',
		data: {},
	},
	{
		id: 'index',
		path: '/',
		data: {},
	},
	{
		id: 'second',
		path: '/sec/',
		data: {},
	},
];
