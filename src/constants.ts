import { Location, LocationState } from 'history';
import { Action } from 'redux';
export const SLICE: string = 'router';

export interface Route {
	path: string;
	id?: string;
	routes?: Route[];
	state?: {};
}

export interface RouteProcessed extends Route {
	state: LocationState;
	routes?: never;
}

export interface Query {
	[x: string]: string | string[];
}

export namespace ActionTypes {
	export type Push = '@@REDUX_UNITY_ROUTER/PUSH';
	export type Replace = '@@REDUX_UNITY_ROUTER/REPLACE';
	export type Go = '@@REDUX_UNITY_ROUTER/GO';
	export type GoBack = '@@REDUX_UNITY_ROUTER/GO_BACK';
	export type GoForward = '@@REDUX_UNITY_ROUTER/GO_FORWARD';
	export type GoToRoute = '@@REDUX_UNITY_ROUTER/GO_TO_ROUTE';
	export type LocationChange = '@@REDUX_UNITY_ROUTER/LOCATION_CHANGE';
	export type SetRoutes = '@@REDUX_UNITY_ROUTER/SET_ROUTES';

	export const PUSH: Push = '@@REDUX_UNITY_ROUTER/PUSH';
	export const REPLACE: Replace = '@@REDUX_UNITY_ROUTER/REPLACE';
	export const GO: Go = '@@REDUX_UNITY_ROUTER/GO';
	export const GO_BACK: GoBack = '@@REDUX_UNITY_ROUTER/GO_BACK';
	export const GO_FORWARD: GoForward = '@@REDUX_UNITY_ROUTER/GO_FORWARD';
	export const GO_TO_ROUTE: GoToRoute = '@@REDUX_UNITY_ROUTER/GO_TO_ROUTE';
	export const LOCATION_CHANGE: LocationChange =
		'@@REDUX_UNITY_ROUTER/LOCATION_CHANGE';
	export const SET_ROUTES: SetRoutes = '@@REDUX_UNITY_ROUTER/SET_ROUTES';
}

export namespace Actions {
	export interface Push extends Action {
		type: ActionTypes.Push;
		payload: Location | string;
	}
	export const push = (payload: Push['payload']): Push => ({
		type: ActionTypes.PUSH,
		payload,
	});

	export interface Replace extends Action {
		type: ActionTypes.Replace;
		payload: Location | string;
	}
	export const replace = (payload: Replace['payload']): Replace => ({
		type: ActionTypes.REPLACE,
		payload,
	});

	export interface Go extends Action {
		type: ActionTypes.Go;
		payload: number;
	}
	export const go = (payload: Go['payload']): Go => ({
		type: ActionTypes.GO,
		payload,
	});

	export interface GoBack extends Action {
		type: ActionTypes.GoBack;
	}
	export const goBack = (): GoBack => ({
		type: ActionTypes.GO_BACK,
	});

	export interface GoForward extends Action {
		type: ActionTypes.GoForward;
	}
	export const goForward = (): GoForward => ({
		type: ActionTypes.GO_FORWARD,
	});

	export interface GoToRoute extends Action {
		type: ActionTypes.GoToRoute;
		payload: {
			id: string;
			params?: { [x: string]: {} };
			query?: Query | string;
			hash?: string;
		};
	}
	export const goToRoute = (payload: GoToRoute['payload']): GoToRoute => ({
		type: ActionTypes.GO_TO_ROUTE,
		payload,
	});

	interface Payload extends Location, RouteProcessed {
		path: string;
		params: {};
		query: Query;
	}
	export interface LocationChange extends Action {
		type: ActionTypes.LocationChange;
		payload: Payload;
	}
	export const locationChange = (
		payload: LocationChange['payload'],
	): LocationChange => ({
		type: ActionTypes.LOCATION_CHANGE,
		payload,
	});

	export interface SetRoutes extends Action {
		type: ActionTypes.SetRoutes;
		payload: Route[];
	}
	export const setRoutes = (payload: SetRoutes['payload']): SetRoutes => ({
		type: ActionTypes.SET_ROUTES,
		payload,
	});
}
