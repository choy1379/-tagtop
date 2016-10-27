var request = require('request');
var config = require('./config');
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds063406.mlab.com:63406/hashcollect');

functions = {

    //임시 모든 정보 다불러오기 수정해야됨 10/27
    getAllCollect: (req, res) => {
    db.collect.find({}, (err, collect) => {
      if (err) {

        return res.send(err);
      }

      res.json(collect);
    });
  },
 
   searchid :function(req, res) {

   
    var searchid = JSON.stringify(req.body).slice(2, 10)  // name 만 자른거 
    db.collect.find({"name": searchid}, (err, collect) => {
      if (err) {
        return res.send(err);
      }
      res.json(collect);
   
    });
  },

    hashtagins: (req,res) => {

    var req = req.body;

     db.collect.save(req, function(err, result){
                if(err){
                    res.send(err); 
                    console.log(err);
                } else {
                    res.json(result);
                    console.log(result);
                }
            });
        
    }
}


module.exports = functions;