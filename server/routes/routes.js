var bodyParser = require('../../node_modules/body-parser/index.js');
var apptController = require('../controllers/apptCtrl.js');
var userController = require('../controllers/userCtrl.js');


module.exports = function(app, express){

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(express.static(__dirname + '/../../client'));


  app.post('/denyAppt', bodyParser.json(), apptController.denyAppt);
  app.post('/acceptAppt', bodyParser.json(), apptController.acceptAppt);
  app.post('/sendJoinRequest', bodyParser.json(), apptController.sendJoinRequest);
  app.post('/getAppointments', bodyParser.json(), apptController.getAppointments);
  app.post('/createAppointment', bodyParser.json(), apptController.createAppointment);
  app.post('/filterAppointments', bodyParser.json(), apptController.filterAppointments);
  app.get('/fetchAppointmentsDashboardData', bodyParser.json(), apptController.fetchAppointmentsDashboardData);

  app.post('/signup', bodyParser.json(), userController.signup);
  app.post('/signin', bodyParser.json(), userController.postSignin);
  app.get('/signin', bodyParser.json(), userController.getSignin);
};
