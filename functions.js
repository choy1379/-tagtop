var request = require('request');
var config = require('./config');
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds063406.mlab.com:63406/hashcollect');


functions = {
 
    authorize: function(req, res) {
        var header = config.consumerkey + ':' +config.consumersecret;
        var encheader = new Buffer(header).toString('base64');
        var finalheader = 'Basic ' + encheader;
        
        request.post('https://api.twitter.com/oauth2/token', {form: {'grant_type': 'client_credentials'}, 
        headers: {Authorization: finalheader}}, function(error, response, body) {
            if(error)
            console.log(error);
            else {
                config.bearertoken = JSON.parse(body).access_token;
                
                res.json({success: true, data:config.bearertoken});
            }
            
        })
    },
     search: function(req, res) {
        console.log(req.body);
        
        var searchquery = req.body.query;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
         '&result_type=recent&count=100&include_entities=true&since_id=0', {headers: {Authorization: bearerheader}}, function(error, body, response) {
             if(error)
             console.log(error);
             else {
             
                res.json({success: true, data:JSON.parse(body.body)});
                
             }
         })
      
        
    },
     collectSearch: function(req, res) {
         //addinfo value save
        config.addinfo = req.body.query.addinfo;
        console.log(config.addinfo)
        var since_id = req.body.query.since_id;
  
        var searchquery = req.body.query.hashtag;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        if(since_id == 0)
        {
            request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
            '&result_type=recent&count=100&include_entities=true&since_id=' + since_id, {headers: {Authorization: bearerheader}}, function(error, body, response) {
                if(error)
                console.log();
                else {
    
                    config.sumarray = JSON.parse(body.body).statuses

                    for(var i= 0 ; i< config.sumarray.length ; i++)
                    {   
                       var dt = new Date(Date.parse(config.sumarray[i].created_at.replace(/( \+)/, ' UTC$1')))
                       var ConvertDt = '' + dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
                       config.sumarray[i].created_at = ConvertDt

                    }

                    res.json({success: true, data:JSON.parse(body.body),searchquery,addinfo:config.addinfo});                
                }
            })
        }
        else
        {
        request.get('https://api.twitter.com/1.1/search/tweets.json?q='+encsearchquery+'&count=100&include_entities=1&result_type=recent&max_id='+since_id, {headers: {Authorization: bearerheader}}, function(error, body, response) {
                if(error)
                console.log(error);
                else {

                         for(var i = 0 ; i < JSON.parse(body.body).statuses.length; i++)
                        {
                            config.sumarray[config.sumarray.length] = JSON.parse(body.body).statuses[i]
                            var dt = new Date(Date.parse(config.sumarray[config.sumarray.length-1].created_at.replace(/( \+)/, ' UTC$1')))
                            var ConvertDt = '' + dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()
                            
                            config.sumarray[config.sumarray.length-1].created_at = ConvertDt
            
                        }
                        console.log(config.sumarray[100])
                        console.log(config.sumarray[101])
                        console.log(config.sumarray.length)

                        if(config.sumarray.length ==500)
                        {  
                            res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});
                        }
                        else
                        {
                            if(config.sumarray.length != 100)
                            {
                                res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});
                            }
                            else
                            {
                                res.json({success: true, data:JSON.parse(body.body),searchquery,addinfo:config.addinfo});
                            }
                        }
                    }

            })
        }
    },
    // collectSearch2: function(req,res)
    // {
    //      var since_id = req.body.query.since_id;

    //     console.log(since_id)
    //     var searchquery = req.body.query.hashtag;
    //     var encsearchquery = encodeURIComponent(searchquery);
    //     var bearerheader = 'Bearer ' + config.bearertoken;

    //         var max_id = req.body.query.max_id
    //         request.get('https://api.twitter.com/1.1/search/tweets.json?q=%EB%B8%94%EB%9E%99%EB%B2%A0%EB%A6%AC&count=5&include_entities=1&result_type=recent&max_id='+since_id, {headers: {Authorization: bearerheader}}, function(error, body, response) {
    //             if(error)
    //             console.log(error);
    //             else {
    //                 //  console.log(JSON.parse(body.body))
    //                 console.log(JSON.parse(body.body).search_metadata.max_id)
    //                 console.log(JSON.parse(body.body))
    //                 res.json({success: true, data:JSON.parse(body.body),searchquery});
                    
    //             }
    //         })
    // },
    user: function(req, res){
        var searchquery = req.body.screenname;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + encsearchquery + '&count=2', {headers: {Authorization: bearerheader}}, function(error, body, response) {
             if(error)
             console.log(error);
             else {
                 res.json({success: true, data:JSON.parse(body.body)});
             }
         })
    }

}


module.exports = functions;