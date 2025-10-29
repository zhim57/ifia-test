// Import MySQL connection.
var connection = require("../config/connection.js");
var connectionQuery = require('util').promisify(connection.query.bind(connection));

// Helper to check if database is connected
function isDatabaseConnected() {
  var err = connection.getConnectionError();
  if (err) {
    console.error("\n⚠️  Cannot execute query: Database not connected");
    console.error("Please set up MySQL database first (see error message above)\n");
    return false;
  }
  return true;
}

// Helper function for SQL syntax.
// Let's say we want to pass 3 values into the mySQL query.
// In order to write the query, we need 3 question marks.
// The above helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";
function printQuestionMarks(num) {
  var arr = [];

  for (var i = 0; i < num; i++) {
    arr.push("?");
  }

  return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
  var arr = [];

  // loop through the keys and push the key/value as a string int arr
  for (var key in ob) {
    var value = ob[key];
    // check to skip hidden properties
    if (Object.hasOwnProperty.call(ob, key)) {
      // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
      //&& value.indexOf(" ") >= 0
      if (typeof value === "string" ) {
        value = '"' + value + '"';
      }
      // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
      // e.g. {sleepy: true} => ["sleepy=true"]
      arr.push(key+ "=" + value);
    }
  }

  // translate array of strings to a single comma-separated string
  return arr.toString();
}

// Object for all our SQL statement functions.
var orm = {
  read: function (tableInput, cb) {
    if (!isDatabaseConnected()) {
      if (cb) cb([]);
      return Promise.resolve([]);
    }
    var queryString = "SELECT * FROM ?? ";
    // console.log("queryString for orm.read : " + queryString + tableInput);
    return connectionQuery(queryString, [tableInput], function (err, result) {
      if (err) {
        console.error("Database query error:", err.message);
        if (cb) cb([]);
        return;
      }
      // console.log("result received");
      cb(result);
    });
  },

  read4: function (table, cb) {
    if (!isDatabaseConnected()) {
      if (cb) cb([]);
      return Promise.resolve([]);
    }
    var queryString = "SELECT * FROM " +table.table +"  WHERE "+ table.condition;

    // console.log("queryString for orm.read4 : " +queryString);
    return connectionQuery(queryString, function (err, result) {
      if (err) {
        console.error("Database query error:", err.message);
        if (cb) cb([]);
        return;
      }
      cb(result);
    });

  },


  
  create: function (table, cols, vals, cb) {
    if (!isDatabaseConnected()) {
      return Promise.resolve({ affectedRows: 0 });
    }
    var queryString = "INSERT INTO ??";

    queryString += " (";
    queryString += cols.toString();
    queryString += ") ";
    queryString += "VALUES (";
    queryString += printQuestionMarks(vals.length);
    queryString += ") ";

    return connectionQuery(queryString, [table, ...vals]).catch(err => {
      console.error("Database insert error:", err.message);
      return { affectedRows: 0 };
    });
  },

  // An example of objColVals would be {name: panther, sleepy: true}
  update: function (table, objColVals, condition, cb) {
    if (!isDatabaseConnected()) {
      return Promise.resolve({ affectedRows: 0 });
    }
    var queryString = "UPDATE " + table;

    queryString += " SET ";
    queryString += objToSql(objColVals);
    queryString += " WHERE ";
    queryString += condition;

    return connectionQuery(queryString).catch(err => {
      console.error("Database update error:", err.message);
      return { affectedRows: 0 };
    });
  },
  delete: function (table, condition, cb) {
    if (!isDatabaseConnected()) {
      return Promise.resolve({ affectedRows: 0 });
    }
    var queryString = "DELETE FROM " + table;
    queryString += " WHERE ";
    queryString += condition;

    return connectionQuery(queryString).catch(err => {
      console.error("Database delete error:", err.message);
      return { affectedRows: 0 };
    });
  }

};
// Export the orm object for the model (burger.js).
module.exports = orm;
