/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));
let Cerveceria = mongoose.model('Cerveceria');

let isAuth = require(path.join(__dirname, '../middlewares/auth'));

let PATH = '/cervecerias';
let VERSION = '1.0.0';

module.exports = function (server) {
  server.get({path: PATH, version: VERSION}, findDocuments);
  server.get({path: PATH + '/:cerveceriaid', version: VERSION}, findOneDocument);
  server.post({path: PATH, version: VERSION}, isAuth, createDocument);
  server.put({path: PATH, version: VERSION}, isAuth, updateDocument);
  server.del({path: PATH + '/:cerveceriaid', version: VERSION}, isAuth, deleteDocument);

  function findDocuments(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.find
    let conditions = {};
    let projection = {};
    let options = {};

    Cerveceria.find(conditions, projection, options).sort({'nombre': 1}).exec(function (error, cervecerias) {
      if (error) {
        return next(error);
      } else {
        res.header('X-Total-Count', cervecerias.length);
        res.send(200, cervecerias);
        return next();
      }
    });
  }

  function findOneDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOne
    let conditions = {'cerveceriaid': req.params.cerveceriaid};
    let projection = '-_id -socialmedia._id -__v -telefonos._id -direcciones._id -id';
    let options = {};

    Cerveceria.findOne(conditions, projection, options, function (error, cerveceria) {
      if (error) {
        return next(error);
      } else {
        res.send(200, cerveceria);
        return next();
      }
    });
  }

  function createDocument(req, res, next) {
    let cerveceria = new Cerveceria({
      cerveceriaid: req.body.cerveceriaid,
      nombre: req.body.nombre,
      tipo: req.body.tipo,
      logo: req.body.logo,
      direcciones: req.body.direcciones,
      socialmedia: req.body.socialmedia,
      telefonos: req.body.telefonos,
      cervezas: req.body.cervezas,
      cervecero: req.body.cervecero,
      fundacion: req.body.fundacion,
      descripcion: req.body.descripcion
    });

    // http://mongoosejs.com/docs/api.html#model_Model-save
    cerveceria.save(function (error, cerveceria, numAffected) {
      if (error) {
        return next(error);
      } else {
        res.send(201, { message: 'Cervecería creada' });
        return next();
      }
    });
  }

  function updateDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    let conditions = {'cerveceriaid': req.body.cerveceriaid};
    let update = {
      'nombre': req.body.nombre,
      'tipo': req.body.tipo,
      'logo': req.body.logo,
      'direcciones': req.body.direcciones,
      'socialmedia': req.body.socialmedia,
      'telefonos': req.body.telefonos,
      'cervezas': req.body.cervezas,
      'cervecero': req.body.cervecero,
      'fundacion': req.body.fundacion,
      'descripcion': req.body.descripcion
    };
    let options = {runValidators: true, context: 'query'};

    Cerveceria.findOneAndUpdate(conditions, update, options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Cervecería actualizada' });
        return next();
      }
    });
  }

  function deleteDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    let options = {'cerveceriaid': req.params.cerveceriaid};

    Cerveceria.remove(options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Cervecería eliminada' });
        return next();
      }
    });
  }
};
