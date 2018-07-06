'use strict';

let mongoose = require('mongoose');
require('mongoose-types').loadTypes(mongoose);
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let organizacionSchema = new Schema({
  organizacionid: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: false
  },
  representante: {
    type: String
  },
  descripcion: {
    type: String,
    required: false
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Asociación', 'Grupo', 'Club', 'Difusión']
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

organizacionSchema.index({ ubicacion: '2dsphere' });

organizacionSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to organizacionSchema
organizacionSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
organizacionSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
  }
});

let Organizacion = mongoose.model('Organizacion', organizacionSchema);

module.exports = Organizacion;
