var express     = require('express');
var mongojs     = require('mongojs');
var bodyParser     = require('body-parser');
var db     = mongojs('brewfortwo', ['users', 'appointments']);
var app = express();

// configure our server with all the middleware and and routing
require('./config/middleware.js')(app, express);

app.get('/bulletin', function(req,res){
  // TODO: Query for latitude and logitude.
  db.appointments.find({}, function(err, doc){
    res.json(doc);
  });
});

app.post('/bulletin', function(req, res){
  // TODO: Get submitter's ID. Place it in appointments table.
  db.appointments.insert(req.body, function(err, doc){
    res.redirect('/bulletin');
  });
});

// TODO: Setup user appointment update requests.
// app.put('/bulletin')

app.post('/signup', function(req,res){
  db.users.insert(req.body, function(err, doc){
    res.redirect('/login')
  })
})

// TODO: Setup login requests.
// app.get('/login')

app.listen(8000);
console.log('server running on port 8000');
