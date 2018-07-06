'use strict'

let jwt = require('jwt-simple');
let moment = require('moment');

let path = require('path');
let config = require(path.join(__dirname, '../../config/config'));

function createToken( usuario ) {
	//console.log('Create Token');
	let payload = {
		sub: usuario.usuarioid,
		iat: moment().unix(), 
		exp: moment().add(1, 'year').unix()
	};

	return jwt.encode( payload, config.app.secret );
}

function decodeToken (token) {
	//console.log(token);
	let decoded = new Promise(function(resolve, reject){
		try {
			let payload = jwt.decode( token, config.app.secret );
			if (payload.exp <= moment().unix() ) {
				reject({
					status: 401,
					message: 'Token Expired'
				});
			}

			resolve(payload.sub);

		} catch (err) {
			reject({
				status: 500,
				message: 'Invalid Token'
			});
		}
	});

	return decoded;
}

//eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzIiwiaWF0IjoxNTE2NjQ0OTA1LCJleHAiOjE1NDgxODA5MDV9.yZqJO6BWFMuyQd9hhhcMxKfwi48O3ZUNLGbUl5oj3JQ

module.exports = {
	createToken,
	decodeToken
};