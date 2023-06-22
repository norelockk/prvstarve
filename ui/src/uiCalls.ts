import { store } from "./vue";
import { ConsoleMessageLevel } from "./vue/store/modules/console";

// Netgraph
export const updateFPS = (frames: number) => store.commit('netgraph/setData', { frames });
export const updateNetworkBW = (i: number, o: number) => store.commit('netgraph/setData', { networkIn: i, networkOut: o });
export const switchNetgraphVisibility = () => store.commit('netgraph/switchVisibility');

// Console
export const pushConsoleMessage = (lvl: ConsoleMessageLevel, ...message: any[]) => {
  const content: Element = document.getElementById('c_content') ?? document.querySelector('#c_content') as Element;

  if (content) {
    store.commit('console/pushMessage', { level: lvl, message });

    content.scroll({ behavior: 'smooth', top: content.clientHeight + 9999 });
  }
}
export const switchConsoleVisibility = () => {
  store.commit('console/switchVisibility');
  
  if (!!store.getters['console/showing']) {
    const input: HTMLElement = document.getElementById('c_input') as HTMLElement;

    if (input) input.focus();
  }
};