export function humanizeNetworkBandwidth(bandwidth: number): string {
  const units = ["bps", "Kbps", "Mbps", "Gbps", "Tbps"];
  let index = 0;

  while (bandwidth >= 1024 && index < units.length - 1) {
    bandwidth /= 1024;
    index++;
  }

  return `${bandwidth.toFixed(2)} ${units[index]}`;
}

export function isTextSelected(input: HTMLInputElement): boolean {
  // @ts-ignore
  return document.getSelection().toString() === input.value;
}

// Shuffles an array using Fisher-Yates algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = ~~(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export type EventListener<T> = (data: T) => void;

export class EventEmitter<T> {
  private listeners: { [eventName: string]: Set<EventListener<T>> } = {};

  public on(eventName: string, listener: EventListener<T>): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = new Set();
    }
    this.listeners[eventName].add(listener);
  }

  public off(eventName: string, listener: EventListener<T>): void {
    const eventListeners = this.listeners[eventName];
    if (eventListeners) {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        delete this.listeners[eventName];
      }
    }
  }

  public emit(eventName: string, data: T): void {
    const eventListeners = this.listeners[eventName];
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(data);
      });
    }
  }

  public removeAllListeners(eventName?: string): void {
    if (eventName) {
      delete this.listeners[eventName];
    } else {
      this.listeners = {};
    }
  }
}
