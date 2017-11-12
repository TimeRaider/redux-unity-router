import { RouteProcessed } from '../constants';

type FindDuplicateRoutes = (
	routes: RouteProcessed[],
) => [RouteProcessed, RouteProcessed] | false;

const findDuplicateRoutes: FindDuplicateRoutes = routes => {
	const paths = routes.map(({ path }) => path);
	for (const path of paths) {
		const firstIndex = paths.indexOf(path);
		const lastIndex = paths.lastIndexOf(path);
		if (firstIndex !== lastIndex) {
			return [routes[firstIndex], routes[lastIndex]];
		}
	}
	return false;
};

export default findDuplicateRoutes;
