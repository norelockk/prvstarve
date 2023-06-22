import env from './env';
import { Entrypoint } from './vue';

declare global {
  interface Window {
    [key: string]: any;
  }
}

window['LOLIPOP'] = env;

Entrypoint.construct();