/*jslint node: true */
'use strict';

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var path = require('path');

var config = require(path.join(__dirname, '/config/config'));
var log = require(path.join(__dirname, 'log'));

module.exports = function () {
  var uri = ''.concat('mongodb://', config.db.host, ':', config.db.port, '/', config.db.name);
  var options = { useMongoClient: true, promiseLibrary: require('bluebird') };
  //mongoose.connect(uri);
  mongoose.connect(uri, options);

  var db = mongoose.connection;

  db.on('connected', function () {
    log.info('Mongodb connection open to ' + uri);
  });
  db.on('error', function () {
    throw new Error('Unable to connect to database at ' + uri);
  });
  db.on('disconnected', function () {
    log.info('Mongodb connection disconnected');
  });

  process.on('SIGINT', function () {
    db.close(function () {
      log.info('Mongodb connection disconnected through app termination');
      process.exit(0);
    });
  });
};
