import { store } from "./vue";
import { ConsoleMessageLevel } from "./vue/store/modules/console";

// Netgraph
export const updateFPS = (frames: number) => store.commit('netgraph/setData', { frames });
export const updatePlayerPos = (x: number, y: number) => store.commit('netgraph/setData', { playerPosX: x, playerPosY: y });
export const updateNetworkBW = (i: number, o: number) => store.commit('netgraph/setData', { networkIn: i, networkOut: o });
export const switchNetgraphVisibility = () => store.commit('netgraph/switchVisibility');

// Console
export const clearConsole = () => store.commit('console/clear');
export const pushConsoleMessage = (lvl: ConsoleMessageLevel, ...message: any[]) => store.commit('console/pushMessage', { level: lvl, message });
export const pushCommandToHistory = (command: string) => store.commit('console/pushCommandToHistory', command);
export const switchConsoleVisibility = () => store.commit('console/switchVisibility');