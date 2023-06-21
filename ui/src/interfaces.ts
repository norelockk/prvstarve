import { RouteConfig } from 'vue-router';

export interface RouteMiddleware {
  [key: string]: (to: RouteConfig, from: RouteConfig, next: () => void) => void;
}