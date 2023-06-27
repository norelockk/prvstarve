import { switchConsoleVisibility } from "./uiCalls";

const handleUikeyup = (event: KeyboardEvent) => {
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
  document.addEventListener('keyup', handleUikeyup);
};

export const destroyUiHandles = (): void => {
  document.removeEventListener('keyup', handleUikeyup);
};