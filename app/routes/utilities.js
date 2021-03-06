/*jslint node: true */
'use strict';

let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));

let isAuth = require(path.join(__dirname, '../middlewares/auth'));

let PATH = '/utils';
let VERSION = '1.0.0';

module.exports = function (server) {
  let ping = (req, res, next) => {
    res.send(200, 'true');
    return next();
  };
  server.get({path: PATH + '/ping', version: VERSION}, isAuth, ping);
  server.get({path: PATH + '/health', version: VERSION}, isAuth, health);
  server.get({path: PATH + '/info', version: VERSION}, isAuth, information);
  server.get({path: PATH + '/config', version: VERSION}, isAuth, configuration);
  server.get({path: PATH + '/env', version: VERSION}, isAuth, environment);


  function health(req, res, next) {
    res.json(200, {status: 'UP'});
    return next();
  }

  // Can be found with env URI
  function information(req, res, next) {
    let app_info = {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      description: process.env.npm_package_description,
      author: process.env.npm_package_author
    };
    res.send(200, app_info);
    return next();
  }

  function configuration(req, res, next) {
    res.send(200, config);
    return next();
  }

  function environment(req, res, next) {
    res.send(200, process.env);
    return next();
  }
};
