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
     console.log(req.body)
     console.log(req.body.name)
     console.log(req.body.hashtag)

     //임시 dummy 테이블 
      db.dummy.find({"name": req.body.name , "hashtag" : req.body.hashtag}, (err, collect) => {
        if (err) {
          return res.send(err);
        }
        res.json(collect);
    
      });
  },

    hashtagins: (req,res) => {

    var req = req.body;
    console.log(req)

     db.dummy.save(req, function(err, result){
                if(err){
                    res.send(err); 
                    console.log(err);
                } else {
                    res.json(result);
                    console.log(result);
                }
            });
        
    },
    Userinsert : (req,res) => {
    var req = req.body;
    console.log(req)
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