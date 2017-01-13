var request = require('request');
var config = require('./config');
var express = require('express');
var router = express.Router();
var searchfunctions = require('./functions')
var mongojs = require('mongojs');
// var db = mongojs('mongodb://admin:admin@ds063406.mlab.com:63406/hashcollect');
var db = mongojs('mongodb://localhost:27017/hashcollect');

functions = {

    //스케쥴링위해잠시 테스트 11/05
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
     console.log(req.body.searchquery)

     //임시 dummy 테이블 
      db.dummy.find({"id": req.body.name , "searchquery" : req.body.searchquery}, (err, collect) => {
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
        
    },  
    scheduleHash: () => {
    var today = new Date();
    var dd = ('0'+ today.getDate()).slice(-2);
    //2017-01-06 날짜 관련 
    var mm = ('0'+ today.getMonth()+1).slice(-2);
    var yyyy = today.getFullYear();
    today = yyyy+'-'+mm+'-'+dd;

    db.collect.find({tocal:{$gte:today}}, (err, collect) => {
            if (err) {

              return res.send(err);
            }
            
            
              for(var i =0; i<collect.length; i++)
              {
                  config.schedule.hashtag[i] = collect[i].hashtag
                  config.schedule.name[i] = collect[i].name
              }
            console.log(config.schedule)
            
   
    });
  },
   deleteAll : () => {
   var today = new Date();
    var dd = ('0'+ today.getDate()).slice(-2);
     //2017-01-06 날짜 관련 
    var mm = ('0'+ today.getMonth()+1).slice(-2);
    var yyyy = today.getFullYear();
    today = yyyy+'-'+mm+'-'+dd;
    // db.collect.find({tocal:{$lt:today}}, (err, collect) => {
    //         if (err) {

    //           return res.send(err);
    //         }
    //           for(var i =0; i<collect.length; i++)
    //           {
    //              db.dummy.remove({searchquery:collect[i].hashtag,id:collect[i].name}, (err) => {      
    //              });
    //           }  
    //       });
    console.log(today)
        db.dummy.remove({}, (err) => {      
                });
       db.collect.remove({tocal:{$lt:today}}, (err, collect) => {      
        });
  
      console.log('삭제완료')
    },  
}


module.exports = functions;