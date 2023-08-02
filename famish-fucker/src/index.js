"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 1] = "UP";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["DOWN"] = 8] = "DOWN";
    Direction[Direction["NONE"] = 0] = "NONE";
    Direction[Direction["RIGHT"] = 4] = "RIGHT";
})(Direction || (Direction = {}));
function generateKeyPair() {
    const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
    return { publicKey, privateKey };
}
function generateRandomHex(length) {
    let result = '';
    const characters = 'abcdef0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function generateUUIDV4() {
    const timeLow = generateRandomHex(8);
    const timeMid = generateRandomHex(4);
    const timeHiAndVersion = `4${generateRandomHex(3)}`;
    const clockSeqHiAndReserved = `8${generateRandomHex(1)}`;
    const clockSeqLow = generateRandomHex(2);
    const node = generateRandomHex(12);
    return `${timeLow}-${timeMid}-${timeHiAndVersion}-${clockSeqHiAndReserved}-${clockSeqLow}-${node}`;
}
class BotSocket {
    constructor(url, proxy) {
        this.crypton = Utils.makeid(25);
        this.crypton_uuid = generateUUIDV4();
        this.join_token = Utils.makeid(65);
        this.public_key = generateKeyPair().publicKey;
        this.token = Utils.getTk(14);
        this.url = url;
        this.uuid = Math.floor(Math.random() * 1000000);
        this.followPoint = { x: 0, y: 0, type: 0 };
        // this.agent = new HttpProxyAgent('http://' + proxy);
        // console.log(this.agent);
        // this.agent.proxy.origin = 'https://famishs.io';
        this.ws = new ws_1.default(this.url, {
            // agent: this.agent,
            headers: {
                origin: 'https://famishs.io',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            },
        });
        // console.log(this.ws.url);
        this.name = `FARMER ${Utils.usernames[Utils.randInt(0, Utils.usernames.length - 1)]}`;
        this.directions = [1, 2, 8, 4];
        this.lastSendLocation = Date.now();
        this.player = {
            velocity: 0,
            lastSentVelocity: null,
            lastSentAngle: null,
            lastStuck: Date.now(),
            pos: { x: 0, y: 0 },
            name: this.name,
            id: null,
            angle: 0,
        };
        this.ws.addEventListener('open', () => {
            Utils.bots.set(this.uuid, this);
            console.log('Established connection');
            // const version = 51;
            // const payload = [this.name, 1704, 1203, version, Utils.getCt() + Utils.getTk().substring(6), '', 0, 0, 0, 0, 0, 1, 0, 0, 0, null];
            setTimeout(() => {
                const payload = [
                    "dc.restarve.pro",
                    2120, 1280, 17,
                    this.token, "",
                    0, 0, 0, 0, 0, 1, 0, 0, 0,
                    null, null,
                    this.crypton, "26CcXPDyf3f9i6MtyDcCYAs3NStqwmy1I5xSnolDhpvWJ61QuFmenAuhV13l", "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDSUwNZdTmwUjtBDrkRpUV6vUcrl3/j1E+shNlAcsgrEiVNhMIURwsvv55wYojyRQ6eywYxOwewmZxJ1oj9wq+Wy1ZWGYCZnsFXKvRNgLUdLzhtlZMVwKse0YAQEvDSBOP1uKIl6dd+1l1m7IuOyvTWCuSbT9VvYkUHKDuHJQOn9QIDAQAB"
                ];
                this.ws.send(JSON.stringify(payload));
            }, 350);
        });
        this.ws.addEventListener('message', (e) => {
            // if (typeof e.data === 'string') {
            //   console.log(e.data);
            // }
            Utils.handlePacket(e.data, this);
        });
        this.ws.addEventListener('close', (e) => {
            // console.log(e.code);
            console.log('Connection closed');
            Utils.bots.delete(this.uuid);
        });
        this.ws.addEventListener('error', () => { });
    }
    generateNewDirection() {
        let direction;
        let tries = 0;
        while (!direction) {
            // Error handling
            if (tries > 10) {
                console.log('Something went really wrong');
                return 0;
            }
            tries++;
            // Generate a random direction that isn't our current one
            const index = Utils.randInt(0, this.directions.length - 1);
            if (this.directions[index] !== this.player.velocity) {
                direction = this.directions[index];
            }
        }
        return direction;
    }
    calcRoute(point) {
        const dx = this.player.pos.x - point.x;
        const dy = this.player.pos.y - point.y;
        if (Math.abs(dx) / Math.abs(dy) > 0.5 && Math.abs(dx) / Math.abs(dy) < 2) {
            let dir = 0;
            if (dy >= 0)
                dir += Direction.UP;
            if (dy < 0)
                dir += Direction.DOWN;
            if (dx >= 0)
                dir += Direction.RIGHT;
            if (dx < 0)
                dir += Direction.LEFT;
            // console.log(dir);
            this.player.velocity = dir;
        }
        else if (Math.abs(dy) > Math.abs(dx)) {
            // Then the y value must be at least 3 times greater than x
            if (dy > 0) {
                // We must be not as far as them so go down
                let dir = Direction.UP;
                this.player.velocity = dir;
            }
            else {
                let dir = Direction.DOWN;
                this.player.velocity = dir;
            }
        }
        else {
            // Then x value must be 3 times greater than y
            if (dx > 0) {
                // We must be not as far as them so go right
                let dir = Direction.LEFT;
                this.player.velocity = dir;
            }
            else {
                let dir = Direction.RIGHT;
                this.player.velocity = dir;
            }
        }
        // Little piece of aimbot code
        const dist = Math.sqrt(dx ** 2 + dy ** 2);
        if (dist < 1600) {
            this.calcAngle(point, dist);
        }
        this.updateServer('DIR');
    }
    calcAngle(point, dist) {
        if (point.type !== 2 && point.type !== 3) {
            return;
        }
        this.player.angle = Utils.calcAngle(this.player.pos, point);
        if (dist < 1000) {
            this.updateServer('ATK');
        }
        this.updateServer('ANG');
    }
    changeVelocity() {
        const currentTime = Date.now();
        if (currentTime - this.player.lastStuck > 500) {
            this.player.velocity = this.generateNewDirection();
            this.player.lastStuck = currentTime;
            console.log('Player stuck, updating pos');
            this.updateServer('DIR');
        }
    }
    updateServer(type) {
        switch (type) {
            case 'DIR':
                const currentTime = Date.now();
                if (currentTime - this.lastSendLocation > 500) {
                    const updateLocationPacket = [1, this.player.pos.x - 400, this.player.pos.y - 400];
                    this.ws.send(JSON.stringify(updateLocationPacket));
                    this.lastSendLocation = currentTime;
                }
                if (this.player.velocity !== this.player.lastSentVelocity) {
                    const movementPacket = [2, this.player.velocity];
                    this.ws.send(JSON.stringify(movementPacket));
                    this.player.lastSentVelocity = this.player.velocity;
                }
                break;
            case 'ANG':
                if (this.player.angle !== this.player.lastSentAngle) {
                    const anglePacket = [3, this.player.angle];
                    this.ws.send(JSON.stringify(anglePacket));
                    this.player.lastSentAngle = this.player.angle;
                }
                break;
            case 'ATK':
                this.ws.send('[[5, 64]]');
                const attackPacket = [4, this.player.angle];
                const resetAttackPacket = [14];
                this.ws.send(JSON.stringify(attackPacket));
                setTimeout(() => {
                    if (this.ws.readyState === 1) {
                        this.ws.send(JSON.stringify(resetAttackPacket));
                    }
                }, 100);
                break;
            default:
                console.log('Unknown update type');
                break;
        }
    }
}
class Utils {
    static randInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static calcAngle(p1, p2) {
        const dy = p2.y - p1.y;
        const dx = p2.x - p1.x;
        let theta = Math.atan2(dy, dx);
        theta *= 180 / Math.PI;
        return theta;
    }
    static angle360(p1, p2) {
        let theta = Utils.calcAngle(p1, p2);
        if (theta < 0)
            theta = 360 + theta;
        theta = Math.floor((theta * 255) / 360);
        return theta;
    }
    static getTk(length = 14) {
        let e = '';
        for (let f = 0; f < length; f++)
            e += String.fromCharCode(48 + Math.floor(74 * Math.random()));
        return e;
    }
    static getCt() {
        const t = 'Jmv9X4x6UVOPbbjaAhB'; // this is our token
        let Ct = '';
        for (let a = 1; a < t.length; a += 3)
            Ct += t[a];
        return Ct;
    }
    static handshake(data, caller) {
        caller.player.id = data[9];
        caller.player.pos.x = data[3];
        caller.player.pos.y = data[10];
        console.log('my id is', caller.player.id);
        setInterval(() => {
            caller.ws.send(JSON.stringify([0, 'New project at https://discord.restarve.pro/']));
        }, 3000);
        caller.calcRoute(caller.followPoint);
    }
    static entityupdate(data, ui8, caller) {
        const ui16 = new Uint16Array(data);
        const length = (ui8.length - 2) / 18;
        for (let index = 0; index < length; index++) {
            const k8 = 2 + index * 18;
            const k16 = 1 + index * 9;
            // Entity pre-data
            const pid = ui8[k8];
            const action = ui16[k16 + 1];
            const id = ui16[k16 + 5];
            const uid = pid * 1000 + id;
            // Entity data
            const x = ui16[k16 + 3];
            const y = ui16[k16 + 4];
            const type = ui16[k16 + 2];
            const info = ui16[k16 + 6];
            const speed = ui16[k16 + 7];
            const extra = ui16[k16 + 8];
            const angle = ui8[k16 + 1] / 255 * Math.PI * 2;
            switch (type) {
                case 0: {
                    if (pid === caller.player.id) {
                        if (x + y === 0) {
                            caller.changeVelocity();
                        }
                        else {
                            caller.player.pos.x = x;
                            caller.player.pos.y = y;
                            caller.calcRoute(caller.followPoint);
                        }
                    }
                    break;
                }
            }
        }
    }
    static handlePacket(e, caller) {
        if (typeof e === 'string') {
            const json = JSON.parse(e);
            switch (json[0]) {
                case 3:
                    Utils.handshake(json, caller);
                    break;
                case 13:
                    new BotSocket(caller.url, caller.agent);
                    break;
                default:
                    break;
            }
        }
        else {
            const d = new Uint8Array(e);
            switch (d[0]) {
                case 0:
                    Utils.entityupdate(e, d, caller);
                    break;
            }
        }
    }
    static makeid(length = 14) {
        let result = '';
        let counter = 0;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
}
Utils.bots = new Map();
Utils.usernames = [
// Add your usernames here
];
let proxies = [];
axios_1.default.get('http://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=1000&country=all&ssl=all&anonymity=all').then(r => {
    proxies = r.data.split('\r\n');
    for (let index = 0; index < 3; index++) {
        const proxy = proxies[~~(Math.random() * proxies.length)];
        new BotSocket('wss://europe.famishs.io/id=' + ~~(Math.random() * 99999999), proxy);
    }
    setInterval(() => {
        for (let index = 0; index < 3; index++) {
            const proxy = proxies[~~(Math.random() * proxies.length)];
            new BotSocket('wss://europe.famishs.io/id=' + ~~(Math.random() * 99999999), proxy);
        }
    }, 500);
});
// const wss = new WebSocket.Server({ port: 8080 });
// wss.on('connection', function (ws) {
//   console.log('we got a connection.');
//   ws.on('message', f(data) {
//     let json = JSON.parse(data);
//     switch (json[0]) {
//       case 0:
//         console.log(json[1]);
//         console.log('Smashing with bots');
//         setTimeout(function () {
//           for (let i = 0; i < 50; i++) {
//             new BotSocket(json[1]);
//           }
//         }, 4000);
//         break;
//       case 1:
//         Utils.bots.forEach((bot, uuid) => {
//           if (bot.followPoint.type !== 3) {
//             bot.followPoint.x = json[1];
//             bot.followPoint.y = json[2];
//             bot.followPoint.type = 1;
//           }
//         });
//         break;
//       case 2:
//         Utils.bots.forEach((bot, uuid) => {
//           if (bot.followPoint.type !== 3) {
//             bot.followPoint.x = json[1];
//             bot.followPoint.y = json[2];
//             bot.followPoint.type = 2;
//           }
//         });
//         break;
//       default:
//         console.log('Unknown', json);
//         break;
//     }
//   });
// });
