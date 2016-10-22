var request = require('request');
var config = require('./config');
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds063406.mlab.com:63406/hashcollect');



functions = {
 
   getAllCollect: (req, res) => {
    db.collect.find({}, (err, collect) => {
      if (err) {
        // Send the error to the client if there is one
        return res.send(err);
      }
      // Send todos in JSON format
      res.json(collect);
    });
  }
}


module.exports = functions;