var bodyParser = require('../../node_modules/body-parser/index.js');
var apptController = require('../controllers/apptCtrl.js');
var userController = require('../controllers/userCtrl.js');


module.exports = function(app, express){

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(express.static(__dirname + '/../../client'));


  app.post('/denyAppt', bodyParser, apptController.denyAppt);
  app.post('/acceptAppt', bodyParser, apptController.acceptAppt);
  app.post('/sendJoinRequest', bodyParser, apptController.sendJoinRequest);
  app.post('/getAppointments', bodyParser, apptController.getAppointments);
  app.post('/createAppointment', bodyParser, apptController.createAppointment);
  app.post('/filterAppointments', bodyParser, apptController.filterAppointments);
  app.get('/fetchAppointmentsDashboardData', bodyParser, apptController.fetchAppointmentsDashboardData);

  app.post('/signup', bodyParser, userController.signup);
  app.post('/signin', bodyParser, userController.postSignin);
  app.get('/signin', bodyParser, userController.getSignin);
};
