import env from '@/env';
import { GetterTree, MutationTree, ActionTree } from 'vuex';

interface LolipopState {
  PROJECT_NAME: string;
  PROJECT_VERSION: number[];
  PROJECT_VERSION_HASH: string;
  PROJECT_ENVIRONMENT: string;
  PROJECT_VERSION_CHANNEL: string;
}

const state: LolipopState = {
  PROJECT_NAME: env.PROJECT_NAME,
  PROJECT_VERSION: env.PROJECT_VERSION,
  PROJECT_ENVIRONMENT: env.LOLIPOP_ENV,
  PROJECT_VERSION_HASH: env.LOLIPOP_BUILD_HASH,
  PROJECT_VERSION_CHANNEL: env.PROJECT_VERSION_CHANNEL
};

const getters: GetterTree<LolipopState, {}> = {
  project: state => ({
    name: state.PROJECT_NAME,
    hash: state.PROJECT_VERSION_HASH,
    version: state.PROJECT_VERSION.join('.'),
    channel: state.PROJECT_VERSION_CHANNEL
  }),
  environment: state => state.PROJECT_ENVIRONMENT
};

const mutations: MutationTree<LolipopState> = {
  
};

const actions: ActionTree<LolipopState, {}> = {

};

const Lolipop = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};

export default Lolipop;