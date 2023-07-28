import { GetterTree, MutationTree, ActionTree } from 'vuex';
import Lolipop from './lolipop';

export type ConsoleMessageLevel = 'debug' | 'info' | 'warn' | 'error';

interface ConsoleMessage {
  level: ConsoleMessageLevel;
  message: any;
}

interface ConsoleState {
  show: boolean;
  history: string[],
  messages: ConsoleMessage[];
}

const state: ConsoleState = {
  show: false,
  history: [],
  messages: [
    {
      level: 'debug',
      message: `\nWelcome to ${Lolipop.state.PROJECT_NAME}\nVersion: ${Lolipop.state.PROJECT_VERSION.join('.') + '-' + Lolipop.state.PROJECT_VERSION_CHANNEL + ' (' + Lolipop.state.PROJECT_ENVIRONMENT + '-' + Lolipop.state.PROJECT_VERSION_HASH + ')'}`
    }
  ],
};

const getters: GetterTree<ConsoleState, {}> = {
  showing: state => state.show,
  history: state => state.history,
  messages: state => state.messages,
};

const mutations: MutationTree<ConsoleState> = {
  pushMessage(state, payload: ConsoleMessage) {
    if (payload.message.length === 1) {
      if (typeof payload.message[0] === 'string')
        payload.message = payload.message[0];
      else
        payload.message = JSON.stringify(payload.message[0]);
    } else {
      const data: string = JSON.stringify(payload.message.splice(1, 1));
      payload.message = payload.message[0] + ': ' + data;
    }
    
    state.messages.push(payload);
  },
  switchVisibility(state) {
    state.show = !state.show;

    if ('state' in window['LOLIPOP_CONSOLE'])
      window['LOLIPOP_CONSOLE']['state'] = state.show;
  },
  pushCommandToHistory(state, command) {
    if (typeof command !== 'string') return;

    state.history.push(command);
  },
  clear() {
    if (state.messages.length > 0) state.messages = [];
  },
};

const actions: ActionTree<ConsoleState, {}> = {

};

const Console = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};

export default Console;