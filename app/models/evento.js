'use strict';

let mongoose = require('mongoose');

require('mongoose-types').loadTypes(mongoose);
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let Email = mongoose.SchemaTypes.Email;

let eventoSchema = new Schema({
  eventoid: {
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
    enum: ['Presentación', 'Cata', 'Festival', 'Competencia', 'Tap Take Over', 'Circulo de Estudio']
  },
  descripcion: {
    type: String,
    required: false
  },
  organizador: {
    type: String,
    required: false
  },
  direccion: {
    pais: String,
    estado: String,
    municipio: String,
    direccion: String,
    cp: String,
    ubicacion: {
      type: { type: String },
      coordinates: []
    },
  },
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
  ],
  cervecerias: [{ type: Schema.Types.ObjectId, ref: 'Cerveceria' }],
  horario: [
    {
      dia: {
        type: String,
        required: false,
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
      },
      apertura: Date,
      cierre: Date
    }
  ]
});

eventoSchema.index({ ubicacion: '2dsphere' });

eventoSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to eventoSchema
eventoSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
eventoSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {

  }
});

let Evento = mongoose.model('Evento', eventoSchema);

module.exports = Evento;
