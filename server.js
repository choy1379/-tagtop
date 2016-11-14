
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
            console.log('진입')  
            var url = 'https://twitter.com/search?f=tweets&vertical=default&q=%23%EC%95%84%EC%9D%B4%ED%8F%B0&src=typd';
      
            var Spooky = require('spooky');

            var spooky = new Spooky({
                    // child: {
                    //     transport: 'http'
                    // },
                    casper: {
                        logLevel: 'debug',
                        verbose: true
                    }
                }, function (err) {
                    if (err) {
                        e = new Error('Failed to initialize SpookyJS');
                        e.details = err;
                        throw e;
                    }
                spooky.options.viewportSize = {width:1024,height:768}

                spooky.start(url);

                spooky.then(function(){
                    this.capture('twitter'+new Date()+'.jpg');
                });
                spooky.then(function(){
                    var latestComment = function(){
                            // return document.querySelectorAll('#stream-items-id li').innerText; //첫번째값 가져오는듯..
                            return document.querySelector('#stream-items-id li').innerText; //첫번째값 가져오는듯..
                         };
                  
                    this.emit('logs',this.evaluate(latestComment))
                });
       
              
                // spooky.waitFor(function check() {
                //     return this.evaluate(function() {
                //     return document.querySelectorAll('.customer-ratings').length > 0;
                //     });
                // }, function then() {

                //     var result = this.evaluate(function(toto) {
                //         var ratingsElt = document.getElementsByClassName('customer-ratings')[0];
                //         //var currentVersionRating = ratingsElt.getElementsByClassName('rating')[0].getAttribute('aria-label').charAt(0);

                //         var allVersionRating = ratingsElt.getElementsByClassName('rating')[1].getAttribute('aria-label').charAt(0);
                //         var allVersionCount = ratingsElt.getElementsByClassName('rating-count')[1].textContent;

                //         var regexpOnlyNumbers = new RegExp("[0-9]+","g");
                //         var resultCount = allVersionCount.match(regexpOnlyNumbers)[0];
                //         var result = {};
                //         result.allVersionRating = allVersionRating;
                //         result.resultCount = resultCount;

                //                 return result;
                
                // });
                // this.emit('display', 'star rating: '+result.allVersionRating);
                // this.emit('display', 'star rating count: '+result.resultCount);

                
                
                // }, function timeout() { // step to execute if check has failed
                //     this.echo("Sorry, it took to much time to fetch the rating, try later or check if the url is correct.").exit();
                // });

                    spooky.run();
                
                
                });


            spooky.on('error', function (e, stack) {
                console.error(e);

                if (stack) {
                    console.log(stack);
                }
            });

            spooky.on('display', function (text) {
                console.log(text);
            });

            spooky.on('log', function (log) {
                if (log.space === 'remote') {
                    console.log(log.message.replace(/ \- .*/, ''));
                }
            });

             spooky.on('logs', function (logs) {
                                console.log(logs);
                            });

            // 트위터 api 이용
            // 2016-11-12 500개 서치
            // dbsearch.scheduleHash();   
            // functions.scheduleauthorize();

            // setTimeout(function() {
            
            //             async.waterfall([
            //                                 function(callback){
            //                                 console.log("since_id")
            //                                 functions.user()
            //                                 // for(var i = 0 ; i< 2; i++) //수정해야됨
            //                                 // {
            //                                 //     functions.Schedulesearch(i);//0번째 since_id 가져오기                                            
            //                                 // }
            //                                 // setTimeout(function() {
            //                                 //     callback(null,config.schedule.since_id)
            //                                 // }, 3000);
                                            
                                             
            //                                 },
            //                                 function(scheduleId,callback){                                                                                                                                                                                                               
            //                                      console.log("next_result 1")
            //                                      console.log(scheduleId)
            //                                     functions.ScheduleFeatch(scheduleId);
            //                                       setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 },
            //                                 function(scheduleId,callback){
            //                                      console.log("next_result 2")
            //                                      console.log(scheduleId)
            //                                      functions.ScheduleFeatch(scheduleId);
            //                                     setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 }
            //                                 ,
            //                                 function(scheduleId,callback){
            //                                      console.log("next_result 3")
            //                                      console.log(scheduleId)
            //                                      functions.ScheduleFeatch(scheduleId);
            //                                     setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 }
            //                                 ,
            //                                 function(scheduleId,callback){
            //                                      console.log("next_result 4")
            //                                      console.log(scheduleId)
            //                                      functions.ScheduleFeatch(scheduleId);
            //                                     setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 }
            //                                  ,
            //                                 function(scheduleId,callback){
            //                                      console.log("next_result 5")
            //                                      console.log(scheduleId)
            //                                      //next_result 없을때 값처리해야됨
            //                                      functions.ScheduleFeatch(scheduleId);
            //                                     setTimeout(function() {
            //                                     callback(null,config.schedule.since_id)
            //                                 }, 3000);
            //                                 }
                                           
            //                                 ]
            //                             );

            //     console.log('종료')
            // }, 3000); 

            done();
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
        app.use(express.static(__dirname));
        app.listen(process.env.PORT || 4100);
        console.log("Server up on port 4100");
        console.log('Worker %d running!', cluster.worker.id);

}

      //     11-13 cheerio 사용안해서 임시 블록 처리 
            //     request(url, function(error, response, body){
            //         if (error) {throw error};


            //        var $ = cheerio.load(body);
           
                
            //         // 11-12 트위터 이름 
            //         $('div.stream-item-header').children('a').children('span').next('span').each(function(i, element){
            //             var namefr = $(this).children('s').eq(0).text();
            //             var nameto = $(this).children('b').eq(0).text();
            //             var name = namefr+nameto;
            //             config.arrcrawTwitter.name[i] = name;
            //         })

            //         // 이미지 순서 수정 필 
            //         $('div.js-tweet-text-container').next('div').children('div').children('div').children('div').children('img').each(function(i, element){
            //             var src = $(this).attr('src')
            //             config.arrcrawTwitter.img[i] = src
            //             // console.log($(this).attr('src'))    //attribs 가져오는거
            //         })      
                  
            //         // 11-12 트위터 내용
            //         $('div.js-tweet-text-container').children('p').each(function(i, element){
            //             var a = $(this).text();
            //             config.arrcrawTwitter.text[i]= a;
            //         })           
               
            //         //끝나는 부분에 object 값 넣어주기
            //         for(var i = 0 ; i < config.arrcrawTwitter.text.length ;  i++)
            //         {
            //             var objcrawlTwitt = new Object()
            //             objcrawlTwitt.name = config.arrcrawTwitter.name[i]
            //             objcrawlTwitt.image = config.arrcrawTwitter.img[i] 
            //             objcrawlTwitt.text = config.arrcrawTwitter.text[i]
            //             config.sumTwitt.push(objcrawlTwitt)

            //         }
            //         // console.log(config.sumTwitt.length)
                  
            //     }  

            // );    