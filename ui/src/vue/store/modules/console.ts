import { GetterTree, MutationTree, ActionTree } from 'vuex';

type ConsoleMessageLevel = 'debug' | 'info' | 'warn' | 'error';

interface ConsoleMessage {
  level: ConsoleMessageLevel;
  message: string;
}

interface ConsoleState {
  show: boolean;
  messages: ConsoleMessage[];
}

const state: ConsoleState = {
  show: true,
  messages: [
    {
      level: 'debug',
      message: 'test'
    },{
      level: 'debug',
      message: 'test'
    },
  ]
};

const getters: GetterTree<ConsoleState, {}> = {
  showing: state => state.show,
  messages: state => state.messages,
};

const mutations: MutationTree<ConsoleState> = {
  
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