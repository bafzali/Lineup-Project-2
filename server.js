const express = require('express');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const MomentHandler = require('handlebars.moment');

MomentHandler.registerHelpers(Handlebars);
Handlebars.registerHelper('date', require('helper-date'));
require('dotenv').config();

const moment = require('moment');

// authentication packages
const passport = require('passport');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./models');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(require('cookie-parser')());

app.use(express.static('public'));

// For Passport and Passport sessions
app.use(session({
  secret: 'fsd889sdneroij$#^r9j2#iop9e',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true },
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistant login sessions

//Set Handlebars
const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs({
  partialsDir: ['views/partials/'],
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

// Flash
const flash = require('connect-flash');

app.use(flash());

// Routes
// load passport strategies
require('./config/passport/passport.js');

require('./controller/html-routes.js')(app);
require('./controller/events-api-routes.js')(app);
require('./controller/groups-api-routes.js')(app);
require('./controller/people-api-routes.js')(app);

db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log('listening on PORT' + PORT);
  });
});
