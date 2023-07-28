import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { Modal } from '@/interfaces';

interface ModalsState {
  modals: Modal[];
}

// ignoring properties when update
const IGNORE_PROPERTIES_UPDATE: {
  [key: string]: boolean;
} = {
  'identifier': true
};

const state: ModalsState = {
  modals: [ ]
};

const getters: GetterTree<ModalsState, {}> = {
  array: state => state.modals,
};

const mutations: MutationTree<ModalsState> = {
  createModal(state, payload) {
    const message: Modal = state.modals.find(msg => msg.identifier === payload.identifier) as Modal;

    if (!message) state.modals.push(payload);
  },
  deleteModal(state, identifier) {
    const message: Modal = state.modals.find(msg => msg.identifier === identifier) as Modal;

    if (message) {
      state.modals.splice(state.modals.indexOf(message), 1);
      return true;
    }

    return false;
  },
  updateModal(state, payload) {
    const message: { [key: string]: any } = state.modals.find(msg => msg.identifier === payload.identifier) as Modal;

    if (message) {
      for (const [key, value] of Object.entries(payload)) {
        if (key in IGNORE_PROPERTIES_UPDATE) {
          if (IGNORE_PROPERTIES_UPDATE[key])
            continue;
        }

        message[key] = value;
      }

      return true;
    }

    return false;
  }
};

const actions: ActionTree<ModalsState, {}> = {
  create({ commit }, payload) {
    commit('createModal', payload);
  },
  update({ commit }, payload) {
    commit('updateModal', payload);
  },
  destroy({ commit }, identifier) {
    commit('deleteModal', identifier);
  }
};

const Modals = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};

export default Modals;