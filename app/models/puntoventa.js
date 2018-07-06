'use strict';

let mongoose = require('mongoose');

require('mongoose-types').loadTypes(mongoose);
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let puntoVentaSchema = new Schema({
  puntoventaid: {
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
    enum: ['Boutique', 'Taberna', 'Centro de Consumo', 'Bar', 'Restaurant']
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
  cervezas: [{ type: Schema.Types.ObjectId, ref: 'Cerveza' }],
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
  ],
  fundacion: {
    type: Date
  },
  descripcion: {
    type: String,
    required: false
  }
});

puntoVentaSchema.index({ ubicacion: '2dsphere' });

puntoVentaSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to puntoVentaSchema
puntoVentaSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
puntoVentaSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {

  }
});

let PuntoVenta = mongoose.model('PuntoVenta', puntoVentaSchema);

module.exports = PuntoVenta;
