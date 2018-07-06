'use strict';

let mongoose = require('mongoose');

require('mongoose-types').loadTypes(mongoose);
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let proveedorSchema = new Schema({
  proveedorid: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  fotografia: {
    type: String,
    required: false
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Tienda de Insumos', 'Venta de Equipo', 'Capacitación y Asesoría', 'Distribución']
  },
  descripcion: {
    type: String,
    required: false
  },
  contacto: {
    type: String,
  },
  direcciones: [{
    pais: String,
    estado: String,
    municipio: String,
    direccion: String,
    cp: String,
    ubicacion: {
      type: { type: String },
      coordinates: []
    },
  }],
  socialmedia: [
    {
      red: String,
      url: String
    }
  ],
  telefonos: [
    {
      lugar: String,
      numero: String
    }
  ]
});

proveedorSchema.index({ ubicacion: '2dsphere' });

proveedorSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to proveedorSchema
proveedorSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
proveedorSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
  }
});

let Proveedor = mongoose.model('Proveedor', proveedorSchema);

module.exports = Proveedor;
