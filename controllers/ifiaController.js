var request = require("request");
const https = require("https");
var express = require("express");
const path = require("path");
var router = express.Router();
// var DL_API_KEY = process.env.DL_API_KEY;
// console.log(DL_API_KEY);

var question = require("../models/question");
var user = require("../models/user");
const { text } = require("body-parser");
const { createBrotliCompress } = require("zlib");

// Create all our routes and set up logic within those routes where required.

router.get("/api/users/", function (req, res) {
  user.read1(req.query, function (data) {
    res.send(data);
  });
});

//create a question
router.post("/api/questions", function (req, res) {
  var cols = Object.entries(req.body).map((e) => e[0]);
  var vals = Object.entries(req.body).map((e) => e[1]);
  question
    .create(cols, vals)
    .then((results) => {
      res.json({ id: results.insertId });
    })
    .catch((err) => {
      console.log(err);
    });
});
//create user
router.post("/api/users", function (req, res) {
  var cols = Object.entries(req.body).map((e) => e[0]);
  var vals = Object.entries(req.body).map((e) => e[1]);
  user
    .create(cols, vals)
    .then((results) => {
      res.json({ id: results.insertId });
    })
    .catch((err) => {
      console.log(err);
    });
});

//change question
router.put("/api/questions/:id", function (req, res) {
  var condition = "id = " + req.params.id;
  question
    // info to be updated..
    .update(
      {
        ex_name: req.body.exName,
      },
      condition
    )
    .then((result) => {
      if (result.changedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        // console.log("vessel email address updated ");
        res.status(200).end();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//delete question
router.delete("/api/questions/:id", function (req, res) {
  var condition = "id = " + req.params.id;
  question
    .delete(condition)
    .then((result) => {
      if (result.affectedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

//delete user
router.delete("/api/users/:id", function (req, res) {
  var condition = "id = " + req.params.id;
  user
    .delete(condition)
    .then((result) => {
      if (result.affectedRows == 0) {
        // If no rows were changed, then the ID must not exist, so 404
        return res.status(404).end();
      } else {
        res.status(200).end();
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/", function (req, res) {
  res.render("index", hbsObject8);
});

router.get("/api/questions01/", function (req, res) {
  // console.log("one question by id req.query:");
  // console.log(req.query);

  question.read4(req.query, function (data) {
    if (data === undefined) {
      console.log("no question with this id found in the db!");
    } else {
      res.send(data); // Cannot set headers after they are sent to the client
    }
  });
});

// Export routes for server.js to use.
module.exports = router;
