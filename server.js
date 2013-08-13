var express           = require('express'),
    mongoose          = require('mongoose'),
    expMongoose       = require('express-mongoose'),
    expResource       = require('express-resource-new'),
    app               = express();


app.configure(function(){
  app.set('port', 3000);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
  // This tells express-mongoose-new where to look for resources
  app.set('controllers', __dirname + '/controllers');
});



// express-resource-new doing its magic here
// see controllers/pets.js
app.resource('pets');


app.listen(app.get('port'), function(){
  console.log("Node.js Hosting Test listening on port " + app.get('port') + ', running in ' + app.settings.env + " mode, Node version is: " + process.version);
  //show all the routes that express-resource-new creates for you.
  console.log(app.routes);
});
