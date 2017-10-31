const resolve = require('path').resolve;

const DIR_ROOT = resolve(__dirname, '../..');

module.exports = {
	rootDir: DIR_ROOT,
	collectCoverageFrom: ['src/**/*.{ts,tsx}'],
	//setupFiles: [resolve(__dirname, 'setup/index.js')],
	testPathIgnorePatterns: [
		'<rootDir>[/\\\\](build|docs|node_modules|examples)[/\\\\]',
	],
	transform: {
		'^.+\\.tsx?$': '<rootDir>/node_modules/ts-jest/preprocessor.js',
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	testEnvironment: 'node',
	testURL: 'http://localhost',
	transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
	testRegex: '(/__tests__/.*|\\.?(test|spec))\\.(ts|tsx|js)$',
};
