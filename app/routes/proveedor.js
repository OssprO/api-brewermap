/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));
let Proveedor = mongoose.model('Proveedor');

let isAuth = require(path.join(__dirname, '../middlewares/auth'));

let PATH = '/proveedores';
let VERSION = '1.0.0';

module.exports = function (server) {
  server.get({path: PATH, version: VERSION}, findDocuments);
  server.get({path: PATH + '/:proveedorid', version: VERSION}, findOneDocument);
  server.post({path: PATH, version: VERSION}, isAuth, createDocument);
  server.put({path: PATH, version: VERSION}, isAuth, updateDocument);
  server.del({path: PATH + '/:proveedorid', version: VERSION}, isAuth, deleteDocument);

  function findDocuments(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.find
    let conditions = {};
    let projection = {};
    let options = {};

    Proveedor.find(conditions, projection, options).sort({'nombre': 1}).exec(function (error, proveedores) {
      if (error) {
        return next(error);
      } else {
        res.header('X-Total-Count', proveedores.length);
        res.send(200, proveedores);
        return next();
      }
    });
  }

  function findOneDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOne
    let conditions = {'proveedorid': req.params.proveedorid};
    let projection = {};
    let options = {};

    Proveedor.findOne(conditions, projection, options, function (error, proveedor) {
      if (error) {
        return next(error);
      } else {
        res.send(200, proveedor);
        return next();
      }
    });
  }

  function createDocument(req, res, next) {
    let proveedor = new Proveedor({
      proveedorid: req.body.proveedorid,
      nombre: req.body.nombre,
      fotografia: req.body.fotografia,
      tipo: req.body.tipo,
      contacto: req.body.contacto,
      direcciones: req.body.direcciones,
      socialmedia: req.body.socialmedia,
      telefonos: req.body.telefonos,
      descripcion: req.body.descripcion
    });

    // http://mongoosejs.com/docs/api.html#model_Model-save
    proveedor.save(function (error, proveedor, numAffected) {
      if (error) {
        return next(error);
      } else {
        res.send(201, { message: 'Proveedor creado' });
        return next();
      }
    });
  }

  function updateDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
    let conditions = {'proveedorid': req.body.proveedorid};
    let update = {
      'nombre': req.body.nombre,
      'fotografia': req.body.fotografia,
      'tipo': req.body.tipo,
      'contacto': req.body.contacto,
      'direcciones': req.body.direcciones,
      'socialmedia': req.body.socialmedia,
      'telefonos': req.body.telefonos,
      'descripcion': req.body.descripcion
    };
    let options = {runValidators: true, context: 'query'};

    Proveedor.findOneAndUpdate(conditions, update, options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Proveedor actualizado' });
        return next();
      }
    });
  }

  function deleteDocument(req, res, next) {
    // http://mongoosejs.com/docs/api.html#query_Query-remove
    let options = {'proveedorid': req.params.proveedorid};

    Proveedor.remove(options, function (error) {
      if (error) {
        return next(error);
      } else {
        res.send(200, { message: 'Proveedor eliminado' });
        return next();
      }
    });
  }
};
