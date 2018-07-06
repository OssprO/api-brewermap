'use strict'

let path = require('path');
let service = require(path.join(__dirname, '../services'));

module.exports = function isAuth (req, res, next) {
	if (!req.headers.authorization) {
		return res.send(403, { message: 'Not Authorized'});
	}

	let token = req.headers.authorization.split(' ')[1];

	service.decodeToken(token)
		.then(function(response){
			req.usuario = response;
			next();
		})
		.catch(function(reject){
			return res.send(reject.status, { message: reject.message});
		});

};