/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));
let Cerveza = mongoose.model('Cerveza');

let isAuth = require(path.join(__dirname, '../middlewares/auth'));

let PATH = '/cervezas';
let VERSION = '1.0.0';

module.exports = function (server) {
  server.get({path: PATH, version: VERSION}, findDocuments);
  server.get({path: PATH + '/:cervezaid', version: VERSION}, findOneDocument);
  server.post({path: PATH, version: VERSION}, isAuth, createDocument);
  server.put({path: PATH, version: VERSION}, isAuth, updateDocument);
  server.del({path: PATH + '/:cervezaid', version: VERSION}, isAuth, deleteDocument);

  function findDocuments(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.find
    let conditions = {};
    let projection = {};
    let options = {};

    Cerveza.find(conditions, projection, options).sort({'nombre': 1}).exec(function (error, cervezas) {
      if (error) {
        return next(error);
      } else {
        res.header('X-Total-Count', cervezas.length);
        res.send(200, cervezas);
        return next();
      }
    });
  }

  function findOneDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOne
    let conditions = {'cervezaid': req.params.cervezaid};
    let projection = {};
    let options = {};

    Cerveza.findOne(conditions, projection, options, function (error, cerveza) {
      if (error) {
        return next(error);
      } else {
        res.send(200, cerveza);
        return next();
      }
    });
  }

  function createDocument(req, res, next) {
    let cerveza = new Cerveza({
      cervezaid: req.body.cervezaid,
      nombre: req.body.nombre,
      fotografia: req.body.fotografia,
      descripcion: req.body.descripcion,
      disponibilidad: req.body.disponibilidad,
      estilo: req.body.estilo,
      abv: req.body.abv,
      ibu: req.body.ibu,
      srm: req.body.srm,
      puntosventa: req.body.puntosventa
    });

    // http://mongoosejs.com/docs/api.html#model_Model-save
    cerveza.save(function (error, cerveza, numAffected) {
      if (error) {
        return next(error);
      } else {
        res.send(201, { message: 'Cerveza creada' });
        return next();
      }
    });
  }

  function updateDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    let conditions = {'cervezaid': req.body.cervezaid};
    let update = {
      'nombre': req.body.nombre,
      'fotografia': req.body.fotografia,
      'descripcion': req.body.descripcion,
      'disponibilidad': req.body.disponibilidad,
      'estilo': req.body.estilo,
      'abv': req.body.abv,
      'ibu': req.body.ibu,
      'srm': req.body.srm,
      'puntosventa': req.body.puntosventa
    };
    let options = {runValidators: true, context: 'query'};

    Cerveza.findOneAndUpdate(conditions, update, options, function (error) {
      if (error) {
        console.log(error);
        return next(error);
      } else {
        res.send(200, { message: 'Cerveza actualizada' });
        return next();
      }
    });
  }

  function deleteDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    let options = {'cervezaid': req.params.cervezaid};

    Cerveza.remove(options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Cerveza eliminada' });
        return next();
      }
    });
  }
};
