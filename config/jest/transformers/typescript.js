const tsc = require('typescript');
const tsConfig = require('../../tsconfig.json');

module.exports = {
	process(src, path) {
		if (path.endsWith('.ts') || path.endsWith('.tsx')) {
			return tsc.transpile(
				src,
				{
					module: tsc.ModuleKind.CommonJS,
					jsx: tsc.JsxEmit.React,
				},
				path,
				[],
			);
		}
		return src;
	},
};
