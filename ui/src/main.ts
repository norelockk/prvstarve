import env from './env';
import { pushConsoleMessage } from './uiCalls';
import { Entrypoint, store } from './vue';
import { EventEmitter } from './utils';

declare global {
  interface Window {
    [key: string]: any;
  }
}

export const emitter: EventEmitter<any> = new EventEmitter();

window['restarve'] = emitter;
window['Framework'] = Entrypoint;
window['LOLIPOP_DATA'] = env;
window['LOLIPOP_CONSOLE'] = {
  call: pushConsoleMessage,
  state: store.getters['console/showing']
};