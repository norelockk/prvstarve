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

export type EventListener<T extends any[]> = (...args: T) => void;

export class EventEmitter<T extends any[]> {
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

  public emit(eventName: string, ...args: T): void {
    const eventListeners = this.listeners[eventName];
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        listener(...args);
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

const requestHttp = (url: string, options: any) => {
  options = options || {};

  const promise = new Promise<any>((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open(options.method || 'get', url);

    for (let i in options.headers) {
      request.setRequestHeader(i, options.headers[i]);
    }

    request.onload = () => {
      resolve(response());
    };

    request.onerror = reject;

    request.send(options.body);

    function response() {
      let keys: string[] = [],
        all: [string, string][] = [],
        headers: { [key: string]: string } = {},
        header: string | undefined;

      request
        .getAllResponseHeaders()
        .replace(/^(.*?):\s*([\s\S]*?)$/gm, (m, key, value) => {
          keys.push((key = key.toLowerCase()));
          all.push([key, value]);

          header = headers[key];
          headers[key] = header ? `${header},${value}` : value;

          return ''; // Replace the matched header with an empty string
        });

      return {
        ok: (request.status / 200 | 0) == 1, // 200-399
        status: request.status,
        statusText: request.statusText,
        url: request.responseURL,
        clone: response,

        text: () => Promise.resolve(request.responseText),
        json: () => Promise.resolve(request.responseText).then(JSON.parse),
        xml: () => Promise.resolve(request.responseXML),
        blob: () => Promise.resolve(new Blob([request.response])),
        arrayBuffer: () => Promise.resolve(request.response),

        headers: {
          keys: () => keys,
          entries: () => all,
          get: (n: string) => headers[n.toLowerCase()],
          has: (n: string) => n.toLowerCase() in headers
        }
      };
    }
  });

  return promise;
};

export const get = (url: string, options: RequestInit = { credentials: 'same-origin' }): Promise<any> => {
  const promise = new Promise<any>((resolve, reject) => {
    options.method = 'GET';

    requestHttp(url, options)
      .then(handleResponse)
      .catch(reject);

    function handleResponse(response: Response) {
      if (!response.ok) return reject(response);
      response
        .text()
        .then(text => {
          if (text.charAt(0).includes('[') || text.charAt(0).includes('{')) {
            // Try to parse json, else return text
            try {
              resolve(JSON.parse(text));
            } catch (err) {
              resolve(text);
            }
          } else {
            resolve(text);
          }
        })
        .catch(reject);
    }
  });

  return promise;
};

export const post = (url: string, body: any = {}, options: RequestInit = {}): Promise<any> => {
  const promise = new Promise<any>((resolve, reject) => {
    options.method = 'POST';
    if (body) options.body = typeof body === 'object' || Array.isArray(body) ? JSON.stringify(body) : body;
    if (!options.headers) options.headers = { 'content-type': 'application/json' };

    requestHttp(url, options)
      .then(handleResponse)
      .catch(reject);

    function handleResponse(response: Response) {
      if (!response.ok) return reject(response);
      response
        .text()
        .then(text => {
          if (text.charAt(0).includes('[') || text.charAt(0).includes('{')) {
            // Try to parse json, else return text
            try {
              resolve(JSON.parse(text));
            } catch (err) {
              resolve(text);
            }
          } else {
            resolve(text);
          }
        })
        .catch(reject);
    }
  });

  return promise;
};