import 'dotenv/config';

import HttpServer from "./http";
import Master from "./master";
import MasterSocket from './master/Socket';
import MasterClient from './Client';

console.clear();

export const master: Master = Master.construct();

HttpServer.construct();
MasterSocket.construct();

// test purposes
const client: MasterClient = new MasterClient();