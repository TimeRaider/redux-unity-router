import { Middleware, AnyAction, Action } from 'redux';
import {
	ACTION_PREFIX,
	ActionTypes,
	HistoryMethods,
	Actions,
} from '../constants';
import { parsePath } from 'history';
import Registry from '../registry';
// import reducer from './reducer';

// type ConvertGoToRouteIntoPush = <T extends Action>(
// 	action: T,
// 	registry: Registry,
// ) => T | Actions.Push;
// const convertGoToRouteIntoPush: ConvertGoToRouteIntoPush = (
// 	action,
// 	registry,
// ) => {
// 	return action && action.type === ActionTypes.GO_TO_ROUTE
// 		? ({
// 				type: ActionTypes.PUSH,
// 				payload: registry.routeToPath(action.payload),
// 			} as Actions.Push)
// 		: action;
// };

type RouterAction =
	| Actions.Push
	| Actions.Replace
	| Actions.Go
	| Actions.GoForward
	| Actions.GoBack
	| Actions.GoToRoute
	| Actions.LocationChange;

type CreateMiddleware = (registry: Registry) => Middleware;
const middleware: CreateMiddleware = registry => ({
	dispatch,
	getState,
}) => next => originalAction => {
	if (
		originalAction.type !== ActionTypes.PUSH &&
		originalAction.type !== ActionTypes.REPLACE &&
		originalAction.type !== ActionTypes.GO &&
		originalAction.type !== ActionTypes.GO_FORWARD &&
		originalAction.type !== ActionTypes.GO_BACK &&
		originalAction.type !== ActionTypes.GO_TO_ROUTE &&
		originalAction.type !== ActionTypes.LOCATION_CHANGE
	) {
		return next(originalAction);
	}

	let action: RouterAction = originalAction as RouterAction;

	if (action.type === ActionTypes.GO_TO_ROUTE) {
		action = {
			type: ActionTypes.PUSH,
			payload: action.payload && registry.routeToPath(action.payload),
		};
	}

	if (action.type === ActionTypes.PUSH || action.type === ActionTypes.REPLACE) {
		action.payload =
			typeof action.payload === 'string'
				? parsePath(action.payload)
				: action.payload;
		action.type =
			registry.history.location.pathname === action.payload.pathname &&
			registry.history.location.search === action.payload.search &&
			registry.history.location.hash === action.payload.hash
				? ActionTypes.REPLACE
				: action.type;
	}

	if (HistoryMethods[action.type]) {
		const historyMethod = registry.history[HistoryMethods[action.type]];
		historyMethod(action.payload);
	}

	return next(action as typeof originalAction);
};

export default middleware;
