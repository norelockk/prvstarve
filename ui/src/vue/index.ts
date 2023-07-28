import Vue from 'vue';
import VueTippy, { TippyComponent } from 'vue-tippy';

Vue.use(VueTippy);
Vue.component('tippy', TippyComponent);

Vue.config.async = true;
Vue.config.devtools = process.env.NODE_ENV === 'development';
Vue.config.productionTip = process.env.NODE_ENV === 'production';

import Store from './store';
import Router from './router';

import AppEntry from '@/templates/App.vue';
import { destroyUiHandles, initUiHandles } from '@/uiHandles';
import { setupEmitter } from '@/uiCalls';

const router = Router.construct();

export const store = Store.construct();

export class Entrypoint extends Vue {
  private static element: HTMLElement = document.getElementById('new_ui') ?? document.querySelector('#new_ui') as HTMLElement;

  public static construct(): Entrypoint {
    return new Entrypoint();
  }

  constructor() {
    super({
      store,
      router,
      render: c => c(AppEntry)
    });

    setupEmitter();
    initUiHandles();

    // on destroy
    window.onbeforeunload = () => destroyUiHandles();

    // load ASAP as can
    this.load();
  }

  private load(): void {
    try {
      this.$mount(Entrypoint.element);
    } catch (e) {
      throw e;
    }
  }
}