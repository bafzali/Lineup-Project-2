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

db.sequelize.sync({ force: false }).then(function() {
    // console.log("goodbye")
    app.listen(PORT, function() {
        console.log("listening on PORT" + PORT);
    })
});
