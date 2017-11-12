export default class RouterError extends Error {
	public name: 'RouterError' = 'RouterError';
	public message: string;

	constructor(message: string = '') {
		super(message);
		this.message = message;
	}
}
