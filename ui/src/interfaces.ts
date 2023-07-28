import { RouteConfig } from 'vue-router';

export interface RouteMiddleware {
  [key: string]: (to: RouteConfig, from: RouteConfig, next: () => void) => void;
}

export interface MessageAction {
  text: string;
  callback: Function;
}

export interface MessageProgress {
  fill: number;
  show: boolean;
}

export interface Message {
  title: string;
  actions?: MessageAction[];
  showing?: boolean;
  loading?: boolean;
  progress?: MessageProgress;
  identifier: string;
  description?: string;
}

export interface Modal {
  defs?: {
    title: string;
    text: string;
  }[];
  title: string;
  serverId?: string;
  identifier: string;
  description?: string;
}