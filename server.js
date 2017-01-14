
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var cors = require('cors');
var functions = require('./functions');
var dbsearch = require('./dbsearch');
var app = express();
var cluster = require('cluster');
var Scheduler = require('nschedule');
var config = require('./config');
var async = require('async');

var cheerio = require('cheerio');



if (cluster.isMaster) {


  
    var cpuCount = require('os').cpus().length;

   
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

        var scheduler = new Scheduler(1);


            scheduler.add(8000, function(done,res){

                //2017-01-08  임시 주석
                // dbsearch.deleteAll()
                // dbsearch.scheduleHash()  
                
                // setTimeout(function() {
                //     for(var i = 0; i < config.schedule.hashtag.length; i++)
                //     {
                //         functions.scheduleinstagram(i)
                //     }
                // }, 3000);

                // setTimeout(function() {
                //     for(var i = 0; i < config.schedule.hashtag.length; i++)
                //     {
                //         functions.scheduletwitter(i)
                //     }
                // }, 3000);
                
            //  done();     
        });


      


}
else
{
    
        app.use(bodyParser.json({limit: '50mb'}));
        // app.use(bodyParser.urlencoded({extended: true,parameterLimit: 10000,limit: 1024 * 1024 * 10}));
        app.use(bodyParser.urlencoded({
                extended: true,
            parameterLimit: 10000,
            limit: 1024 * 1024 * 10
        }));
        app.use(cors());

        app.post('/authorize', functions.authorize);
        app.post('/search', functions.search);
        app.post('/user', functions.user);
        app.post('/collectSearch', functions.collectSearch);
        app.post('/collectSearchHttp', functions.Schedulesearch);
        app.post('/dbinsert',dbsearch.hashtagins);  //hashtag result insert
        app.post('/dbUserinsert',dbsearch.Userinsert);  //hashtag result insert
        app.post('/dbsearch',dbsearch.getAllCollect);
        app.post('/searchid',dbsearch.searchid);
        app.use(express.static(__dirname + "/app"));
        // app.use(express.static(__dirname));
        app.listen(process.env.PORT || 4100);
        console.log("Server up on port 4100");
        console.log('Worker %d running!', cluster.worker.id);

}

            // 트위터 api 이용
            // 2016-11-12 500개 서치
            // dbsearch.scheduleHash();   
            // functions.scheduleauthorize();

            // setTimeout(function() {
            
                        // async.waterfall([
                        //                     function(callback){
                        //                     console.log("since_id")
                        //                     functions.user()
                        //                     // for(var i = 0 ; i< 2; i++) //수정해야됨
                        //                     // {
                        //                     //     functions.Schedulesearch(i);//0번째 since_id 가져오기                                            
                        //                     // }
                        //                     // setTimeout(function() {
                        //                     //     callback(null,config.schedule.since_id)
                        //                     // }, 3000);
                                            
                                             
                        //                     },
                        //                     function(scheduleId,callback){                                                                                                                                                                                                               
                        //                          console.log("next_result 1")
                        //                          console.log(scheduleId)
                        //                         functions.ScheduleFeatch(scheduleId);
                        //                           setTimeout(function() {
                        //                         callback(null,config.schedule.since_id)
                        //                     }, 3000);
                        //                     },
                        //                     function(scheduleId,callback){
                        //                          console.log("next_result 2")
                        //                          console.log(scheduleId)
                        //                          functions.ScheduleFeatch(scheduleId);
                        //                         setTimeout(function() {
                        //                         callback(null,config.schedule.since_id)
                        //                     }, 3000);
                        //                     }
                        //                     ,
                        //                     function(scheduleId,callback){
                        //                          console.log("next_result 3")
                        //                          console.log(scheduleId)
                        //                          functions.ScheduleFeatch(scheduleId);
                        //                         setTimeout(function() {
                        //                         callback(null,config.schedule.since_id)
                        //                     }, 3000);
                        //                     }
                        //                     ,
                        //                     function(scheduleId,callback){
                        //                          console.log("next_result 4")
                        //                          console.log(scheduleId)
                        //                          functions.ScheduleFeatch(scheduleId);
                        //                         setTimeout(function() {
                        //                         callback(null,config.schedule.since_id)
                        //                     }, 3000);
                        //                     }
                        //                      ,
                        //                     function(scheduleId,callback){
                        //                          console.log("next_result 5")
                        //                          console.log(scheduleId)
                        //                          //next_result 없을때 값처리해야됨
                        //                          functions.ScheduleFeatch(scheduleId);
                        //                         setTimeout(function() {
                        //                         callback(null,config.schedule.since_id)
                        //                     }, 3000);
                        //                     }
                                           
                        //                     ]
                        //                 );

            //     console.log('종료')
            // }, 3000); 

            // done();

    