import RouterError from '../src/error';

describe('RouterError', () => {
	test('shows default message', () => {
		const error = new RouterError();
		expect(error.toString()).toBe('RouterError');
	});
	test('shows provided message', () => {
		const error = new RouterError('message');
		expect(error.toString()).toBe('RouterError: message');
	});
});
