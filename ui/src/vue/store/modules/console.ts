import { GetterTree, MutationTree, ActionTree } from 'vuex';

export type ConsoleMessageLevel = 'debug' | 'info' | 'warn' | 'error';

interface ConsoleMessage {
  level: ConsoleMessageLevel;
  message: any;
}

interface ConsoleState {
  show: boolean;
  messages: ConsoleMessage[];
}

const state: ConsoleState = {
  show: false,
  messages: []
};

const getters: GetterTree<ConsoleState, {}> = {
  showing: state => state.show,
  messages: state => state.messages,
};

const mutations: MutationTree<ConsoleState> = {
  pushMessage(state, payload: ConsoleMessage) {
    if (payload.message.length === 1)
      payload.message = payload.message[0];
    else {
      const data: string = JSON.stringify(payload.message.splice(1, 1));
      payload.message = payload.message[0] + ': ' + data;
    }
    
    state.messages.push(payload);
  },
  switchVisibility(state) {
    state.show = !state.show;

    if (state.show) {
      const input: HTMLElement = document.getElementById('c_input') ?? document.querySelector('#c_input') as HTMLElement;

      if (input) input.focus();
    }
  }
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