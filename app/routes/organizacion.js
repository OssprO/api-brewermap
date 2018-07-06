/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));
let Organizacion = mongoose.model('Organizacion');

let isAuth = require(path.join(__dirname, '../middlewares/auth'));

let PATH = '/organizaciones';
let VERSION = '1.0.0';

module.exports = function (server) {
  server.get({path: PATH, version: VERSION}, findDocuments);
  server.get({path: PATH + '/:organizacionid', version: VERSION}, findOneDocument);
  server.post({path: PATH, version: VERSION}, isAuth, createDocument);
  server.put({path: PATH, version: VERSION}, isAuth, updateDocument);
  server.del({path: PATH + '/:organizacionid', version: VERSION}, isAuth, deleteDocument);

  function findDocuments(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.find
    let conditions = {};
    let projection = {};
    let options = {};

    Organizacion.find(conditions, projection, options).sort({'nombre': 1}).exec(function (error, organizaciones) {
      if (error) {
        return next(error);
      } else {
        res.header('X-Total-Count', organizaciones.length);
        res.send(200, organizaciones);
        return next();
      }
    });
  }

  function findOneDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOne
    let conditions = {'organizacionid': req.params.organizacionid};
    let projection = {};
    let options = {};

    Organizacion.findOne(conditions, projection, options, function (error, organizacion) {
      if (error) {
        return next(error);
      } else {
        res.send(200, organizacion);
        return next();
      }
    });
  }

  function createDocument(req, res, next) {
    let organizacion = new Organizacion({
      organizacionid: req.body.organizacionid,
      nombre: req.body.nombre,
      logo: req.body.logo,
      tipo: req.body.tipo,
      direcciones: req.body.direcciones,
      socialmedia: req.body.socialmedia,
      telefonos: req.body.telefonos,
      representante: req.body.representante,
      descripcion: req.body.descripcion
    });

    // http://mongoosejs.com/docs/api.html#model_Model-save
    organizacion.save(function (error, organizacion, numAffected) {
      if (error) {
        return next(error);
      } else {
        res.send(201, { message: 'Organización creada' });
        return next();
      }
    });
  }

  function updateDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    let conditions = {'organizacionid': req.body.organizacionid};
    let update = {
      'nombre': req.body.nombre,
      'logo': req.body.logo,
      'tipo': req.body.tipo,
      'direcciones': req.body.direcciones,
      'socialmedia': req.body.socialmedia,
      'telefonos': req.body.telefonos,
      'representante': req.body.representante,
      'descripcion': req.body.descripcion
    };
    let options = {runValidators: true, context: 'query'};

    Organizacion.findOneAndUpdate(conditions, update, options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Organización actualizada' });
        return next();
      }
    });
  }

  function deleteDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    let options = {'organizacionid': req.params.organizacionid};

    Organizacion.remove(options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Organización eliminada' });
        return next();
      }
    });
  }
};
