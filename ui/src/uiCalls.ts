import { store } from "./vue";

export const updateFPS = (frames: number) => store.commit('netgraph/setData', { frames });
export const updateNetworkBW = (i: number, o: number) => store.commit('netgraph/setData', { networkIn: i, networkOut: o });