import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const storeModules = {} as any;
const requireModule = require.context('./modules', false, /\.ts$/);

requireModule.keys().forEach((fileName) => {
  const moduleName = fileName.replace(/(\.\/|\.ts)/g, '');
  const moduleConfig = requireModule(fileName);

  storeModules[moduleName] = moduleConfig?.default ?? moduleConfig;
});

interface noop {}

class Store extends Vuex.Store<noop> {
  private static options = {
    modules: storeModules
  };

  public static construct() {
    return new Store();
  }

  constructor() {
    super(Store.options);
  }
}

export default Store;