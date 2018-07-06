/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));
let Evento = mongoose.model('Evento');

let isAuth = require(path.join(__dirname, '../middlewares/auth'));

let PATH = '/eventos';
let VERSION = '1.0.0';

module.exports = function (server) {
  server.get({path: PATH, version: VERSION}, findDocuments);
  server.get({path: PATH + '/:eventoid', version: VERSION}, findOneDocument);
  server.post({path: PATH, version: VERSION}, isAuth, createDocument);
  server.put({path: PATH, version: VERSION}, isAuth, updateDocument);
  server.del({path: PATH + '/:eventoid', version: VERSION}, isAuth, deleteDocument);

  function findDocuments(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.find
    let conditions = {};
    let projection = {};
    let options = {};

    Evento.find(conditions, projection, options).sort({'nombre': 1}).exec(function (error, eventos) {
      if (error) {
        return next(error);
      } else {
        res.header('X-Total-Count', eventos.length);
        res.send(200, eventos);
        return next();
      }
    });
  }

  function findOneDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOne
    let conditions = {'eventoid': req.params.eventoid};
    let projection = {};
    let options = {};

    Evento.findOne(conditions, projection, options, function (error, evento) {
      if (error) {
        return next(error);
      } else {
        res.send(200, evento);
        return next();
      }
    });
  }

  function createDocument(req, res, next) {
    let evento = new Evento({
      eventoid: req.body.eventoid,
      nombre: req.body.nombre,
      fotografia: req.body.fotografia,
      tipo: req.body.tipo,
      descripcion: req.body.descripcion,
      organizador: req.body.organizador,
      direccion: req.body.direccion,
      socialmedia: req.body.socialmedia,
      telefonos: req.body.telefonos,
      cervecerias: req.body.cervecerias,
      horario: req.body.horario
    });

    // http://mongoosejs.com/docs/api.html#model_Model-save
    evento.save(function (error, evento, numAffected) {
      if (error) {
        return next(error);
      } else {
        res.send(201, { message: 'Evento creado' });
        return next();
      }
    });
  }

  function updateDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    let conditions = {'eventoid': req.body.eventoid};
    let update = {
      'nombre': req.body.nombre,
      'fotografia': req.body.fotografia,
      'tipo': req.body.tipo,
      'descripcion': req.body.descripcion,
      'direccion': req.body.direccion,
      'organizador': req.body.organizador,
      'socialmedia': req.body.socialmedia,
      'telefonos': req.body.telefonos,
      'cervecerias': req.body.cervecerias,
      'horario': req.body.horario
    };
    let options = {runValidators: true, context: 'query'};

    Evento.findOneAndUpdate(conditions, update, options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Evento actualizado' });
        return next();
      }
    });
  }

  function deleteDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    let options = {'eventoid': req.params.eventoid};

    Evento.remove(options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Evento eliminado' });
        return next();
      }
    });
  }
};
