import { pushConsoleMessage, switchNetgraphVisibility } from "./uiCalls";
import { store } from "./vue";

interface ConsoleCVar {
  name: string;
  args?: any[];
  callback: Function;
}

const AVAILABLE_CONSOLE_CVARS: ConsoleCVar[] = [
  {
    name: 'test',
    callback: async (...commandArgs: any[]) => {
      pushConsoleMessage('debug', 'this is a test command')
    }
  },
  {
    name: 'netgraph',
    callback: async (...commandArgs: any[]) => {
      switchNetgraphVisibility();

      const state: string = store.getters['netgraph/showing'] ? 'enabled' : 'disabled';
      pushConsoleMessage('info', `Netgraph has been ${state}`);
    }
  }
];

export const EXECUTE_CONSOLE_CVAR = async (commandName: string, ...commandArgs: any[]) => {
  let command: ConsoleCVar | boolean = false;

  // find this command
  for (let index = 0; index < AVAILABLE_CONSOLE_CVARS.length; index++) {
    const cvar: ConsoleCVar = AVAILABLE_CONSOLE_CVARS[index];

    if (cvar.name === commandName) {
      command = cvar;
      break;
    }
  }

  // if command found
  if (command && command.callback) {
    // execute command
    await command.callback(...commandArgs);

    return true;
  }

  return false;
};  