import { switchConsoleVisibility } from "./uiCalls";

const handleUiKeyUp = (event: KeyboardEvent) => {
  switch (event.keyCode) {
    case 119:
    case 192: {
      switchConsoleVisibility();
      break;
    }
    default: break;
  }
};

export const initUiHandles = (): void => {
  document.addEventListener('keyup', handleUiKeyUp);
};

export const destroyUiHandles = (): void => {
  document.removeEventListener('keyup', handleUiKeyUp);
};