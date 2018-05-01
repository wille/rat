import { enable } from 'debug';
import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

import chalk from 'chalk';

enable('server:*');
const debug = require('debug')('server:http');

import webServer from './web-server';

import ClientServer from './clientServer';
import ControlSocketServer from './control-socket';

const ports = {
  server: 9999,
};

export const controlSocket = new ControlSocketServer(webServer);
export const clientServer = new ClientServer(ports.server);
