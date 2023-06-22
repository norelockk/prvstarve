import env from './env';
import { pushConsoleMessage } from './uiCalls';
import { Entrypoint, store } from './vue';

declare global {
  interface Window {
    [key: string]: any;
  }
}

Entrypoint.construct();

window['LOLIPOP'] = env;
window['LOLIPOP_CONSOLE'] = {
  call: pushConsoleMessage,
  state: store.getters['console/showing']
};