var express     = require('express');
var mongojs     = require('mongojs');
var bodyParser     = require('body-parser');
var partial = require('express-partials');
var db     = mongojs('brewfortwo', ['users']);
var jwt = require('jwt-simple');

// initiates express
var app = express();

// serves static index.html from server
app.use(express.static(__dirname+'/'));
app.use(bodyParser.json());

// handles get requests to bulletin path
// app.get('/appointments', function(req,res){
//   // TODO: Query for latitude and logitude.
//   db.appointments.find({}, function(err, doc){
//     res.json(doc);
//   });
// });


// handles post requests to appointments path
app.post('/appointments', function(req, res){
  // TODO: Get submitter's ID. Place it in appointments table.
  // db.appointments.insert(req.body, function(err, doc){
  //   res.send('/bulletin');
  // });

  console.log('line31++ server.js', req.body);
  if(req.body){
    res.send(true);
  } else {
    res.send(false);
  }


});

// TODO: Setup user appointment update requests.
// app.put('/bulletin')

// handles post requests to signup path
app.post('/signup', function(req,res){
  db.users.insert(req.body, function(err, doc){
    if(err){
      console.log(err);
    }
  });

  res.send('/signin');
});

// TODO: Setup login requests.
app.get('/signin', function(req, res){
  res.render('/signin');
});

app.post('/signin', function(req, res){
  var email = req.body.email;
  var password = req.body.password;
  var found = false;
  db.users.find({email:email}, function(err, exists){

    if(!exists.length){
      res.send(false);
    }

    else {
      console.log('line71++ server.js, email exists!!!!!');
      // setting up token payload and secret
      var payload = { email: email };
      var secret = 'brewed';

      // encode token
      var token = jwt.encode(payload, secret);

      console.log('++line79, server.js TOKEN: ', token);

      // decode token
      var decoded = jwt.decode(token, secret);

      res.send(token);
    }
  });
});

// sets up server on the process environment port or port 8000
app.listen(process.env.PORT || 8000);
console.log('server running on port 8000');
