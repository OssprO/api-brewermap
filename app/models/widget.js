/*jslint node: true */
'use strict';

let mongoose = require('mongoose');
require('mongoose-currency').loadType(mongoose);
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let Currency = mongoose.Types.Currency;

let widgetSchema = new Schema({
  product_id: {
    type: String, 
    required: true, 
    index: true, 
    unique: true
  },
  name: {
    type: String, 
    required: true
  },
  color: {
    type: String, 
    required: true,
    enum: ['Red', 'Blue', 'Yellow', 'Green', 'Orange', 'Purple', 'White', 'Black']
  },
  size: {
    type: String, 
    required: true,
    enum: ['Huge', 'Big', 'Medium', 'Small', 'Tiny']
  },
  price: {
    type: Currency, 
    required: true
  },
  inventory: {
    type: Number, 
    required: false, 
    min: 0
  },
  addresses: [{
    country: {
      type: String, 
      enum: ['México', 'Canada', 'USA']
    },
    state: {
      type: String
    },
    address: {
      type: String
    },
    location: { 
      type: { type: String }, 
      coordinates: []
    }
  }]
});

widgetSchema.index({ location: '2dsphere' });

widgetSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to widgetSchema
widgetSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
widgetSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    ret.price = Number(ret.price / 100).toFixed(2);
    delete ret.__v; // hide
    delete ret._id; // hide
  }
});

let Widget = mongoose.model('Widget', widgetSchema);

module.exports = Widget;
