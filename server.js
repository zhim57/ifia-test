const dotenv = require('dotenv');
var express = require("express");
const path = require("path");
const session = require("express-session");

var PORT = process.env.PORT || 8082;
dotenv.config({path: './.env'})

var app = express();

app.set('views', path.join(__dirname,"views"));

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static(__dirname + '/public'));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware must be before routes
app.use(session({
  secret: "nodejs",
  resave:true,
  saveUninitialized:true
}));

// Import routes and give the server access to them.
var routes = require("./controllers/ifiaController.js");

app.use(routes);


// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
