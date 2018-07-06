'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let uniqueValidator = require('mongoose-unique-validator');
let bcrypt = require('bcrypt-nodejs');

let usuarioSchema = new Schema({
  usuarioid: {
    type: String, 
    required: true, 
    index: true, 
    unique: true
  },
  nombre: {
    type: String, 
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  avatar: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

usuarioSchema.pre('save', function (next) {
  let usuario = this;
  if (!usuario.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function (err, salt) {
    if ( err ) { return next(); }
    bcrypt.hash(usuario.password, salt, null, function ( err, hash ) {
      if ( err ) { return next(err); }
      usuario.password = hash;
      next();
    });
  });
});

usuarioSchema.set('timestamps', true); // include timestamps in docs

// apply the mongoose unique validator plugin to proveedorSchema
usuarioSchema.plugin(uniqueValidator);

// use mongoose currency to transform price
usuarioSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
  }
});

let Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
