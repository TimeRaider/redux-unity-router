import Registry from '../src/registry';

describe('Registry', () => {
	const routes = [{ id: 'myId', path: '/path/:param?' }];
	let registry;

	beforeEach(() => {
		registry = new Registry({ routes });
	});

	describe('pathToPayload', () => {
		test('/path/', () => {
			expect(registry.pathToPayload('/path/')).toEqual({
				id: 'myId',
				path: '/path/',
				pathname: '/path/',
				query: {},
				search: '',
				hash: '',
				state: {},
				params: {
					param: undefined,
				},
			});
		});

		test('/path/foo', () => {
			expect(registry.pathToPayload('/path/foo')).toEqual({
				id: 'myId',
				path: '/path/foo',
				pathname: '/path/foo',
				query: {},
				search: '',
				hash: '',
				state: {},
				params: {
					param: 'foo',
				},
			});
		});

		test('/path/foo?bar=baz', () => {
			expect(registry.pathToPayload('/path/foo?bar=baz')).toEqual({
				id: 'myId',
				path: '/path/foo?bar=baz',
				pathname: '/path/foo',
				query: { bar: 'baz' },
				search: '?bar=baz',
				hash: '',
				state: {},
				params: {
					param: 'foo',
				},
			});
		});

		test('/path/foo?bar=baz&bar=qux', () => {
			expect(registry.pathToPayload('/path/foo?bar=baz&bar=qux')).toEqual({
				id: 'myId',
				path: '/path/foo?bar=baz&bar=qux',
				pathname: '/path/foo',
				query: { bar: ['baz', 'qux'] },
				search: '?bar=baz&bar=qux',
				hash: '',
				state: {},
				params: {
					param: 'foo',
				},
			});
		});

		test('/path/foo?bar[]=baz&bar[]=qux', () => {
			registry = new Registry({
				routes,
				queryStringOptions: { arrayFormat: 'bracket' },
			});
			expect(registry.pathToPayload('/path/foo?bar[]=baz&bar[]=qux')).toEqual({
				id: 'myId',
				path: '/path/foo?bar[]=baz&bar[]=qux',
				pathname: '/path/foo',
				query: { bar: ['baz', 'qux'] },
				search: '?bar[]=baz&bar[]=qux',
				hash: '',
				state: {},
				params: {
					param: 'foo',
				},
			});
		});

		test('/path/foo?bar=baz#hash', () => {
			expect(registry.pathToPayload('/path/foo?bar=baz#hash')).toEqual({
				id: 'myId',
				path: '/path/foo?bar=baz#hash',
				pathname: '/path/foo',
				query: { bar: 'baz' },
				search: '?bar=baz',
				hash: '#hash',
				state: {},
				params: {
					param: 'foo',
				},
			});
		});
	});

	describe('routeToPath', () => {
		test('id only', () => {
			expect(registry.routeToPath('myId')).toBe('/path');
		});

		test('id and param', () => {
			expect(registry.routeToPath('myId', { param: 'bar' })).toBe('/path/bar');
		});

		test('id and non-existent param', () => {
			expect(registry.routeToPath('myId', { bar: 'baz' })).toBe('/path');
		});

		test('id and query', () => {
			expect(registry.routeToPath('myId', {}, { key: 'val' })).toBe(
				'/path?key=val',
			);
		});

		test('id and query as string', () => {
			expect(registry.routeToPath('myId', {}, 'key=val')).toBe('/path?key=val');
			expect(registry.routeToPath('myId', {}, '?key=val')).toBe(
				'/path?key=val',
			);
		});

		test('id, query and hash', () => {
			expect(registry.routeToPath('myId', {}, { key: 'val' }, 'hash')).toBe(
				'/path?key=val#hash',
			);
		});

		test('id and query array default', () => {
			expect(registry.routeToPath('myId', {}, { key: ['val1', 'val2'] })).toBe(
				'/path?key=val1&key=val2',
			);
		});

		test('id and query array as brackets', () => {
			registry = new Registry({
				routes,
				queryStringOptions: { arrayFormat: 'bracket' },
			});
			expect(registry.routeToPath('myId', {}, { key: ['val1', 'val2'] })).toBe(
				'/path?key[]=val1&key[]=val2',
			);
		});

		test('id and hash', () => {
			expect(registry.routeToPath('myId', {}, {}, '#hash')).toBe('/path#hash');
		});

		test('id, params, query and hash', () => {
			expect(
				registry.routeToPath(
					'myId',
					{ param: 'bar', baz: 'qux' },
					{ key: 'val' },
					'hash',
				),
			).toBe('/path/bar?key=val#hash');
		});
	});
});
