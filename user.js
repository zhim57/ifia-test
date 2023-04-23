// Import the ORM to create functions that will interact with the database.
var orm = require("../config/orm");

var user = {
  read: function (req, cb) {
    orm.read(req.query.table, function (res) {
      cb(res);
    });
  },
  read1: function (req, cb) {
 
 
    orm.read1(req,  function (res) {
   
      cb(res);
    });
  },
  // The variables cols and vals are arrays.
  create: (cols, vals) => orm.create("vessels1", cols, vals),

  update: (objColVals, condition) => orm.update("vessels1", objColVals, condition, function (res) {
    cb(res);
  }),
  delete: condition => orm.delete("vessels1", condition, function (res) {
    cb(res);
  })
};

// Export the database functions for the controller (catsController.js).
module.exports = user;
