import { GetterTree, MutationTree, ActionTree } from 'vuex';

interface UiState {
  show: boolean;
}

const state: UiState = {
  show: true
};

const getters: GetterTree<UiState, {}> = {
  showing: state => state.show,
};

const mutations: MutationTree<UiState> = {
  
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