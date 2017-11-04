import { Children, Component } from 'react';
import PropTypes from 'prop-types';
import createRouteToLocationParser from '../parsers/routeToLocation';
import { DEFAULT_SLICE, __DEV__ } from '../constants';

class Provider extends Component {
	getChildContext() {
		const { immutable, slice, routes, current } = this.props;
		const router = {
			immutable,
			slice,
			routes,
			parseRoute: createRouteToLocationParser(routes),
			current,
		};

		return { router };
	}

	render() {
		return Children.only(this.props.children);
	}
}

Provider.childContextTypes = {
	router: PropTypes.shape({
		slice: PropTypes.string,
		immutable: PropTypes.bool,
		routes: PropTypes.array,
	}).isRequired,
};

Provider.defaultProps = {
	immutable: false,
	slice: DEFAULT_SLICE,
	routes: [],
	current: '',
};

if (__DEV__) {
	Provider.propTypes = {
		immutable: PropTypes.bool.isRequired,
		slice: PropTypes.string.isRequired,
		routes: PropTypes.array.isRequired,
		current: PropTypes.string.isRequired,
		children: PropTypes.oneOfType([
			PropTypes.element,
			PropTypes.arrayOf(PropTypes.element),
			PropTypes.string,
		]),
	};
}

export default Provider;
