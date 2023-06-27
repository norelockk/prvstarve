import 'dotenv/config';

import HttpServer from "./http";
import Master from "./master";
import MasterSocket from './master/Socket';

console.clear();

export const master: Master = Master.construct();

HttpServer.construct();
MasterSocket.construct();

// test purposes
// import MasterClient from './Client';
// const client: MasterClient = new MasterClient();