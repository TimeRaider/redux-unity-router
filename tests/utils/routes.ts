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
				state: {
					pageTitle: 'test',
				},
				routes: [
					{
						id: 'main+param',
						path: '/:param',
						state: {
							pageTitle: 'title',
						},
					},
					{
						path: '/:param2',
						state: {
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
		state: {
			pageTitle: 'title',
		},
	},
	{
		path: '/main/:param2',
		state: {
			pageTitle: 'test',
			token: 'my token',
		},
	},
	{
		id: 'main',
		path: '/main/',
		state: {
			pageTitle: 'test',
		},
	},
	{
		id: 'test',
		path: '/test/',
		state: {},
	},
	{
		path: '/empty/',
		state: {},
	},
	{
		id: 'index',
		path: '/',
		state: {},
	},
	{
		id: 'second',
		path: '/sec/',
		state: {},
	},
];
