import {
	flattenRoutes,
	findDuplicateRoutes,
	throwIfhasDuplicateRoutes,
} from '../../src/parsers/util';
import { Route } from '../../src/types';
import { initialRoutes, expectedRoutes } from './routes';

// should work for route with id ${expectedRoutes[index].id}`;
describe('utils', () => {
	describe('flattenRoutes', () => {
		const flatRoutes = flattenRoutes(initialRoutes);
		flatRoutes.map((flatRoute, index) => {
			test(`should work for route with path ${expectedRoutes[index]
				.path}`, () =>
				expect(flatRoutes[index]).toEqual(expectedRoutes[index]));
		});

		test('should throw when pattern is missing', () => {
			const route = { id: 'test' } as Route;
			expect(() => flattenRoutes([route])).toThrow();
		});
	});

	describe('hasDuplicateRoutes and throwIfhasDuplicateRoutes', () => {
		test(`
			hasDuplicateRoutes returns false and 
			throwIfhasDuplicateRoutes does not throw 
			when there are no duplicate routes
		`, () => {
			const routes = [
				{
					path: 'one',
				},
				{
					path: 'two',
				},
			];

			expect(findDuplicateRoutes(routes)).toBe(false);
			expect(() => throwIfhasDuplicateRoutes(routes)).not.toThrow();
		});

		test(`
			hasDuplicateRoutes returns true and 
			throwIfhasDuplicateRoutes throws
			when there are duplicate routes
		`, () => {
			const routes = [
				{
					path: 'one',
				},
				{
					path: 'second',
				},
				{
					path: 'one',
				},
			];

			expect(findDuplicateRoutes(routes)).toEqual([
				{
					path: 'one',
				},
				{
					path: 'one',
				},
			]);
			expect(() => throwIfhasDuplicateRoutes(routes)).toThrow();
		});
	});
});
