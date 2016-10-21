import React, { PropTypes } from 'react';
import BaseRouterComponent from './Base';

import { parse, format } from 'url';
import qs from 'query-string';
import * as actions from '../actions';
import {
    __DEV__,
    LINK_MATCH_EXACT,
    LINK_MATCH_PARTIAL,
    LINK_DEFAULT_METHOD,
    LINK_CLASSNAME,
    LINK_ACTIVE_CLASSNAME
} from '../constants';

class Link extends BaseRouterComponent {

    constructor(props, context) {

        super(props, context);

        this.handleClick = this.handleClick.bind(this);

        this.href = this.getHref(props);
        this.state = {
            isActive: false
        };
    }

    componentWillReceiveProps(newProps) {

        if (this.props.to !== newProps.to) {
            this.href = this.getHref(newProps);
        }
    }

    shouldComponentUpdate(props, state) {

        return this.state.isActive !== state.isActive || this.props.to !== props.to;
    }

    initiateLocationChange(e) {
        const { target } = this.props;

        if (!target && !this.href.protocol) {
            e.preventDefault();
            this.locationChange(this.href);
        }
    }

    handleClick(e) {

        const { onClick } = this.props;

        if (typeof onClick === 'function') {

            const onClickResult = onClick(e);

            if (typeof onClickResult === 'object' && typeof onClickResult.then === 'function') {
                e.persist();
                return onClickResult.then(() => {
                    this.initiateLocationChange(e);
                });
            }
        }

        return this.initiateLocationChange(e);
    }

    getHref(props) {
        let { to } = props;

        if (typeof to === 'object' && to.id) {
            to = this.router.parseRoute(to);
        }

        if (typeof to === 'string') {
            to = parse(to);
            to.query = qs.parse(to.query);
        }

        to.hash = typeof to.hash === 'string' && to.hash[0] !== '#' ? '#' + to.hash : to.hash;

        return to || false;
    }

    handleStoreChange() {

        if (!this.isSubscribed) return;

        const { activeClass, activeMatch } = this.props;
        const { pathname, hash, query, protocol } = this.href;

        if (!activeClass || !activeMatch || protocol) return; // eslint-disable-line consistent-return

        const routerStore = this.getStatefromStore();
        const { immutable } = this.router;

        let isActive = true;

        if (activeMatch instanceof RegExp) {
            const routePath = ( immutable ? routerStore.get('path') : routerStore.path );

            return this.setState({ // eslint-disable-line consistent-return
                isActive: activeMatch.test(routePath)
            });
        }

        if (activeMatch === LINK_MATCH_EXACT) {
            if (hash) {
                const routeHash = ( immutable ? routerStore.get('hash') : routerStore.hash );
                isActive = isActive && hash === routeHash;
            }

            if (query && Object.keys(query).length) {
                const routeQuery = immutable ? routerStore.get('query').toJS() : routerStore.query;
                isActive = isActive && Object.keys(query).reduce(
                        (result, item) => result && query[item] === routeQuery[item], true);
            }
        }

        const routePathname = ( immutable ? routerStore.get('pathname') : routerStore.pathname );

        isActive = isActive && (
            activeMatch === LINK_MATCH_EXACT
                ? pathname === routePathname
                : routePathname.indexOf(pathname) === 0
        );

        if (isActive !== this.state.isActive) {
            this.setState({
                isActive
            });
        }
    };

    locationChange(to) {

        const { method } = this.props;

        let search = to.query || to.search;
        search = typeof search === 'object' ? qs.stringify(search) : search;

        const payload = {
            pathname: to.pathname,
            search: search,
            hash: to.hash
        };

        this.store.dispatch(actions[method](payload));
    }

    render() {


        const { children, activeClass, className, target = null } = this.props;
        const classes = this.state.isActive ? `${className} ${activeClass}` : className;

        const props = {
            target,
            href: format(this.href),
            className: classes
        };

        props.onClick = this.handleClick;

        return React.createElement('a', props, children);
    }
}

Link.contextTypes = {
    router: PropTypes.object,
    store: PropTypes.object
};

Link.defaultProps = {
    to: '',
    className: LINK_CLASSNAME,
    activeClass: LINK_ACTIVE_CLASSNAME,
    method: LINK_DEFAULT_METHOD,
    activeMatch: false
};

if (__DEV__) {
    Link.propTypes = {
        to: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        className: PropTypes.string,
        activeClass: PropTypes.string,
        onClick: PropTypes.oneOfType([
            PropTypes.instanceOf(Function),
            PropTypes.instanceOf(Promise)
        ]),
        target: PropTypes.string,
        method: PropTypes.string,
        children: PropTypes.any,
        activeMatch: (props, propName, componentName) => {
            if (
                ![false, LINK_MATCH_EXACT, LINK_MATCH_PARTIAL].includes(props[propName]) &&
                !(props[propName] instanceof RegExp)
            ) {
                return new Error(
                    'Invalid prop `' + propName + '` supplied to' +
                    ' `' + componentName + '`. ' +
                    `Should be one of [false, '${LINK_MATCH_EXACT}', '${LINK_MATCH_PARTIAL}'] or an instance of RegExp`
                );
            }
        }
    };
}

export default Link;
