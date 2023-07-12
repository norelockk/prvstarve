import { store } from "./vue";
import { ConsoleMessageLevel } from "./vue/store/modules/console";
import { emitter } from "./main";
import { EventListener } from "./utils";

// Netgraph
export const updateFPS = (frames: number) => store.commit('netgraph/setData', { frames });
export const updatePlayerPos = (x: number, y: number) => store.commit('netgraph/setData', { playerPosX: x, playerPosY: y });
export const updateNetworkBW = (i: number, o: number) => store.commit('netgraph/setData', { networkIn: i, networkOut: o });
export const switchNetgraphVisibility = () => store.commit('netgraph/switchVisibility');

// Console
export const clearConsole = () => store.commit('console/clear');
export const pushConsoleMessage = (lvl: ConsoleMessageLevel, ...message: any[]) => store.commit('console/pushMessage', { level: lvl, message });
export const switchConsoleVisibility = () => store.commit('console/switchVisibility');

// Bind events to event emitter
const events: [string, Function][] = [
  ['updateFPS',           updateFPS],
  ['consoleClear',        clearConsole],
  ['consoleOutput',       pushConsoleMessage],
  ['updateNetwork',       updateNetworkBW],
  ['switchConsole',       switchConsoleVisibility],
  ['switchNetgraph',      switchNetgraphVisibility],
  ['updatePlayerPos',     updatePlayerPos],
];

export const setupEmitter = (): void => {
  for (let index = 0; index < events.length; index++) {
    const [ eventName, eventCallback ] = events[index];

    try {
      emitter.on(eventName, eventCallback as EventListener<any>);   
    } catch (err) {
      throw 'Failed to set ' + eventName + ' event handler';
    }
  }
};