var express = require('express');
var mongojs = require('mongojs');
var bodyParser = require('body-parser');
var partial = require('express-partials');
var jwt = require('jwt-simple');
var _ = require('underscore');
var request = require('request');


var db = mongojs('brewfortwo', ['users', 'appointments']);
var app = express();

require('./routes/routes.js')(app,express);

app.listen(process.env.PORT || 8000);
console.log('server running on port 8000');

module.exports = app;
