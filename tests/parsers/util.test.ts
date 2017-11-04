import { flattenRoutes } from '../../src/parsers/util';
import { initialRoutes, expectedRoutes } from './routes';

// should work for route with id ${expectedRoutes[index].id}`;
describe('utils', () => {
	describe('flattenRoutes', () => {
		const flatRoutes = flattenRoutes(initialRoutes);
		flatRoutes.map((flatRoute, index) => {
			test(`should work for route with id ${expectedRoutes[index].id}`, () =>
				expect(flatRoutes[index]).toEqual(expectedRoutes[index]));
		});

		test('should throw when pattern is missing', () => {
			const route = { id: 'test' };
			expect(() => flattenRoutes([route])).toThrow();
		});
	});
	// test('flattenRoutes', () => {
	// 	const flatRoutes = flattenRoutes(initialRoutes);
	// 	flatRoutes.map((flatRoute, index) => {
	// 		expect(flatRoutes[index]).toEqual(expectedRoutes[index]);
	// 	});
	// });

	// test;
});
