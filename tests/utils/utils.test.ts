import { PathFunction } from 'path-to-regexp';
import * as hstry from 'history/PathUtils';
import flattenRoutes from '../../src/utils/flatten-routes';
import findDuplicateRoutes from '../../src/utils/find-duplicate-routes';
import throwIfhasDuplicateRoutes from '../../src/utils/throw-if-has-duplicate-routes';
import createParamsFromKeys from '../../src/utils/create-params-from-keys';
import ensureQuestionMark from '../../src/utils/ensure-question-mark';
import ensureLocation from '../../src/utils/ensure-location';

import { Route } from '../../src/constants';
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
					state: {},
				},
				{
					path: 'two',
					state: {},
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
					state: {},
				},
				{
					path: 'second',
					state: {},
				},
				{
					path: 'one',
					state: {},
				},
			];

			expect(findDuplicateRoutes(routes)).toEqual([
				{
					path: 'one',
					state: {},
				},
				{
					path: 'one',
					state: {},
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

	describe('ensureLocation', () => {
		const location = {
			pathname: '/test/',
			search: '',
			hash: '',
		};
		let spy;
		beforeEach(() => {
			spy = spyOn(hstry, 'parsePath');
		});

		test('creates location from path', () => {
			ensureLocation('/test/');
			expect(spy).toHaveBeenCalledTimes(1);
		});
		test('returns locationif passed', () => {
			ensureLocation({ pathname: '/test/', search: '', hash: '', state: {} });
			expect(spy).not.toHaveBeenCalled();
		});
	});
});
