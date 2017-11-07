import { Key } from 'path-to-regexp';
import { Params } from '../types';

type CreateParamsFromKeys = (
	match: (string | number)[],
	keys: { name: Key['name'] }[],
) => Params;

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
