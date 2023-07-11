// @ts-nocheck
import { updateFPS, updateNetworkBW as updateNetwork, updatePlayerPos } from "./uiCalls";
import { store } from "./vue";
import { xorEncrypt } from "./utils";

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
};

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

    // let encrypted;
    // if ('msgpack' in window) {
    //   try {
    //     encrypted = msgpack.encode(xorEncrypt(data));
    //   } catch (e) {
    //     throw null;
    //   }
    // } else encrypted = xorEncrypt(data);

    return wsSend.apply(this, [data]);
  };
};

export const initGameHooks = (): void => {
  const calculateFPS = (): void => {
    const currentTime: number = performance.now();
    const deltaTime: number = currentTime - game_lastTime;

    game_frameCount++;

    if (deltaTime >= 1000) {
      game_fps = game_frameCount;
      game_lastTime = currentTime;
      game_frameCount = 0;

      updateFPS(game_fps);
    }
  };

  const updateImportantThings = (): void => {
    // lolipop console update console state
    window['LOLIPOP_CONSOLE']['state'] = store.getters['console/showing'];
  };

  const updateGameInfo = (): void => {
    if (world.units && world.units.length > 0) {
      const players: any[] = world.units[ITEMS.PLAYERS];

      for (let index = 0; index < players.length; index++) {
        const player: any = players[index];

        if (player && player.pid === user.id) {
          updatePlayerPos(~~player.x, ~~player.y);
        }
      }
    }
  }

  const loop = (): void => {
    calculateFPS();
    updateGameInfo();
    updateImportantThings();
    
    requestAnimationFrame(loop);
  };

  requestAnimationFrame(loop);
};