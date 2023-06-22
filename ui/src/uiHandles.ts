import { switchConsoleVisibility } from "./uiCalls";

const handleUiKeyUp = (event: KeyboardEvent) => {
  switch (event.keyCode) {
    case 119:
    case 192: {
      switchConsoleVisibility();
      break;
    }
  }
};

export const initUiHandles = (): void => {
  window.addEventListener('keyup', handleUiKeyUp);
};

export const destroyUiHandles = (): void => {
  window.removeEventListener('keyup', handleUiKeyUp);
};