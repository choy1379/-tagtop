var request = require('request');
var config = require('./config');

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
        var result= "";
        var searchquery = req.body.query;
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
         '&result_type=recent&count=20&include_entities=true&filter:media', {headers: {Authorization: bearerheader}}, function(error, body, response) {
             if(error)
             console.log(error);
             else {
             
                res.json({success: true, data:JSON.parse(body.body)});
                
             }
         })
      
        
    },
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
    // youtubesearch : function(req,res)
    // {
    //        var searchquery = 'req.body.query';
    //       const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
    //     const API_TOKEN = 'AIzaSyB2QPeJGn6xo9rrjjzZrk9OT33aO-Ubzxo';

    //     request.get(`${BASE_URL}?q=${searchquery}&part=snippet&key=${API_TOKEN}`, function(error, body, response) {
    //          if(error)
    //          console.log(error);
    //          else {
    //              res.json({success: true, Youtubedata:JSON.parse(body.body)});
    //          }
    //      })
    // }
    

}


module.exports = functions;