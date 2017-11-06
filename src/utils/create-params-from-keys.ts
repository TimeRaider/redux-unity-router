import { Key } from 'path-to-regexp';

type CreateParamsFromKeys = (
	match: (string | number)[],
	keys: { name: Key['name'] }[],
) => { [x: string]: {} };

const createParamsFromKeys: CreateParamsFromKeys = (match, keys) => {
	return keys.reduce(
		(result: {}, key, index) => ({
			...result,
			[key.name]: match[index + 1],
		}),
		{},
	);
};

export default createParamsFromKeys;
