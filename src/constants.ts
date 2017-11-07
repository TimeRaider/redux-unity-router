import { History } from 'history';

export const ACTION_PREFIX: '@@REDUX_UNITY_ROUTER' = '@@REDUX_UNITY_ROUTER';

interface ActionTypes {
	PUSH: string;
	REPLACE: string;
	GO: string;
	GO_BACK: string;
	GO_FORWARD: string;
	GO_TO_ROUTE: string;
	LOCATION_CHANGE: string;
}

export const ACTION_TYPES: ActionTypes = {
	PUSH: `${ACTION_PREFIX}/PUSH`,
	REPLACE: `${ACTION_PREFIX}/REPLACE`,
	GO: `${ACTION_PREFIX}/GO`,
	GO_BACK: `${ACTION_PREFIX}/GO_BACK`,
	GO_FORWARD: `${ACTION_PREFIX}/GO_FORWARD`,
	GO_TO_ROUTE: `${ACTION_PREFIX}/GO_TO_ROUTE`,
	LOCATION_CHANGE: `${ACTION_PREFIX}/LOCATION_CHANGE`,
};

export const HISTORY_METHODS: {
	[x: string]: keyof History;
} = {
	[ACTION_TYPES.PUSH]: 'push',
	[ACTION_TYPES.REPLACE]: 'replace',
	[ACTION_TYPES.GO]: 'go',
	[ACTION_TYPES.GO_BACK]: 'goBack',
	[ACTION_TYPES.GO_FORWARD]: 'goForward',
};

export const SLICE: string = 'router';
export const CACHE_SIZE: number = 1000;
