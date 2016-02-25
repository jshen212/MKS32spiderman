var express     = require('express');
var mongojs     = require('mongojs');
var bodyParser     = require('body-parser');
var partial = require('express-partials');
var db     = mongojs('brewfortwo', ['users', 'appointments']);
var jwt = require('jwt-simple');
var _ = require('underscore');
var nodeGyp = require('node-gyp');

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
app.post('/createAppointment', function(req, res){
  // TODO: Get submitter's ID. Place it in appointments table.
  var token = req.body.host_id;
  var secret = "brewed";
  var decoded = jwt.decode(token, secret);
  req.body.email = decoded.email;
  // get user first name and last name so that we can access it for the appointment;
  var firstName;
  var lastName;
  db.users.find(decoded, function(err, appt){
    console.log('++line 37', appt);
    // return appt;
    req.body.firstName = appt[0].first;
    req.body.lastName = appt[0].last;
    db.appointments.insert(req.body, function(err, doc){
      res.send(true);
    });
  });



});

app.post('/getAppointments', function(req, res){
  var shopId = {
    id: req.body.id
  };
  // console.log(req.body);
  db.appointments.find(shopId, function(err, appts){
    // console.log('++line 44 server.js appts = ', appts);
    res.send(appts);
  });
});

app.post('/filterAppointments', function(req, res){
  var currentUserId = req.body.token;
  var secret = "brewed";
  var email = jwt.decode(currentUserId, secret).email;
  var filteredAppointments = {
    confirmed: [],
    hosting: [],
    requested: []
  };

  db.appointments.find({}, function(err, doc){
    for( var i = 0; i < doc.length; i++ ){
      if ( (doc[i].email === email || _.contains(doc[i].guests, email) === true ) && doc[i].appointmentStatus === 'scheduled'){
        filteredAppointments.confirmed.push(doc[i]);
      }

      if(doc[i].email === email){
        filteredAppointments.hosting.push(doc[i]);
      }

      if(doc[i].email !== email && _.contains(doc[i].guests, email) === true && doc[i].appointmentStatus === 'pending'){
        filteredAppointments.requested.push(doc[i]);
        console.log('we got another requested item!! BNABYYYY')
      }
    }
    console.log('++line85', filteredAppointments.requested);

    res.send(filteredAppointments);
  })
});

app.post('/sendJoinRequest', function(req, res){
  // console.log('++line62 ', req.body);
  var currentUserId = req.body.token;
  var secret = "brewed";
  var email = jwt.decode(currentUserId, secret).email;
  var appointment = req.body.appointment;
  // console.log('++line67', appointmentId);
  // var guests = [];
  // if(){
  //
  // }
  //if email is already in guests array, then don't add it. and eventually alert (you are already joined).
  // console.log('++line73', appointment);
  db.appointments.update({time: appointment.time}, { $set: { appointmentStatus: 'pending' }, $push: { guests: email } }, function(err, appt){
    console.log('++line 71: ', appt);
  });

  // console.log(email + ' ' + appointment._id);
  // db.appointments.update({_id: appointment._id}, function(err, appt){
  //   console.log('++line 70 server.js appts = ', appt);
  //   // res.send(appts);
  // });
});

app.get('/fetchAppointmentsDashboardData', function(req, res){
  db.appointments.find({}, function(err, appts){
    var allAppointments = appts;
    var filteredAppointments = {};
    //get user id
    res.send(appts);
  });

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
