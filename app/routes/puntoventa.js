/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));
let PuntoVenta = mongoose.model('PuntoVenta');

let isAuth = require(path.join(__dirname, '../middlewares/auth'));

let PATH = '/puntosventa';
let VERSION = '1.0.0';

module.exports = function (server) {
  server.get({path: PATH, version: VERSION}, findDocuments);
  server.get({path: PATH + '/:puntoventaid', version: VERSION}, findOneDocument);
  server.post({path: PATH, version: VERSION}, isAuth, createDocument);
  server.put({path: PATH, version: VERSION}, isAuth, updateDocument);
  server.del({path: PATH + '/:puntoventaid', version: VERSION}, isAuth, deleteDocument);

  function findDocuments(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.find
    let conditions = {};
    let projection = {};
    let options = {};

    PuntoVenta.find(conditions, projection, options).sort({'nombre': 1}).exec(function (error, puntosventa) {
      if (error) {
        return next(error);
      } else {
        res.header('X-Total-Count', puntosventa.length);
        res.send(200, puntosventa);
        return next();
      }
    });
  }

  function findOneDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOne
    let conditions = {'puntoventaid': req.params.puntoventaid};
    let projection = {};
    let options = {};

    PuntoVenta.findOne(conditions, projection, options, function (error, puntoventa) {
      if (error) {
        return next(error);
      } else {
        res.send(200, puntoventa);
        return next();
      }
    });
  }

  function createDocument(req, res, next) {
    let puntoventa = new PuntoVenta({
      puntoventaid: req.body.puntoventaid,
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      logo: req.body.logo,
      direcciones: req.body.direcciones,
      socialmedia: req.body.socialmedia,
      telefonos: req.body.telefonos,
      cervezas: req.body.cervezas,
      horario: req.body.horario,
      fundacion: req.body.fundacion,
      descripcion: req.body.descripcion
    });

    // http://mongoosejs.com/docs/api.html#model_Model-save
    puntoventa.save(function (error, puntoventa, numAffected) {
      if (error) {
        return next(error);
      } else {
        res.send(201, { message: 'Punto de Venta creado' });
        return next();
      }
    });
  }

  function updateDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    let conditions = {'puntoventaid': req.body.puntoventaid};
    let update = {
      'nombre': req.body.nombre,
      'tipo': req.body.tipo,
      'logo': req.body.logo,
      'direcciones': req.body.direcciones,
      'socialmedia': req.body.socialmedia,
      'telefonos': req.body.telefonos,
      'cervezas': req.body.cervezas,
      'horario': req.body.horario,
      'fundacion': req.body.fundacion,
      'descripcion': req.body.descripcion
    };
    let options = {runValidators: true, context: 'query'};

    PuntoVenta.findOneAndUpdate(conditions, update, options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Punto de Venta actualizado' });
        return next();
      }
    });
  }

  function deleteDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    let options = {'puntoventaid': req.params.puntoventaid};

    PuntoVenta.remove(options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Punto de Venta eliminado' });
        return next();
      }
    });
  }
};
