import { updateFPS, updateNetworkBW as updateNetwork } from "./uiCalls";

// network vars
let net_sent: number = 0;
let net_received: number = 0;
let net_interval: number | boolean = false;

// game vars
let game_fps: number = 0;
let game_lastTime: number = performance.now();
let game_frameCount: number = 0;

const updateNetworkBandwidth = (cleanAfter: boolean = false) => {
  updateNetwork(net_received, net_sent);

  if (cleanAfter) {
    net_sent = 0;
    net_received = 0;
  }
}

export const initNetworkHooks = (): void => {
  const LoliSocket = new Proxy(window.WebSocket, {
    construct(target, args) {
      // @ts-ignore
      const webSocket: WebSocket = new target(...args);
      webSocket.binaryType = 'arraybuffer';

      webSocket.addEventListener('open', () => {
        net_interval = setInterval(updateNetworkBandwidth, 1000, true);
        updateNetworkBandwidth(true);
      })
      webSocket.addEventListener('close', () => {
        net_sent = 0;
        net_received = 0;

        updateNetworkBandwidth(false);

        if (net_interval && typeof net_interval === 'number') {
          clearInterval(net_interval);
          net_interval = false;
        }
      });
      webSocket.addEventListener('message', (event) => {
        if (typeof event.data === 'string')
          net_received += event.data.length;
        else {
          const ui8: Uint8Array = new Uint8Array(event.data);

          if (ui8.length) {
            net_received += ui8.length;
          }
        }
      });

      return webSocket;
    }
  });
  window.WebSocket = LoliSocket;

  const wsSend = window.WebSocket.prototype.send;
  window.WebSocket.prototype.send = function (data: any) {
    if (typeof data === 'string') {
      net_sent += data.length;
    } else {
      const ui8: Uint8Array = new Uint8Array(data);

      if (ui8.length) {
        net_sent += ui8.length;
      }
    }

    return wsSend.apply(this, [data]);
  };
};

export const initGameHooks = () => {
  const calculateFPS = (): void => {
    const currentTime = performance.now();
    const deltaTime = currentTime - game_lastTime;
    
    game_frameCount++;
    
    if (deltaTime >= 1000) {
      game_fps = game_frameCount;
      game_lastTime = currentTime;
      game_frameCount = 0;

      updateFPS(game_fps);
    }
    
    requestAnimationFrame(calculateFPS);
  }

  requestAnimationFrame(calculateFPS);
};