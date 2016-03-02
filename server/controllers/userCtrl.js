

module.exports = {

  // posts the user's info in the users table
  signup: function(req, res){
    db.users.insert(req.body, function(err, doc){
      if(err){
        console.log(err);
      }
    });
    res.send('/signin');
  },

  // renders sign in
  getSignin: function(req, res){
    res.render('/signin');
  },

  // authenticates user's email in the database and assigns token if exists
  // access to "appointments" page is handled in the controller
  postSignin: function(req, res){
    var email = req.body.email;
    var password = req.body.password;

    db.users.find({email:email, password: password}, function(err, exists){
      if(!exists.length){
        res.send(false);
      }

      else {
        var payload = { email: email, password: password};
        var secret = 'brewed';

        // encode token
        var token = jwt.encode(payload, secret);

        res.send(token);
      }
    });
  }
};
