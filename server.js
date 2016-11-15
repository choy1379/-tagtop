
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
                            verbose: false,
                            options: {
                                clientScripts: ['https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js']
                            },
                            viewportSize: {
                                        width: 1440, height: 768
                                    },
                               pageSettings: {
                                webSecurityEnabled: false,  // (http://casperjs.readthedocs.org/en/latest/faq.html#i-m-having-hard-times-downloading-files-using-download)
                                userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.97 Safari/537.11" // Spoof being Chrome on a Mac (https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx)
                            }
                            
                    }
                }, function (err) {
                    if (err) {
                        e = new Error('Failed to initialize SpookyJS');
                        e.details = err;
                        throw e;
                    }

                spooky.start(url);

                var scrolled = 0; // A variable to keep track of how much we have scrolled
                var scrollDelta = null; // Keep track of how much our new scroll position differs from our last
                

                // var getContent = function() {
                //         spooky.wait(1000,function(){                      
                //         this.scrollToBottom(); // scroll to the bottom (http://casperjs.readthedocs.org/en/latest/modules/casper.html#scrolltobottom)
                //         var newScrolled = this.evaluate(function() {
                //             return window.scrollY; // grab how far the window is scrolled (https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollY)
                //         });
                //         if(  window.scrolled  == null)
                //         {
                //             window.scrolled = 0; // and scrolled
                //         }
                //         else
                //         {
                //           window.scrolled = newScrolled; // and scrolled
                //         }
                //          window.scrollDelta = newScrolled - window.scrolled; // update scrollDelta    ;
                       
                //         this.emit('logs',window.scrollDelta)
                //         this.emit('logs',window.scrolled)
                //         // this.capture('twitter'+new Date()+'.jpg');
                //     });
                                    

                //     spooky.then(function() { // After we scroll to the bottom (http://casperjs.readthedocs.org/en/latest/modules/casper.html#then)
                //         this.emit('logs',window.scrollDelta )
                //         if (window.scrollDelta != 0) { // Check whether scrollDelta is zero, which means that we haven't scrolled any further                                 
                //                     getContent(); // If scrollDelta _has_ changed, recursively call getContent
                //              } else {
                //             spooky.then(function() { // Otherwise
                //                 console.log("Saving…");
                //                 var html = String(spooky.getHTML()); // grab our HTML (http://casperjs.readthedocs.org/en/latest/modules/casper.html#gethtml)
                //                 var filename = target.replace(/[^A-z]/g, ''); // create a sanitized filename by removing all the non A-Z characters (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
                //                 require('fs').write(filename + ".html", html, 'w'); // and save it to a file (https://docs.nodejitsu.com/articles/file-system/how-to-write-files-in-nodejs)
                //                 console.log("…wrote HTML to", filename);
                //             });
                //         }
                //     });
                // };
                //     getContent(); // run our recursive function
               
             

                    for(var i = 0; i<20; i++)
                    {
                            spooky.then(function(){
                            this.scrollToBottom();
                            this.wait(1000);
                            // this.emit('logs','1번쨰') 
                            var newScrolleds = this.evaluate(function() {
                                    return window.scrollY;
                                });
                                
                                this.emit('logs',newScrolleds)
                            var newScrolled = this.evaluate(function() {
                                return window.document.body.scrollTop = document.body.scrollHeight;
                                });
                                    this.emit('logs',newScrolled)
                                    
                        });
                        spooky.then(function(){       
                        
                            this.scrollToBottom();
                            this.wait(1000);
                                                    var newScrolleds = this.evaluate(function() {
                                    return window.scrollY;
                                });
                                
                                this.emit('logs',newScrolleds)
                            var newScrolled = this.evaluate(function() {
                                return window.document.body.scrollTop = document.body.scrollHeight;
                                });
                                    this.emit('logs',newScrolled)
                            // this.capture('twitter'+new Date()+'.jpg');
                            
                        });  
                        spooky.then(function(){
                            //현 페이지 유저 id값 가져오기
                            Userid = this.evaluate(function() {
                                                var elements = __utils__.findAll('#stream-items-id li div div div a span.username.js-action-profile-name');
                                                return elements.map(function(e) {
                                                    return e.innerText
                                                });
                                        });
                            value = this.evaluate(function() {
                                });

                            this.emit('logs',Userid)
                       
                   

                            

                        });
                        
                    }
                
                //     spooky.then(function(){

                //     this.scrollToBottom();
                //     var newScrolleds = this.evaluate(function() {
                //           return window.scrollY;
                //     });
                    
                //     this.emit('logs',newScrolleds)
                //    var newScrolled = this.evaluate(function() {
                //     return window.document.body.scrollTop = document.body.scrollHeight;
                //     });
                //         this.emit('logs',newScrolled)
                //         this.wait(5000);
                //         this.capture('twitter'+new Date()+'.jpg');

                //     });
                // spooky.then(function(){
                //     //현 페이지 유저 id값 가져오기
                //     Userid = this.evaluate(function() {
                //                         var elements = __utils__.findAll('#stream-items-id li div div div a span.username.js-action-profile-name');
                //                         return elements.map(function(e) {
                //                             return e.innerText
                //                         });
                //                 });
                //     value = this.evaluate(function() {
                //         });

                //     this.emit('logs',Userid.length)

                // });
              
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

            // done();
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