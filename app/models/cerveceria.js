'use strict';

let mongoose = require('mongoose');

require('mongoose-types').loadTypes(mongoose);
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
//let Url = mongoose.SchemaTypes.Url;
let Email = mongoose.SchemaTypes.Email;

let cerveceriaSchema = new Schema({
  cerveceriaid: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Otro', 'Macro Cervecería', 'Micro Cervecería', 'Nano Cervecería', 'Brew Pub', 'Cervecería Casera']
  },
  logo: {
    type: String,
    required: false
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
  ],
  cervezas: [],
  cervecero: {
    type: String
  },
  fundacion: {
    type: Date
  },
  descripcion: {
    type: String,
    required: false
  },
  cervezas: [{ type: Schema.Types.ObjectId, ref: 'Cerveza' }]
});

cerveceriaSchema.index({ ubicacion: '2dsphere' });

cerveceriaSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to cerveceriaSchema
cerveceriaSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
cerveceriaSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
  }
});

let Cerveceria = mongoose.model('Cerveceria', cerveceriaSchema);

module.exports = Cerveceria;
