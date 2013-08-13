var auth = function(req, res, next) {
  // TODO AUTHENTICATE HERE
  next();
};

var owner = function(req, res, next) {
  // TODO CHECK FOR OWNER HERE
  next();
}

module.exports = {
  options: {

    before: { // Middleware support
      show: auth,
      update: [auth, owner],
      destroy: [auth, owner]
    }
  },


  index: function(req, res) {
    //now through the magic of express-mongoose, we can just send this right through
    //without waiting for a callback
    //res.send({cats: Cat.find(), dogs: Dog.find()});
    //For simplicity of this example, just fake it
    res.send({cats: ['tom', 'garfield', 'thunder']});
  },

  show: function(req, res) {
    res.send("TODO");
  },

  //TODO
  create: function(req, res) {
    res.send("TODO");
  },

  update: function(req, res) {
    res.send("TODO");
  },


  destroy: function(req, res) {
    res.send("TODO");
  }

};
