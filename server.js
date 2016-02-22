var express     = require('express');
var mongojs     = require('mongojs');
var bodyParser     = require('body-parser');
var db     = mongojs('brewfortwo', ['users']);

// var util = require('./utility.js');
var partial = require('express-partials');

var app = express();

// configure our server with all the middleware and and routing
// require('./config/middleware.js')(app, express);

// Serve static index.html from server.
app.use(express.static(__dirname+'/'));
app.use(bodyParser.json());

app.get('/bulletin', function(req,res){
  // TODO: Query for latitude and logitude.
  db.appointments.find({}, function(err, doc){
    res.json(doc);
  });
});

app.post('/bulletin', function(req, res){
  // TODO: Get submitter's ID. Place it in appointments table.
  db.appointments.insert(req.body, function(err, doc){
    res.send('/bulletin');
  });
});

// TODO: Setup user appointment update requests.
// app.put('/bulletin')

app.post('/signup', function(req,res){
  db.users.insert(req.body, function(err, doc){
    if(err){
      console.log(err);
    }
  });

  res.send('/signin');
});

// login route ( creates session upon login)
// TODO: Setup login requests.
app.get('/signin', function(req, res){
  res.render('/signin');
});

app.post('/signin', function(req, res){
  console.log('inside post sign in at server.js');
  var email = req.body.email;
  var password = req.body.password;
  var found = false;
  db.users.find({email:email}, function(err, exists){
    console.log(exists);
    if(!exists){
      console.log('email does not exist');
    }

    else {
      console.log('email exists!!!!!');
      res.send('/home');
    }
  });
});

// sets up server on the process environment port or port 8000
app.listen(process.env.PORT || 8000);
console.log('server running on port 8000');
