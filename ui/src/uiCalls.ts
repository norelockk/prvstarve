import { store } from "./vue";
import { ConsoleMessageLevel } from "./vue/store/modules/console";
import { emitter } from "./main";
import { EventListener } from "./utils";
import { Message } from "./interfaces";

// UI
export const switchUI = () => store.commit('ui/show');

// Netgraph
export const updateFPS = (frames: number) => store.commit('netgraph/setData', { frames });
export const updatePlayerPos = (x: number, y: number) => store.commit('netgraph/setData', { playerPosX: x, playerPosY: y });
export const updateNetworkBW = (i: number, o: number) => store.commit('netgraph/setData', { networkIn: i, networkOut: o });
export const switchNetgraphVisibility = () => store.commit('netgraph/switchVisibility');

// Console
export const clearConsole = () => store.commit('console/clear');
export const pushConsoleMessage = (lvl: ConsoleMessageLevel, ...message: any[]) => store.commit('console/pushMessage', { level: lvl, message });
export const switchConsoleVisibility = () => store.commit('console/switchVisibility');

// Messages
export const showMessage = (payload: Message) => store.dispatch('messages/create', payload);
export const updateMessage = (payload: Message) => store.dispatch('messages/update', payload);
export const destroyMessage = (identifier: string) => store.dispatch('messages/destroy', identifier);

// Bind events to event emitter
const events: [string, Function][] = [
  // UI
  ['ready', () => {
    switchUI();

    if ('discord' in window) window.discord.update('In game', 'In main menu');
  }],
  ['switchUI', switchUI],

  // Netgraph
  ['updateFPS',           updateFPS],
  ['updateNetwork',       updateNetworkBW],
  ['updatePlayerPos',     updatePlayerPos],
  ['switchNetgraph',      switchNetgraphVisibility],

  // Console
  ['consoleClear',        clearConsole],
  ['consoleOutput',       pushConsoleMessage],
  ['switchConsole',       switchConsoleVisibility],

  // Messages
  ['showMessage',         showMessage],
  ['updateMessage',       updateMessage],
  ['destroyMessage',      destroyMessage],
];

export const setupEmitter = (): void => {
  const len = events.length;

  for (let index = 0; index < len; index++) {
    const [ eventName, eventCallback ] = events[index];

    try {
      emitter.on(eventName, eventCallback as EventListener<any>);   
    } catch (err) {
      throw 'Failed to set ' + eventName + ' event handler';
    }
  }
};