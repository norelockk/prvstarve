import { pushConsoleMessage, switchNetgraphVisibility, clearConsole } from "./uiCalls";
import { store } from "./vue";

interface ConsoleCVar {
  name: string;
  description?: string;
  args?: any[];
  callback: Function;
}

const AVAILABLE_CONSOLE_CVARS: ConsoleCVar[] = [
  {
    name: 'netgraph',
    callback: async (...commandArgs: any[]) => {
      switchNetgraphVisibility();

      const state: string = store.getters['netgraph/showing'] ? 'enabled' : 'disabled';
      pushConsoleMessage('info', `Netgraph has been ${state}`);
    },
    description: 'Shows the netgraph',
  },
  {
    name: 'clear',
    callback: async (...commandArgs: any[]) => {
      clearConsole();
    },
    description: 'Clears the console',
  },
  {
    name: 'help',
    callback: async (...commandArgs: any[]) => {
      pushConsoleMessage('info', '===============================================================');
      pushConsoleMessage('info', `List of available commands (${AVAILABLE_CONSOLE_CVARS.length}):`);

      for (let index = 0; index < AVAILABLE_CONSOLE_CVARS.length; index++) {
        const command = AVAILABLE_CONSOLE_CVARS[index];

        if (command) pushConsoleMessage('info', `${command.name}${typeof command.description === 'string' && command.description.length > 0 ? ' - ' + command.description : ''}`)
      }

      pushConsoleMessage('info', '===============================================================');
    },
    description: 'This shown command'
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