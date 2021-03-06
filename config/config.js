/* jslint node: true */
'use strict';

let path = require('path');

let rootPath = path.normalize(__dirname + '/..');

let NODE_ENV = process.env.NODE_ENV || 'production';
let NODE_HOST = process.env.NODE_HOST || '127.0.0.1';
let NODE_PORT = process.env.NODE_PORT || 3000;
let MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
let MONGO_PORT = process.env.MONGO_PORT || 27017;
let LOG_LEVEL = process.env.LOG_LEVEL || 'info';

let SECRET_TOKEN = 'lskd8ASf23fsFDAoy93FDGa934204nfSDFGkah2145mernDFasdfo99';

let APP_NAME = 'api-brewermap-';

let config = {
  development: {
    root: rootPath,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT,
      secret: SECRET_TOKEN
    },
    db: {
      host: MONGO_HOST,
      port: MONGO_PORT,
      name: APP_NAME + NODE_ENV
    },
    log: {
      name: APP_NAME + NODE_ENV,
      level: LOG_LEVEL
    }
  },
  test: {
    root: rootPath,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT,
      secret: SECRET_TOKEN
    },
    db: {
      host: MONGO_HOST,
      port: MONGO_PORT,
      name: APP_NAME + NODE_ENV
    },
    log: {
      name: APP_NAME + NODE_ENV,
      level: LOG_LEVEL
    }
  },
  production: {
    root: rootPath,
    app: {
      name: APP_NAME + NODE_ENV,
      address: NODE_HOST,
      port: NODE_PORT,
      secret: SECRET_TOKEN
    },
    db: {
      host: MONGO_HOST,
      port: MONGO_PORT,
      name: APP_NAME + NODE_ENV
    },
    log: {
      name: APP_NAME + NODE_ENV,
      level: LOG_LEVEL
    }
  }
};

module.exports = config[NODE_ENV];
