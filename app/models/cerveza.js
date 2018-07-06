'use strict';

let mongoose = require('mongoose');

require('mongoose-types').loadTypes(mongoose);
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let cervezaSchema = new Schema({
  cervezaid: {
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
  descripcion: {
    type: String,
    required: false
  },
  disponibilidad: {
    type: Boolean,
    required: false
  },
  estilo: String,
  abv: String,
  ibu: Number,
  srm: Number,
  cervecerias: [{ type: Schema.Types.ObjectId, ref: 'Cerveceria' }]
});

cervezaSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to cervezaSchema
cervezaSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
cervezaSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
  }
});

let Cerveza = mongoose.model('Cerveza', cervezaSchema);

module.exports = Cerveza;
