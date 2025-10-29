// Set up MySQL connection.
var mysql = require("mysql");

var connection;
var connectionError = null;

if (typeof process.env.JAWSDB_URL !== "undefined") {
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Password1",
    database: "ifia_db"
  });
}

// Make connection.
connection.connect(function(err) {
  if (err) {
    connectionError = err;
    console.error("\n===========================================");
    console.error("❌ DATABASE CONNECTION FAILED");
    console.error("===========================================");
    console.error("Error: " + err.code);
    console.error("\nTo fix this, you need to:");
    console.error("1. Install MySQL: https://dev.mysql.com/downloads/mysql/");
    console.error("2. Start MySQL server");
    console.error("3. Create database: CREATE DATABASE ifia_db;");
    console.error("4. Import schema: mysql -u root -p ifia_db < db/schema.sql");
    console.error("5. Import seeds: mysql -u root -p ifia_db < db/seeds.sql");
    console.error("\nOr set JAWSDB_URL environment variable for cloud database");
    console.error("===========================================\n");

    // Don't throw here, let the app continue but queries will fail gracefully
    return;
  }
  console.log("✓ Database connected as id " + connection.threadId);
});

// Add error handler for connection errors after initial connect
connection.on('error', function(err) {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed.');
  }
  if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('Database has too many connections.');
  }
  if (err.code === 'ECONNREFUSED') {
    console.error('Database connection was refused.');
  }
});

// Export connection for our ORM to use.
module.exports = connection;
module.exports.getConnectionError = function() {
  return connectionError;
};
