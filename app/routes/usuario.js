/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));
let Usuario = mongoose.model('Usuario');

let service = require(path.join(__dirname, '../services'));
let isAuth = require(path.join(__dirname, '../middlewares/auth'));

let bcrypt = require('bcrypt-nodejs');

let PATH = '/usuarios/';
let AUTH_PATH = '/auth/';
let VERSION = '1.0.0';

module.exports = function (server) {
  server.get({path: PATH, version: VERSION}, isAuth, findUsuarios);
  server.get({path: PATH + '/:usuarioid', version: VERSION}, isAuth, findOneUsuario);
  server.post({path: PATH, version: VERSION}, createUsuario);
  server.put({path: PATH, version: VERSION}, isAuth, updateUsuario);
  server.del({path: PATH + '/:usuarioid', version: VERSION}, isAuth, deleteUsuario);

  server.post({path: AUTH_PATH + '/login', version: VERSION}, loginUsuario);
  server.post({path: AUTH_PATH + '/logout', version: VERSION}, logoutUsuario);
  server.post({path: AUTH_PATH + '/changepassword', version: VERSION}, changePasswordUsuario);

  function findUsuarios(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.find
    let conditions = {};
    let projection = {};
    let options = {};

    Usuario.find(conditions, projection, options).sort({'usuarioid': 1}).exec(function (error, usuarios) {
      if (error) {
        return next(error);
      } else {
        res.header('X-Total-Count', usuarios.length);
        res.send(200, usuarios);
        return next();
      }
    });
  }

  function findOneUsuario(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOne
    let conditions = { 'usuarioid': req.params.usuarioid };
    let projection = { };
    let options = { };

    Usuario.findOne(conditions, projection, options, function (error, usuario) {
      if (error) {
        return next(error);
      } else {
        res.send(200, usuario);
        return next();
      }
    });
  }

  function loginUsuario(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.find
    let conditions = { 'email': req.body.email };
    let password = req.body.password;

    let projection = { };
    let options = { };

    Usuario.findOne(conditions, projection, options, function (err, usuario) {
      
      if (err) {
        return res.send(500, { message: err });
      }
      if (!usuario) {
        return res.send(400, { message: 'User not found' });
      }
      bcrypt.compare(password, usuario.password, (err, isValid) => {
        if (err) {
          return res.send(500, { message: err });;
        }
        if (!isValid) {
          return res.send(400, { message: 'Password verification fail' });
        }
        return res.send(200, { 
          message: 'Loggin Succesfull',
          token: service.createToken(usuario) });
      });

    }).select("+password");
  }

  function logoutUsuario(req, res, next) {
    return next();
  }

  function changePasswordUsuario(req, res, next) {
    return next();
  }

  function createUsuario(req, res, next) {
    let usuario = new Usuario({
      usuarioid: req.body.usuarioid,
      nombre: req.body.nombre,
      email: req.body.email,
      avatar: req.body.avatar,
      password: req.body.password
    });

    // http://mongoosejs.com/docs/api.html#model_Model-save
    usuario.save(function (error, usuario, numAffected) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { token: service.createToken(usuario) } );
        return next();
      }
    });
  }

  function updateUsuario(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    let conditions = {'usuarioid': req.body.usuarioid};
    let update = new Usuario({
      'nombre': req.body.nombre,
      'email': req.body.email,
      'avatar': req.body.avatar
    });

    let options = {runValidators: true, context: 'query'};

    Usuario.findOneAndUpdate(conditions, update, options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(204, { message: 'User info updated' });
        return next();
      }
    });
  }

  function deleteUsuario(req, res, next) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    let options = {'usuarioid': req.params.usuarioid};

    Usuario.remove(options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(204, { message: 'User succesfully deleted' });
        return next();
      }
    });
  }

};
