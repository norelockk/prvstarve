import { GetterTree, MutationTree, ActionTree } from 'vuex';

interface NetgraphDatas {
  [key: string]: any;
}

interface NetgraphState {
  show: boolean;
  data: NetgraphDatas;
}

const state: NetgraphState = {
  show: false,
  data: {
    frames: 0,
    networkOut: 0,
    networkIn: 0,
  }
};

const getters: GetterTree<NetgraphState, {}> = {
  data: state => state.data,
  showing: state => state.show
};

const mutations: MutationTree<NetgraphState> = {
  setData: (state, payload) => {
    if (!state.show) return;

    for (const [ k, v ] of Object.entries(payload)) {
      if (k in state.data) {
        if (state.data[k] !== v) state.data[k] = v;
      }
    }
  },
  switchVisibility: (state) => {
    state.show = !state.show;

    if (!state.show) {
      // clear netgraph data
      for (const [ k, v ] of Object.entries(state.data)) {
        state.data[k] = 0;
      }
    }
  }
};

const actions: ActionTree<NetgraphState, {}> = {

};

const Netgraph = {
  state,
  getters,
  actions,
  mutations,
  namespaced: true
};

export default Netgraph;