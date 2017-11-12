import { Middleware } from 'redux';
import { ActionTypes, Actions } from '../constants';
import Registry from '../registry';
import ensureLocation from '../utils/ensure-location';

type RouterAction =
	| Actions.Push
	| Actions.Replace
	| Actions.Go
	| Actions.GoForward
	| Actions.GoBack
	| Actions.GoToRoute
	| Actions.SetRoutes;

const createMiddleware = (registry: Registry): Middleware => () => {
	// general for helper functions
	type ActionToAction = (action: RouterAction) => RouterAction;

	const convertActionGoToRouteIntoPush: ActionToAction = action =>
		action.type === ActionTypes.GO_TO_ROUTE
			? {
					type: ActionTypes.PUSH,
					payload: registry.routeToPath(action.payload),
				}
			: action;

	const bootstrap: ActionToAction = action => {
		const { push, replace, go, goForward, goBack } = registry.history;
		switch (action.type) {
			case ActionTypes.PUSH:
				push(ensureLocation(action.payload));
				break;
			case ActionTypes.REPLACE:
				replace(ensureLocation(action.payload));
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
			case ActionTypes.SET_ROUTES:
				registry.setRoutes(action.payload);
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
		action.type !== ActionTypes.GO_TO_ROUTE &&
		action.type !== ActionTypes.SET_ROUTES
			? next(action)
			: next(bootstrap(
					convertActionGoToRouteIntoPush(action),
				) as typeof action);
};

export default createMiddleware;
