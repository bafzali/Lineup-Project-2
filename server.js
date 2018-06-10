const express = require("express")
const bodyParser = require("body-parser")
var Handlebars = require('handlebars');
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);
// var HandlebarsIntl = require('handlebars-intl');
Handlebars.registerHelper('date', require('helper-date'));
// HandlebarsIntl.registerWith(handlebars);
// const env = require('dotenv').load();
require('dotenv').config();

var moment = require('moment');

// authentication packages
const passport = require('passport');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 8080;

const db = require("./models");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(require('cookie-parser')());

app.use(express.static("public"));

//Set Handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// For Passport and Passport sessions
app.use(session({
  secret: 'fsd889sdneroij$#^r9j2#iop9e',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true },
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistant login sessions

// Flash
const flash = require('connect-flash');
app.use(flash());

app.use(flash());

// Routes
// load passport strategies
require('./config/passport/passport.js');

require("./controller/html-routes.js")(app);
require("./controller/events-api-routes.js")(app);
require("./controller/groups-api-routes.js")(app);
require("./controller/people-api-routes.js")(app);

db.sequelize.sync({ force: false }).then(function () {
  db.People.find({ where: { userName: 'test' } }).then(function (user) {
    if (!user) {
      db.People.create(
        {
          firstName: 'Test',
          lastName: 'User',
          userName: 'test',
          password: 'test',
          email: 'test@admin.com',
          phoneNumber: '5555555555',
        },
        {
          include: [{
            model: db.Group,
            through: { attributes: [] },
          }],
        },
      );
    }
  }).catch(function(err) {
    console.log(err);
  });
  db.Group.find({ where: { name: 'test group' } }).then(function (group) {
    if (!group) {
      db.Group.create(
        {
          name: 'test group',
          peopleIds: ['1'],
        },
      );
    }
  });
  db.Events.find({ where: { name: 'Test Event' } }).then(function (event) {
    if (!event) {
      db.Events.create(
        {
          name: 'Test Event',
          organizer: '1',
          location_address: '1234 Test Lane',
          city: 'Springfield',
          state: 'New Mexico',
          date: '2018-06-09 00:00:00',
          time: '20:00:00',
          description: 'A picnic at a local park',
          GroupId: 1,
        },
      );
    }
  });
  // console.log("goodbye")
  app.listen(PORT, function () {
    console.log("listening on PORT" + PORT);
  });
});
