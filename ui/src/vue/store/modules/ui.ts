import { GetterTree, MutationTree, ActionTree } from 'vuex';

interface UiState {
  show: boolean;
}

const state: UiState = {
  show: false
};

const getters: GetterTree<UiState, {}> = {
  showing: state => state.show,
};

const mutations: MutationTree<UiState> = {
  show(state) {
    state.show = !state.show;

    if ('state' in window['LOLIPOP_UI'])
      window['LOLIPOP_UI']['state'] = state.show;
  }
};

const actions: ActionTree<UiState, {}> = {

};

const Ui = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};

export default Ui;