import {
	createBrowserHistory,
	createHashHistory,
	createMemoryHistory,
} from 'history';

export const History = {
	createBrowserHistory,
	createHashHistory,
	createMemoryHistory,
};

export { default as ACTION_TYPES } from './actionTypes';
export { default as actionTypes } from './actionTypes';
export { default as createRouter } from './router';
export * as actions from './actions';
export { Link } from './components';
export { RouterProvider } from './components';
export { Fragment } from './components';
