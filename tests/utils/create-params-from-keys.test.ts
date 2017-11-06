import createParamsFromRoutes from '../../src/utils/c';
import findDuplicateRoutes from '../../src/utils/find-duplicate-routes';
import throwIfhasDuplicateRoutes from '../../src/utils/throw-if-has-duplicate-routes';
import getPathFunctionById from '../../src/utils/get-path-function-by-id';

import { Route } from '../../src/types';
import { initialRoutes, expectedRoutes } from './routes';

describe('utils', () => {
	describe('getPathFunctionById', () => {
		const pathFunction = (() => ({})) as PathFunction;
		const registry = {
			byId: {
				id1: 'path1',
				id2: 'path2',
			},
			byPath: {
				path1: pathFunction,
			},
		};
		test('returns corrent pathFunction function', () => {
			expect(getPathFunctionById(registry, 'id1')).toBe(pathFunction);
		});

		test('throws when pathFunction not found corrent function', () => {
			expect(() => getPathFunctionById(registry, 'id2')).toThrow();
		});
	});
});
