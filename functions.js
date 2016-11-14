var request = require('request');
var config = require('./config');
var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds063406.mlab.com:63406/hashcollect');
var synrequest = require('sync-request');

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
                    if(config.sumarray.length < 100)
                    {
                        res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});
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

                        console.log(config.sumarray.length)

                        if(config.sumarray.length ==500)
                        {  
                            res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});
                        }
                        else
                        {
                            if(config.sumarray.length == 100 || config.sumarray.length == 200 || config.sumarray.length == 300 || config.sumarray.length == 400 || config.sumarray.length == 500)
                            {
                                res.json({success: true, data:JSON.parse(body.body),searchquery,addinfo:config.addinfo});
                            }
                            else if (config.sumarray.length > 100)
                            { 
                                res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});                      
                            }
                            else
                            {
                                res.json({success: true, data:config.sumarray , searchquery,addinfo:config.addinfo});                      
                            }
                        }
                    }

            })
        }
    },
    Schedulesearch : function(count)
    {
        console.log(count)
        if(config.schedule.since_id.length == 0)
        {
             var since_id = 0;
        }
      
        var searchquery = config.schedule.hashtag[count];   //첫번쨰
        console.log(searchquery)
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;

       
         request.get('https://api.twitter.com/1.1/search/tweets.json?q=' + encsearchquery +
            '&result_type=recent&count=100&include_entities=true&since_id=' + since_id, {headers: {Authorization: bearerheader}}, function(error, body, response) {
                if(error)
                console.log()
                else {      
                      switch (count) {
                        case 4    : config.schedule.since_id[0] = JSON.parse(body.body).search_metadata.next_results 
                                    console.log('4번')
                                    console.log(config.schedule.since_id[0])
                                    break;
                        case 3   : config.schedule.since_id[1] = JSON.parse(body.body).search_metadata.next_results
                                   console.log('3번')
                                   console.log(config.schedule.since_id[1])
                                    break;
                        case 2  : config.schedule.since_id[2] = JSON.parse(body.body).search_metadata.next_results
                                    console.log('2번')
                                  console.log(config.schedule.since_id[2])
                                    break;
                        case 1   : config.schedule.since_id[3] = JSON.parse(body.body).search_metadata.next_results
                                    console.log('1번')
                                   console.log(config.schedule.since_id[3])
                                    break;
                        case 0  : config.schedule.since_id[4] = JSON.parse(body.body).search_metadata.next_results
                                     console.log('0번')
                                  console.log(config.schedule.since_id[4])
                                    break
                        default    : console.log('case문 종료');
                                    break;
                        }
                }
            })
       
        
     
    
    },
    user: function(){

         var searchquery = config.schedule.hashtag[0];   //첫번쨰
        var encsearchquery = encodeURIComponent(searchquery);
        var bearerheader = 'Bearer ' + config.bearertoken;
        request.get('https://stream.twitter.com/1.1/statuses/filter.json?track='+encsearchquery, {headers: {Authorization: bearerheader}}, function(error, body, response) {
             if(error)
             console.log(error);
             else {
                 console.log(body.body)
                 console.log(response)
             }
         })
    },
       scheduleauthorize: function() {
        var header = config.consumerkey + ':' +config.consumersecret;
        var encheader = new Buffer(header).toString('base64');
        var finalheader = 'Basic ' + encheader;
        
        request.post('https://api.twitter.com/oauth2/token', {form: {'grant_type': 'client_credentials'}, 
        headers: {Authorization: finalheader}}, function(error, response, body) {
            if(error)
            console.log(error);
            else {
             config.bearertoken = JSON.parse(body).access_token;
             console.log("권한 완료")
            }
            
        })
    },
    ScheduleFeatch : function(scheduleId)
    {  
        console.log('fetch 진입완료')

        for(var k = 3 ; k < scheduleId.length; k++) //2개 5 - 2  수정해야됨
        {

         var bearerheader = 'Bearer ' + config.bearertoken;
       
                 request.get('https://api.twitter.com/1.1/search/tweets.json'+scheduleId[k], {headers: {Authorization: bearerheader}}, function(error, body, response) {
                if(error)
                console.log();
                else {
                    
                            for(var i = 0 ; i < JSON.parse(body.body).statuses.length; i++)
                                {
                                    config.sumarray[config.sumarray.length] = JSON.parse(body.body).statuses[i]
                                    var dt = new Date(Date.parse(config.sumarray[config.sumarray.length].created_at.replace(/( \+)/, ' UTC$1')))                              
                                    // var dt = new Date(Date.parse(config.sumarray[config.sumarray.length-1].created_at.replace(/( \+)/, ' UTC$1')))
                                    var ConvertDt = '' + dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds()  
                                    config.sumarray[config.sumarray.length].created_at = ConvertDt
                                    // config.sumarray[config.sumarray.length-1].created_at = ConvertDt  
                                }
                            for(var i = 0 ; i<scheduleId.length; i++)
                            {   
                                if(scheduleId[i] == undefined)  //차후 수정 어차피 5개 풀되면 지워도됨 if 문 
                                {

                                }
                                else
                                {
                                    if(JSON.stringify(scheduleId[i]).slice(9,27)==JSON.parse(body.body).search_metadata.max_id_str)
                                    {
                                        switch (i) {
                                                    case 0    : config.schedule.since_id[0] = JSON.parse(body.body).search_metadata.next_results 
                                                                console.log('4번')
                                                                console.log(JSON.parse(body.body).search_metadata)
                                                            
                                                                break;
                                                    case 1   : config.schedule.since_id[1] = JSON.parse(body.body).search_metadata.next_results
                                                            console.log('3번')
                                                            console.log(JSON.parse(body.body).search_metadata)
                                                           
                                                                break;
                                                    case 2  : config.schedule.since_id[2] = JSON.parse(body.body).search_metadata.next_results
                                                            console.log('2번')
                                                            console.log(JSON.parse(body.body).search_metadata)
                                                          
                                                                break;
                                                    case 3   : config.schedule.since_id[3] = JSON.parse(body.body).search_metadata.next_results
                                                            console.log('1번')
                                                            console.log(JSON.parse(body.body).statuses[0].text)
                                                            console.log(JSON.parse(body.body).search_metadata)
                                                            
                                                                break;
                                                    case 4  : config.schedule.since_id[4] = JSON.parse(body.body).search_metadata.next_results
                                                            console.log('0번')
                                                            console.log(JSON.parse(body.body).statuses[0].text)
                                                              console.log(JSON.parse(body.body).search_metadata)
                                                           
                                                                break
                                                    default    : console.log('Fetch case문 종료');
                                                                break;
                                                    }
                                    }
                            }
                        }
                                        
                }
            })
  
     
 
        }
    
    }
}


module.exports = functions;