const db = require('../models');
const passport = require('passport');

module.exports = function (app) {
  function authenticationMiddleware(req, res, next) {
    // console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport.user)}`);
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

  app.get("/", authenticationMiddleware, function (req, res) {
    // find the logged in user's data including all group data
    db.People.findOne(
      {
        where: {
          id: req.session.passport.user,
        },
        include: [db.Group],
      },
    ).then(function (loggedInPerson) {
      // console.log(`group to output: ${loggedInPerson.Groups[0].dataValues.name}`);

      // array to hold all of the user's group data
      let usersGroupDataArray = loggedInPerson.Groups;

      let groupName = [];
      // push the user's group names to the groupName array
      usersGroupDataArray.forEach((element) => {
        groupName.push(element.dataValues.name);
      });

      let usersGroupIds = [];
      // push the user's group IDs to the usersGroupIds array
      usersGroupDataArray.forEach((element) => {
        usersGroupIds.push(element.dataValues.id);
      });
      console.log(usersGroupIds);

      // pull user specific events data from the db
      db.Events.findAll(
        {
          where: {
            GroupId: usersGroupIds,
          },
          include: [db.Group],
          order: [["date"]]
        }).then(function (dbEvents) {
        // console.log(dbEvents);
        if (usersGroupDataArray.length > 0) {
          res.render("index", 
            {
              groupName: groupName,
              dbEvents: dbEvents,
            },
          );
        } else {
          res.render("index", { dbEvents: dbEvents, message: "You aren't a member of a group yet! Create a group below." });
        }
      });
    });
  });

  app.get("/createEvent", authenticationMiddleware, function (req, res) {
    res.render("createevent")
  });

  app.get("/manageGroup/:id", function (req, res) {
    db.Group.findAll({
      include: [{
        model: db.Events,
        model: db.People,
        through: { attributes: [] }
      }]
    }).then(function (dbGroup) {
      var test = "hi"
      var indexGroupId = 0;
      db.People.findAll({
        include: [{
          model: db.Group,
          through: { attributes: [] }
        }]
      }).then(function (dbPeople) {
        console.log(test);
        res.render("managegroup", { groupName: dbGroup[0], members: dbPeople })
      })
    });
  });

  app.get("/createGroup", authenticationMiddleware, function (req, res) {
    db.People.findAll({
      include: [{
        model: db.Group,
        through: { attributes: [] }
      }]
    }).then(function (dbPeople) {
      res.render("creategroup", { members: dbPeople })
    });
  });

  app.get("/login", function (req, res) {
    res.render("login")
  });

  app.post(
    '/login',
    passport.authenticate('local-signin', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: true,
      successFlash: 'Welcome',
    }),
  );

  app.get("/signup", function (req, res) {
    res.render("signup")
  });

  app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
      res.redirect('/login');
    });
  });

  app.get(
    '/logout',
    function (req, res) {
      req.logout();
      res.redirect('/login');
    },
  );
};
