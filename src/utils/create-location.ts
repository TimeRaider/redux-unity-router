import { parsePath, Location } from 'history';

type CreateLocation = (path: string | Location) => Location;

const createLocation: CreateLocation = path =>
	typeof path === 'string' ? parsePath(path) : path;

export default createLocation;
