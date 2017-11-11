import { PathFunction } from 'path-to-regexp';
import flattenRoutes from '../../src/utils/flatten-routes';
import findDuplicateRoutes from '../../src/utils/find-duplicate-routes';
import throwIfhasDuplicateRoutes from '../../src/utils/throw-if-has-duplicate-routes';
import createParamsFromKeys from '../../src/utils/create-params-from-keys';
import ensureQuestionMark from '../../src/utils/ensure-question-mark';

import { Route } from '../../src/types';
import { initialRoutes, expectedRoutes } from './routes';

describe('utils', () => {
	describe('flattenRoutes', () => {
		const flatRoutes = flattenRoutes(initialRoutes);
		flatRoutes.map((flatRoute, index) => {
			test(`should work for route with path ${
				expectedRoutes[index].path
			}`, () => expect(flatRoutes[index]).toEqual(expectedRoutes[index]));
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

	test('createParamsFromKeys', () => {
		const match = ['1/2/3', 1, 2, 3];
		const keys = [{ name: 'one' }, { name: 'two' }, { name: 'three' }];
		expect(createParamsFromKeys(match, keys)).toEqual({
			one: 1,
			two: 2,
			three: 3,
		});
	});

	describe('ensureQuestionMark', () => {
		test('with question mark', () => {
			expect(ensureQuestionMark('?test')).toBe('?test');
		});

		test('without question mark', () => {
			expect(ensureQuestionMark('test')).toBe('?test');
		});
	});
});
