/*jslint node: true */
'use strict';

let restify = require('restify');
let path = require('path');
//let cors = require('cors');

let config = require(path.join(__dirname, '/config/config'));
let log = require(path.join(__dirname, '/log'));
let models = require(path.join(__dirname, '/app/models/'));
let routes = require(path.join(__dirname, '/app/routes/'));
let dbConnection = require(path.join(__dirname, '/db-connection'));

dbConnection();

let server = restify.createServer({
  name: config.app.name,
  log: log
});

const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
    'origins': ['*'],
    'allowHeaders': ['Origin', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'X-Response-Time', 'X-PINGOTHER', 'X-CSRF-Token', 'Authorization'], 
    'exposeHeaders': ['Origin', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Content-Type', 'Date', 'X-Api-Version', 'X-Response-Time', 'X-PINGOTHER', 'X-CSRF-Token', 'Authorization'], 
    'methods': ['GET','PUT','DELETE','POST','OPTIONS']
});
server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.gzipResponse());
server.pre(restify.pre.sanitizePath());
server.pre(
  function crossOrigin(req, res, next) {
    //res.header('Access-Control-Allow-Origin', '*');
    
    res.header('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Requested-With, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization');
    res.header('Access-Control-Request-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Requested-With, X-Response-Time, X-PINGOTHER, X-CSRF-Token, Authorization');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
    res.header('Access-Control-Max-Age', '1000');
    return next();
  }
);

/*jslint unparam:true*/
// Default error handler. Personalize according to your needs.
server.on('uncaughtException', function (req, res, route, err) {
  log.info('******* Begin Error *******\n%s\n*******\n%s\n******* End Error *******', route, err.stack);
  if (!res.headersSent) {
    return res.send(500, {ok: false});
  }
  res.write('\n');
  res.end();
});

// server.on('after', restify.plugins.auditLogger(
//   {
//     log: log
//   })
// );

models();
routes(server);

server.get('/', function (req, res, next) {
  res.send(config.app.name);
  return next();
});

server.listen(config.app.port, function () {
  log.info('Application %s listening at %s:%s', config.app.name, config.app.address, config.app.port);
});
