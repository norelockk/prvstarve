import { RouteMiddleware } from '../../interfaces';

import Vue from 'vue';
import VueRouter, { Route, RouteConfig, RouterOptions, NavigationGuardNext } from 'vue-router';

Vue.use(VueRouter);

// Load routes from the 'routes' directory
const routesContext = require.context('./routes', true, /\.ts$/);
const routes: RouteConfig[] = routesContext.keys().map((key: string) => routesContext(key)?.default || routesContext(key));

// Load middleware from the 'middleware' directory
const middlewareContext = require.context('./middleware', true, /\.ts$/);
const middleware: RouteMiddleware = middlewareContext.keys().reduce((acc: RouteMiddleware, key: string) => {
  const middlewareFn = middlewareContext(key)?.default || middlewareContext(key);
  const middlewareName = key.replace(/(\.\/|\.ts)/g, '');

  acc[middlewareName] = middlewareFn;

  return acc;
}, {});

export default class Router extends VueRouter {
  private static options: RouterOptions = {
    mode: 'hash',
    routes
  };

  public static construct() {
    return new Router();
  }

  constructor() {
    super(Router.options);

    this.beforeEach(this.beforeExecute.bind(this));
    this.afterEach(this.afterExecute.bind(this));

    return this;
  }

  private beforeExecute(to: Route, from: Route, next: NavigationGuardNext) {
    to.matched.forEach(route => {
      let middlewareConfig = route.meta?.middleware;
      if (!middlewareConfig) return;

      if (typeof middlewareConfig === 'string')
        middlewareConfig = { [middlewareConfig]: true };
      else if (typeof middlewareConfig !== 'object')
        throw new Error('invalid middleware type');

      Object.keys(middlewareConfig).forEach(m => {
        const middlewareFn = middleware[m];

        if (!middlewareFn) throw new Error(`middleware '${m}' not found`);
        if (typeof middlewareFn !== 'function') throw new Error(`middleware '${m}' is not a function`);

        middlewareFn(to as RouteConfig, from as RouteConfig, next);
      });
    });

    next();
  }

  private afterExecute(to: Route) {
    // this.analytics.trackPage(to);
  }
}