import env from './env';
import { pushConsoleMessage } from './uiCalls';
import { Entrypoint, store } from './vue';

declare global {
  interface Window {
    [key: string]: any;
  }
}

window['Framework'] = Entrypoint;
window['LOLIPOP_DATA'] = env;
window['LOLIPOP_CONSOLE'] = {
  call: pushConsoleMessage,
  state: store.getters['console/showing']
};