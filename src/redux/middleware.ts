import { Middleware } from 'redux';
import { ActionTypes, Actions } from '../constants';
import Registry from '../registry';
import createLocation from '../utils/create-location';

type RouterHistoryAction =
	| Actions.Push
	| Actions.Replace
	| Actions.Go
	| Actions.GoForward
	| Actions.GoBack
	| Actions.GoToRoute;

const createMiddleware = (registry: Registry): Middleware => () => {
	// general for helper functions
	type ActionToAction = (action: RouterHistoryAction) => RouterHistoryAction;

	const convertActionGoToRouteIntoPush: ActionToAction = action =>
		action.type === ActionTypes.GO_TO_ROUTE
			? {
					type: ActionTypes.PUSH,
					payload: registry.routeToPath(action.payload),
				}
			: action;

	const callHistoryMethod: ActionToAction = action => {
		const { push, replace, go, goForward, goBack } = registry.history;
		switch (action.type) {
			case ActionTypes.PUSH:
				push(createLocation(action.payload));
				break;
			case ActionTypes.REPLACE:
				replace(createLocation(action.payload));
				break;
			case ActionTypes.GO:
				go(action.payload);
				break;
			case ActionTypes.GO_FORWARD:
				goForward();
				break;
			case ActionTypes.GO_BACK:
				goBack();
				break;
			default:
				break;
		}
		return action;
	};

	return next => action =>
		action.type !== ActionTypes.PUSH &&
		action.type !== ActionTypes.REPLACE &&
		action.type !== ActionTypes.GO &&
		action.type !== ActionTypes.GO_FORWARD &&
		action.type !== ActionTypes.GO_BACK &&
		action.type !== ActionTypes.GO_TO_ROUTE
			? next(action)
			: next(callHistoryMethod(
					convertActionGoToRouteIntoPush(action),
				) as typeof action);
};

export default createMiddleware;
