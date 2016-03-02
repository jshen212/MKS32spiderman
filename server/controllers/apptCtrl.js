module.exports = {
  createAppointment: function(req, res) {
    var token = req.body.host_id;
    var secret = "brewed";
    var decoded = jwt.decode(token, secret);

    // adds the below properties onto the request to post to appointments table
    db.users.find(decoded, function(err, appt){
      req.body.firstName = appt[0].first;
      req.body.lastName = appt[0].last;
      req.body.email = decoded.email;
      req.body.profilePicture = appt[0].profilePicture;
      req.body.bio = appt[0].bio;
      db.appointments.insert(req.body, function(err, doc){
        res.send(true);
      });
    });
  },

  // finds appointments for a specific store by shopId
  getAppointments: function(req, res) {
    // shopId is in the request
    var shopId = {
      id: req.body.id
    };

    db.appointments.find(shopId, function(err, appts){
      res.send(appts);
    });
  },

  filterAppointments: function(req, res){
    var currentUserId = req.body.token;
    var secret = "brewed";
    var email = jwt.decode(currentUserId, secret).email;

    // stores appointments in an object to send to controller
    var filteredAppointments = {
      confirmed: [],
      hosting: [],
      requested: []
    };


    db.appointments.find({}, function(err, doc){
      for( var i = 0; i < doc.length; i++ ){
        // if user's email is in the appointments' "email" property, user is the host
        // case: user is a host or a guest and appointment status is scheduled = confirmed appointment
        if ( (doc[i].email === email || _.contains(doc[i].guests, email) === true ) && doc[i].appointmentStatus === 'scheduled' || doc[i].acceptedGuest === email){
          filteredAppointments.confirmed.push(doc[i]);
        }

        // case: user is the host
        if(doc[i].email === email && doc[i].guests.length >= 0 && doc[i].appointmentStatus !== 'scheduled'){
          filteredAppointments.hosting.push(doc[i]);
        }

        // case: user is not the host, and is a guest, and appointment status is pending = requested appointment
        if(doc[i].email !== email && _.contains(doc[i].guests, email) === true && doc[i].appointmentStatus === 'pending'){
          filteredAppointments.requested.push(doc[i]);
        }
      }

      res.send(filteredAppointments);
    });
  },

  // fetches all appointments and sends back to the controller
  fetchAppointmentsDashboardData: function(req, res){
    db.appointments.find({}, function(err, appts){
      res.send(appts);
    });
  },

  // accepts a guest and adds the guest's email onto the appointment
  acceptAppt: function(req, res){
    db.appointments.update({time: req.body.time}, { $set: { appointmentStatus: 'scheduled', guests: [], acceptedGuest: req.body.email }}, function(err, appt){
      res.send(true);
    });
  },

  // denies a guest's request, and removes guest's email from the guests array
  denyAppt: function( req, res){
    db.appointments.update({time: req.body.time}, {appointmentStatus: 'pending'}, { $pullAll: { guests: [req.body.email] } }, function(err, appt){
      res.send(true);
    });
  },

  // creates a request to join an appointment (changes appointment status to "pending" and puts the current user in the appointment's "guest" array)
  sendJoinRequest: function( req, res){
    var currentUserId = req.body.token;
    var secret = "brewed";
    var email = jwt.decode(currentUserId, secret).email;
    var appointment = req.body.appointment;
    var guestsArr = appointment.guests;

    // if no guests in the guests array, add current user's email into the guest array
    if(!guestsArr.length){
      db.appointments.update({time: appointment.time}, { $set: { appointmentStatus: 'pending' }, $push: { guests: email } }, function(){
        res.send(false);
      });
    }

    // if guests array has items, loop throug hand check if user's email is in there
    else {
      for(var i = 0; i < guestsArr.length; i++){
        // if user's email is in the guest array, respond with true
        if(guestsArr[i] === email){
          res.send(true);
        }
      }

      // if user's email is not in the guest array, respond with false
      db.appointments.update({time: appointment.time}, { $set: { appointmentStatus: 'pending' }, $push: { guests: email } });
      res.send(false);
    }
  }
};
