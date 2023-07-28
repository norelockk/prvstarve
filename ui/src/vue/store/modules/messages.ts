import { GetterTree, MutationTree, ActionTree } from 'vuex';
import { Message } from '@/interfaces';

interface MessagesState {
  messages: Message[];
}

// ignoring properties when update
const IGNORE_PROPERTIES_UPDATE: {
  [key: string]: boolean;
} = {
  'identifier': true
};

const state: MessagesState = {
  messages: [
    // {
    //   identifier: 'test',
    //   title: 'frick you',
    // }
  ]
};

const getters: GetterTree<MessagesState, {}> = {
  array: state => state.messages,
};

const mutations: MutationTree<MessagesState> = {
  createMessage(state, payload) {
    const message: Message = state.messages.find(msg => msg.identifier === payload.identifier) as Message;

    if (!message) state.messages.push(payload);
  },
  deleteMessage(state, identifier) {
    const message: Message = state.messages.find(msg => msg.identifier === identifier) as Message;

    if (message) {
      state.messages.splice(state.messages.indexOf(message), 1);
      return true;
    }

    return false;
  },
  updateMessage(state, payload) {
    const message: { [key: string]: any } = state.messages.find(msg => msg.identifier === payload.identifier) as Message;

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

const actions: ActionTree<MessagesState, {}> = {
  create({ commit }, payload) {
    commit('createMessage', payload);
  },
  update({ commit }, payload) {
    commit('updateMessage', payload);
  },
  destroy({ commit }, identifier) {
    commit('deleteMessage', identifier);
  }
};

const Messages = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};

export default Messages;