
//Routes
//=======================================
module.exports = function(app){

    app.get("/", function(req, res) {
        res.render("index")
      });

      app.get("/allEvents", function(req, res){
          res.render("events")
      });

      app.get("/create", function(req, res){
        res.render("create")
    });

      app.get("/logout", function(req, res){
          res.render("login")
      });


}

